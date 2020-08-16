const backToEventLoop = () => new Promise(resolve => setImmediate(() => resolve()));

module.exports = {
  backToEventLoop
}