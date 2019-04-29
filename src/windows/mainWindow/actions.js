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

export const handleMotorEnable = event => (dispatch, getState) => {
  const axis = getState().shared.axis;
  dispatch(
    {
      type: 'HANDLE_MOTOR_ENABLE',
      payload: {
        enabled: event.target.checked,
        axis: axis
      },
      beingDispatchedFurther: true
    }
  )
}

export const handleJogActivate = event => (dispatch, getState) => {
  const axis = getState().shared.axis;
  dispatch(
    {
      type: 'HANDLE_JOG_ACTIVATE',
      payload: {
        activated: event.target.checked,
        axis: axis
      },
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

export const handleParameterValueChange = (event, parameterName, validationFunctions) => dispatch => {
  let validationError;
  for (let i = 0; i < validationFunctions.length; i++) {
    validationError = validationFunctions[i](event.target.value);
    if (validationError) {
      break;
    }
  }
  dispatch(
    {
      type: 'HANDLE_PARAMETER_VALUE_CHANGE',
      payload: event.target.value,
      parameterName,
      validationError,
      local: true
    }
  )
}

export const handleMoveButtonClick = () => (dispatch, getState) => {
  const {distance, distanceError} = getState().local;
  const axis = getState().shared.axis
  if (distanceError || distance.length === 0) {
    return;
  }
  dispatch(
    {
      type: 'HANDLE_DISTANCE_MOVE_EXECUTE',
      payload: {distance, axis},
      beingDispatchedFurther: true
    }
  )
}

export const handleMoveAbort = () => (dispatch, getState) => {
  const axis = getState().shared.axis;
  dispatch(
    {
      type: 'HANDLE_MOVE_ABORT',
      payload: axis,
      beingDispatchedFurther: true
    }
  )
}

export const handleJog = direction => (dispatch, getState) => {
  const {
    velocity, acceleration, deceleration,
    areJogParamsUpdated,
    velocityError, accelerationError, decelerationError
  } = getState().local;
  const axis = getState().shared.axis;
  if (velocityError || accelerationError || decelerationError) {
    return;
  }
  if (velocity.length === 0 || acceleration.length === 0 || deceleration.length === 0) {
    return;
  }
  const payload = areJogParamsUpdated ?
  {
    velocity, acceleration, deceleration
  } : undefined
  dispatch(
    {
      type: 'HANDLE_JOG',
      payload,
      direction,
      axis,
      beingDispatchedFurther: true
    }
  )
}

export const handleBaudRateSelect = event => (dispatch, getState) => {
  const {ip, port} = getState().shared;
  dispatch(
    {
      type: 'HANDLE_BAUD_RATE_CHANGE',
      payload: {baudRate: event.target.value, ip, port},
      beingDispatchedFurther: true
    }
  )
}

export const handleBreakCommandSend = () => (dispatch, getState) => {
  const {ip, port} = getState().shared;
  dispatch(
    {
      type: 'HANDLE_BREAK_COMMAND_SEND',
      payload: {ip, port},
      beingDispatchedFurther: true
    }
  )
}

export const handleAxisChange = event => dispatch => {
  dispatch(
    {
      type: 'HANDLE_AXIS_CHANGE',
      payload: event.target.value,
      beingDispatchedFurther: true
    }
  )
}