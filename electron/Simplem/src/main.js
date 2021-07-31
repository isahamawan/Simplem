'use strict';

//モジュールを使えるようにする
const fs = require('fs')
const { app, BrowserWindow, Menu, ipcMain, dialog, clipboard } = require("electron");
const path_tool = require('path');
const openAboutWindow = require("about-window").default;
const log_tool = require('electron-log');

//const searchInPage = require('electron-in-page-search').default;

//mac用
//let openfile_mac = null;

//mac用の起動時のファイルの読み込み処理１／２
// mac では ready イベントより前に発火するイベント 'will-finish-launching' でしか
// 起動時のファイルパスを取得できない
app.once('will-finish-launching', () => {
    // mac のみに存在する 'open-file' イベント
    app.once('open-file', (e, argv) => {
        // 必須！
        e.preventDefault();

        // ready イベントより前のため、まだ webContents を呼べない
        // いったんグローバル変数に預ける
        global.filePath_for_init_mac = argv;

    });
});


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

    //タイトル用にファイル名を保管と、タイトルの変更
    global.filename_for_title = path_tool.basename(filePaths[0]);
    mainWindow.setTitle(global.filename_for_title + " - Simplem");

    //ファイル名の頭の*を削除するためのスクリプトタグ追加命令
    mainWindow.webContents.send('add_asterisk_script_from_main');

    //上書き保存用にファイルパスを保管
    global.filePath_for_save = filePaths[0];


    return { canceled, data }
});

//ファイルの読込時の、ファイル名の頭のアスタリスクの削除
ipcMain.handle('open_asterisk_del', async (event) => {
    //ファイル名の頭の*の削除
    mainWindow.setTitle(global.filename_for_title + " - Simplem");
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

    fs.writeFileSync(filePath, text_data);

    //タイトル用にファイル名を保管と、タイトルの変更
    global.filename_for_title = path_tool.basename(filePath);
    mainWindow.setTitle(global.filename_for_title + " - Simplem");

    //上書き保存用にファイルパスを保管
    global.filePath_for_save = filePath;

    //ファイル名の頭の*を追加するためのスクリプトタグ追加命令
    mainWindow.webContents.send('add_asterisk_script_from_main');

});

//ファイルを上書き保存
ipcMain.handle('save', async (event, text_data) => {

    //一度も保存されていなければ、レンダラ（index.html）へ'save_as_from_main'を命令
    if (!global.filePath_for_save) {
        mainWindow.webContents.send('save_as_from_main');
        return
    };

    let filePath = global.filePath_for_save

    fs.writeFileSync(filePath, text_data)

    //ファイル名の頭の*の削除
    mainWindow.setTitle(global.filename_for_title + " - Simplem");

    //ファイル名の頭の*を追加するためのスクリプトタグ追加命令
    mainWindow.webContents.send('add_asterisk_script_from_main');
});

//ファイル起動時に引数として渡されたファイルパスからファイルを読み込み
ipcMain.handle('open_init', async (event) => {

    const data = fs.readFileSync(global.filePath_for_init, { encoding: 'utf8' });

    //タイトル用にファイル名を保管と、タイトルの変更
    global.filename_for_title = path_tool.basename(global.filePath_for_init);
    mainWindow.setTitle(global.filename_for_title + " - Simplem");

    //ファイル名の頭の*を追加するためのスクリプトタグ追加命令
    mainWindow.webContents.send('add_asterisk_script_from_main');

    //上書き保存用にファイルパスを保管
    global.filePath_for_save = global.filePath_for_init;

    // グローバル変数を初期化
    global.filePath_for_init = null;

    return { data }
});


//clipboardへhtmlをコピー
ipcMain.handle('html_to_clipboard', async (event, parsered_preview_html_plaintext) => {

    clipboard.writeText(parsered_preview_html_plaintext, clipboard);

});

