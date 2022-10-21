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
        this.denote = undefined;
    }

    draw(ctx) {

        if(this.denote) {
            this.sIdx = this.denote.idx;
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

    updateDeonte(denote) {
        this.denote = denote;
        this.denoteIdx = 0;
    }

    move() {
        let nowRoute = this.denote.route[this.denoteIdx];
        let speed = 3;

        if(!(this.denote.x == this.sX) || !(this.denote.y == this.sY)) {
            // 최종 목적지에 도착하지 않았으면

            if(!(nowRoute.x == this.sX)) {
                if((nowRoute.x - this.sX) > 0) {
                    this.sX += speed;
                    if(nowRoute.x <= this.sX) {
                        this.sX = nowRoute.x;
                    }
                } else if((nowRoute.x - this.sX) < 0) {
                    this.sX -= speed;
                    if(nowRoute.x >= this.sX) {
                        this.sX = nowRoute.x;
                    }
                }
            }

            if(!(nowRoute.y == this.sY)) {
                if((nowRoute.y - this.sY) > 0) {
                    this.sY += speed;
                    if(nowRoute.y <= this.sY) {
                        this.sY = nowRoute.y;
                    }
                } else if((nowRoute.y - this.sY) < 0) {
                    this.sY -= speed;
                    if(nowRoute.y >= this.sY) {
                        this.sY = nowRoute.y;
                    }
                }
            }

            if((nowRoute.x == this.sX) && (nowRoute.y == this.sY)) {
                this.denoteIdx++;
            }

        } else {
            // 최종 목적지에 도착하면,
            this.select = false;
            this.denote = undefined;
        }
        
    }

    
}