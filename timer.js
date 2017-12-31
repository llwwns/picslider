exports.Timer = function(callback, delay) {
  let timerId, start, remaining = delay

  this.pause = function() {
    window.clearTimeout(timerId)
    remaining -= new Date() - start
  }

  this.resume = function() {
    start = new Date()
    window.clearTimeout(timerId)
    timerId = window.setTimeout(callback, remaining)
  }

  this.reset = function() {
    remaining = delay
  }

  this.start = function() {
    this.reset()
    this.resume()
  }

  this.resume()
}
