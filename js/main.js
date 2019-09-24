class Player {
    constructor(name) {
        //
        this.name = name || '';
        //Initierar frågeräknaren
        this.question = 0;

        this.answers = [];
    }
}

class Quiz {
    constructor() { 
        this.player = [];
        //objekt som håller nuvarande laddade frågor
        this.questions = {};
        //Skapar ett objekt med referenser till HTML-elementen för frågan + svarsalternativ
        window.addEventListener('DOMContentLoaded', () => {
            this.qBox = document.getElementById('question-box');
            this.question = {
                title: document.getElementById('question'),
                options: [
                    document.getElementById('lbl1'),
                    document.getElementById('lbl2'),
                    document.getElementById('lbl3'),
                    document.getElementById('lbl4')
                ],
                correct: []
            }
        });
    }

    //Sätter vilken fråga som nu är aktiv, tar frågeobjekt som input
    set(question) {
        document.getElementById('progress').innerHTML = `Current question: ${this.player[0].question + 1}/${this.questions.length}`;
        document.getElementById('title').innerHTML = `&#128187;RETROQUIZ&#128187; ${this.player[0].question + 1}/${this.questions.length}`;
        this.question.title.innerHTML = question.title;
        for (let i = 0; i < question.options.length; i++) {
            this.question.options[i].innerHTML = `<input type="checkbox" id="option${i+1}"><span></span><p>${question.options[i]}</p>`;
        }
        this.question.correct = question.correct;
    }

    //Sköter all CSS som krävs för övergången mellan frågor
    transition() {
        let qBox = document.getElementById('question-box');

        if(this.checkAnswer()) {
            qBox.classList.add('fly', 'rainbow-boxshadow-flight');
        } else {
            qBox.classList.add('fly-failed');
        }
        

        setTimeout(() => {
            qBox.classList.add('switch');
        }, 500);

        setTimeout(() => {
            qBox.classList.remove('fly', 'rainbow-boxshadow-flight', 'switch', 'fly-failed');
        }, 600);
    }

    checkAnswer() {
        let answers = Array.from(document.getElementsByTagName('input')).map((answer) => {return answer.checked});
        return this.question.correct.every((i) => {
            return answers[i] == true;
        });
    }

    //Kör övergången mellan frågor och laddar in nästa fråga
    next() {
        let extraTimeout = 0;
        if(this.player[0].question >= this.questions.length - 1){
            this.player[0].question = 0;
            this.player[0].answers = [];
        } else {
            this.player[0].question++;
            
        }

        if(this.checkAnswer()){
            extraTimeout = 400;
            this.question.title.innerText= 'Correct!';
            this.qBox.classList.add('celebrate');
            setTimeout(() => {this.qBox.classList.remove('celebrate');}, extraTimeout);
            
        } else {
            this.question.title.innerText= 'Incorrect :(';
            setTimeout(() => {}, extraTimeout);
        }

        this.player[0].answers.push(this.checkAnswer());
        console.log(this.player[0].answers);

        setTimeout(() => {this.transition()}, 400 + extraTimeout);
        setTimeout(() => {this.set(this.questions[this.player[0].question])}, 1000 + extraTimeout);
    }

    //Laddar in frågorna från en JSON-fil och parsear dem till objektet 'questions'
    async load() {
        this.questions = await new FetchJson().fetch('config/questions.json');
        this.questions = this.questions.questions;

        //Sätter nuvarande fråga till första frågan i 'questions' och renderar den i dokumentet
        this.set(this.questions[0]);

        //Lägger en event listener på en knapp, som kör funktionen som laddar och renderar nästa fråga
        document.getElementById('nextQuestion').addEventListener('click', () => {
            this.next();
        });
    }
}

const q = new Quiz();
q.player.push(new Player('Fabian'));

function startGame() {
    document.getElementById('question-box').classList.remove('hidden');
    document.getElementById('startmenu').classList.add('hidden');
    q.load();
}

document.getElementById('startButton').addEventListener('click', 
() =>{
    document.getElementById('startmenu').classList.add('hidden');

    setTimeout(() => {document.getElementById('question-box').classList.remove('hidden')}, 500); 
    q.load();
});









