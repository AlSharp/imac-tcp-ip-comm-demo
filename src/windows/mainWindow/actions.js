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

export const handleIPConnect = props => dispatch => {
  dispatch(
    {
      type: 'HANDLE_IP_CONNECTION_CREATE',
      payload: props,
      beingDispatchedFurther: true
    }
  )
}

export const handleIPDisconnect = () => dispatch => {
  dispatch(
    {
      type: 'HANDLE_IP_CONNECTION_CLOSE',
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

export const handleIPPortChange = event => dispatch => {
  dispatch(
    {
      type: 'HANDLE_PORT_CHANGE',
      payload: event.target.value,
      local: true
    }
  )
}

export const handleComPortSelect = event => dispatch => {
  dispatch({
    type: 'HANDLE_COM_PORT_SELECT',
    payload: event.target.value,
    local: true
  })
}

export const handleUsbSerialRefresh = () => dispatch => {
  dispatch({
    type: 'HANDLE_USB_SERIAL_REFRESH',
    beingDispatchedFurther: true
  })
}

export const handleUsbSerialConnect = () => (dispatch, getState) => {
  const comPort = getState().shared.comPort;
  dispatch({
    type: 'HANDLE_USB_SERIAL_CONNECTION_CREATE',
    payload: comPort,
    beingDispatchedFurther: true
  })
}

export const handleUsbSerialDisconnect = () => dispatch => {
  dispatch({
    type: 'HANDLE_USB_SERIAL_CONNECTION_CLOSE',
    beingDispatchedFurther: true
  })
}

export const handleMotorEnable = event => (dispatch, getState) => {
  const {axis, connectionType} = getState().shared;
  dispatch(
    {
      type: 'HANDLE_MOTOR_ENABLE',
      payload: {
        enabled: event.target.checked,
        axis: axis
      },
      connectionType,
      beingDispatchedFurther: true
    }
  )
}

export const handleJogActivate = event => (dispatch, getState) => {
  const {axis, connectionType} = getState().shared;
  dispatch(
    {
      type: 'HANDLE_JOG_ACTIVATE',
      payload: {
        activated: event.target.checked,
        axis: axis
      },
      connectionType,
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
  const {connectionType} = getState().shared;
  const {ASCIICommand} = getState().local;
  if (event.keyCode === 13) {
    dispatch(
      {
        type: 'HANDLE_ASCII_COMMAND_SUBMIT',
        payload: ASCIICommand,
        connectionType,
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
  const {connectionType} = getState().shared;
  const axis = getState().shared.axis
  if (distanceError || distance.length === 0) {
    return;
  }
  dispatch(
    {
      type: 'HANDLE_DISTANCE_MOVE_EXECUTE',
      payload: {distance, axis},
      connectionType,
      beingDispatchedFurther: true
    }
  )
}

export const handleMoveAbort = () => (dispatch, getState) => {
  const {axis, connectionType} = getState().shared;
  dispatch(
    {
      type: 'HANDLE_MOVE_ABORT',
      payload: axis,
      connectionType,
      beingDispatchedFurther: true
    }
  )
}

export const handleJog = direction => (dispatch, getState) => {
  const {axis, connectionType} = getState().shared;
  dispatch(
    {
      type: 'HANDLE_JOG',
      payload: {axis, direction},
      connectionType,
      beingDispatchedFurther: true
    }
  )
}

// export const handleBaudRateSelect = event => (dispatch, getState) => {
//   const {ip, port} = getState().shared;
//   dispatch(
//     {
//       type: 'HANDLE_BAUD_RATE_CHANGE',
//       payload: {baudRate: event.target.value, ip, port},
//       beingDispatchedFurther: true
//     }
//   )
// }

// export const handleBreakCommandSend = () => (dispatch, getState) => {
//   const {ip, port} = getState().shared;
//   dispatch(
//     {
//       type: 'HANDLE_BREAK_COMMAND_SEND',
//       payload: {ip, port},
//       beingDispatchedFurther: true
//     }
//   )
// }

export const handleAxisChange = event => (dispatch, getState) => {
  const {connectionType} = getState().shared;
  dispatch(
    {
      type: 'HANDLE_AXIS_CHANGE',
      payload: event.target.value,
      connectionType,
      beingDispatchedFurther: true
    }
  )
}

export const handleHome = () => (dispatch, getState) => {
  const {axis, connectionType} = getState().shared;
  dispatch({
    type: 'HANDLE_HOME',
    payload: axis,
    connectionType,
    beingDispatchedFurther: true
  })
}