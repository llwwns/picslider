const _ = require('lodash')
const fs = require('fs')
const path = require('path')

class FileList {
  constructor(lst) {
    const result = lst.map((folder) => {
      const files = fs.readdirSync(folder)
      return files.map((file) => path.join(folder, file))
    })
    this._files = _.shuffle(_.flatten(result, true))
    this._current = 0
  }

  next() {
    if (this._files.length == 0) {
      return null
    }
    let r = this._files[this._current]
    this._current = (this._current + 1) % this._files.length
    return r
  }
  error() {
    this._files.splice((this._current + this._files.length - 1) % this._files.length, 1)
    this._current %= this._files.length
  }
}

module.exports = FileList
