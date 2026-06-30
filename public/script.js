const camera = document.getElementById("camera");
const transcript = document.getElementById("transcript");
const startBtn = document.getElementById("startBtn");

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(stream => {
    camera.srcObject = stream;
})
.catch(err => {
    console.log(err);
    alert("Camera or microphone permission denied.");
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech Recognition is not supported. Please use Google Chrome.");
} else {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    startBtn.onclick = function () {
        transcript.innerHTML = "Listening...";
        recognition.start();
    };

    recognition.onresult = function(event) {
        let text = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript + " ";
        }

        transcript.innerHTML = text;
    };

    recognition.onerror = function(event) {
        alert("Speech Recognition Error: " + event.error);
        console.log(event);
    };

    recognition.onend = function() {
        startBtn.innerHTML = "START RECORDING";
    };
}