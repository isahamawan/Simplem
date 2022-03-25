
// 発話インスタンスを設定
const uttr = new SpeechSynthesisUtterance();

//読み上げボタン用
function text_to_speech() {

    document.getElementById("text_to_speech").setAttribute("onclick", "speech_cancel();");
    document.getElementById("text_to_speech").innerText = "読み上げ停止";

    let selected_text = easyMDE.codemirror.doc.getSelection();
    let read_text = "";

    //選択テキスト、もしくは全テキストをread_textに代入
    if (selected_text == "") {
        read_text = easyMDE.value();
    } else {
        read_text = selected_text;
    }

    //read_textが空の時はボタンを「読み上げ」に戻して終了
    if (read_text == "") {
        document.getElementById("text_to_speech").setAttribute("onclick", "text_to_speech();");
        document.getElementById("text_to_speech").innerText = "読み上げ";
        return;
    }


    // ブラウザにWeb Speech API Speech Synthesis機能があるか判定
    if ('speechSynthesis' in window) {

        // テキストを設定 (必須)
        uttr.text = read_text;

        // 言語を設定
        uttr.lang = "ja-JP";

        // 速度を設定(0.1~10 df:1)
        if (window.flg_speech_2x == false) {
            uttr.rate = 1;
        } else {
            uttr.rate = 2;
        }

        // 高さを設定(0~2 df:1)
        uttr.pitch = 0.8;

        // 音量を設定(0~1 df:1)
        uttr.volume = 1;

        // 発言を再生 (必須)
        window.speechSynthesis.speak(uttr);

    } else {
        alert('このブラウザは音声読み上げに対応していません。');
        document.getElementById("text_to_speech").setAttribute("onclick", "text_to_speech();");
        document.getElementById("text_to_speech").innerText = "読み上げ";

    }


}

//読み上げ停止ボタン用
function speech_cancel() {
    window.speechSynthesis.cancel();
    document.getElementById("text_to_speech").setAttribute("onclick", "text_to_speech();");
    document.getElementById("text_to_speech").innerText = "読み上げ";

}


//再生終了時に実行
uttr.onend = function () {
    document.getElementById("text_to_speech").setAttribute("onclick", "text_to_speech();");
    document.getElementById("text_to_speech").innerText = "読み上げ";
};

//再生終了時に実行
uttr.onerror = function () {
    document.getElementById("text_to_speech").setAttribute("onclick", "text_to_speech();");
    document.getElementById("text_to_speech").innerText = "読み上げ";
};

//ページを閉じるとき、およびリロード時に再生を停止
window.addEventListener('beforeunload', function () {
    window.speechSynthesis.cancel();
});