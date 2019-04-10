export const handleInitialStateGet = () => dispatch => {
  dispatch(
    {
      type: 'HANDLE_INITIAL_STATE_GET',
      beingDispatchedFurther: false
    }
  )
}

export const handleSharedStateUpdate = state => dispatch => {
  dispatch(
    {
      type: 'HANDLE_SHARED_STATE_UPDATE',
      payload: state,
      local: true
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