const ffi = require('ffi');
const ref = require('ref');

const int = ref.types.int;

module.exports = ffi.Library('./IPSerial', {
  'nsio_init': [int, []],
  'nsio_end': [int, []],
});