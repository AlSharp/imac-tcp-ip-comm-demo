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
    const command = action.payload.enabled ?
      `${action.payload.axis} s r0x70 2 0` :
      `${action.payload.axis} s r0x70 258 0`;
    const res = await ipSerial.write(command);
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
    const {axis, distance} = action.payload;
    let commands = [
      `${axis} s r0xc8 256`,
      `${axis} s r0xca ${distance}`,
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
    const {axis, direction} = action.payload;
    const commands = [
      `${axis} s r0xc8 2`,
      `${axis} s r0xca ${direction === 'positive' ? '1' : '-1'}`,
      `${axis} t 1`
    ]
    for (const command of commands) {
      await ipSerial.write(command);
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


module.exports = {
  handleIPConnectionCreate,
  handleIPConnectionClose,
  handleMotorEnable,
  handleASCIICommandSend,
  handleDistanceMoveExecute,
  handleJog,
  handleMoveAbort,
  handleHome
}