const log = require('electron-log');

const pick = (state, windowStateKeys) => {
  return windowStateKeys
            .map(key => key in state ? {[key]: state[key]} : {})
            .reduce((res, o) => Object.assign(res, o), {});
}

const showMeListeners = (socket, event) => {
  log.info(`${event.toUpperCase()} LISTENERS: ${socket.listeners(event)}`)
}

module.exports = {
  pick,
  showMeListeners,
  log
}