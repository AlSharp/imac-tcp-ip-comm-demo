const net = require('net');
const {backToEventLoop} = require('../utils');

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

class SocketError extends Error {
  constructor(message, originalError) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.originalError = originalError;
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
  if (num !== 0) {
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
  } else {
    for (let i = 0; i < Object.keys(this._bits).length; i++) {
      this[i] = false;
    }
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
        _this.axesState[axis].posLimit = value;
        this._bits[9] = value;
      },
      get 9() {
        return this._bits[9];
      },
      set 10(value) {
        _this.axesState[axis].negLimit = value;
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
        _this.axesState[axis].isMotorEnabled = !value;
        this._bits[15] = value;
      },
      get 15() {
        return this._bits[15];
      },
      set 16(value) {
        _this.axesState[axis].posSWLimit = value;
        this._bits[16] = value;
      },
      get 16() {
        return this._bits[16];
      },
      set 17(value) {
        _this.axesState[axis].negSWLimit = value;
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
        if (!_this.axesState[axis].inSequenceExecution) {
          if (value) {
            _this.axesState[axis].inMotion = true;
          } else {
            _this.axesState[axis].inMotion = false;
          }
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
  if (register === 'r31') {
    return {
      _value: null,
      set value(val) {
        const numValue = parseInt(val, 10);
        if (numValue !== this._value) {
          if (numValue > 0) {
            _this.axesState[axis].inSequenceExecution = false;
          }
        }
        this._value = numValue;
      },
      get value() {
        return this._value;
      }
    }
  }
  if (register === 'r0x2d') {
    return {
      _value: null,
      set value(val) {
        const numValue = parseInt(val, 10);
        if (numValue !== this._value) {
          _this.axesState[axis].position = numValue;
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
    _isMotorEnabled: false,
    set isMotorEnabled(val) {
      if (val !== this._isMotorEnabled) {
        _this.store.dispatch({
          type: 'HANDLE_MOTOR_ENABLE_SUCCEED',
          payload: {axis, enabled: val}
        })
      }
      this._isMotorEnabled = val;
    },
    get isMotorEnabled() {
      return this._isMotorEnabled;
    },
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
      if (!val && !this._inSequenceExecution) {
        _this.stopPolling(axis);
      }
      this._inMotion = val;
    },
    get inMotion() {
      return this._inMotion;
    },
    _inSequenceExecution: false,
    set inSequenceExecution(val) {
      if (val !== this._inSequenceExecution) {
        _this.store.dispatch({
          type: 'HANDLE_IN_SEQUENCE_EXECUTION_BIT_SET',
          payload: {bitValue: val}
        });
      }
      if (!val) {
        _this.stopPolling(axis);
      }
      this._inSequenceExecution = val;
    },
    get inSequenceExecution() {
      return this._inSequenceExecution;
    },
    _position: 0,
    set position(val) {
      _this.store.dispatch({
        type: 'HANDLE_POSITION_CHANGE',
        payload: {axis, value: val}
      });
      this._position = val;
    },
    get position() {
      return this._position;
    },
    _negLimit: false,
    set negLimit(val) {
      _this.store.dispatch({
        type: 'HANDLE_NEG_LIMIT_CHANGE',
        payload: {axis, bitValue: val}
      });
      this._negLimit = val;
    },
    get negLimit() {
      return this._negLimit;
    },
    _negSWLimit: false,
    set negSWLimit(val) {
      _this.store.dispatch({
        type: 'HANDLE_NEG_SW_LIMIT_CHANGE',
        payload: {axis, bitValue: val}
      });
      this._negSWLimit = val;
    },
    get negSWLimit() {
      return this._negSWLimit;
    },
    _posLimit: false,
    set posLimit(val) {
      _this.store.dispatch({
        type: 'HANDLE_POS_LIMIT_CHANGE',
        payload: {axis, bitValue: val}
      });
      this._posLimit = val;
    },
    get posLimit() {
      return this._posLimit;
    },
    _posSWLimit: false,
    set posSWLimit(val) {
      _this.store.dispatch({
        type: 'HANDLE_POS_SW_LIMIT_CHANGE',
        payload: {axis, bitValue: val}
      });
      this._posSWLimit = val;
    },
    get posSWLimit() {
      return this._posSWLimit;
    },
    isPolling: false,
    r0xa0: registerState.call(this, axis, 'r0xa0'),
    r0x24: registerState.call(this, axis, 'r0x24'),
    r31: registerState.call(this, axis, 'r31'),
    r0x2d: registerState.call(this, axis, 'r0x2d')
  }
}

module.exports = class IpSerial {
  constructor() {
    const _this = this;
    this.socket = new net.Socket();
    this.store = null;
    this.axes = [];
    this.axesState = {};

    this.clientActions = [];

    this.pollingRegisters = ['0xa0', '0x2d'];
    this.CVMProgramRegisters = ['r31'];
  }

  attachStore(store) {
    this.store = store;
  }
  
  create(ip, port) {
    return new Promise((resolve, reject) => {

      let timer, err;

      const timeout = 1000;
      let closeByTimeout = false;
  
      const errorHandler = error => {
        clearTimeout(timer);
        err = error;
      }
  
      const closeHandler = hadError => {
        clearTimeout(timer);
        if (hadError) {
          this.socket.removeListener('ready', readyHandler);
          return reject(err);
        }
        if (closeByTimeout) {
          this.socket.removeListener('error', errorHandler);
          this.socket.removeListener('ready', readyHandler);
          return reject({code: 'ETIMEDOUT'});
        }
      }
  
      const readyHandler = () => {
        this.socket.removeListener('error', errorHandler);
        this.socket.removeListener('close', closeHandler);
  
        // attach listener for error event which
        // can happen any time while program works
        // maybe we don't need this
        // better to do this differently
        // this.socket.once('error', handleTCPConnectionError);
  
        return resolve(this);
      }

      this.socket.connect(port, ip, () => {
        clearTimeout(timer);
      })

      this.socket.once('error', errorHandler);

      this.socket.once('close', closeHandler);
  
      this.socket.once('ready', readyHandler);
  
      timer = setTimeout(() => {
        closeByTimeout = true;
        this.socket.destroy();
      }, timeout);
    })
  }

  destroy() {
    return new Promise((resolve, reject) => {
      let err;
  
      const errorHandler = error => {
        err = error;
      }
  
      const closeHandler = hadError => {
        if (hadError) {
          return reject(err);
        }
        this.socket.removeListener('error', errorHandler)
        return resolve();
      }

      this.socket.once('error', errorHandler);
      this.socket.once('close', closeHandler);
  
      this.socket.destroy();
    })
  }

  write(data, axis) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.socket.removeListener('data', responseHandler);
        this.socket.removeListener('error', errorHandler);
        return reject(new TimeoutError('could not receive response from the device'));
      }, 300);

      const errorHandler = error => {
        this.socket.removeListener('data', responseHandler);
        return reject(new SocketError('socket error', error));
      }

      const responseHandler = res => {
        this.socket.removeListener('error', errorHandler);
        let response = res.toString('utf8');
        clearTimeout(timeout);

        const slice = response.slice(0, 1);

        if (slice === 'v' || slice === 'r') {
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
        this.socket.write(`${axis} ${data}` + '\r', 'ascii');
      } else {
        this.socket.write(data + '\r', 'ascii');
      }
      this.socket.once('error', errorHandler);
      this.socket.once('data', responseHandler);  
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

  async startPolling(axis, options) {
    try {
      this.axesState[axis].isPolling = true;
      
      if (options) {
        if (options.inSequenceExecution) {
          this.axesState[axis].inSequenceExecution = options.inSequenceExecution;
          await this.write(`${axis} i r31 0`);
        }
      }

      while(this.axesState[axis].isPolling) {
        for (const register of this.pollingRegisters) {
          this.axesState[axis][`r${register}`]
            .value = await this.write(`${axis} g r${register}`);
        }
        if (this.axesState[axis].inSequenceExecution) {
          for (const register of this.CVMProgramRegisters) {
            this.axesState[axis][register]
              .value = await this.write(`${axis} i ${register}`);
          }
        }
        while(this.clientActions.length > 0) {
          await this.clientActions.shift()();
        }
        await backToEventLoop();
      }

      await this.write(`${axis} i r31 0`);
    }
    catch(error) {
      await this.write(`${axis} i r31 0`);
      throw error;
    }
  }

  stopPolling(axis) {
    this.axesState[axis].isPolling = false;
  }
}