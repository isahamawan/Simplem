'use strict';

//モジュールを使えるようにする
const fs = require('fs')
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");

//ipc経由の機能------------------------------------------------------------------<
//ファイルの読込
ipcMain.handle('open', async (event) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        filters: [
            { name: 'テキストファイル, マークダウンファイル', extensions: ['txt', 'md'] }
        ]
    })

    if (canceled) return { canceled, data: [] }

    const data = filePaths.map((filePath) =>

        fs.readFileSync(filePath, { encoding: 'utf8' })
    )

    global.filePath_for_save = filePaths[0];


    return { canceled, data }
});

//ファイルの名前を付けて保存
ipcMain.handle('save_as', async (event, text_data) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [
            { name: 'テキストファイル', extensions: ['txt'] },
            { name: 'マークダウンファイル', extensions: ['md'] },
        ]
    })

    if (canceled) return

    global.filePath_for_save = filePath;

    fs.writeFileSync(filePath, text_data)
});

//ファイルを上書き保存
ipcMain.handle('save', async (event, text_data) => {

    //一度も保存されていなければ、レンダラ（index.html）へ'save_as_from_main.js'を命令
    if (!global.filePath_for_save) {
        mainWindow.webContents.send('save_as_from_main.js');
        return
    };

    let filePath = global.filePath_for_save

    fs.writeFileSync(filePath, text_data)
});
//ipc経由の機能------------------------------------------------------------------>


// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

//アプリの画面を作成
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800, height: 600, 'icon': __dirname + 'favicon.ico', webPreferences: {
            nodeIntegration: false, // falseでレンダラープロセスでのモジュール使用を制限（XSS回避のため）
            contextIsolation: false, //nodeIntegration:false状態でモジュール共有を行うために、contextIsolationをfalseにする必要あり
            preload: __dirname + '/preload.js' // nodeIntegrationとセット（モジュールの使用許可）。読み込んだモジュールをグローバルに共有→それをレンダラープロセスで使用」という形で、レンダラープロセスでのNode APIの利用を可能にできる
        }
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.setMinimumSize(650, 300);
    //mainWindow.setTitle('Simplem'); //メインプロセスでしか使えないので、レンダー側で使う場合はipc使う必要あり。index.html側でタイトルを設定している場合は効かない。
}



//メニューバー内容
let template = [{
    label: 'Simplem',
    submenu: [{
        role: 'about', label: 'Simplemについて'
    }, {
        label: 'Simplemを終了',
        accelerator: 'CmdOrCtrl+Q',
        click: function () {
            app.quit();
        }
    }]
}, {
    label: 'ファイル',
    submenu: [{
        label: 'ファイルを開く',
        accelerator: 'CmdOrCtrl+O',
        click: function () {
            mainWindow.webContents.send('open_from_main.js'); //レンダラ（index.html）へ'open_from_main.js'を命令
        }
    }, {
        label: '上書き保存',
        accelerator: 'CmdOrCtrl+S',
        click: function () {
            mainWindow.webContents.send('save_from_main.js');
        }
    }, {
        label: '名前を付けて保存',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: function () {
            mainWindow.webContents.send('save_as_from_main.js');
        }
    }, {
        label: 'Simplemを終了',
        accelerator: 'CmdOrCtrl+Q',
        click: function () {
            app.quit();
        }
    }]
}, {
    label: "編集",
    submenu: [
        { role: 'undo', label: '元に戻す' },
        { role: 'redo', label: 'やり直す' },
        { type: 'separator' },
        { role: 'cut', label: '切り取り' },
        { role: 'copy', label: 'コピー' },
        { role: 'paste', label: '貼り付け' },
        { type: 'separator' },
        { role: 'selectAll', label: '全て選択' },
        { type: 'separator' },
        {
            label: '読み上げ',
            submenu: [
                { role: 'startSpeaking', label: '開始' },
                { role: 'stopSpeaking', label: '終了' }
            ]
        },
    ]
}, {
    label: "表示",
    submenu: [
        { role: 'togglefullscreen', label: 'フルスクリーン表示切替え' },
        { type: 'separator' },
        { role: 'zoomIn', label: 'ズームイン' },
        { role: 'zoomOut', label: 'ズームアウト' },
        { role: 'resetZoom', label: 'リセット' },
        { type: 'separator' },
        //{ role: 'toggleSpellChecker', label: 'スペルチェッカー切替え' },
        //{ type: 'separator' },
        { role: 'toggleDevTools' },
    ]
}, {
    label: "ウィンドウ",
    submenu: [
        { role: 'zoom', label: '最大化' },
        { role: 'minimize', label: '最小化' },
        { role: 'windowMenu' },
    ]
}
]


// Electronの初期化完了後に実行
app.on('ready', function () {
    //メニューバー設置
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    createWindow();
    //mainWindow.webContents.openDevTools(); //デベロッパーツールの起動
});

//アプリの画面が閉じられたら実行
app.on('window-all-closed', () => {
    // macOSでは、ユーザが Cmd + Q で明示的に終了するまで、
    // アプリケーションとそのメニューバーは有効なままにするのが一般的です。
    //if (process.platform !== 'darwin') {
    mainWindow = null;
    app.quit()
    //}
});

app.on('activate', () => {
    // macOSでは、ユーザがドックアイコンをクリックしたとき、
    // そのアプリのウインドウが無かったら再作成するのが一般的です。
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});