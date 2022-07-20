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





// htmlファイルを名前を付けて保存------------------------------------------------------------------------------

/* web verのボタン用
window.addEventListener("load", () => {
    let save_as_html_ele = document.getElementById("make_html_file");
    save_as_html_ele.addEventListener("click", save_as_html)
});
*/

//save_as_ele.addEventListener("click", function (evt) {

//web function save_as_html(evt) {
//web evt.preventDefault();

window.filename_for_title = "no_title";

function save_as_html() {
    easyMDE.togglePreview();

    //web sleep(100);
    // 例)0.1秒スリープさせる
    const d1 = new Date();
    while (true) {
        const d2 = new Date();
        if (d2 - d1 > 100) {
            break;
        }
    }

    //以下、htmlの中身

    const start_to_above_title = '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><!-- title --><title>';

    let title = document.title;

    const under_title_to_above_style = '</title><meta name="theme-color" content="#707070"><style>';

    let web_css = "#div-menu-nav{position:relative;font-size:14px;z-index:10;padding:4px 3px;background-color:rgb(37,37,37);white-space:nowrap}#div-menu-nav .menu-tab{display:inline-block;width:100px}#div-menu-nav .menu-tab a{width:88px}#div-menu-nav a{cursor:default;display:block;color:#fff;text-decoration:none;background-color:rgb(37,37,37);;padding:0 6px;width:100%;line-height:25px;border-radius:3px}#div-menu-nav a:hover{background-color:rgb(47,118,224)}#div-menu-nav .box1{position:absolute;display:none;left:10px;background-color:rgb(37,37,37);border:solid 1px darkgray;border-radius:6px;width:300px;padding:3px}#div-menu-nav .box2{position:absolute;left:114px;display:none;background-color:rgb(37,37,37);border:solid 1px darkgray;border-radius:6px;width:300px;padding:3px}#div-menu-nav .box3{position:absolute;left:218px;display:none;background-color:rgb(37,37,37);border:solid 1px darkgray;border-radius:6px;width:300px;padding:3px}#div-menu-nav .box4{position:absolute;left:322px;display:none;background-color:rgb(37,37,37);border:solid 1px darkgray;border-radius:6px;width:300px;padding:3px}#div-menu-nav .box5{position:absolute;left:322px;display:none;background-color:rgb(37,37,37);border:solid 1px darkgray;border-radius:6px;width:300px;padding:3px}#div-menu-nav .menu-hover1:hover~.box1{display:block}#div-menu-nav .box1:hover{display:block}#div-menu-nav .box1 div{width:288px}#div-menu-nav .menu-hover2:hover~.box2{display:block}#div-menu-nav .box2:hover{display:block}#div-menu-nav .box2 div{width:288px}#div-menu-nav .menu-hover3:hover~.box3{display:block}#div-menu-nav .box3:hover{display:block}#div-menu-nav .box3 div{width:288px}#div-menu-nav .menu-hover4:hover~.box4{display:block}#div-menu-nav .box4:hover{display:block}#div-menu-nav .box4 div{width:288px}#div-menu-nav .menu-hover5:hover~.box5{display:block}#div-menu-nav .box5:hover{display:block}#div-menu-nav .box5 div{width:288px}.sepa_menu{padding:0 0;margin:3px 3px!important;height:0;border-top:1px solid darkgray;margin:unset;background-color:rgb(37,37,37)}"

    let css_text = get_css_all() + web_css;

    const under_style_to_above_toc = '</style></head><body><nav id="div-menu-nav"><div class="menu-tab menu-hover1"><a>' + window.filename_for_title + '</a></div><div class="box1"><div><a id="about_simplem" href="https://github.com/isahamawan/Simplem/blob/master/README.md" target="_blank" rel="noopener noreferrer">Simplemについて</a></div><hr class="sepa_menu"><div><a id="print" onclick="window.print();">印刷</a></div></div></nav><div id="toc_wrapper" style="display:block;">';

    let toc_contents = document.getElementById("toc_wrapper").innerHTML;

    const under_toc_to_above_preview = '</div><div class="editor-preview-full editor-preview editor-preview-active" style="height: calc(100vh - 33px);;overflow: scroll;position: relative;width: auto;padding: 2px 35px;">';

    let preview_contents = document.getElementsByClassName("editor-preview-full")[0].innerHTML;

    const under_preview_to_end = '</div></body ><script id="toc_js">document.getElementById("toc").setAttribute("style", "margin-right:10px;padding-right:0px;border-right:1px solid rgb(221,221,221);");let toc_button_ele = document.createElement("button");toc_button_ele.setAttribute("class", "outline no-disable");toc_button_ele.setAttribute("style", "left: 300px;top: 33px;position: fixed;background-color: #fff;border: 1px solid rgb(221,221,221);height: 34px;border-bottom-right-radius: 3px;border-top-right-radius: 3px;width: 25px;");toc_button_ele.setAttribute("type", "button");toc_button_ele.setAttribute("title", "Outline");toc_button_ele.setAttribute("tabindex", "-1");toc_button_ele.setAttribute("id", "toc_button");let toc_i_ele = document.createElement("i");toc_i_ele.innerText="<";toc_button_ele.appendChild(toc_i_ele);let editor_toolbar_ele = document.getElementsByClassName("editor-preview-full")[0];editor_toolbar_ele.insertBefore(toc_button_ele, editor_toolbar_ele.firstChild);window.flg_toc_on = false;document.getElementById("toc_button").addEventListener("click", function (e) {if (flg_toc_on == true) {document.getElementById("toc_wrapper").setAttribute("style", "display:block;");toc_i_ele.innerText="<";toc_button_ele.setAttribute("style", "left: 300px;top: 33px;position: fixed;background-color: #fff;border: 1px solid rgb(221,221,221);height: 34px;border-bottom-right-radius: 3px;border-top-right-radius: 3px;width: 25px;");} else {document.getElementById("toc_wrapper").setAttribute("style", "display:none;");toc_i_ele.innerText=">";toc_button_ele.setAttribute("style", "left: 0px;top: 33px;position: fixed;background-color: #fff;border: 1px solid rgb(221,221,221);height: 34px;border-bottom-right-radius: 3px;border-top-right-radius: 3px;width: 25px;");};flg_toc_on = !flg_toc_on;});</script><link rel="stylesheet" href="css/toc.css"><style id="toc_css"></style></html>';



    let text_data = start_to_above_title + title + under_title_to_above_style + css_text + under_style_to_above_toc + toc_contents + under_toc_to_above_preview + preview_contents + under_preview_to_end;

    let blob = new Blob([text_data], { type: "text/plain" });

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");

    a.href = url;


    a.download = window.filename_for_title + ".html";



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