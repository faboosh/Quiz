//Skapar canvas och worker för experimentell offscreen-rendering
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