const { LoupedeckDevice } = require('loupedeck')
const device = new LoupedeckDevice({autoConnect: false})
const cacheInvalidationTime = 1000 // in miliseconds

module.exports = {device}
