const handleTCPConnectionError = error => dispatch => {
  console.log('HANDLE_TCP_CONNECTION_ERROR');
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