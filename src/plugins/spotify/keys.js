const Key = await imp("@src/lp/key.js", true)
const {
  sessionBus,
} = await imp('dbus-next')
import {
  previousSong,
  nextSong,
  playPause
} from "./spotify.js"

const dbus = sessionBus()

export const playPauseToggle = (index) => {
  async function updateData() {
    try {
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
          "background": "black",
          "text": "Play"
        }
      }
    } catch(error) {
      return {
        "background": "grey",
        "text": "(off)"
      }
    }
  }
  return new Key(index, "Play/Pause", {
    updateData,
    onClick: playPause,
  })
}

export const previousSongKey = (index, {
  name
}) => {
  async function updateData() {
    try {
      const proxy = await dbus.getProxyObject('org.mpris.MediaPlayer2.spotify', '/org/mpris/MediaPlayer2');
      const player = proxy.getInterface('org.freedesktop.DBus.Properties')
      const properties = await player.Get("org.mpris.MediaPlayer2.Player", "PlaybackStatus")
      return {
        "background": "black",
        "text": this.name
      }
    } catch(error) {
      return {
        "background": "grey",
        "text": "(off)"
      }
    }
  }
  return new Key(index, name, {
    updateData,
    onClick: previousSong
  })
}

export const nextSongKey = (index, {
  name
}) => {
  async function updateData() {
    try {
      const proxy = await dbus.getProxyObject('org.mpris.MediaPlayer2.spotify', '/org/mpris/MediaPlayer2');
      const player = proxy.getInterface('org.freedesktop.DBus.Properties')
      const properties = await player.Get("org.mpris.MediaPlayer2.Player", "PlaybackStatus")
      return {
        "background": "black",
        "text": this.name
      }
    } catch(error) {
      return {
        "background": "grey",
        "text": "(off)"
      }
    }
  }
  return new Key(index, name, {
    updateData,
    onClick: nextSong
  })
}
