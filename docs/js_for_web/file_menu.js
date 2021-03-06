
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

    let blob = new Blob([text_data], { type: "text/plain" });

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");

    a.href = url;


    a.download = document.getElementById("file_name").value



    //diffのオリジナル用として保存
    window.diff_origin_text_data = text_data;

    //titleの変更
    document.getElementsByTagName("title")[0].innerText = a.download + " - Simplem";



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
async function save_to_gdrive(file_id, file_name) {

    if (Gdfs.isSignedIn() == false) {
        await Gdfs.signIn();
    }

    //引数でidを与えられたら、そのidで上書き
    if (file_id != undefined) {
        window.fileId_now = file_id;
        window.file_name_now = file_name;
    }


    if (window.fileId_now) {

        //pick時、もしくは名前を付けて保存時のidのファイルへ保存
        Gdfs.updateFile(window.fileId_now, "text/plain", easyMDE.value());


        update_etc_at_save(window.file_name_now);

        alert("上書き保存しました");

    } else {
        alert("まだ名前を付けて保存されていません");
    }

}

//let save_to_gdrive_ele = document.getElementById("save_to_gdrive");
//save_to_gdrive_ele.addEventListener("click", save_to_gdrive);




// google driveに名前を付けて保存--------------------------------------------------------------------
/* ファイル階層を表示した上での 名前を付けて保存*/

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


    //ファイル更新時のチラつきを隠す
    document.getElementById("save_as_modal").setAttribute("style", "display:none;");

    //クリックしたフォルダ以下を開く処理
    save_as_to_gdrive(window.folder_id_for_save_as);

    document.getElementById("save_as_modal").setAttribute("style", "");
}


//戻るフォルダをクリックした場合、そのフォルダ以下のフォルダとtextファイルを取得
function get_folder_back_id(e) {
    window.folder_id_for_save_as = e.id;
    window.over_write_in_modal = false;
    window.folder_selected_in_modal = true;

    //ここに、クリックしたフォルダ以下を開く処理を追加

    //ファイル更新時のチラつきを隠す
    document.getElementById("save_as_modal").setAttribute("style", "display:none;");


    //戻るボタンのid設定

    back_ids.pop();

    window.back_ids_index = window.back_ids_index - 1;

    //クリックしたフォルダ以下を開く処理（ただしfolder_back = true）
    save_as_to_gdrive(window.folder_id_for_save_as, true);

    document.getElementById("save_as_modal").setAttribute("style", "");

    console.log("get_back_folder");
}

//保存時のいろいろ（diff,title,file_nameテキストボックス）の更新
function update_etc_at_save(file_name_u) {

    //diffのオリジナル用として保存
    window.diff_origin_text_data = easyMDE.value();

    //titleの変更
    document.getElementsByTagName("title")[0].innerText = file_name_u + " - Simplem";

    //file_nameテキストボックスの更新
    document.getElementById("file_name").value = file_name_u;
}


//保存ボタンを押した時の動作
//何もクリックしないで保存ボタンを押したら、現在のフォルダのidで新規作成モードで処理（input boxのテキストをファイル名とする）
//ファイルをクリックしたあと保存ボタンを押したら、上書き処理

