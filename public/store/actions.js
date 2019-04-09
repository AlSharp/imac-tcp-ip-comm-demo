const handleTCPConnectionError = error => dispatch => {
  dispatch(
    {
      type: 'HANDLE_TCP_CONNECTION_ERROR',
      payload: error
    }
  )
}


module.exports = {
  handleTCPConnectionError
}