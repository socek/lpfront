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
  mainSinkName,
  chromiumSinkName,
  spotifySinkName,
  firefoxSinkName,
  discordSourceName,
  chromiumSourceName,
} = await imp("@src/settings.js")
const {
  sessionBus,
} = await imp('dbus-next')
const {
  entries
} = await imp('@src/utils.js')

const dbus = sessionBus()

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
      this.background = "grey"
      return {
        "text": `${this.name}\nOff`
      }
    }
    for (const sink of sinks) {
      if (sink.data.mute) {
        this.background = "red"
        return {
          "text": `${this.name}\nMuted`
        }
      }
    }
    this.background = "green"
    return {
      "text": `${this.name}\nOn`
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
      this.background = "green"
      return {
        "text": "Pause"
      }
    } else {
      this.background = "grey"
      return {
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

const pageContainer = new PageContainer()
pageContainer.addPage(1, firstPage())
export default pageContainer;
