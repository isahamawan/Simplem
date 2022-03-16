
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


        //gdrive上書き保存判定の初期化用
        window.fileId_now = null;

        window.file_name_now = file[0].name;

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

    //gdriveに保存した名前と違うときは、gdrive上書き判定の初期化
    if (window.file_name_now != document.getElementById("file_name").value) {
        window.fileId_now = null;
    }

    window.file_name_now = a.download;


    document.body.appendChild(a);


    a.click();

    a.remove();

    URL.revokeObjectURL(url);

};




// google driveからファイルを開く--------------------------------------------------------------------
function file_open_from_gdrive() {

    if (pickerApiLoaded) {
        //loadPickerが実行済みであればこちらを実行（pickerが２重になるのを回避）
        onAuthApiLoad();
    } else {
        //g_picker.js内にて定義（コールバック関数内にいろいろ処理あり）
        loadPicker();
    }

}

let file_open_gdrive_ele = document.getElementById("file_open_gdrive");
file_open_gdrive_ele.addEventListener("click", file_open_from_gdrive);





// google driveに上書き--------------------------------------------------------------------
function save_to_gdrive() {

    if (window.fileId_now) {

        //pick時、もしくは名前を付けて保存時のidのファイルへ保存
        Gdfs.updateFile(window.fileId_now, "text/plain", easyMDE.value());


        //diffのオリジナル用として保存
        window.diff_origin_text_data = easyMDE.value();


        //gdrive_instance.writeFile(window.file_name_now, "text/plain", easyMDE.value());

        //titleの変更
        document.getElementsByTagName("title")[0].innerText = window.file_name_now + " - Simplem";

        //file_nameテキストボックスの更新
        document.getElementById("file_name").value = window.file_name_now;
        //file_name_gdriveテキストボックスの更新
        document.getElementById("file_name_gdrive").value = window.file_name_now;


        alert("上書き保存しました");

    } else {
        alert("まだ名前を付けて保存されていません");
    }

}

let save_to_gdrive_ele = document.getElementById("save_to_gdrive");
save_to_gdrive_ele.addEventListener("click", save_to_gdrive);




// ttttttttttttttttttttttttt google driveに名前を付けて保存--------------------------------------------------------------------


//textファイルをクリックした場合、そのtextファイルのidを取得し、保存ボタンを押したら、上書きモードで処理（input boxのテキストも更新）
function get_file_id(e) {
    window.file_id_for_save_as = e.id;
    window.over_write_in_modal = true;
    window.folder_selected_in_modal = false;
    window.file_name_for_save_as = document.getElementById("file_name_gdrive_exec").value = e.innerText;
}




//フォルダをクリックした場合、そのフォルダ以下のフォルダとtextファイルを取得
function get_folder_id(e) {
    window.folder_id_for_save_as = e.id;
    window.over_write_in_modal = false;
    window.folder_selected_in_modal = true;

    //ここに、クリックしたフォルダ以下を開く処理を追加
}

//戻るフォルダをクリックした場合、そのフォルダ以下のフォルダとtextファイルを取得
function get_folder_back_id(e) {
    window.folder_id_for_save_as = e.id;
    window.over_write_in_modal = false;
    window.folder_selected_in_modal = true;
    //ここに、クリックしたフォルダ以下を開く処理を追加
}

//何もクリックしないで保存ボタンを押したら、現在のフォルダのidで新規作成モードで処理（input boxのテキストをファイル名とする）
////新規作成保存の前にinput box内のファイル名で、現在フォルダのファイルを検索し、該当があればそのidで上書き保存処理。なければ新規作成保存処理。
function save_as_to_gdrive_exec() {
    if (window.over_write_in_modal == true) {

        console.log("over write:" + window.file_name_for_save_as);
    } else {


        window.file_name_for_save_as = document.getElementById("file_name_gdrive_exec").value;
        console.log("save as:" + window.file_name_for_save_as);
    }

}

function save_as_to_gdrive_cancel() {
    console.log("cancel");
    document.getElementById("modal_close").click();
}


