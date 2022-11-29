const Page = await imp("@src/lp/page.js", true)
const PageContainer = await imp("@src/lp/page_container.js", true)
const Key = await imp("@src/lp/key.js", true)
const Knob = await imp("@src/lp/knob.js", true)
const {
  previousSong,
  nextSong,
  playPause
} = await imp("@src/externals/spotify.js")
const {
  goToWorkspace
} = await imp("@src/externals/i3.js")
const {
  getSinkByName,
} = await imp("@src/externals/pulseaudio.js")
const {
  sessionBus,
} = await imp('dbus-next')
const {
  entries
} = await imp('@src/utils.js')
const {
  OBSDriver,
} = await imp("@src/externals/obs.js")
const {
  STATES
} = await imp("@/const.js")

const mainSinkName = "Sound BlasterX G6 Digital Stereo (IEC958)"
const chromiumSinkName = "Chromium"
const spotifySinkName = "Spotify"
const firefoxSinkName = "Simultaneous output to Sound BlasterX G6 Digital Stereo (IEC958)"
const discordSourceName = "WEBRTC VoiceEngine"
const chromiumSourceName = "Chromium input"

const dbus = sessionBus()
const obs = new OBSDriver()

const createSinkKnob = (index, name, sinkName, typename) => {
  async function updateData() {
    const sinks = await getSinkByName(sinkName, typename)
    const name = `${this.name}\n`
    for (const sink of sinks) {
      if (sink.data.mute) {
        return {
          "text": `${name}(mute)`
        }
      }
      for (const [key, volume] of entries(sink.data.volume)) {
        return {
          "text": `${name}${volume.value_percent}`
        }
      }
    }
    return {
      "text": `${name}(off)`
    }
  }

  async function onClick() {
    const sinks = await getSinkByName(sinkName, typename)
    for (const sink of sinks) {
      await sink.toggleMute()
    }
  }
  async function onChange(delta) {
    const sinks = await getSinkByName(sinkName, typename)
    for (const sink of sinks) {
      await sink.setVolume(delta == 1 ? "+5%" : "-5%")
    }
  }
  return new Knob(index, name, {
    updateData,
    onClick,
    onChange
  })
}

const createMicButton = (index, name, sinkName) => {
  async function onClick() {
    const sinks = await getSinkByName(sinkName, "Source Output")
    for (const sink of sinks) {
      sink.toggleMute()
    }
    this.refresh()
  }

  async function updateData() {
    const sinks = await getSinkByName(sinkName, "Source Output")
    if (sinks.length == 0) {
      return {
        "background": "grey",
        "text": `${this.name}\nOff`
      }
    }
    for (const sink of sinks) {
      if (sink.data.mute) {
        return {
          "background": "red",
          "text": `${this.name}\nMuted`
        }
      }
    }
    return {
      "background": "green",
      "text": `${this.name}\nOn`
    }
  }

  return new Key(index, name, {
    updateData,
    onClick,
  })
}

const createObsSceneButton = (index, name, sceneName) => {
  async function onClick() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      try {
        await obs.setCurrentProgramScene(sceneName)
      } catch (er) {
        return
      }
      this.refresh()
    }
  }

  async function updateData() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      let currentScene = null
      try {
        currentScene = await obs.getCurrentProgramScene()
      } catch (er) {
        return {
          "text": `${this.name}`,
          "background": "grey",
        }
      }
      const background = currentScene == sceneName ? 'green' : 'black'
      return {
        "text": `${this.name}`,
        background
      }
    }

    return {
      "text": `${this.name}`,
      "background": "grey",
    }
  }

  return new Key(index, name, {
    updateData,
    onClick,
  })
}

const createObsSourceButton = (index, name, sourceName) => {
  async function onClick() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      try {
        await obs.setSourceEnabled(sourceName, this.data ? !this.data.isActive : false)
      } catch (er) {
        return
      }
      this.refresh()
    }
  }

  async function updateData() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      let isActive = null
      try {
        isActive = (await obs.getSourceEnabled(sourceName))
      } catch (er) {
        return {
          "text": `${this.name}`,
          "background": "grey",
          "isActive": false,
        }
      }
      const background = isActive ? 'green' : 'black'
      return {
        "isActive": isActive,
        "text": `${this.name}`,
        background
      }
    }

    return {
      "text": `${this.name}`,
      "background": "grey",
      "isActive": false,
    }
  }

  return new Key(index, name, {
    updateData,
    onClick,
  })
}

const playPauseButton = (index) => {
  const name = 'Play/Pause'
  async function updateData() {
    const proxy = await dbus.getProxyObject('org.mpris.MediaPlayer2.spotify', '/org/mpris/MediaPlayer2');
    const player = proxy.getInterface('org.freedesktop.DBus.Properties')
    const properties = await player.Get("org.mpris.MediaPlayer2.Player", "PlaybackStatus")
    if (properties.value === "Playing") {
      return {
        "background": "green",
        "text": "Pause"
      }
    } else {
      return {
        "background": "grey",
        "text": "Play"
      }
    }
  }
  return new Key(index, name, {
    updateData,
    onClick: playPause,
  })
}

const firstPage = () => {
  const page = new Page(1)
  page.addKey(new Key(0, "Previous", {
    onClick: previousSong
  }))
  page.addKey(playPauseButton(1))
  page.addKey(new Key(2, "Next", {
    onClick: nextSong
  }))
  page.addKey(new Key(4, "Firefox", {
    onClick: () => goToWorkspace("w"),
  }))
  page.addKey(new Key(5, "Chrome", {
    onClick: () => goToWorkspace("s")
  }))
  page.addKey(new Key(6, "OBS", {
    onClick: () => goToWorkspace("c")
  }))
  page.addKey(new Key(7, "ST", {
    onClick: () => goToWorkspace("q"),
  }))
  page.addKey(new Key(8, "Spotify", {
    onClick: () => goToWorkspace("a"),
  }))
  page.addKey(new Key(9, "Slack", {
    onClick: () => goToWorkspace("e"),
  }))

  page.addKey(createMicButton(10, "Chrome\nMic", chromiumSourceName))
  page.addKey(createMicButton(11, "Discord\nMic", discordSourceName))

  page.addKnob(createSinkKnob(0, "Master", mainSinkName))
  page.addKnob(createSinkKnob(1, "Spotify", spotifySinkName))
  page.addKnob(createSinkKnob(2, "Chrome", chromiumSinkName))
  page.addKnob(createSinkKnob(3, "Firefox", firefoxSinkName))
  page.addKnob(createSinkKnob(4, "Discord", discordSourceName, "Sink Input"))

  return page
}

const secondPage = () => {
  const page = new Page(2)
  page.addKey(createObsSceneButton(0, "Mój Ryj", "Mój Ryj"))
  page.addKey(createObsSceneButton(1, "Lewy", "Pulpit Lewy"))
  page.addKey(createObsSceneButton(2, "Środkowy", "Pulpit Środek"))
  page.addKey(createObsSceneButton(3, "Prawy", "Pulpit Prawy"))
  page.addKey(createObsSceneButton(4, "zw", "I'll be back"))
  page.addKey(createObsSceneButton(5, "Gra", "Gra"))
  page.addKey(createObsSourceButton(8, "Kamera", "Kamera"))

  return page
}

const pageContainer = new PageContainer()
pageContainer.addPage(1, firstPage())
pageContainer.addPage(2, secondPage())
export default pageContainer;
