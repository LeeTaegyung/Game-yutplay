export class Stage {
    constructor(stageSize, startX, startY) {
        this.stageSize = stageSize;
        this.startX = startX;
        this.startY = startY;

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
        this.stageDotOut = []; // 찾기용 값 바깥라인 저장
        this.stageDotInToRight = []; // 찾기용 오른쪽 상단부터 대각선 좌표값 저장
        this.stageDotInToLeft = []; // 찾기용 왼쪽 상단부터 대각선 좌표값 저장

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
                    x: this.startX + x,
                    y: this.startY + y,
                    size: size
                })

                this.stageDotOut.push({
                    x: this.startX + x,
                    y: this.startY + y,
                    size: size
                })

            }
        }

        // 안쪽 라인 좌표 저장
        for(let i = 0; i < 2; i++) {
            for(let v = 0; v < 7; v++) {
                let size = v % 3 ? circleSizeSmall : circleSizeBig;

                y = 0 + innerPer * v;

                if(i == 0) {
                    // 오른쪽 위부터 시작
                    x = this.stageSize - innerPer * v;
                    this.stageDotInToRight.push({
                        x: this.startX + x,
                        y: this.startY + y,
                        size: size
                    })
                } else if(i == 1) {
                    // 왼쪽 위부터 시작
                    x = 0 + innerPer * v;
                    this.stageDotInToLeft.push({
                        x: this.startX + x,
                        y: this.startY + y,
                        size: size
                    })
                }

                this.stageDot.push({
                    x: this.startX + x,
                    y: this.startY + y,
                    size: size
                })
            }
        }

        // 마지막 골인 좌표 저장
        this.stageDot.push({
            x: this.startX + this.stageSize,
            y: this.startY + this.stageSize,
            size: circleSizeBig
        })
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
        // stageDotInToRight
        // stageDotInToLeft

        // 지름길의 좌표에서 시작하는지 확인을 해야함
        // 비교를 해서 만약에 true라면, findIndex 되는 배열이 true가 된것으로 바뀌어야함.
        //
        
        let horseNow = this.stageDotOut.findIndex(ele => {
            return ele.x == horse.sX && ele.y == horse.sY;
        })

        // 선택된 horse를 기준으로 윷의 값을 map으로 this.denote에 결과값 받아서
        // this.denote를 기준으로 스테이지에 그려주고 / 옮기는 작업까지 해야함.
        this.denote = yutResult.map(ele => {
            return this.stageDotOut[horseNow + ele]
        })
        
    }

}