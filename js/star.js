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
        this.hasTrail = Math.random() > 0.995;
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

    //Räknar ut sinusmotsvarigheten till oscillatorns position
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