async function save_as_to_gdrive_exec() {
    if (window.over_write_in_modal == true) {
        //上書き処理

        //save_to...がwait処理なので、先にモーダルを閉じる。
        document.getElementsByClassName("modal-close")[0].click();

        //選択したファイルへ上書き処理
        await save_to_gdrive(window.file_id_for_save_as, window.file_name_for_save_as);

        console.log("over write:" + window.file_name_for_save_as);


    } else {
        //新規作成処理

        //save_to...がwait処理なので、先にモーダルを閉じる。
        document.getElementsByClassName("modal-close")[0].click();

        window.file_name_for_save_as = document.getElementById("file_name_gdrive_exec").value;

        //実行結果メッセージ
        let end_message = null;
        //新規作成保存の前にfile_name_gdrive_exec box内のファイル名で、現在フォルダのファイルを検索し、該当があればそのidで上書き保存処理。なければ新規作成保存処理。
        let q_same_name = "name = " + "'" + window.file_name_for_save_as + "'" + " and mimeType = 'text/plain' and " + "'" + window.folder_id_for_save_as + "'" + " in parents and trashed = false";
        //selected_folder_idフォルダ以下のフォルダとtextファイルを取得し、判定
        gapi.client.drive.files.list({ q: q_same_name }).then(
            function (re) {
                //console.log(re.result.files);
                //console.log(re.result.files.length);

                if (re.result.files.length == 0) {
                    //新規作成
                    Gdfs.createFile(window.folder_id_for_save_as, window.file_name_for_save_as, "plain/text").then(
                        function (re) {
                            //console.log(re.id);

                            //新規作成下したファイルのid（データ書き込み用）
                            window.fileId_now = re.id;
                            window.file_name_now = window.file_name_for_save_as;

                            Gdfs.updateFile(re.id, "text/plain", easyMDE.value());

                            console.log("new_create:" + window.file_name_now);

                            update_etc_at_save(window.file_name_now);

                            end_message = "名前を付けて保存しました";
                            alert(end_message);
                        });


                } else {
                    //上書き
                    //console.log(re.result.files[0].id);
                    window.fileId_now = re.result.files[0].id;
                    window.file_name_now = window.file_name_for_save_as;
                    console.log("update:" + window.file_name_now);
                    Gdfs.updateFile(re.result.files[0].id, "text/plain", easyMDE.value());

                    update_etc_at_save(window.file_name_now);

                    end_message = "上書き保存しました";
                    alert(end_message);
                }




                //diffのオリジナル用として保存
                //window.diff_origin_text_data = easyMDE.value();

                //titleの変更
                //document.getElementsByTagName("title")[0].innerText = window.file_name_now + " - Simplem";

                //file_nameテキストボックスの更新
                //document.getElementById("file_name").value = window.file_name_now;

            });
    }

}


//キャンセルボタンを押した時の動作
function save_as_to_gdrive_cancel() {
    console.log("cancel");
    document.getElementsByClassName("modal-close")[0].click();
}


