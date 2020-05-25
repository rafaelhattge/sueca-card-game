import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let deck = [
                'AC', 'AS', 'AH', 'AD', '2C', '2S', '2H', '2D', '3C', '3S', '3H', '3D',
                '4C', '4S', '4H', '4D', '5C', '5S', '5H', '5D', '6C', '6S', '6H', '6D',
                '7C', '7S', '7H', '7D', 'JC', 'JS', 'JH', 'JD', 'QC', 'QS', 'QH', 'QD', 'KC', 'KS', 'KH', 'KD',
            ]
            Phaser.Utils.Array.Shuffle(deck);
            console.log(deck);
            let playerSprite = [];
            let opponentSprite;
            if (scene.isPlayerA) {
                for (let i = 0; i < 10; i++) {
                    playerSprite[i] = deck[i];
                }
                opponentSprite = 'back';
            } else {
                for (let i = 0; i < 10; i++) {
                    playerSprite[i] = deck[i + 10];
                }
                opponentSprite = 'back';
            };
            for (let i = 0; i < 10; i++) {
                let playerCard = new Card(scene);
                playerCard.render(200 + (i * 50), 650, playerSprite[i]);

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(200 + (i * 50), 125, opponentSprite).disableInteractive());
            }
        }
    }
}