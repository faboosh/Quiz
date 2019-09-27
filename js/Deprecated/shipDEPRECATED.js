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
        this.img.onload = () => {}
        this.img.src = 'img/spaceship.png';
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.img.width, this.img.height);
    }

    reset() {
        this.chanceOfSpawn = Math.random() * 1000;
        this.ticksUntilSpawn = 0;
        this.curve = (Math.random() - 0.5) * 5;
        this.y = h * Math.random();
        this.velY = Math.random() - 0.5;
        this.x = -100;
        this.paused = true;
    }

    nextPos() {
        this.x += this.velX;
        this.y += Math.sin(this.x / this.curve / 50);
    }

    attemptFlight(ctx) {
        this.ticksUntilSpawn++;
        if (this.ticksUntilSpawn > this.chanceOfSpawn) {
            this.paused = false;
        }
        if (!this.paused) {
            if (this.x > w) {
                this.reset();
            } else {
                this.nextPos();
            }

            this.draw(ctx);
        }
    }
}