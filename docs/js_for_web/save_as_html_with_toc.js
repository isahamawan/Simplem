//document.getElementsByClassName("editor-preview-full")[0].outerHTML
//document.getElementById("toc_wrapper").outerHTML
'.fa - file{ a } .fa - ddd{ a } '

let css_text_all = "";
function get_css_all() {
    //長ったらしいので変数に代入
    var css = window.document.styleSheets.item(0);
    //論理演算子で存在する方を代入(参照)
    var rules = css.cssRules || css.rules;
    //CSSルールの数を調べる
    var rules_length = rules.length;
    //CSSルールの数だけループしてCSSの内容をコンソールに表示する
    for (var i = 0; i < rules_length; i++) {
        css_text_all = css_text_all + rules.item(i).cssText;

        console.log(css_text_all);
        //console.log(rules.item(i).cssText);
    }
}


//cssまで分けてconstする

const start_to_above_title = '<!doctype html>< html lang = "ja" ><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><!-- title --><title>';

const under_title_to_above_toc = "";

const under_toc_to_above_preview = "";

const under_preview_to_end = "";