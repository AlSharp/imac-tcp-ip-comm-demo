const ffi = require('ffi');
const ref = require('ref');

const path = require('path');
const isDev = require('electron-is-dev');

const int = ref.types.int;
const str = ref.types.CString;
const ulong = ref.types.ulong;
const long = ref.types.long

module.exports = () => {
  const oldPath = process.env.PATH;

  const dllPath = isDev ? 
    path.join(
      __dirname,
      'system32',
      process.arch === 'ia32' ? 'x32' : 'x64'
    ) :
    path.join(
      process.resourcesPath,
      'system32',
      process.arch === 'ia32' ? 'x32' : 'x64'
    );
  
  process.env['PATH'] = `${process.env.PATH};${dllPath}`;

  const lib = ffi.Library('./IPSerial', {
    'nsio_init': [int, []],
    'nsio_end': [int, []],
    'nsio_open': [int, [str, int, ulong]],
    'nsio_close': [int, [int]],
    'nsio_ioctl': [int, [int, int, int]],
    'nsio_baud': [int, [int, long]],
    'nsio_break': [int, [int, int]],
    'nsio_read': [int, [int, str, int]]
  });

  process.env['PATH'] = oldPath;

  return lib;
}