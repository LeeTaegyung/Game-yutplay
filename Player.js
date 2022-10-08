import { Horse } from './Horse.js';

export class Player {
    constructor(name, color, size) {
        this.name = name;
        this.color = color;
        this.size = size;
        this.current = false;

        this.init();
    }

    init() {
        
        // this.horse = [];

        // for(let i = 0; i < 8; i++) {
        //     let player = i < 4 ? 'player1' : 'player2';
        //     let color = i < 4 ? 'red' : 'blue';
        //     let horse = new Horse(player, this.stage.horse[i].wX, this.stage.horse[i].wY, color, this.stage.horse[i].size, this.stage.stageDot[0].x, this.stage.stageDot[0].y);
        //     this.horse.push(horse);
        // }
    }

    draw() {
        
    }
}