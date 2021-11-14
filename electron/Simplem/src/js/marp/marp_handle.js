

function toggle_marp_for_full_preview() {

    let wrapper = easyMDE.codemirror.getWrapperElement();
    let preview = wrapper.lastChild;



    if ((flg_slides_on == false) && (flg_book_on == false)) {
        preview.innerHTML = easyMDE.options.previewRender(easyMDE.value(), preview);
    } else {
        let { html } = marp.render(easyMDE.value());
        preview.innerHTML = html;
        init_toc_for_marp();

        //let { html, css, comments } = marp.render(editor.value()); //simplem
        //preview.innerHTML = "<style>" + css + "</style>" + html; //simplem
    }
}

function toggle_print_for_marp_css() {
    // id属性からHTML要素（リンク要素）を取得
    let print_css_link = document.getElementById("print_css");

    //リンク要素のhref書き換え
    if (window.flg_slides_on == false) {
        print_css_link.href = "css/print.css";
    } else {
        print_css_link.href = "css/print_for_marp.css";
    }
}


//slidesボタン要素の作成
let slides_button_ele = document.createElement("button");
slides_button_ele.setAttribute("class", "slides");
slides_button_ele.setAttribute("type", "button");
slides_button_ele.setAttribute("title", "Slides");
slides_button_ele.setAttribute("tabindex", "-1");
slides_button_ele.setAttribute("id", "slides_button");

let slides_i_ele = document.createElement("i");
slides_i_ele.setAttribute("class", "fa fa-desktop");

slides_button_ele.appendChild(slides_i_ele);

//editor-statusbarへのslidesボタン要素の追加
//let editor_statusbar_ele = document.getElementsByClassName("editor-statusbar")[0];
editor_statusbar_ele.insertBefore(slides_button_ele, editor_statusbar_ele.firstChild);



//ボタンのイベントリスナー用のslidesモードへの切替え関数
window.flg_slides_on = false;
function toggle_slides_for_button() {

    if (flg_slides_on == false) {

        document.getElementById("slides_button").setAttribute("class", "slides active");

        slide_show_button_create();

    } else {

        document.getElementById("slides_button").setAttribute("class", "slides");

        slide_show_button_remove();

    }

    flg_slides_on = !flg_slides_on;

    //marp用cssと通常cssの切替え
    toggle_print_for_marp_css();

    //full_previewビューの更新
    if (easyMDE.isPreviewActive() == true) {
        toggle_marp_for_full_preview();
    }

    //sideBySideビューの更新
    if (easyMDE.isSideBySideActive() == true) {
        easyMDE.codemirror.sideBySideRenderingFunction()
    }
}

function toggle_off_slides_for_button() {

    document.getElementById("slides_button").setAttribute("class", "slides");

    flg_slides_on = false;

}

//slidesボタンのクリックイベントにslidesのオンオフを追加
document.getElementById("slides_button").addEventListener('click', function (e) {


    /* bookは無効化中
    if (flg_book_on == true) {
        toggle_off_book_for_button();
    }
    */

    toggle_slides_for_button();

});
