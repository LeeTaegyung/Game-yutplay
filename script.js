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

        if(this.movePoint.length > 0) { // movePoint에 값이 있을때,
            for(let i = 0; i < this.movePoint.length; i++) {
                this.movePoint[i].draw(this.ctx);
            }
        }

    }

    changeCurrent() {
        if(this.current == 'player1') {
            this.current = 'player2';
        } else {
            this.current = 'player1';
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
                    if(this.players[i].horse[v].areaIn(x, y)) {
                        this.canvas.style = 'cursor: pointer';
                    }
                }
            }
        }

        // 무브포인트 hover
        if(this.movePoint.length > 0) {
            for(let i = 0; i < this.movePoint.length; i++) {
                if(this.movePoint[i].areaIn(x,y)) {
                    this.canvas.style = 'cursor: pointer';
                }
            }
        }
        
        // 골인 버튼 hover
        if(this.stage.areaIn(x,y)) {
            this.canvas.style = 'cursor: pointer';
        }

    }

    onClick(e) {
        
        let x = e.clientX - this.rect.left,
            y = e.clientY - this.rect.top;
        const movePointSize = Math.floor(this.stageSize * 0.05);

        // 윷던지기 버튼 클릭시
        if(this.yut.areaIn(x, y) && this.throwYut >= 1) {
            
            this.throwYut--; // 기회 차감
            
            this.yut.play().then((val) => { // 애니메이션이 끝나고 값이 결정되면, 결과값 추가 및 현재 플레이어 확인,

                if(val == 4 || val == 5) { // 윷이나 모가 나오면,
                    this.throwYut++; // 기회 추가
                }

                if(!this.throwYut) this.checkCurrent();
                this.yutResult.push(val);
            });

        }

        // 말 클릭시
        for(let i = 0; i < this.players.length; i++) {
            if(this.players[i].current && this.yutResult.length && this.throwYut == 0) {

                // 클릭한 x,y 좌표에 있는 말들을 배열에 담음.
                let areaInHorse = this.players[i].horse.filter(item => item.areaIn(x,y) == true);

                if(this.players[i].checkHorseSelect()) { // 선택한 말이 하나이상 있으면,
                    areaInHorse.forEach(ele => {
                        if(ele.select) { // 클릭한 말이 선택한 말이라면,
                            ele.select = false; // 현재 말 선택 해제
                            if(ele.sIdx == 0) { // 현재 말이 시작점이면,
                                ele.update(undefined, undefined, undefined); // 대기석으로
                            }
                            this.movePoint = []; // 현재말 기준 무브포인트 초기화(숨김)
                            this.stage.goalBtn.show = false; // 골인버튼 숨김(hide)
                        }
                    })

                } else { // 선택한 말이 하나도 없으면,
                    areaInHorse.forEach(ele => {
                        ele.select = true; // 클릭한 말 선택
                        if(ele.sIdx == undefined) { // 현재 말이 대기석이면,
                            ele.update(this.stage.stageDot[0].idx, this.stage.stageDot[0].x, this.stage.stageDot[0].y); // 출발지점으로
                        }

                        if(ele.sIdx == 20 || ele.sIdx == 34) { // 현재 선택한 말이 골인지점이면,
                            this.stage.goalBtn.show = true; // 골인 버튼 보여줌(show)
                        } else {
                            // 무브포인트 생성
                            for(let d = 0; d < this.yutResult.length; d++) {
                                this.movePoint[d] = new MovePoint(movePointSize, this.stage.getCoor(this.yutResult[d], ele), this.stage.stageDot[34]);
                            }
                        }
                    })
                }
                
                // 현재 순서의 플레이어의 말 상태 업데이트(click/pick 텍스트 표시를 위해서)
                this.players[i].updateHorseSelect();
            }
        }
        
        // 무브 포인트 클릭시
        if(this.movePoint.length > 0) {
            let player = this.players.find(ele => ele.current == true); // 현재 순서의 플레이어
            let horse = player.horse.filter(ele => ele.select == true); // 현재 순서 플레이어의 말
            for(let s = 0; s < this.movePoint.length; s++) {
                if(this.movePoint[s].areaIn(x,y)) { // 무브포인트 영역 안이면,
                    let movePoint = this.movePoint[s];

                    this.yutResult.splice(s, 1); // 윷의 결과 해당하는 부분 삭제
                    this.movePoint = []; // 무브포인트 초기화

                    horse.forEach((ele, idx) => {
                        ele.move(movePoint).then(() => { // 이동이 완료되면,

                            if((horse.length - 1) == idx) { // 말을 업었을때 중첩으로 일어나기때문에 가장 마지막 말 차례에서 실행,
                                
                                // 윷결과 이동수가 남으면, (도착지점을 넘어서면), 대기석으로 / goal 표시
                                if(movePoint.route[movePoint.route.length - 1].idx == undefined) {
                                    if(movePoint.idx == 34 || movePoint.idx == 20) {
                                        ele.update(undefined, undefined, undefined);
                                        ele.goal = true;
                                    }
                                } else {
                                    // 상대말을 잡았는지 안잡았는지 검사
                                    let otherPlayer = this.players.find(ele => ele.current == false); // 상대 플레이어
                                    let otherHorse = otherPlayer.horse.filter(ele => ele.sX == movePoint.x && ele.sY == movePoint.y); // 상대 플레이어의 말의 좌표값으로 비교
                                    if(otherHorse.length >= 1) { // 상대말을 잡았다면,
                                        for(let o = 0; o < otherHorse.length; o++) {
                                            otherHorse[o].update(undefined, undefined, undefined); // 상대말 대기실로 이동
                                        }
                                        this.throwYut++; // 횟수추가
                                    }
                                }
    
                                // 말의 상태값 업데이트
                                let activeState;
                                if(this.yutResult.length > 0) { // 말 결과값이 1개 이상 있다면
                                    activeState = true; // 말 활성화 true
    
                                } else { // 말 결과값이 없다면
                                    if(this.throwYut >= 1) { // 윷 던질 기회가 생겼다면, 말 활성화 true
                                        activeState = true;
                                    } else { // 윷 던질기회도 없다면, 말 활성화 false
                                        activeState = false;
                                    }
                                }

                                player.updateHorseSelect();
                                player.checkHorseActive(activeState);
                                
                                // 현재 플레이어가 모든 기회를 소진했을때,
                                if(this.yutResult.length == 0 && this.throwYut == 0) {
                                    this.changeCurrent(); // 선수교체
                                    if (this.throwYut == 0) this.throwYut++; // 횟수추가
                                }
                            }

                            this.winner();
    
                        })
                    })

                }
            }
            
        }

        // 골인 버튼 클릭시(말이 골인지점 바로 위에 있을때만 작동)
        if(this.stage.areaIn(x,y)) {
            let player = this.players.find(ele => ele.current == true);
            let horse = player.horse.filter(ele => ele.select == true);
            this.stage.goal(horse);
            
            this.yutResult.splice(this.yutResult.length - 1, 1); // 윷 결과 중 가장 첫번째값 삭제
            this.movePoint = []; // 무브포인트 초기화
            
            // 말의 상태값 업데이트
            let activeState;
            if(this.yutResult.length > 0) { // 말 결과값이 1개 이상 있다면
                activeState = true; // 말 활성화 true

            } else { // 말 결과값이 없다면
                if(this.throwYut >= 1) { // 윷 던질 기회가 생겼다면, 말 활성화 true
                    activeState = true;
                } else { // 윷 던질기회도 없다면, 말 활성화 false
                    activeState = false;
                }
            }

            player.updateHorseSelect();
            player.checkHorseActive(activeState);
            
            this.changeCurrent(); // 선수교체
            if (this.throwYut == 0) this.throwYut++; // 횟수추가

            this.winner();
        }

    }

    winner() {
        this.players.forEach(p => {
            let goalHorse = p.horse.filter(h => h.goal == true);
            if(goalHorse.length == 4) {
                
            }
        })

        let winnerPlayer = document.createElement('div');
        winnerPlayer.classList.add('winner');
        document.body.append(winnerPlayer);
    }

}

window.onload = () => {
    new YutPlay('.yutplay', {

    });
}