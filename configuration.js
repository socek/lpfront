const {
  PageContainer,
  Page,
  Key,
  Knob
} = require('./src/page.js')
const {
  previousSong,
  nextSong,
  playPause
} = require("./src/spotify.js")
const {
  goToWorkspace
} = require("./src/i3.js")
const {
  getSinkVolume,
  setSinkVolume,
  toggleMute,
  getSinkInputVolume,
  setSinkInputVolume,
  toggleSinkInputMute,
  toggleSourceOutputMute,
  getSourceOutputsVolume,
} = require("./src/pactl.js")
const {
  mainSinkName,
  chromiumSinkName,
  spotifySinkName,
  firefoxSinkName,
  discordSourceName,
  chromiumSourceName,
} = require("./src/settings.js")

const createSinkKnob = (index, name, sinkName) => {
  return new Knob(index, name, async function() {
    const volume = await getSinkVolume(sinkName)
    return this.name + "\n" + volume
  }, async() => {
    await toggleMute(sinkName)
  }, async(delta) => {
    await setSinkVolume(sinkName, delta == 1 ? "+5%" : "-5%")
  })
}

const createSinkInputKnob = (index, name, sinkName) => {
  return new Knob(index, name, async function() {
    const volume = await getSinkInputVolume(sinkName)
    return this.name + "\n" + volume
  }, async() => {
    await toggleSinkInputMute(sinkName)
  }, async(delta) => {
    await setSinkInputVolume(sinkName, delta == 1 ? "+5%" : "-5%")
  })
}

const firstPage = () => {
  const page = new Page(1)
  page.addKey(new Key(0, "Previous", previousSong))
  page.addKey(new Key(1, "Play", playPause))
  page.addKey(new Key(2, "Next", nextSong))
  page.addKey(new Key(4, "Firefox", () => {
    goToWorkspace("w")
  }))
  page.addKey(new Key(5, "Chrome", () => {
    goToWorkspace("s")
  }))
  page.addKey(new Key(6, "OBS", () => {
    goToWorkspace("c")
  }))
  page.addKey(new Key(7, "ST", () => {
    goToWorkspace("q")
  }))
  page.addKey(new Key(8, "Spotify", () => {
    goToWorkspace("a")
  }))
  page.addKey(new Key(9, "Slack", () => {
    goToWorkspace("e")
  }))

  page.addKey(new Key(10, "Chrome\nMic", async function() {
    await toggleSourceOutputMute(chromiumSourceName)
    await this.updateText()
  }, null, async function() {
    const volume = await getSourceOutputsVolume(chromiumSourceName)
    if (["(muted)", "----"].includes(volume)) {
      this.background = "red"
      return `${this.name}\nOff`
    } else {
      this.background = "black"
      return `${this.name}\nOn`
    }
  }))

  page.addKey(new Key(11, "Discord\nMic", async function() {
    await toggleSourceOutputMute(discordSourceName)
    await this.updateText()
  }, null, async function() {
    const volume = await getSourceOutputsVolume(discordSourceName)
    if (["(muted)", "----"].includes(volume)) {
      this.background = "red"
      return `${this.name}\nOff`
    } else {
      this.background = "black"
      return `${this.name}\nOn`
    }
  }))

  page.addKnob(createSinkKnob(0, "Master", mainSinkName))
  page.addKnob(createSinkInputKnob(1, "Spotify", spotifySinkName))
  page.addKnob(createSinkInputKnob(2, "Chrome", chromiumSinkName))
  page.addKnob(createSinkInputKnob(3, "Firefox", firefoxSinkName))
  page.addKnob(createSinkInputKnob(4, "Discord", discordSourceName))

  return page
}

const pageContainer = new PageContainer()
pageContainer.addPage(1, firstPage())

module.exports = pageContainer
