export const handleInitialStateGet = () => dispatch => {
  dispatch(
    {
      type: 'HANDLE_INITIAL_STATE_GET',
      beingDispatchedFurther: false
    }
  )
}

export const handleConnectButtonClick = props => dispatch => {
  dispatch(
    {
      type: 'HANDLE_CONNECTION_CREATE',
      payload: props,
      beingDispatchedFurther: true
    }
  )
}