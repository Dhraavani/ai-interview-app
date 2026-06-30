const camera = document.getElementById("camera");
const transcript = document.getElementById("transcript");
const startBtn = document.getElementById("startBtn");

const questions = [
    "Introduce yourself.",
    "What are your strengths?",
    "Why should we hire you?",
    "Tell me about one of your projects."
];

let currentQuestion = 0;

// Camera
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(stream=>{
    camera.srcObject = stream;
});

// AI Voice
function speak(text){
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
}

// Ask first question automatically
window.onload = ()=>{
    setTimeout(()=>{
        speak("Welcome to AI Mock Interview.");
        setTimeout(()=>{
            speak(questions[currentQuestion]);
        },2500);
    },1000);
};

// Speech Recognition
const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = "en-US";

startBtn.onclick = ()=>{

    transcript.innerHTML="Listening...";

    recognition.start();

};

recognition.onresult=(event)=>{

    let text="";

    for(let i=event.resultIndex;i<event.results.length;i++){

        text+=event.results[i][0].transcript;

    }

    transcript.innerHTML=text;

};

recognition.onend=()=>{

    currentQuestion++;

    if(currentQuestion<questions.length){

        setTimeout(()=>{

            speak(questions[currentQuestion]);

        },1500);

    }else{

        speak("Interview Completed. Thank you.");

    }

};