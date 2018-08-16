class Timer {
  constructor(callback, delay) {
    this._delay = delay
    this._remaining = delay
    this._callback = callback
    this.resume()
  }

  pause() {
    window.clearTimeout(this._timerId)
    this.remaining -= new Date() - this._start
  }

  resume() {
    this._start = new Date()
    window.clearTimeout(this._timerId)
    this._timerId = window.setTimeout(this._callback, this._remaining)
  }

  reset() {
    this._remaining = this._delay
  }

  start() {
    this.reset()
    this.resume()
  }

}

module.exports = Timer
