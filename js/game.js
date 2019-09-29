const quiz = new Quiz();
quiz.player.push(new Player());


//Lyssnar efter när spelaren trycker på startknappen
document.getElementById('startButton').addEventListener('click',
    () => {
        document.getElementById('startmenu').classList.add('hidden');

        setTimeout(() => { document.getElementById('question-box').classList.remove('hidden') }, 500);
        quiz.load();

        //Anpassar canvasens storlek och renderar om alla stjärnor när fönstret ändrar storlek
        window.addEventListener('resize', () => {
            console.log('resized');
            w = window.innerWidth;
            h = window.innerHeight;
            workerArray.forEach((current) => {
                current.worker.postMessage({ msg: 'resize', h: h, w: w });
            })
        })

        quiz.player[0].name = document.getElementById('playername').value;
    })

//Meddelandekanal för workers

//Array för alla workers 
let workerArray = [];

//////////////////
//Starworker setup
//////////////////

let starWorker = new ExperimentalCanvasWorker('star-canvas', 'js/starworker.js', 'config/graphics.json');

starWorker.startWorker();
workerArray.push(starWorker);

//////////////////
//Cloudworker setup
//////////////////

let cloudWorker = new ExperimentalCanvasWorker('cloud-canvas', 'js/cloudworker.js', 'config/graphics.json');

cloudWorker.startWorker();
workerArray.push(cloudWorker);

//legacyrendering
/*workerArray.forEach((current) => {
    current.worker.addEventListener('message', (e) => {
        if (e.data.msg == 'render') {
            bitmap.transferFromImageBitmap(e.data.bitmap);
        }

        if (e.data.msg == 'transfer') {
            console.log('transfered');
        }
    })
});*/





