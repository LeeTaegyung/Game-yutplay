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
        let x = this.sX != undefined ? this.sX : this.wX;
        let y = this.sY != undefined ? this.sY : this.wY;

        ctx.beginPath();
        ctx.fillStyle = this.bgColor;
        ctx.arc(x, y, this.size, 0, 2 * Math.PI);
        ctx.fill();

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

    checkHorseSelect(status) {
        this.selectStatus = status;
    }

    update(x, y) {
        this.sX = x;
        this.sY = y;
    }
    
}