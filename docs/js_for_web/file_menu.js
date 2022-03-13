
// アプリ風で別ウィンドウで開く--------------------------------------------------------------------
window.simple_window = null; // グローバル変数
function simple_window_open() {
    if (simple_window == null || simple_window.closed)
        /* メモリ内のウィンドウオブジェクトへのポインターが存在しないか、
        そのようなポインターが存在するが、そのウィンドウが閉じられている場合 */ {

        simple_window = window.open(document.location.href, 'simple_window', 'resizable,scrollbars,status,width=630,height=630');

    } else {

        simple_window.focus();
        /* focus() メソッドで他のウィンドウの
        最前面にそのウィンドウを移動させることができます。ウィンドウを再生成し、
        参照されているリソースを更新させる必要はありません。 */
    }
}

let simple_window_open_ele = document.getElementById("simple_window_open");
simple_window_open_ele.addEventListener("click", simple_window_open);




// ファイルの読み込み------------------------------------------------------------------------------
let file_select_ele = document.getElementById("file_select");

file_select_ele.addEventListener("change", function (evt) {

    let file = evt.target.files;

    let reader = new FileReader();

    reader.readAsText(file[0]);


    reader.onload = function (e) {

        if (easyMDE.isPreviewActive() == true) {
            easyMDE.togglePreview();
        }

        //file_nameテキストボックスの更新
        document.getElementById("file_name").value = file[0].name;

        //file_name_gdriveテキストボックスの更新
        document.getElementById("file_name_gdrive").value = file[0].name;

        //titleの変更
        document.getElementsByTagName("title")[0].innerText = file[0].name + " - Simplem";

        //本文の読み込み
        easyMDE.value(reader.result);

        //diffのオリジナル用として保存
        window.diff_origin_text_data = reader.result;

    }

}, false);








// ファイルを名前を付けて保存------------------------------------------------------------------------------

window.addEventListener("load", () => {
    let save_as_ele = document.getElementById("save_as");
    save_as_ele.addEventListener("click", save_as)
});

//save_as_ele.addEventListener("click", function (evt) {
function save_as(evt) {
    evt.preventDefault();

    let text_data = easyMDE.value();

    //diffのオリジナル用として保存
    window.diff_origin_text_data = text_data;

    let blob = new Blob([text_data], { type: "text/plain" });

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");

    a.href = url;


    a.download = document.getElementById("file_name").value


    /*
    if (document.getElementById("file_name").files[0] != undefined) {
        a.download = document.getElementById("file_select").files[0].name;
    } else {
        a.download = "Simplem.txt"
    }
    */

    //titleの変更
    document.getElementsByTagName("title")[0].innerText = a.download + " - Simplem";


    //file_name_gdriveテキストボックスの更新
    document.getElementById("file_name_gdrive").value = a.download;


    document.body.appendChild(a);


    a.click();

    a.remove();

    URL.revokeObjectURL(url);

};




// google driveからファイルを開く--------------------------------------------------------------------
function file_open_from_gdrive() {

    //g_picker.js内にて定義（コールバック関数内にいろいろ処理あり）
    loadPicker();

}

let file_open_gdrive_ele = document.getElementById("file_open_gdrive");
file_open_gdrive_ele.addEventListener("click", file_open_from_gdrive);





// tttttttttttttttttttttttttttt google driveに上書き--------------------------------------------------------------------
function save_to_gdrive() {

    if (window.picked_name) {
        gdrive_instance.writeFile(window.picked_name, "text/plain", easyMDE.value());
    } else {
        alert("まだ名前を付けて保存されていません");
    }

}

let save_to_gdrive_ele = document.getElementById("save_to_gdrive");
save_to_gdrive_ele.addEventListener("click", save_to_gdrive);




// tttttttttttttttttttttttttttt google driveに名前を付けて保存--------------------------------------------------------------------
function save_as_to_gdrive() {

    //g_picker.js内にて定義（コールバック関数内にいろいろ処理あり）
    loadPicker();

}

let save_as_to_gdrive_ele = document.getElementById("save_as_to_gdrive");
save_as_to_gdrive_ele.addEventListener("click", save_as_to_gdrive);







// 印刷-----------------------------------------------------------------------------------------

const _sleep = (_ms) => new Promise((resolve) => setTimeout(resolve, _ms));

