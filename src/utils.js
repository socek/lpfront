import util from "util"
import cp from "child_process"
import fs from "node:fs"
import ps from "ps-node"

export const exec = util.promisify(cp.exec)
export const access = util.promisify(fs.access)
export const entries = Object.entries
export const psLookup = util.promisify(ps.lookup)
