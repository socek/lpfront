import util from "util"
import cp from "child_process"

const exec = util.promisify(cp.exec)

export const previousSong = async () => {
  const cmd = "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Previous"
  await exec(cmd)
}

export const nextSong = async () => {
  const cmd = "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Next"
  await exec(cmd)
}

export const playPause = async () => {
  const cmd = "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause"
  await exec(cmd)
}
