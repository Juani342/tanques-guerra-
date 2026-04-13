export class Tank {
    constructor(x, y, color, isPlayer1) {
        this.x = x;
        this.y = y;
        this.width = 80; 
        this.height = 35;
        this.color = color;
        this.hp = 100;
        this.isPlayer1 = isPlayer1;
        this.currentAngle = isPlayer1 ? 45 : 135; 
    }

    updateAngle(newAngle) {
        if (this.isPlayer1) {
            this.currentAngle = Math.min(Math.max(newAngle, 0), 90);
        } else {
            this.currentAngle = Math.min(Math.max(newAngle, 90), 180);
        }
    }

    draw(ctx) {
        ctx.save();
        
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(this.x - 5, this.y + this.height + 2, this.width + 10, 5);

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + 5);
        ctx.rotate(-this.currentAngle * (Math.PI / 180));
        
        let gunGrad = ctx.createLinearGradient(0, -5, 0, 5);
        gunGrad.addColorStop(0, "#333");
        gunGrad.addColorStop(0.5, "#666");
        gunGrad.addColorStop(1, "#333");
        ctx.fillStyle = gunGrad;
        ctx.fillRect(0, -5, 50, 10);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, -5, 50, 10);
        ctx.restore();

        ctx.fillStyle = "#222";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(this.x - 5, this.y + this.height - 10, this.width + 10, 15, 5);
        else ctx.fillRect(this.x - 5, this.y + this.height - 10, this.width + 10, 15);
        ctx.fill();

        let bodyGrad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        bodyGrad.addColorStop(0, this.color);
        bodyGrad.addColorStop(1, "#000");
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(this.x, this.y, this.width, this.height - 5);
        ctx.strokeRect(this.x, this.y, this.width, this.height - 5);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 5, 20, Math.PI, 0);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        this.drawUI(ctx);
    }

    drawUI(ctx) {
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y - 25, this.width, 8);
        let hpColor = this.hp > 40 ? "#00ff00" : "#ff0000";
        ctx.fillStyle = hpColor;
        ctx.fillRect(this.x + 1, this.y - 24, (this.hp / 100) * (this.width - 2), 6);
    }
}