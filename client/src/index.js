import Phaser from "../../node_modules/phaser";
import Splash from "./scenes/splash";
import Game from "./scenes/game";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 800,
  scene: [
    // Splash,
    Game
  ]
};

const game = new Phaser.Game(config);
