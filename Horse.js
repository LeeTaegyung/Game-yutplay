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

        let x = this.sX != undefined ? this.sX : this.wX;
        let y = this.sY != undefined ? this.sY : this.wY;

        ctx.beginPath();
        ctx.fillStyle = this.bgColor;
        ctx.arc(x, y, this.size, 0, 2 * Math.PI);
        ctx.fill();

        // 글자표시
        ctx.font = '12px "Gowun Dodum"';
        let txtH = ctx.measureText('M').width;
        ctx.fillStyle = '#fff';

        if(!this.goal) {
            if(this.active) { // 말 활성화
                if(this.selectStatus) { // 말 하나라도 선택
                    if(this.select) {
                        ctx.fillText('선택', x, y);
                    }
                } else {
                    if(!this.select) { // select 된 말이 없으면,
                        ctx.fillText('클릭', x, y);
                    }
                }
            }
        } else {
            ctx.fillText('골인', x, y);
        }

        ctx.closePath();
    }

    areaIn(x, y) {
        let horseX = this.sX != undefined ? this.sX : this.wX;
        let horseY = this.sY != undefined ? this.sY : this.wY;
        
        if(horseX - this.size <= x && 
            horseY - this.size <= y && 
            horseX + this.size >= x && 
            horseY + this.size >= y &&
            !this.goal
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

    move(denote) {
        let ani;
        this.denote = denote; // 목적지
        this.denoteIdx = 0; // 목적지 경로의 인덱스값(초기화)
        this.sIdx = this.denote.idx;

        return new Promise(resolve => {
            ani = window.requestAnimationFrame(moveCalc.bind(this));

            function moveCalc() {
                let nowRoute = this.denote.route[this.denoteIdx]; // 목적지의 경로중 하나를 변수에 담아줌.
                let speed = 3; // 말의 이동 속도
                
                ani = window.requestAnimationFrame(moveCalc.bind(this));
                
                // 최종 목적지의 좌표와 매칭이 되지 않으면,
                if(!(this.denote.x == this.sX) || !(this.denote.y == this.sY)) {
                    // 최종 목적지에 도착하지 않았으면(좌표 x)
                    if(!(nowRoute.x == this.sX)) {
                        if((nowRoute.x - this.sX) > 0) { // x가 플러스일때(오른쪽으로 이동하면),
                            this.sX += speed;
                            if(nowRoute.x <= this.sX) { // 계산된 값이 최종목적지를 지나칠때 최종목적지 좌표로 넣어주기
                                this.sX = nowRoute.x;
                            }
                        } else if((nowRoute.x - this.sX) < 0) { // x가 마이너스일때(왼쪽으로 이동하면),
                            this.sX -= speed;
                            if(nowRoute.x >= this.sX) { // 계산된 값이 최종목적지를 지나칠때 최종목적지 좌표로 넣어주기
                                this.sX = nowRoute.x;
                            }
                        }
                    }
        
                    // 최종 목적지에 도착하지 않았으면(좌표 y)
                    if(!(nowRoute.y == this.sY)) {
                        if((nowRoute.y - this.sY) > 0) { // y가 플러스일때(위로 이동하면),
                            this.sY += speed;
                            if(nowRoute.y <= this.sY) { // 계산된 값이 최종목적지를 지나칠때 최종목적지 좌표로 넣어주기
                                this.sY = nowRoute.y;
                            }
                        } else if((nowRoute.y - this.sY) < 0) { // y가 마이너스일때(밑으로 이동하면),
                            this.sY -= speed;
                            if(nowRoute.y >= this.sY) { // 계산된 값이 최종목적지를 지나칠때 최종목적지 좌표로 넣어주기
                                this.sY = nowRoute.y;
                            }
                        }
                    }
        
                    if((nowRoute.x == this.sX) && (nowRoute.y == this.sY)) { // 현재 목적지의 경로에 도착하면,
                        this.denoteIdx++; // 다음 목적지의 경로를 불러옴
                    }
        
                } else {
                    // 최종 목적지에 도착하면,
                    this.select = false;
                    this.denote = undefined;
                    window.cancelAnimationFrame(ani);
                    resolve();
                }
            }

        })
    }

    
}