async function sleep(ms) {

    await _sleep(ms);
    //console.log('msミリ秒経過しました！');

}

async function print_web() {
    if (easyMDE.isPreviewActive() == false) {
        await easyMDE.togglePreview();

        //100ms待機
        await sleep(100);
    }

    await window.print();

    //編集モードに切替
    if (easyMDE.isPreviewActive() == true) {
        await easyMDE.togglePreview();

    }

}


let print_ele = document.getElementById("print");
print_ele.addEventListener("click", print_web);






// htmlをクリップボードへコピー------------------------------------------------------------------------------

function copyToClickBoard(content) {

    navigator.clipboard.writeText(content)
        .then(() => {
            console.log("Text copied to clipboard...")
        })
        .catch(err => {
            console.log('Something went wrong', err);
        })

}

function copy_to_clipboard() {

    //プレビューhtmlの取得
    //let preview_html_plaintext = easyMDE.options.previewRender(easyMDE.value()); //でも可（同義）
    //第２引数をfalseでheaderのid添加をオフ
    let preview_html_plaintext = easyMDE.options.parent.markdown(easyMDE.value(), false);

    let domparser = new DOMParser();
    let preview_html_document = domparser.parseFromString(preview_html_plaintext, "text/html"); //DOM操作可能なdocumentオブジェを取得
    let parsered_preview_html_plaintext = preview_html_document.getElementsByTagName("body")[0].innerHTML;

    copyToClickBoard(parsered_preview_html_plaintext);

}

let copy_to_html_ele = document.getElementById("ctc");
copy_to_html_ele.addEventListener("click", copy_to_clipboard);





// 表示モードの変更------------------------------------------------------------------------------
function view_mode_select() {

    //文字サイズ統一オプションの解除
    if (window.flg_same_font_size == true) {
        document.getElementsByClassName("EasyMDEContainer")[0].classList.remove("same_font_size");
    }

    // id属性からHTML要素（リンク要素）を取得
    let editor_view_mode_css_link = document.getElementById("editor_view_mode_css");

    let view_kind = view_mode_ele.elements['trigger'].value;

    //flg_source_code_modeの設定
    if (view_kind == 0) {
        flg_source_code_mode = "off_hl";
    } else if (view_kind == 1) {
        flg_source_code_mode = "mark_view";
    } else if (view_kind == 2) {
        flg_source_code_mode = "on_hl_off";
    } else {
        flg_source_code_mode = "on_hl_on";
    }


    //リンク要素のhref書き換え
    if (flg_source_code_mode == "on_hl_on") {
        editor_view_mode_css_link.href = "css/editor_view_mode/evm_source_code_mode.css";
    } else if (flg_source_code_mode == "on_hl_off") {
        editor_view_mode_css_link.href = "css/editor_view_mode/evm_source_code_mode_hloff.css";
    } else if (flg_source_code_mode == "mark_view") {

        //文字サイズ統一オプションの設定
        if (window.flg_same_font_size == true) {
            document.getElementsByClassName("EasyMDEContainer")[0].classList.add("same_font_size");
        }

        editor_view_mode_css_link.href = "css/editor_view_mode/evm_mark_view.css";
    } else {

        //文字サイズ統一オプションの設定
        if (window.flg_same_font_size == true) {
            document.getElementsByClassName("EasyMDEContainer")[0].classList.add("same_font_size");
        }

        editor_view_mode_css_link.href = "css/editor_view_mode/evm_normal.css";
    }

    //カーソルのサイズをリセット
    easyMDE.codemirror.execCommand('selectAll');
    setTimeout(function () {
        easyMDE.codemirror.setCursor({ line: 0, ch: 0 });
    }, 10);

}

let view_mode_ele = document.getElementById('view_mode');
view_mode_ele.addEventListener('change', view_mode_select);






