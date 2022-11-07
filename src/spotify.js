const util = require('util');
const exec = util.promisify(require('child_process').exec);

const previousSong = async () => {
  const cmd = "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Previous"
  await exec(cmd)
}

const nextSong = async () => {
  const cmd = "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Next"
  await exec(cmd)
}

const playPause = async () => {
  const cmd = "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause"
  await exec(cmd)
}

module.exports = { previousSong, nextSong, playPause }
