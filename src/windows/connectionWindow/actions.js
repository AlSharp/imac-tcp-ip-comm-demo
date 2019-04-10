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

export const handleDisconnectButtonClick = () => dispatch => {
  dispatch(
    {
      type: 'HANDLE_CONNECTION_CLOSE',
      beingDispatchedFurther: true

    }
  )
}

export const handleIPChange = event => dispatch => {
  dispatch(
    {
      type: 'HANDLE_IP_CHANGE',
      payload: event.target.value,
      local: true
    }
  )
}

export const handlePortChange = event => dispatch => {
  dispatch(
    {
      type: 'HANDLE_PORT_CHANGE',
      payload: event.target.value,
      local: true
    }
  )
}