class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 30);

    const loadingText = this.add.text(width / 2, height / 2 - 40, 'Cargando...', {
      font: '18px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff88, 1);
      progressBar.fillRect(width / 2 - 155, height / 2 - 10, 310 * value, 20);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // --- PLAYER SPRITES ---
    this.load.image('player-idle', 'chicles/chicles/idle/Idle_1.png');
    this.load.image('player-run1', 'chicles/chicles/run/Run_1.png');
    this.load.image('player-run2', 'chicles/chicles/run/Run_2.png');
    this.load.image('player-run3', 'chicles/chicles/run/Run_3.png');
    this.load.image('player-jump', 'chicles/chicles/jump/Jump.png');
    this.load.image('player-attack1', 'chicles/chicles/ataque_principal/Ataque_principal.png');
    this.load.image('player-attack2', 'chicles/chicles/ataque_principal/Ataque_principal_2.png');

    // --- ENEMIES ---
    this.load.image('rata-idle1', 'chicles/rata/idle_rata/Idle_rata_1.png');
    this.load.image('rata-idle2', 'chicles/rata/idle_rata/Idle_rata_2.png');
    this.load.image('rata-idle3', 'chicles/rata/idle_rata/Idle_rata_3.png');
    this.load.image('rata-run1', 'chicles/rata/run_rata/Rata_corriendo_1.png');
    this.load.image('rata-run2', 'chicles/rata/run_rata/Rata_corriendo_2.png');
    this.load.image('rata-run3', 'chicles/rata/run_rata/Rata_corriendo_3.png');
    this.load.image('rata-run4', 'chicles/rata/run_rata/Rata_corriendo_4.png');

    this.load.image('perro1', 'chicles/perro/Perro_1.png');
    this.load.image('perro2', 'chicles/perro/Perro_2.png');
    this.load.image('perro3', 'chicles/perro/Perro_3.png');
    this.load.image('perro4', 'chicles/perro/Perro_4.png');
    this.load.image('perro5', 'chicles/perro/Perro_5.png');

    // --- BOSS: TAMALERO ---
    this.load.image('tamalero-idle1', 'chicles/tamalero/idle_tamalero/Idle_tamalero_1.png');
    this.load.image('tamalero-idle2', 'chicles/tamalero/idle_tamalero/Idle_tamalero_2.png');
    this.load.image('tamalero-idle3', 'chicles/tamalero/idle_tamalero/Idle_tamalero_3.png');
    this.load.image('tamalero-run1', 'chicles/tamalero/run_tamalero/Run_tamalero_1.png');
    this.load.image('tamalero-run2', 'chicles/tamalero/run_tamalero/Run_tamalero_2.png');
    this.load.image('tamalero-run3', 'chicles/tamalero/run_tamalero/Run_tamalero_3.png');
    this.load.image('tamalero-run4', 'chicles/tamalero/run_tamalero/Run_tamalero_4.png');
    this.load.image('tamalero-atk1', 'chicles/tamalero/ataque_tamal/Ataque_tamal_1.png');
    this.load.image('tamalero-atk2', 'chicles/tamalero/ataque_tamal/Ataque_tamal_2.png');
    this.load.image('tamalero-atk3', 'chicles/tamalero/ataque_tamal/Ataque_tamal_3.png');
    this.load.image('tamal-projectile', 'chicles/tamalero/projectil_tamal_pasado/Tamal_pasado.png');

    // --- COLLECTIBLES ---
    this.load.image('chicle-poder', 'chicles/poderes/chicle_poder/chicle_poder.png');
    this.load.image('bolillo', 'chicles/poderes/bolillo_pal_susto/Bolillo_pal_susto.png');
    this.load.image('dulce', 'chicles/poderes/dulce/Dulce.png');
    this.load.image('vida-icon', 'chicles/poderes/vidas/Vida_1.png');

    // --- BACKGROUNDS ---
    this.load.image('bg-calle', 'chicles/ui/tamalero_nivel_1/tamalero_nivel_1.jpg');
    this.load.image('tile-ground', 'chicles/ui/tamalero_nivel_1/tile_tamalero.jpg');

    // --- UI / BUTTONS ---
    this.load.image('btn-play', 'chicles/botones/play/Play.png');
    this.load.image('btn-pausa', 'chicles/botones/boton_pausa/Boton__pausa.png');
    this.load.image('btn-como-jugar', 'chicles/botones/boton_como_jugar/Como_Jugar.png');
    this.load.image('btn-creditos', 'chicles/botones/boton_creditos/Creditos.png');
    this.load.image('btn-salir', 'chicles/botones/boton_salir/Boton_salir.png');
    this.load.image('btn-reiniciar', 'chicles/botones/boton_reiniciar/Boton_reiniciar.png');
    this.load.image('logo', 'chicles/Logo.png');
    this.load.image('portada', 'chicles/portada.jpg');
    this.load.image('creditos', 'chicles/creditos_chicles.png');

    // --- LEVEL 2: ZUMBA ---

    // --- AUDIO ---
    this.load.audio('intro', 'chicles/sound/intro.mp3');
    this.load.audio('musica_juego', 'chicles/sound/musica_juego.mp3');
    this.load.audio('pelea_tamalero', 'chicles/sound/pelea_tamalero.mp3');
    this.load.audio('pelea_cucaracha', 'chicles/sound/pelea_cucaracha.mp3');
    this.load.audio('pelea_zumba', 'chicles/sound/pelea_zumba.mp3');
    this.load.audio('victoria', 'chicles/sound/victoria.mp3');
    this.load.audio('victoria_zumba', 'chicles/sound/victoria_zumba.mp3');
    this.load.audio('pierde', 'chicles/sound/pierde.mp3');
    this.load.audio('ataque_perros', 'chicles/sound/ataque_perros.mp3');
    this.load.audio('microbusero', 'chicles/sound/microbusero.mp3');

    // --- LEVEL 2: ZUMBA ASSETS ---
    this.load.image('zumba-bg1', 'chicles/ui/zumba_nivel_2/zumba_1.jpg');
    this.load.image('zumba-bg2', 'chicles/ui/zumba_nivel_2/zumba_2.jpg');

    // Chicles dance sprites
    this.load.image('zumba-chicles1', 'chicles/chicles/zumba_chicles/Zumba_1.png');
    this.load.image('zumba-chicles2', 'chicles/chicles/zumba_chicles/Zumba_2.png');
    this.load.image('zumba-chicles3', 'chicles/chicles/zumba_chicles/Zumba_3.png');
    this.load.image('zumba-chicles4', 'chicles/chicles/zumba_chicles/Zumba_4.png');
    this.load.image('zumba-chicles5', 'chicles/chicles/zumba_chicles/Zumba_5.png');
    this.load.image('zumba-chicles6', 'chicles/chicles/zumba_chicles/Zumba_6.png');

    // Instructora Chichi
    this.load.image('zumba-chichi-idle', 'chicles/zumba_chichi/idle_zumba_chichi/Idle_Zumba_chichi.png');
    this.load.image('zumba-chichi1', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_1.png');
    this.load.image('zumba-chichi2', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_2.png');
    this.load.image('zumba-chichi3', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_3.png');
    this.load.image('zumba-chichi4', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_4.png');
    this.load.image('zumba-chichi5', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_5.png');
    this.load.image('zumba-chichi-jump', 'chicles/zumba_chichi/jump_zumba_chichi/Jump_Zumba_chichi.png');
    this.load.image('zumba-chichi-defeat', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_derrota.png');

    // NPCs
    this.load.image('zumba-npc1-1', 'chicles/zumba_chichi/npc_zumba/Npc1_zumba_1.png');
    this.load.image('zumba-npc1-2', 'chicles/zumba_chichi/npc_zumba/Npc1_zumba_2.png');
    this.load.image('zumba-npc1-3', 'chicles/zumba_chichi/npc_zumba/Npc1_zumba_3.png');
    this.load.image('zumba-npc1-4', 'chicles/zumba_chichi/npc_zumba/Npc1_zumba_4.png');
    this.load.image('zumba-npc2-2', 'chicles/zumba_chichi/npc_zumba/Npc2_zumba_2.png');
    this.load.image('zumba-npc2-3', 'chicles/zumba_chichi/npc_zumba/Npc2_zumba_3.png');

    // Dona Cucaracha (enemy)
    this.load.image('zumba-dona', 'chicles/zumba_chichi/dona_cucaracha_podrida/Dona_cucaracha_podrida.png');
  }

  create() {
    this.scene.start('MenuScene');
  }
}
