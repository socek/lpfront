const {exec} = await imp('@src/utils.js')

export const previousSong = async () => {
  const cmd = "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Previous"
  try {
    await exec(cmd)
  } catch (er) {
    console.warning("spotify: dbus returned error")
    return;
  }
}

export const nextSong = async () => {
  const cmd = "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Next"
  try {
    await exec(cmd)
  } catch (er) {
    console.warning("spotify: dbus returned error")
    return;
  }
}

export const playPause = async () => {
  const cmd = "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause"
  try {
    await exec(cmd)
  } catch (er) {
    console.warning("spotify: dbus returned error")
    return;
  }
}
