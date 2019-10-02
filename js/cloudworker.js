class CloudBoxContainer {
    constructor(ctx) {
        this.clouds = []
        this.ctx = ctx;
    }

    addCloudBox(x, y, width, height, density, size, shade) {
        let cloudBox = new CloudBox(x, y, width, height, density, size, shade, this.ctx);
        this.clouds.push(cloudBox);
    }

    render() {
        this.ctx.clearRect(0, 0, w, h);
        this.clouds.forEach((cloud) => {
            cloud.drawCloud();
        });
        let coordinates = [];
        this.clouds.forEach((box) => {
            let current = {
                x: Math.round(box.x),
                y: Math.round(box.y),
                width: Math.round(box.w),
                height: Math.round(box.h)
            }
            coordinates.push(current);
        });
        this.emitJSON({ msg: 'borders', borders: JSON.stringify(coordinates) });
    }

    emitJSON(message) {
        channel.postMessage(message);
    }
}

class CloudBox {
    constructor(x, y, width, height, density, size, shade, ctx) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.ctx = ctx;
        this.drawBoundingBoxes = false;
        this.cloud = new Cloud(this.x, this.w, this.y, this.h, density, size, shade, this.ctx);
    }

    drawCloud() {
        if (this.drawBoundingBoxes) {
            this.ctx.strokeStyle = 'white';
            this.ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
        this.cloud.newRandom();
        this.cloud.render();
    }
}

class Cloud {
    constructor(x, w, y, h, number, size, shade, ctx) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.number = number;
        this.size = size;
        this.circles = [];
        this.shade = shade;
        this.ctx = ctx;
    }

    addCircle(x, y, radius) {
        this.circles.push(new GradientCircle(x, y, radius, this.shade));
    }

    randomCircles(number, x, w, y, h, radius) {
        this.circles = [];
        for (let i = 0; i < number; i++) {
            this.addCircle(x + w * Math.random(), y + h * Math.random(), radius * Math.random());
        }
    }

    newRandom() {
        this.randomCircles(this.number, this.x, this.w, this.y, this.h, this.size);
    }

    render() {
        this.circles.forEach((circle) => {
            circle.render(this.ctx);
        });
    }
}

class GradientCircle {
    constructor(x, y, radius, shade) {
        this.x = x;
        this.y = y;
        this.velX = Math.random();
        this.velY = Math.random();
        this.polX = true;
        this.polY = true;
        this.shade = shade;
        this.radius = radius;
        let minRadius = 40;
        if (this.radius < minRadius) {
            this.radius = minRadius;
        }
        this.pulsate = 0;
        let colorRand = Math.random();
        if (colorRand > 0.8) {
            this.basecolor = '255,' + this.shade;
        } else if (colorRand > 0.6) {
            this.basecolor = '150,' + this.shade;
        } else if (colorRand > 0.4) {
            this.basecolor = '80,' + this.shade;
        } else {
            this.basecolor = '30,' + this.shade;
        }
        this.luminosity = colorRand / 20;
        this.color1 = 'rgba(' + this.basecolor + ',' + this.luminosity + ')';
        this.color2 = 'rgba(' + this.basecolor + ',' + this.luminosity / 2 + ')';
        this.color3 = 'rgba(' + this.basecolor + ', 0)';
        this.midpoint = Math.random() * 0.5;
    }

    swell() {

    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color1);
        gradient.addColorStop(this.midpoint, this.color2);
        gradient.addColorStop(1, this.color3);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

let cloud;

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
        if (gfxConf.dynamicRendering) {
            frameCounter++
            if (frameCounter < samplingInterval) {
                averageFrametime += frametime;
            } else {
                if ((averageFrametime / frameCounter) > gfxConf.maxFrameTime && (gfxConf.current + 1) < gfxConf.presets.length && ((now - lastOptimize) > minOptimizeInterval)) {
                    lastOptimize = performance.now();
                    gfxConf.current++;
                    console.log('config changed to ' + gfxConf.presets[gfxConf.current].title);
                } else if ((averageFrametime / frameCounter) < gfxConf.minFrameTime && gfxConf.current != 0 && ((now - lastOptimize) > minOptimizeInterval)) {
                    lastOptimize = performance.now();
                    gfxConf.current--;
                    console.log('config changed to ' + gfxConf.presets[gfxConf.current].title);
                }
                if (gfxConf.logFrametime) {
                    console.log('Frametime: ' + Math.round(averageFrametime / frameCounter) + 'ms \n FPS:' + Math.round(1000 / Math.round(averageFrametime / frameCounter)));
                }
                frameCounter = 0;
                averageFrametime = 0;
            }
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
        fps = gfxConf.maxFPS / 2;
        interval = 1000 / fps;
        samplingInterval = gfxConf.samplingInterval;
        minOptimizeInterval = gfxConf.minTimeBetweenOptimization;
        renderClouds();
        //animate();
    }

    //Uppdaterar canvasens upplösning till skärmens
    //upplösning då huvudsidan rapporterar att 
    //upplösningen ändras
    if (e.data.msg === 'resize') {
        console.log('recieved');
        w = e.data.w;
        h = e.data.h;
        updateCanvasRes(w, h);
        renderClouds();
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
}

function renderClouds() {
    let xSkew = Math.random();
    let ySkew = Math.random();
    let c1Mod = Math.random();
    let c2Mod = Math.random();
    let container = new CloudBoxContainer(pen);
    let number = 35;
    let xInvert = Math.random() > 0.5;
    let yInvert = Math.random() > 0.5;
    function checkInverted(axis, i){
        if(axis){
            return number - i;
        } else {
            return i;
        }
    }
    for (let i = 0; i < number; i++) {
        let c1 = Math.round((255 * c1Mod) * i / number);
        let c2 = 255 - Math.round((255 * c2Mod) * i / number);
        let shade = c1 + ',' + c2;
        let x = w * Math.random() * 0.2 + w / number * (checkInverted(xInvert,i) * xSkew) + Math.sin(i) * number;
        let y = h * Math.random() * 0.2 + number + h / number * (checkInverted(yInvert,i) * ySkew) + Math.sin(i) * number;
        x += Math.sin(x / w * Math.PI * 2) * 100 * xSkew;
        y += Math.sin(y / h * Math.PI * 2) * 100 * ySkew;
        let wi = 300 + 200 * Math.random();
        let he = 300 + 200 * Math.random();
        container.addCloudBox(
            x - 100 - wi * 0.5,
            y - 100 - he * 0.5,
            wi + i * 20,
            (he + i * 20) / 2,
            200 + 50 * Math.random(), //molndenistet inom chunken
            75 + 25 * Math.random(), //storlek på gradient-cirklarna
            shade);
    }
    container.render();
    //animate();
}

const channel = new BroadcastChannel('channel');