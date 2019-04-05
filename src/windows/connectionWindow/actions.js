export const handleInitialStateGet = () => dispatch => {
  dispatch(
    {
      type: 'HANDLE_INITIAL_STATE_GET'
    }
  )
}

export const handleConnectButtonClick = props => dispatch => {
  dispatch(
    {
      type: 'HANDLE_CONNECT_BUTTON_CLICK',
      payload: props
    }
  )
}