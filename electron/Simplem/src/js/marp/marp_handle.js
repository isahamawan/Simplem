

function toggle_slides_for_full_preview() {

    let wrapper = easyMDE.codemirror.getWrapperElement();
    let preview = wrapper.lastChild;



    if (window.flg_slides_on == false) {
        preview.innerHTML = easyMDE.options.previewRender(easyMDE.value(), preview);
    } else {
        let { html } = marp.render(easyMDE.value());
        preview.innerHTML = html;
        init_toc_for_marp();

        //let { html, css, comments } = marp.render(editor.value()); //simplem
        //preview.innerHTML = "<style>" + css + "</style>" + html; //simplem
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


//slidesボタンのクリックイベントにslidesのオンオフを追加
window.flg_slides_on = false;
document.getElementById("slides_button").addEventListener('click', function (e) {

    if (flg_slides_on == false) {

        document.getElementById("slides_button").setAttribute("class", "slides active");

    } else {

        document.getElementById("slides_button").setAttribute("class", "slides");

    }


    flg_slides_on = !flg_slides_on;


    //full_previewビューの更新
    if (easyMDE.isPreviewActive() == true) {
        toggle_slides_for_full_preview();
    }

    //sideBySideビューの更新
    if (easyMDE.isSideBySideActive() == true) {
        easyMDE.codemirror.sideBySideRenderingFunction()
    }

});
