const {
  indexOf
} = await imp('lodash', true)
const {
  exec,
  entries
} = await imp('@src/utils.js')

const cardNameRe = /^card (\d+): \w+ \[(.*)\],.*$/

//Front Left: Playback 146 [100%] [-9.00dB] [on] Capture 57 [100%] [9.00dB] [on]
const volumeRe = /\s+(\w+ \w+): Playback [0-9]+ \[([0-9]+)%\] \[-?[.0-9a-zA-Z]+\] \[(\w+)\]/


const cardsList = async() => {
  let stdout
  try {
    const result = await exec("aplay -l")
    stdout = result.stdout
  } catch (er) {
    console.log("aplay: returned error", er)
    return {}
  }
  const result = {};
  for (const line of stdout.split("\n")) {
    if (line.indexOf("card") != -1) {
      const matched = line.match(cardNameRe)
      const cardIndex = matched[1]
      const cardName = matched[2]
      if (result[cardName] && result[cardName] != cardIndex) {
        throw `${cardName} already have index`
      }
      result[cardName] = cardIndex
    }
  }
  return result
}

const getCardIndexByName = async(name) => {
  const cards = await cardsList()
  const cardIndex = cards[name]
  if (cardIndex === undefined) {
    throw 'card ${name} not found'
  }
  return cardIndex
}

export const getVolumes = async(cardName, ctrlName) => {
  let cardIndex
  try {
    cardIndex = await getCardIndexByName(cardName)
  } catch (er) {
    return {}
  }

  let stdout
  try {
    const result = await exec(`amixer -c ${cardIndex} get '${ctrlName}' -M`)
    stdout = result.stdout
  } catch (er) {
    console.log("amixer: returned error", er)
    return {}
  }

  const volumes = {}
  for (const line of stdout.split("\n")) {
    const matched = line.match(volumeRe)
    if (matched) {
      volumes[matched[1]] = {
        volume: matched[2],
        state: matched[3],
      }
    }
  }
  return volumes
}

export const toggleMute = async(cardName, ctrlName) => {
  let cardIndex
  try {
    cardIndex = await getCardIndexByName(cardName)
  } catch (er) {
    return
  }

  try {
    await exec(`amixer -c ${cardIndex} set '${ctrlName}' toggle -M`)
  } catch (er) {
    console.log("amixer: returned error", er)
  }
}

export const setVolume = async(cardName, ctrlName, volume) => {
  let cardIndex
  try {
    cardIndex = await getCardIndexByName(cardName)
  } catch (er) {
    return
  }

  try {
    await exec(`amixer -c ${cardIndex} set '${ctrlName}' ${volume} -M`)
  } catch (er) {
    console.log("amixer: returned error", er)
  }
}
