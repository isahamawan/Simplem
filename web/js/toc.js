function init_toc(cm) {
    let $toc = document.getElementById('toc')
    let lastTOC = ""
    //デバウンス入れる？300m
    let update = function () {
        let newTOC = ""
        cm.eachLine(function (line) {
            let tmp = /^(#+)\s+(.+)(?:\s+\1)?$/.exec(line.text);
            if (!tmp) return
            let lineNo = line.lineNo();
            //if (!cm.getStateAfter(lineNo).header) return // double check but is not header
            let level = tmp[1].length

            let title = tmp[2]
            title = title.replace(/([*_]{1,2}|~~|`+)(.+?)\1/g, '$2') // em / bold / del / code
            title = title.replace(/\\(?=.)|\[\^.+?\]|\!\[((?:[^\\\]]+|\\.)+)\](\(.+?\)| ?\[.+?\])?/g, '') // images / escaping slashes / footref
            title = title.replace(/\[((?:[^\\\]]+|\\.)+)\](\(.+?\)| ?\[.+?\])/g, '$1') // links
            title = title.replace(/&/g, '&amp;')
            title = title.replace(/</g, '&lt;')
            newTOC += '<div data-line="' + lineNo + '" class="toc-item" style="padding-left:' + level + 'em">' + title + '</div>'
        })
        if (newTOC == lastTOC) return
        $toc.innerHTML = lastTOC = newTOC
    }

    cm.on('changes', update)

    $toc.addEventListener('click', function (ev) {
        let t = ev.target
        if (!/toc-item/.test(t.className)) return
        let lineNo = ~~t.getAttribute('data-line')
        cm.setCursor({ line: cm.lastLine(), ch: 0 })
        setTimeout(function () {
            cm.setCursor({ line: lineNo, ch: 0 })
        }, 10)
    }, true)
}

//tocの読み込み時実行
init_toc(easyMDE.codemirror);

//tocボタン要素の作成
let toc_button_ele = document.createElement("button");
toc_button_ele.setAttribute("class", "outline no-disable");
toc_button_ele.setAttribute("type", "button");
toc_button_ele.setAttribute("title", "Outline");
toc_button_ele.setAttribute("tabindex", "-1");
toc_button_ele.setAttribute("id", "toc_button");

let toc_i_ele = document.createElement("i");
toc_i_ele.setAttribute("class", "fa fa-align-justify");

toc_button_ele.appendChild(toc_i_ele);

//editor-toolbarへのtocボタン要素の追加
let editor_toolbar_ele = document.getElementsByClassName("editor-toolbar")[0];
editor_toolbar_ele.insertBefore(toc_button_ele, editor_toolbar_ele.firstChild);



//ボタンtoggle preview時用に別途init_toc内のupdateを抜き出して定義
let update_toc_for_edit = function (cm) {
    let $toc = document.getElementById('toc')
    let newTOC = ""
    cm.eachLine(function (line) {
        let tmp = /^(#+)\s+(.+)(?:\s+\1)?$/.exec(line.text);
        if (!tmp) return
        let lineNo = line.lineNo();
        //if (!cm.getStateAfter(lineNo).header) return // double check but is not header
        let level = tmp[1].length

        let title = tmp[2]
        title = title.replace(/([*_]{1,2}|~~|`+)(.+?)\1/g, '$2') // em / bold / del / code
        title = title.replace(/\\(?=.)|\[\^.+?\]|\!\[((?:[^\\\]]+|\\.)+)\](\(.+?\)| ?\[.+?\])?/g, '') // images / escaping slashes / footref
        title = title.replace(/\[((?:[^\\\]]+|\\.)+)\](\(.+?\)| ?\[.+?\])/g, '$1') // links
        title = title.replace(/&/g, '&amp;')
        title = title.replace(/</g, '&lt;')
        newTOC += '<div data-line="' + lineNo + '" class="toc-item" style="padding-left:' + level + 'em">' + title + '</div>'
    })
    //if (newTOC == lastTOC) return
    //$toc.innerHTML = lastTOC = newTOC
    $toc.innerHTML = newTOC
}

//tocボタンのクリックイベントにtocのオンオフを追加
window.flg_toc_on = true;
window.flg_toc_preview_on = false; //toggle previewの中でのtoc_previewとtocの切替えに使用
document.getElementById("toc_button").addEventListener('click', function (e) {

    if (flg_toc_on == true) {

        //tocとtoc_for_previewの切替え //toggle previewの中に処理を入れたので不要
        //if (flg_toc_preview_on == true) {
        //    init_toc_for_preview(easyMDE.codemirror);
        //} else {
        //    update_for_toggle(easyMDE.codemirror);
        //}

        document.getElementById("toc_wrapper").setAttribute("style", "display:block;");

        //diffとdarkとslidesとbookボタンの移動
        document.getElementById("diff_button").setAttribute("style", "left :350px;");
        document.getElementById("slides_button").setAttribute("style", "left :395px;");
        if (document.getElementById("slide_show_button")) {
            document.getElementById("slide_show_button").setAttribute("style", "left :452px;");
        }
        //document.getElementById("book_button").setAttribute("style", "left :452px;");
        document.getElementsByClassName("darkmode-toggle")[0].setAttribute("style", "left :315px;");

    } else {

        document.getElementById("toc_wrapper").setAttribute("style", "display:none;");

        //diffとdarkとslidesとbookボタンの移動
        document.getElementById("diff_button").setAttribute("style", "");
        document.getElementById("slides_button").setAttribute("style", "");
        if (document.getElementById("slide_show_button")) {
            document.getElementById("slide_show_button").setAttribute("style", "");
        }
        //document.getElementById("book_button").setAttribute("style", "");
        document.getElementsByClassName("darkmode-toggle")[0].setAttribute("style", "");
    }

    flg_toc_on = !flg_toc_on;

});