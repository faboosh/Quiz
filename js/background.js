let c1 = document.getElementById('bgCanvas');
let c2 = document.getElementById('bgCanvas2');
let pen1 = c1.getContext('2d');
let pen2 = c2.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
let centerW = window.innerWidth / 2;
let centerH = window.innerHeight / 2;

//Justerar canvasens storlek till fönstrets storlek
function setWH() {
    centerW = window.innerWidth / 2;
    centerH = window.innerHeight / 2
    w = window.innerWidth;
    h = window.innerHeight;
    c1.width = w;
    c1.height = h;
    c2.width = w;
    c2.height = h;
}

//Justerar canvasens storlek till fönstrets storlek
setWH();

//Hämtar och och lagrar grafikinställningar
let gfxConf;

async function getConf() {
    gfxConf = await new FetchJson().fetch('config/graphics.json');
    redrawStars(gfxConf.presets[gfxConf.current].stars);
}

getConf();

//Lagrar alla stjärnor
let stars = [];

//Tar bort alla stjärnor och renderar nya
function redrawStars(number) {
    stars = [];
    drawStars(number);
}

//Ritar ett specificerat antal stjärnor
function drawStars(number) {
    for (let i = 0; i < number; i++) {
        stars.push(new Star(1.5, w * Math.random(), h * Math.random()));
    }
}

/*let mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});*/

//Skapar skeppet
let ship = new SpaceShip(0, h * Math.random());

class GravityWell {
    constructor(size, push) {
        this.size = size;
        this.push = push;
    }
}

let starttime = 0;
let endtime = 0;
let frametime = 0;

//håller reda på antalet bildrutor sedan senaste optimering
let ticksUntilOptimize = 0;

//Antalet bildrutor mellan varje optimering
let optimizeInterval = 60;

//Renderar stjärnorna och alla andra bakgrundselement.
let alternate = false;
function loop() {
    //Registrerar tidpunkten vid bildrutans början
    starttime = performance.now();

    //Stjärnorna delas upp i 2 grupper. 
    let pen;
    let start = 0;
    let end = 0;
    if (!alternate) {
        pen = pen1;
        alternate = true;
        start = 0;
        end = stars.length / 2;
    } else {
        pen = pen2;
        alternate = false;
        start = stars.length / 2;
        end = stars.length;
    }

    pen.clearRect(0, 0, w, h);

    //Renderar stjärnorna
    for (let i = start; i < end; i++) {

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
            if (!stars[i].hasTrailSpeed) {
                stars[i].velY *= 5;
                stars[i].velX *= 5;
                stars[i].hasTrailSpeed = true;
            }
        }
        stars[i].draw(pen);
    }

    //Renderar skeppet ifall grafikinställningarna tillåter det och 
    if (gfxConf.presets[gfxConf.current].ship) {
        ship.attemptFlight(pen);
    }

    if (gfxConf.dynamicRendering) {
        //Räknar hur lång tid som är kvar till nästa optimering
        ticksUntilOptimize++;

        //Registrerar tidpunkten vid bildrutans slut
        endtime = performance.now();

        //Räknar ut hur lång bildrutan var och lagrar det i frametime
        frametime += endtime - starttime;

        //Ändrar grafikinställningar utifrån gfxConf baserat på snitt-frametime senaste sekunden
        if (ticksUntilOptimize >= optimizeInterval) {
            ticksUntilOptimize = 0;
            //console.log(frametime / optimizeInterval + ' ms');
            if ((frametime / optimizeInterval) > gfxConf.maxFrameTime && (gfxConf.current + 1) < gfxConf.presets.length) {
                gfxConf.current++;
                console.log('config changed to ' + gfxConf.presets[gfxConf.current].title);
                redrawStars(gfxConf.presets[gfxConf.current].stars);
            } else if ((frametime / optimizeInterval) < gfxConf.minFrameTime && gfxConf.current != 0) {
                gfxConf.current--;
                console.log('config changed to ' + gfxConf.presets[gfxConf.current].title);
                redrawStars(gfxConf.presets[gfxConf.current].stars);
            }
            frametime = 0;
        }
    }

    window.requestAnimationFrame(loop);
}