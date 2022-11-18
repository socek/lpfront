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
  const getText = async function() {
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
  }

  const onClick = async() => {
    const sinks = await getSinkByName(sinkName)
    for (const sink of sinks) {
      await sink.toggleMute()
    }
  }
  const onChange = async(delta) => {
    const sinks = await getSinkByName(sinkName)
    for (const sink of sinks) {
      await sink.setVolume(delta == 1 ? "+5%" : "-5%")
    }
  }
  return new Knob(index, {
    name,
    getText,
    onClick,
    onChange
  })
}

const createMicButton = (index, name, sinkName) => {
  async function onClick() {
    const sinks = await getSinkByName(sinkName)
    for (const sink of sinks) {
      sink.toggleMute()
    }
    await this.updateText()
  }

  async function getText() {
    const sinks = await getSinkByName(sinkName, "Source Output")
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
  }

  return new Key(index, {name, onClick, getText})
}

const firstPage = () => {
  const page = new Page(1)
  page.addKey(new Key(0, {
    name: "Previous",
    onClick: previousSong
  }))
  page.addKey(new Key(1, {
    name: "Play",
    onClick: playPause
  }))
  page.addKey(new Key(2, {
    name: "Next",
    onClick: nextSong
  }))
  page.addKey(new Key(4, {
    name: "Firefox",
    onClick: () => {
      goToWorkspace("w")
    }
  }))
  page.addKey(new Key(5, {
    name: "Chrome",
    onClick: () => {
      goToWorkspace("s")
    }
  }))
  page.addKey(new Key(6, {
    name: "OBS",
    onClick: () => {
      goToWorkspace("c")
    }
  }))
  page.addKey(new Key(7, {
    name: "ST",
    onClick: () => {
      goToWorkspace("q")
    }
  }))
  page.addKey(new Key(8, {
    name: "Spotify",
    onClick: () => {
      goToWorkspace("a")
    }
  }))
  page.addKey(new Key(9, {
    name: "Slack",
    onClick: () => {
      goToWorkspace("e")
    }
  }))

  page.addKey(createMicButton(10, "Chrome\nMic", chromiumSourceName))
  page.addKey(createMicButton(11, "Discord\nMic", discordSourceName))

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
