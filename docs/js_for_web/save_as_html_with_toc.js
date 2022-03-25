//document.getElementsByClassName("editor-preview-full")[0].outerHTML
//document.getElementById("toc_wrapper").outerHTML
'.fa - file{ a } .fa - ddd{ a } '

//let css_text_all = "";
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

            console.log(css_text_all);
            //console.log(rules.item(i).cssText);
        }
    }

    return css_text_all;
}


//cssまで分けてconstする

const start_to_above_title = '<!doctype html>< html lang = "ja" ><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><!-- title --><title>';

const under_title_to_above_toc = "";

const under_toc_to_above_preview = "";

const under_preview_to_end = "";