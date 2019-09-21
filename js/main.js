class Quiz{
    constructor(name) {
        //
        this.name = name || '';
        //Initierar frågeräknaren
        this.question = 0;
    }
}

class Question {
    constructor() {
        this.player = [];
        //objekt som håller nuvarande laddade frågor
        this.questions = {};
        //Skapar ett objekt med referenser till HTML-elementen för frågan + svarsalternativ
        window.addEventListener('DOMContentLoaded', () => {
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
        this.question.title.innerHTML = question.title;
        for (let i = 0; i < question.options.length; i++) {
            q.question.options[i].innerHTML = `<input type="checkbox" id="option${i + 1}">${question.options[i]}`;
        }
        this.question.correct = question.correct;
    }

    //Sköter all CSS som krävs för övergången mellan frågor
    transition() {
        let box = document.getElementById('questionBox');
        box.classList.add('hidden');
        box.classList.add('rainbow-boxshadow-flight');

        setTimeout(() => {
            box.classList.add('switch');
        }, 500);

        setTimeout(() => {
            box.classList.remove('hidden');
            box.classList.remove('rainbow-boxshadow-flight');
            box.classList.remove('switch');
        }, 600);
    };

    checkAnswer() {
        let answers = Array.from(document.getElementsByTagName('input')).map((answer) => {return answer.checked});
        return this.question.correct.every((i) => {
            return answers[i] == true;
        });
    }

    //Kör övergången mellan frågor och laddar in nästa fråga
    next() {
        if(player.question >= this.questions.length - 1){
            this.player[0].question = 0;
        } else {
            this.player[0].question++;
        }

        console.log(this.checkAnswer());

        this.transition();
        setTimeout(() => {
            this.set(this.questions[this.player[0].question])
        }, 500);
    }

    //Laddar in frågorna från questions.json och parsear dem till objektet 'questions'
    load() {
        let req = new XMLHttpRequest();

        //Sparar innehållet från JSON-filen i 'questions', ifall det misslyckas skrivs detta ut på skärmen
        req.onload = () => {
            if (req.status >= 200 && req.status < 300) {
                console.log('Questions loaded');
            } else {
                console.log('The request failed!');
                q.question.title.innerHTML = "Failed to get questions, try reloading page";
            }

            //Gör om JSON-strängen till ett objekt och hämtar ut relevant data
            this.questions = JSON.parse(req.response).questions;

            //Sätter nuvarande fråga till första frågan i 'questions' och renderar den i DOM
            this.set(this.questions[this.player[0].question]);

            //Lägger en event listener på en knapp, som kör funktionen som laddar och renderar nästa fråga
            document.getElementById('nextQuestion').addEventListener('click', () => {
                this.next();
            });
        };
        
        //Specar sökväg till JSON-filen och skickar requesten 
        req.open('GET', 'config/questions.json');
        req.send();
    }
}


const player = new Quiz('Fabian');
const q = new Question();
q.player.push(player);
q.load();







