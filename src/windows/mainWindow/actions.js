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

export const handleMotorEnable = event => dispatch => {
  dispatch(
    {
      type: 'HANDLE_MOTOR_ENABLE',
      payload: event.target.checked,
      beingDispatchedFurther: true
    }
  )
}

export const handleJogActivate = event => dispatch => {
  dispatch(
    {
      type: 'HANDLE_JOG_ACTIVATE',
      payload: event.target.checked,
      beingDispatchedFurther: true
    }
  )
}

export const handleASCIICommandChange = event => dispatch => {
  dispatch(
    {
      type: 'HANDLE_ASCII_COMMAND_CHANGE',
      payload: event.target.value,
      local: true
    }
  )
}

export const handleASCIICommandSubmit = event => (dispatch, getState) => {
  if (event.keyCode === 13) {
    dispatch(
      {
        type: 'HANDLE_ASCII_COMMAND_SUBMIT',
        payload: getState().local.ASCIICommand,
        beingDispatchedFurther: true
      }
    )
  }
}