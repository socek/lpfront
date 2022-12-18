const {exec} = await imp('@src/utils.js')

export const i3Msg = async (command) => {
  try {
    await exec(`i3-msg '${command}'`)
  } catch (error) {
    console.warning("i3: i3-msg returned error")
    return
  }
}

export const goToWorkspace = async (workspace) => {
  await i3Msg(`workspace ${workspace}`)
}

