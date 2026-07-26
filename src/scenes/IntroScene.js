class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    this.transitioning = false;

    // Music: intro theme
    MusicManager.play(this, 'intro', { volume: 0.6, loop: true, fadeIn: 1500 });

    // Background
    const bg = this.add.image(w / 2, h / 2, 'bg-calle');
    const scaleX = w / bg.width;
    const scaleY = h / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));
    bg.setAlpha(0.4);

    // Narrative text
    const lines = [
      'En las calles de la ciudad...',
      '',
      'Chicles debe cruzar la calle esquivando',
      'ratas, perros y al temible Tamalero.',
      '',
      'Recoge dulces y chicles para ganar puntos.',
      'Llega a la META para completar el nivel.',
      '',
      '!Buena suerte!'
    ];

    this.add.text(w / 2, 50, 'UN BOLILLO PAL\' SUSTO', {
      font: '20px monospace',
      fill: '#ff8800'
    }).setOrigin(0.5);

    this.add.text(w / 2, h / 2, lines.join('\n'), {
      font: '14px monospace',
      fill: '#ffffff',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5);

    // Skip instructions
    this.add.text(w / 2, h - 40, 'Presiona ENTER o toca para comenzar', {
      font: '12px monospace',
      fill: '#aaaaaa'
    }).setOrigin(0.5);

    // Transition to Level1
    this.input.keyboard.once('keydown-ENTER', () => {
      this.startLevel();
    });
    this.input.keyboard.once('keydown-SPACE', () => {
      this.startLevel();
    });
    this.input.once('pointerdown', () => {
      this.startLevel();
    });

    // Auto-advance after 6 seconds
    this.time.delayedCall(6000, () => {
      this.startLevel();
    });
  }

  startLevel() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Level1Scene');
    });
  }
}
