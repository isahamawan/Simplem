

















/* スライドショーを終了する関数 */
function slide_show_end() {

    //フルスクリーンモードを終了
    if (flg_slideshow_fullscreen == true) {
        document.exitFullscreen();
    }

    //ツールバーなどその他の要素のdisplay:noneを削除
    //全てのスライドのdisplay:noneを削除
    //縦幅100vh設定を削除。背景の黒設定を削除。
    document.getElementById("slide_show_css").setAttribute("href", "css/slide_show_off.css");

    //表示中のスライドのstyle="display:block;"を削除。
    let slide_index = window.pageNo - 1;
    window.slide_svg_collection[slide_index].setAttribute("style", "");


    //イベントリスナーの解除
    window.removeEventListener('keydown', slide_show_handle, false);

    //end of slides　要素の削除　
    document.getElementById("end_of_slides_ele").remove();
}


/* スライドショーを開始する関数 */
window.flg_slideshow_fullscreen = true;
function slide_show_start() {

    //diffモードの解除
    if (flg_diff_on == true) {

        merge_view_off();
        document.getElementById("diff_button").setAttribute("class", "diff");
        flg_diff_on = false;
    }

    //プレビューモードに切替
    if (easyMDE.isPreviewActive() == false) {
        easyMDE.togglePreview();

        //10ms待機
        //const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        //_sleep(10);
    }



    //フルスクリーンモードに切替 ※後で、リモート会議用にフルスクリーン化無しも設定できるようにする。
    if (flg_slideshow_fullscreen == true) {
        document.body.requestFullscreen();
    }




    //ツールバーなどその他の要素をdisplay:none
    //全てのスライドをdisplay:none
    document.getElementById("slide_show_css").setAttribute("href", "css/slide_show_on.css");

    //marpスライドの各svgタグを取得（htmlコレクション）してwindow.へ保管
    window.slide_svg_collection = document.getElementsByClassName('marpit')[0].childNodes;

    /* cssの切替で処理のため不要 */
    //Array.prototype.forEach.call(slide_elements, function (element) {
    //    element.setAttribute("style", "display:none;");
    //});

    //最初のスライドにstyle="display:block;"して表示。縦幅を100vhに設定。背景は黒に設定。
    window.slide_svg_collection[0].setAttribute("style", "display:block !important;");

    //現在のスライドのページ数をwindow.へ保管
    window.pageNo_all = window.slide_svg_collection.length;
    //現在の表示スライドのページをwindow.へ保管
    window.pageNo = 1;


    //イベントリスナーの追加（スライド操作）
    window.addEventListener('keydown', slide_show_handle, false);

    //end of slides 要素の追加
    let end_of_slides_div_ele = document.createElement("div");
    end_of_slides_div_ele.setAttribute("id", "end_of_slides_ele");
    end_of_slides_div_ele.setAttribute("style", "display:none !important;");

    let end_of_slides_p_ele = document.createElement("p");
    end_of_slides_p_ele.setAttribute("style", "margin:0 !important; padding:1em !important;");
    end_of_slides_p_ele.innerHTML = "end of slides.";

    end_of_slides_div_ele.appendChild(end_of_slides_p_ele);

    document.getElementsByClassName('marpit')[0].appendChild(end_of_slides_div_ele);
}






////ページを戻す処理

function slide_show_previous() {

    //もし最初のページの時は、処理なし。
    if (2 <= pageNo) {
        if (pageNo <= pageNo_all) {
            //表示中のスライドのstyle="display:block;"を削除。
            let slide_index_now = window.pageNo - 1;
            window.slide_svg_collection[slide_index_now].setAttribute("style", "");
        }

        //現在ページ数を減少;
        pageNo--;

        //end of slidesの非表示
        if (pageNo == pageNo_all) {

            document.getElementById("end_of_slides_ele").setAttribute("style", "display:none !important;");
        }

        //現在ページ数で、表示するsvgを指定、取得して、display:block
        let slide_index_previous = window.pageNo - 1;
        window.slide_svg_collection[slide_index_previous].setAttribute("style", "display:block !important;");
    }


}


////ページを進める処理

