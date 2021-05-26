const handleUSBSerialRefresh = async usbSerial => {
  try {
    const list = await usbSerial.list();
    return list;
  }
  catch(error) {
    throw error;
  }
}

const handleUSBSerialConnectionCreate = async (usbSerial, action) => {
  try {
    const {comPort} = action.payload;
    await usbSerial.create(comPort);
  }
  catch(error) {
    throw error;
  }
}

const handleUSBSerialConnectionClose = async usbSerial => {
  try {
    await usbSerial.destroy();
  }
  catch(error) {
    throw error;
  }
}

const handleMotorEnable = async (usbSerial, action) => {
  try {
    const {axis, enabled} = action.payload;
    const oldValue = parseInt(await usbSerial.write(`${axis} g r0xab`), 10);
    const newValue = enabled ?
      oldValue | Math.pow(2, 0) :
      oldValue & ~Math.pow(2, 0);
    await usbSerial.write(`${axis} s r0xab ${newValue}`);
    const r0xa0 = await usbSerial.write(`${axis} g r0xa0`);
    usbSerial.axesState[axis]['r0xa0'].value = r0xa0;
    return true;
  }
  catch(error) {
    throw error;
  }
}

const handleASCIICommandSend = async (usbSerial, action) => {
  try {
    const res = await usbSerial.write(action.payload);
    return res;
  }
  catch(error) {
    throw error;
  }
}

const handleDistanceMoveExecute = async (usbSerial, action) => {
  try {
    const {axis, distance, velocity, acceleration, deceleration} = action.payload;
    const commands = [
      `${axis} s r0xc8 256`,
      `${axis} s r0xca ${distance}`,
      `${axis} s r0xcb ${+velocity*10}`,
      `${axis} s r0xcc ${+acceleration/10}`,
      `${axis} s r0xcd ${+deceleration/10}`,
      `${axis} t 1`
    ];
    for (const command of commands) {
      await usbSerial.write(command);
    }

    usbSerial.startPolling(axis);
  }
  catch(error) {
    throw error;
  }
}

const handleJog = async (usbSerial, action) => {
  try {
    const {axis, direction, jogVelocity} = action.payload;
    const commands = [
      `${axis} s r0xcb ${+jogVelocity*10}`,
      `${axis} s r0xca ${direction === 'positive' ? '1' : '-1'}`,
      `${axis} t 1`
    ]
    for (const command of commands) {
      await usbSerial.write(command);
    }

    usbSerial.startPolling(axis);
  }
  catch(error) {
    throw error;
  }
}

handleJogActivate = async (usbSerial, action) => {
  try {
    const {
      axis, activated,
      velocity, velocityError,
      jogVelocity, jogVelocityError
    } = action.payload;
    const value = activated ? '2' : '256';
    await usbSerial.write(`${axis} s r0xc8 ${value}`);
    if (activated) {
      if (jogVelocity.length && !jogVelocityError) {
        await usbSerial.write(`${axis} s r0xcb ${+jogVelocity*10}`);
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

const handleMoveAbort = async (usbSerial, action) => {
  try {
    await usbSerial.write(`${action.payload} t 0`);
  }
  catch(error) {
    throw error;
  }
}

const handleHome = async (usbSerial, action) => {
  try {
    await usbSerial.write(`${action.payload} t 2`);
    usbSerial.startPolling(action.payload);
  }
  catch(error) {
    throw error;
  }
}

const handleAxisParameterChange = async (usbSerial, action) => {
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
    await usbSerial.write(`${axis} s ${register} ${value}`);
    usbSerial.axesState[axis][register].value = value;
  }
  catch(error) {
    throw error;
  }
}

const handleSequenceRun = async (usbSerial, action) => {
  try {
    const {axis, sequenceNumber} = action.payload;
    const value = 32768 + +sequenceNumber;
    await usbSerial.write(`${axis} i r0 ${value}`);
    usbSerial.startPolling(axis, {inSequenceExecution: true});
  }
  catch(error) {
    throw error;
  }
}

const handleSequenceStop = async (usbSerial, action) => {
  try {
    for (const axis of usbSerial.axes) {
      await usbSerial.write(`${axis} t 0`);
    }
    await usbSerial.write(`${action.payload.axis} i r31 1`);
  }
  catch(error) {
    throw error;
  }
}

module.exports = {
  handleUSBSerialRefresh,
  handleUSBSerialConnectionCreate,
  handleUSBSerialConnectionClose,
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