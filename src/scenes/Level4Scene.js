class Level4Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level4Scene' });
  }

  create() {
    // --- RESET ---
    this.gameOver = false;
    this.levelCompleted = false;
    this.playerHP = 5;
    this.playerMaxHP = 5;
    this.isHurt = false;
    this.damageCooldownUntil = 0;
    this.score = 0;
    this.facingRight = true;
    this.lastFireTime = 0;
    this.fireRate = 250;
    this.bossDefeated = false;
    this.victoryCompleted = false;
    this.bossFightActive = false;
    this.hasDoubleJumped = false;
    this.abuelaPhase = 1;
    this.abuelaHP = 15;
    this.abuelaMaxHP = 15;
    this.abuelaActive = false;
    this.abuelaAttackTime = 0;
    this.abuelaChaseState = 'hidden';
    this.abuelaCinematicDone = false;
    this.shieldActive = false;
    this.comboActive = false;

    var camW = this.cameras.main.width;
    var camH = this.cameras.main.height;
    var worldWidth = 4000;
    var worldHeight = 450;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.gravity.y = 900;

    // --- MUSIC ---
    MusicManager.play(this, 'nivel4_metro', { volume: 0.7, loop: true, fadeIn: 1000 });

    // --- PARALLAX BACKGROUND ---
    this.bg = this.add.tileSprite(0, 0, camW, camH, 'lab-bg')
      .setOrigin(0, 0).setScrollFactor(0).setDepth(-3);
    var bgSrc = this.textures.get('lab-bg').getSourceImage();
    if (bgSrc && bgSrc.height > 0) {
      var scaleY = camH / bgSrc.height;
      this.bg.tileScaleX = scaleY;
      this.bg.tileScaleY = scaleY;
    }

    // --- GROUND (invisible floor spanning entire world) ---
    this.platforms = this.physics.add.staticGroup();
    var ground = this.add.zone(worldWidth / 2, worldHeight - 10, worldWidth, 20);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    // FIX: No invisible mid-air platforms — only cow staircase serves as platforms

    // --- COW STAIRCASE (visible sprites + invisible platform zones) ---
    var cowPositions = [
      { x: 2900, y: 360 },
      { x: 3050, y: 310 },
      { x: 3200, y: 260 },
      { x: 3350, y: 200 },
      { x: 3500, y: 140 }
    ];
    var cowSprites = ['vaca1', 'vaca-choco', 'vaca-fresa', 'vaca1', 'vaca-choco'];
    this.cowImages = [];
    for (var ci = 0; ci < cowPositions.length; ci++) {
      var cow = this.add.image(cowPositions[ci].x, cowPositions[ci].y, cowSprites[ci]);
      cow.setScale(0.18).setDepth(3);
      this.cowImages.push(cow);
      var cowPlat = this.add.zone(cowPositions[ci].x, cowPositions[ci].y - 20, 65, 16);
      this.physics.add.existing(cowPlat, true);
      this.platforms.add(cowPlat);
    }

    // --- PLAYER ---
    this.player = this.physics.add.sprite(80, worldHeight - 80, 'player-idle');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.35).setDepth(10);
    this.player.body.setSize(this.player.width * 0.45, this.player.height * 0.75);
    this.player.body.setOffset(this.player.width * 0.28, this.player.height * 0.25);
    this.physics.add.collider(this.player, this.platforms);

    // Player animations
    if (!this.anims.exists('l4-idle')) {
      this.anims.create({ key: 'l4-idle', frames: [{ key: 'player-idle' }], frameRate: 1, repeat: -1 });
      this.anims.create({ key: 'l4-run', frames: [{ key: 'player-run1' }, { key: 'player-run2' }, { key: 'player-run3' }], frameRate: 10, repeat: -1 });
      this.anims.create({ key: 'l4-jump', frames: [{ key: 'player-jump' }], frameRate: 1, repeat: 0 });
    }

    // --- GUN ---
    this.gun = this.add.image(this.player.x + 20, this.player.y, 'pistola1');
    this.gun.setScale(0.18).setDepth(11);

    // --- BULLETS ---
    this.bullets = this.physics.add.group();

    // --- ENEMY GROUPS ---
    this.bats = this.physics.add.group();
    this.batProjectiles = this.physics.add.group();
    this.aliens = this.physics.add.group();
    this.abuelaProjectiles = this.physics.add.group();

    // --- MURCIELAJOLOTES (spread across the level) ---
    var batPositions = [
      [300, 300], [550, 280], [800, 290], [1100, 270], [1350, 260], [1600, 280],
      [2950, 330], [3100, 280], [3250, 230], [3400, 170], [3550, 120]
    ];
    for (var bi = 0; bi < batPositions.length; bi++) {
      this.spawnBat(batPositions[bi][0], batPositions[bi][1]);
    }

    // --- ALIENS (ground patrol, x=1200 to x=2800) ---
    var alienPositions = [
      [1300, 380], [1600, 380], [1900, 380], [2200, 380], [2500, 380], [2800, 380]
    ];
    var alienSprites = ['alien2', 'alien3', 'alien-dr'];
    for (var ai = 0; ai < alienPositions.length; ai++) {
      var akey = alienSprites[ai % alienSprites.length];
      var alien = this.aliens.create(alienPositions[ai][0], alienPositions[ai][1], akey);
      if (!alien || !alien.body) continue;
      alien.setScale(0.25).setDepth(5);
      alien.setCollideWorldBounds(true);
      alien.setData('hp', 2);
      alien.setData('dir', ai % 2 === 0 ? 1 : -1);
      alien.setData('originX', alienPositions[ai][0]);
    }

    // --- ABUELA MALICIA (hidden until player reaches x=2000) ---
    this.abuela = this.physics.add.sprite(2400, 120, 'abuela-idle');
    this.abuela.setScale(0.5).setDepth(15);
    this.abuela.body.setAllowGravity(false);
    this.abuela.body.setSize(this.abuela.width * 0.6, this.abuela.height * 0.7);
    this.abuela.setVisible(false);
    this.abuela.body.enable = false;

    // Boss HP bar (hidden until combat)
    this.bossNameText = this.add.text(400, 38, 'ABUELA MALICIA', {
      font: '12px monospace', fill: '#ff44ff', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setVisible(false);
    this.bossHPBar = this.add.rectangle(300, 52, 200, 12, 0xff44ff)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100).setVisible(false);
    this.bossHPBarBg = this.add.rectangle(300, 52, 200, 12)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(99)
      .setStrokeStyle(1, 0xffffff).setFillStyle(0x000000, 0.5).setVisible(false);

    // --- POWER-UP SPAWNER ---
    this.powerUps = this.physics.add.group();
    this.time.addEvent({
      delay: 6000, loop: true,
      callback: function() {
        if (this.gameOver || this.bossDefeated) return;
        if (this.powerUps.countActive() >= 2) return;
        var types = ['bolillo', 'power-agua', 'chicle-poder', 'dulce', 'dulce-poder', 'power-combo'];
        var type = types[Phaser.Math.Between(0, types.length - 1)];
        var px = this.player.x + Phaser.Math.Between(100, 300);
        if (px > 3900) px = 3900;
        var pu = this.powerUps.create(px, 50, type);
        if (pu && pu.body) {
          pu.setScale(0.15).setDepth(6);
          pu.setData('type', type);
        }
      }, callbackScope: this
    });

    // --- COLLIDERS & OVERLAPS ---
    this.physics.add.overlap(this.bullets, this.bats, this.bulletHitBat, null, this);
    this.physics.add.overlap(this.bullets, this.abuela, this.bulletHitBoss, null, this);
    this.physics.add.overlap(this.bullets, this.aliens, this.bulletHitAlien, null, this);
    this.physics.add.overlap(this.player, this.bats, this.batHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.aliens, this.alienHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.batProjectiles, this.projHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.abuelaProjectiles, this.projHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.abuela, this.bossHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);
    this.physics.add.collider(this.aliens, this.platforms);
    this.physics.add.collider(this.powerUps, this.platforms);

    // --- INPUT ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.fireKeyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    // --- CAMERA ---
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // --- HUD ---
    this.hpBar = this.add.rectangle(80, 16, 120, 14, 0x44ff44)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.add.rectangle(80, 16, 120, 14).setOrigin(0, 0)
      .setScrollFactor(0).setDepth(99).setStrokeStyle(1, 0xffffff);
    this.add.text(16, 15, '\u2764', { font: '12px sans-serif', fill: '#ff4444' })
      .setScrollFactor(0).setDepth(100);
    this.add.text(camW / 2, 16, 'NIVEL 4 - LABORATORIO ALIEN\u00CDGENA', {
      font: '13px monospace', fill: '#88aaff', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
  }

  update() {
    if (this.gameOver || this.levelCompleted) return;

    // Parallax
    this.bg.tilePositionX = this.cameras.main.scrollX * 0.15;

    // Player movement
    var speed = 220;
    var onGround = this.player.body.touching.down || this.player.body.blocked.down;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
      this.facingRight = false;
      if (onGround) this.player.anims.play('l4-run', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
      this.facingRight = true;
      if (onGround) this.player.anims.play('l4-run', true);
    } else {
      this.player.setVelocityX(0);
      if (onGround) this.player.anims.play('l4-idle', true);
    }

    // Jump
    var jumpForce = this.bossFightActive ? -550 : -420;
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && onGround) {
      this.player.setVelocityY(jumpForce);
      this.hasDoubleJumped = false;
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && !onGround && this.bossFightActive && !this.hasDoubleJumped) {
      this.player.setVelocityY(jumpForce * 0.75);
      this.hasDoubleJumped = true;
    }
    if (!onGround) this.player.anims.play('l4-jump', true);

    // Fire
    if ((this.fireKey.isDown || this.fireKeyA.isDown) && this.time.now > this.lastFireTime + this.fireRate) {
      this.fireBullet();
    }

    // Gun follows player
    var gx = this.facingRight ? 22 : -22;
    this.gun.setPosition(this.player.x + gx, this.player.y);
    this.gun.setFlipX(!this.facingRight);

    // Abuela chase trigger (player reaches x=2000)
    if (this.abuelaChaseState === 'hidden' && this.player.x >= 2000) {
      this.startAbuelaChase();
    }

    // Boss AI
    if (this.abuelaActive && !this.bossDefeated) {
      this.updateAbuelaBoss();
    }

    // Alien patrol
    var alienList = this.aliens.getChildren();
    for (var ai = 0; ai < alienList.length; ai++) {
      var a = alienList[ai];
      if (!a || !a.active) continue;
      var dir = a.getData('dir');
      var originX = a.getData('originX');
      a.setVelocityX(dir * 50);
      if (a.x < originX - 120 || a.x > originX + 120) a.setData('dir', -dir);
    }

    // Cleanup far-away projectiles only
    this.cleanProjectiles(this.bullets);
    this.cleanProjectiles(this.batProjectiles);
    this.cleanProjectiles(this.abuelaProjectiles);
  }

  // --- HELPERS ---

  cleanProjectiles(group) {
    var items = group.getChildren();
    for (var i = items.length - 1; i >= 0; i--) {
      var p = items[i];
      if (p && p.active && (p.y < -50 || p.y > 500 || p.x < -50 || p.x > 4100)) {
        p.destroy();
      }
    }
  }

  fadeText(textObj) {
    if (!textObj) return;
    this.tweens.add({
      targets: textObj, alpha: 0, y: textObj.y - 30,
      duration: 1500, ease: 'Quad.easeOut',
      onComplete: function() { if (textObj && textObj.active) textObj.destroy(); }
    });
  }

  fireBullet() {
    this.lastFireTime = this.time.now;
    var dir = this.facingRight ? 1 : -1;
    var b = this.bullets.create(this.player.x + dir * 25, this.player.y - 5, 'misil-chicle1');
    if (!b || !b.body) return;
    b.setScale(0.1).setDepth(9);
    b.body.setAllowGravity(false);
    b.setVelocityX(dir * 600);
    b.setData('damage', this.comboActive ? 2 : 1);
  }

  // --- MURCIELAJOLOTES ---

  spawnBat(x, y) {
    var bat = this.bats.create(x, y, 'bat-idle');
    if (!bat || !bat.body) return;
    bat.setScale(0.25).setDepth(5);
    bat.body.setAllowGravity(false);
    bat.setData('hp', 2);
    this.tweens.add({
      targets: bat, x: bat.x + 80, y: bat.y - 30,
      duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
    var self = this;
    (function(b) {
      self.time.addEvent({
        delay: Phaser.Math.Between(2200, 3800), loop: true,
        callback: function() {
          if (b && b.active && !self.gameOver && !self.bossDefeated) self.batShoot(b);
        }
      });
    })(bat);
  }

  batShoot(bat) {
    if (!this.player || !this.player.active) return;
    var dx = this.player.x - bat.x;
    var dy = this.player.y - bat.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1 || dist > 500) return;
    var proj = this.batProjectiles.create(bat.x, bat.y, 'bat-proj');
    if (!proj || !proj.body) return;
    proj.setScale(0.12).setDepth(7);
    proj.body.setAllowGravity(false);
    proj.setVelocityX((dx / dist) * 150);
    proj.setVelocityY((dy / dist) * 150);
  }

  bulletHitBat(bullet, bat) {
    if (!bullet || !bullet.active || !bat || !bat.active) return;
    bullet.destroy();
    var dmg = bullet.getData('damage') || 1;
    var hp = bat.getData('hp') - dmg;
    bat.setData('hp', hp);
    bat.setTint(0xff0000);
    this.time.delayedCall(100, function() { if (bat && bat.active) bat.clearTint(); });
    if (hp <= 0) { bat.destroy(); this.score += 20; }
  }

  batHitPlayer(player, bat) {
    if (this.gameOver || this.bossDefeated || this.time.now < this.damageCooldownUntil) return;
    this.applyDamage(1);
  }

  projHitPlayer(player, proj) {
    if (this.gameOver || this.bossDefeated || this.time.now < this.damageCooldownUntil) return;
    if (!proj || !proj.active) return;
    proj.destroy();
    if (this.shieldActive) return;
    this.applyDamage(1);
  }

  // --- ALIENS ---

  bulletHitAlien(bullet, alien) {
    if (!bullet || !bullet.active || !alien || !alien.active) return;
    bullet.destroy();
    var dmg = bullet.getData('damage') || 1;
    var hp = alien.getData('hp') - dmg;
    alien.setData('hp', hp);
    alien.setTint(0xff0000);
    this.time.delayedCall(100, function() { if (alien && alien.active) alien.clearTint(); });
    if (hp <= 0) { alien.destroy(); this.score += 15; }
  }

  alienHitPlayer(player, alien) {
    if (this.gameOver || this.bossDefeated || this.time.now < this.damageCooldownUntil) return;
    if (this.shieldActive) return;
    this.applyDamage(1);
  }

  // --- POWER-UPS ---

  collectPowerUp(player, item) {
    if (!item || !item.active) return;
    var type = item.getData('type') || 'bolillo';
    item.destroy();
    var msg = '';
    switch (type) {
      case 'bolillo':
        if (this.playerHP < this.playerMaxHP) { this.playerHP++; this.updatePlayerHUD(); }
        msg = '+1 Vida'; break;
      case 'power-agua':
        this.shieldActive = true;
        this.player.setTint(0x00ccff);
        this.time.delayedCall(5000, function() { this.shieldActive = false; if (this.player && this.player.active && !this.isHurt) this.player.clearTint(); }.bind(this));
        msg = 'Escudo!'; break;
      case 'chicle-poder':
        this.fireRate = 120;
        this.time.delayedCall(8000, function() { this.fireRate = 250; }.bind(this));
        msg = 'Disparo Rapido!'; break;
      case 'dulce':
        this.bossFightActive = true;
        this.time.delayedCall(10000, function() { if (!this.abuelaActive) this.bossFightActive = false; }.bind(this));
        msg = 'Super Salto!'; break;
      case 'dulce-poder':
        this.comboActive = true;
        this.player.setTint(0xff88ff);
        this.time.delayedCall(8000, function() { this.comboActive = false; if (this.player && this.player.active && !this.isHurt && !this.shieldActive) this.player.clearTint(); }.bind(this));
        msg = 'Dano x2!'; break;
      case 'power-combo':
        this.comboActive = true; this.shieldActive = true;
        this.player.setTint(0xffff00);
        this.time.delayedCall(6000, function() { this.comboActive = false; this.shieldActive = false; if (this.player && this.player.active && !this.isHurt) this.player.clearTint(); }.bind(this));
        msg = 'COMBO!'; break;
      default:
        if (this.playerHP < this.playerMaxHP) { this.playerHP++; this.updatePlayerHUD(); }
        msg = '+1'; break;
    }
    var txt = this.add.text(player.x, player.y - 40, msg, {
      font: '12px monospace', fill: '#44ff44', stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(150);
    this.fadeText(txt);
  }

  // --- ABUELA BOSS (CINEMATIC CHASE → STANDOFF → COMBAT) ---

  startAbuelaChase() {
    this.abuelaChaseState = 'fleeing';
    this.abuelaActive = true;
    this.abuela.setVisible(true);
    this.abuela.body.enable = true;
    this.abuela.x = this.player.x + 400;
    this.abuela.y = 120;
    this.cameras.main.flash(150, 255, 80, 255, false);
    var warn = this.add.text(this.cameras.main.scrollX + 400, 100, 'Ahi esta la Abuela!', {
      font: '16px monospace', fill: '#ff88ff', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(200);
    this.fadeText(warn);
  }

  updateAbuelaBoss() {
    if (!this.abuela || !this.abuela.active) return;

    // Float
    this.abuela.y = 120 + Math.sin(this.time.now * 0.002) * 25;
    this.abuela.setFlipX(this.player.x > this.abuela.x);

    if (this.abuelaChaseState === 'fleeing') {
      var distToPlayer = this.abuela.x - this.player.x;

      // Always try to stay ahead; flee when player approaches
      if (distToPlayer < 300) {
        this.abuela.setVelocityX(100);
      } else {
        this.abuela.setVelocityX(0);
        // Attack while waiting
        if (this.time.now > this.abuelaAttackTime + 2500) {
          this.abuelaAttackTime = this.time.now;
          this.abuelaAttack();
        }
      }

      // Standoff: abuela reaches end of level
      if (this.abuela.x >= 3600) {
        this.abuelaChaseState = 'standoff';
        this.abuela.setVelocityX(0);
        this.abuela.x = 3650;
        this.startBossCinematic();
      }

    } else if (this.abuelaChaseState === 'fighting') {
      this.abuela.setVelocityX(0);
      var delay = this.abuelaPhase >= 3 ? 800 : (this.abuelaPhase === 2 ? 1200 : 1800);
      if (this.time.now > this.abuelaAttackTime + delay) {
        this.abuelaAttackTime = this.time.now;
        this.abuelaAttack();
      }
    }
  }

  startBossCinematic() {
    this.player.setVelocityX(0);
    var cx = this.cameras.main.scrollX + 400;
    var self = this;

    var line1 = this.add.text(cx, 160, '"Hasta aqui llegaste, mija..."', {
      font: '16px monospace', fill: '#ffaaff', stroke: '#000', strokeThickness: 3,
      backgroundColor: '#000000aa', padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setDepth(300).setAlpha(0);
    this.tweens.add({ targets: line1, alpha: 1, duration: 400 });

    setTimeout(function() {
      if (self.bossDefeated) return;
      var line2 = self.add.text(cx, 210, '"Conoceras el poder del Gusano Espacial..."', {
        font: '14px monospace', fill: '#ff44aa', stroke: '#000', strokeThickness: 3,
        backgroundColor: '#000000aa', padding: { x: 10, y: 5 }
      }).setOrigin(0.5).setDepth(300).setAlpha(0);
      self.tweens.add({ targets: line2, alpha: 1, duration: 400 });

      setTimeout(function() {
        if (self.bossDefeated) return;
        if (line1 && line1.active) self.fadeText(line1);
        if (line2 && line2.active) self.fadeText(line2);
        // ACTIVATE COMBAT — Abuela is the final boss
        self.abuelaChaseState = 'fighting';
        self.bossFightActive = true;
        self.abuelaCinematicDone = true;
        self.bossNameText.setVisible(true);
        self.bossHPBar.setVisible(true);
        self.bossHPBarBg.setVisible(true);
        self.cameras.main.shake(300, 0.01);
      }, 1500);
    }, 1500);
  }

  abuelaAttack() {
    if (!this.abuela || !this.abuela.active || this.bossDefeated) return;
    this.abuela.setTexture('abuela-jump');
    this.time.delayedCall(400, function() {
      if (this.abuela && this.abuela.active) this.abuela.setTexture('abuela-idle');
    }.bind(this));

    var baseAngle = Math.atan2(this.player.y - this.abuela.y, this.player.x - this.abuela.x);
    var count = this.abuelaPhase >= 3 ? 7 : (this.abuelaPhase === 2 ? 5 : 3);
    for (var i = 0; i < count; i++) {
      var angle = baseAngle + (i - Math.floor(count / 2)) * 0.2;
      var proj = this.abuelaProjectiles.create(this.abuela.x, this.abuela.y - 10, 'abuela-parasite');
      if (!proj || !proj.body) continue;
      proj.setScale(0.2).setDepth(7);
      proj.body.setAllowGravity(false);
      var spd = this.abuelaPhase >= 3 ? 280 : (this.abuelaPhase === 2 ? 240 : 170);
      proj.setVelocityX(Math.cos(angle) * spd);
      proj.setVelocityY(Math.sin(angle) * spd);
    }
    this.cameras.main.shake(50, 0.003);
  }

  bulletHitBoss(bullet, boss) {
    if (this.bossDefeated || !bullet || !bullet.active) return;
    if (!this.abuelaCinematicDone) { bullet.destroy(); return; }
    bullet.destroy();
    var dmg = bullet.getData('damage') || 1;
    this.abuelaHP -= dmg;
    this.updateBossHPBar();

    if (this.abuela && this.abuela.active) {
      this.abuela.setTint(0xffffff);
      this.time.delayedCall(120, function() { if (this.abuela && this.abuela.active) this.abuela.clearTint(); }.bind(this));
    }

    if (this.abuelaPhase === 1 && this.abuelaHP <= Math.floor(this.abuelaMaxHP / 2)) {
      this.abuelaPhase = 2;
      this.cameras.main.shake(300, 0.008);
    }
    if (this.abuelaPhase === 2 && this.abuelaHP <= Math.floor(this.abuelaMaxHP / 4)) {
      this.abuelaPhase = 3;
      this.cameras.main.shake(400, 0.012);
    }
    if (this.abuelaHP <= 0) {
      this.defeatBoss();
    }
  }

  bossHitPlayer(player, boss) {
    if (this.gameOver || this.bossDefeated || this.time.now < this.damageCooldownUntil) return;
    if (this.shieldActive) return;
    this.applyDamage(1);
  }

  updateBossHPBar() {
    var ratio = Math.max(0, this.abuelaHP / this.abuelaMaxHP);
    this.bossHPBar.width = 200 * ratio;
    this.bossHPBar.fillColor = ratio > 0.5 ? 0xff44ff : 0xff2222;
  }

  // --- VICTORY ---

  defeatBoss() {
    if (this.bossDefeated) return;
    this.victoryCompleted = true;
    this.bossDefeated = true;
    this.levelCompleted = true;
    this.gameOver = true;
    this.abuelaActive = false;

    this.time.removeAllEvents();
    this.tweens.killAll();
    this.physics.world.pause();

    if (this.abuelaProjectiles) this.abuelaProjectiles.clear(true, true);
    if (this.batProjectiles) this.batProjectiles.clear(true, true);
    if (this.bats) this.bats.clear(true, true);
    if (this.aliens) this.aliens.clear(true, true);
    if (this.powerUps) this.powerUps.clear(true, true);
    if (this.bullets) this.bullets.clear(true, true);

    if (this.gun) this.gun.setVisible(false);
    if (this.bossHPBar) this.bossHPBar.setVisible(false);
    if (this.bossHPBarBg) this.bossHPBarBg.setVisible(false);
    if (this.bossNameText) this.bossNameText.setVisible(false);
    if (this.abuela && this.abuela.active) this.abuela.setAlpha(0.3);

    this.damageCooldownUntil = this.time.now + 999999;
    if (this.player && this.player.active) {
      this.player.clearTint();
      this.player.setAlpha(1);
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }

    MusicManager.stop();
    MusicManager.play(this, 'victoria', { volume: 0.7, loop: false, fadeIn: 500 });

    this.add.text(this.cameras.main.scrollX + 400, 200, '  La Abuela fue liberada!  ', {
      font: '22px monospace', fill: '#ff88ff',
      backgroundColor: '#000000cc', padding: { x: 16, y: 10 }
    }).setOrigin(0.5).setDepth(500);

    this.cameras.main.fadeOut(1800, 0, 0, 0);

    var self = this;
    setTimeout(function() { self.scene.start('FinalScene'); }, 2000);
  }

  // --- DAMAGE ---

  applyDamage(amount) {
    if (this.bossDefeated) return;
    if (this.time.now < this.damageCooldownUntil) return;
    if (this.shieldActive) return;
    this.damageCooldownUntil = this.time.now + 1500;
    this.playerHP -= amount;
    this.isHurt = true;
    if (this.player && this.player.active) {
      this.player.setTint(0xff0000);
      this.player.setAlpha(0.6);
    }
    this.cameras.main.shake(80, 0.005);
    this.updatePlayerHUD();

    this.time.delayedCall(1500, function() {
      if (this.gameOver) return;
      if (this.player && this.player.active) {
        this.player.clearTint();
        this.player.setAlpha(1);
      }
      this.isHurt = false;
    }.bind(this));

    if (this.playerHP <= 0) {
      if (this.victoryCompleted || this.bossDefeated) { this.playerHP = 1; return; }
      this.gameOver = true;
      MusicManager.stop();
      this.time.removeAllEvents();
      this.add.text(this.cameras.main.scrollX + 400, 200, 'GAME OVER', {
        font: '28px monospace', fill: '#ff4444', stroke: '#000', strokeThickness: 4
      }).setOrigin(0.5).setDepth(500);
      var self = this;
      setTimeout(function() {
        if (self.victoryCompleted) return;
        self.scene.start('Level4Scene');
      }, 2500);
    }
  }

  updatePlayerHUD() {
    var ratio = Math.max(0, this.playerHP / this.playerMaxHP);
    this.hpBar.width = 120 * ratio;
    this.hpBar.fillColor = ratio > 0.5 ? 0x44ff44 : (ratio > 0.25 ? 0xffcc00 : 0xff2222);
  }
}
