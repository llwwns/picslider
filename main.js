const electron = require('electron');
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const {loadFileList} = require('./filelist');
let {argv} = require('optimist');
const config = Object.assign({
        i: 5000,
        k: 0.9,
        r: 50
    }, argv);

let win;

function createWindow () {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        resizable: false
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //  win.webContents.openDevTools()
    win.on('closed', () => {
        win = null
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

ipcMain.on('resize', (event, [width, height]) => {
    let {size} = electron.screen.getDisplayMatching(win.getBounds());
    let [w, h] = [size.width * config.k, size.height * config.k]
    let r = Math.min(w / width, h / height);
    win.setSize(Math.ceil(width * r), Math.ceil(height * r));
    event.returnValue = null;
});

let files = loadFileList(argv._);
ipcMain.on('getNext', (event) => {
    event.returnValue = files.next();
});

ipcMain.on('getConfig', (event) => {
    event.returnValue = config;
});

ipcMain.on('loadError', (event) => {
    files.error();
    event.returnValue = null;
});
