

// ファイルの読み込み------------------------------------------------------------------------------
let file_select_ele = document.getElementById("file_select");

file_select_ele.addEventListener("change", function (evt) {

    let file = evt.target.files;

    let reader = new FileReader();

    reader.readAsText(file[0]);


    reader.onload = function (e) {

        if (easyMDE.isPreviewActive() == true) {
            easyMDE.togglePreview();
        }

        document.getElementById("file_name").value = file[0].name;

        //titleの変更
        document.getElementsByTagName("title")[0].innerText = file[0].name + " - Simplem";

        //本文の読み込み
        easyMDE.value(reader.result);

        //diffのオリジナル用として保存
        window.diff_origin_text_data = reader.result;

    }

}, false);








// ファイルを名前を付けて保存------------------------------------------------------------------------------

window.addEventListener("load", () => {
    let save_as_ele = document.getElementById("save_as");
    save_as_ele.addEventListener("click", save_as)
});

//save_as_ele.addEventListener("click", function (evt) {
function save_as(evt) {
    evt.preventDefault();

    let text_data = easyMDE.value();

    //diffのオリジナル用として保存
    window.diff_origin_text_data = text_data;

    let blob = new Blob([text_data], { type: "text/plain" });

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");

    a.href = url;


    a.download = document.getElementById("file_name").value
    /*
    if (document.getElementById("file_name").files[0] != undefined) {
        a.download = document.getElementById("file_select").files[0].name;
    } else {
        a.download = "Simplem.txt"
    }
    */

    //titleの変更
    document.getElementsByTagName("title")[0].innerText = a.download + " - Simplem";

    document.body.appendChild(a);


    a.click();

    a.remove();

    URL.revokeObjectURL(url);

};




// フォントサイズの統一オプション------------------------------------------------------------------------------

//mainからのtoggle_same_font_size_from_main命令を処理
window.flg_same_font_size = true;
document.getElementsByClassName("EasyMDEContainer")[0].classList.add("same_font_size");

/*
ipcRenderer.on('toggle_same_font_size_from_main', async (event) => {

    flg_same_font_size = !flg_same_font_size

    if (flg_same_font_size == true) {
        await document.getElementsByClassName("EasyMDEContainer")[0].classList.add("same_font_size");
    } else {
        await document.getElementsByClassName("EasyMDEContainer")[0].classList.remove("same_font_size");
    }


    //カーソルのサイズをリセット
    await easyMDE.codemirror.execCommand('selectAll');
    await setTimeout(function () {
        easyMDE.codemirror.setCursor({ line: 0, ch: 0 });
    }, 10);

});
*/