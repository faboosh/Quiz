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
        this.age = 100 * Math.random();
        this.osc1Rate = 2 * Math.random();
        this.osc2Rate = 2 * Math.random();
        this.osc1Pos = 0;
        this.osc2Pos = 0;
        this.oscMax = 1000;
        this.polarity = true;
        this.hasTrail = Math.random() > 0.99;
        this.hasTrailSpeed = false;
        this.trail = [];
        this.trailInterval = 5;
        this.chromaticAbberation = Math.random();
        if (this.hasTrail) {
            this.size *= 2;
        }
        this.velX = (1 * Math.random() - 0.5 * this.size) / 3;
        this.velY = (1 * Math.random() - 0.5 * this.size) / 3;
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
        ctx.fillStyle = `rgba(255,255,255, ${1})`;
        ctx.fill();
    }

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

//framerate limiting
let fps;
let now;
let then = performance.now();
let interval;
let frametime;
let gfxConf;
let c;
let pen;
let currentFrame;
let averageFrametime = 0;
let frameCounter = 0;
let samplingInterval = 300;

function animate() {
    currentFrame = self.requestAnimationFrame(animate);
    now = performance.now();
    frametime = now - then;

    if (frametime > interval) {

        then = now - (frametime % interval);
        if(gfxConf.dynamicRendering) {
            frameCounter++
            if (frameCounter <= samplingInterval) {
                averageFrametime += frametime;
            } else {
    
                if ((averageFrametime / frameCounter) > gfxConf.maxFrameTime && (gfxConf.current + 1) < gfxConf.presets.length) {
                    gfxConf.current++;
                    console.log('config changed to ' + gfxConf.presets[gfxConf.current].title);
                    redrawStars(gfxConf.presets[gfxConf.current].stars);
                } else if ((averageFrametime / frameCounter) < gfxConf.minFrameTime && gfxConf.current != 0) {
                    gfxConf.current--;
                    console.log('config changed to ' + gfxConf.presets[gfxConf.current].title);
                    redrawStars(gfxConf.presets[gfxConf.current].stars);
                }
                //console.log(averageFrametime / frameCounter + 'ms');
                frameCounter = 0;
                averageFrametime = 0;
            }
    
        }

        //console.log('animated');
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
                if (!stars[i].hasTrailSpeed) {
                    stars[i].velY *= 5;
                    stars[i].velX *= 5;
                    stars[i].hasTrailSpeed = true;
                }
            }
            stars[i].draw(pen);

        }
    }
}
self.onmessage = (e) => {
    if (e.data.msg == 'init') {
        c = e.data.canvas;
        pen = c.getContext('2d');
        w = e.data.w;
        h = e.data.h;
        gfxConf = e.data.gfxConf;
        fps = gfxConf.maxFPS;
        interval = 1000 / fps;
        animate();
        drawStars(gfxConf.presets[gfxConf.current].stars);
    }

    if (e.data.msg === 'pause' && gfxConf.presets[gfxConf.current].freezeOnTransition) {
        console.log(e.data.msg);
        self.cancelAnimationFrame(currentFrame);
    }

    if (e.data.msg === 'play' && gfxConf.presets[gfxConf.current].freezeOnTransition) {
        animate();
    }

    if (e.data.msg === 'resize') {
        w = e.data.w;
        h = e.data.h;
        updateCanvasRes(w, h);
    }
}

function updateCanvasRes(newW, newH) {
    w = newW;
    h = newH;
    c.height = h;
    c.width = w;
    redrawStars(gfxConf.presets[gfxConf.current].stars);
}