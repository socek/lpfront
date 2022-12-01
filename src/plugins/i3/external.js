const {
  exec
} = await imp('@src/utils.js')

export const i3Msg = async(command) => {
  return await exec(`i3-msg ${command}`)
}

export const goToWorkspace = async(workspace) => {
  await i3Msg(`workspace ${workspace}`)
}

export const getAllWorkspaces = async() => {
  const {
    stdout,
    stderr
  } = await i3Msg('-t get_workspaces')
  return  JSON.parse(stdout)
}

export const getWorkspaceByName = async(name) => {
  const workspaces = await getAllWorkspaces()
  for(const workspace of workspaces) {
    if(workspace.name === name) {
      return workspace
    }
  }
}
