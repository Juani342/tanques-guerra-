export class Structure {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.type = type; 
        this.hp = type === 'stone' ? 60 : 30; 
        this.active = true;
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        
        if (this.type === 'stone') {
            ctx.fillStyle = '#00f3ff';
            ctx.shadowColor = '#00f3ff';
        } else {
            ctx.fillStyle = '#ff0055';
            ctx.shadowColor = '#ff0055';
        }
        
        ctx.shadowBlur = 10;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}