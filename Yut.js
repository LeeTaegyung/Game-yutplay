export class Yut {
    constructor(canvasWidth, canvasHeight, utilX, utilY, utilWidth, utilHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fps = 0;
        this.isAction = false;
        this.utilX = utilX;
        this.utilY = utilY;
        this.utilWidth = utilWidth;
        this.utilHeight = utilHeight;
        // 윷 그리기
        // 윷마다 앞인지 뒤인지 판단
        // 윷던지기 버튼
        // 윷던지기 애니메이션
        // 윷던지기 결과
        this.init();
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

        
        // 버튼 좌표
        this.playBtn = {
            isActive: false,
            x: this.utilX,
            y: this.utilY,
            w: this.utilWidth,
            h: this.utilHeight,
            tX: this.utilX + (this.utilWidth / 2),
            tY: this.utilY + this.utilHeight / 2 + 6,
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

    suffle(val) {
        this.yutVal = val;
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
        let ani;

        this.isAction = true;
        this.fps = 0;

        ani = window.requestAnimationFrame(animate.bind(this));

        function animate() {
            if(this.fps % 5 == 0 && this.fps < 100) {
                this.suffle(this.random());
            }
    
            this.fps++;
    
            ani = window.requestAnimationFrame(animate.bind(this));
            
            if(this.fps >= 120) {
                this.isAction = false;
                window.cancelAnimationFrame(ani);
            }

        }


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


        }


    }

    areaIn(x, y) {
        if(this.playBtn.x <= x && 
            this.playBtn.y <= y && 
            this.playBtn.x + this.playBtn.w >= x && 
            this.playBtn.y + this.playBtn.h >= y &&
            !this.isAction
        ) {
            return true;
        } else {
            return false;
        }
    }

    


}