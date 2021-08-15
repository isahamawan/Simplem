function init_toc(cm) {
    var $toc = document.getElementById('toc')
    var lastTOC = ""
    //デバウンス入れる？300m
    var update = function () {
        var newTOC = ""
        cm.eachLine(function (line) {
            var tmp = /^(#+)\s+(.+)(?:\s+\1)?$/.exec(line.text);
            if (!tmp) return
            var lineNo = line.lineNo();
            //if (!cm.getStateAfter(lineNo).header) return // double check but is not header
            var level = tmp[1].length

            var title = tmp[2]
            title = title.replace(/([*_]{1,2}|~~|`+)(.+?)\1/g, '$2') // em / bold / del / code
            title = title.replace(/\\(?=.)|\[\^.+?\]|\!\[((?:[^\\\]]+|\\.)+)\](\(.+?\)| ?\[.+?\])?/g, '') // images / escaping slashes / footref
            title = title.replace(/\[((?:[^\\\]]+|\\.)+)\](\(.+?\)| ?\[.+?\])/g, '$1') // links
            title = title.replace(/&/g, '&amp;')
            title = title.replace(/</g, '&lt;')
            newTOC += '<div data-line="' + lineNo + '" class="toc-item" style="padding-left:' + level + 'em">' + title + '</div>'
        })
        if (newTOC == lastTOC) return
        $toc.innerHTML = lastTOC = "<div class='toc_title'>目次</div>" + newTOC
    }

    cm.on('changes', update)

    $toc.addEventListener('click', function (ev) {
        var t = ev.target
        if (!/toc-item/.test(t.className)) return
        var lineNo = ~~t.getAttribute('data-line')
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
toc_button_ele.setAttribute("class", "bold");
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

//tocボタンのクリックイベントにtocのオンオフを追加
let flg_toc_on = true;
document.getElementById("toc_button").addEventListener('click', function (e) {

    if (flg_toc_on == true) {

        document.getElementById("toc").setAttribute("style", "display:block;");
    } else {

        document.getElementById("toc").setAttribute("style", "display:none;");
    }

    flg_toc_on = !flg_toc_on;

});