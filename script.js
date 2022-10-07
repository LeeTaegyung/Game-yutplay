import { Stage } from "./Stage.js";
import { Yut } from "./Yut.js";

class YutPlay {
    constructor(target, opt) {
        this.target = document.querySelector(target);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.target.append(this.canvas);

        this.canvas.width = opt.canvasWidth || 500;
        this.canvas.height = opt.canvasHeight || 400;

        this.stage = new Stage(this.canvas.width, this.canvas.height);
        this.yut = new Yut(this.canvas.width, this.canvas.height);

        
        // this.horse = [];

        // for(let i = 0; i < 8; i++) {
        //     let player = i < 4 ? 'player1' : 'player2';
        //     let color = i < 4 ? 'red' : 'blue';
        //     let horse = new Horse(player, this.stage.horse[i].wX, this.stage.horse[i].wY, color, this.stage.horse[i].size, this.stage.stageDot[0].x, this.stage.stageDot[0].y);
        //     this.horse.push(horse);
        // }


        this.resize();
        window.addEventListener('resize', this.resize.bind(this), false);
        this.canvas.addEventListener('mousemove', this.onUp.bind(this), false);
        this.canvas.addEventListener('click', this.onClick.bind(this), false);

        window.requestAnimationFrame(this.animate.bind(this));
        
    }

    resize() {
        this.rect = this.canvas.getBoundingClientRect();
    }

    animate() {
        this.draw();

        window.requestAnimationFrame(this.animate.bind(this));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.stage.draw(this.ctx);
        this.yut.draw(this.ctx);
    }

    onUp(e) {
        let x = e.clientX - this.rect.left,
            y = e.clientY - this.rect.top;

        this.canvas.style = 'cursor: default';

        if(this.yut.areaIn(x, y)) {
            this.canvas.style = 'cursor: pointer';
        }

        // for(let i = 0; i < this.horse.length; i++) {
        //     if((this.stage.areaIn(x, y) && !this.yutAction && this.yutNumber == 1) || 
        //         (this.horse[i].areaIn(x, y))) {
        //         this.canvas.style = 'cursor: pointer';
        //     }
        // }

    }

    onClick(e) {
        
        let x = e.clientX - this.rect.left,
            y = e.clientY - this.rect.top;

        // 윷던지기 버튼 클릭시
        if(this.yut.areaIn(x, y)) {
            //  && !this.yutAction && this.yutNumber == 1
            this.yut.play();
            return;
            this.yutAction = true; // 애니메이션 시작
            this.yutFps = 0; // 애니메이션을 위한 fps 초기화
            this.yutNumber--; // 윷 던질 횟수 차감
        }

        // 말 클릭시
        // this.horse.forEach(ele => {
            
        //     if(ele.areaIn(x, y)) { //말의 영역 안에서 클릭했는지 확인

        //         if(this.horseSelectCheck) {
        //             // 선택한 말이 있으면, 말을 놓기
        //             ele.put();
        //         } else {
        //             // 선택한 말이 없으면, 말을 선택
        //             ele.catch();
        //             this.yutResultCoor = this.stage.findCoor(this.yutResult, ele);
        //             // 윷던진 결과값이 담겨져 있는 변수를 참조해서,() 숫자에 해당되는 좌표값을 리턴받아서 변수에 넣어주고, 그릴지 말지에 대한 스위치변수를 설정해줘야함.
        //         }

        //         let horseSelectCheck = this.horse.filter(ele => { // 현재 플레이어에서 선택이 되었는지 확인.
        //             return ele.player == this.current && ele.select == true;
        //         });
        //         this.horseSelectCheck = horseSelectCheck.length;

        //         this.horse.forEach(ele => {
        //             // 플레이어의 말을 선택했는지 확인하고, 글자 표시 해줄지 말지를 결정
        //             ele.selectCheck(this.horseSelectCheck, this.current);
        //         })

                

        //     }


        // })

    }

}

window.onload = () => {
    new YutPlay('.yutplay', {

    });
}