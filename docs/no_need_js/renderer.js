


//ipc経由の機能------------------------------------------------------------------<
//nodeIntegrationをfalseにしたことで、以下は使えなくなった
//const {ipcRenderer, app} = require('electron');
//
//preload.jsで定義したことで、代わりに以下が使用可能
let ipcRenderer = window.ipcRenderer;
const app = window.app;


//mainからのファイル読み込み命令を処理
ipcRenderer.on('open_from_main', async () => {
    const { canceled, data, fileDirPath } = await ipcRenderer.invoke('open') //mainのopenを呼び出し（data取得）
    if (canceled) return
    let file_text_data = '';
    file_text_data = data[0] || '';

    if (easyMDE.isPreviewActive() == true) {
        await easyMDE.togglePreview();
    }

    await easyMDE.value(file_text_data);

    //diffのオリジナル用として保存
    window.diff_origin_text_data = file_text_data;

    //画像表示などのベースurlとして保存
    window.fileDirPath = fileDirPath;

    //ファイル名の頭のアスタリスクを削除
    await ipcRenderer.invoke('open_asterisk_del');

    //ファイルの読込時の*追加スクリプトの追加
    await ipcRenderer.invoke('open_asterisk_script_add')

});

//mainからの上書き保存命令を処理
ipcRenderer.on('save_from_main', async () => {
    const text_data = easyMDE.value();
    await ipcRenderer.invoke('save', text_data); //mainのsaveを呼び出し(text_data受渡)

    //diffのオリジナル用として保存
    window.diff_origin_text_data = text_data;
});

//mainからの名前を付けて保存命令を処理
ipcRenderer.on('save_as_from_main', async () => {
    const text_data = easyMDE.value();

    const { fileDirPath } = await ipcRenderer.invoke('save_as', text_data);

    //diffのオリジナル用として保存
    window.diff_origin_text_data = text_data;

    //画像表示などのベースurlとして保存
    window.fileDirPath = fileDirPath;
});

//mainからの引数で渡されたファイル読み込み命令を処理
ipcRenderer.on('open_init_from_main', async () => {
    const { data, fileDirPath } = await ipcRenderer.invoke('open_init'); //mainのopen_initを呼び出し（data取得）
    let file_text_data = '';
    file_text_data = data || '';
    await easyMDE.value(file_text_data);

    //diffのオリジナル用として保存
    window.diff_origin_text_data = file_text_data;

    //画像表示などのベースurlとして保存
    window.fileDirPath = fileDirPath;

    //ファイル名の頭のアスタリスクを削除
    await ipcRenderer.invoke('open_asterisk_del');

    //ファイルの読込時の*追加スクリプトの追加
    await ipcRenderer.invoke('open_asterisk_script_add')

});

//mainからのselectall命令を処理
ipcRenderer.on('selectall_from_main', async () => {
    easyMDE.codemirror.execCommand('selectAll');

});

//mainからのfind命令を処理
ipcRenderer.on('find_from_main', async () => {
    easyMDE.codemirror.execCommand('find');

});

//mainからのreplace命令を処理
ipcRenderer.on('replace_from_main', async () => {
    easyMDE.codemirror.execCommand('replace');

});

//mainからのclipboardへのhtmlコピー命令を処理
ipcRenderer.on('html_to_clipboard_from_main', async () => {


    //プレビューhtmlの取得
    //let preview_html_plaintext = easyMDE.options.previewRender(easyMDE.value()); //でも可（同義）
    //第２引数をfalseでheaderのid添加をオフ
    let preview_html_plaintext = easyMDE.options.parent.markdown(easyMDE.value(), false);

    let domparser = new DOMParser();
    let preview_html_document = domparser.parseFromString(preview_html_plaintext, "text/html"); //DOM操作可能なdocumentオブジェを取得
    let parsered_preview_html_plaintext = preview_html_document.getElementsByTagName("body")[0].innerHTML;
    await ipcRenderer.invoke('html_to_clipboard', parsered_preview_html_plaintext);
});

