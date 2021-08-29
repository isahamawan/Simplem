
function merge_view_on() {

    if (window.merge_view_div) return;

    //プレビューをオフに変更
    if (easyMDE.isPreviewActive() == true) {
        easyMDE.togglePreview();
    }

    //サイドプレビューをオフに変更
    if (easyMDE.isSideBySideActive() == true) {
        easyMDE.toggleSideBySide();
    }

    let cm_wrap_ele = document.getElementsByClassName("CodeMirror-wrap")[0];

    //グローバル定義して他のviewとテキストデータを受け渡し
    window.merge_view_div = easyMDE.CodeMirror.MergeView(cm_wrap_ele, {

        value: easyMDE.value(), //右側の編集用パネル内のテキストデータ
        origLeft: (window.diff_origin_text_data || ""), //左側のオリジナルパネル内のテキストデータ(直近保存時のデータ)
        //lineNumbers: true,//使用不可。そしていらない。
        mode: "text/html",
        //singleCursorHeightPerLine: false, //カーソルサイズをスパンに合わせるためにfalse

        //styleActiveLine: true,
        //lineWrapping: true,
    });

    let easymdes_cm_scroll_ele = document.getElementsByClassName("CodeMirror-scroll")[0];
    easymdes_cm_scroll_ele.setAttribute("style", "display:none;");

    let easymdes_editor_toolbar_ele = document.getElementsByClassName("editor-toolbar")[0];
    easymdes_editor_toolbar_ele.setAttribute("style", "opacity: .6; pointer-events: none;");

    ipcRenderer.invoke('menu_disable');


    //tocの非表示
    if (flg_toc_on == false) {
        document.getElementById("toc_wrapper").setAttribute("style", "display:none;");
        //diffとdarkボタンの移動
        document.getElementById("diff_button").setAttribute("style", "");
        document.getElementsByClassName("darkmode-toggle")[0].setAttribute("style", "");
    }

    flg_toc_on = true;

}



function merge_view_off() {

    if (!window.merge_view_div) return;

    //現在の編集画面のテキスト取り出し
    let merge_view_editor_value = window.merge_view_div.edit.getValue();

    //easymde側に編集パネルのテキストデータを渡す
    easyMDE.value(merge_view_editor_value);
    setTimeout(function () {
        easyMDE.codemirror.execCommand("selectAll");
    }, 10);
    setTimeout(function () {
        easyMDE.codemirror.setCursor({ line: 0, ch: 0 });
    }, 10);

    //mergeviewの削除
    window.merge_view_div.wrap.remove()
    window.merge_view_div = null;

    //easymdeの表示
    let easymdes_cm_scroll_ele = document.getElementsByClassName("CodeMirror-scroll")[0];
    easymdes_cm_scroll_ele.setAttribute("style", "display: block;");

    let easymdes_editor_toolbar_ele = document.getElementsByClassName("editor-toolbar")[0];
    easymdes_editor_toolbar_ele.setAttribute("style", "");

    ipcRenderer.invoke('menu_enable');

}


//diffボタン要素の作成
let diff_button_ele = document.createElement("button");
diff_button_ele.setAttribute("class", "diff");
diff_button_ele.setAttribute("type", "button");
diff_button_ele.setAttribute("title", "Diff");
diff_button_ele.setAttribute("tabindex", "-1");
diff_button_ele.setAttribute("id", "diff_button");

let diff_i_ele = document.createElement("i");
diff_i_ele.setAttribute("class", "fa fa-clone");

diff_button_ele.appendChild(diff_i_ele);

//editor-statusbarへのdiffボタン要素の追加
let editor_statusbar_ele = document.getElementsByClassName("editor-statusbar")[0];
editor_statusbar_ele.insertBefore(diff_button_ele, editor_statusbar_ele.firstChild);


//diffボタンのクリックイベントにdiffのオンオフを追加
window.flg_diff_on = false;
document.getElementById("diff_button").addEventListener('click', function (e) {

    if (flg_diff_on == false) {

        merge_view_on();

        document.getElementById("diff_button").setAttribute("class", "diff active");

    } else {

        merge_view_off();

        document.getElementById("diff_button").setAttribute("class", "diff");
    }

    flg_diff_on = !flg_diff_on;

});
