export class MovePoint {
    constructor(denoteSize, moveCoor) {
        this.denoteSize = denoteSize;
        this.x = moveCoor.x;
        this.y = moveCoor.y;
        this.idx = moveCoor.idx;
    }
    draw(ctx) {
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.denoteSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    areaIn(x, y) {
        if(this.x - this.denoteSize <= x && 
            this.y - this.denoteSize <= y && 
            this.x + this.denoteSize >= x && 
            this.y + this.denoteSize >= y 
        ) {
            return true;
        } else {
            return false;
        }

    }
}