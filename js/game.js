const quiz = new Quiz();
quiz.player = new Player();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').disabled = true;
    quiz.load();

    //Anpassar canvasens storlek och renderar om alla stjärnor/moln när fönstret ändrar storlek
    window.addEventListener('resize', () => {
        updateCanvasRes();
    })
})

document.getElementById('restart').addEventListener('click', () => {
    document.location.reload();
})

document.getElementById('no-of-questions').addEventListener('change', () => {
    document.getElementById('startButton').disabled = false;
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
    quiz.setNoOfQuestions();

    //force-uppdatering av upplösningen, då den ibland inte uppdaterades 
    //när upplösningen ändrats under tiden 
    //spelaren va på startstkärmen
    updateCanvasRes();

    quiz.start();
})


//Ritar ny bakgrund när användaren trycker på 'randomize new background'-knappen
document.getElementById('new-bg').addEventListener('click', () => {
    updateCanvasRes();
})




