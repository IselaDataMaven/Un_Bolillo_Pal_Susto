class Level3Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level3Scene' });
  }

  create() {
    // --- SCENE RESET ---
    this.gameOver = false;
    this.playerHP = 5;
    this.playerMaxHP = 5;
    this.chorroActivo = false;
    this.isHurt = false;
    this.killCount = 0;
    this.score = 0;
    this.damageCooldownUntil = 0;
    this.lastFireTime = 0;
    this.fireRate = 250;
    this.facingRight = true;
    this.hasGun = true;

    console.log('[LEVEL3 START]');

    var w = this.cameras.main.width;
    var h = this.cameras.main.height;
    var worldWidth = 800;
    var worldHeight = 8000;
    var fallSpeed = 200;

    this.worldHeight = worldHeight;
    this.fallSpeed = fallSpeed;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.gravity.y = 0; // No gravity — controlled fall

    // --- MUSIC ---
    MusicManager.play(this, 'nivel3_hoyo', { volume: 0.7, loop: true, fadeIn: 1000 });

    // --- BACKGROUND LAYERS (vertical parallax) ---
    // Far layer: deep worm interior
    this.bgFar = this.add.tileSprite(0, 0, w, h, 'hoyo-bg-far')
      .setOrigin(0, 0).setScrollFactor(0).setDepth(-3);

    // Mid layer: worm walls
    this.bgMid = this.add.tileSprite(0, 0, w, h, 'hoyo-bg-mid')
      .setOrigin(0, 0).setScrollFactor(0).setDepth(-2);

    // Organic wall edges (left and right)
    this.wallLeft = this.add.rectangle(0, worldHeight / 2, 40, worldHeight, 0x2a1a0a)
      .setOrigin(0, 0.5).setScrollFactor(1).setDepth(0).setAlpha(0.6);
    this.wallRight = this.add.rectangle(worldWidth - 40, worldHeight / 2, 40, worldHeight, 0x2a1a0a)
      .setOrigin(0, 0.5).setScrollFactor(1).setDepth(0).setAlpha(0.6);

    // Ambient green fog particles
    this.time.addEvent({
      delay: 150, loop: true,
      callback: function() {
        if (this.gameOver || !this.player) return;
        var px = Phaser.Math.Between(50, worldWidth - 50);
        var py = this.player.y + Phaser.Math.Between(-150, 250);
        var dot = this.add.circle(px, py, Phaser.Math.Between(1, 4), 0x44ff44, 0.2).setDepth(-1);
        this.tweens.add({
          targets: dot, alpha: 0, y: dot.y - 30, x: dot.x + Phaser.Math.Between(-20, 20),
          duration: 1200, onComplete: function() { dot.destroy(); }
        });
      }, callbackScope: this
    });

    // --- PLAYER ---
    this.player = this.physics.add.sprite(worldWidth / 2, 80, 'hoyo-idle');
    this.player.setScale(0.35).setDepth(10);
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.7);
    this.player.body.setAllowGravity(false);
    this.player.setVelocityY(fallSpeed);
    // Lateral bounds only (can't exit sides)
    this.player.body.setCollideWorldBounds(true);
    console.log('[PLAYER FALLING]');

    // --- GUN (always visible in this level) ---
    this.gun = this.add.image(this.player.x + 20, this.player.y, 'pistola1');
    this.gun.setScale(0.18).setDepth(11);

    // --- BULLETS ---
    this.bullets = this.physics.add.group();

    // --- ENEMIES ---
    this.cucarachas = this.physics.add.group();
    this.enemyProjectiles = this.physics.add.group();

    // Spawn from wall tunnels
    this.enemySpawnTimer = this.time.addEvent({
      delay: 1400, loop: true,
      callback: this.spawnCockroach, callbackScope: this
    });

    // --- POWER-UPS ---
    this.powerUps = this.physics.add.group();
    this.time.addEvent({
      delay: 4500, loop: true,
      callback: this.spawnPowerUp, callbackScope: this
    });

    // --- OVERLAPS ---
    this.physics.add.overlap(this.bullets, this.cucarachas, this.bulletHitEnemy, null, this);
    this.physics.add.overlap(this.player, this.cucarachas, this.enemyTouchPlayer, null, this);
    this.physics.add.overlap(this.player, this.enemyProjectiles, this.projHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.powerUps, this.collectPower, null, this);

    // --- INPUT ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.fireKeyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    // --- CAMERA ---
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

    // --- HUD ---
    this.hpBar = this.add.rectangle(80, 16, 120, 14, 0x44ff44)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.add.rectangle(80, 16, 120, 14).setOrigin(0, 0)
      .setScrollFactor(0).setDepth(99).setStrokeStyle(1, 0xffffff);
    this.add.text(16, 15, '\u2764', { font: '12px sans-serif', fill: '#ff4444' })
      .setScrollFactor(0).setDepth(100);

    this.depthText = this.add.text(w / 2, 16, 'Profundidad: 0m', {
      font: '13px monospace', fill: '#88ff88',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

    this.killText = this.add.text(16, 36, 'Kills: 0', {
      font: '11px monospace', fill: '#ffffff',
      backgroundColor: '#00000088', padding: { x: 4, y: 2 }
    }).setScrollFactor(0).setDepth(100);

    this.statusText = this.add.text(w / 2, 436, '', {
      font: '12px monospace', fill: '#44ff44',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

    this.add.text(w / 2, h - 14, '\u2190 \u2192 Esquivar | X/A Disparar', {
      font: '10px monospace', fill: '#999999'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
  }

  update() {
    if (this.gameOver) return;

    // Vertical parallax scroll
    this.bgFar.tilePositionY = this.player.y * 0.1;
    this.bgMid.tilePositionY = this.player.y * 0.3;

    // Maintain constant fall speed
    this.player.setVelocityY(this.fallSpeed);

    // Horizontal dodge movement (no jump)
    var speed = this.chorroActivo ? 90 : 170;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
      this.facingRight = false;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
      this.facingRight = true;
    } else {
      this.player.setVelocityX(0);
    }

    // Fire
    if ((this.fireKey.isDown || this.fireKeyA.isDown) && this.time.now > this.lastFireTime + this.fireRate) {
      this.fireBullet();
    }

    // Gun follows player
    var gx = this.facingRight ? 22 : -22;
    this.gun.setPosition(this.player.x + gx, this.player.y + 2);
    this.gun.setFlipX(!this.facingRight);

    // Depth counter
    var depth = Math.floor(this.player.y / 10);
    this.depthText.setText('Profundidad: ' + depth + 'm');

    // Level complete when reaching bottom
    if (this.player.y >= this.worldHeight - 200) {
      this.completeLevel();
    }

    // Cleanup far objects
    this.cleanGroup(this.bullets);
    this.cleanGroup(this.enemyProjectiles);
    this.cleanGroup(this.cucarachas);
    this.cleanGroup(this.powerUps);
  }

  cleanGroup(group) {
    var items = group.getChildren().slice();
    var py = this.player.y;
    for (var i = 0; i < items.length; i++) {
      var obj = items[i];
      if (obj.active && (obj.x < -80 || obj.x > 880 || obj.y < py - 600 || obj.y > py + 600)) {
        obj.destroy();
      }
    }
  }

  fireBullet() {
    this.lastFireTime = this.time.now;
    var dir = this.facingRight ? 1 : -1;
    var bullet = this.bullets.create(this.player.x + dir * 28, this.player.y, 'misil-chicle1');
    if (!bullet || !bullet.body) return;
    bullet.setScale(0.1).setDepth(9);
    bullet.body.setAllowGravity(false);
    bullet.setVelocityX(dir * 600);
    bullet.setVelocityY(0);
    console.log('[PLAYER SHOOT]');
  }

  spawnCockroach() {
    if (this.gameOver) return;
    if (this.cucarachas.countActive() >= 12) return;
    console.log('[COCKROACH SPAWN]');

    // Spawn from left or right wall tunnel
    var side = Phaser.Math.Between(0, 1);
    var x = side === 0 ? 30 : 770;
    var y = this.player.y + Phaser.Math.Between(50, 350);

    var c = this.cucarachas.create(x, y, 'cucaracha1');
    if (!c || !c.body) return;
    c.setScale(0.2).setDepth(5);
    c.body.setAllowGravity(false);

    // Walk toward center
    var moveDir = side === 0 ? 1 : -1;
    c.setVelocityX(moveDir * Phaser.Math.Between(30, 70));
    c.setFlipX(side === 1);

    // Shoot after delay
    this.time.delayedCall(Phaser.Math.Between(600, 2000), () => {
      if (c && c.active && !this.gameOver) {
        this.enemyShoot(c);
      }
    });
  }

  enemyShoot(enemy) {
    if (!enemy || !enemy.active) return;
    var dir = this.player.x > enemy.x ? 1 : -1;
    var type = Phaser.Math.Between(0, 1);
    var key = type === 0 ? 'dona-podrida' : 'torta-chorro';
    var proj = this.enemyProjectiles.create(enemy.x + dir * 15, enemy.y, key);
    if (!proj || !proj.body) return;
    proj.setScale(0.11).setDepth(7);
    proj.body.setAllowGravity(false);
    proj.setVelocityX(dir * 160);
    proj.setData('type', type === 0 ? 'dona' : 'torta');
  }

  bulletHitEnemy(bullet, enemy) {
    if (!bullet || !bullet.active || !enemy || !enemy.active) return;
    bullet.destroy();
    enemy.destroy();
    this.killCount++;
    this.score += 10;
    this.killText.setText('Kills: ' + this.killCount);
    console.log('[BUG HIT] kills=' + this.killCount);
    // Small burst
    this.cameras.main.flash(20, 255, 100, 0, false);
  }

  enemyTouchPlayer(player, enemy) {
    if (this.gameOver || this.time.now < this.damageCooldownUntil) return;
    if (!enemy || !enemy.active) return;
    enemy.destroy();
    this.applyDamage(1);
  }

  projHitPlayer(player, proj) {
    if (this.gameOver || this.time.now < this.damageCooldownUntil) return;
    if (!proj || !proj.active) return;
    var type = proj.getData('type');
    proj.destroy();
    this.applyDamage(1);
    if (type === 'torta') this.activateChorro();
  }

  applyDamage(amount) {
    this.damageCooldownUntil = this.time.now + 1500;
    this.playerHP -= amount;
    this.isHurt = true;
    if (this.player && this.player.active) {
      this.player.setTint(0xff0000);
      this.player.setAlpha(0.5);
    }
    this.cameras.main.shake(80, 0.006);
    this.updateHUD();

    this.time.delayedCall(1500, () => {
      if (this.gameOver) return;
      if (this.player && this.player.active) {
        if (!this.chorroActivo) this.player.clearTint();
        this.player.setAlpha(1);
      }
      this.isHurt = false;
    });

    if (this.playerHP <= 0) {
      this.gameOver = true;
      MusicManager.fadeOut(this, 700);
      this.add.text(400, 225, 'GAME OVER', {
        font: '28px monospace', fill: '#ff4444',
        stroke: '#000000', strokeThickness: 4
      }).setOrigin(0.5).setScrollFactor(0).setDepth(300);
      this.time.delayedCall(2000, () => {
        this.scene.start('GameOverScene', { score: this.score });
      });
    }
  }

  activateChorro() {
    this.chorroActivo = true;
    if (this.player && this.player.active) this.player.setTint(0x33cc00);
    this.statusText.setText('CHORRO!');
    this.statusText.setStyle({ fill: '#33cc00' });
    this.time.delayedCall(6000, () => {
      this.chorroActivo = false;
      this.statusText.setText('');
      if (!this.isHurt && this.player && this.player.active) this.player.clearTint();
    });
  }

  spawnPowerUp() {
    if (this.gameOver || !this.player) return;
    var types = ['agua', 'bolillo', 'chicle-poder', 'power-vida'];
    var keys = { 'agua': 'power-agua', 'bolillo': 'bolillo', 'chicle-poder': 'chicle-poder', 'power-vida': 'power-vida' };
    var type = types[Phaser.Math.Between(0, types.length - 1)];
    var x = Phaser.Math.Between(80, 720);
    var y = this.player.y + Phaser.Math.Between(200, 400);
    var pu = this.powerUps.create(x, y, keys[type]);
    if (!pu || !pu.body) return;
    pu.setScale(0.13).setDepth(6);
    pu.body.setAllowGravity(false);
    pu.setData('type', type);
    console.log('[POWER SPAWN] ' + type);
  }

  collectPower(player, item) {
    if (!item || !item.active) return;
    var type = item.getData('type');
    item.destroy();
    console.log('[POWER PICKUP] ' + type);
    this.cameras.main.flash(30, 150, 255, 150, false);

    switch (type) {
      case 'agua':
        this.chorroActivo = false;
        this.statusText.setText('Curado!');
        if (!this.isHurt && this.player.active) this.player.clearTint();
        this.time.delayedCall(1000, () => { this.statusText.setText(''); });
        break;
      case 'bolillo':
      case 'power-vida':
        if (this.playerHP < this.playerMaxHP) { this.playerHP++; this.updateHUD(); }
        this.statusText.setText('+1 Vida');
        this.time.delayedCall(800, () => { this.statusText.setText(''); });
        break;
      case 'chicle-poder':
        this.fireRate = 100;
        this.statusText.setText('DISPARO RAPIDO!');
        this.statusText.setStyle({ fill: '#ff44ff' });
        this.time.delayedCall(8000, () => {
          this.fireRate = 250;
          this.statusText.setText('');
        });
        break;
    }
  }

  updateHUD() {
    var ratio = Math.max(0, this.playerHP / this.playerMaxHP);
    this.hpBar.width = 120 * ratio;
    this.hpBar.fillColor = ratio > 0.5 ? 0x44ff44 : (ratio > 0.25 ? 0xffcc00 : 0xff2222);
  }

  completeLevel() {
    if (this.gameOver) return;
    this.gameOver = true;
    console.log('[LEVEL3 COMPLETE]');
    if (this.enemySpawnTimer) this.enemySpawnTimer.remove();

    this.player.setVelocityY(0);
    this.player.setVelocityX(0);

    this.add.text(400, 225, 'Sobreviviste al Hoyo del Gusano!', {
      font: '18px monospace', fill: '#44ff88',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

    this.add.text(400, 260, 'Kills: ' + this.killCount + ' | Profundidad: ' + Math.floor(this.player.y / 10) + 'm', {
      font: '12px monospace', fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

    MusicManager.play(this, 'victoria', { volume: 0.7, loop: false, fadeIn: 500 });

    this.time.delayedCall(3000, () => {
      this.scene.start('VictoryScene', { score: this.score + this.killCount * 10 });
    });
  }
}
