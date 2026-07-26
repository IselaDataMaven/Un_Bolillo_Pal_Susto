class ZumbaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ZumbaScene' });
  }

  create() {
    // --- SCENE RESET ---
    this.score = 0;
    this.combo = 0;
    this.round = 0;
    this.sequenceActive = false;
    this.arrowSprites = [];
    this._emergencyTriggered = false;

    var w = this.cameras.main.width;
    var h = this.cameras.main.height;

    // --- BACKGROUND ---
    var bg = this.add.image(w / 2, h / 2, 'zumba-bg2');
    var scaleX = w / bg.width;
    var scaleY = h / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));
    bg.setDepth(-1);

    // --- CHICLES (player dancer) ---
    this.chicles = this.add.sprite(200, h - 120, 'zumba-chicles1');
    this.chicles.setScale(0.4);
    this.chicles.setDepth(10);

    // --- INSTRUCTORA CHICHI ---
    this.chichi = this.add.sprite(w / 2, h - 130, 'zumba-chichi-idle');
    this.chichi.setScale(0.45);
    this.chichi.setDepth(8);

    // --- NPCs (background dancers) ---
    this.npc1 = this.add.sprite(550, h - 110, 'zumba-npc1-1');
    this.npc1.setScale(0.35);
    this.npc1.setDepth(5);

    this.npc2 = this.add.sprite(650, h - 110, 'zumba-npc2-2');
    this.npc2.setScale(0.35);
    this.npc2.setDepth(5);

    // --- DONA CUCARACHA (enemy) ---
    this.dona = this.add.sprite(700, h - 90, 'zumba-dona');
    this.dona.setScale(0.35);
    this.dona.setDepth(9);
    this.dona.setVisible(false); // appears during gameplay

    // --- UI ---
    this.add.text(w / 2, 20, 'NIVEL 2 - ZUMBATON COMUNITARIO', {
      font: '16px monospace',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(100);

    this.scoreText = this.add.text(16, 16, 'Puntos: 0', {
      font: '14px monospace',
      fill: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 6, y: 3 }
    }).setDepth(100);

    // Combo display
    this.comboText = this.add.text(this.cameras.main.width - 16, 16, '', {
      font: '16px monospace',
      fill: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(1, 0).setDepth(100);

    // Sequence display area
    this.sequenceText = this.add.text(w / 2, 80, '', {
      font: '24px monospace',
      fill: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(100);

    // Feedback text
    this.feedbackText = this.add.text(w / 2, 130, '', {
      font: '18px monospace',
      fill: '#44ff44'
    }).setOrigin(0.5).setDepth(100);

    // Instructions
    this.add.text(w / 2, h - 30, 'Sigue las flechas: \u2190 \u2191 \u2192 \u2193', {
      font: '12px monospace',
      fill: '#cccccc',
      backgroundColor: '#00000088',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(100);

    // --- GAME STATE ---
    this.score = 0;

    // Music: zumba theme
    MusicManager.play(this, 'pelea_zumba', { volume: 0.60, loop: true, fadeIn: 1000 });
    this.combo = 0;
    this.round = 0;
    this.maxRounds = 8;
    this.sequenceActive = false;
    this.playerInput = [];
    this.currentSequence = [];
    this.chichiDanceFrame = 0;

    // --- ANIMATIONS ---
    if (!this.anims.exists('chicles-dance')) {
      this.anims.create({
        key: 'chicles-dance',
        frames: [
          { key: 'zumba-chicles1' },
          { key: 'zumba-chicles2' },
          { key: 'zumba-chicles3' },
          { key: 'zumba-chicles4' }
        ],
        frameRate: 4,
        repeat: -1
      });
      this.anims.create({
        key: 'chichi-dance',
        frames: [
          { key: 'zumba-chichi1' },
          { key: 'zumba-chichi2' },
          { key: 'zumba-chichi3' },
          { key: 'zumba-chichi4' },
          { key: 'zumba-chichi5' }
        ],
        frameRate: 5,
        repeat: -1
      });
      this.anims.create({
        key: 'npc1-dance',
        frames: [
          { key: 'zumba-npc1-1' },
          { key: 'zumba-npc1-2' },
          { key: 'zumba-npc1-3' },
          { key: 'zumba-npc1-4' }
        ],
        frameRate: 3,
        repeat: -1
      });
    }

    // Start NPC dancing in background
    this.npc1.anims.play('npc1-dance', true);
    this.chichi.anims.play('chichi-dance', true);

    // --- INPUT ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown', this.handleKeyDown, this);

    // Start first round after brief delay
    this.time.delayedCall(1500, () => {
      this.startRound();
    });
  }

  startRound() {
    this.round++;
    if (this.round > this.maxRounds) {
      this.winZumba();
      return;
    }

    // Clean previous arrows
    this.cleanArrows();

    // Generate sequence (length increases with rounds)
    var length = Math.min(3 + Math.floor(this.round / 2), 6);
    var arrows = ['left', 'up', 'right', 'down'];
    this.currentSequence = [];
    for (var i = 0; i < length; i++) {
      this.currentSequence.push(arrows[Phaser.Math.Between(0, 3)]);
    }

    this.playerInput = [];
    this.sequenceActive = true;

    // Display the sequence with large animated arrows
    this.sequenceText.setText('');
    this.arrowSprites = [];
    var startX = (this.cameras.main.width / 2) - ((this.currentSequence.length - 1) * 35);
    for (var si = 0; si < this.currentSequence.length; si++) {
      var symbol = '';
      var color = '#ffcc00';
      switch (this.currentSequence[si]) {
        case 'left': symbol = '\u2190'; color = '#44ccff'; break;
        case 'up': symbol = '\u2191'; color = '#44ff44'; break;
        case 'right': symbol = '\u2192'; color = '#ff44ff'; break;
        case 'down': symbol = '\u2193'; color = '#ffaa00'; break;
      }
      var arrow = this.add.text(startX + si * 70, 80, symbol, {
        font: '42px monospace',
        fill: color,
        stroke: '#000000',
        strokeThickness: 6
      }).setOrigin(0.5).setDepth(110).setScale(0.5);
      this.arrowSprites.push(arrow);
      // Pop-in animation with delay per arrow
      this.tweens.add({
        targets: arrow,
        scale: { from: 0.5, to: 2.0 },
        duration: 150,
        delay: si * 80,
        ease: 'Back.easeOut'
      });
    }
    // Pulse the first arrow (current target)
    this.pulseCurrentArrow(0);

    this.feedbackText.setText('Ronda ' + this.round + '/' + this.maxRounds);

    // Chichi demonstrates
    this.chichi.anims.play('chichi-dance', true);
  }

  handleKeyDown(event) {
    if (!this.sequenceActive) return;

    var dir = null;
    switch (event.keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.LEFT: dir = 'left'; break;
      case Phaser.Input.Keyboard.KeyCodes.UP: dir = 'up'; break;
      case Phaser.Input.Keyboard.KeyCodes.RIGHT: dir = 'right'; break;
      case Phaser.Input.Keyboard.KeyCodes.DOWN: dir = 'down'; break;
    }

    if (!dir) return;

    var expectedIndex = this.playerInput.length;
    var expected = this.currentSequence[expectedIndex];

    if (dir === expected) {
      // Correct!
      this.playerInput.push(dir);
      this.combo++;

      // Arrow hit effect: flash white, scale up, fade out
      var hitArrow = this.arrowSprites[expectedIndex];
      if (hitArrow && hitArrow.active) {
        hitArrow.setStyle({ fill: '#ffffff' });
        this.tweens.add({
          targets: hitArrow,
          scale: 2.4,
          alpha: 0,
          duration: 150,
          onComplete: function() { if (hitArrow.active) hitArrow.destroy(); }
        });
      }

      // Combo feedback
      this.feedbackText.setText('x' + this.combo);
      this.feedbackText.setStyle({ fill: '#44ff44' });
      this.comboText.setText(this.combo > 1 ? 'Combo x' + this.combo : '');
      // Combo scale pulse
      this.tweens.add({
        targets: this.feedbackText,
        scale: { from: 1.3, to: 1.0 },
        duration: 100
      });

      // Streak milestones
      if (this.combo === 5 || this.combo === 10 || this.combo === 20) {
        this.showStreakAnnounce(this.combo);
      }

      // Pulse next arrow
      if (this.playerInput.length < this.currentSequence.length) {
        this.pulseCurrentArrow(this.playerInput.length);
      }

      // Chicles dances
      this.chicles.anims.play('chicles-dance', true);

      // Check if sequence complete
      if (this.playerInput.length >= this.currentSequence.length) {
        this.sequenceActive = false;
        this.score += 100 + (this.combo * 10);
        this.scoreText.setText('Puntos: ' + this.score);
        this.sequenceText.setText('PERFECTO!');
        this.cameras.main.flash(100, 255, 255, 255, false);

        this.time.delayedCall(1200, () => {
          this.startRound();
        });
      }
    } else {
      // Wrong!
      this.combo = 0;
      this.sequenceActive = false;
      this.comboText.setText('');

      // Arrow miss effect: turn red, fade out
      var missArrow = this.arrowSprites[expectedIndex];
      if (missArrow && missArrow.active) {
        missArrow.setStyle({ fill: '#ff0000' });
        this.tweens.add({
          targets: missArrow,
          alpha: 0.3,
          duration: 150,
          onComplete: function() { if (missArrow.active) missArrow.destroy(); }
        });
      }

      this.feedbackText.setText('ERROR!');
      this.feedbackText.setStyle({ fill: '#ff4444' });
      this.chicles.setTint(0xff4444);
      this.cameras.main.shake(100, 0.005);

      // Show dona cucaracha briefly as punishment
      this.dona.setVisible(true);
      this.time.delayedCall(800, () => {
        this.dona.setVisible(false);
        this.chicles.clearTint();
      });

      // Clean remaining arrows
      this.cleanArrows();

      // Retry same round after delay
      this.time.delayedCall(1500, () => {
        this.round--;
        this.startRound();
      });
    }
  }

  winZumba() {
    this.sequenceActive = false;
    this.sequenceText.setText('');

    // Victory music
    MusicManager.play(this, 'victoria_zumba', { volume: 0.7, loop: false, fadeIn: 500 });

    var w = this.cameras.main.width;

    this.add.text(w / 2, 180, 'ZUMBATON COMPLETADO!', {
      font: '24px monospace',
      fill: '#44ff88',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(200);

    this.add.text(w / 2, 220, 'Puntos: ' + this.score, {
      font: '16px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5).setDepth(200);

    this.chicles.anims.play('chicles-dance', true);

    this.time.delayedCall(3000, () => {
      this.scene.start('Level3Scene', { score: this.score });
    });
  }

  pulseCurrentArrow(index) {
    var arrow = this.arrowSprites[index];
    if (!arrow || !arrow.active) return;
    this.tweens.add({
      targets: arrow,
      scale: { from: 2.0, to: 2.15 },
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  showStreakAnnounce(count) {
    var w = this.cameras.main.width;
    var msg = 'RACHA x' + count + '!';
    var color = count >= 20 ? '#ff00ff' : (count >= 10 ? '#ff4400' : '#ffcc00');
    var announce = this.add.text(w / 2, 200, msg, {
      font: '28px monospace',
      fill: color,
      stroke: '#000000',
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(300).setScale(0.5);

    this.tweens.add({
      targets: announce,
      scale: { from: 0.5, to: 1.5 },
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: announce,
          alpha: 0,
          y: 170,
          duration: 800,
          delay: 500,
          onComplete: function() { if (announce.active) announce.destroy(); }
        });
      }
    });
    this.cameras.main.shake(80, 0.004);
  }

  cleanArrows() {
    if (this.arrowSprites) {
      for (var i = 0; i < this.arrowSprites.length; i++) {
        if (this.arrowSprites[i] && this.arrowSprites[i].active) {
          this.arrowSprites[i].destroy();
        }
      }
      this.arrowSprites = [];
    }
  }

  update() {
    // Idle animation for Chicles when not dancing
    if (!this.sequenceActive && this.chicles) {
      this.chicles.anims.stop();
    }
  }
}
