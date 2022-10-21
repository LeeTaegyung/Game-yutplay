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

    }

    getCoor(yutResult, horse) {
        let horseNow, horseNextStart;
        let denote = [];

        // horseNow에 동일한 값을 전부 받아야함.
        horseNow = this.stageDot.filter(ele => {
            return ele.x == horse.sX && ele.y == horse.sY;
        })

        // 좌표값 중복 되는거 처리
        if((horse.sIdx == this.stageDot[5].idx) || // 오른쪽 상단 점에 위치하면,
            (horse.sIdx == this.stageDot[10].idx) || // 왼쪽 상단 점에 위치하면,
            (horse.sIdx == this.stageDot[24].idx)) { // 중간 점에 위치하면,
            horseNow = horseNow[1];
        } else if(horse.sIdx == this.stageDot[27].idx) { // 왼쪽 하단 점에 위치하면,
            horseNow = horseNow[0];
        } else if(horse.sX == this.stageDot[0].x && horse.sY == this.stageDot[0].y) { // 시작 지점, 골인 지점 좌표라면
            let startEndIdx = horseNow.findIndex(ele => {
                return ele.idx == horse.sIdx;
            })
            horseNow = horseNow[startEndIdx];
            // 현재 말의 좌표가 골인지점(sIdx !== 0)이라면, 골인 버튼도 생성해줘야함.
        } else {
            horseNow = horseNow[0];
        }

        horseNextStart = horseNow.idx + 1;

        for(let i = horseNextStart; i < horseNextStart + yutResult; i++) {
            denote.push(this.stageDot[i]);
        }
        return denote;
        
    }
}