const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: 'game-container',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  input: {
    activePointers: 3
  },
  scene: [
    PreloadScene,
    MenuScene,
    IntroScene,
    Level1Scene,
    ZumbaScene,
    VictoryScene,
    GameOverScene,
    CreditsScene
  ]
};

const game = new Phaser.Game(config);
