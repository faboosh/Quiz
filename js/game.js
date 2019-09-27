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
const channel = new MessageChannel();

//Array för alla workers 
let workerArray = [];

//Skapa canvas och worker för experimentell offscreen-rendering
class ExperimentalCanvasWorker {
    constructor(canvasName, pathToWorker, pathToConfig) {
        this.canvas = document.getElementById(canvasName);
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.offscreen = this.canvas.transferControlToOffscreen();
        this.worker = new Worker(pathToWorker);
        this.pathToConfig = pathToConfig;
    }

    async startWorker() {
        new Promise((resolve, reject) => {
            resolve(new FetchJson().fetch(this.pathToConfig));
        }).then((gfxConf) => {
            this.worker.postMessage(
                {
                    msg: 'init',
                    canvas: this.offscreen,
                    gfxConf: gfxConf,
                    h: window.innerHeight,
                    w: window.innerWidth
                }, [this.offscreen])
        })
    }
}

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
workerArray.push(starWorker);

//legacyrendering
workerArray.forEach((current) => {
    current.worker.addEventListener('message', (e) => {
        if (e.data.msg == 'render') {
            bitmap.transferFromImageBitmap(e.data.bitmap);
        }
    })
});



