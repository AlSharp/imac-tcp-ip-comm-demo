const {log} = require('./utils');

module.exports = SerialPort => store => next => action => {
  next(action);
}