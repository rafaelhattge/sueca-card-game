import io from 'socket.io-client';

export default class Splash extends Phaser.Scene {
    constructor() {
        super({
            key: 'Splash'
        });
    }

    preload() {
    }

    create() {
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('Connected');
        });
        this.input.on('pointerdown', () => this.scene.start('Game'));
    }

    update() {

    }
}