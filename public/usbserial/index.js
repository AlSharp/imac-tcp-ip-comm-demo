const SerialPort = require('serialport');
const {backToEventLoop} = require('../utils');

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

class HardwareError extends Error {
  constructor({message, hwErrorCode}) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.hwErrorCode = hwErrorCode;
  }
}

const setRegisterBits = function(prev, next) {
  const num = prev ^ next;
  let binaryStr = num.toString(2, 32);
  if (num < 0) {
    binaryStr = binaryStr.slice(1);
  }
  const bits = [];
  const binaryStrLength = binaryStr.length;
  for (let i = 0; i < binaryStrLength; i++) {
    if (binaryStr[i] === '1') {
      bits.push(Math.abs(i - binaryStrLength + 1));
    }
  }
  bits.sort((a, b) => a - b);

  for (let i = 0; i < bits.length; i++) {
    this[bits[i]] = !this[bits[i]];
  }
}

const registerState = function(axis, register) {
  const _this = this;
  if (register === 'r0xa0') {
    return {
      _value: null,
      set value(val) {
        const numValue = parseInt(val, 10);
        if (numValue !== this._value) {
          setRegisterBits.call(this, this.value, numValue);
        }
        this._value = numValue;
      },
      get value() {
        return this._value;
      },
      _bits: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false,
        17: false,
        18: false,
        19: false,
        20: false,
        21: false,
        22: false,
        23: false,
        24: false,
        25: false,
        26: false,
        27: false,
        28: false,
        29: false,
        30: false,
        31: false
      },
      set bits(value) {
        this._bits = value;
      },
      get bits() {
        return this._bits;
      },
      set 0(value) {
        this._bits[0] = value;
      },
      get 0() {
        return this._bits[0];
      },
      set 1(value) {
        this._bits[1] = value;
      },
      get 1() {
        return this._bits[1];
      },
      set 2(value) {
        this._bits[2] = value;
      },
      get 2() {
        return this._bits[2];
      },
      set 3(value) {
        this._bits[3] = value;
      },
      get 3() {
        return this._bits[3];
      },
      set 4(value) {
        this._bits[4] = value;
      },
      get 4() {
        return this._bits[4];
      },
      set 5(value) {
        this._bits[5] = value;
      },
      get 5() {
        return this._bits[5];
      },
      set 6(value) {
        this._bits[6] = value;
      },
      get 6() {
        return this._bits[6];
      },
      set 7(value) {
        this._bits[7] = value;
      },
      get 7() {
        return this._bits[7];
      },
      set 8(value) {
        this._bits[8] = value;
      },
      get 8() {
        return this._bits[8];
      },
      set 9(value) {
        this._bits[9] = value;
      },
      get 9() {
        return this._bits[9];
      },
      set 10(value) {
        this._bits[10] = value;
      },
      get 10() {
        return this._bits[10];
      },
      set 11(value) {
        this._bits[11] = value;
      },
      get 11() {
        return this._bits[11];
      },
      set 12(value) {
        this._bits[12] = value;
      },
      get 12() {
        return this._bits[12];
      },
      set 13(value) {
        this._bits[13] = value;
      },
      get 13() {
        return this._bits[13];
      },
      set 14(value) {
        this._bits[14] = value;
      },
      get 14() {
        return this._bits[14];
      },
      set 15(value) {
        this._bits[15] = value;
      },
      get 15() {
        return this._bits[15];
      },
      set 16(value) {
        this._bits[16] = value;
      },
      get 16() {
        return this._bits[16];
      },
      set 17(value) {
        this._bits[17] = value;
      },
      get 17() {
        return this._bits[17];
      },
      set 18(value) {
        this._bits[18] = value;
      },
      get 18() {
        return this._bits[18];
      },
      set 19(value) {
        this._bits[19] = value;
      },
      get 19() {
        return this._bits[19];
      },
      set 20(value) {
        this._bits[20] = value;
      },
      get 20() {
        return this._bits[20];
      },
      set 21(value) {
        this._bits[21] = value;
      },
      get 21() {
        return this._bits[21];
      },
      set 22(value) {
        this._bits[22] = value;
      },
      get 22() {
        return this._bits[22];
      },
      set 23(value) {
        this._bits[23] = value;
      },
      get 23() {
        return this._bits[23];
      },
      set 24(value) {
        this._bits[24] = value;
      },
      get 24() {
        return this._bits[24];
      },
      set 25(value) {
        this._bits[25] = value;
      },
      get 25() {
        return this._bits[25];
      },
      set 26(value) {
        this._bits[26] = value;
      },
      get 26() {
        return this._bits[26];
      },
      set 27(value) {
        if (value) {
          _this.axesState[axis].inMotion = true;
        } else {
          _this.axesState[axis].inMotion = false;
        }
        this._bits[27] = value;
      },
      get 27() {
        return this._bits[27];
      },
      set 28(value) {
        this._bits[28] = value;
      },
      get 28() {
        return this._bits[28];
      },
      set 29(value) {
        this._bits[29] = value;
      },
      get 29() {
        return this._bits[29];
      },
      set 30(value) {
        this._bits[30] = value;
      },
      get 30() {
        return this._bits[30];
      },
      set 31(value) {
        this._bits[31] = value;
      },
      get 31() {
        return this._bits[31];
      }
    }
  }
  if (register === 'r0x24') {
    return {
      _value: null,
      set value(val) {
        const numValue = parseInt(val, 10);
        if (numValue === 21) {
          _this.axesState[axis].motorType = 'servo';
        }
        if (numValue === 31) {
          _this.axesState[axis].motorType = 'stepper';
        }
        this._value = numValue;
      },
      get value() {
        return this._value;
      }
    }
  }
}