//googledribe名前を付けて保存をクリック時の動作
let file_div_eles = [];
let file_a_eles = [];
function save_as_to_gdrive() {

    /* ファイル階層を表示した上での 名前を付けて保存 下書き */


    //gapi.client.drive.files.list({q:"mimeType ='text/plain' and '1kKSL2hrL29k7DswP-Bf3Yx-1tnUEyQC4' in parents and trashed = false"}).then(function(re){console.log(re)})




    //modalのDOM要素をget
    let save_as_modal_div = document.getElementById("save_as_modal");


    //simplemフォルダ直下かつ、フォルダとテキストファイルかつ、ゴミ箱に入っていないファイル、を検索するクエリ（simplemフォルダを選択状態に初期設定）
    window.folder_selected_in_modal = true;
    window.over_write_in_modal = false;
    window.file_name_for_save_as = document.getElementById("file_name_gdrive_exec").value;
    let q_simplem = "(mimeType ='text/plain' or mimeType ='application/vnd.google-apps.folder') and " + "'" + window.simplem_folder_id + "'" + " in parents and trashed = false";

    //simplemフォルダ以下のフォルダとtextファイルを取得
    gapi.client.drive.files.list({ q: q_simplem }).then(
        function (re) {
            //console.log(re.result.files);



            //modalコンテンツの初期化（全削除）
            file_div_eles.forEach(e => { e.remove() });
            file_div_eles = [];
            file_a_eles = [];

            //ファイル一覧の表示とid等の設定
            re.result.files.forEach(
                (file, i) => {

                    //file要素の作成
                    file_div_eles[i] = document.createElement("div");
                    file_a_eles[i] = document.createElement("a");

                    if (file.mimeType == "text/plain") {
                        file_div_eles[i].setAttribute("class", "file_div_in_modal");
                        file_a_eles[i].setAttribute("class", "file_a_in_modal");
                        file_a_eles[i].setAttribute("onclick", "get_file_id(this);");
                    } else {
                        file_div_eles[i].setAttribute("class", "folder_div_in_modal");
                        file_a_eles[i].setAttribute("class", "folder_a_in_modal");
                        file_a_eles[i].setAttribute("onclick", "get_folder_id(this);");
                    }

                    //ファイルid、フォルダidの書き込み
                    file_a_eles[i].setAttribute("id", file.id);

                    file_div_eles[i].appendChild(file_a_eles[i]);

                    //file名の書き込み
                    file_a_eles[i].innerText = file.name;


                    //file要素のmodalへの追加
                    save_as_modal_div.appendChild(file_div_eles[i]);


                });


        });


    document.getElementById("modal_button").click();




















    /* 名前を付けて保存modal実装中のため、以下を一旦無効化


    window.file_name_now = document.getElementById("file_name_gdrive").value;

    //gdrive_instance.writeFile(window.file_name_now, "text/plain", easyMDE.value());


    //名前を付けて保存
    Gdfs.createFile(window.simplem_folder_id, window.file_name_now, "plain/text").then(

        function (re) {
            //console.log(re.id);

            //名前を付けて保存したファイルのid（上書き保存用）
            window.fileId_now = re.id;

            Gdfs.updateFile(re.id, "text/plain", easyMDE.value());

        }

    );

    //diffのオリジナル用として保存
    window.diff_origin_text_data = easyMDE.value();


    //titleの変更
    document.getElementsByTagName("title")[0].innerText = window.file_name_now + " - Simplem";

    //file_nameテキストボックスの更新
    document.getElementById("file_name").value = window.file_name_now;

    alert("名前を付けて保存しました");

    */
}

let save_as_to_gdrive_ele = document.getElementById("save_as_to_gdrive");
save_as_to_gdrive_ele.addEventListener("click", save_as_to_gdrive);


// google driveを開く--------------------------------------------------------------------
function open_gdrive() {

    window.open('https://drive.google.com/drive/folders/' + window.simplem_folder_id);

}

let open_gdrive_ele = document.getElementById("open_google_drive");
open_gdrive_ele.addEventListener("click", open_gdrive);




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


