const Plugin = await imp("@src/plugin.js", true)
const {
  playPauseToggle,
  previousSongKey,
  nextSongKey
} = await imp("@src/plugins/spotify/keys.js")

export default class SpotifyPlugin extends Plugin {
  name = "spotify"

  getAvalibleKeys() {
    return {
      "Previous Song": previousSongKey,
      "Play Pause Toggle": playPauseToggle,
      "Next Song": nextSongKey
    }
  }
}
