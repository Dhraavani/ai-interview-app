const camera = document.getElementById("camera");
const transcript = document.getElementById("transcript");
const question = document.getElementById("question");
const startBtn = document.getElementById("startBtn");
const timerDisplay = document.getElementById("timer");

// Interview Questions
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

if (camera) {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    .then(stream => {
        camera.srcObject = stream;
    })
    .catch(err => {
        alert("Please allow camera and microphone.");
        console.log(err);
    });
}

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

// ================= HOME PAGE =================

function startInterview() {
    window.location.href = "interview.html";
}

// ================= SPEECH RECOGNITION =================

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition && startBtn) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    startBtn.onclick = () => {

        transcript.innerHTML = "Listening...";

        if (currentQuestion === 0) {

            question.innerHTML = questions[currentQuestion];

            speak("Welcome to AI Mock Interview.");

            setTimeout(() => {

                speak(questions[currentQuestion]);

                recognition.start();

                startTimer();

            }, 2500);

        } else {

            recognition.start();

            startTimer();

        }

    };
    // ================= USER ANSWER =================

    recognition.onresult = (event) => {

        let text = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {

            text += event.results[i][0].transcript;

        }

        transcript.innerHTML = text;

    };

    // ================= RECORDING ENDED =================

    recognition.onend = () => {

        stopTimer();

        currentQuestion++;

        if (currentQuestion < questions.length) {

            question.innerHTML = questions[currentQuestion];

            transcript.innerHTML = "Click START RECORDING for the next answer.";

            setTimeout(() => {

                speak(questions[currentQuestion]);

            }, 1000);

        } else {

            question.innerHTML = "Interview Completed";

            transcript.innerHTML =
                "Thank you for attending the AI Mock Interview.";

            speak("Interview completed. Thank you and all the best.");

            startBtn.disabled = true;
            startBtn.innerHTML = "INTERVIEW COMPLETED";

        }

    };

    // ================= ERRORS =================

    recognition.onerror = (event) => {

        stopTimer();

        console.log(event.error);

        transcript.innerHTML =
            "Microphone error: " + event.error;

    };

} else {

    console.log("Speech Recognition not supported or Start button not found.");

}