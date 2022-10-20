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
        this.endVal = undefined;
    }

    draw(ctx) {

        if(this.endVal) {
            this.sIdx = this.endVal.idx;
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

    updateEndVal(endVal) {
        this.endVal = endVal;
    }

    move() {
        // this.endVal
        if(!(this.endVal.x == this.sX)) {
            if((this.endVal.x - this.sX) > 0) {
                this.sX += 1;
            } else if((this.endVal.x - this.sX) < 0) {
                this.sX -= 1;
            }
            
        }

        if(!(this.endVal.y == this.sY)) {
            if((this.endVal.y - this.sY) > 0) {
                this.sY += 1;
            } else if((this.endVal.y - this.sY) < 0) {
                this.sY -= 1;
            }
        }

        // 목적지에 도착하면,
        if((this.endVal.x == this.sX) && (this.endVal.y == this.sY)) {
            this.select = false;
            this.endVal = undefined;
        }
        
    }

    
}