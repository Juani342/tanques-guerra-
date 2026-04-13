export class Bullet {
    constructor(x, y, angle, power) {
        this.x = x;
        this.y = y;
        this.radius = 4;
        this.angle = angle * (Math.PI / 180);
        this.speed = power / 4;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = -Math.sin(this.angle) * this.speed;
        this.gravity = 0.2;
        this.active = true;
        this.isExploding = false;
        this.explosionRadius = 0;
    }

    update() {
        if (this.isExploding) {
            this.explosionRadius += 2;
            if (this.explosionRadius > 25) this.active = false;
            return;
        }

        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;

        if (this.y >= 410 || this.x <= 0 || this.x >= 1000) {
            if (this.y >= 410) this.y = 410;
            this.isExploding = true;
        }
    }

    draw(ctx) {
        ctx.save();
        if (this.isExploding) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "orange";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.explosionRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, ${150 - this.explosionRadius * 4}, 0, ${1 - this.explosionRadius/25})`;
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#fff"; 
            ctx.fill();
        }
        ctx.restore();
    }
}