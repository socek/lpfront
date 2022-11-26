import util from "util"
import cp from "child_process"

export const exec = util.promisify(cp.exec)
export const entries = Object.entries
