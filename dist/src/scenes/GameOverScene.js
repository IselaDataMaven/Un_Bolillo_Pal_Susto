class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Music: lose theme
    MusicManager.play(this, 'pierde', { volume: 0.6, loop: false, fadeIn: 500 });

    // Background
    this.add.rectangle(w / 2, h / 2, w, h, 0x2a0a0a);

    // Game Over text
    this.add.text(w / 2, 100, 'GAME OVER', {
      font: '36px monospace',
      fill: '#ff4444'
    }).setOrigin(0.5);

    this.add.text(w / 2, 160, 'Puntos: ' + this.finalScore, {
      font: '16px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Retry button
    const btnRetry = this.add.image(w / 2, 250, 'btn-reiniciar')
      .setScale(0.3)
      .setInteractive({ useHandCursor: true });
    btnRetry.on('pointerover', () => btnRetry.setScale(0.33));
    btnRetry.on('pointerout', () => btnRetry.setScale(0.3));
    btnRetry.on('pointerdown', () => {
      this.scene.start('Level1Scene');
    });

    // Menu button
    const btnMenu = this.add.text(w / 2, 340, '[ MENU ]', {
      font: '14px monospace',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnMenu.on('pointerover', () => btnMenu.setStyle({ fill: '#ff8800' }));
    btnMenu.on('pointerout', () => btnMenu.setStyle({ fill: '#ffffff' }));
    btnMenu.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Keyboard shortcuts
    this.input.keyboard.once('keydown-R', () => {
      this.scene.start('Level1Scene');
    });
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('MenuScene');
    });
  }
}
