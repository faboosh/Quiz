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
            q.question.options[i].innerHTML = `<input type="checkbox" id="option${i+1}"><span></span><p>${question.options[i]}</p>`;
        }
        this.question.correct = question.correct;
    }

    //Sköter all CSS som krävs för övergången mellan frågor
    transition() {
        let box = document.getElementById('questionBox');
        box.classList.add('hidden', 'rainbow-boxshadow-flight');

        setTimeout(() => {
            box.classList.add('switch');
        }, 500);

        setTimeout(() => {
            box.classList.remove('hidden', 'rainbow-boxshadow-flight', 'switch');
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
        if(this.player[0].question >= this.questions.length - 1){
            this.player[0].question = 0;
        } else {
            this.player[0].question++;
        }

        if(this.checkAnswer()){
            this.question.title.innerText= 'Correct!';
        } else {
            this.question.title.innerText= 'Incorrect :(';
        }

        setTimeout(this.transition, 400);
        setTimeout(() => {
            this.set(this.questions[this.player[0].question])
        }, 600);
    }

    //Laddar in frågorna från en JSON-fil och parsear dem till objektet 'questions'
    async load() {
        let fetcher = new QuestionFetcher();
        this.questions = await fetcher.fetch();

        //Sätter nuvarande fråga till första frågan i 'questions' och renderar den i dokumentet
        this.set(this.questions[0]);

        //Lägger en event listener på en knapp, som kör funktionen som laddar och renderar nästa fråga
        document.getElementById('nextQuestion').addEventListener('click', () => {
            this.next();
        });
    }
}

const q = new Question();
q.player.push(new Quiz('Fabian'));
q.load();







