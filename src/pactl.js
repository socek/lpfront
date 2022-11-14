const util = require('util');
const exec = util.promisify(require('child_process').exec);

const getSinks = async () => {
  const {stdout, stderr} = await exec("pactl -f json list sinks")
    const result = JSON.parse(stdout)
    return result
}

const getSinkInputs = async () => {
  const {stdout, stderr} = await exec("pactl -f json list sink-inputs")
  return JSON.parse(stdout)
}


const getSinkByName = async (name) => {
  for(const sink of await getSinks()) {
    if(sink.name == name) {
      return sink
    }
  }
}

const getSinkInputsByAppName = async (name) => {
  const sinks = []
  const result = await getSinkInputs()
  for(const sink of result){
    if(sink.properties["application.name"] == name) {
      sinks.push(sink)
    }
  }
  return sinks
}

const getSinkVolume = async (name) => {
  const sink = await getSinkByName(name)
  if(!sink || sink.mute) return "----"
  return sink.volume["front-left"]["value_percent"]
}

const getSinkInputVolume = async (name) => {
  const sink = (await getSinkInputsByAppName(name))[0]
  if(!sink || sink.mute) return "----"
  return sink.volume["front-left"]["value_percent"]
}

const setSinkVolume = async (name, volume) => {
  const sink = await getSinkByName(name)
  cmd = `pactl set-sink-volume ${sink.index} ${volume}`
  await exec(cmd)
}

const setSinkInputVolume = async (name, volume) => {
  const sinks = await getSinkInputsByAppName(name)
  for( const sink of sinks ) {
    cmd = `pactl set-sink-input-volume ${sink.index} ${volume}`
    await exec(cmd)
  }
}

const toggleMute = async (name) => {
  const sink = await getSinkByName(name)
  const cmd = `pactl set-sink-mute ${sink.index} toggle`
  await exec(cmd)
}

const toggleSinkInputMute = async (name, volume) => {
  const sinks = await getSinkInputsByAppName(name)
  for( const sink of sinks ) {
    cmd = `pactl set-sink-input-mute ${sink.index} toggle`
    await exec(cmd)
  }
}

module.exports = { getSinkVolume, setSinkVolume, toggleMute, getSinkInputVolume, setSinkInputVolume, toggleSinkInputMute }
