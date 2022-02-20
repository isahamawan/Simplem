const electron = require('electron');

process.once('loaded', () => {
    global.ipcRenderer = electron.ipcRenderer;
    global.app = electron.app;
    //global.remote = electron.remote;
    //global.searchInPage = require('electron-in-page-search').default;
});

//以下index.jsで使用
//nodeIntegrationをfalseにしたことで、以下は使えなくなった
//const {ipcRenderer, app} = require('electron');
//
//preload.jsで定義したことで、代わりに以下が使用可能
//const ipcRenderer = window.ipcRenderer;
//const app = window.app;