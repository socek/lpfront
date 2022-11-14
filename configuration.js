const { Page, Key, Knob } = require('./src/page.js')
const { previousSong, nextSong, playPause } = require("./src/spotify.js")
const { goToWorkspace } = require("./src/i3.js")
const { getSinkVolume, setSinkVolume, toggleMute, getSinkInputVolume, setSinkInputVolume, toggleSinkInputMute } = require("./src/pactl.js")
const { mainSinkName, chromiumSinkName, spotifySinkName, firefoxSinkName } = require("./src/settings.js")

const firstPage = (device) => {
  const page = new Page(device, 1)
  page.addKey(new Key(0, "Previous", previousSong))
  page.addKey(new Key(1, "Play", playPause))
  page.addKey(new Key(2, "Next", nextSong))
  page.addKey(new Key(4, "Firefox", () => {goToWorkspace("w")}))
  page.addKey(new Key(5, "Chrome", () => {goToWorkspace("s")}))
  page.addKey(new Key(6, "OBS", () => {goToWorkspace("c")}))
  page.addKey(new Key(7, "ST", () => {goToWorkspace("q")}))
  page.addKey(new Key(8, "Spotify", () => {goToWorkspace("a")}))
  page.addKey(new Key(9, "Slack", () => {goToWorkspace("e")}))

  page.addKnob(new Knob(0, "Main", async (that) => {
    const volume = await getSinkVolume(mainSinkName)
    return that.name +"\n"+ volume
  }, async () => {
    await toggleMute(mainSinkName)
  }, async (delta) => {
    await setSinkVolume(mainSinkName, delta == 1 ? "+5%" : "-5%")
  }))
  page.addKnob(new Knob(1, "Spotify", async (that) => {
    const volume = await getSinkInputVolume(spotifySinkName)
    return that.name +"\n"+ volume
  }, async () => {
    await toggleSinkInputMute(spotifySinkName)
  }, async (delta) => {
    await setSinkInputVolume(spotifySinkName, delta == 1 ? "+5%" : "-5%")
  }))
  page.addKnob(new Knob(2, "Chrome", async (that) => {
    const volume = await getSinkInputVolume(chromiumSinkName)
    return that.name +"\n"+ volume
  }, async () => {
    await toggleSinkInputMute(chromiumSinkName)
  }, async (delta) => {
    await setSinkInputVolume(chromiumSinkName, delta == 1 ? "+5%" : "-5%")
  }))

  page.addKnob(new Knob(3, "Firefox", async (that) => {
    const volume = await getSinkInputVolume(firefoxSinkName)
    return that.name +"\n"+ volume
  }, async () => {
    await toggleSinkInputMute(firefoxSinkName)
  }, async (delta) => {
    await setSinkInputVolume(firefoxSinkName, delta == 1 ? "+5%" : "-5%")
  }))


  return page
}

module.exports = {firstPage}
