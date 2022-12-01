import {
  goToWorkspace,
  getWorkspaceByName
} from "./external.js"

const Key = await imp("@src/lp/key.js", true)

export const worskpace = (index, {name, workspace}) => {
  async function onClick() {
    await goToWorkspace(workspace)
    this.refresh()
  }

  async function updateData() {
    const space = await getWorkspaceByName(workspace)
    if (space && space.visible) {
      return {
        "background": "green",
        "text": name,
      }
    }
    return {
      "background": "black",
      "text": name,
    }
  }

  return new Key(index, name, {
    updateData,
    onClick,
  })
}

