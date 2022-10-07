export class Stage {
    constructor(canvasWidth, canvasHeight, margin) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.margin = margin || 30;

        this.init();
    }

    init() {
        const canvasWidth = this.canvasWidth;
        const canvasHeight = this.canvasHeight;
        const innerWidth = canvasWidth - this.margin * 2;
        const innerHeight = canvasHeight - this.margin * 2;
        let startPointX, startPointY;

        this.mode = canvasWidth > canvasHeight ? 'horizontal' : 'vertical'; // 나중에 가로모드, 세로모드 ui 다르게 구성할 예정
        this.stageSize = Math.max(innerWidth, innerHeight) * 0.65;

        if(canvasWidth > canvasHeight || canvasWidth === canvasHeight ) {
            // 가로모드 || 정사각형모드 == 스테이지 세로중앙정렬
            this.stageSize = this.stageSize > innerHeight ? innerHeight : this.stageSize;
            startPointX = (this.canvasWidth - this.stageSize) / 2 - (Math.max(innerWidth, innerHeight) * 0.35) / 2;
            startPointY = (this.canvasHeight - this.stageSize) / 2;
        } else if (canvasWidth < canvasHeight) {
            // 세로모드 == 스테이지 가로중앙정렬
            this.stageSize = this.stageSize > innerWidth ? innerWidth : this.stageSize;
            startPointX = (this.canvasWidth - this.stageSize) / 2;
            startPointY = (this.canvasHeight - this.stageSize) / 2 - (Math.max(innerWidth, innerHeight) * 0.35) / 2;
        }

        const circleSizeBig = Math.floor(this.stageSize * 0.05);
        const circleSizeSmall = Math.floor(this.stageSize * 0.035);


        // 라인값 저장
        this.line = {
            diagonal: [
                {
                    startX: startPointX,
                    startY: startPointY,
                    endX: this.stageSize + startPointX,
                    endY: this.stageSize + startPointY
                },
                {
                    startX: this.stageSize + startPointX,
                    startY: startPointY,
                    endX: startPointX,
                    endY: this.stageSize + startPointY
                }
            ],
            rect: {
                startX: startPointX,
                startY: startPointY,
            }
        }
        

        // const utilStartX = this.stageSize + this.margin * 2;
        // const utilAreaWidth = canvasWidth - this.stageSize - this.margin * 2 - 20;

        // 버튼 좌표
        // const playBtnHeight = this.stageSize * 0.12;
        // this.playBtn = {
        //     isActive: false,
        //     x: utilStartX,
        //     y: this.stageSize + this.margin - playBtnHeight,
        //     w: utilAreaWidth,
        //     h: playBtnHeight,
        //     tX: utilStartX + (utilAreaWidth / 2),
        //     tY: this.stageSize + this.margin - playBtnHeight / 3,
        //     font: '16px sans-serif',
        //     txt: '윷던지기'
        // }

        // 플레이어 대기석 좌표
        // this.waiting = {
        //     x: utilStartX,
        //     w: utilAreaWidth,
        //     h: this.stageSize * 0.3,
        //     inh: this.stageSize * 0.3 * 0.8,
        //     th: this.stageSize * 0.3 * 0.2,
        //     tX: utilStartX + utilAreaWidth / 2,
        //     font: '13px sans-serif',
        //     player1: {
        //         y: this.margin,
        //         tY: this.margin + (this.stageSize * 0.3 * 0.2) / 1.5,
        //         txt: '1P',
        //     },
        //     player2: {
        //         y: this.margin + this.stageSize * 0.3 + 10,
        //         tY: this.margin + this.stageSize * 0.3 + 10 + (this.stageSize * 0.3 * 0.2) / 1.5,
        //         txt: '2P',
        //     }
        // }

        // // 플레이어 말 좌표값 설정
        // const horseSize = Math.min(this.waiting.inh / 2 * 0.8, utilAreaWidth / 2 * 0.8)/2;
        // const horseWaitingX = utilStartX + utilAreaWidth/4;
        // const horseWaitingY = this.margin + this.waiting.th + this.waiting.inh/4;

        // this.horse = [];
        // for(let v = 0; v < 2; v++) {
        //     for(let i = 0; i < 4; i ++) {
        //         let x = i < 2 ? 0 : utilAreaWidth/2;
        //         let y = i % 2 ? 0 : this.waiting.inh/2;
        //         let wX = horseWaitingX + x;
        //         let wY = horseWaitingY + y  + (this.waiting.h + 10) * v;

        //         this.horse.push({
        //             wX: wX,
        //             wY: wY,
        //             size: horseSize
        //         })
        //     }
        // }

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
                    x: startPointX + x,
                    y: startPointY + y,
                    size: size
                })

                this.stageDotOut.push({
                    x: startPointX + x,
                    y: startPointY + y,
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
                        x: startPointX + x,
                        y: startPointY + y,
                        size: size
                    })
                } else if(i == 1) {
                    // 왼쪽 위부터 시작
                    x = 0 + innerPer * v;
                    this.stageDotInToLeft.push({
                        x: startPointX + x,
                        y: startPointY + y,
                        size: size
                    })
                }

                this.stageDot.push({
                    x: startPointX + x,
                    y: startPointY + y,
                    size: size
                })
            }
        }

        // 마지막 골인 좌표 저장
        this.stageDot.push({
            x: startPointX + this.stageSize,
            y: startPointY + this.stageSize,
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

        // 윷던지기 버튼 그리기
        // ctx.beginPath();
        // ctx.fillStyle = '#252525';
        // ctx.fillRect(this.playBtn.x, this.playBtn.y, this.playBtn.w, this.playBtn.h);
        
        // ctx.fillStyle = '#fff';
        // ctx.font = this.playBtn.font;
        // ctx.textAlign = 'center';
        // ctx.fillText(this.playBtn.txt, this.playBtn.tX, this.playBtn.tY);
        // ctx.closePath();

        // 대기석 그리기
        // for(let i = 1; i < 3; i++) {
        //     ctx.beginPath();

        //     ctx.fillStyle = '#252525';
        //     ctx.strokeRect(this.waiting.x, this.waiting['player' + i].y, this.waiting.w, this.waiting.h);
        //     ctx.fillRect(this.waiting.x, this.waiting['player' + i].y, this.waiting.w, this.waiting.th);

        //     ctx.fillStyle = '#fff';
        //     ctx.font = this.waiting.font;
        //     ctx.textAlign = 'center';
        //     ctx.fillText(this.waiting['player' + i].txt, this.waiting.tX, this.waiting['player' + i].tY);

        //     ctx.closePath();
        // }
        
    }

}