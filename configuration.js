const ent = Object.entries
const Page = require('./src/page.js')
const PageContainer = require('./src/page_container.js')
const Key = require('./src/key.js')
const Knob = require('./src/knob.js')
const {
  previousSong,
  nextSong,
  playPause
} = require("./src/spotify.js")
const {
  goToWorkspace
} = require("./src/i3.js")
const {
  getSinkByName,
} = require("./src/pulseaudio.js")
const {
  mainSinkName,
  chromiumSinkName,
  spotifySinkName,
  firefoxSinkName,
  discordSourceName,
  chromiumSourceName,
} = require("./src/settings.js")
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

const createSinkKnob = (index, name, sinkName) => {
  return new Knob(index, name, async function() {
    const sinks = await getSinkByName(sinkName)
    const name = `${this.name}\n`
    for(const sink of sinks) {
      if (sink.data.mute) {
        return `${name}(mute)`
      }
      for(const [key, volume] of ent(sink.data.volume)) {
        return `${name}${volume.value_percent}`
      }
    }
    return `${name}(off)`
  }, async() => {
    const sinks = await getSinkByName(sinkName)
    for(const sink of sinks) {
      await sink.toggleMute()
    }
  }, async(delta) => {
    const sinks = await getSinkByName(sinkName)
    for(const sink of sinks) {
      await sink.setVolume(delta == 1 ? "+5%" : "-5%")
    }
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
  page.addKnob(createSinkKnob(1, "Spotify", spotifySinkName))
  page.addKnob(createSinkKnob(2, "Chrome", chromiumSinkName))
  page.addKnob(createSinkKnob(3, "Firefox", firefoxSinkName))
  page.addKnob(createSinkKnob(4, "Discord", discordSourceName))

  return page
}

const pageContainer = new PageContainer()
pageContainer.addPage(1, firstPage())

module.exports = pageContainer
