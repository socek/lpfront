const {
  exec
} = await imp('@src/utils.js')

export const i3Msg = async(command) => {
  try {
    return await exec(`i3-msg ${command}`)
  } catch (error) {
    console.log(`i3: i3-msg returned error: ${error}`)
    return
  }
}

export const goToWorkspace = async(workspace) => {
  await i3Msg(`workspace ${workspace}`)
}

export const getAllWorkspaces = async() => {
  const result = await i3Msg('-t get_workspaces')
  if(result) {
    return JSON.parse(result.stdout)
  }
}

export const getWorkspaceByName = async(name) => {
  const workspaces = await getAllWorkspaces()
  if(workspaces) {
    for (const workspace of workspaces) {
      if (workspace.name === name) {
        return workspace
      }
    }
  }
}
