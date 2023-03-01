const Plugin = await imp("@src/plugin.js", true)
const {sinkKnob} = await imp("@src/plugins/pulseaudio/knobs.js")
const {microphoneKey, sinkSwitchKey} = await imp("@src/plugins/pulseaudio/keys.js")

export default class PulseAudioPlugin extends Plugin {
  name = "pulseaudio"

  getAvalibleKnobs() {
    return {
      "Sink": sinkKnob
    }
  }
  getAvalibleKeys() {
    return {
      "Microphone": microphoneKey,
      "SinkSwitch": sinkSwitchKey,
    }
  }
}
