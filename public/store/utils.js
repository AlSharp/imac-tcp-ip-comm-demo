const pick = (state, windowStateKeys) => {
  return windowStateKeys
            .map(key => key in state ? {[key]: state[key]} : {})
            .reduce((res, o) => Object.assign(res, o), {});
}

const showMeListeners = (socket, event) => {
  console.log(`${event.toUpperCase()} LISTENERS: ${socket.listeners(event)}`)
}

module.exports = {
  pick,
  showMeListeners
}