class Level4Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level4Scene' });
  }

  create() {
    console.log('[LEVEL4 START]');
    console.log('[ALIEN LAB ENTERED]');

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
    this.bossPhase = 1;
    this.bossHP = 10;
    this.bossMaxHP = 10;
    this.bossActive = false;
    this.bossDefeated = false;
    this.victoryCompleted = false;

    var w = this.cameras.main.width;
    var h = this.cameras.main.height;
    var worldWidth = 800;
    var worldHeight = 450;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.gravity.y = 900;

    // --- MUSIC ---
    MusicManager.play(this, 'nivel4_metro', { volume: 0.7, loop: true, fadeIn: 1000 });

    // --- BACKGROUND ---
    this.bg = this.add.tileSprite(0, 0, w, h, 'lab-bg')
      .setOrigin(0, 0).setScrollFactor(0).setDepth(-3);
    var bgSrc = this.textures.get('lab-bg').getSourceImage();
    if (bgSrc.height > 0) {
      this.bg.tileScaleX = h / bgSrc.height;
      this.bg.tileScaleY = this.bg.tileScaleX;
    }

    // --- GROUND ---
    this.platforms = this.physics.add.staticGroup();
    var ground = this.add.rectangle(worldWidth / 2, worldHeight - 20, worldWidth, 40, 0x1a1a2e);
    ground.setStrokeStyle(2, 0x4444ff);
    this.platforms.add(ground);

    // Remove elevated platforms — flat lab floor only
    // (no jumping puzzles in the final level)

    // --- VACAS ABDUCIDAS (narrative decoration) ---
    this.add.image(150, worldHeight - 80, 'vaca1').setScale(0.15).setDepth(2).setAlpha(0.5);
    this.add.image(650, worldHeight - 80, 'vaca-choco').setScale(0.15).setDepth(2).setAlpha(0.5);

    // --- PLAYER (uses existing player sprites from PreloadScene) ---
    this.player = this.physics.add.sprite(80, worldHeight - 100, 'player-idle');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.35).setDepth(10);
    this.player.body.setSize(this.player.width * 0.45, this.player.height * 0.75);
    this.player.body.setOffset(this.player.width * 0.28, this.player.height * 0.25);
    this.physics.add.collider(this.player, this.platforms);

    // Player animations (reuse existing keys from Level1)
    if (!this.anims.exists('l4-idle')) {
      this.anims.create({ key: 'l4-idle', frames: [{ key: 'player-idle' }], frameRate: 1, repeat: -1 });
      this.anims.create({ key: 'l4-run', frames: [{ key: 'player-run1' }, { key: 'player-run2' }, { key: 'player-run3' }], frameRate: 10, repeat: -1 });
      this.anims.create({ key: 'l4-jump', frames: [{ key: 'player-jump' }], frameRate: 1, repeat: 0 });
      this.anims.create({ key: 'l4-attack', frames: [{ key: 'player-attack1' }, { key: 'player-attack2' }], frameRate: 8, repeat: 0 });
    }

    // --- GUN ---
    this.gun = this.add.image(this.player.x + 20, this.player.y, 'pistola1');
    this.gun.setScale(0.18).setDepth(11);

    // --- BULLETS ---
    this.bullets = this.physics.add.group();

    // --- MURCIELAJOTES (secondary enemies) ---
    this.bats = this.physics.add.group();
    this.batProjectiles = this.physics.add.group();
    this.spawnBats();

    // --- ABUELA MALICIA — BOSS FINAL (single sprite) ---
    console.log('[GRANDMA SPAWN CALLED]');
    this.abuela = this.physics.add.sprite(400, 80, 'abuela-idle');
    this.abuela.setScale(0.5).setDepth(15);
    this.abuela.setScrollFactor(1);
    this.abuela.body.setAllowGravity(false);
    this.abuela.body.setSize(this.abuela.width * 0.6, this.abuela.height * 0.7);
    console.log('[GRANDMA CREATED] texture=' + this.abuela.texture.key +
      ' x=' + this.abuela.x + ' y=' + this.abuela.y +
      ' visible=' + this.abuela.visible + ' active=' + this.abuela.active +
      ' alpha=' + this.abuela.alpha + ' scale=' + this.abuela.scaleX +
      ' depth=' + this.abuela.depth);
    this.abuelaHP = 15;
    this.abuelaMaxHP = 15;
    this.abuelaActive = true;
    this.abuelaAttackTime = 0;
    this.abuelaPhase = 1;

    // Abuela projectiles (parasite_poder sprite — NOT abuela sprites)
    this.abuelaProjectiles = this.physics.add.group();

    // Boss HP bar
    this.bossNameText = this.add.text(400, 38, 'ABUELA MALICIA', {
      font: '12px monospace', fill: '#ff44ff', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
    this.bossHPBar = this.add.rectangle(300, 52, 200, 12, 0xff44ff)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.add.rectangle(300, 52, 200, 12).setOrigin(0, 0)
      .setScrollFactor(0).setDepth(99).setStrokeStyle(1, 0xffffff);

    // --- ALIENS (new enemies) ---
    this.aliens = this.physics.add.group();
    this.spawnAliens();

    // --- BOLILLO HEALTH PICKUPS ---
    this.bolilloPickups = this.physics.add.group();
    this.time.addEvent({
      delay: 6000, loop: true,
      callback: function() {
        if (this.gameOver || this.levelCompleted) return;
        var bx = Phaser.Math.Between(100, 700);
        var bl = this.bolilloPickups.create(bx, 100, 'bolillo');
        if (bl && bl.body) { bl.setScale(0.15).setDepth(6); }
      }, callbackScope: this
    });

    // --- OVERLAPS ---
    this.physics.add.overlap(this.bullets, this.bats, this.bulletHitBat, null, this);
    this.physics.add.overlap(this.bullets, this.abuela, this.bulletHitBoss, null, this);
    this.physics.add.overlap(this.bullets, this.aliens, this.bulletHitAlien, null, this);
    this.physics.add.overlap(this.player, this.bats, this.batHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.aliens, this.alienHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.batProjectiles, this.projHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.abuelaProjectiles, this.projHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.abuela, this.bossHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.bolilloPickups, this.collectBolillo, null, this);
    this.physics.add.collider(this.bats, this.platforms);
    this.physics.add.collider(this.aliens, this.platforms);
    this.physics.add.collider(this.bolilloPickups, this.platforms);

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

    this.add.text(w / 2, 16, 'NIVEL 4 - LABORATORIO ALIENIGENA', {
      font: '13px monospace', fill: '#88aaff', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
  }

  update() {
    if (this.gameOver || this.levelCompleted) return;

    // Parallax
    this.bg.tilePositionX = this.cameras.main.scrollX * 0.2;

    // Player movement with animations
    var speed = 200;
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

    if (this.cursors.up.isDown && onGround) {
      this.player.setVelocityY(-400);
    }

    if (!onGround) {
      this.player.anims.play('l4-jump', true);
    }

    // Fire
    if ((this.fireKey.isDown || this.fireKeyA.isDown) && this.time.now > this.lastFireTime + this.fireRate) {
      this.fireBullet();
    }

    // Gun follows player
    var gx = this.facingRight ? 22 : -22;
    this.gun.setPosition(this.player.x + gx, this.player.y);
    this.gun.setFlipX(!this.facingRight);

    // Boss AI — Abuela Malicia
    if (this.abuelaActive && !this.bossDefeated) {
      this.updateAbuelaBoss();
    }

    // Cleanup offscreen projectiles
    this.cleanOffscreen(this.bullets);
    this.cleanOffscreen(this.batProjectiles);
    this.cleanOffscreen(this.abuelaProjectiles);

    // Alien patrol
    var alienList = this.aliens.getChildren().slice();
    for (var ai = 0; ai < alienList.length; ai++) {
      var a = alienList[ai];
      if (!a || !a.active) continue;
      var dir = a.getData('dir');
      a.setVelocityX(dir * 40);
      if (a.x < 30 || a.x > 770) { a.setData('dir', -dir); }
    }
  }

  addPlatform(x, y, w, h) {
    var p = this.add.rectangle(x, y, w, h, 0x2222aa);
    p.setStrokeStyle(2, 0x6666ff);
    this.platforms.add(p);
  }

  cleanOffscreen(group) {
    var items = group.getChildren().slice();
    for (var i = 0; i < items.length; i++) {
      if (items[i].active && (items[i].x < -50 || items[i].x > 850)) items[i].destroy();
    }
  }

  fireBullet() {
    this.lastFireTime = this.time.now;
    var dir = this.facingRight ? 1 : -1;
    var b = this.bullets.create(this.player.x + dir * 25, this.player.y - 5, 'misil-chicle1');
    if (!b || !b.body) return;
    b.setScale(0.1).setDepth(9);
    b.body.setAllowGravity(false);
    b.setVelocityX(dir * 600);
  }

  spawnBats() {
    console.log('[MURCIELAJOLOTE SPAWN]');
    var positions = [[100, 180], [200, 160], [350, 190], [450, 170], [550, 180], [650, 160], [700, 190], [300, 150]];
    for (var i = 0; i < positions.length; i++) {
      var bat = this.bats.create(positions[i][0], positions[i][1], 'bat-idle');
      if (!bat || !bat.body) continue;
      bat.setScale(0.25).setDepth(5);
      bat.body.setAllowGravity(false);
      bat.setData('hp', 2);
      // Patrol side to side + float up/down
      this.tweens.add({
        targets: bat, x: bat.x + 100, y: bat.y - 40,
        duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
      // Shoot periodically
      var self = this;
      (function(b) {
        self.time.addEvent({
          delay: Phaser.Math.Between(2000, 3500), loop: true,
          callback: function() { if (b && b.active && !self.gameOver) self.batShoot(b); }
        });
      })(bat);
    }
  }

  batShoot(bat) {
    var dx = this.player.x - bat.x;
    var dy = this.player.y - bat.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;
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
    var hp = bat.getData('hp') - 1;
    bat.setData('hp', hp);
    bat.setTint(0xff0000);
    this.time.delayedCall(100, () => { if (bat && bat.active) bat.clearTint(); });
    if (hp <= 0) {
      bat.destroy();
      this.score += 20;
    }
  }

  batHitPlayer(player, bat) {
    if (this.gameOver || this.bossDefeated || this.time.now < this.damageCooldownUntil) return;
    this.applyDamage(1);
  }

  projHitPlayer(player, proj) {
    if (this.gameOver || this.bossDefeated || this.time.now < this.damageCooldownUntil) return;
    if (!proj || !proj.active) return;
    proj.destroy();
    this.applyDamage(1);
  }

  spawnAliens() {
    console.log('[ALIEN SPAWN]');
    var alienSprites = ['alien2', 'alien3', 'alien-dr'];
    var positions = [[80, 380], [160, 380], [250, 380], [340, 380], [430, 380], [520, 380], [600, 380], [680, 380], [380, 380], [470, 380]];
    for (var i = 0; i < positions.length; i++) {
      var key = alienSprites[i % alienSprites.length];
      var alien = this.aliens.create(positions[i][0], positions[i][1], key);
      if (!alien || !alien.body) continue;
      alien.setScale(0.25).setDepth(5);
      alien.setData('hp', 2);
      alien.setData('dir', i % 2 === 0 ? 1 : -1);
    }
  }

  bulletHitAlien(bullet, alien) {
    if (!bullet || !bullet.active || !alien || !alien.active) return;
    bullet.destroy();
    var hp = alien.getData('hp') - 1;
    alien.setData('hp', hp);
    alien.setTint(0xff0000);
    this.time.delayedCall(100, () => { if (alien && alien.active) alien.clearTint(); });
    if (hp <= 0) {
      alien.destroy();
      this.score += 15;
    }
  }

  alienHitPlayer(player, alien) {
    if (this.gameOver || this.bossDefeated || this.time.now < this.damageCooldownUntil) return;
    this.applyDamage(1);
  }

  collectBolillo(player, item) {
    if (!item || !item.active) return;
    item.destroy();
    if (this.playerHP < this.playerMaxHP) {
      this.playerHP++;
      this.updatePlayerHUD();
    }
    console.log('[BOLILLO PICKUP] HP=' + this.playerHP);
    this.add.text(player.x, player.y - 40, 'Bolillo salvador!', {
      font: '11px monospace', fill: '#44ff44', stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(150);
  }

  updateAbuelaBoss() {
    if (!this.abuela || !this.abuela.active) return;

    // Chase player
    var dx = this.player.x - this.abuela.x;
    var speed = this.abuelaPhase >= 3 ? 90 : (this.abuelaPhase === 2 ? 70 : 40);
    if (this.abuela.body) this.abuela.setVelocityX(dx > 0 ? speed : -speed);
    this.abuela.setFlipX(dx < 0);

    // Attack periodically (faster in later phases)
    var attackDelay = this.abuelaPhase >= 3 ? 800 : (this.abuelaPhase === 2 ? 1200 : 2000);
    if (this.time.now > this.abuelaAttackTime + attackDelay) {
      this.abuelaAttackTime = this.time.now;
      this.abuelaAttack();
    }
  }

  abuelaAttack() {
    if (!this.abuela || !this.abuela.active || this.bossDefeated) return;
    console.log('[PARASITE ATTACK]');

    // Visual: jump sprite briefly
    this.abuela.setTexture('abuela-jump');
    this.time.delayedCall(400, () => {
      if (this.abuela && this.abuela.active) this.abuela.setTexture('abuela-idle');
    });

    // Fire parasite_poder projectiles in spread pattern
    var baseAngle = Math.atan2(this.player.y - this.abuela.y, this.player.x - this.abuela.x);
    var count = this.abuelaPhase >= 3 ? 7 : (this.abuelaPhase === 2 ? 5 : 3);
    for (var i = 0; i < count; i++) {
      var angle = baseAngle + (i - Math.floor(count / 2)) * 0.2;
      var proj = this.abuelaProjectiles.create(this.abuela.x, this.abuela.y - 10, 'abuela-parasite');
      if (!proj || !proj.body) continue;
      proj.setScale(0.2).setDepth(7);
      proj.body.setAllowGravity(false);
      var projSpeed = this.abuelaPhase >= 3 ? 280 : (this.abuelaPhase === 2 ? 240 : 170);
      proj.setVelocityX(Math.cos(angle) * projSpeed);
      proj.setVelocityY(Math.sin(angle) * projSpeed);
    }
    this.cameras.main.shake(50, 0.003);
  }

  bulletHitBoss(bullet, boss) {
    if (this.bossDefeated || !bullet || !bullet.active) return;
    bullet.destroy();
    this.abuelaHP--;
    console.log('[BOSS HP] hp=' + this.abuelaHP);
    this.updateBossHPBar();

    if (this.abuela && this.abuela.active) {
      this.abuela.setTint(0xffffff);
      this.time.delayedCall(120, () => { if (this.abuela && this.abuela.active) this.abuela.clearTint(); });
    }

    // Phase 2 at 50%
    if (this.abuelaPhase === 1 && this.abuelaHP <= Math.floor(this.abuelaMaxHP / 2)) {
      this.abuelaPhase = 2;
      console.log('[BOSS PHASE 2]');
      this.cameras.main.shake(300, 0.008);
      if (this.abuela && this.abuela.active) this.abuela.setTexture('abuela-parasite');
      this.time.delayedCall(500, () => {
        if (this.abuela && this.abuela.active) this.abuela.setTexture('abuela-idle');
      });
    }

    // Phase 3 at 25%
    if (this.abuelaPhase === 2 && this.abuelaHP <= Math.floor(this.abuelaMaxHP / 4)) {
      this.abuelaPhase = 3;
      console.log('[BOSS PHASE 3]');
      this.cameras.main.shake(400, 0.012);
    }

    if (this.abuelaHP <= 0) {
      console.log('[BOSS ZERO HP]');
      console.log('[CALL defeatBoss]');
      this.defeatBoss();
    }
  }

  bossHitPlayer(player, boss) {
    if (this.gameOver || this.bossDefeated || this.time.now < this.damageCooldownUntil) return;
    this.applyDamage(1);
  }

  updateBossHPBar() {
    var ratio = Math.max(0, this.abuelaHP / this.abuelaMaxHP);
    this.bossHPBar.width = 200 * ratio;
    this.bossHPBar.fillColor = ratio > 0.5 ? 0xff44ff : 0xff2222;
  }

  defeatBoss() {
    if (this.bossDefeated) return;
    // ABSOLUTE VICTORY LOCK — nothing can override this
    this.victoryCompleted = true;
    this.bossDefeated = true;
    this.levelCompleted = true;
    this.gameOver = true;
    console.log('[VICTORY LOCK ENABLED]');
    console.log('[ENTER defeatBoss]');
    console.log('[GRANDMA DEFEATED]');

    // --- STOP EVERYTHING ---
    console.log('[STOP ALL ENEMIES]');
    this.time.removeAllEvents();

    // Disable boss
    if (this.abuela && this.abuela.active) {
      this.abuela.clearTint();
      this.abuela.setTexture('abuela-idle');
      if (this.abuela.body) this.abuela.body.enable = false;
    }

    // Destroy all enemy projectiles
    if (this.abuelaProjectiles) this.abuelaProjectiles.clear(true, true);
    if (this.batProjectiles) this.batProjectiles.clear(true, true);

    // Disable all bats
    var batList = this.bats.getChildren().slice();
    for (var i = 0; i < batList.length; i++) {
      if (batList[i] && batList[i].active) {
        if (batList[i].body) batList[i].body.enable = false;
        batList[i].setAlpha(0.3);
      }
    }

    // Disable all aliens
    var alienList = this.aliens.getChildren().slice();
    for (var j = 0; j < alienList.length; j++) {
      if (alienList[j] && alienList[j].active) {
        if (alienList[j].body) alienList[j].body.enable = false;
        alienList[j].setAlpha(0.3);
      }
    }

    // Make player invincible (set cooldown far into future)
    this.damageCooldownUntil = this.time.now + 999999;
    if (this.player && this.player.active) {
      this.player.clearTint();
      this.player.setAlpha(1);
    }

    // Stop music
    MusicManager.stop();

    // Boss HP bar
    this.bossHPBar.setVisible(false);
    this.bossNameText.setText('Abuela Libre!');
    this.bossNameText.setStyle({ fill: '#44ff88' });

    this.completeLevel();
  }

  completeLevel() {
    if (this.levelCompleted) return;
    this.levelCompleted = true;
    this.gameOver = true;
    console.log('[LEVEL4 COMPLETE]');
    console.log('[GAME COMPLETE]');

    this.time.removeAllEvents();
    if (this.player && this.player.body) {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }

    this.add.text(400, 180, 'Rescataste a la Abuela!', {
      font: '20px monospace', fill: '#ff88ff',
      backgroundColor: '#000000cc', padding: { x: 12, y: 8 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(500);

    this.add.text(400, 220, 'UN BOLILLO PAL SUSTO - FIN', {
      font: '14px monospace', fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(500);

    MusicManager.play(this, 'victoria', { volume: 0.7, loop: false, fadeIn: 500 });

    console.log('[STARTING VICTORY]');
    var self = this;
    setTimeout(function() {
      console.log('[START FINAL SCENE]');
      self.scene.start('FinalScene');
    }, 2000);
  }

  applyDamage(amount) {
    if (this.bossDefeated) return;
    if (this.time.now < this.damageCooldownUntil) return;
    this.damageCooldownUntil = this.time.now + 1500;
    this.playerHP -= amount;
    this.isHurt = true;
    if (this.player && this.player.active) {
      this.player.setTint(0xff0000);
      this.player.setAlpha(0.6);
    }
    this.cameras.main.shake(80, 0.005);
    this.updatePlayerHUD();

    this.time.delayedCall(1500, () => {
      if (this.gameOver) return;
      if (this.player && this.player.active) {
        this.player.clearTint();
        this.player.setAlpha(1);
      }
      this.isHurt = false;
    });

    if (this.playerHP <= 0) {
      // VICTORY LOCK: if boss was defeated, player cannot lose
      if (this.victoryCompleted || this.bossDefeated) {
        console.log('[GAMEOVER BLOCKED] victory takes priority');
        this.playerHP = 1;
        return;
      }
      this.gameOver = true;
      MusicManager.stop();
      this.time.removeAllEvents();
      this.add.text(400, 200, 'GAME OVER', {
        font: '28px monospace', fill: '#ff4444', stroke: '#000', strokeThickness: 4
      }).setOrigin(0.5).setScrollFactor(0).setDepth(500);
      var self = this;
      setTimeout(function() {
        if (self.victoryCompleted) return;
        self.scene.start('GameOverScene', { score: self.score });
      }, 2000);
    }
  }

  updatePlayerHUD() {
    var ratio = Math.max(0, this.playerHP / this.playerMaxHP);
    this.hpBar.width = 120 * ratio;
    this.hpBar.fillColor = ratio > 0.5 ? 0x44ff44 : (ratio > 0.25 ? 0xffcc00 : 0xff2222);
  }
}
