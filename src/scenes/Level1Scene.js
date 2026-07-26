class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
  }

  create() {
    // --- WORLD SETUP ---
    const worldWidth = 4800;
    const worldHeight = 450;
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.gravity.y = 900;

    // --- BACKGROUND ---
    // Use tileSprite at viewport size, pinned to camera. 
    // tileScale shrinks the source image so it tiles at a reasonable proportion.
    this.bg = this.add.tileSprite(0, 0, 800, 450, 'bg-calle')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-1);
    this.bg.tileScaleX = 450 / this.textures.get('bg-calle').getSourceImage().height;
    this.bg.tileScaleY = this.bg.tileScaleX;

    // --- PLATFORMS ---
    this.platforms = this.physics.add.staticGroup();

    // Ground - tiled texture
    this.groundTile = this.add.tileSprite(worldWidth / 2, worldHeight - 20, worldWidth, 40, 'tile-ground')
      .setDepth(0);
    var groundBody = this.add.zone(worldWidth / 2, worldHeight - 20, worldWidth, 40);
    this.physics.add.existing(groundBody, true);
    this.platforms.add(groundBody);

    // Floating platforms
    this.createPlatform(300, 340, 180, 24);
    this.createPlatform(550, 280, 160, 24);
    this.createPlatform(800, 320, 180, 24);
    this.createPlatform(1100, 260, 170, 24);
    this.createPlatform(1400, 340, 190, 24);
    this.createPlatform(1700, 290, 170, 24);
    this.createPlatform(2000, 330, 180, 24);
    this.createPlatform(2300, 270, 160, 24);
    this.createPlatform(2600, 320, 190, 24);
    this.createPlatform(2900, 280, 170, 24);
    this.createPlatform(3200, 340, 180, 24);
    this.createPlatform(3500, 260, 170, 24);
    this.createPlatform(3800, 310, 180, 24);
    this.createPlatform(4100, 280, 160, 24);
    // No platform in boss arena - open space for combat

    // --- PLAYER ---
    this.player = this.physics.add.sprite(100, worldHeight - 100, 'player-idle');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.35);
    this.player.body.setSize(this.player.width * 0.45, this.player.height * 0.75);
    this.player.body.setOffset(this.player.width * 0.28, this.player.height * 0.25);
    this.player.setDepth(10);

    // --- ANIMATIONS ---
    if (!this.anims.exists('idle')) {
      this.anims.create({
        key: 'idle',
        frames: [{ key: 'player-idle' }],
        frameRate: 1,
        repeat: -1
      });
      this.anims.create({
        key: 'run',
        frames: [
          { key: 'player-run1' },
          { key: 'player-run2' },
          { key: 'player-run3' }
        ],
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'jump',
        frames: [{ key: 'player-jump' }],
        frameRate: 1,
        repeat: 0
      });
      this.anims.create({
        key: 'attack',
        frames: [
          { key: 'player-attack1' },
          { key: 'player-attack2' }
        ],
        frameRate: 8,
        repeat: 0
      });
      this.anims.create({
        key: 'rata-run',
        frames: [
          { key: 'rata-run1' },
          { key: 'rata-run2' },
          { key: 'rata-run3' },
          { key: 'rata-run4' }
        ],
        frameRate: 6,
        repeat: -1
      });
      this.anims.create({
        key: 'tamalero-idle',
        frames: [
          { key: 'tamalero-idle1' },
          { key: 'tamalero-idle2' },
          { key: 'tamalero-idle3' }
        ],
        frameRate: 4,
        repeat: -1
      });
      this.anims.create({
        key: 'tamalero-run',
        frames: [
          { key: 'tamalero-run1' },
          { key: 'tamalero-run2' },
          { key: 'tamalero-run3' },
          { key: 'tamalero-run4' }
        ],
        frameRate: 6,
        repeat: -1
      });
      this.anims.create({
        key: 'tamalero-attack',
        frames: [
          { key: 'tamalero-atk1' },
          { key: 'tamalero-atk2' },
          { key: 'tamalero-atk3' }
        ],
        frameRate: 6,
        repeat: 0
      });
    }

    // --- ENEMIES ---
    this.enemies = this.physics.add.group();
    this.spawnRata(600, worldHeight - 60, 500, 750);
    this.spawnRata(1200, worldHeight - 60, 1100, 1400);
    this.spawnRata(1900, worldHeight - 60, 1800, 2100);
    this.spawnRata(2500, worldHeight - 60, 2400, 2700);
    this.spawnRata(3300, worldHeight - 60, 3200, 3500);
    this.spawnRata(4000, worldHeight - 60, 3900, 4200);

    // --- COLLECTIBLES ---
    this.collectibles = this.physics.add.staticGroup();
    this.spawnCollectible(350, 300, 'dulce');
    this.spawnCollectible(600, 240, 'chicle-poder');
    this.spawnCollectible(900, 280, 'bolillo');
    this.spawnCollectible(1200, 220, 'dulce');
    this.spawnCollectible(1500, 300, 'chicle-poder');
    this.spawnCollectible(1800, 250, 'bolillo');
    this.spawnCollectible(2100, 290, 'dulce');
    this.spawnCollectible(2400, 230, 'chicle-poder');
    this.spawnCollectible(2700, 280, 'bolillo');
    this.spawnCollectible(3000, 240, 'dulce');
    this.spawnCollectible(3300, 300, 'chicle-poder');
    this.spawnCollectible(3600, 220, 'bolillo');
    this.spawnCollectible(3900, 270, 'dulce');
    this.spawnCollectible(4200, 240, 'chicle-poder');
    this.spawnCollectible(4500, 290, 'bolillo');

    // --- COLLISIONS ---
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);

    // --- BOLILLO PROJECTILES (must be created before boss and overlap registrations) ---
    this.bolilloProjectiles = this.physics.add.group();

    // --- BOSS: EL TAMALERO ---
    this.bossDefeated = false;
    this.bossActive = false;
    this.createTamalero(worldWidth, worldHeight);

    // Bolillo projectile collisions (bolilloProjectiles now exists)
    this.physics.add.overlap(this.bolilloProjectiles, this.enemies, this.bolilloHitEnemy, null, this);

    // --- BOSS ARENA WALL (blocks META until boss defeated) ---
    // Invisible physics wall - no visible rectangle that confuses players
    this.bossWall = this.add.zone(4700, worldHeight - 80, 20, 160);
    this.physics.add.existing(this.bossWall, true);
    this.physics.add.collider(this.player, this.bossWall);

    // --- CAMERA ---
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(50, 50);

    // --- INPUT ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKeyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.attackKeyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    // --- STATE ---
    this.isAttacking = false;
    this.facingRight = true;
    this.score = 0;
    this.playerHP = 5;
    this.isHurt = false;
    this.damageCooldownUntil = 0; // timestamp-based invulnerability

    // --- POWER-UP STATE ---
    this.playerMaxHP = 5;
    this.jumpForce = -400;
    this.jumpForceBase = -400;
    this.powerMode = false;
    this.powerUpTimers = {}; // track active timers by type

    // Bolillo projectile inventory
    this.bolilloAmmo = 0;

    // Double jump (active during Super Jump power-up)
    this.canDoubleJump = false;
    this.hasDoubleJumped = false;
    this.lastOnGround = 0;

    // Attack animation complete
    this.player.on('animationcomplete-attack', () => {
      this.isAttacking = false;
    });

    // Safety: max attack duration to prevent permanent freeze
    this.attackStartTime = 0;

    // --- UI ---
    this.scoreText = this.add.text(16, 16, 'Puntos: 0', {
      font: '14px monospace',
      fill: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 6, y: 3 }
    }).setScrollFactor(0).setDepth(100);

    // Health bar background
    this.hpBarBg = this.add.rectangle(560, 16, 140, 16, 0x333333, 0.8)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(99);
    this.hpBarBg.setStrokeStyle(1, 0xffffff);
    // Health bar fill
    this.hpBarFill = this.add.rectangle(561, 17, 138, 14, 0x44ff44)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    // Health bar label
    this.add.text(540, 17, '\u2764', { font: '12px sans-serif', fill: '#ff4444' })
      .setScrollFactor(0).setDepth(100);

    // Bolillo ammo display
    this.ammoText = this.add.text(16, 36, '', {
      font: '12px monospace',
      fill: '#ffaa44',
      backgroundColor: '#00000088',
      padding: { x: 4, y: 2 }
    }).setScrollFactor(0).setDepth(100);

    // Power mode indicator
    this.powerText = this.add.text(400, 36, '', {
      font: '11px monospace',
      fill: '#ff44ff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

    this.hpText = this.add.text(705, 17, '5/5', { font: '10px monospace', fill: '#fff' })
      .setScrollFactor(0).setDepth(100);

    this.add.text(16, 430, '\u2190 \u2192 Mover | \u2191 Saltar | A/X Atacar', {
      font: '11px monospace',
      fill: '#cccccc',
      backgroundColor: '#00000088',
      padding: { x: 6, y: 3 }
    }).setScrollFactor(0).setDepth(100);

    // --- WIN ZONE (end of level) ---
    const winZone = this.add.rectangle(worldWidth - 50, worldHeight - 60, 40, 80, 0x00ff00, 0.5);
    this.physics.add.existing(winZone, true);
    this.physics.add.overlap(this.player, winZone, this.winLevel, null, this);

    // Win flag marker
    this.add.text(worldWidth - 70, worldHeight - 110, 'META', {
      font: '12px monospace',
      fill: '#00ff00'
    });

    // --- GAME OVER FLAG ---
    this.gameOver = false;

    // --- TOUCH CONTROLS ---
    this.touchControls = { left: false, right: false, jump: false, attack: false };
    this.createTouchControls();
  }

  update() {
    if (this.gameOver) return;

    // Parallax
    this.bg.tilePositionX = this.cameras.main.scrollX * 0.3;

    // Update enemies patrol (safe copy to avoid destroy-during-iterate)
    var enemyList = this.enemies.getChildren().slice();
    for (var ei = 0; ei < enemyList.length; ei++) {
      var enemy = enemyList[ei];
      if (enemy.active) {
        if (enemy.x <= enemy.getData('minX')) {
          enemy.setVelocityX(60);
          enemy.setFlipX(false);
        } else if (enemy.x >= enemy.getData('maxX')) {
          enemy.setVelocityX(-60);
          enemy.setFlipX(true);
        }
      }
    }

    // Update boss
    this.updateTamalero();

    if (this.isAttacking) {
      // Safety: force-reset if attack state exceeds 800ms (animation may have been interrupted)
      if (this.time.now - this.attackStartTime > 800) {
        this.isAttacking = false;
      }
      return;
    }

    const speed = 220;
    const onGround = this.player.body.touching.down || this.player.body.blocked.down;

    // Coyote time: allow jump for a few frames after leaving ground
    if (onGround) {
      this.lastOnGround = this.time.now;
    }
    var canJump = onGround || (this.time.now - this.lastOnGround < 100);

    // Attack (X or A key, or touch)
    const attackPressed = Phaser.Input.Keyboard.JustDown(this.attackKeyX) ||
                          Phaser.Input.Keyboard.JustDown(this.attackKeyA) ||
                          this.touchControls.attack;

    if (attackPressed) {
      if (onGround) {
        // Ground attack - melee
        this.isAttacking = true;
        this.attackStartTime = this.time.now;
        this.touchControls.attack = false;
        this.player.setVelocityX(0);
        this.player.anims.play('attack', true);
        this.attackEnemies();
        // Also throw bolillo if we have ammo
        if (this.bolilloAmmo > 0) {
          this.throwBolillo();
        }
        return;
      } else if (this.bolilloAmmo > 0) {
        // Air attack - throw bolillo projectile
        this.touchControls.attack = false;
        this.throwBolillo();
      }
    }

    // Movement (keyboard or touch)
    const moveLeft = this.cursors.left.isDown || this.touchControls.left;
    const moveRight = this.cursors.right.isDown || this.touchControls.right;

    if (moveLeft) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
      this.facingRight = false;
      if (onGround) this.player.anims.play('run', true);
    } else if (moveRight) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
      this.facingRight = true;
      if (onGround) this.player.anims.play('run', true);
    } else {
      this.player.setVelocityX(0);
      if (onGround) this.player.anims.play('idle', true);
    }

    // Jump (keyboard or touch) - uses coyote time
    const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || this.touchControls.jump;
    if (jumpJustPressed && canJump) {
      this.player.setVelocityY(this.jumpForce);
      this.touchControls.jump = false;
      this.hasDoubleJumped = false;
      this.lastOnGround = 0; // consume coyote time
    } else if (jumpJustPressed && !onGround && this.canDoubleJump && !this.hasDoubleJumped) {
      // Double jump (only during Super Jump power-up)
      this.player.setVelocityY(this.jumpForce * 0.85);
      this.hasDoubleJumped = true;
      this.touchControls.jump = false;
      this.showFloatingText(this.player.x, this.player.y - 30, 'DOBLE!', '#44ffff');
    }

    // Air animation (only if not attacking)
    if (!onGround && !this.isAttacking) {
      this.player.anims.play('jump', true);
    }
  }

  // --- HELPERS ---

  createPlatform(x, y, width, height) {
    // Street-themed visible platforms
    const platform = this.add.rectangle(x, y, width, height, 0x5588aa);
    platform.setStrokeStyle(3, 0xffffff);
    this.platforms.add(platform);
    // Small label to help players see them
    this.add.rectangle(x, y - 2, width - 8, 4, 0x88ccff).setDepth(1);
  }

  spawnRata(x, y, minX, maxX) {
    const rata = this.enemies.create(x, y, 'rata-run1');
    rata.setScale(0.25);
    rata.body.setSize(rata.width * 0.55, rata.height * 0.6);
    rata.body.setOffset(rata.width * 0.22, rata.height * 0.4);
    rata.setCollideWorldBounds(true);
    rata.setVelocityX(-60);
    rata.setFlipX(true);
    rata.setData('minX', minX);
    rata.setData('maxX', maxX);
    rata.anims.play('rata-run', true);
    rata.setDepth(5);
  }

  spawnCollectible(x, y, key) {
    const item = this.collectibles.create(x, y, key);
    item.setScale(0.18);
    item.setDepth(5);
    // Tight pickup hitbox - player must visually touch
    item.body.setSize(item.width * 0.4, item.height * 0.4);
    item.body.setOffset(item.width * 0.3, item.height * 0.3);
  }

  collectItem(player, item) {
    if (this.gameOver) return;
    var itemKey = item.texture.key;
    item.destroy();

    switch (itemKey) {
      case 'dulce':
        // Super Jump power-up
        this.score += 10;
        this.activatePowerUp('superJump', 9000);
        this.showFloatingText(player.x, player.y - 40, 'Super Jump!', '#44ffff');
        break;
      case 'chicle-poder':
        // Power mode - increased attack damage
        this.score += 10;
        this.activatePowerUp('powerMode', 9000);
        this.showFloatingText(player.x, player.y - 40, 'Poder Activado!', '#ff44ff');
        break;
      case 'bolillo':
        // Bolillo = +1 life (heal) + store projectile ammo
        if (this.playerHP < this.playerMaxHP) {
          this.playerHP++;
          this.showFloatingText(player.x, player.y - 40, '+1 Vida', '#44ff44');
        } else {
          this.score += 50;
          this.showFloatingText(player.x, player.y - 40, '+50 Puntos', '#ffff44');
        }
        // Always give 1 bolillo ammo
        this.bolilloAmmo++;
        this.showFloatingText(player.x, player.y - 60, 'Bolillo x' + this.bolilloAmmo, '#ffaa44');
        break;
      default:
        // Unknown collectible = points only
        this.score += 10;
        this.showFloatingText(player.x, player.y - 40, '+10', '#ffffff');
        break;
    }

    this.scoreText.setText('Puntos: ' + this.score);
    this.updateHUD();

    // Collect feedback: scale pulse
    this.tweens.add({
      targets: player,
      scaleX: 0.38,
      scaleY: 0.38,
      duration: 80,
      yoyo: true,
      ease: 'Quad.easeOut',
      onComplete: () => { player.setScale(0.35); }
    });
  }

  hitEnemy(player, enemy) {
    if (this.gameOver) return;
    if (this.time.now < this.damageCooldownUntil) return;

    // Stomp conditions (ALL must be true):
    const playerBottom = player.y + (player.body.height * player.scaleY) / 2;
    const enemyCenter = enemy.y;
    const isStomping = player.body.velocity.y > 0 &&
                       enemy.body.touching.up &&
                       playerBottom < enemyCenter;

    if (isStomping) {
      enemy.destroy();
      player.setVelocityY(-200);
      this.score += 25;
      this.scoreText.setText('Puntos: ' + this.score);
    } else {
      // Lateral/any contact = damage, NO points
      this.applyDamage(player, 1, player.x < enemy.x ? -1 : 1, 200, -150, 0xff0000);
    }
  }

  attackEnemies() {
    var attackRange = this.powerMode ? 150 : 110;
    this.enemies.getChildren().forEach((enemy) => {
      if (!enemy.active) return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
      const inFront = this.facingRight ? (enemy.x > this.player.x) : (enemy.x < this.player.x);
      if (dist < attackRange && inFront) {
        enemy.destroy();
        this.score += this.powerMode ? 50 : 25;
        this.scoreText.setText('Puntos: ' + this.score);
        if (this.powerMode) {
          this.showFloatingText(enemy.x, enemy.y - 20, 'x2!', '#ff44ff');
        }
      }
    });

    // Also check boss damage
    if (this.bossActive && !this.bossDefeated && this.tamalero && this.tamalero.active) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.tamalero.x, this.tamalero.y);
      const inFront = this.facingRight ? (this.tamalero.x > this.player.x) : (this.tamalero.x < this.player.x);
      var bossRange = this.powerMode ? 150 : 120;
      if (dist < bossRange && inFront) {
        this.damageTamalero();
      }
    }
  }

  winLevel() {
    if (this.gameOver) return;
    // Prevent winning without defeating boss
    if (!this.bossDefeated) return;
    this.gameOver = true;
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);
    this.showGameOverScreen(true);
  }

  showGameOverScreen(won) {
    // Brief pause then transition
    this.time.delayedCall(800, () => {
      if (won) {
        // Level 1 complete -> advance to Level 2 (Zumba)
        this.scene.start('ZumbaScene', { score: this.score });
      } else {
        this.scene.start('GameOverScene', { score: this.score });
      }
    });
  }

  // --- BOSS: EL TAMALERO ---

  createTamalero(worldWidth, worldHeight) {
    // Boss arena position: between x=4400 and META
    const bossX = 4550;
    const bossY = worldHeight - 100;

    // Arena boundaries for boss containment
    this.bossArenaMinX = 4380;
    this.bossArenaMaxX = 4690;

    this.tamalero = this.physics.add.sprite(bossX, bossY, 'tamalero-idle1');
    this.tamalero.setScale(0.55);
    this.tamalero.setCollideWorldBounds(true);
    this.tamalero.body.setSize(this.tamalero.width * 0.5, this.tamalero.height * 0.7);
    this.tamalero.body.setOffset(this.tamalero.width * 0.25, this.tamalero.height * 0.3);
    this.tamalero.setDepth(10);
    this.tamalero.setFlipX(true);

    // Boss state
    this.tamaleroHP = 5;
    this.tamaleroMaxHP = 5;
    this.tamaleroCooldown = 0;
    this.tamaleroAttacking = false;
    this.tamaleroHurt = false;
    this.bossIntroCompleted = false;
    this.bossIntroActive = false;

    // Phase 2 state
    this.bossPhase = 1;
    this.bossEnraged = false;
    this.bossTransforming = false;

    // Projectiles group
    this.tamalProjectiles = this.physics.add.group();

    // Collisions - use OVERLAP for boss to prevent physics wedge
    this.physics.add.collider(this.tamalero, this.platforms);
    this.physics.add.overlap(this.player, this.tamalero, this.hitByTamalero, null, this);
    this.physics.add.overlap(this.player, this.tamalProjectiles, this.hitByTamal, null, this);
    this.physics.add.overlap(this.bolilloProjectiles, this.tamalero, this.bolilloHitBossOverlap, null, this);

    // Boss HP bar (hidden initially)
    this.bossHPBar = this.add.graphics().setScrollFactor(0).setDepth(100);
    this.bossNameText = this.add.text(400, 50, 'EL TAMALERO', {
      font: '14px monospace',
      fill: '#ff8800',
      backgroundColor: '#00000088',
      padding: { x: 8, y: 3 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
    this.bossNameText.setVisible(false);
    this.bossHPBar.setVisible(false);

    // Start idle
    this.tamalero.anims.play('tamalero-idle', true);
  }

  updateTamalero() {
    if (this.bossDefeated || !this.tamalero || !this.tamalero.active) return;

    var distToPlayer = Math.abs(this.player.x - this.tamalero.x);

    // Boss activation — show UI, grant brief invulnerability, NO input freeze
    if (!this.bossActive && !this.bossIntroCompleted && distToPlayer < 300) {
      this.bossActive = true;
      this.bossIntroCompleted = true;
      this.bossNameText.setVisible(true);
      this.bossHPBar.setVisible(true);
      this.drawBossHP();
      this.damageCooldownUntil = this.time.now + 800;
      return;
    }

    if (!this.bossActive) return;

    // Contain boss in arena
    if (this.tamalero.x < this.bossArenaMinX) {
      this.tamalero.x = this.bossArenaMinX;
      this.tamalero.setVelocityX(0);
    } else if (this.tamalero.x > this.bossArenaMaxX) {
      this.tamalero.x = this.bossArenaMaxX;
      this.tamalero.setVelocityX(0);
    }

    // Cooldown
    if (this.tamaleroCooldown > 0) {
      this.tamaleroCooldown--;
    }

    // Safety resets
    if (this.tamaleroAttacking && this.time.now > (this._bossAttackStart || 0) + 1000) {
      this.tamaleroAttacking = false;
    }
    if (this.tamaleroHurt && this.time.now > (this._bossHurtStart || 0) + 500) {
      this.tamaleroHurt = false;
    }
    if (this.bossTransforming && this.time.now > (this._bossTransformStart || 0) + 3500) {
      this.bossTransforming = false;
      this.tamaleroAttacking = false;
    }

    if (this.tamaleroAttacking || this.tamaleroHurt || this.bossTransforming) return;

    // Face player
    this.tamalero.setFlipX(this.player.x < this.tamalero.x);

    // AI behavior
    var moveSpeed = this.bossEnraged ? 112 : 80;
    if (distToPlayer < 100) {
      this.tamalero.setVelocityX(0);
      if (this.tamaleroCooldown <= 0) {
        this.tamaleroMelee();
      }
    } else if (distToPlayer < (this.bossEnraged ? 400 : 300)) {
      var dir = this.player.x < this.tamalero.x ? -1 : 1;
      this.tamalero.setVelocityX(dir * moveSpeed);
      this.tamalero.anims.play('tamalero-run', true);
      if (this.tamaleroCooldown <= 0 && distToPlayer > 150) {
        this.tamaleroAttack();
      }
    } else {
      this.tamalero.setVelocityX(0);
      this.tamalero.anims.play('tamalero-idle', true);
    }

    // Cleanup projectiles
    var projList = this.tamalProjectiles.getChildren().slice();
    for (var pi = 0; pi < projList.length; pi++) {
      var proj = projList[pi];
      if (proj.active && (proj.x < 0 || proj.x > 5000 || proj.y > 500)) {
        proj.destroy();
      }
    }
  }
  tamaleroMelee() {
    this.tamaleroAttacking = true;
    this._bossAttackStart = this.time.now;
    this.tamaleroCooldown = this.bossEnraged ? 105 : 150;
    this.tamalero.setVelocityX(0);
    this.tamalero.anims.play('tamalero-attack', true);

    this.time.delayedCall(600, () => {
      this.tamaleroAttacking = false;
    });
  }

  tamaleroAttack() {
    this.tamaleroAttacking = true;
    this._bossAttackStart = this.time.now;
    this.tamaleroCooldown = this.bossEnraged ? 140 : 200;
    this.tamalero.setVelocityX(0);
    this.tamalero.anims.play('tamalero-attack', true);

    // Launch projectile mid-animation
    this.time.delayedCall(300, () => {
      if (!this.tamalero || !this.tamalero.active || this.bossDefeated) return;
      try {
        const dir = this.player.x < this.tamalero.x ? -1 : 1;
        var tamalSpeed = this.bossEnraged ? 312 : 250;
        const tamal = this.tamalProjectiles.create(
          this.tamalero.x + dir * 30,
          this.tamalero.y - 10,
          'tamal-projectile'
        );
        if (!tamal) return;
        tamal.setScale(0.15);
        tamal.body.setAllowGravity(false);
        tamal.setVelocityX(dir * tamalSpeed);
        tamal.setDepth(8);

        this.time.delayedCall(3000, () => {
          if (tamal && tamal.active) tamal.destroy();
        });
      } catch (e) {
        // Prevent projectile creation errors from crashing the scene
      }
    });

    // Reset attacking flag after animation duration (fallback)
    this.time.delayedCall(500, () => {
      this.tamaleroAttacking = false;
    });
  }

  damageTamalero() {
    if (this.tamaleroHurt || this.bossDefeated) return;

    this.tamaleroHP--;
    this.tamaleroHurt = true;
    this._bossHurtStart = this.time.now;
    this.drawBossHP();

    // Check phase 2 trigger (50% HP, one-time only)
    if (!this.bossEnraged && this.tamaleroHP <= Math.floor(this.tamaleroMaxHP * 0.5) && this.tamaleroHP > 0) {
      this.enrageTamalero();
    }

    // Enhanced boss hit feedback
    this.tamalero.setTint(0xffffff);
    this.tamalero.setVelocityX(0);
    this.cameras.main.shake(80, 0.005);
    this.showFloatingText(this.tamalero.x, this.tamalero.y - 50, '-1', '#ff4444');

    // Knockback boss slightly
    const knockDir = this.player.x < this.tamalero.x ? 1 : -1;
    this.tamalero.setVelocityX(knockDir * 100);

    this.time.delayedCall(200, () => {
      if (this.tamalero && this.tamalero.active) {
        if (this.bossEnraged) {
          this.tamalero.setTint(0xff2200);
        } else {
          this.tamalero.clearTint();
        }
      }
      this.tamaleroHurt = false;
    });

    if (this.tamaleroHP <= 0) {
      this.defeatTamalero();
    }
  }

  enrageTamalero() {
    // Phase 2 transformation - ONE TIME ONLY
    this.bossEnraged = true;
    this.bossPhase = 2;
    this.bossTransforming = true;
    this._bossTransformStart = this.time.now;

    // Pause boss
    this.tamalero.setVelocityX(0);
    this.tamaleroAttacking = true;
    this._bossAttackStart = this.time.now;

    // Camera shake
    this.cameras.main.shake(500, 0.01);

    // Flash red (subtle)
    this.cameras.main.flash(300, 100, 0, 0, false);

    // Small zoom effect
    this.cameras.main.zoomTo(1.05, 400);

    // Boss visual transformation: scale pulse + red tint
    this.tamalero.setTint(0xff2200);
    this.tweens.add({
      targets: this.tamalero,
      scaleX: 0.62,
      scaleY: 0.62,
      duration: 300,
      yoyo: true,
      ease: 'Quad.easeInOut',
      onComplete: () => {
        this.tamalero.setScale(0.58);
      }
    });

    // Dialogue text sequence
    var dialogText1 = this.add.text(400, 160, '!EL TAMALERO SE ENCHILO!', {
      font: '18px monospace',
      fill: '#ff4400',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(400);

    var dialogText2 = this.add.text(400, 200, '"!!YA ME ENOJE!!"', {
      font: '14px monospace',
      fill: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(400);

    // Fade out dialogue after delay
    this.time.delayedCall(1500, () => {
      if (dialogText1 && dialogText1.active) {
        this.tweens.add({
          targets: [dialogText1, dialogText2],
          alpha: 0,
          duration: 500,
          onComplete: () => {
            dialogText1.destroy();
            dialogText2.destroy();
          }
        });
      }

      // Show second line briefly
      var dialogText3 = this.add.text(400, 180, '"!!AHORA SI!!"', {
        font: '16px monospace',
        fill: '#ff8800',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5).setScrollFactor(0).setDepth(400);

      this.time.delayedCall(1000, () => {
        if (dialogText3 && dialogText3.active) dialogText3.destroy();
      });
    });

    // Reset camera zoom and end transformation after 2.5s
    this.time.delayedCall(2500, () => {
      this.cameras.main.zoomTo(1, 300);
      this.bossTransforming = false;
      this.tamaleroAttacking = false;
      this.tamaleroHurt = false;

      // Hook for boss phase 2 music
      this.playBossPhase2Music();
    });
  }

  playBossPhase2Music() {
  }

  defeatTamalero() {
    this.bossDefeated = true;
    this.bossActive = false;
    this.tamaleroAttacking = false;
    this.tamaleroHurt = false;
    this.bossTransforming = false;
    this.tamalero.setTint(0x444444);
    this.tamalero.anims.stop();
    this.tamalero.setVelocityX(0);
    this.tamalero.body.setEnable(false);

    // Destroy remaining projectiles
    this.tamalProjectiles.clear(true, true);

    // Remove boss wall to allow access to META
    if (this.bossWall) {
      this.bossWall.destroy();
      this.bossWall = null;
    }

    // Victory message with funny dialogue
    const victoryText = this.add.text(400, 180, '!Derrotaste al Tamalero!', {
      font: '20px monospace',
      fill: '#ff8800',
      backgroundColor: '#000000cc',
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

    var deathDialogue = this.add.text(400, 220, '"!Mis tamales...!"', {
      font: '14px monospace',
      fill: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

    // Boss death particles (minimal)
    this.spawnParticles(this.tamalero.x, this.tamalero.y, 3, 0xff4400);

    // Fade out boss sprite and victory text after delay
    this.time.delayedCall(2000, () => {
      if (this.tamalero) {
        this.tamalero.setVisible(false);
      }
      if (victoryText && victoryText.active) victoryText.destroy();
      if (deathDialogue && deathDialogue.active) deathDialogue.destroy();
      if (this.bossNameText) this.bossNameText.setVisible(false);
      if (this.bossHPBar) {
        this.bossHPBar.clear();
        this.bossHPBar.setVisible(false);
      }
    });

    this.score += 100;
    this.scoreText.setText('Puntos: ' + this.score);
  }

  hitByTamalero(player, boss) {
    if (this.gameOver || !this.bossActive || this.bossDefeated) return;
    if (this.time.now < this.damageCooldownUntil) return;

    // Boss contact removes 1 HP
    var knockDir = player.x < boss.x ? -1 : 1;
    this.applyDamage(player, 1, knockDir, 250, -180, 0xff0000);
  }

  hitByTamal(player, tamal) {
    if (this.gameOver) return;
    if (this.time.now < this.damageCooldownUntil) {
      // Still invulnerable, just destroy the projectile
      tamal.destroy();
      return;
    }

    // Determine knockback direction before destroying
    const knockDir = (tamal.body && tamal.body.velocity.x > 0) ? 1 : -1;
    tamal.destroy();

    // Tamal removes exactly 1 HP
    this.applyDamage(player, 1, knockDir, 100, -120, 0xff8800);
  }

  // --- POWER-UP SYSTEM ---

  activatePowerUp(type, duration) {
    // Cancel existing timer for this type (no duplicates)
    if (this.powerUpTimers[type]) {
      this.powerUpTimers[type].remove(false);
      this.powerUpTimers[type] = null;
    }

    // Activate effect
    switch (type) {
      case 'superJump':
        this.jumpForce = -650;
        this.canDoubleJump = true;
        this.player.setTint(0x44ffff);
        this.showFloatingText(this.player.x, this.player.y - 60, 'SUPER JUMP ACTIVADO', '#44ffff');
        break;
      case 'powerMode':
        this.powerMode = true;
        this.player.setTint(0xff44ff);
        // Power mode scale pulse
        this.tweens.add({
          targets: this.player,
          scaleX: 0.4,
          scaleY: 0.4,
          duration: 200,
          yoyo: true,
          ease: 'Quad.easeOut',
          onComplete: () => { this.player.setScale(0.35); }
        });
        break;
    }

    // Schedule deactivation
    this.powerUpTimers[type] = this.time.delayedCall(duration, () => {
      this.deactivatePowerUp(type);
    });
  }

  deactivatePowerUp(type) {
    switch (type) {
      case 'superJump':
        this.jumpForce = this.jumpForceBase;
        this.canDoubleJump = false;
        this.showFloatingText(this.player.x, this.player.y - 40, 'Super Jump OFF', '#888888');
        break;
      case 'powerMode':
        this.powerMode = false;
        this.showFloatingText(this.player.x, this.player.y - 40, 'Poder OFF', '#888888');
        break;
    }

    // Clear tint only if no other power-up is active
    var anyActive = false;
    if (this.jumpForce !== this.jumpForceBase) anyActive = true;
    if (this.powerMode) anyActive = true;
    if (!anyActive && !this.isHurt) {
      this.player.clearTint();
    }

    this.powerUpTimers[type] = null;
  }

  showFloatingText(x, y, message, color) {
    // Limit active floating texts to prevent accumulation
    if (!this._floatingTexts) this._floatingTexts = [];
    // Clean up finished ones
    this._floatingTexts = this._floatingTexts.filter(function(t) { return t.active; });
    // Cap at 5 simultaneous texts
    if (this._floatingTexts.length >= 5) return;

    var text = this.add.text(x, y, message, {
      font: '13px monospace',
      fill: color,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(150);

    this._floatingTexts.push(text);

    this.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1200,
      ease: 'Quad.easeOut',
      onComplete: function() { if (text.active) text.destroy(); }
    });
  }

  throwBolillo() {
    if (this.bolilloAmmo <= 0) return;
    this.bolilloAmmo--;
    this.updateHUD();

    var dir = this.facingRight ? 1 : -1;
    var proj = this.bolilloProjectiles.create(
      this.player.x + dir * 20,
      this.player.y - 5,
      'bolillo'
    );
    proj.setScale(0.12);
    proj.body.setAllowGravity(true);
    proj.body.setBounceY(0.3);
    proj.setVelocityX(dir * 350);
    proj.setVelocityY(-80);
    proj.setDepth(9);

    // Spin animation
    this.tweens.add({
      targets: proj,
      angle: dir * 720,
      duration: 1500,
      ease: 'Linear'
    });

    // Auto-destroy after 3 seconds
    this.time.delayedCall(3000, () => {
      if (proj && proj.active) proj.destroy();
    });

    this.showFloatingText(this.player.x, this.player.y - 50, 'Bolillo!', '#ffaa44');
  }

  bolilloHitEnemy(proj, enemy) {
    // Destroy projectile and enemy
    proj.destroy();
    enemy.destroy();
    this.score += 30;
    this.scoreText.setText('Puntos: ' + this.score);
    this.showFloatingText(enemy.x, enemy.y - 20, '+30', '#ffaa44');
  }

  bolilloHitBoss(proj) {
    if (!this.tamalero || !this.tamalero.active || this.bossDefeated) return;
    var dist = Phaser.Math.Distance.Between(proj.x, proj.y, this.tamalero.x, this.tamalero.y);
    if (dist < 60) {
      proj.destroy();
      this.damageTamalero();
      this.showFloatingText(this.tamalero.x, this.tamalero.y - 30, 'HIT!', '#ffaa44');
      return true;
    }
    return false;
  }

  bolilloHitBossOverlap(proj, boss) {
    if (this.bossDefeated || !this.bossActive || this.tamaleroHurt) return;
    proj.destroy();
    this.damageTamalero();
    this.showFloatingText(boss.x, boss.y - 30, 'HIT!', '#ffaa44');
  }

  updateHUD() {
    // Health bar
    var hpRatio = Math.max(0, this.playerHP / this.playerMaxHP);
    var barColor = hpRatio > 0.5 ? 0x44ff44 : (hpRatio > 0.25 ? 0xffcc00 : 0xff2222);
    this.hpBarFill.width = 138 * hpRatio;
    this.hpBarFill.fillColor = barColor;
    this.hpText.setText(this.playerHP + '/' + this.playerMaxHP);

    // Bolillo ammo
    if (this.bolilloAmmo > 0) {
      this.ammoText.setText('Bolillos: ' + this.bolilloAmmo);
    } else {
      this.ammoText.setText('');
    }

    // Power mode indicator
    if (this.powerMode) {
      this.powerText.setText('PODER ACTIVO');
    } else if (this.canDoubleJump) {
      this.powerText.setText('SUPER JUMP');
    } else {
      this.powerText.setText('');
    }
  }

  spawnParticles(x, y, count, color) {
    for (var i = 0; i < count; i++) {
      (function(scene) {
        var p = scene.add.circle(x, y, Phaser.Math.Between(2, 5), color).setDepth(200);
        scene.tweens.add({
          targets: p,
          x: x + Phaser.Math.Between(-40, 40),
          y: y + Phaser.Math.Between(-40, 20),
          alpha: 0,
          scale: 0,
          duration: Phaser.Math.Between(300, 600),
          ease: 'Quad.easeOut',
          onComplete: function() { if (p && p.active) p.destroy(); }
        });
      })(this);
    }
  }

  applyDamage(player, amount, knockDirX, knockForceX, knockForceY, tintColor) {
    // Double-check cooldown (safety)
    if (this.time.now < this.damageCooldownUntil) return;

    // Set cooldown: 1500ms of invulnerability
    this.damageCooldownUntil = this.time.now + 1500;
    this.isHurt = true;

    this.playerHP -= amount;

    this.playerHP -= amount;
    this.hpText.setText('HP: ' + this.playerHP);
    this.updateHUD();

    // Camera shake on damage
    this.cameras.main.shake(150, 0.008);

    // Knockback
    player.setVelocityX(knockDirX * knockForceX);
    player.setVelocityY(knockForceY);

    // Visual feedback: tint + transparency
    player.setTint(tintColor);
    player.setAlpha(0.6);

    // End invulnerability after 1500ms
    this.time.delayedCall(1500, () => {
      if (this.gameOver) return;
      player.clearTint();
      player.setAlpha(1);
      this.isHurt = false;
    });

    // Check death
    if (this.playerHP <= 0) {
      this.gameOver = true;
      player.setAlpha(1);
      player.setTint(0xff0000);
      player.anims.stop();
      player.setVelocityX(0);
      this.showGameOverScreen(false);
    }
  }

  drawBossHP() {
    this.bossHPBar.clear();
    // Background
    this.bossHPBar.fillStyle(0x333333, 0.8);
    this.bossHPBar.fillRect(300, 65, 200, 14);
    // Health fill
    const hpRatio = Math.max(0, this.tamaleroHP / this.tamaleroMaxHP);
    const color = hpRatio > 0.5 ? 0xff8800 : (hpRatio > 0.25 ? 0xff4400 : 0xff0000);
    this.bossHPBar.fillStyle(color, 1);
    this.bossHPBar.fillRect(300, 65, 200 * hpRatio, 14);
    // Border
    this.bossHPBar.lineStyle(2, 0xffffff, 0.8);
    this.bossHPBar.strokeRect(300, 65, 200, 14);
  }

  createTouchControls() {
    // Only show on touch devices
    if (!this.sys.game.device.input.touch) return;

    const btnAlpha = 0.4;
    const btnSize = 40;
    const margin = 20;
    const y = 400;

    // Left button
    const leftBtn = this.add.circle(margin + btnSize, y, btnSize, 0xffffff, btnAlpha)
      .setScrollFactor(0).setDepth(200).setInteractive();
    this.add.text(margin + btnSize, y, '\u2190', { font: '24px sans-serif', fill: '#000' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);

    leftBtn.on('pointerdown', () => { this.touchControls.left = true; });
    leftBtn.on('pointerup', () => { this.touchControls.left = false; });
    leftBtn.on('pointerout', () => { this.touchControls.left = false; });

    // Right button
    const rightBtn = this.add.circle(margin + btnSize * 3 + 10, y, btnSize, 0xffffff, btnAlpha)
      .setScrollFactor(0).setDepth(200).setInteractive();
    this.add.text(margin + btnSize * 3 + 10, y, '\u2192', { font: '24px sans-serif', fill: '#000' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);

    rightBtn.on('pointerdown', () => { this.touchControls.right = true; });
    rightBtn.on('pointerup', () => { this.touchControls.right = false; });
    rightBtn.on('pointerout', () => { this.touchControls.right = false; });

    // Jump button
    const jumpBtn = this.add.circle(700, y, btnSize, 0x44ff44, btnAlpha)
      .setScrollFactor(0).setDepth(200).setInteractive();
    this.add.text(700, y, '\u2191', { font: '24px sans-serif', fill: '#000' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);

    jumpBtn.on('pointerdown', () => { this.touchControls.jump = true; });
    jumpBtn.on('pointerup', () => { this.touchControls.jump = false; });

    // Attack button
    const atkBtn = this.add.circle(620, y, btnSize, 0xff4444, btnAlpha)
      .setScrollFactor(0).setDepth(200).setInteractive();
    this.add.text(620, y, 'ATK', { font: '14px sans-serif', fill: '#fff' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);

    atkBtn.on('pointerdown', () => { this.touchControls.attack = true; });
    atkBtn.on('pointerup', () => { this.touchControls.attack = false; });
  }
}
