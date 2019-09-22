let c = document.getElementById('bgCanvas');
let pen = c.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
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
        this.hasTrail = Math.random() > 0.95;
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
            pen.arc(this.trail[i][0], this.trail[i][1], this.size * i / 10, 0, 2 * Math.PI);
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

for (let i = 0; i < 200; i++) {
    stars.push(new Star(3, w * Math.random(), h * Math.random()));
}

function loop() {
    w = window.innerWidth;
    h = window.innerHeight;
    c.width = w;
    c.height = h;
    pen.clearRect(0, 0, c.width, c.height);

    stars.forEach((star) => {
        if (star.polarity) {
            star.oscPos += star.oscRate;
            if (star.oscPos >= star.oscMax) {
                star.polarity = false;
            }
        } else {
            star.oscPos -= star.oscRate;
            if (star.oscPos < 0) {
                star.polarity = true;
            }
        }
        
        if (star.trailInterval >= 4) {
            star.trail.push([star.x, star.y]);
            star.trailInterval = 0;
        } else {
            star.trailInterval++;
            if (star.trail.length > 10) {
                star.trail.splice(0, 1);
            }
        }

        star.x += star.velX * (Math.random()+ star.getSine());
        if (star.x >= c.width || star.x < 0) {
            star.velX -= 2 * star.velX;
        }

        star.y += star.velY * (Math.random() + star.getSine());
        if (star.y >= c.height || star.y < 0) {
            star.velY -= 2 * star.velY;
        }

        if(star.hasTrail) {
            star.drawTrail();
            if(!star.hasTrailSpeed){
                star.velY *= 2;
                star.velX *= 2;
                star.hasTrailSpeed = true; 
            }
            
        }

        star.draw();
    })


    window.requestAnimationFrame(loop);

}

loop();