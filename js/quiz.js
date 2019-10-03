class Quiz {
    constructor() {
        this.player = [];
        //objekt som håller nuvarande laddade frågor
        this.questions = {};
        //JSON-response
        this.jsonResponse;
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
            this.question.options[i].innerHTML = `<input class="answer" type="checkbox" id="option${i + 1}"><span></span><p>${question.options[i]}</p>`;
        }
        this.question.correct = question.correct;
    }

    //Sköter all CSS-klassbyten som krävs för övergången mellan frågor
    transition() {
        let qBox = document.getElementById('question-box');

        if (this.checkAnswer(Array.from(document.getElementsByClassName('answer')).map((answer) => { return answer.checked }))) {
            qBox.classList.add('fly', 'rainbow-boxshadow-flight');
        } else {
            qBox.classList.add('fly-failed');
        }

        setTimeout(() => {
            qBox.classList.add('switch');
        }, 500);

        setTimeout(() => {
            qBox.classList.remove('fly', 'rainbow-boxshadow-flight', 'switch', 'fly-failed');
            if (this.player[0].question == this.questions.length - 1) {
                document.getElementById('nextQuestion').innerText = "Finish Quiz";
            }
        }, 600);

        setTimeout(() => {
            workerArray.forEach((current) => {
                current.worker.postMessage({ msg: 'play' });
            })
        }, 900);
    }

    checkAnswer(answers) {
        //kollar så att användaren inte angett för många svar
        if (answers.filter((answer) => { return answer == true }).length == this.question.correct.length) {

            //Kollar så att svaren användaren angett är korrekta
            return this.question.correct.every((i) => {
                return answers[i] == true;
            });
        } else {
            //Returnerar false ifall användaren angett för många svar
            return false;
        }
    }

    //Kör övergången mellan frågor och laddar in nästa fråga
    next() {
        let extraTimeout = 0;
        this.player[0].question++;
        this.player[0].answers.push(this.checkAnswer(Array.from(document.getElementsByClassName('answer')).map((answer) => { return answer.checked })));
        if (this.player[0].question >= this.questions.length) {
            this.end();
        } else {
            if (this.checkAnswer(Array.from(document.getElementsByClassName('answer')).map((answer) => { return answer.checked }))) {
                extraTimeout = 400;
                this.question.title.innerText = 'Correct!';
                this.qBox.classList.add('celebrate');
                setTimeout(() => { this.qBox.classList.remove('celebrate'); }, extraTimeout);
            } else {
                this.question.title.innerText = 'Incorrect :(';
                setTimeout(() => { }, extraTimeout);
            }

            setTimeout(() => { this.transition() }, 400 + extraTimeout);
            setTimeout(() => { this.set(this.questions[this.player[0].question]) }, 1000 + extraTimeout);
        }
    }

    //Laddar in frågorna från en JSON-fil och parsear dem till objektet 'jsonResponse'
    async load() {
        this.questions = await new FetchJson().fetch('config/questions.json');
        this.jsonResponse = this.questions.questions;
        //Sätter maxantalet frågor som användaren kan välja baserat på antalet frågor som finns
        document.getElementById('no-of-questions').setAttribute('max', quiz.jsonResponse.length);
        //Visar play-knappen efter att frågorna är laddade
        document.getElementById('startButton').classList.remove('hidden');
    }

    start() {
        this.player[0].name = document.getElementById('playername').value;
        document.getElementById('startmenu').classList.toggle('hidden');
        document.getElementById('question-box').classList.toggle('hidden');

        //Sätter nuvarande fråga till första frågan i 'questions' och renderar den i dokumentet
        this.set(this.questions[0]);

        //Lägger en event listener på knappen next question, som kör funktionen som laddar och renderar nästa fråga
        document.getElementById('nextQuestion').addEventListener('click', () => {
            setTimeout(() => {
                workerArray.forEach((current) => {
                    current.worker.postMessage({ msg: 'pause' });
                })
            }, 900);
            this.next();
        });
    }

    end() {
        document.getElementById('endscreen').classList.toggle('hidden');
        document.getElementById('question-box').classList.toggle('hidden');
        let noOfCorrectAnswers = this.player[0].answers.filter((answer) => {return answer}).length;
        let noOfQuestions = this.questions.length;
        let ratio = noOfCorrectAnswers / noOfQuestions;
        let comment;
        if(ratio == 1) {
            comment = ', <br><br>You absolute nerd. <span>I like you.</span>';
        } else if (ratio >= 0.75) {
            comment = '. <br><br>Can\'t say I\'m disappointed.';
        } else if (ratio >= 0.5) {
            comment = '. <br><br>You\'re average at best :/';
        } else if (ratio < 0.5) {
            comment = '. <br><br>I want you to think about that. I am judging you.';
        }
        document.getElementById('endscreen-score').innerHTML = `${this.player[0].name}, you answered ${noOfCorrectAnswers} out of ${noOfQuestions} questions correctly${comment}`;
    }
}
