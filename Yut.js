export class Yut {
    constructor(canvasWidth, canvasHeight, margin) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.margin = margin || 30;
        this.fps = 0;
        this.init();
        this.isAction = false;
        // 윷 그리기
        // 윷마다 앞인지 뒤인지 판단
        // 윷던지기 버튼
        // 윷던지기 애니메이션
        // 윷던지기 결과
    }

    init() {
        this.yutList = [];
        
        const yutAreaW = this.canvasWidth * 0.7;
        const yutAreaH = this.canvasHeight * 0.6;
        const yutWidth = yutAreaW / 8;
        const yutHeight = yutAreaH;
        const yutStartX = this.canvasWidth * 0.15 + yutWidth / 2;
        const yutStartY = this.canvasHeight * 0.2;

        const lineAreaHeight = yutHeight * 0.7;
        const lineAreaStartX = yutWidth * 0.2;
        const lineAreaStartY = yutHeight * 0.15;
        const lineItemRange = (lineAreaHeight / 3);
        const lineItemWidth = yutWidth * 0.6;
        const lineItemHeight = lineItemRange * 0.5;
        const lineItemHeightStartX = (lineAreaHeight / 3) * 0.2;


        for(let i = 0; i < 4; i++) {
            this.yutList.push({
                x: yutStartX + (yutWidth * 2) * i,
                y: yutStartY,
                width: yutWidth,
                height: yutHeight,
            })
        }

        this.lineItem = {
            x: lineAreaStartX,
            y: yutStartY + lineAreaStartY + lineItemHeightStartX,
            width: lineItemWidth,
            height: lineItemHeight,
            range: lineItemRange
        }

        
        // 윷던지기 버튼 좌표
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

        const utilStartX = startPointX + this.stageSize + Math.max(innerWidth, innerHeight) * 0.1;
        const utilAreaWidth = Math.max(innerWidth, innerHeight) * 0.25;

        // 버튼 좌표
        const playBtnHeight = this.stageSize * 0.12;
        this.playBtn = {
            isActive: false,
            x: utilStartX,
            y: this.stageSize + startPointY - playBtnHeight,
            w: utilAreaWidth,
            h: playBtnHeight,
            tX: utilStartX + (utilAreaWidth / 2),
            tY: this.stageSize + startPointY - playBtnHeight / 3,
            font: '16px sans-serif',
            txt: '윷던지기'
        }

    }

    random() {
        const ratio = [20, 25, 35, 12, 8]; // 도개걸윷모 확률
        let ratioRange = [];
        let randNum = Math.floor((Math.random() * 100) + 1);

        // 확률 범위 저장
        ratio.reduce((acc, cur) => {
            ratioRange.push(acc + cur);
            return acc + cur;
        }, 0)

        // 확률 범위에 해당되는 첫번째 값 출력
        return ratioRange.findIndex((ele) => {
            return ele >= randNum;
        })
    }

    suffle() {
        this.yutVal = this.random();
        let front, back;
        let suffleArr = [];
        switch(this.yutVal) {
            case 0: // 도
                front = 1;
                back = 3;
                break;
            case 1: // 개
                front = 2;
                back = 2;
                break;
            case 2: // 걸
                front = 3;
                back = 1;
                break;
            case 3: // 윷
                front = 0;
                back = 4;
                break;
            case 4: // 모
                front = 4;
                back = 0;
                break;
        }
        
        for(let i = 0; i < front; i++) {
            suffleArr.push(1);
        }
        for(let v = 0; v < back; v++) {
            suffleArr.push(0);
        }

        //배열값 무작위
        for(let idx = suffleArr.length - 1; idx > 0; idx--) {
            const randomPosition = Math.floor(Math.random() * (idx + 1));
            const temporary = suffleArr[idx];
            suffleArr[idx] = suffleArr[randomPosition];
            suffleArr[randomPosition] = temporary;
        }

        // 각 윷가락 0/1 부여
        for(let i = 0; i < suffleArr.length; i++) {
            this.yutList[i].randNum = suffleArr[i]; // 1이 front 0이 back
            this.yutList[i].bgColor = suffleArr[i] ? '#fcc97a' : '#fef9d4';
        }

    }

    play() {

        // 이렇게 하면 브레이크를 걸어 줄 수 있음.
        // if(!this.test) {
        //     this.test = true;
        //     console.log('윷던지기를 실행할수없다');
        //     setTimeout(() => {
        //         this.test = false;
        //         console.log('윷던지기를 실행할 수 있다.')
        //     }, 2000)
        // }

        this.isAction = true;
        this.fps = 0;

    }

    draw(ctx) {
        
        // 윷던지기 버튼 그리기
        ctx.beginPath();
        ctx.fillStyle = '#252525';
        ctx.fillRect(this.playBtn.x, this.playBtn.y, this.playBtn.w, this.playBtn.h);
        
        ctx.fillStyle = '#fff';
        ctx.font = this.playBtn.font;
        ctx.textAlign = 'center';
        ctx.fillText(this.playBtn.txt, this.playBtn.tX, this.playBtn.tY);
        ctx.closePath();

        if(this.isAction) {
            
            if(this.fps % 5 == 0 && this.fps < 100) {
                this.suffle();
            }

            ctx.beginPath();
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.closePath();
    
            for(let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.fillStyle = this.yutList[i].bgColor;
                ctx.fillRect(this.yutList[i].x, this.yutList[i].y, this.yutList[i].width, this.yutList[i].height);
    
                if(this.yutList[i].randNum) {
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'brown';
                    for(let v = 0; v < 3; v++) {
                        ctx.moveTo(
                            this.yutList[i].x + this.lineItem.x,
                            this.lineItem.y + this.lineItem.range * v
                        );
                        ctx.lineTo(
                            this.yutList[i].x + this.lineItem.x + this.lineItem.width,
                            this.lineItem.y + this.lineItem.height + this.lineItem.range * v
                        );
                        ctx.stroke();
            
                        ctx.moveTo(
                            this.yutList[i].x + this.lineItem.x + this.lineItem.width,
                            this.lineItem.y + this.lineItem.range * v
                        );
                        ctx.lineTo(
                            this.yutList[i].x + this.lineItem.x,
                            this.lineItem.y + this.lineItem.height + this.lineItem.range * v
                        );
                        ctx.stroke();
            
                    }
                }
    
                ctx.closePath();
            }

            if(this.fps >= 120) {
                this.isAction = false;
            }

            this.fps++;

        }


    }

    areaIn(x, y) {
        if(this.playBtn.x <= x && 
            this.playBtn.y <= y && 
            this.playBtn.x + this.playBtn.w >= x && 
            this.playBtn.y + this.playBtn.h >= y
        ) {
            return true;
        } else {
            return false;
        }
    }

    


}