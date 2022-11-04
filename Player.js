import { Horse } from './Horse.js';

export class Player {
    constructor(name, color, waitingX, waitingY, waitingWidth, waitingHeight, horseCount) {
        this.name = name;
        this.color = color;
        this.current = false;
        this.waitingX = waitingX;
        this.waitingY = waitingY;
        this.waitingWidth = waitingWidth;
        // this.waitingHeight = waitingHeight;
        this.horseCount = horseCount;

        this.init();
    }

    init() {
        // 플레이어 말 좌표값 설정
        const waitingTextHeight = 24;
        const horseMargin = 3;
        const horseArea = (this.waitingWidth - (horseMargin * 2)) / 2;
        const horseAreaCenter = horseArea / 2;
        const horseSize = horseArea - (horseMargin * 2);
        const horseWaitingX = this.waitingX + horseMargin + horseAreaCenter;
        const horseWaitingY = this.waitingY + waitingTextHeight + horseMargin + horseAreaCenter;

        // 플레이어 대기석 좌표
        this.waiting = {
            x: this.waitingX,
            y: this.waitingY,
            w: this.waitingWidth,
            // h: this.waitingHeight,
            inh: waitingTextHeight + horseArea * Math.round(this.horseCount / 2) + horseMargin * 2,
            th: waitingTextHeight,
            tX: this.waitingX + (this.waitingWidth / 2),
            tY: this.waitingY + (waitingTextHeight / 3 * 2),
            txt: this.name,
            font: '13px "Gowun Dodum"',
        }
        
        this.horse = [];

        for(let i = 0; i < this.horseCount; i++) {
            let x = i % 2;
            let y = Math.floor(i / 2);
            let wX = horseWaitingX + (horseArea * x);
            let wY = horseWaitingY + (horseArea * y);

            this.horse[i] = new Horse(wX, wY, this.color, horseSize/2);
        }

        
    }

    draw(ctx) {
        
        // 대기석 그리기
        ctx.beginPath();

        ctx.fillStyle = '#252525';
        ctx.strokeStyle = '#252525';
        ctx.strokeRect(this.waiting.x, this.waiting.y, this.waiting.w, this.waiting.inh);
        ctx.fillRect(this.waiting.x, this.waiting.y, this.waiting.w, this.waiting.th);

        ctx.fillStyle = '#fff';
        ctx.font = this.waiting.font;
        ctx.textAlign = 'center';
        ctx.fillText(this.waiting.txt, this.waiting.tX, this.waiting.tY);

        ctx.closePath();

        // 말 그리기
        for(let i = 0; i < this.horse.length; i++) {
            this.horse[i].draw(ctx);
        }
        
    }

    checkCurrent(current) {
        this.current = (this.name == current);
        this.checkHorseActive(this.current);
    }

    checkHorseActive(state) {
        for(let i = 0; i < this.horse.length; i++) {
            this.horse[i].active = state;
        }
    }

    checkHorseSelect() {
        let select = this.horse.filter(ele => {
            return ele.select == true;
        });

        return select.length > 0 ? true : false;
    }

    updateHorseSelect() {
        // 말에 click / select 표시를 위해 상태값 update
        for(let i = 0; i < this.horse.length; i++) {
            this.horse[i].horseStatus(this.checkHorseSelect());
        }
    }


}