let c1 = document.getElementById('bgCanvas');
let c2 = document.getElementById('bgCanvas2');
let pen1 = c1.getContext('2d');
let pen2 = c2.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
let centerW = window.innerWidth / 2;
let centerH = window.innerHeight / 2;

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

//Sets width and height of canvas to browser window
setWH();

let noOfStars = 1200;
let stars = [];

function drawStars(number) {
    stars = [];

    for (let i = 0; i < number; i++) {
        stars.push(new Star(2.5, w * Math.random(), h * Math.random()));
    }
}

let mouse = {
    x: undefined,
    y: undefined,
    pressed: false
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    console.log(mouse);
});

window.addEventListener('resize', () => {
    setWH();
    drawStars(noOfStars);
});

window.addEventListener('mousedown', () => {
    mouse.pressed = true;
    console.log(mouse.pressed);
});

window.addEventListener('mouseup', () => {
    mouse.pressed = false;
    console.log(mouse.pressed);
});

class SpaceShip {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 4;
        this.velY = -1;
        this.curve = 0;
        this.ticksUntilSpawn = 0;
        this.chanceOfSpawn = Math.random() * 1000;
        this.paused = true;
        this.img = new Image();
        this.img.onload = () => {

        }
        this.img.src = 'img/spaceship.png';
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.img.width, this.img.height);
    }
}

let ship = new SpaceShip(0, h * Math.random());

class GravityWell {
    constructor() {

    }
}

class Star {
    constructor(size, x, y) {
        let randomSize = size * Math.random() / 2;
        if (randomSize >= 0.3) {
            this.size = randomSize;
        } else {
            this.size = 0.3;
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
        this.velX = 1 * Math.random() - 0.5 * this.size;
        this.velY = 1 * Math.random() - 0.5 * this.size;
    }

    getSine(pos) {
        return Math.sin(Math.PI - pos / this.oscMax * Math.PI / 2);
    }

    drawTrail(ctx) {
        for (let i = 1; i < this.trail.length; i++) {
            ctx.beginPath();
            ctx.arc(this.trail[i][0], this.trail[i][1], this.size / 2, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255,255,255, ${1 * i / this.trail.length})`;
            ctx.fill();
        }

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255, ${1})`;
        ctx.fill();
    }
}

drawStars(noOfStars);
let alternate = false;

function loop() {
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

    for (let i = start; i < end; i++) {

        if (stars[i].osc1Polarity) {
            stars[i].osc1Pos += stars[i].osc1Rate;
            if (stars[i].osc1Pos >= stars[i].oscMax) {
                stars[i].osc1Polarity = false;
            }
        } else {
            stars[i].osc1Pos -= stars[i].osc1Rate;
            if (stars[i].osc1Pos < 0) {
                stars[i].osc1Polarity = true;
            }
        }

        if (stars[i].osc2Polarity) {
            stars[i].osc2Pos += stars[i].osc2Rate;
            if (stars[i].osc2Pos >= stars[i].oscMax) {
                stars[i].osc2Polarity = false;
            }
        } else {
            stars[i].osc2Pos -= stars[i].osc2Rate;
            if (stars[i].osc2Pos < 0) {
                stars[i].osc2Polarity = true;
            }
        }

        /*if(mouse.pressed) {
            let dX = mouse.x - stars[i].x;
            let dY = mouse.y - stars[i].y;
            let radius = 50;
            if((dY < radius && dY > -radius) && (dX < radius && dX > -radius)) {
                stars[i].accelX = dX * 0.1;
                stars[i].accelY = dY * 0.1;
                stars[i].accelerated = true;
            }
        }*/

        stars[i].x += stars[i].velX * (0.5 - stars[i].getSine(stars[i].osc1Pos));
        if (stars[i].x - 2 < 0) {
            stars[i].x = w;
        } else if (stars[i].x >= w) {
            stars[i].x = 0;
        }

        stars[i].y += stars[i].velY * (0.5 - stars[i].getSine(stars[i].osc2Pos));
        if (stars[i].y - 2 < 0) {
            stars[i].y = h;
        } else if (stars[i].y >= h) {
            stars[i].y = 0;
        }

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

    ship.ticksUntilSpawn++;

    if (ship.ticksUntilSpawn > ship.chanceOfSpawn) {
        ship.paused = false;
    }

    if(!ship.paused){
        if (ship.x > w) {
            ship.chanceOfSpawn = Math.random() * 1000;
            ship.ticksUntilSpawn = 0;
            ship.curve = (Math.random() - 0.5) * 5;
            ship.y = h * Math.random();
            ship.velY = Math.random() - 0.5;
            ship.x = -100;
            ship.paused = true;
        } else {  
            ship.x += ship.velX;
            ship.y += Math.sin(ship.x / ship.curve / 50);
        }
    
        ship.draw(pen);
    }

    window.requestAnimationFrame(loop);
}

loop();