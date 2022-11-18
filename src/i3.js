import util from "util"
import cp from "child_process"

const exec = util.promisify(cp.exec)

export const i3Msg = async (command) => {
  await exec(`i3-msg '${command}'`)
}

export const goToWorkspace = async (workspace) => {
  await i3Msg(`workspace ${workspace}`)
}

