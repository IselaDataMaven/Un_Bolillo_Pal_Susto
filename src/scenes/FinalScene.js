class FinalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinalScene' });
  }

  create() {
    console.log('[FINAL START]');
    var w = this.cameras.main.width;
    var h = this.cameras.main.height;

    // Music — plays continuously through all 3 scenes
    MusicManager.play(this, 'nivel_final_victoria', { volume: 0.7, loop: false, fadeIn: 1000 });

    // Start sequence
    this.showScene1(w, h);
  }

  showScene1(w, h) {
    console.log('[FINAL SCENE 1]');
    this.cameras.main.fadeIn(700, 0, 0, 0);

    var img = this.add.image(w / 2, h / 2, 'final-1');
    img.setScale(Math.max(w / img.width, h / img.height));

    var text = this.add.text(w / 2, h - 50, 'Chicles logro liberar a su abuela del control del Gusano Espacial...', {
      font: '13px monospace', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3, wordWrap: { width: 700 }
    }).setOrigin(0.5).setDepth(10);

    this.time.delayedCall(5000, () => {
      this.cameras.main.fadeOut(700, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        img.destroy();
        text.destroy();
        this.showScene2(w, h);
      });
    });
  }

  showScene2(w, h) {
    console.log('[FINAL SCENE 2]');
    this.cameras.main.fadeIn(700, 0, 0, 0);

    var img = this.add.image(w / 2, h / 2, 'final-2');
    img.setScale(Math.max(w / img.width, h / img.height));

    var text = this.add.text(w / 2, h - 50, 'Juntas escaparon del laboratorio secreto bajo el Metro...', {
      font: '13px monospace', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3, wordWrap: { width: 700 }
    }).setOrigin(0.5).setDepth(10);

    this.time.delayedCall(5000, () => {
      this.cameras.main.fadeOut(700, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        img.destroy();
        text.destroy();
        this.showScene3(w, h);
      });
    });
  }

  showScene3(w, h) {
    console.log('[FINAL SCENE 3]');
    this.cameras.main.fadeIn(700, 0, 0, 0);

    var img = this.add.image(w / 2, h / 2, 'final-3');
    img.setScale(Math.max(w / img.width, h / img.height));

    var text = this.add.text(w / 2, h - 80, 'Despues de tantas aventuras llegaron por fin a la escuela...', {
      font: '13px monospace', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3, wordWrap: { width: 700 }
    }).setOrigin(0.5).setDepth(10);

    // Dialogue sequence
    var self = this;
    this.time.delayedCall(2500, () => {
      text.setText('-- Abuela... llegamos.');
    });
    this.time.delayedCall(4000, () => {
      text.setText('-- Mija...');
    });
    this.time.delayedCall(5500, () => {
      text.setText('Hoy es sabado.');
    });
    this.time.delayedCall(7000, () => {
      text.setText('Las dos comenzaron a reir.');
    });
    this.time.delayedCall(8500, () => {
      text.setText('Chicles salvo a su abuela, al Metro y a la humanidad.');
    });
    this.time.delayedCall(10500, () => {
      text.setText('Tambien salvo a las vacas de convertirse en leche de sabores extraterrestres.');
    });
    this.time.delayedCall(13000, () => {
      self.cameras.main.fadeOut(1000, 0, 0, 0);
      self.cameras.main.once('camerafadeoutcomplete', () => {
        self.showCredits(w, h);
      });
    });
  }

  showCredits(w, h) {
    console.log('[CREDITS]');
    this.cameras.main.fadeIn(700, 0, 0, 0);

    this.add.rectangle(w / 2, h / 2, w, h, 0x0a0a1a).setDepth(0);

    this.add.text(w / 2, 60, 'UN BOLILLO PAL\' SUSTO', {
      font: '22px monospace', fill: '#ff8800', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(10);

    this.add.text(w / 2, 110, 'Hackathon AWS + Kiro', {
      font: '14px monospace', fill: '#88aaff'
    }).setOrigin(0.5).setDepth(10);

    var credits = [
      '',
      'Desarrollado por:',
      'Isela L. Garcia',
      'La Hechicera del Codigo',
      '',
      'Tecnologias:',
      'Phaser 3 | JavaScript | AWS | Amazon Bedrock | Kiro',
      '',
      'Concepto:',
      'Videojuego mexicano de aventura y folklore',
      '',
      '',
      'Gracias por jugar!'
    ];

    this.add.text(w / 2, 260, credits.join('\n'), {
      font: '11px monospace', fill: '#cccccc', align: 'center', lineSpacing: 4
    }).setOrigin(0.5).setDepth(10);

    // Play again button
    var btn = this.add.text(w / 2, h - 40, '[ JUGAR DE NUEVO ]', {
      font: '14px monospace', fill: '#ffffff',
      backgroundColor: '#333333', padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

    btn.on('pointerover', function() { btn.setStyle({ fill: '#44ff88' }); });
    btn.on('pointerout', function() { btn.setStyle({ fill: '#ffffff' }); });
    btn.on('pointerdown', function() {
      console.log('[RETURN TO MENU]');
      MusicManager.stop();
      this.scene.start('MenuScene');
    }, this);
  }
}
