const net = require('net');

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

module.exports = class IpSerial {
  constructor() {
    this.socket = new net.Socket();
    this.store = null;
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
      return axes;      
    }
    catch(error) {
      throw error;
    }
  }
}