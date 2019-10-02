const quiz = new Quiz();
quiz.player.push(new Player());

document.addEventListener('DOMContentLoaded', () => {
    quiz.load();
    //Anpassar canvasens storlek och renderar om alla stjärnor när fönstret ändrar storlek
    window.addEventListener('resize', () => {
        updateCanvasRes();
    })
})

document.getElementById('restart').addEventListener('click', () => {
    document.location.reload();
})

function updateCanvasRes() {
    console.log('resized');
    w = window.innerWidth;
    h = window.innerHeight;
    workerArray.forEach((current) => {
        current.worker.postMessage({ msg: 'resize', h: h, w: w });
    })
}

//Lyssnar efter när spelaren trycker på startknappen
document.getElementById('startButton').addEventListener('click', () => {
    quiz.questions = quiz.jsonResponse.slice(0, document.getElementById('no-of-questions').valueAsNumber);
    updateCanvasRes();
    quiz.start();
})




