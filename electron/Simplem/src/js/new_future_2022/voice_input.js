
const startBtn = document.querySelector('#voice_input_start');
//const stopBtn = document.querySelector('#voice_input_stop');
const completeBtn = document.querySelector('#voice_input_complete');
const cancelBtn = document.querySelector('#voice_input_cancel');
const statusBtn = document.querySelector('#voice_input_status');

const resultDiv = document.querySelector('#voice_input_result_div');
const voiceWrapper = document.querySelector("#voice_input_wrapper");

SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
let recognition = new SpeechRecognition();

//入力言語設定
recognition.lang = 'ja-JP';
//音声入力中の途中結果取得
recognition.interimResults = true;
//音声入力の継続
recognition.continuous = true;

let finalTranscript = ''; // 確定した(黒の)認識結果

let transcript_once = false;

recognition.onresult = (event) => {
    let interimTranscript = ''; // 暫定(灰色)の認識結果

    if (transcript_once == false) {
        finalTranscript = resultDiv.innerText;
    }

    for (let i = event.resultIndex; i < event.results.length; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            transcript_once = false;
            finalTranscript += transcript;
        } else {
            transcript_once = true;
            interimTranscript = transcript;
        }
    }

    resultDiv.innerHTML = finalTranscript + '<i style="color:#ddd;">' + interimTranscript + '</i>';

}



startBtn.onclick = () => {
    //alert("音声入力を開始します");
    statusBtn.innerHTML = '<i class="fa fa-pause"></i>';
    rec_end = false;
    voiceWrapper.setAttribute("style", "")
    recognition.start();
}

/*
stopBtn.onclick = () => {
    recognition.stop();
    voiceWrapper.setAttribute("style", "display:none;");
    easyMDE.codemirror.doc.replaceSelection(resultDiv.innerText);
    resultDiv.innerHTML = "";
    finalTranscript = '';
}
*/

completeBtn.onclick = () => {
    recognition.stop();
    voiceWrapper.setAttribute("style", "display:none;");
    easyMDE.codemirror.doc.replaceSelection(resultDiv.innerText);
    resultDiv.innerHTML = "";
    finalTranscript = '';
}

cancelBtn.onclick = () => {
    recognition.abort();
    voiceWrapper.setAttribute("style", "display:none;");
    resultDiv.innerHTML = "";
    finalTranscript = '';
}

let rec_end = true;
statusBtn.onclick = () => {
    if (rec_end == true) {
        recognition.start();
        statusBtn.innerHTML = '<i class="fa fa-pause"></i>';
        rec_end = false;
    } else {
        recognition.stop();
        statusBtn.innerHTML = '<i class="fa fa-microphone"></i>';
        rec_end = true;
    }
}

recognition.onend = () => {
    statusBtn.innerHTML = '<i class="fa fa-microphone"></i>';
    rec_end = true;
    console.log("rec_end");
}