import { Player } from "./Player.js";
import { Stage } from "./Stage.js";
import { Yut } from "./Yut.js";
import { MovePoint } from "./MovePoint.js";

class YutPlay {
    constructor(target, opt) {
        this.target = document.querySelector(target);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.target.append(this.canvas);

        this.canvas.width = opt.canvasWidth || 500;
        this.canvas.height = opt.canvasHeight || 400;
        this.margin = opt.margin || 30;

        this.current = 'player1';
        this.yutResult = [];
        this.throwYut = 1;

        this.movePoint = [];
        this.moveShow = false;

        this.resize();
        window.addEventListener('resize', this.resize.bind(this), false);
        this.canvas.addEventListener('mousemove', this.onUp.bind(this), false);
        this.canvas.addEventListener('click', this.onClick.bind(this), false);
        
        this.stage = new Stage(this.stageSize, this.stageX, this.stageY);
        this.yut = new Yut(this.canvas.width, this.canvas.height, this.utilX, this.utilY, this.utilWidth, this.utilHeight);

        this.players = [];

        for(let i = 0; i < 2; i++) {
            let name, color, waitingX, waitingY;
            if(i == 0) {
                name = 'player1';
                color = 'red';
                waitingX = this.playerX1;
                waitingY = this.playerY1;
            } else {
                name = 'player2';
                color = 'blue';
                waitingX = this.playerX2;
                waitingY = this.playerY2;
            }

            this.players[i] = new Player(name, color, waitingX, waitingY, this.waitingWidth, this.waitingHeight);
        }

        window.requestAnimationFrame(this.animate.bind(this));


    }

    resize() {
        this.rect = this.canvas.getBoundingClientRect();

        this.innerWidth = this.canvas.width - this.margin * 2;
        this.innerHeight = this.canvas.height - this.margin * 2;
        this.stageSize = Math.max(this.innerWidth, this.innerHeight) * 0.6;

        this.mode = this.canvas.width >= this.canvas.height ? this.horizontal() : 'vertical';

    }

    horizontal() {
        // 가로모드
        this.stageSize = this.stageSize > this.innerHeight * 0.75 ? this.innerHeight * 0.75 : this.stageSize;

        const UtilMargin = 30; // 윷던지기 관련 영역 여백
        const UtilHeight = 50; // 윷던지기 관련 영역 높이
        const WaitingMargin = this.innerWidth * 0.05; // 대기석 여백
        const WaitingWidth = this.innerWidth * 0.15; // 대기석 가로사이즈
        const WaitingHeight = this.innerHeight * 0.25; // 대기석 세로사이즈
        const StartY = (this.canvas.height - (this.stageSize + UtilMargin + UtilHeight)) / 2;
        const StartX = (this.canvas.width - (this.stageSize + WaitingMargin * 2 + WaitingWidth * 2)) / 2;

        // 스테이지 시작 좌표
        this.stageY = StartY;
        this.stageX = StartX + WaitingMargin + WaitingWidth;

        this.waitingWidth = WaitingWidth;
        this.waitingHeight = WaitingHeight;

        // 플레이어1 대기석 시작 좌표
        this.playerY1 = StartY;
        this.playerX1 = StartX;

        // 플레이어2 대기석 시작 좌표
        this.playerY2 = StartY;
        this.playerX2 = StartX + this.stageSize + WaitingMargin * 2 + WaitingWidth;

        // 윷던지기 관련 영역 시작 좌표
        this.utilY = StartY + this.stageSize + UtilMargin;
        this.utilX = StartX + WaitingMargin + WaitingWidth;
        this.utilWidth = this.stageSize;
        this.utilHeight = UtilHeight;

    }

    vertical() {
        // 세로모드
        this.stageSize = this.stageSize > this.innerWidth ? this.innerWidth : this.stageSize;
        startPointX = (this.canvasWidth - this.stageSize) / 2;
        startPointY = (this.canvasHeight - this.stageSize) / 2 - (Math.max(innerWidth, innerHeight) * 0.35) / 2;

    }

    animate() {
        this.draw();

        window.requestAnimationFrame(this.animate.bind(this));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.stage.draw(this.ctx);

        for(let i = 0; i < this.players.length; i++) {
            this.players[i].draw(this.ctx);
        }

        this.yut.draw(this.ctx);

        if(this.moveShow && this.movePoint.length > 0) {
            for(let i = 0; i < this.movePoint.length; i++) {
                this.movePoint[i].draw(this.ctx);
            }
        }

    }

    checkCurrent() {
        for(let i = 0; i < this.players.length; i++) {
            this.players[i].checkCurrent(this.current);
        }
    }

    onUp(e) {
        let x = e.clientX - this.rect.left,
            y = e.clientY - this.rect.top;

        this.canvas.style = 'cursor: default';

        // 윷던지기 버튼 hover
        if(this.yut.areaIn(x, y) && this.throwYut == 1) {
            this.canvas.style = 'cursor: pointer';
        }

        // 말 hover
        for(let i = 0; i < this.players.length; i++) {
            if(this.players[i].current) {
                for(let v = 0; v < this.players[i].horse.length; v++) {
                    if(this.players[i].horse[v].areaIn(x, y) && !this.throwYut) {
                        this.canvas.style = 'cursor: pointer';
                    }
                }
            }
        }

        // 무브 좌표값 표시
        // if(this.stage.denote) {
        //     for(let i = 0; i < this.stage.denote.length; i++) {
        //         if(this.stage.areaIn(x, y, this.stage.denote[i])) {
        //             this.canvas.style = 'cursor: pointer';
        //         }
        //     }
        // }

    }

    onClick(e) {
        
        let x = e.clientX - this.rect.left,
            y = e.clientY - this.rect.top;
        const movePointSize = Math.floor(this.stageSize * 0.05);

        // 윷던지기 버튼 클릭시
        if(this.yut.areaIn(x, y) && this.throwYut == 1) {
            this.yut.play();

            this.throwYut--; // 기회 차감

            setTimeout(() => { // 애니메이션이 끝나고 값을 받아와야해서 setTimeout 사용
                if(this.yut.yutVal == 4 || this.yut.yutVal == 5) { // 윷이나 모가 나오면,
                    this.throwYut++; // 기회 추가
                }

                if(!this.throwYut) this.checkCurrent();
                this.yutResult.push(this.yut.yutVal);

            }, 2000);

            return;
        }

        // 말 클릭시
        for(let i = 0; i < this.players.length; i++) {
            if(this.players[i].current) { // 현재 순서인 player
                for(let v = 0; v < this.players[i].horse.length; v++) {
                    if(this.players[i].horse[v].areaIn(x, y) && !this.throwYut) { // 말을 클릭했는지 판단 && 윷던지 기회를 다 소진했는지

                        this.players[i].horseState(v, this.stage);

                        this.moveShow = this.players[i].checkHorseSelect(); // 옮실수 있는 좌표의 표시 결정

                        // 선택한 말이 있고, 클릭한 그 말이 선택한 말일때, 옮길수 있는 위치 표시
                        if(this.players[i].checkHorseSelect() && this.players[i].horse[v].select) {
                            for(let d = 0; d < this.yutResult.length; d++) {
                                this.movePoint[d] = new MovePoint(movePointSize, this.stage.getCoor(this.yutResult[d], this.players[i].horse[v]));
                            }

                        }
                        
                    }

                }
            }
        }
        


        
    }

}

window.onload = () => {
    new YutPlay('.yutplay', {

    });
}