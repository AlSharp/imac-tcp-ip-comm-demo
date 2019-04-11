module.exports = (state = {
  isConnected: false,
  connectionError: '',
  port: '',
  ip: '',
}, action) => {

  switch(action.type) {
    case 'HANDLE_CONNECTION_CREATE_SUCCEED': {
      return {
        ...state,
        isConnected: true,
        connectionError: '',
        port: action.payload.port,
        ip: action.payload.ip
      };
    }
    
    case 'HANDLE_CONNECTION_CREATE_REJECTED': {
      return {
        ...state,
        isConnected: false,
        connectionError: action.payload.error,
        port: action.payload.port,
        ip: action.payload.ip
      }
    }
    case 'HANDLE_CONNECTION_CLOSE_SUCCEED': {
      return {
        ...state,
        isConnected: false
      }
    }
    case 'HANDLE_CONNECTION_CLOSE_REJECTED': {
      return {
        ...state,
        isConnected: false,
        connectionError: action.payload
      }
    }

    default:
      return state;
  }
}