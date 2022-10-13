export class Horse {
    constructor(wX, wY, bgColor, size) {
        this.wX = wX;
        this.wY = wY;
        this.sX = undefined;
        this.sY = undefined;
        this.bgColor = bgColor;
        this.size = size;
        // this.active = false;
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

        // if(this.active) {
        //     // ctx.fillText('click', x, y + txtH / 2);

        //     if(this.select) {
        //         ctx.fillText('select', x, y + txtH / 2);
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

    // isSelect() {
    //     this.select = true;
    // }

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