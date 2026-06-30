const camera = document.getElementById("camera");
const transcript = document.getElementById("transcript");
const question = document.getElementById("question");
const startBtn = document.getElementById("startBtn");

// Questions
const questions = [
    "Introduce yourself.",
    "Tell me about your final year project.",
    "What are your strengths?",
    "Why should we hire you?",
    "Where do you see yourself in five years?"
];

let currentQuestion = 0;

// Start camera
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(stream => {
    if (camera) camera.srcObject = stream;
})
.catch(err => {
    alert("Please allow camera and microphone.");
    console.log(err);
});

// AI Voice
function speak(text){
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

// Start Interview button on home page
function startInterview(){
    window.location.href="interview.html";
}

// Speech Recognition
const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if(SpeechRecognition){

    const recognition = new SpeechRecognition();

    recognition.lang="en-US";
    recognition.continuous=false;
    recognition.interimResults=true;

    // Ask first question automatically
    if(question){
        setTimeout(()=>{
            question.innerHTML=questions[currentQuestion];
            speak("Welcome to AI Mock Interview.");
            setTimeout(()=>{
                speak(questions[currentQuestion]);
            },2000);
        },1000);
    }

    if(startBtn){
        startBtn.onclick=()=>{

            transcript.innerHTML="Listening...";

            recognition.start();

        };
    }

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

            question.innerHTML=questions[currentQuestion];

            setTimeout(()=>{

                speak(questions[currentQuestion]);

            },1000);

        }else{

            question.innerHTML="Interview Completed";

            speak("Interview completed. Thank you.");

            startBtn.disabled=true;
            startBtn.innerHTML="Completed";

        }

    };

    recognition.onerror=(e)=>{

        console.log(e);

    };

}else{

    alert("Please use Google Chrome.");

}