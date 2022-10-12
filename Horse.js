export class Horse {
    constructor(wX, wY, bgColor, size) {
        // 말 세팅(좌표값, 색상 등등)
        // 말 움직이기
        // 말 그리기
        this.wX = wX;
        this.wY = wY;
        this.sX = undefined;
        this.sY = undefined;
        this.bgColor = bgColor;
        this.size = size;
        this.select = false;
        // this.selected = false;
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

        // if(this.current) {
        //     if(this.selected && this.select) {
        //         ctx.fillText('select', x, y + txtH / 2);
        //     } else if(!this.selected) {
        //         ctx.fillText('click', x, y + txtH / 2);
        //     }
        // }

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

    currentCheck(current) {
        if(this.player == current) {
            this.current = true;
        } else {
            this.current = false;
        }
    }

    selectCheck(num, current) {
        if(num == 1 && this.player == current) {
            this.selected = true;
        } else {
            this.selected = false;
        }
    }

    // catch() {
    //     this.select = true;
    //     if(this.sX == undefined && this.sY == undefined) {
    //         this.update(this.stageStartX, this.stageStartY);
    //     }
    // }

    // put() {
    //     this.select = false;
    //     if(this.sX == this.stageStartX && this.sY == this.stageStartY) {
    //         this.update(undefined, undefined);
    //     }

    // }

    update(x, y) {
        this.sX = x;
        this.sY = y;
    }
    
}