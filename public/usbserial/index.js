const SerialPort = require('serialport');

module.exports = class UsbSerial {
  constructor() {
    this.port = null;
    this.parser = null;
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
    return Promise(resolve => {
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
        return reject(new Error('could not receive response from the device'));
      }, 500);

      const handler = response => {
        clearTimeout(timeout);

        const slice = response.slice(0, 1);

        if (slice === 'v') {
          return resolve(response.slice(2));
        }
        
        if (slice === 'e') {
          return reject(error);
        }

        return response;
      }

      this.port.write(this.toAscii(`${axis} ${data}`));

      this.parser.once('data', handler);
    })
  }
}