const electron = require('electron')
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const FileList = require('./filelist')
const { powerSaveBlocker } = require('electron')
const id = powerSaveBlocker.start('prevent-display-sleep')

let {argv} = require('optimist')
const config = Object.assign({
  i: 10000,
  k: 0.9,
  r: 50,
  o: 0.7,
  c: 110
}, argv)

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    resizable: true,
    transparent: true
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.setFullScreen(true)

  win.on('closed', () => {
    win = null
  })

  /*win.on('focus', () => {
    win.setIgnoreMouseEvents(false)
  })

  win.on('blur', () => {
    win.setIgnoreMouseEvents(true)
  })*/

  win.setAlwaysOnTop(true)

  win.isResizable(true)
  //win.toggleDevTools()

  //const electronVibrancy = require('electron-vibrancy')
  //electronVibrancy.SetVibrancy(win, 2)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('close', (event) => {
  win.close()
  event.returnValue = null
})

ipcMain.on('resize', (event, [width, height]) => {
  const {size} = electron.screen.getDisplayMatching(win.getBounds())
  const [w, h] = [size.width * config.k / 2, size.height * config.k]
  const r = Math.min(w / width, h / height)
  win.setSize(Math.ceil(width * r), Math.ceil(height * r))
  event.returnValue = null
})

const files = new FileList(argv._)
ipcMain.on('getNext', (event) => {
  event.returnValue = files.next()
})

ipcMain.on('getConfig', (event) => {
  event.returnValue = config
})

ipcMain.on('loadError', (event) => {
  files.error()
  event.returnValue = null
})
