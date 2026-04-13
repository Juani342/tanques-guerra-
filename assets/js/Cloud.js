export class Cloud {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * 1000;
        this.y = Math.random() * 150 + 50;
        this.width = 60;
        this.speed = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speed;
        if (this.x > 1000) this.x = -60;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.arc(this.x + 20, this.y - 10, 25, 0, Math.PI * 2);
        ctx.arc(this.x + 45, this.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isClicked(mx, my) {
        return (mx > this.x && mx < this.x + 60 && my > this.y - 20 && my < this.y + 20);
    }
}