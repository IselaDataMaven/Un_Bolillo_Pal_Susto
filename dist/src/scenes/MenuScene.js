class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Background - portada
    const portada = this.add.image(w / 2, h / 2, 'portada');
    const scaleX = w / portada.width;
    const scaleY = h / portada.height;
    portada.setScale(Math.max(scaleX, scaleY));
    portada.setAlpha(0.7);

    // Logo
    const logo = this.add.image(w / 2, 80, 'logo');
    logo.setScale(0.5);

    // Play button - large and prominent
    const btnPlay = this.add.image(w / 2, 200, 'btn-play')
      .setScale(0.6)
      .setInteractive({ useHandCursor: true });
    btnPlay.on('pointerover', () => btnPlay.setScale(0.65));
    btnPlay.on('pointerout', () => btnPlay.setScale(0.6));
    btnPlay.on('pointerdown', () => {
      this.scene.start('IntroScene');
    });

    // Controls button
    const btnControls = this.add.image(w / 2, 300, 'btn-como-jugar')
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });
    btnControls.on('pointerover', () => btnControls.setScale(0.55));
    btnControls.on('pointerout', () => btnControls.setScale(0.5));
    btnControls.on('pointerdown', () => {
      this.showControls();
    });

    // Credits button
    const btnCredits = this.add.image(w / 2, 385, 'btn-creditos')
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });
    btnCredits.on('pointerover', () => btnCredits.setScale(0.55));
    btnCredits.on('pointerout', () => btnCredits.setScale(0.5));
    btnCredits.on('pointerdown', () => {
      this.scene.start('CreditsScene');
    });

    // Keyboard shortcut
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('IntroScene');
    });
  }

  showControls() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.85)
      .setInteractive();

    const title = this.add.text(w / 2, 60, 'CONTROLES', {
      font: '22px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    const controls = [
      '\u2190 \u2192  Mover izquierda / derecha',
      '\u2191     Saltar',
      'A / X  Atacar',
      'R     Reiniciar (Game Over)',
      '',
      'Toca enemigos desde arriba para aplastarlos',
      'Derrota al Tamalero al final del nivel'
    ];

    const text = this.add.text(w / 2, 200, controls.join('\n'), {
      font: '14px monospace',
      fill: '#cccccc',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    const closeText = this.add.text(w / 2, h - 40, 'Click para cerrar', {
      font: '12px monospace',
      fill: '#888888'
    }).setOrigin(0.5);

    overlay.on('pointerdown', () => {
      overlay.destroy();
      title.destroy();
      text.destroy();
      closeText.destroy();
    });
  }
}
