class Question {
    constructor() {
        //objekt som håller nuvarande laddade frågor
        this.questions = {};
        //Skapar ett objekt med referenser till HTML-elementen för frågan + svarsalternativ
        window.addEventListener('DOMContentLoaded', () => {
            this.qBox = {
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
    }

    //Sätter vilken fråga som nu är aktiv, tar frågeobjekt som input
    setQuestion(question) {
        this.qBox.q.innerHTML = question.title;
        for (let i = 0; i < question.options.length; i++) {
            q.qBox.options[i].innerHTML = `<input type="checkbox" id="option${i + 1}">${question.options[i]}`;
        }
        this.qBox.correct = question.correct;
    }

    //Sköter all CSS som krävs för övergången mellan frågor
    transitionToNextQuestion() {
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
    nextQuestion() {
        currectQuestion++;
        this.transitionToNextQuestion();
        setTimeout(() => {
            this.setQuestion(this.questions[currectQuestion])
        }, 500);
    }

    loadQuestions() {
        //Laddar in frågorna från questions.json och parsear dem till objektet 'questions'
        let req = new XMLHttpRequest();

        req.onload = () => {
            if (req.status >= 200 && req.status < 300) {
                console.log('Questions loaded');
                this.questions = req.response;

            } else {
                console.log('The request failed!');
                q.qBox.q.innerHTML = "Failed to get questions, try reloading page";
            }

            this.questions = JSON.parse(this.questions);
            this.questions = this.questions.questions;

            this.setQuestion(this.questions[currectQuestion]);

            document.getElementById('nextQuestion').addEventListener('click', () => {
                this.nextQuestion();
            });
        };

        req.open('GET', 'config/questions.json');
        req.send();
    }
}

const q = new Question();
q.loadQuestions();

//Initierar frågeräknaren
 
let currectQuestion = 0;





