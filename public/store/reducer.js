module.exports = (state = {
  isConnected: false,
  port: '',
  ip: '',
}, action) => {

  switch(action.type) {
    case 'CASE1': {
      return state;
    }

    default:
      return state;
  }
}