//mainからの印刷命令を処理
ipcRenderer.on('print_from_main', async () => {

    if (easyMDE.isPreviewActive() == false) {
        await easyMDE.togglePreview();

        //10ms待機
        const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await _sleep(10);
    }

    ipcRenderer.invoke('print');

});

//mainからのPDF出力命令を処理
ipcRenderer.on('print_to_pdf_from_main', async () => {

    if (easyMDE.isPreviewActive() == false) {
        await easyMDE.togglePreview();

        //10ms待機
        const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await _sleep(10);
    }

    ipcRenderer.invoke('print_to_pdf');

});

//mainからのプレビュー切替命令を処理
ipcRenderer.on('preview_off_from_main', async () => {
    //編集モードに切替
    if (easyMDE.isPreviewActive() == true) {
        await easyMDE.togglePreview();

        //10ms待機
        //const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        //_sleep(10);
    }

});



//mainからのtoggle code hl mode命令の処理
ipcRenderer.on('toggle_code_hl_mode_from_main', async (event, flg_code_hl_mode) => {

    //文字サイズ統一オプションの解除
    if (window.flg_same_font_size == true) {
        document.getElementsByClassName("EasyMDEContainer")[0].classList.remove("page_break_hr");
    }

    // id属性からHTML要素（リンク要素）を取得
    let code_hl_mode_css_link = document.getElementById("code_hl_mode_css");

    //リンク要素のhref書き換え
    if (flg_code_hl_mode == "on_code_hl_modern") {
        code_hl_mode_css_link.href = "css/highlight_code/hljs_modern.min.css";
    } else if (flg_code_hl_mode == "on_code_hl_classic") {
        code_hl_mode_css_link.href = "css/highlight_code/hljs_classic.min.css";
    } else {
        code_hl_mode_css_link.href = "css/highlight_code/hljs_off.min.css";
    }

});

//mainからのマイナー言語サポート命令の処理
ipcRenderer.on('toggle_minor_languages_support_from_main', async (event, flg_minor_languages_support) => {

    //スクリプト要素の置換（srcの書き換えではjsが再読み込みされないため、置換を行う）
    if (flg_minor_languages_support == true) {
        function load_hl_all_js() {
            let hl_js_script_tag = document.getElementById("hl_js");
            let temp_script_tag = document.createElement("script");
            temp_script_tag.id = "hl_js"
            temp_script_tag.src = "js/highlight/highlight_all.min.js";
            hl_js_script_tag.replaceWith(temp_script_tag);
        }
        load_hl_all_js();
    } else {
        function load_hl_js() {
            let hl_js_script_tag = document.getElementById("hl_js");
            let temp_script_tag = document.createElement("script");
            temp_script_tag.id = "hl_js"
            temp_script_tag.src = "js/highlight/highlight.min.js";
            hl_js_script_tag.replaceWith(temp_script_tag);
        }
        load_hl_js();
    }

});



//mainからのファイル名頭アスタリスク追加用スクリプト追加命令の処理
ipcRenderer.on('add_asterisk_script_from_main', async (event) => {

    //要素の作成
    let add_asterisk_script = await document.createElement('script');
    add_asterisk_script.id = "add_asterisk_js"


    //add_asterisk_script.textContent = "if (flg_ast_added == true) {easyMDE.codemirror.on('change', function () { ipcRenderer.invoke('add_asterisk_to_filename'); flg_ast_added = false; });};";
    add_asterisk_script.textContent = "easyMDE.codemirror.on('change', function testa() { ipcRenderer.invoke('add_asterisk_to_filename'); let remove_elem = document.getElementById('add_asterisk_js').remove();easyMDE.codemirror.off('change', testa); });";

    let html_tag = await document.getElementsByTagName("html");

    //最後の子要素として追加
    await html_tag[0].appendChild(add_asterisk_script);

});


//mainからのエラー表示命令を処理
ipcRenderer.on('error_from_main', async (event, err) => {

    console.log('!!error in main.js!!: ' + err);
});



//ipc経由の機能------------------------------------------------------------------>
