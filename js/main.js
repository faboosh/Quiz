//Skapar ett objekt med referenser till HTML-elementen för frågan + svarsalternativ
let qBox;

window.addEventListener('DOMContentLoaded', () => {
    qBox = {
        q: document.getElementById('question'),
        options: [
            document.getElementById('lbl1'),
            document.getElementById('lbl2'),
            document.getElementById('lbl3'),
            document.getElementById('lbl4')
        ],
        correct: ''
    }
});

//Skapar ett objekt för att lagra frågorna och initierar frågeräknaren
let questions = {};
let currectQuestion = 0;

//Sätter vilken fråga som nu är aktiv, tar frågeobjekt som input
function setQuestion(question){
    qBox.q.innerHTML = question.title;
    for(i = 0; i < question.options.length; i++){
        qBox.options[i].innerHTML = `<input type="checkbox" id="option${i+1}">${question.options[i]}`;
    } 
    qBox.correct = question.correct;
}

//Sköter all CSS som krävs för övergången mellan frågor
function transitionToNextQuestion(){
    let box = document.getElementById('questionBox');
    box.classList.add('hidden');
    setTimeout(() => {
        box.classList.add('switch');
    }, 500);
    setTimeout(() => {
        box.classList.remove('hidden');
        
        box.classList.remove('switch');
    }, 600); 
};

//Kör övergången mellan frågor och laddar in nästa fråga
function nextQuestion(){
    currectQuestion++;
    transitionToNextQuestion();
    setTimeout(() => { 
        setQuestion(questions[currectQuestion])
    }, 500);
}

//Laddar in frågorna från questions.json och parsear dem till objektet 'questions'
let req = new XMLHttpRequest();

req.onload = () => {
	if (req.status >= 200 && req.status < 300) {
        console.log('Questions loaded');
        questions = req.response;     

	} else {
        console.log('The request failed!');
        qBox.q.innerHTML = "Failed to get questions, try reloading page";
    }

    questions = JSON.parse(questions);
    questions = questions.questions;

    setQuestion(questions[currectQuestion]);

    document.getElementById('nextQuestion').addEventListener('click', () => {
        nextQuestion();
    });
};

req.open('GET', 'config/questions.json');
req.send();