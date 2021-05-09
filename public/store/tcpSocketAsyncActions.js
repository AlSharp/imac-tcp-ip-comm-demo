const handleIPConnectionCreate = async (ipSerial, action) => {
  try {
    const {ip, port} = action.payload;
    await ipSerial.create(ip, port);
  }
  catch(error) {
    throw error;
  }
}

handleIPConnectionClose = async ipSerial => {
  try {
    await ipSerial.destroy();
  }
  catch(error) {
    throw error;
  }
}

const handleMotorEnable = async (ipSerial, action) => {
  try {
    const {axis, enabled} = action.payload;
    const oldValue = parseInt(await ipSerial.write(`${axis} g r0xab`), 10);
    const newValue = enabled ?
      oldValue | Math.pow(2, 0) :
      oldValue & ~Math.pow(2, 0);
    const res = await ipSerial.write(`${axis} s r0xab ${newValue}`);
    const r0xa0 = await ipSerial.write(`${axis} g r0xa0`);
    ipSerial.axesState[axis]['r0xa0'].value = r0xa0;
    return res;
  }
  catch(error) {
    throw error;
  }
}

const handleASCIICommandSend = async (ipSerial, action) => {
  try {
    const res = await ipSerial.write(action.payload);
    return res;
  }
  catch(error) {
    throw error;
  }
}
  

const handleDistanceMoveExecute = async (ipSerial, action) => {
  try {
    const {axis, distance, velocity, acceleration, deceleration} = action.payload;
    let commands = [
      `${axis} s r0xc8 256`,
      `${axis} s r0xca ${distance}`,
      `${axis} s r0xcb ${+velocity*10}`,
      `${axis} s r0xcc ${+acceleration/10}`,
      `${axis} s r0xcd ${+deceleration/10}`,
      `${axis} t 1`
    ];
    for (const command of commands) {
      await ipSerial.write(command);
    }

    ipSerial.startPolling(axis);
  }
  catch(error) {
    throw error;
  }
}

const handleJog = async (ipSerial, action) => {
  try {
    const {axis, direction, jogVelocity} = action.payload;
    const commands = [
      `${axis} s r0xcb ${+jogVelocity*10}`,
      `${axis} s r0xca ${direction === 'positive' ? '1' : '-1'}`,
      `${axis} t 1`
    ]
    for (const command of commands) {
      await ipSerial.write(command);
    }

    ipSerial.startPolling(axis);
  }
  catch(error) {
    throw error;
  }
}

handleJogActivate = async (ipSerial, action) => {
  try {
    const {
      axis, activated,
      velocity, velocityError,
      jogVelocity, jogVelocityError
    } = action.payload;
    const value = activated ? '2' : '256';
    await ipSerial.write(`${axis} s r0xc8 ${value}`);
    if (activated) {
      if (jogVelocity.length && !jogVelocityError) {
        await ipSerial.write(`${axis} s r0xcb ${+jogVelocity*10}`);
      } else {
        await usbSerial.write(`${axis} s r0xcb 0`);
      }
    } else {
      if (velocity.length && !velocityError) {
        await usbSerial.write(`${axis} s r0xcb ${+velocity*10}`);
      } else {
        await usbSerial.write(`${axis} s r0xcb 0`);
      }
    }
  }
  catch(error) {
    throw error;
  }
}

const handleMoveAbort = async (ipSerial, action) => {
  try {
    await ipSerial.write(`${action.payload} t 0`);
  }
  catch(error) {
    throw error;
  }
}

const handleHome = async (ipSerial, action) => {
  try {
    await ipSerial.write(`${action.payload} t 2`);
    ipSerial.startPolling(action.payload);
  }
  catch(error) {
    throw error;
  }
}

const handleAxisParameterChange = async (ipSerial, action) => {
  try {
    const {axis, parameter, parameterValue} = action.payload;
    let register, value;
    switch(parameter) {
      case 'motorType': {
        value = parameterValue === 'stepper' ? '31' : '21';
        register = 'r0x24';
        break;
      }
      default:
        throw new Error('no such parameter');
    }
    await ipSerial.write(`${axis} s ${register} ${value}`);
    ipSerial.axesState[axis][register].value = value;
  }
  catch(error) {
    throw error;
  }
}

const handleSequenceRun = async (ipSerial, action) => {
  try {
    const {axis, sequenceNumber} = action.payload;
    const value = 32768 + +sequenceNumber;
    await ipSerial.write(`${axis} i r0 ${value}`);
    ipSerial.startPolling(axis, {inSequenceExecution: true});
  }
  catch(error) {
    throw error;
  }
}

const handleSequenceStop = async (ipSerial, action) => {
  try {
    for (const axis of ipSerial.axes) {
      await ipSerial.write(`${axis} t 0`);
    }
    await ipSerial.write(`${action.payload.axis} i r31 1`);
  }
  catch(error) {
    throw error;
  }
}

module.exports = {
  handleIPConnectionCreate,
  handleIPConnectionClose,
  handleMotorEnable,
  handleASCIICommandSend,
  handleDistanceMoveExecute,
  handleJog,
  handleMoveAbort,
  handleHome,
  handleAxisParameterChange,
  handleSequenceRun,
  handleSequenceStop
}