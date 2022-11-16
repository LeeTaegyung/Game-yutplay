import { Horse } from './Horse.js';

export class Player {
    constructor(name, color, waitingX, waitingY, waitingWidth, horseCount) {
        this.name = name;
        this.color = color;
        this.current = false;
        this.waitingX = waitingX;
        this.waitingY = waitingY;
        this.waitingWidth = waitingWidth;
        this.horseCount = horseCount;
        this.sameHorseFilterArr = [];

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
            inh: waitingTextHeight + horseArea * Math.round(this.horseCount / 2) + horseMargin * 2,
            th: waitingTextHeight,
            tX: this.waitingX + (this.waitingWidth / 2),
            tY: this.waitingY + (waitingTextHeight / 2),
            txt: this.name,
            font: '13px "Gowun Dodum"',
        }
        
        this.horse = [];

        for(let i = 0; i < this.horseCount; i++) {
            let x = i % 2;
            let y = Math.floor(i / 2);
            let wX = horseWaitingX + (horseArea * x);
            let wY = horseWaitingY + (horseArea * y);

            this.horse[i] = new Horse(wX, wY, this.color, horseSize/2, i);
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

        if(this.sameHorseFilterArr.length >= 1) {
            this.sameHorseFilterArr.forEach(ele => {
                const size = ele[0].size;
                const rectX = ele[0].sX + size/2 - 2;
                const rectY = ele[0].sY + size/2 - 2;
                const x = ele[0].sX + size;
                const y = ele[0].sY + size;

                ctx.beginPath();
                ctx.fillStyle = '#000';
                ctx.fillRect(rectX, rectY, 14, 14);
                ctx.fillStyle = '#fff';
                ctx.font = '14px "Gowun Dodum"';
                ctx.fillText(ele.length, x, y);
                ctx.closePath();
            })
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

    checkDupHorse() { // 업은 말 개수 표시를 위한 함수
        const horse = this.horse;

        let sameHorse = horse.filter(() => true);
        let sameHorseFilter = [];
        this.sameHorseFilterArr = [];

        horse.forEach(ele => {
            sameHorseFilter = [];
            if(!(ele.sIdx === undefined)) { // 스테이지 위에 있을때
                sameHorseFilter = sameHorse.filter((sameEle) => { // 같은 좌표를 가졌을때, sameHorseFilter에 값을 담음
                    if(ele.sIdx === sameEle.sIdx) {
                        return sameEle;
                    }
                })
            }

            if(sameHorseFilter.length > 1) { // 같은 좌표에 말2개 이상 담겼을때,
                for(let i = 0; i < sameHorseFilter.length; i++) {
                    sameHorse = sameHorse.filter(eleIdx => { // 중복으로 담기는걸 피하기 위해서 비교되는 배열의 해당 말 삭제. 말의 배열이 담긴 순서대로 하고 splice를 하려니깐 생각한대로 삭제 되지 않아서 말에 idx 부여
                        return sameHorseFilter[i].idx != eleIdx.idx;
                    })
                }
                this.sameHorseFilterArr.push(sameHorseFilter);
            }

        })

    }

}