const util = require('util');
const exec = util.promisify(require('child_process').exec);

let sinks = null

const getSinks = async () => {
    cmd = `pactl list sinks`
    const { stdout, sterr } = await exec(cmd)
    const sinks = {};
    let lastSink = null;
    let propertyPhase = false;
    for(const line of stdout.split("\n")) {
        if(line.startsWith("Sink #")) {
            lastSink = line.substr(6);
            propertyPhase = false
            sinks[lastSink] = {
                number: lastSink,
                properties: {}
            }
            continue
        }
        if(line.trim() == "Properties:") {
            propertyPhase = true
            continue
        }
        if(propertyPhase === false) {
            if( line.trim().startsWith("Volume:") ) {
              let splitted = line.trim().substr(7).trim().split(",")
              sinks[lastSink]["volumes"] = {}
              for(let volume of splitted) {
                let [key, value] = volume.split(":")
                sinks[lastSink]["volumes"][key.trim()] = value
              }
              continue
            }
            if( line.trim().startsWith("balance") ) {
              sinks[lastSink]["volumes"]["balance"] = line.trim().substr(8)
              continue
            }
            let splitted = line.split(":");
            sinks[lastSink][splitted[0].trim().toLowerCase()] = splitted[1] ? splitted[1].trim() : splitted[1]
            continue
        }
        let splitted = line.split("=")
        sinks[lastSink]["properties"][splitted[0].trim()] = splitted[1]
    }
    return sinks;
}


const getSinkNumber = (name) => {
  for(const [sinkNumber, sink] of Object.entries(sinks)) {
    if(sink.name == name) {
      return sinkNumber
    }
  }
}

const getSinkVolume = (name) => {
  const sink = sinks[getSinkNumber(name)]
  if(sink.mute == 'yes') {
    return "----"
  }
  const regEx = / ([0-9]+)% /i
  return sink.volumes["front-left"].match(regEx)[1]
}

const setSinkVolume = async (name, volume) => {
  const sinkNumber = getSinkNumber(name)
  cmd = `pactl set-sink-volume ${sinkNumber} ${volume}`
  await exec(cmd)
  sinks = await getSinks()
}

const toggleMute = async (name) => {
  const sinkNumber = getSinkNumber(name)
  const cmd = `pactl set-sink-mute ${sinkNumber} toggle`
  await exec(cmd)
  sinks = await getSinks()
}

const init = async () => {
  sinks = await getSinks()
}

module.exports = { init, getSinkVolume, setSinkVolume, toggleMute }
