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

    // --- LEVEL 4: LABORATORIO ALIENÍGENA ---
    this.load.audio('nivel4_metro', 'chicles/sound/nivel_4_metro.mp3');
    this.load.image('lab-bg', 'chicles/ui/metro_nicel_final_4/metro_nicel_final_4.png');
    // Gusano boss
    this.load.image('gusano-idle', 'chicles/gusano/idle_gusano_front/idle_gusano_front.png');
    this.load.image('gusano-bite', 'chicles/gusano/Bite_gusano/Bite_gusano.png');
    this.load.image('gusano-lash', 'chicles/gusano/Lash_attack_gusano/Lash_attack_gusano.png');
    this.load.image('gusano-ichor', 'chicles/gusano/Split_ichor/Split_ichor.png');
    this.load.image('gusano-tentacle', 'chicles/gusano/Tentacle_attack/Tentacle_attack.png');
    // Abuela
    this.load.image('abuela-idle', 'chicles/abuela/Idle_abuela_malicius_1/Idle_abuela_malicius_1.png');
    this.load.image('abuela-chancla1', 'chicles/abuela/Abuela_Aventar_chancla_1/Abuela_Aventar_chancla_1.png');
    this.load.image('abuela-chancla2', 'chicles/abuela/Abuela_Aventar_chancla_2/Abuela_Aventar_chancla_2.png');
    this.load.image('abuela-jump', 'chicles/abuela/jump_abuela/jump_abuela.png');
    this.load.image('abuela-parasite', 'chicles/abuela/parasite_poder/parasite_poder.png');
    // Aliens
    this.load.image('alien2', 'chicles/aliens/Alien_2.png');
    this.load.image('alien3', 'chicles/aliens/Alien_3.png');
    this.load.image('alien-dr', 'chicles/aliens/Alien_dr_1.png');
    // Murcielajolote
    this.load.image('bat-idle', 'chicles/murcielajolote/Idle_murcielajolote/Idle_murcielajolote.png');
    this.load.image('bat-proj', 'chicles/murcielajolote/Projectil_guano/Projectil_guano.png');
    // Vacas
    this.load.image('vaca1', 'chicles/vacas/Vaca_1.png');
    this.load.image('vaca-choco', 'chicles/vacas/Vaca_chocolate.png');
    this.load.image('vaca-fresa', 'chicles/vacas/Vaca_fresa.png');

    // --- LEVEL 2: ZUMBA ASSETS ---

    // --- LEVEL 3: HOYO DEL GUSANO ---
    this.load.audio('nivel3_hoyo', 'chicles/sound/nive_3_hoyo_gusanol.mp3');
    this.load.image('hoyo-bg-far', 'chicles/ui/hoyo_nivel_3/hoyo_nivel_3.jpg');
    this.load.image('hoyo-bg-mid', 'chicles/ui/hoyo_nivel_3/hoyo_nivel_3_1.jpg');
    // Player
    this.load.image('hoyo-idle', 'chicles/chicles/hoyo_nivel_3_caida_chicles/Idle_caida_1.png');
    this.load.image('hoyo-caida1', 'chicles/chicles/hoyo_nivel_3_caida_chicles/caida_1.png');
    this.load.image('hoyo-caida2', 'chicles/chicles/hoyo_nivel_3_caida_chicles/caida_2.png');
    // Gun + bullets
    this.load.image('pistola1', 'chicles/poderes/pistola_chicles/pistola_1.png');
    this.load.image('pistola2', 'chicles/poderes/pistola_chicles/pistola_2.png');
    this.load.image('misil-chicle1', 'chicles/poderes/pistola_chicles/misil_chicle_1.png');
    this.load.image('misil-chicle2', 'chicles/poderes/pistola_chicles/misil_chicle_2.png');
    // Enemies
    this.load.image('cucaracha1', 'chicles/cucaracha/Cucaracha_1.png');
    this.load.image('cucaracha2', 'chicles/cucaracha/Cucaracha__2.png');
    this.load.image('cucaracha3', 'chicles/cucaracha/Cucaracha_3.png');
    this.load.image('dona-podrida', 'chicles/cucaracha/dona_cucaracha_podrida/Dona_cucaracha_podrida.png');
    this.load.image('torta-chorro', 'chicles/cucaracha/projectil_torta_chorro/projectil_torta_chorro.png');
    // Power-ups
    this.load.image('power-agua', 'chicles/poderes/agua_en_bolsita/Agua_en_bolsita_escudo.png');
    this.load.image('power-chicharron', 'chicles/poderes/chicharron_preparado/Chicharron_preparado.png');
    this.load.image('power-chocolate', 'chicles/poderes/chocolate/Chocolate.png');
    this.load.image('power-combo', 'chicles/poderes/special_combo/Special_combo.png');
    this.load.image('power-vida', 'chicles/poderes/numero_de_vidas/Numero_vidas.png');

    // --- LEVEL 2: ZUMBA ASSETS ---

    // --- LEVEL 4: LABORATORIO ALIENÍGENA ---
    this.load.audio('nivel4_metro', 'chicles/sound/nivel_4_metro.mp3');
    this.load.image('lab-bg', 'chicles/ui/metro_nicel_final_4/metro_nicel_final_4.png');
    // Gusano boss
    this.load.image('gusano-idle', 'chicles/gusano/idle_gusano_front/idle_gusano_front.png');
    this.load.image('gusano-bite', 'chicles/gusano/Bite_gusano/Bite_gusano.png');
    this.load.image('gusano-lash', 'chicles/gusano/Lash_attack_gusano/Lash_attack_gusano.png');
    this.load.image('gusano-ichor', 'chicles/gusano/Split_ichor/Split_ichor.png');
    this.load.image('gusano-tentacle', 'chicles/gusano/Tentacle_attack/Tentacle_attack.png');
    // Abuela
    this.load.image('abuela-idle', 'chicles/abuela/Idle_abuela_malicius_1/Idle_abuela_malicius_1.png');
    this.load.image('abuela-chancla1', 'chicles/abuela/Abuela_Aventar_chancla_1/Abuela_Aventar_chancla_1.png');
    this.load.image('abuela-chancla2', 'chicles/abuela/Abuela_Aventar_chancla_2/Abuela_Aventar_chancla_2.png');
    this.load.image('abuela-jump', 'chicles/abuela/jump_abuela/jump_abuela.png');
    this.load.image('abuela-parasite', 'chicles/abuela/parasite_poder/parasite_poder.png');
    // Aliens
    this.load.image('alien2', 'chicles/aliens/Alien_2.png');
    this.load.image('alien3', 'chicles/aliens/Alien_3.png');
    this.load.image('alien-dr', 'chicles/aliens/Alien_dr_1.png');
    // Murcielajolote
    this.load.image('bat-idle', 'chicles/murcielajolote/Idle_murcielajolote/Idle_murcielajolote.png');
    this.load.image('bat-proj', 'chicles/murcielajolote/Projectil_guano/Projectil_guano.png');
    // Vacas
    this.load.image('vaca1', 'chicles/vacas/Vaca_1.png');
    this.load.image('vaca-choco', 'chicles/vacas/Vaca_chocolate.png');
    this.load.image('vaca-fresa', 'chicles/vacas/Vaca_fresa.png');

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