//googledrive名前を付けて保存をクリック時の動作（モーダル内でフォルダをクリックした時の動作も含む）
let file_div_eles = [];
let file_a_eles = [];
let back_div_ele = null;
let back_ids = [];
window.back_ids_index = -1;
async function save_as_to_gdrive(folder_id, folder_back = false) {

    if (Gdfs.isSignedIn() == false) {
        await Gdfs.signIn();
    }

    let selected_folder_id = "";

    if (folder_id != undefined) {

        selected_folder_id = folder_id;

        //戻るボタンのid設定
        if (folder_back == false) {

            back_ids.push(folder_id);

            window.back_ids_index = window.back_ids_index + 1;
        }

    } else {

        document.getElementById("file_name_gdrive_exec").value = document.getElementById("file_name").value;

        //simplemフォルダ以下を表示
        selected_folder_id = window.simplem_folder_id;

        window.folder_id_for_save_as = window.simplem_folder_id;

        //戻るボタンの初期化
        back_ids = [];

        back_ids.push(window.simplem_folder_id);

        window.back_ids_index = -1;

    }


    //gapi.client.drive.files.list({q:"mimeType ='text/plain' and '1kKSL2hrL29k7DswP-Bf3Yx-1tnUEyQC4' in parents and trashed = false"}).then(function(re){console.log(re)})

    //modalのDOM要素をget
    let save_as_modal_div = document.getElementById("save_as_modal");

    //戻るボタンを初期化
    if (back_div_ele) {
        back_div_ele.remove();
        back_div_ele = null;
    }

    //戻るボタンの設置
    if ((folder_id != undefined) && (window.back_ids_index != -1)) {
        //要素の作成
        back_div_ele = document.createElement("div");
        back_a_ele = document.createElement("a");

        //属性設定
        back_div_ele.setAttribute("class", "folder_div_in_modal");
        back_a_ele.setAttribute("class", "folder_a_in_modal");
        back_a_ele.setAttribute("onclick", "get_folder_back_id(this);");

        //フォルダidの書き込み
        back_a_ele.setAttribute("id", back_ids[window.back_ids_index]);

        back_div_ele.appendChild(back_a_ele);

        //アイコンの書き込み
        back_a_ele.innerHTML = '<i class="fa fa-arrow-left"></i>';

        //要素のmodalへの追加
        save_as_modal_div.appendChild(back_div_ele);
    }


    //selected_folder_idフォルダ以下のフォルダとtextファイルを取得
    window.folder_selected_in_modal = true;
    window.over_write_in_modal = false;
    window.file_name_for_save_as = document.getElementById("file_name_gdrive_exec").value;
    //selected_folder_idフォルダ以下のフォルダとテキストファイルかつ、ゴミ箱に入っていないファイル、を検索するクエリ
    let q_simplem = "(mimeType ='text/plain' or mimeType ='application/vnd.google-apps.folder') and " + "'" + selected_folder_id + "'" + " in parents and trashed = false";
    gapi.client.drive.files.list({ q: q_simplem }).then(
        function (re) {


            //console.log(re.result.files);


            //フォルダが上部にくるようにソート
            re.result.files.sort(function (a, b) {

                //mimeTypeを降順
                if (a.mimeType > b.mimeType) return 1;
                if (a.mimeType < b.mimeType) return -1;

                //mimeTypeが同じときは名前を降順
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;

            });

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
                        //テキストファイルの時
                        file_div_eles[i].setAttribute("class", "file_div_in_modal");
                        file_a_eles[i].setAttribute("class", "file_a_in_modal");
                        file_a_eles[i].setAttribute("onclick", "get_file_id(this);");
                        //選択中divの色変更用
                        file_div_eles[i].setAttribute("tabindex", String(i));
                    } else {
                        //フォルダの時
                        file_div_eles[i].setAttribute("class", "folder_div_in_modal");
                        file_a_eles[i].setAttribute("class", "folder_a_in_modal");
                        file_a_eles[i].setAttribute("onclick", "get_folder_id(this);");
                    }

                    //ファイルid、フォルダidの書き込み
                    file_a_eles[i].setAttribute("id", file.id);

                    file_div_eles[i].appendChild(file_a_eles[i]);

                    //file名の書き込み
                    if (file.mimeType == "text/plain") {
                        file_a_eles[i].innerHTML = '<i class="fa fa-file"></i>' + " " + file.name;
                    } else {
                        file_a_eles[i].innerHTML = '<i class="fa fa-folder"></i>' + " " + file.name;
                    }

                    //file要素のmodalへの追加
                    save_as_modal_div.appendChild(file_div_eles[i]);


                });


        });


    document.getElementById("modal_button").click();

}

//let save_as_to_gdrive_ele = document.getElementById("save_as_to_gdrive");
//save_as_to_gdrive_ele.addEventListener("click", save_as_to_gdrive);









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
            console.log("Text copied to clipboard...");
            alert("htmlとしてクリップボードへコピーしました");
        })
        .catch(err => {
            console.log('Something went wrong', err);
            alert("クリップボードへのコピーに失敗しました");
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

// 読み上げの２倍速オプション------------------------------------------------------------------------------


window.flg_speech_2x = false;
function toggle_speech_2x() {

    flg_speech_2x = !flg_speech_2x

    speech_cancel();
}

let speech_2x_cbox = document.getElementById('speech_2x');
speech_2x_cbox.addEventListener('change', toggle_speech_2x);





// 目次付きhtmlファイルとしてPCへ保存------------------------------------------------------------------------------
//長いのでsave_as_html_with_toc.jsに記述