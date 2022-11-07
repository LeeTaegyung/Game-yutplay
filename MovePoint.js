export class MovePoint {
    constructor(denoteSize, moveCoor, arrival, movePointTxt) {
        this.arrival = arrival;
        this.denoteSize = denoteSize;
        this.x = moveCoor[moveCoor.length-1].x; // 도착 x
        this.y = moveCoor[moveCoor.length-1].y; // 도착 y
        this.idx = moveCoor[moveCoor.length-1].idx; // 도착 idx
        this.route = moveCoor; // 경로
        this.movePointTxt = movePointTxt;
        
        if(this.x == undefined && this.y == undefined) {
            this.x = this.arrival.x;
            this.y = this.arrival.y;
            this.idx = this.arrival.idx;
        }
    }
    draw(ctx) {

        ctx.font = '14px "Gowun Dodum"';

        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.denoteSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        
        ctx.fillStyle = '#fff';
        ctx.fillText(this.movePointTxt, this.x, this.y);
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