//印刷
ipcMain.handle('print', async (event) => {

    mainWindow.webContents.executeJavaScript("window.print()");
    //mainWindow.webContents.print();//winではこれでも動く macはgetprinterでプリンターが無しなら動かない？

});

//PDF出力
ipcMain.handle('print_to_pdf', async (event) => {

    let buffer_pdf = await mainWindow.webContents.printToPDF({ landscape: false });

    const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [
            { name: 'PDFファイル', extensions: ['pdf'] }
        ]
    })

    if (canceled) return

    await fs.promises.writeFile(filePath, buffer_pdf);

});

//ファイル名の頭に*を追加
ipcMain.handle('add_asterisk_to_filename', async (event) => {

    mainWindow.setTitle("*" + global.filename_for_title + " - Simplem");

});

//ipc経由の機能------------------------------------------------------------------>


// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

//アプリの画面を作成
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600, height: 600, 'icon': __dirname + 'favicon.png', webPreferences: {
            nodeIntegration: false, // falseでレンダラープロセスでのモジュール使用を制限（XSS回避のため）
            contextIsolation: false, //nodeIntegration:false状態でモジュール共有を行うために、contextIsolationをfalseにする必要あり
            preload: __dirname + '/preload.js' // nodeIntegrationとセット（モジュールの使用許可）。読み込んだモジュールをグローバルに共有→それをレンダラープロセスで使用」という形で、レンダラープロセスでのNode APIの利用を可能にできる
        }
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    //mainWindow.setMinimumSize(650, 300);
    mainWindow.setTitle('Simplem'); //メインプロセスでしか使えないので、レンダー側で使う場合はipc使う必要あり。index.html側でタイトルを設定している場合は効かない。
    //mainWindow.hide(); //読み込み中の白い画面を表示しない（どっちがいいかUX検証要）


}

