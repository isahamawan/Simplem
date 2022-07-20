








// 読み上げの２倍速オプション------------------------------------------------------------------------------


window.flg_speech_2x = false;
function toggle_speech_2x() {

    flg_speech_2x = !flg_speech_2x

    speech_cancel();
}

let speech_2x_cbox = document.getElementById('speech_2x');
speech_2x_cbox.addEventListener('change', toggle_speech_2x);





// 目次付きhtmlファイルとしてPCへ保存------------------------------------------------------------------------------
//長いのでsave_as_html_with_toc.jsに記述