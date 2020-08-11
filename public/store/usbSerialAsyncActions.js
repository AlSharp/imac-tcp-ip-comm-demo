const handleUSBSerialRefresh = async usbSerial => {
  try {
    const list = await usbSerial.list();
    return list;
  }
  catch(error) {
    throw error;
  }
}

module.exports = {
  handleUSBSerialRefresh
}