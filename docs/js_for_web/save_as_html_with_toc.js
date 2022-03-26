//document.getElementsByClassName("editor-preview-full")[0].outerHTML
//document.getElementById("toc_wrapper").outerHTML

function get_css_all() {

    let css_text_all = "";

    let sheets = document.styleSheets;
    let sheets_length = sheets.length;
    for (let i_s = 0; i_s < sheets_length; i_s++) {

        //長ったらしいので変数に代入
        let css = window.document.styleSheets.item(i_s);
        //論理演算子で存在する方を代入(参照)
        let rules = css.cssRules || css.rules;
        //CSSルールの数を調べる
        let rules_length = rules.length;
        //CSSルールの数だけループしてCSSの内容をコンソールに表示する
        for (let i_c = 0; i_c < rules_length; i_c++) {
            css_text_all = css_text_all + rules.item(i_c).cssText;

            //console.log(css_text_all);
            //console.log(rules.item(i).cssText);
        }
    }

    return css_text_all;
}





// ファイルを名前を付けて保存------------------------------------------------------------------------------

window.addEventListener("load", () => {
    let save_as_html_ele = document.getElementById("make_html_file");
    save_as_html_ele.addEventListener("click", save_as_html)
});

//save_as_ele.addEventListener("click", function (evt) {
function save_as_html(evt) {
    evt.preventDefault();

    easyMDE.togglePreview();

    sleep(100);

    //以下、htmlの中身

    const start_to_above_title = '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><!-- title --><title>';

    let title = document.title;

    const under_title_to_above_style = '</title><meta name="theme-color" content="#707070"><style>';

    let css_text = get_css_all();

    const under_style_to_above_toc = '</style></head><body><nav id="div-menu-nav"><div class="menu-tab menu-hover1"><a>ファイル</a></div><div class="menu-tab menu-hover2"><a>編集</a></div><div class="menu-tab menu-hover3"><a>表示モード</a></div><div class="menu-tab menu-hover4"><a>フォント</a></div><div class="menu-tab menu-hover5"><a>オプション</a></div><div class="box1"><div><a href="Javascript:document.getElementById("file_select").click();">PCからファイルを開く<input type="file" id="file_select" accept=".txt, .html, .md" style="display: none;"></a></div><div><a id="save_as">PCに名前を付けて保存</a><input type="text" id="file_name" style="margin-left: 6px;width:280px;" value="Simplem.md"></div><hr class="sepa_menu"><div id="gd_disabled"><div><a id="gd_enable" onclick="gdrive_init_for_simplem();">Google Driveとの連携を有効化</a></div></div><div id="gd_enabled" style="display: none;"><div><a id="file_open_gdrive">Google Driveからファイルを開く</a></div><div><a id="save_to_gdrive" onclick="save_to_gdrive();">Google Driveに上書き保存</a></div><div><a id="save_as_to_gdrive" onclick="save_as_to_gdrive();">Google Driveに名前を付けて保存</a></div><hr class="sepa_menu"><div><a id="open_google_drive">Google Driveを開く</a></div></div><hr class="sepa_menu"><div><a id="simple_window_open">別ウィンドウで開く</a></div><hr class="sepa_menu"><div><a id="ctc">htmlとしてクリップボードへコピー</a></div><hr class="sepa_menu"><div><a id="make_html_file">目次付きhtmlファイルとしてPCへ保存</a></div><hr class="sepa_menu"><div><a id="print">印刷</a></div></div><div class="box2"><div><a href="Javascript:easyMDE.codemirror.execCommand("undo");">元に戻す</a></div><div><a href="Javascript:easyMDE.codemirror.execCommand("redo");">やり直し</a></div><hr class="sepa_menu"><div><a href="Javascript:easyMDE.codemirror.execCommand("selectAll");">全て選択</a></div><hr class="sepa_menu"><div><a id="text_to_speech" onclick="text_to_speech();">読み上げ</a></div><hr class="sepa_menu"><div><a id="voice_input_start">音声入力</a></div></div><div class="box3"><div><form id="view_mode"><a><label><input type="radio" name="trigger" value="0" checked="true">ライブプレビュー</label></a><a><label><input type="radio" name="trigger" value="1">マークを常に表示</label></a><a><label><input type="radio" name="trigger" value="2">ソースコード</label></a><a><label><input type="radio" name="trigger" value="3">ソースコード（ハイライト有り）</label></a></form></div></div><div class="box4"><div><form id="font"><a><label><input type="radio" name="trigger" value="0" checked="true">モダンOS</label></a><a><label><input type="radio" name="trigger" value="1">モダンBrowser</label></a><a><label><input type="radio" name="trigger" value="2">Simplem</label></a><a><label><input type="radio" name="trigger" value="3">ビューティフルコード</label></a><a><label><input type="radio" name="trigger" value="4">ビューティフルドット</label></a><a><label><input type="radio" name="trigger" value="5">美しい明朝体</label></a><a><label><input type="radio" name="trigger" value="6">UDゴシック</label></a><a><label><input type="radio" name="trigger" value="7">UD明朝</label></a></form></div></div><div class="box5"><div><form id="option" style="color:gray;"><span style="padding:6px;">文書モード</span><a><label><input type="checkbox" checked="true" id="h1_page_break">印刷時にh1で改ページ</label></a><a><label><input type="checkbox" id="hr_page_break">印刷時に---で改ページ</label></a><a><label><input type="checkbox" id="wide_row">行間を広くする</label></a><hr class="sepa_menu"><span style="padding:6px;">スライドモード</span><a><label><input type="checkbox" id="window_slide_show">ウィンドウモードでスライドショー<br>　（リモート会議用）</label></a><hr class="sepa_menu"><span style="padding:6px;">編集画面</span><a><label><input type="checkbox" checked="true" id="same_font_size">文字サイズを統一</label></a><hr class="sepa_menu"><span style="padding:6px;">読み上げ</span><a><label><input type="checkbox" id="speech_2x">２倍速再生</label></a></form></div></div></nav><div id="toc_wrapper" style="display:block;">';

    let toc_contents = document.getElementById("toc_wrapper").innerHTML;

    const under_toc_to_above_preview = '</div><div class="editor-preview-full editor-preview editor-preview-active" style="height: calc(100vh - 33px);;overflow: scroll;position: relative;width: auto;">';

    let preview_contents = document.getElementsByClassName("editor-preview-full")[0].innerHTML;

    const under_preview_to_end = '</div></body ><script id="toc_js">let toc_button_ele = document.createElement("button");toc_button_ele.setAttribute("class", "outline no-disable");toc_button_ele.setAttribute("style", "left: 298px;top: 33px;position: fixed;background-color: #fff;border: 1px solid rgb(221,221,221);height: 34px;border-bottom-right-radius: 3px;border-top-right-radius: 3px;width: 25px;");toc_button_ele.setAttribute("type", "button");toc_button_ele.setAttribute("title", "Outline");toc_button_ele.setAttribute("tabindex", "-1");toc_button_ele.setAttribute("id", "toc_button");let toc_i_ele = document.createElement("i");toc_i_ele.innerText="目次";toc_button_ele.appendChild(toc_i_ele);let editor_toolbar_ele = document.getElementsByClassName("editor-preview-full")[0];editor_toolbar_ele.insertBefore(toc_button_ele, editor_toolbar_ele.firstChild);window.flg_toc_on = false;document.getElementById("toc_button").addEventListener("click", function (e) {if (flg_toc_on == true) {document.getElementById("toc_wrapper").setAttribute("style", "display:block;");toc_button_ele.setAttribute("style", "left: 298px;top: 33px;position: fixed;background-color: #fff;border: 1px solid rgb(221,221,221);height: 34px;border-bottom-right-radius: 3px;border-top-right-radius: 3px;width: 25px;");} else {document.getElementById("toc_wrapper").setAttribute("style", "display:none;");toc_button_ele.setAttribute("style", "left: 0px;top: 33px;position: fixed;background-color: #fff;border: 1px solid rgb(221,221,221);height: 34px;border-bottom-right-radius: 3px;border-top-right-radius: 3px;width: 25px;");};flg_toc_on = !flg_toc_on;});</script><link rel="stylesheet" href="css/toc.css"><style id="toc_css"></style></html>';



    let text_data = start_to_above_title + title + under_title_to_above_style + css_text + under_style_to_above_toc + toc_contents + under_toc_to_above_preview + preview_contents + under_preview_to_end;

    let blob = new Blob([text_data], { type: "text/plain" });

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");

    a.href = url;


    a.download = document.getElementById("file_name_html").value; // + ".html";



    //diffのオリジナル用として保存
    //window.diff_origin_text_data = text_data;

    //titleの変更
    //document.getElementsByTagName("title")[0].innerText = a.download + " - Simplem";



    //gdriveに保存した名前と違うときは、gdrive上書き判定の初期化
    //if (window.file_name_now != document.getElementById("file_name").value) {
    //    window.fileId_now = null;
    //}

    //window.file_name_now = a.download;


    document.body.appendChild(a);


    a.click();

    a.remove();

    URL.revokeObjectURL(url);

};