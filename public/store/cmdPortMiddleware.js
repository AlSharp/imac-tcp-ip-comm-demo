module.exports = commandPort => store => next => action => {
  switch(action.type) {
    case 'HANDLE_MOTOR_ENABLE': {
      console.log('NSIO_INIT RES: ', commandPort.nsio_init());
      const portId = commandPort.nsio_open('10.1.10.65', 1, 3000);
      console.log('PORT ID: ', portId);
      console.log('NSIO_CLOSE RES: ', commandPort.nsio_close(portId));
      console.log('NSIO_END RES: ', commandPort.nsio_end());
      next(action);
      break;
    }
    default:
      next(action);
  }
}