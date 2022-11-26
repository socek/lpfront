const {exec} = await imp('@src/utils.js')

export const i3Msg = async (command) => {
  await exec(`i3-msg '${command}'`)
}

export const goToWorkspace = async (workspace) => {
  await i3Msg(`workspace ${workspace}`)
}

