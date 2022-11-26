const aliases = [
  ["@src", `${process.cwd()}/src`],
  ["@", process.cwd()],
]

global.imp = async(path, isDefault) => {
  isDefault = isDefault || false
  for (const [alias, fullpath] of aliases) {
    path = path.replace(alias, fullpath)
  }
  const mod = await import (path)
  if (isDefault) {
    return mod.default
  }
  return mod
}
