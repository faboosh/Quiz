class Cloud{
    constructor() {
        this.width;
        this.height;

    }

    render() {

    }
}

let c; //Canvas-element
let pen; //Canvasens rendering context
let gfxConf; //Lagrar grafikinställningar
let fps; //Target-fps:en
let now; //Nuvarande tidpunkt
let then = performance.now(); //Tidpunkten då senaste bildruta ritades
let interval; //Antalet millisekunder per bildruta
let frametime;  //Lagrar frametime för nuvarande bildruta
let currentFrame; //Lagrar den nuvarande bildrutan i animationen
let averageFrametime = 0; //Lagrar alla frametimes mellan frameratesamplingsintervallen
let frameCounter = 0; //Räknar antal bildruta mellan
let samplingInterval; //Antal frames som ska vara mellan varje optimeringsförsök
let lastOptimize = performance.now(); //Tidpunkten då senaste optimeringen skedde
let minOptimizeInterval; //Minimumtid mellan optimeringar i millisekunder

function animate() {
    //Requestar ny bildruta och lagrar den nuvarande bildrutan i
    //currentFrame (behövs för att kunna pausa animationen)
    currentFrame = self.requestAnimationFrame(animate);
    now = performance.now();
    frametime = now - then;

    if (frametime > interval) {
        then = now - (frametime % interval);
        if(gfxConf.dynamicRendering) {
            frameCounter++
            if (frameCounter < samplingInterval) {
                averageFrametime += frametime;
            } else {
                if ((averageFrametime / frameCounter) > gfxConf.maxFrameTime && (gfxConf.current + 1) < gfxConf.presets.length && ((now -lastOptimize) > minOptimizeInterval)) {
                    lastOptimize = performance.now();
                    gfxConf.current++;
                    console.log('config changed to ' + gfxConf.presets[gfxConf.current].title);
                    redrawStars(gfxConf.presets[gfxConf.current].stars);
                } else if ((averageFrametime / frameCounter) < gfxConf.minFrameTime && gfxConf.current != 0  && ((now -lastOptimize) > minOptimizeInterval)) {
                    lastOptimize = performance.now();
                    gfxConf.current--;
                    console.log('config changed to ' + gfxConf.presets[gfxConf.current].title);
                    redrawStars(gfxConf.presets[gfxConf.current].stars);
                }
                if (gfxConf.logFrametime){
                    console.log('Frametime: ' + Math.round(averageFrametime / frameCounter) + 'ms \n FPS:' + Math.round(1000/Math.round(averageFrametime / frameCounter)));
                }    
                frameCounter = 0;
                averageFrametime = 0;
            }
        }

        //Rensar ritytan
        pen.clearRect(0, 0, w, h);

        //Renderar stjärnorna
    }
}

self.onmessage = (e) => {
    //Initialiserar bakgrunds-workern med canvasens 
    //nuvarande storlek, nuvarande grafik-config 
    //och startar animationen
    if (e.data.msg == 'init') {
        c = e.data.canvas;
        pen = c.getContext('2d');
        w = e.data.w;
        h = e.data.h;
        gfxConf = e.data.gfxConf;
        console.log(gfxConf);
        fps = gfxConf.maxFPS;
        interval = 1000 / fps;
        samplingInterval = gfxConf.samplingInterval;
        minOptimizeInterval = gfxConf.minTimeBetweenOptimization;
        animate();
    }

    //Pausar bakgrunden medan övergången mellan frågor körs 
    //ifall freezeOnTransition i grafik-configen är på
    if (e.data.msg === 'pause' && gfxConf.presets[gfxConf.current].freezeOnTransition) {
        console.log(e.data.msg);
        self.cancelAnimationFrame(currentFrame);
    }

    //Sätter igång bakgrunden igen efter den pausats, 
    //ifall freezeOnTransition i grafik-configen är på
    if (e.data.msg === 'play' && gfxConf.presets[gfxConf.current].freezeOnTransition) {
        console.log(e.data.msg);
        animate();
    }

    //Uppdaterar canvasens upplösning till skärmens
    //upplösning då huvudsidan rapporterar att 
    //upplösningen ändras
    if (e.data.msg === 'resize') {
        w = e.data.w;
        h = e.data.h;
        updateCanvasRes(w, h);
    }
}

//Uppdaterar canvasens storlek med en ny höjd och
//bredd, samt ritar om alla stjärnor så de passar inom den
//nya skärmytan
function updateCanvasRes(newW, newH) {
    w = newW;
    h = newH;
    c.height = h;
    c.width = w;
    //redraw
}