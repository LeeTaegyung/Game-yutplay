export class Stage {
    constructor(stageSize, startX, startY) {
        this.stageSize = stageSize;
        this.startX = startX;
        this.startY = startY;
        this.selectHorseStatus = false;

        this.init();

    }

    init() {

        const circleSizeBig = Math.floor(this.stageSize * 0.05);
        const circleSizeSmall = Math.floor(this.stageSize * 0.035);

        // 라인값 저장
        this.line = {
            diagonal: [
                {
                    startX: this.startX,
                    startY: this.startY,
                    endX: this.stageSize + this.startX,
                    endY: this.stageSize + this.startY
                },
                {
                    startX: this.stageSize + this.startX,
                    startY: this.startY,
                    endX: this.startX,
                    endY: this.stageSize + this.startY
                }
            ],
            rect: {
                startX: this.startX,
                startY: this.startY,
            }
        }

        this.stageDot = []; // 그리기용 좌표값 저장

        let x, y;
        const outPer = this.stageSize / 5;
        const innerPer = this.stageSize / 6;

        // 바깥 라인 좌표 저장(오른쪽 아래부터 시작)
        for(let i = 0; i < 4; i++) {
            for(let v = 0; v < 5; v++) {
                let size = v % 5 ? circleSizeSmall : circleSizeBig;

                if(i == 0) {
                    // 오른쪽
                    x = this.stageSize;
                    y = this.stageSize - outPer * v;
                } else if (i == 1) {
                    // 위쪽
                    x = this.stageSize - outPer * v;
                    y = 0;
                } else if (i == 2) {
                    // 왼쪽
                    x = 0;
                    y = 0 + outPer * v;
                } else if (i == 3) {
                    // 아래쪽
                    x = 0 + outPer * v;
                    y = this.stageSize;
                }

                this.stageDot.push({
                    idx: this.stageDot.length,
                    x: this.startX + x,
                    y: this.startY + y,
                    size: size
                })

            }
        }
        
        // 마지막 골인 좌표 저장
        this.stageDot.push({
            idx: this.stageDot.length,
            x: this.startX + this.stageSize,
            y: this.startY + this.stageSize,
            size: circleSizeBig
        })

        // 안쪽 라인 좌표 저장
        for(let i = 0; i < 2; i++) {
            for(let v = 0; v < 7; v++) {
                let size = v % 3 ? circleSizeSmall : circleSizeBig;

                y = 0 + innerPer * v;

                if(i == 0) {
                    // 오른쪽 위부터 시작
                    x = this.stageSize - innerPer * v;
                } else if(i == 1) {
                    // 왼쪽 위부터 시작
                    x = 0 + innerPer * v;
                }

                this.stageDot.push({
                    idx: this.stageDot.length,
                    x: this.startX + x,
                    y: this.startY + y,
                    size: size
                })
            }
        }

        this.goalBtn = {
            x: this.startX + this.stageSize + (this.stageSize * 0.08),
            y: this.startY + this.stageSize,
            w: 100,
            h: 30,
            txt: 'GOAL IN!!',
            tX: (this.startX + this.stageSize + (this.stageSize * 0.08)) + 50,
            tY: this.startY + this.stageSize + 20,
            show: false,
        }

    }

    draw(ctx) {

        ctx.beginPath();

        ctx.lineWidth = 2;
        ctx.fillStyle = '#252525';
        ctx.strokeStyle = '#252525';

        // 대각선 라인 그리기
        for(let i = 0; i < 2; i++) {
            ctx.moveTo(this.line['diagonal'][i].startX, this.line['diagonal'][i].startY);
            ctx.lineTo(this.line['diagonal'][i].endX, this.line['diagonal'][i].endY);
            ctx.stroke();
        }

        // 사각형 라인 그리기
        ctx.strokeRect(this.line['rect'].startX, this.line['rect'].startY, this.stageSize, this.stageSize);
        ctx.closePath();

        // 점 그리기
        for(let i = 0; i < this.stageDot.length; i++) {
            ctx.beginPath();
            ctx.arc(this.stageDot[i].x, this.stageDot[i].y, this.stageDot[i].size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }

        
        // 골인 버튼
        
        if(this.goalBtn.show) {
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.fillRect(this.goalBtn.x, this.goalBtn.y, this.goalBtn.w, this.goalBtn.h);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(this.goalBtn.txt, this.goalBtn.tX, this.goalBtn.tY);
            ctx.closePath();
        }

    }

    getCoor(yutResult, horse) {
        let horseNow, horseIdxStart, horseIdxEnd;
        let denote = [];

        switch(horse.sIdx) {
            case 5:
                horseNow = 21;
                break;
            case 10:
                horseNow = 28;
                break;
            case 24:
                horseNow = 31;
                break;
            default:
                horseNow = horse.sIdx;
                break;
        }


        // 좌표값 중복 되는거 처리
        // if((horse.sIdx == 5) || // 오른쪽 상단 점에 위치하면,
        //     (horse.sIdx == 10) || // 왼쪽 상단 점에 위치하면,
        //     (horse.sIdx == 24)) { // 중간 점에 위치하면,
        //     horseNow = horseNow[1];
        // } else if(horse.sX == this.stageDot[0].x && horse.sY == this.stageDot[0].y) { // 시작 지점, 골인 지점 좌표라면
        //     let startEndIdx = horseNow.findIndex(ele => {
        //         return ele.idx == horse.sIdx;
        //     })
        //     horseNow = horseNow[startEndIdx];
        // } else {
        //     horseNow = horseNow[0];
        // }

        // 지나갈 경로 찾아주기 변수 지정
        horseIdxStart = horseNow + 1;
        horseIdxEnd = horseIdxStart + yutResult;

        // 지나갈 경로 좌표 담기 위한 반복문
        while (horseIdxStart < horseIdxEnd) {
            if(this.stageDot[horseIdxStart].idx == 27) { // 대각선을 타고 왼쪽 하단 점을 지나가는 루트라면,
                horseIdxStart = 15;
                horseIdxEnd = horseIdxStart + (yutResult - denote.length);
            } else if(this.stageDot[horseIdxStart].idx == 20 || this.stageDot[horseIdxStart].idx == 34) { // 골인지점을 지나가는 루트라면,
                denote.push(this.stageDot[horseIdxStart]);
                break;
            }
            denote.push(this.stageDot[horseIdxStart]);
            horseIdxStart++;
        }
        return denote;


        
        

        
    }

    areaIn(x, y) {
        if(this.goalBtn.x <= x && 
            this.goalBtn.y <= y && 
            this.goalBtn.x + this.goalBtn.w >= x && 
            this.goalBtn.y + this.goalBtn.h >= y &&
            this.goalBtn.show
        ) {
            return true;
        } else {
            return false;
        }
    }

    goal(horse) {
        this.goalBtn.show = false;
        horse.forEach(ele => {
            ele.goal = true;
            ele.sX = undefined;
            ele.sY = undefined;
        })
    }

}