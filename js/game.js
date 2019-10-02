const quiz = new Quiz();
quiz.player.push(new Player());

//Lyssnar efter när spelaren trycker på startknappen
document.getElementById('startButton').addEventListener('click', () => {
    //document.getElementById('startmenu').classList.add('hidden');

    //setTimeout(() => { document.getElementById('question-box').classList.remove('hidden') }, 500);
    quiz.toggleFullScreen();
    quiz.questions = quiz.jsonResponse.slice(0, document.getElementById('no-of-questions').valueAsNumber);
    updateCanvasRes();
    quiz.start();

    //Anpassar canvasens storlek och renderar om alla stjärnor när fönstret ändrar storlek
    window.addEventListener('resize', () => {
        updateCanvasRes();
    })

    quiz.player[0].name = document.getElementById('playername').value;
})

document.addEventListener('DOMContentLoaded', () => {
    quiz.load();
})

function updateCanvasRes(){
    console.log('resized');
    w = window.innerWidth;
    h = window.innerHeight;
    workerArray.forEach((current) => {
        current.worker.postMessage({ msg: 'resize', h: h, w: w });
    })
}



