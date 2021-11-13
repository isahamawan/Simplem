

















/* スライドショーを終了する関数 */
function slide_show_end() {

    //フルスクリーンモードを終了
    document.exitFullscreen();

    //ツールバーなどその他の要素のdisplay:noneを削除
    //全てのスライドのdisplay:noneを削除
    //縦幅100vh設定を削除。背景の黒設定を削除。
    document.getElementById("slide_show_css").setAttribute("href", "css/slide_show_off.css");

    //表示中のスライドのstyle="display:block;"を削除。
    let slide_index = window.pageNo - 1;
    window.slide_svg_collection[slide_index].setAttribute("style", "");


    //イベントリスナーの解除
    window.removeEventListener('keydown', slide_show_handle, false);
}


/* スライドショーを開始する関数 */
function slide_show_start() {

    //プレビューモードに切替
    if (easyMDE.isPreviewActive() == false) {
        easyMDE.togglePreview();

        //10ms待機
        //const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        //_sleep(10);
    }

    //フルスクリーンモードに切替 ※後で、リモート会議用にフルスクリーン化無しも設定できるようにする。
    document.body.requestFullscreen();

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
}






////ページを戻す処理

function slide_show_previous() {




    //もし最初のページの時は、処理なし。
    if (pageNo >= 2) {
        //表示中のスライドのstyle="display:block;"を削除。
        let slide_index_now = window.pageNo - 1;
        window.slide_svg_collection[slide_index_now].setAttribute("style", "");

        //現在ページ数を減少;
        pageNo--;

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
    }

    //もし最後のページの時は、end of slidesを表示。さらに右等を押すと、スライドショーを終了。
}


//イベントリスナー用関数。左等を押したら、右等を押したら動作
function slide_show_handle(e) {
    if (['ArrowLeft', 'ArrowUp', 'p', 'PageUp', 'Backspace'].indexOf(e.key) >= 0) {

        slide_show_previous();
    } else if (['ArrowRight', 'ArrowDown', 'n', ' ', 'PageDown', 'Enter'].indexOf(e.key) >= 0) {

        slide_show_next();
    }
}

