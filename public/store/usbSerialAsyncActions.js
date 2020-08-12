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
    const comPort = action.payload;
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
    const command = action.payload.enabled ?
      `${action.payload.axis} s r0x70 2 0` :
      `${action.payload.axis} s r0x70 258 0`;
    const res = await usbSerial.write(command);
    return res;
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
    const {axis, distance} = action.payload;
    const commands = [
      `${axis} s r0xc8 256`,
      `${axis} s r0xca ${distance}`,
      `${axis} t 1`
    ];
    for (const command of commands) {
      await usbSerial.write(command);
    }
  }
  catch(error) {
    throw error;
  }
}

const handleJog = async (usbSerial, action) => {
  try {
    const {axis, direction} = action.payload;
    const commands = [
      `${axis} s r0xc8 2`,
      `${axis} s r0xca ${direction === 'positive' ? '1' : '-1'}`,
      `${axis} t 1`
    ]
    for (const command of commands) {
      await usbSerial.write(command);
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

module.exports = {
  handleUSBSerialRefresh,
  handleUSBSerialConnectionCreate,
  handleUSBSerialConnectionClose,
  handleMotorEnable,
  handleASCIICommandSend,
  handleDistanceMoveExecute,
  handleJog,
  handleMoveAbort
}