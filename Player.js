import { Horse } from './Horse.js';

export class Player {
    constructor(name, color, waitingX, waitingY, waitingWidth, waitingHeight) {
        this.name = name;
        this.color = color;
        this.current = false;
        this.waitingX = waitingX;
        this.waitingY = waitingY;
        this.waitingWidth = waitingWidth;
        this.waitingHeight = waitingHeight;

        this.init();
    }

    init() {
        const waitingTextHeight = 24;
        // 플레이어 대기석 좌표
        this.waiting = {
            x: this.waitingX,
            y: this.waitingY,
            w: this.waitingWidth,
            h: this.waitingHeight,
            inh: this.waitingHeight - waitingTextHeight,
            th: waitingTextHeight,
            tX: this.waitingX + (this.waitingWidth / 2),
            tY: this.waitingY + (waitingTextHeight / 3 * 2),
            txt: this.name,
            font: '13px sans-serif',
        }

        // 플레이어 말 좌표값 설정
        const horseSize = Math.min(this.waiting.inh / 2 * 0.8, this.waitingWidth / 2 * 0.8) / 2;
        const horseWaitingX = this.waitingX + this.waitingWidth / 4;
        const horseWaitingY = this.waitingY + this.waiting.th + this.waiting.inh/4;
        
        this.horse = [];

        for(let i = 0; i < 4; i++) {
            let x = i % 2 ? 0 : this.waitingWidth / 2;
            let y = i < 2 ? 0 : this.waiting.inh / 2;
            let wX = horseWaitingX + x;
            let wY = horseWaitingY + y;

            this.horse[i] = new Horse(wX, wY, this.color, horseSize);
        }
        
    }

    draw(ctx) {
        
        // 대기석 그리기
        ctx.beginPath();

        ctx.fillStyle = '#252525';
        ctx.strokeStyle = '#252525';
        ctx.strokeRect(this.waiting.x, this.waiting.y, this.waiting.w, this.waiting.h);
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
        let state;
        if(this.name == current) state = true;
        else state = false;

        this.current = state;
        for(let i = 0; i < this.horse.length; i++) {
            this.horse[i].active = state;
        }
    }

    checkHorseSelect() {
        let select = this.horse.filter(ele => {
            return ele.select == true;
        });

        return select.length ? true : false;
    }

    horseState(horseIdx, stage) {
        if(this.checkHorseSelect()) { // 선택한 말이 있다면,
            if(this.horse[horseIdx].select) { // 현재 선택한 말이 true라면,
                this.horse[horseIdx].select = false; // select false
                //선택한 말이 출발지점에 있다면, 다시 대기석으로 돌리기
                if(this.horse[horseIdx].sIdx == 0) {
                    this.horse[horseIdx].update(undefined, undefined, undefined);
                }
            }
        } else { // 선택한 말이 없다면,
            this.horse[horseIdx].select = true; // select false라면
            //선택한 말이 대기석에 있다면, 출발지점으로 이동
            if(this.horse[horseIdx].sIdx == undefined) {
                this.horse[horseIdx].update(stage.stageDot[0].idx, stage.stageDot[0].x, stage.stageDot[0].y);
            }
        }

        this.updateHorseSelect();

    }

    updateHorseSelect() {
        // 말에 click / select 표시를 위해 상태값 update
        for(let i = 0; i < this.horse.length; i++) {
            this.horse[i].horseStatus(this.checkHorseSelect());
        }
    }


}