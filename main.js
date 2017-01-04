const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const {loadFileList} = require('./filelist');
let {argv} = require('optimist');

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
    win.setSize(Math.ceil(width), Math.ceil(height));
    event.returnValue = null;
});

let files = loadFileList(argv._);
ipcMain.on('getNext', (event) => {
    event.returnValue = files.next();
});

ipcMain.on('getConfig', (event) => {
    event.returnValue = Object.assign({
        width: 1920,
        height: 1080,
        i: 5000,
        k: 0.9,
        r: 50
    }, argv);
});

ipcMain.on('loadError', (event) => {
    files.error();
    event.returnValue = null;
});
