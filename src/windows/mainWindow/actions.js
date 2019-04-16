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
  if (distanceError || distance.length === 0) {
    return;
  }
  dispatch(
    {
      type: 'HANDLE_DISTANCE_MOVE_EXECUTE',
      payload: distance,
      beingDispatchedFurther: true
    }
  )
}

export const handleMoveAbort = () => dispatch => {
  dispatch(
    {
      type: 'HANDLE_MOVE_ABORT',
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
      beingDispatchedFurther: true
    }
  )
}

export const handleJogAbort = () => (dispatch, getState) => {
  const {
    velocity, acceleration, deceleration,
    velocityError, accelerationError, decelerationError
  } = getState().local;
  if (velocityError || accelerationError || decelerationError) {
    return;
  }
  if (velocity.length === 0 || acceleration.length === 0 || deceleration.length === 0) {
    return;
  }
  dispatch(
    {
      type: 'HANDLE_JOG_ABORT',
      beingDispatchedFurther: true
    }
  )
}