const util = require('util');
const exec = util.promisify(require('child_process').exec);

const i3Msg = async (command) => {
  await exec(`i3-msg '${command}'`)
}

const goToWorkspace = async (workspace) => {
  await i3Msg(`workspace ${workspace}`)
}

module.exports = {
  goToWorkspace,
}
