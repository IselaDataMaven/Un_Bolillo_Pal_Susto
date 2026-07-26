class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Music: victory
    MusicManager.play(this, 'victoria', { volume: 0.65, loop: false, fadeIn: 800 });

    // Background
    this.add.rectangle(w / 2, h / 2, w, h, 0x1a3a1a);

    // Logo
    const logo = this.add.image(w / 2, 70, 'logo');
    logo.setScale(0.3);

    // Victory text
    this.add.text(w / 2, 150, '!NIVEL COMPLETADO!', {
      font: '28px monospace',
      fill: '#00ff88'
    }).setOrigin(0.5);

    this.add.text(w / 2, 200, 'Puntuacion final: ' + this.finalScore, {
      font: '18px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(w / 2, 240, '!Derrotaste al Tamalero y cruzaste la calle!', {
      font: '12px monospace',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Menu button
    const btnMenu = this.add.text(w / 2, 320, '[ VOLVER AL MENU ]', {
      font: '16px monospace',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnMenu.on('pointerover', () => btnMenu.setStyle({ fill: '#00ff88' }));
    btnMenu.on('pointerout', () => btnMenu.setStyle({ fill: '#ffffff' }));
    btnMenu.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Keyboard
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('MenuScene');
    });
  }
}
