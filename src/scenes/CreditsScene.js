class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CreditsScene' });
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Background
    this.add.rectangle(w / 2, h / 2, w, h, 0x0a0a1a);

    // Credits image
    const creditsImg = this.add.image(w / 2, 60, 'creditos');
    creditsImg.setScale(Math.min(0.35, (w - 60) / creditsImg.width));

    // Title
    this.add.text(w / 2, 120, 'UN BOLILLO PAL\' SUSTO', {
      font: '18px monospace',
      fill: '#ff8800'
    }).setOrigin(0.5);

    // Credits content
    const credits = [
      '________________________',
      '',
      'Creadora:',
      'Isela L Garcia',
      'La Hechicera del Codigo',
      '',
      '________________________',
      '',
      'Tecnologias:',
      '',
      'Phaser 3',
      'JavaScript',
      'AWS (S3 + CloudFront)',
      'Amazon Bedrock',
      'Kiro (AI-powered IDE)',
      '',
      '________________________',
      '',
      'Concepto:',
      'Videojuego mexicano',
      'de aventura y folklore',
      '',
      '________________________',
      '',
      'Gracias: Hackathon Team',
      '',
      'Gracias por jugar!'
    ];

    this.add.text(w / 2, 300, credits.join('\n'), {
      font: '10px monospace',
      fill: '#cccccc',
      align: 'center',
      lineSpacing: 3
    }).setOrigin(0.5);

    // Back button
    const btnBack = this.add.image(w / 2, h - 25, 'btn-salir')
      .setScale(0.35)
      .setInteractive({ useHandCursor: true });
    btnBack.on('pointerover', () => btnBack.setScale(0.38));
    btnBack.on('pointerout', () => btnBack.setScale(0.35));
    btnBack.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Keyboard
    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('MenuScene');
    });
  }
}
