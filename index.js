const {ipcRenderer} = require('electron');
const $ = require('jquery');

let config;
let count = 0;

function getCurrentSize() {
    let {k, width, height} = config;
    return [width * k, height * k];
};

function loadNext() {
    if (count >= config.r) {
        location.reload();
        return;
    }
    let file = ipcRenderer.sendSync('getNext');
    if (file !== null) {
        loadImg(file);
    } else {
        alert("Not found image.");
    }
}

function loadImg(path) {
    let img = $(`<img src='file://${path}'>`);
    $('body').html('').append(img);
    img.on('load', ()=> {
        count++;
        let [width, height] = [img.width(), img.height()];
        let [w, h] = getCurrentSize();
        let r = Math.min(w / width, h / height);
        ipcRenderer.sendSync('resize', [r * width, r * height]);
        img.width('100%');
        setTimeout(loadNext, config.i);
    });
    img.on('error', () => {
        ipcRenderer.sendSync('loadError');
        loadNext();
    });
};


$(() => {
    config = ipcRenderer.sendSync('getConfig');
    loadNext();
});
