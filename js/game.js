const q = new Quiz();
q.player.push(new Player());

document.getElementById('startButton').addEventListener('click',
    () => {
        document.getElementById('startmenu').classList.add('hidden');

        setTimeout(() => { document.getElementById('question-box').classList.remove('hidden') }, 500);
        q.load();

        //Starta animationen :D
        
        /*setTimeout(() => {
            loop();
        }, 0);*/

        //triggerWorker();
        
        //Anpassar canvasens storlek och renderar om alla stjärnor när fönstret ändrar storlek
        window.addEventListener('resize', () => {
            setWH();
            redrawStars(gfxConf.presets[gfxConf.current].stars);
        })

        q.player[0].name = document.getElementById('name').getElementsByTagName('input')[0].value;
})

let c = document.getElementById('bgCanvas');
let bitmap = c.getContext('bitmaprenderer');
let o = new OffscreenCanvas(c.width, c.height);

let worker = new Worker('js/bgworker.js');
worker.postMessage({canvas: o},[o]);

window.addEventListener('message', (e) => {
    if(e.data.msg == 'render') {
        bitmap.transferFromImageBitmap(e.data.bitmap);
    }
});










