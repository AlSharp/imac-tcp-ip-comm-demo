const pick = (state, windowStateKeys) => {
  return windowStateKeys
            .map(key => key in state ? {[key]: state[key]} : {})
            .reduce((res, o) => Object.assign(res, o), {});
}

module.exports = {
  pick
}