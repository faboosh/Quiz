const q = new Quiz();
q.player.push(new Player());

document.getElementById('startButton').addEventListener('click',
    () => {
        document.getElementById('startmenu').classList.add('hidden');

        setTimeout(() => { document.getElementById('question-box').classList.remove('hidden') }, 500);
        q.load();

        //Anpassar canvasens storlek och renderar om alla stjärnor när fönstret ändrar storlek
        window.addEventListener('resize', () => {
            console.log('resized');
            w = window.innerWidth;
            h = window.innerHeight;
            worker.postMessage({msg: 'resize', h: h, w: w});
        })

        q.player[0].name = document.getElementById('name').getElementsByTagName('input')[0].value;
    })

let c = document.getElementById('bgCanvas');
c.height = window.innerHeight;
c.width = window.innerWidth;
let o = c.transferControlToOffscreen();

let w = window.innerWidth;
let h = window.innerHeight;

let worker = new Worker('js/bgworker.js');

async function startWorker() {
    new Promise((resolve, reject) => {
        resolve(new FetchJson().fetch('config/graphics.json'));
    }).then((gfxConf) => {
        worker.postMessage(
            {
                msg: 'init',
                canvas: o,
                gfxConf: gfxConf,
                h: h,
                w: w
            }, [o])
    })
}

worker.addEventListener('message', (e) => {
    if (e.data.msg == 'render') {
        bitmap.transferFromImageBitmap(e.data.bitmap);
    }
});

startWorker();