// フォントの変更------------------------------------------------------------------------------
function font_select() {

    let font_kind = font_select_ele.elements['trigger'].value;

    // id属性からHTML要素を取得
    let font_css_link = document.getElementById("font_css");

    //fontリンクのhref書き換え
    if (font_kind == 0) {
        font_css_link.href = "css/font/font_modern_os.css";
    } else if (font_kind == 2) {
        font_css_link.href = "css/font/font_simplem.css";
    } else if (font_kind == 3) {
        font_css_link.href = "css/font/font_myricam.css";
    } else if (font_kind == 4) {
        font_css_link.href = "css/font/font_retro_rpg.css";
    } else if (font_kind == "beautiful_pixel") {
        font_css_link.href = "css/font/font_pixel.css";
    } else if (font_kind == 5) {
        font_css_link.href = "css/font/font_beautiful_mincho.css";
    } else if (font_kind == 6) {
        font_css_link.href = "css/font/font_ud_gothic.css";
    } else if (font_kind == 7) {
        font_css_link.href = "css/font/font_ud_mincho.css";
    } else if (font_kind == 1) {
        font_css_link.href = "css/font/font_modern_browser.css";
    }

    //カーソルのサイズをリセット
    easyMDE.codemirror.execCommand('selectAll');
    setTimeout(function () {
        easyMDE.codemirror.setCursor({ line: 0, ch: 0 });
    }, 10);

}

let font_select_ele = document.getElementById('font');
font_select_ele.addEventListener('change', font_select);



// h1で改ページオプション------------------------------------------------------------------------------

window.flg_no_page_break_h1_in_note = false;

function toggle_h1_page_break() {

    flg_no_page_break_h1_in_note = !flg_no_page_break_h1_in_note

    if (flg_no_page_break_h1_in_note == true) {
        document.getElementsByClassName("CodeMirror-wrap")[0].classList.add("no_page_break_h1");
    } else {
        document.getElementsByClassName("CodeMirror-wrap")[0].classList.remove("no_page_break_h1");
    }
}

let h1_page_break_cbox = document.getElementById('h1_page_break');
h1_page_break_cbox.addEventListener('change', toggle_h1_page_break);






// hrで改ページオプション------------------------------------------------------------------------------

window.flg_page_break_hr_in_note = false;

function toggle_hr_page_break() {

    flg_page_break_hr_in_note = !flg_page_break_hr_in_note

    if (flg_page_break_hr_in_note == true) {
        document.getElementsByClassName("EasyMDEContainer")[0].classList.add("page_break_hr");
    } else {
        document.getElementsByClassName("EasyMDEContainer")[0].classList.remove("page_break_hr");
    }

}

let hr_page_break_cbox = document.getElementById('hr_page_break');
hr_page_break_cbox.addEventListener('change', toggle_hr_page_break);






// 行間を広くするオプション------------------------------------------------------------------------------

window.flg_line_height_wide = false;

function toggle_wide_row() {

    flg_line_height_wide = !flg_line_height_wide

    if (flg_line_height_wide == true) {
        document.getElementsByClassName("EasyMDEContainer")[0].classList.add("line_height_wide");
    } else {
        document.getElementsByClassName("EasyMDEContainer")[0].classList.remove("line_height_wide");
    }


    //カーソルのサイズをリセット
    easyMDE.codemirror.execCommand('selectAll');
    setTimeout(function () {
        easyMDE.codemirror.setCursor({ line: 0, ch: 0 });
    }, 10);
}

let wide_row_cbox = document.getElementById('wide_row');
wide_row_cbox.addEventListener('change', toggle_wide_row);






// ウィンドウモードスライドショーオプション------------------------------------------------------------------------------

function toggle_window_slide_show() {

    flg_slideshow_fullscreen = !flg_slideshow_fullscreen

}

let window_slide_show_cbox = document.getElementById('window_slide_show');
window_slide_show_cbox.addEventListener('change', toggle_window_slide_show);





// フォントサイズの統一オプション------------------------------------------------------------------------------

//mainからのtoggle_same_font_size_from_main命令を処理
window.flg_same_font_size = true;
document.getElementsByClassName("EasyMDEContainer")[0].classList.add("same_font_size");

function toggle_same_font_size() {
    flg_same_font_size = !flg_same_font_size

    if (flg_same_font_size == true) {
        document.getElementsByClassName("EasyMDEContainer")[0].classList.add("same_font_size");
    } else {
        document.getElementsByClassName("EasyMDEContainer")[0].classList.remove("same_font_size");
    }


    //カーソルのサイズをリセット
    easyMDE.codemirror.execCommand('selectAll');
    setTimeout(function () {
        easyMDE.codemirror.setCursor({ line: 0, ch: 0 });
    }, 10);
}

let same_font_size_cbox = document.getElementById('same_font_size');
same_font_size_cbox.addEventListener('change', toggle_same_font_size);