//常に最前面表示のオンオフ用
global.switch_t = true;
//ソースコードモードのオンオフ用
global.flg_source_code_mode = 'on_hl_on';
//コードハイライトモードのオンオフ用
global.flg_code_hl_mode = 'on_code_hl_modern';
//マイナー言語サポートのオンオフ用
global.flg_minor_languages_support = false;
//半透明モードのオンオフ用
global.flg_half_opacity_mode = false;
//メニューバー内容
let template = [{
    label: 'Simplem',
    submenu: [{
        label: 'Simplemについて',
        click: function () {
            openAboutWindow({
                icon_path: path_tool.join(__dirname, "../assets/s_icon.png"),
                package_json_dir: "../",
                description: "Minimal notepad-like markdown editor.\nTo write down your amazing ideas immediately.",
                homepage: "https://github.com/isahamawan/Simplem",
                copyright: 'Copyright (c) 2021 isahamawan',
            });
        }
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
            mainWindow.webContents.send('open_from_main'); //レンダラ（index.html）へ'open_from_main'を命令
        }
    }, {
        label: '上書き保存',
        accelerator: 'CmdOrCtrl+S',
        click: function () {
            mainWindow.webContents.send('save_from_main');
        }
    }, {
        label: '名前を付けて保存',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: function () {
            mainWindow.webContents.send('save_as_from_main');
        }
    },
    { type: 'separator' },
    {
        label: '印刷',
        //accelerator: 'CmdOrCtrl+Shift+K',
        click: function () {

            mainWindow.webContents.send('print_from_main');

        }
    },
    {
        label: 'PDFとして出力',
        //accelerator: 'CmdOrCtrl+Shift+K',
        click: function () {

            mainWindow.webContents.send("print_to_pdf_from_main");

        }
    },
    {
        label: 'htmlとしてクリップボードへコピー',
        //accelerator: 'CmdOrCtrl+Shift+K',
        click: function () {

            mainWindow.webContents.send("html_to_clipboard_from_main");

        }
    },
    { type: 'separator' },
    {
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
        {
            label: '全て選択',
            accelerator: 'CmdOrCtrl+A',
            acceleratorWorksWhenHidden: false, //mac easymde側のバインドキー押下と被らないようにmainプロセス側はキーバインディング無効化
            registerAccelerator: false, //win,linux
            click: function () {
                mainWindow.webContents.send('selectall_from_main');
            }
        },
        { type: 'separator' },
        //{
        //    label: '検索',
        //    accelerator: 'CmdOrCtrl+F',
        //    click: function () {
        //        let webcontents_for_search = mainWindow.webContents;
        //        //console.log(webcontents_for_search);
        //        mainWindow.webContents.send('webdata', webcontents_for_search); //レンダラ（index.html）へ''を命令
        //    }
        //},
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
        {
            label: '常に最前面に表示',
            accelerator: 'CmdOrCtrl+T',
            type: 'checkbox',
            click: function () {
                mainWindow.setAlwaysOnTop(global.switch_t);
                if (global.switch_t == true) {
                    global.switch_t = false;
                } else {
                    global.switch_t = true;
                };
            }
        },
        { type: 'separator' },
        {
            label: 'ソースコードモード',
            submenu: [
                {
                    label: 'ハイライト有り',
                    //accelerator: 'CmdOrCtrl+T',
                    type: 'radio',
                    click: function () {

                        flg_source_code_mode = 'on_hl_on';
                        mainWindow.webContents.send("toggle_source_code_mode_from_main", flg_source_code_mode);

                    }
                },
                {
                    label: 'ハイライト無し',
                    //accelerator: 'CmdOrCtrl+T',
                    type: 'radio',
                    click: function () {

                        flg_source_code_mode = 'on_hl_off';
                        mainWindow.webContents.send("toggle_source_code_mode_from_main", flg_source_code_mode);

                    }
                },
                {
                    label: 'OFF',
                    //accelerator: 'CmdOrCtrl+T',
                    type: 'radio',
                    checked: true,
                    click: function () {

                        flg_source_code_mode = 'off_hl';
                        mainWindow.webContents.send("toggle_source_code_mode_from_main", flg_source_code_mode);

                    }
                },
            ]
        },
        { type: 'separator' },
        {
            label: '半透明モード',
            //accelerator: 'CmdOrCtrl+T',
            type: 'checkbox',
            click: function () {
                global.flg_half_opacity_mode = !global.flg_half_opacity_mode

                if (global.flg_half_opacity_mode == true) {
                    mainWindow.setOpacity(0.7);
                } else {
                    mainWindow.setOpacity(1);
                }
            }
        },
        { type: 'separator' },
        {
            label: 'コードハイライト',
            submenu: [
                {
                    label: 'モダン',
                    type: 'radio',
                    checked: true,
                    click: function () {

                        flg_code_hl_mode = 'on_code_hl_modern';
                        mainWindow.webContents.send("toggle_code_hl_mode_from_main", flg_code_hl_mode);

                    }
                },
                {
                    label: 'クラシック',
                    type: 'radio',
                    click: function () {

                        flg_code_hl_mode = 'on_code_hl_classic';
                        mainWindow.webContents.send("toggle_code_hl_mode_from_main", flg_code_hl_mode);

                    }
                },
                {
                    label: 'OFF',
                    type: 'radio',
                    click: function () {

                        flg_code_hl_mode = 'off_code_hl';
                        mainWindow.webContents.send("toggle_code_hl_mode_from_main", flg_code_hl_mode);

                    }
                },
                { type: 'separator' },
                {
                    label: 'マイナー言語のサポート',
                    type: 'checkbox',
                    click: function () {

                        flg_minor_languages_support = !flg_minor_languages_support;
                        mainWindow.webContents.send("toggle_minor_languages_support_from_main", flg_minor_languages_support);

                    }
                },
            ]
        },
        { type: 'separator' },
        { role: 'toggleDevTools' },
        { role: 'forceReload' },
    ]
}, {
    label: "ウィンドウ",
    submenu: [
        { role: 'zoom', label: '最大化' },
        { role: 'minimize', label: '最小化' },
        //{ role: 'windowMenu' },
    ]
}, {
    label: "フォント",
    submenu: [
        {
            label: 'モダンOS',
            type: 'radio',
            checked: true,
            //accelerator: 'CmdOrCtrl+Shift+K',
            click: function () {

                mainWindow.webContents.send("change_font_from_main", "modern_os");

            }
        },
        {
            label: 'Simplem',
            type: 'radio',
            //accelerator: 'CmdOrCtrl+Shift+K',
            click: function () {

                mainWindow.webContents.send("change_font_from_main", "simplem");

            }
        },
        {
            label: 'Myricam',
            type: 'radio',
            //accelerator: 'CmdOrCtrl+Shift+K',
            click: function () {

                mainWindow.webContents.send("change_font_from_main", "myricam");

            }
        },
        {
            label: 'ビューティフルドット',//'レトロ8ビットRPG',
            type: 'radio',
            //accelerator: 'CmdOrCtrl+Shift+K',
            click: function () {

                mainWindow.webContents.send("change_font_from_main", "retro_rpg");

            }
        },
        //{
        //    label: 'ビューティフルピクセル',
        //    type: 'radio',
        //accelerator: 'CmdOrCtrl+Shift+K',
        //    click: function () {

        //        mainWindow.webContents.send("change_font_from_main", "beautiful_pixel");

        //    }
        //},
        {
            label: '美しい明朝体',
            type: 'radio',
            //accelerator: 'CmdOrCtrl+Shift+K',
            click: function () {

                mainWindow.webContents.send("change_font_from_main", "beautiful_mincho");

            }
        },
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

    //レンダラーが読み込み完了後に実行
    mainWindow.webContents.on('did-finish-load', () => {
        //ビルド後の実行ファイルの引数として、ファイルパスが渡された場合はファイルを読み込み（ビルド前と後で引数の位置が変わるので注意）
        //for (let i = 0; i < process.argv.length; ++i) {
        //    console.log(i + ': ' + process.argv[i]);
        //};


        //引数から初期読み込み用のファイルパスを取得(win用)
        let args = process.argv
        args.forEach(function (arg) {

            //引数の最後の.以降の文字（拡張子）がtxtとmdのときに初期読み込み用のファイルパスとして保管
            if (path_tool.extname(arg) == (".txt" || ".md")) {
                global.filePath_for_init = arg;
            };
        });

        if (global.filePath_for_init) {
            mainWindow.webContents.send('open_init_from_main'); //レンダラ（index.html）へ'open_init_from_main'を命令
        };



        // 初期読み込み用のファイルパスを取得２／２（mac用）
        if (global.filePath_for_init_mac) {
            // ファイルパスを取得
            global.filePath_for_init = global.filePath_for_init_mac;


            mainWindow.webContents.send('open_init_from_main'); //レンダラ（index.html）へ'open_init_from_main'を命令

            // グローバル変数を初期化
            global.filePath_for_init_mac = null;
        };


        // mac用  ready イベント「以後」の 'open-file' イベントを拾ってファイルを読み込み
        app.on('open-file', (e, argv) => {
            e.preventDefault();

            // ウィンドウが最小化されていたらレストアしてフォーカスを当てる
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();

            global.filePath_for_init = argv;

            mainWindow.webContents.send('open_init_from_main'); //レンダラ（index.html）へ'open_init_from_main'を命令

        });

        //mainWindow.show();//白い画面を表示しないように読み込み完了時に表示(UX検証要)
    });

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

//エラーをログに記録する。ログは~/library/logs/アプリ名のあたり作成される。
process.on('uncaughtException', (err) => {
    log_tool.error(err); // ログファイルへ記録

    //メインのエラーをレンダラーのdevツールに表示
    mainWindow.webContents.send('error_from_main', err);

    //app.quit();     // アプリを終了する (継続しない方が良い)
});

