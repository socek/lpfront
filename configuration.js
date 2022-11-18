import Page from './src/page.js'
import PageContainer from './src/page_container.js'
import Key from './src/key.js'
import Knob from './src/knob.js'
import {
  previousSong,
  nextSong,
  playPause
} from "./src/spotify.js"
import {
  goToWorkspace
} from "./src/i3.js"
import {
  getSinkByName,
} from "./src/pulseaudio.js"
import {
  mainSinkName,
  chromiumSinkName,
  spotifySinkName,
  firefoxSinkName,
  discordSourceName,
  chromiumSourceName,
} from "./src/settings.js"
const entries = Object.entries

const createSinkKnob = (index, name, sinkName) => {
  return new Knob(index, name, async function() {
    const sinks = await getSinkByName(sinkName)
    const name = `${this.name}\n`
    for (const sink of sinks) {
      if (sink.data.mute) {
        return `${name}(mute)`
      }
      for (const [key, volume] of entries(sink.data.volume)) {
        return `${name}${volume.value_percent}`
      }
    }
    return `${name}(off)`
  }, async() => {
    const sinks = await getSinkByName(sinkName)
    for (const sink of sinks) {
      await sink.toggleMute()
    }
  }, async(delta) => {
    const sinks = await getSinkByName(sinkName)
    for (const sink of sinks) {
      await sink.setVolume(delta == 1 ? "+5%" : "-5%")
    }
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
    const sinks = await getSinkByName(chromiumSourceName)
    for (const sink of sinks) {
      sink.toggleMute()
    }
    await this.updateText()
  }, null, async function() {
    const sinks = await getSinkByName(chromiumSourceName)
    if (sinks.length == 0) {
      this.background = "yellow"
      return `${this.name}\nOff`
    }
    for (const sink of sinks) {
      if (sink.mute) {
        this.background = "red"
        return `${this.name}\nMuted`
      }
    }
    this.background = "green"
    return `${this.name}\nOn`
  }))

  page.addKey(new Key(11, "Discord\nMic", async function() {
    const sinks = await getSinkByName(discordSourceName, "Source Output")
    for (const sink of sinks) {
      sink.toggleMute()
    }
    await this.updateText()
  }, null, async function() {
    const sinks = await getSinkByName(discordSourceName, "Source Output")
    if (sinks.length == 0) {
      this.background = "yellow"
      return `${this.name}\nOff`
    }
    for (const sink of sinks) {
      if (sink.data.mute) {
        this.background = "red"
        return `${this.name}\nMuted`
      }
    }
    this.background = "green"
    return `${this.name}\nOn`
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
export default pageContainer;
