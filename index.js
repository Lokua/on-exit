'use strict'

module.exports = function(fn) {
  var manualExit = false
  var doExit = makeExitHandler(true)

  process.on('exit', makeExitHandler())

  process.on('SIGINT', doExit)

  process.on('uncaughtException', function(e) {
    console.error(e)
    doExit()
  })

  // https://github.com/remy/nodemon#controlling-shutdown-of-your-script
  process.once('SIGUSR2', function() {
    // TODO: support callback or promise resolution before kill
    fn()
    process.kill(process.pid, 'SIGUSR2')
  })

  function makeExitHandler(exit) {
    return function() {
      if (!manualExit) {
        process.stdout.write('\n')
        fn()
      }

      if (exit) {
        manualExit = true
        process.exit()
      }
    }
  }
}