function slide_show_next() {

    if (pageNo <= pageNo_all - 1) {
        //表示中のスライドのstyle="display:block;"を削除。
        let slide_index_now = window.pageNo - 1;
        window.slide_svg_collection[slide_index_now].setAttribute("style", "");

        //現在ページ数を増加
        pageNo++

        //現在ページ数で、表示するsvgを指定、取得して、display:block
        let slide_index_next = window.pageNo - 1;
        window.slide_svg_collection[slide_index_next].setAttribute("style", "display:block !important;");
    } else if (pageNo == pageNo_all) {

        //表示中のスライドのstyle="display:block;"を削除。
        let slide_index_now = window.pageNo - 1;
        window.slide_svg_collection[slide_index_now].setAttribute("style", "");

        //end of slidesを表示
        document.getElementById("end_of_slides_ele").setAttribute("style", "display:block !important; margin: 0; padding: 0; background-color: black; color: #fff; height: 100vh; width: 100vw;");

        pageNo++
    } else {
        //さらに右等を押すと、スライドショーを終了。
        slide_show_end();
    }


}


//イベントリスナー用関数。左等を押したら、右等を押したら動作
function slide_show_handle(e) {
    if (['ArrowLeft', 'ArrowUp', 'p', 'PageUp', 'Backspace'].indexOf(e.key) >= 0) {

        slide_show_previous();
    } else if (['ArrowRight', 'ArrowDown', 'n', ' ', 'PageDown', 'Enter'].indexOf(e.key) >= 0) {

        slide_show_next();
    } else if (['Escape'].indexOf(e.key) >= 0) {

        slide_show_end();
    }
}


//slide_showボタン要素を作成する関数　⇨ slides(marp)ボタン押下時に実行
function slide_show_button_create() {
    let slide_show_button_ele = document.createElement("button");
    slide_show_button_ele.setAttribute("class", "slide_show");
    slide_show_button_ele.setAttribute("type", "button");
    slide_show_button_ele.setAttribute("title", "Slide show");
    slide_show_button_ele.setAttribute("tabindex", "-1");
    slide_show_button_ele.setAttribute("id", "slide_show_button");

    let slide_show_i_ele = document.createElement("i");
    slide_show_i_ele.setAttribute("class", "fa fa-chalkboard-teacher");//fa-object-group

    slide_show_button_ele.appendChild(slide_show_i_ele);

    //editor-statusbarへのslide_showボタン要素の追加
    //let editor_statusbar_ele = document.getElementsByClassName("editor-statusbar")[0];
    editor_statusbar_ele.insertBefore(slide_show_button_ele, editor_statusbar_ele.firstChild);

    //イベントリスナー追加
    document.getElementById("slide_show_button").addEventListener('click', slide_show_start, false);
}


//slide_showボタン要素を削除する関数　⇨ slides(marp)ボタン押下時に実行
function slide_show_button_remove() {
    document.getElementById("slide_show_button").remove();

    //イベントリスナー解除
    document.removeEventListener('click', slide_show_start, false);
}









/* 無効化中
//ボタンのイベントリスナー用のbookモードへの切替え関数
*/


//window.flg_slide_show_on = false;


/*
function toggle_book_for_button() {

    if (flg_book_on == false) {



        marp_themeset_book();

        document.getElementById("book_button").setAttribute("class", "book active");

    } else {



        marp_themeset_slides();

        document.getElementById("book_button").setAttribute("class", "book");

    }




    flg_book_on = !flg_book_on;


    toggle_print_for_marp_book_css();


    //full_previewビューの更新
    if (easyMDE.isPreviewActive() == true) {
        toggle_marp_for_full_preview();
    }

    //sideBySideビューの更新
    if (easyMDE.isSideBySideActive() == true) {

        //setTimeout(function () {
        easyMDE.codemirror.sideBySideRenderingFunction();
        //}, 10);

    }


}

function toggle_off_book_for_button() {

    marp_themeset_slides();

    document.getElementById("book_button").setAttribute("class", "book");

    flg_book_on = false;

}

*/

/* 無効化中
//bookボタンのクリックイベントにbookのオンオフを追加
document.getElementById("book_button").addEventListener('click', function (e) {


    if (flg_slides_on == true) {
        toggle_off_slides_for_button();
    }



    toggle_book_for_button();

});
*/
