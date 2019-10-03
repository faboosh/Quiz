class Star {
    constructor(size, x, y) {
        let randomSize = size * Math.random() / 2;

        if (randomSize >= 0.2) {
            this.size = randomSize;
        } else {
            this.size = 0.2;
        }

        this.x = x;
        this.y = y;
        this.osc1Rate = 2 * Math.random();
        this.osc2Rate = 2 * Math.random();
        this.osc1Pos = 0;
        this.osc2Pos = 0;
        this.oscMax = 1000;
        this.polarity = true;
        this.hasTrail = Math.random() > 0.98;
        this.hasTrailSpeed = false;
        this.trail = [];
        this.trailInterval = 5;
        this.luminosity = 0.3 + Math.random() * 0.7;

        if (this.hasTrail || Math.random() > 0.9) {
            this.size *= 2;
        }

        this.velX = (1 * Math.random() - 0.5 * this.size) / 6;
        this.velY = (1 * Math.random() - 0.5 * this.size) / 6;
    }

    //Räknar ut sinusmotsvarigheten???? <--(probably inte ett ord) till oscillatorns position
    getSine(pos) {
        return Math.sin(Math.PI - pos / this.oscMax * Math.PI / 2);
    }

    //Ritar stjärnans svans (ifall den har en)
    drawTrail(ctx) {
        for (let i = 1; i < this.trail.length; i++) {
            ctx.beginPath();
            ctx.arc(this.trail[i][0], this.trail[i][1], this.size / 2, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255,255,255, ${1 * i / this.trail.length})`;
            ctx.fill();
        }
    }

    //Ritar stjärnan
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255, ${this.luminosity})`;
        ctx.fill();
    }

    //Uppdaterar oscillatorernas position och byter polaritet ifall den överskrider oscillatorns maxvärde
    calcOsc() {
        if (this.osc1Polarity) {
            this.osc1Pos += this.osc1Rate;
            if (this.osc1Pos >= this.oscMax) {
                this.osc1Polarity = false;
            }
        } else {
            this.osc1Pos -= this.osc1Rate;
            if (this.osc1Pos < 0) {
                this.osc1Polarity = true;
            }
        }
        if (this.osc2Polarity) {
            this.osc2Pos += this.osc2Rate;
            if (this.osc2Pos >= this.oscMax) {
                this.osc2Polarity = false;
            }
        } else {
            this.osc2Pos -= this.osc2Rate;
            if (this.osc2Pos < 0) {
                this.osc2Polarity = true;
            }
        }
    }

    //Räknar ut stjärnans position utifrån nuvarande hastighet och oscillatorernas position
    calcPos() {
        this.x += this.velX * (0.5 - this.getSine(this.osc1Pos));
        if (this.x >= w || this.x < 0) {
            this.velX -= 2 * this.velX;
        }
        this.y += this.velY * (0.5 - this.getSine(this.osc2Pos));
        if (this.y >= h || this.y < 0) {
            this.velY -= 2 * this.velY;
        }
    }
}

//Lagrar stjärnor
let stars = [];

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
        for (let i = 0; i < stars.length; i++) {
            //Beräknar stjärnans båda oscillatorers position
            stars[i].calcOsc();

            //Beräknar stjärnans nya position utifrån velX, velY och osillatorernas position
            stars[i].calcPos();

            //Ritar stjärnans svans ifall den har en
            if (stars[i].hasTrail) {
                if (stars[i].trailInterval >= 6) {
                    stars[i].trail.push([stars[i].x, stars[i].y]);
                    stars[i].trailInterval = 0;
                } else {
                    stars[i].trailInterval++;
                    if (stars[i].trail.length > 15) {
                        stars[i].trail.splice(0, 1);
                    }
                }
                stars[i].drawTrail(pen);

                //Ger stjärnan en högre hastighet ifall den har en svans
                if (!stars[i].hasTrailSpeed) {
                    stars[i].velY *= 10;
                    stars[i].velX *= 10;
                    stars[i].hasTrailSpeed = true;
                }
            }
            //Ritar stjärnan
            stars[i].draw(pen);
        }
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

    if (e.data.msg === 'start') {
        animate();
        redrawStars();
    }
}

let borders;
const channel = new BroadcastChannel('channel');
channel.onmessage = (e) => {
    if (e.data.msg == 'borders') {
        borders = JSON.parse(e.data.borders);
        redrawStars();
        animate();
    }
};

//Uppdaterar canvasens storlek med en ny höjd och
//bredd, samt ritar om alla stjärnor så de passar inom den
//nya skärmytan
function updateCanvasRes(newW, newH) {
    w = newW;
    h = newH;
    c.height = h;
    c.width = w;
}

//Tar bort alla stjärnor och renderar nya
function redrawStars() {
    stars = [];
    drawStars();
}

//Ritar ett specificerat antal stjärnor
function drawStars() {
    while (stars.length < gfxConf.presets[gfxConf.current].stars) {
        let x = w * Math.random();
        let y = h * Math.random();
        if(inBorder(x, y) || Math.random() > 0.85) {
            stars.push(new Star(2, x, y));
        }
    }
}

function inBorder(x, y) {
    let inBorder = false;
    for(let i = 0; i < borders.length; i++) {
        if(x > borders[i].x && x < borders[i].x + borders[i].width && y > borders[i].y && y < borders[i].y + borders[i].height) {
            inBorder = true;
            break;
        }
    }
    return inBorder;
}