export class MovePoint {
    constructor(denoteSize, moveCoor) {
        this.denoteSize = denoteSize;
        this.x = moveCoor[moveCoor.length-1].x; // 도착 x
        this.y = moveCoor[moveCoor.length-1].y; // 도착 y
        this.idx = moveCoor[moveCoor.length-1].idx; // 도착 idx
        this.route = moveCoor; // 경로
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