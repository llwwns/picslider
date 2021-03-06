const {ipcRenderer} = require('electron')
const $ = require('jquery')
const {basename} = require('path')
const Timer = require("./timer")

let config
let count = 0
let file
let pause = false
let timer

function loadNext() {
  if (count >= config.r) {
    location.reload()
    return
  }
  let file = ipcRenderer.sendSync('getNext')
  if (file !== null) {
    loadImg(file)
  } else {
    alert("Not found image.")
  }
}

function loadImg(path) {
  file = basename(path)
  let img = $(`<img src='file://${path}'>`)
  $('#tag').text(file)
  img.on('load', ()=> {
    $('#main').html('').append(img)
    count++
    if (img.width() > img.height()) {
      img.addClass('norm');
    } else {
      img.addClass('rotate');
    }
    //ipcRenderer.sendSync('resize', [img.width(), img.height()])
    if (pause) {
      timer.reset()
    } else {
      timer.start()
    }
  })
  img.on('error', () => {
    ipcRenderer.sendSync('loadError')
    loadNext()
  })
}


$(() => {
  config = ipcRenderer.sendSync('getConfig')
  timer = new Timer(loadNext, config.i)
  loadNext()
  document.onkeypress = (e) => {
    if (e.code === "Space") {
      if (pause) {
        timer.resume()
        $('#tag').hide()
      } else {
        timer.pause()
        $('#tag').show()
      }
      pause = !pause
    }
  }
  Clipboard = require("clipboard")
  new Clipboard("#tag")
  $("#close").on("click", () => {
    ipcRenderer.sendSync('close')
  })
  //$('body').css('opacity', config.o)
  //$('body').css('filter', `contrast(${config.c}%)`)
})
