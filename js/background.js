let c = document.getElementById('bgCanvas');
let pen = c.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
c.style.imageRendering = "pixelated";

c.width = w;
c.height = h;

let mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

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
        this.velX = 1 * Math.random() - 0.5;
        this.velY = 1 * Math.random() - 0.5;
        this.age = 100 * Math.random();
        this.oscRate = 5 * Math.random();
        this.oscPos = 0;
        this.oscMax = 1000;
        this.polarity = true;
        this.hasTrail = Math.random() > 0.98;
        this.hasTrailSpeed = false;
        this.trail = [];
        this.trailInterval = 5;
        this.chromaticAbberation = Math.random();
        if(this.hasTrail){
            this.size *= 2;
        }
    }

    getSine() {
        return Math.sin(Math.PI - this.oscPos / this.oscMax * Math.PI / 2);
    }

    drawTrail() {
        for (let i = 1; i < this.trail.length; i++) {
            pen.beginPath();
            pen.arc(this.trail[i][0], this.trail[i][1], this.size / 2, 0, 2 * Math.PI);
            pen.fillStyle = `rgba(255,255,255, ${1 * i / this.trail.length})`;
            pen.fill();
        }
        
    }

    draw() {
        /*pen.beginPath();
        pen.arc(this.x - this.chromaticAbberation * this.getSine(), this.y - this.chromaticAbberation * this.getSine(), this.size, 0, 2 * Math.PI); 
        pen.fillStyle = '#0000ff88';
        pen.fill();

        pen.beginPath();
        pen.arc(this.x + this.chromaticAbberation, this.y + this.chromaticAbberation, this.size, 0, 2 * Math.PI); 
        pen.fillStyle = '#ff000088';
        pen.fill();*/

        pen.beginPath();
        pen.arc(this.x, this.y, this.size, 0, 2 * Math.PI);    
        pen.fillStyle = `rgba(255,255,255, ${1})`;
        pen.fill();
        /*
        
        let first;
        if(this.trail.length > 10){
            first = this.trail[10];
        } else {
            first = this.trail[0];
        }
        let gradient = pen.createLinearGradient(this.x, this.y, first[0], first[1]);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        pen.moveTo(this.x, this.y);
        pen.lineTo(first[0], first[1]);
        pen.strokeStyle = gradient;
        pen.stroke();*/
    }
}

let stars = [];

for (let i = 0; i < 600; i++) {
    stars.push(new Star(2, w * Math.random(), h * Math.random()));
}
let flipflop = false;

function loop() {
    let start = 0;
    let end = 0;
    if (!flipflop) {
        flipflop = true;
        start = 0;
        end = stars.length / 2;
    } else {
        flipflop = false;
        start = stars.length / 2;
        end = stars.length;
        pen.clearRect(0, 0, c.width, c.height);
    }

    w = window.innerWidth;
    h = window.innerHeight;
    c.width = w;
    c.height = h;
    pen.clearRect(0, 0, c.width, c.height);

    for(let i = start; i < end; i++) {
        if (stars[i].polarity) {
            stars[i].oscPos += stars[i].oscRate;
            if (stars[i].oscPos >= stars[i].oscMax) {
                stars[i].polarity = false;
            }
        } else {
            stars[i].oscPos -= stars[i].oscRate;
            if (stars[i].oscPos < 0) {
                stars[i].polarity = true;
            }
        }
        
        if (stars[i].trailInterval >= 6) {
            stars[i].trail.push([stars[i].x, stars[i].y]);
            stars[i].trailInterval = 0;
        } else {
            stars[i].trailInterval++;
            if (stars[i].trail.length > 15) {
                stars[i].trail.splice(0, 1);
            }
        }

        stars[i].x += stars[i].velX * (Math.random()+ stars[i].getSine()) / 4;
        if (stars[i].x >= c.width || stars[i].x < 0) {
            stars[i].velX -= 2 * stars[i].velX;
        }

        stars[i].y += stars[i].velY * (Math.random() + stars[i].getSine() / 4);
        if (stars[i].y >= c.height || stars[i].y < 0) {
            stars[i].velY -= 2 * stars[i].velY;
        }

        if(stars[i].hasTrail) {
            stars[i].drawTrail();
            if(!stars[i].hasTrailSpeed){
                stars[i].velY *= 4;
                stars[i].velX *= 4;
                stars[i].hasTrailSpeed = true; 
            }
            
        }
        pen.mozImageSmoothingEnabled = false;
        pen.webkitImageSmoothingEnabled = false;
        pen.msImageSmoothingEnabled = false;
        pen.imageSmoothingEnabled = false;

        stars[i].draw();
    }



    window.requestAnimationFrame(loop);

}

loop();