const buildAxisState = function(axis) {
  const _this = this;
  this.axesState[axis] = {
    _motorType: null,
    set motorType(val) {
      if (val !== this._motorType) {
        _this.store.dispatch({
          type: 'HANDLE_MOTOR_TYPE_CHANGE',
          payload: {axis, motorType: val}
        })
      }
      this._motorType = val;
    },
    get motorType() {
      return this._motorType;
    },
    _inMotion: false,
    set inMotion(val) {
      if (val !== this._inMotion) {
        _this.store.dispatch({
          type: 'HANDLE_IN_MOTION_BIT_SET',
          payload: {axis, bitValue: val}
        });
      }
      if (!val) {
        _this.stopPolling(axis);
      }
      this._inMotion = val;
    },
    get inMotion() {
      return this._inMotion;
    },
    isPolling: false,
    r0xa0: registerState.call(this, axis, 'r0xa0'),
    r0x24: registerState.call(this, axis, 'r0x24')
  }
}

module.exports = class UsbSerial {
  constructor() {
    this.port = null;
    this.parser = null;
    this.store = null;
    this.axes = [];
    this.axesState = {};

    this.clientActions = [];

    this.pollingRegisters = ['0xa0'];
  }

  attachStore(store) {
    this.store = store;
  }

  create(path) {
    return new Promise((resolve, reject) => {
      this.port = new SerialPort(
      path,
      {
        baudRate: 9600
      },
      error => {
        if (error) {
          return reject(error);
        }
      });

      this.parser = this.port.pipe(new SerialPort.parsers.Readline({delimiter: '\r'}))

      this.port.on('open', error => {
        if (error) {
          return reject(error);
        }
        return resolve(this);
      })
    })
  }

  destroy() {
    return new Promise(resolve => {
      this.port.close(() => {
        this.port = null;
        this.parser = null;
        return resolve();
      })
    })
  }

  async list() {
    try {
      const list = await SerialPort.list();
      return list;
    }
    catch(error) {
      throw error;
    }
  }

  toAscii(str) {
    const arr = [];
    for (var i = 0; i < str.length; i++) {
      arr.push(str[i].charCodeAt(0));
    }
    // push CR
    arr.push(13);
    return arr;
  }

  write(data, axis) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        return reject(new TimeoutError('could not receive response from the device'));
      }, 500);

      const handler = response => {
        clearTimeout(timeout);

        const slice = response.slice(0, 1);

        if (slice === 'v') {
          return resolve(response.slice(2));
        }
        
        if (slice === 'e') {
          return reject(new HardwareError({
            message: 'Drive error',
            hwErrorCode: response
          }));
        }

        return resolve(response);
      }

      if (axis) {
        this.port.write(this.toAscii(`${axis} ${data}`));
      } else {
        this.port.write(this.toAscii(data));
      }

      this.parser.once('data', handler);
    })
  }

  async getAxes() {
    try {
      const nodes = Array.from(Array(16).keys());
      const axes = [];
      for (let i = 0; i < nodes.length; i++) {
        try {
          let res = await this.write('g r0x24', nodes[i], true);
          if (res) {
            axes.push(nodes[i].toString(16));
          }
        }
        catch(error) {
          if(error instanceof TimeoutError) {
            return [];
          }
          if (!(error instanceof HardwareError)) {
            throw error;
          }
        }
  
      }
      this.axes = axes;
      this.store.dispatch({
        type: 'HANDLE_AXES_ADD',
        payload: {axes}
      });
      return this.axes; 
    }
    catch(error) {
      throw error;
    }
  }

  async initAxesState(axes) {
    try {
      for (const axis of axes) {
        buildAxisState.call(this, axis);

        this.axesState[axis].r0xa0.value = await this.write(`${axis} g r0xa0`);
        await this.getAndSetMotorType(axis);
      }
      return axes;
    }
    catch(error) {
      throw error;
    }
  }

  async getAndSetMotorType(axis) {
    try {
      const r0x24 = parseInt(await this.write(`${axis} g r0x24`), 10);
        if (r0x24 > 20 && r0x24 < 30) {
          if (r0x24 !== 21) {
            await this.write(`${axis} s r0x24 21`);
          }
          this.axesState[axis].r0x24.value = 21;
        } else if (r0x24 >= 30 && r0x24 <= 40) {
          if (r0x24 !== 31) {
            await this.write(`${axis} s r0x24 31`);
          }
          this.axesState[axis].r0x24.value = 31;
        }
    }
    catch(error) {
      throw error;
    }
  }

  async startPolling(axis) {
    try {
      this.axesState[axis].isPolling = true;
      while(this.axesState[axis].isPolling) {
        for (const register of this.pollingRegisters) {
          this.axesState[axis][`r${register}`]
            .value = await this.write(`${axis} g r${register}`);
          while(this.clientActions.length > 0) {
            await this.clientActions.shift()();
          }
          await backToEventLoop();
        }
      }
    }
    catch(error) {
      throw error;
    }
  }

  stopPolling(axis) {
    this.axesState[axis].isPolling = false;
  }
}