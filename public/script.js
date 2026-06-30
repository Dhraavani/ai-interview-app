const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const question = document.getElementById("question");
const answerText = document.getElementById("answerText");
const status = document.getElementById("status");
const timer = document.getElementById("timer");
const score = document.getElementById("score");

const questions = [
  "Tell me about yourself.",
  "Why should we hire you?",
  "What are your strengths?",
  "Explain your final year project.",
  "Where do you see yourself in five years?"
];

let currentQuestion = 0;
let seconds = 0;
let timerInterval;

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false;

function startTimer() {
    seconds = 0;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        seconds++;
        const min = String(Math.floor(seconds / 60)).padStart(2,"0");
        const sec = String(seconds % 60).padStart(2,"0");
        timer.textContent = `${min}:${sec}`;
    },1000);
}

function speak(text){

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 1;

    speech.onstart = ()=>{
        status.textContent="🔊 AI Speaking";
    };

    speech.onend = ()=>{
        status.textContent="🎤 Listening";
        recognition.start();
    };

    speechSynthesis.speak(speech);
}

startBtn.addEventListener("click",async()=>{

    const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
    });

    video.srcObject = stream;

    startTimer();

    question.textContent = questions[currentQuestion];

    speak(questions[currentQuestion]);
});
recognition.onresult = (event) => {

    const answer = event.results[0][0].transcript;

    answerText.textContent = answer;

    const randomScore = Math.floor(Math.random() * 21) + 80;

    score.textContent = randomScore + " / 100";

    status.textContent = "✅ Answer Recorded";

    currentQuestion++;

    if(currentQuestion < questions.length){

        setTimeout(()=>{

            question.textContent = questions[currentQuestion];

            answerText.textContent = "Waiting...";

            score.textContent = "Waiting for evaluation...";

            speak(questions[currentQuestion]);

        },2000);

    }else{

        clearInterval(timerInterval);

        question.textContent = "🎉 Interview Completed!";

        status.textContent = "✅ Finished";

        score.textContent = "Final Score: 90 / 100";

        speechSynthesis.speak(
            new SpeechSynthesisUtterance(
                "Congratulations. Your interview is completed."
            )
        );
    }
};

recognition.onerror = (event)=>{
    status.textContent = "Error: " + event.error;
};