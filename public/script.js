const camera = document.getElementById("camera");
const transcript = document.getElementById("transcript");
const question = document.getElementById("question");
const startBtn = document.getElementById("startBtn");
const timerDisplay = document.getElementById("timer");

// Questions
const questions = [
    "Introduce yourself.",
    "Tell me about your final year project.",
    "What are your strengths?",
    "Why should we hire you?",
    "Where do you see yourself in five years?"
];

let currentQuestion = 0;

// ================= TIMER =================

let timer;
let seconds = 0;

function startTimer() {
    seconds = 0;

    if (timerDisplay) {
        timerDisplay.innerHTML = "00:00";
    }

    timer = setInterval(() => {
        seconds++;

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        if (timerDisplay) {
            timerDisplay.innerHTML =
                `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

// ================= CAMERA =================

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(stream => {
    if (camera) {
        camera.srcObject = stream;
    }
})
.catch(err => {
    alert("Please allow camera and microphone.");
    console.log(err);
});

// ================= AI VOICE =================

function speak(text) {

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}

// ================= START INTERVIEW =================

function startInterview() {
    window.location.href = "interview.html";
}

// ================= SPEECH RECOGNITION =================

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    // Start Recording Button
    if (startBtn) {

        startBtn.onclick = () => {

            if (currentQuestion === 0) {

                question.innerHTML = questions[currentQuestion];

                speak("Welcome to AI Mock Interview.");

                setTimeout(() => {

                    speak(questions[currentQuestion]);

                    recognition.start();

                    startTimer();

                    transcript.innerHTML = "Listening...";

                }, 2500);

            } else {

                recognition.start();

                startTimer();

                transcript.innerHTML = "Listening...";

            }

        };

    }

    // User Answer
    recognition.onresult = (event) => {

        let text = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {

            text += event.results