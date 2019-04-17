const ffi = require('ffi');
const ref = require('ref');

const int = ref.types.int;
const str = ref.types.CString;
const ulong = ref.types.ulong;

module.exports = ffi.Library('./IPSerial', {
  'nsio_init': [int, []],
  'nsio_end': [int, []],
  'nsio_open': [int, [str, int, ulong]],
  'nsio_close': [int, [int]]
});