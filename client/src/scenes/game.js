import Card from '../helpers/card';
import Zone from '../helpers/zone';
import Dealer from '../helpers/dealer';
import Loader from '../helpers/loader';
import io from 'socket.io-client';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        new Loader(this);
    }

    create() {
        this.isPlayerA = false;
        this.opponentCards = [];

        this.cameras.main.backgroundColor.setTo(9, 96, 53);
        // this.add.image(0, 0, 'background').setScale(1.5, 1.5)
        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        if (window.location.href === 'http://localhost:8080/') {
            console.log(window.location.href)
            this.socket = io.connect('http://localhost:3000');
        } else {
            this.socket = io('https://sueca-card-game.herokuapp.com/');
        }

        this.socket.on('connect', () => {
            console.log('Connected');
        });

        this.socket.on('isPlayerA', () => {
            this.isPlayerA = true;
        });

        this.socket.on('enableStart', () => {
            console.log('Start Enable')
            this.dealText.setInteractive();
        });

        this.socket.on('dealCards', () => {
            this.dealer.dealCards();
            this.dealText.disableInteractive();
        });

        this.socket.on('cardPlayed', (gameObject, isPlayerA) => {
            if (isPlayerA !== this.isPlayerA) {
                let sprite = gameObject.textureKey;
                this.opponentCards.shift().destroy();
                this.dropZone.data.values.cards++;
                let card = new Card(this);
                card.render(((this.dropZone.x - 250) + (this.dropZone.data.values.cards * 50)), (this.dropZone.y), sprite).disableInteractive();
            }
        });

        this.dealer = new Dealer(this);

        this.dealText = this.add.text(35, 350, ['START']).setFontSize(18)
            .setFontFamily('Trebuchet MS').setColor('#68ba92');

        this.dealText.on('pointerdown', () => {
            this.socket.emit('dealCards');
        });

        this.dealText.on('pointerover', () => {
            this.dealText.setColor('#99e0bd');
        })

        this.dealText.on('pointerout', () => {
            this.dealText.setColor('#68ba92');
        });

        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0xFF69B4);
            this.children.bringToTop(gameObject);
        })

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            dropZone.data.values.cards++;
            gameObject.x = (dropZone.x - 250) + (dropZone.data.values.cards * 50);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive;
            this.socket.emit('cardPlayed', gameObject, this.isPlayerA);
            console.log("card played");
        })
    }

    update() {

    }
}