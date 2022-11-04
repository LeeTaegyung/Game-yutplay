export class MovePoint {
    constructor(denoteSize, moveCoor, arrival) {
        this.arrival = arrival;
        this.denoteSize = denoteSize;
        this.x = moveCoor[moveCoor.length-1].x; // 도착 x
        this.y = moveCoor[moveCoor.length-1].y; // 도착 y
        this.idx = moveCoor[moveCoor.length-1].idx; // 도착 idx
        this.route = moveCoor; // 경로
        
        if(this.x == undefined && this.y == undefined) {
            this.x = this.arrival.x;
            this.y = this.arrival.y;
            this.idx = this.arrival.idx;
        }
    }
    draw(ctx) {

        ctx.font = '12px sans-serif';
        let txtH = ctx.measureText('M').width;

        ctx.fillStyle = 'pink';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.denoteSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        
        ctx.fillStyle = '#000';
        ctx.fillText('이동', this.x, this.y + txtH / 2);
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