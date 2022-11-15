const { PageContainer, Page, Key, Knob } = require('./src/page.js')
const { previousSong, nextSong, playPause } = require("./src/spotify.js")
const { goToWorkspace } = require("./src/i3.js")
const { getSinkVolume, setSinkVolume, toggleMute, getSinkInputVolume, setSinkInputVolume, toggleSinkInputMute } = require("./src/pactl.js")
const { mainSinkName, chromiumSinkName, spotifySinkName, firefoxSinkName } = require("./src/settings.js")

const mainVolumeKnob = (index) => {
  const getName = async function() {
    const volume = await getSinkVolume(mainSinkName)
    return this.name +"\n"+ volume
  }
  const onMute = async () => {
    await toggleMute(mainSinkName)
  }
  const onChange = async (delta) => {
    await setSinkVolume(mainSinkName, delta == 1 ? "+5%" : "-5%")
  }
  return new Knob(index, "Main", getName, onMute, onChange)
}

const firstPage = () => {
  const page = new Page(1)
  page.addKey(new Key(0, "Previous", previousSong))
  page.addKey(new Key(1, "Play", playPause))
  page.addKey(new Key(2, "Next", nextSong))
  page.addKey(new Key(4, "Firefox", () => {goToWorkspace("w")}))
  page.addKey(new Key(5, "Chrome", () => {goToWorkspace("s")}))
  page.addKey(new Key(6, "OBS", () => {goToWorkspace("c")}))
  page.addKey(new Key(7, "ST", () => {goToWorkspace("q")}))
  page.addKey(new Key(8, "Spotify", () => {goToWorkspace("a")}))
  page.addKey(new Key(9, "Slack", () => {goToWorkspace("e")}))

  page.addKnob(mainVolumeKnob(0))
  page.addKnob(new Knob(1, "Spotify", async function() {
    const volume = await getSinkInputVolume(spotifySinkName)
    return this.name +"\n"+ volume
  }, async () => {
    await toggleSinkInputMute(spotifySinkName)
  }, async (delta) => {
    await setSinkInputVolume(spotifySinkName, delta == 1 ? "+5%" : "-5%")
  }))
  page.addKnob(new Knob(2, "Chrome", async function() {
    const volume = await getSinkInputVolume(chromiumSinkName)
    return this.name +"\n"+ volume
  }, async () => {
    await toggleSinkInputMute(chromiumSinkName)
  }, async (delta) => {
    await setSinkInputVolume(chromiumSinkName, delta == 1 ? "+5%" : "-5%")
  }))

  page.addKnob(new Knob(3, "Firefox", async function(knob) {
    const volume = await getSinkInputVolume(firefoxSinkName)
    return this.name +"\n"+ volume
  }, async () => {
    await toggleSinkInputMute(firefoxSinkName)
  }, async (delta) => {
    await setSinkInputVolume(firefoxSinkName, delta == 1 ? "+5%" : "-5%")
  }))

  return page
}

const secondPage = () => {
  const page = new Page(2)
  page.addKnob(mainVolumeKnob(1))

  return page
}

const pageContainer = new PageContainer()
pageContainer.addPage(1, firstPage())
pageContainer.addPage(2, secondPage())

module.exports = pageContainer
