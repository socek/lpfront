global.aimport = async(path) => {
  const cwd = process.cwd()
  const fullpath = `${cwd}${path}`
  return import(fullpath)
}

global.dimport = async(path) => {
  const cwd = process.cwd()
  const fullpath = `${cwd}${path}`
  return (await import(fullpath)).default
}
