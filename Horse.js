export class Horse {
    constructor(wX, wY, bgColor, size) {
        this.wX = wX;
        this.wY = wY;
        this.sX = undefined;
        this.sY = undefined;
        this.bgColor = bgColor;
        this.size = size;
        this.active = false;
        this.select = false;
        this.goal = false;
    }

    draw(ctx) {

        if(this.arrival && this.select) {
            this.sIdx = this.arrival.idx;
            this.move();
        }

        let x = this.sX != undefined ? this.sX : this.wX;
        let y = this.sY != undefined ? this.sY : this.wY;

        ctx.beginPath();
        ctx.fillStyle = this.bgColor;
        ctx.arc(x, y, this.size, 0, 2 * Math.PI);
        ctx.fill();

        // 글자표시
        ctx.font = '12px sans-serif';
        let txtH = ctx.measureText('M').width;
        ctx.fillStyle = '#fff';

        if(this.active) { // 말 활성화
            if(this.selectStatus) { // 말 하나라도 선택
                if(this.select) {
                    ctx.fillText('select', x, y + txtH / 2);
                }
            } else {
                if(!this.select) {
                    ctx.fillText('click', x, y + txtH / 2);
                    this.arrival = undefined;
                }
            }
            
        }

        ctx.closePath();
        
    }

    areaIn(x, y) {
        let horseX = this.sX != undefined ? this.sX : this.wX;
        let horseY = this.sY != undefined ? this.sY : this.wY;
        
        if(horseX - this.size <= x && 
            horseY - this.size <= y && 
            horseX + this.size >= x && 
            horseY + this.size >= y
        ) {
            return true;
        } else {
            return false;
        }
    }

    horseStatus(status) {
        this.selectStatus = status;
    }

    update(idx, x, y) {
        this.sIdx = idx;
        this.sX = x;
        this.sY = y;
    }

    updateArrival(arrival) {
        this.arrival = arrival;
    }

    move() {
    
        if(!(this.arrival.x == this.sX)) {

            if(this.arrival.x > this.sX) {
                this.sX += 1;
            } else {
                this.sX -= 1;
            }
            
        } else if(!(this.arrival.y == this.sY)) {

            if(this.arrival.y > this.sY) {
                this.sY += 1;
            } else {
                this.sY -= 1;
            }
        } else {
            // this.select = false;
        }
    }

    
}