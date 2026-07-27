class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Loading bar
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 30);
    var loadingText = this.add.text(width / 2, height / 2 - 40, 'Cargando...', {
      font: '18px monospace', fill: '#ffffff'
    }).setOrigin(0.5);
    this.load.on('progress', function(value) {
      progressBar.clear();
      progressBar.fillStyle(0x00ff88, 1);
      progressBar.fillRect(width / 2 - 155, height / 2 - 10, 310 * value, 20);
    });
    this.load.on('complete', function() {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // ====================== PLAYER ======================
    this.load.image('player-idle', 'chicles/chicles/idle/Idle_1.png');
    this.load.image('player-run1', 'chicles/chicles/run/Run_1.png');
    this.load.image('player-run2', 'chicles/chicles/run/Run_2.png');
    this.load.image('player-run3', 'chicles/chicles/run/Run_3.png');
    this.load.image('player-jump', 'chicles/chicles/jump/Jump.png');
    this.load.image('player-attack1', 'chicles/chicles/ataque_principal/Ataque_principal.png');
    this.load.image('player-attack2', 'chicles/chicles/ataque_principal/Ataque_principal_2.png');
    this.load.image('idle-power', 'chicles/chicles/idle_power/Idle_power.png');
    this.load.image('transform1', 'chicles/chicles/transform/Transformacion_1.png');
    this.load.image('escudo-agua', 'chicles/chicles/agua_en_bolsita/Agua_en_bolsita_escudo.png');
    this.load.image('super-jump-pickup', 'chicles/chicles/super_jump/Super_jump.png');
    this.load.image('hoyo-idle', 'chicles/chicles/hoyo_nivel_3_caida_chicles/Idle_caida_1.png');
    this.load.image('hoyo-caida1', 'chicles/chicles/hoyo_nivel_3_caida_chicles/caida_1.png');
    this.load.image('hoyo-caida2', 'chicles/chicles/hoyo_nivel_3_caida_chicles/caida_2.png');

    // ====================== LEVEL 1 ENEMIES ======================
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

    // ====================== BOSSES ======================
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
    this.load.image('gusano-idle', 'chicles/gusano/idle_gusano_front/idle_gusano_front.png');
    this.load.image('gusano-bite', 'chicles/gusano/Bite_gusano/Bite_gusano.png');
    this.load.image('gusano-lash', 'chicles/gusano/Lash_attack_gusano/Lash_attack_gusano.png');
    this.load.image('gusano-ichor', 'chicles/gusano/Split_ichor/Split_ichor.png');
    this.load.image('gusano-tentacle', 'chicles/gusano/Tentacle_attack/Tentacle_attack.png');
    this.load.image('abuela-idle', 'chicles/abuela/Idle_abuela_malicius_1/Idle_abuela_malicius_1.png');
    this.load.image('abuela-chancla1', 'chicles/abuela/Abuela_Aventar_chancla_1/Abuela_Aventar_chancla_1.png');
    this.load.image('abuela-chancla2', 'chicles/abuela/Abuela_Aventar_chancla_2/Abuela_Aventar_chancla_2.png');
    this.load.image('abuela-jump', 'chicles/abuela/jump_abuela/jump_abuela.png');
    this.load.image('abuela-parasite', 'chicles/abuela/parasite_poder/parasite_poder.png');

    // ====================== LEVEL 4 ENEMIES ======================
    this.load.image('alien2', 'chicles/aliens/Alien_2.png');
    this.load.image('alien3', 'chicles/aliens/Alien_3.png');
    this.load.image('alien-dr', 'chicles/aliens/Alien_dr_1.png');
    this.load.image('bat-idle', 'chicles/murcielajolote/Idle_murcielajolote/Idle_murcielajolote.png');
    this.load.image('bat-proj', 'chicles/murcielajolote/Projectil_guano/Projectil_guano.png');
    this.load.image('vaca1', 'chicles/vacas/Vaca_1.png');
    this.load.image('vaca-choco', 'chicles/vacas/Vaca_chocolate.png');
    this.load.image('vaca-fresa', 'chicles/vacas/Vaca_fresa.png');

    // ====================== LEVEL 3 ======================
    this.load.image('cucaracha1', 'chicles/cucaracha/Cucaracha_1.png');
    this.load.image('cucaracha2', 'chicles/cucaracha/Cucaracha__2.png');
    this.load.image('cucaracha3', 'chicles/cucaracha/Cucaracha_3.png');
    this.load.image('dona-podrida', 'chicles/cucaracha/dona_cucaracha_podrida/Dona_cucaracha_podrida.png');
    this.load.image('torta-chorro', 'chicles/cucaracha/projectil_torta_chorro/projectil_torta_chorro.png');

    // ====================== POWER-UPS ======================
    this.load.image('chicle-poder', 'chicles/poderes/chicle_poder/chicle_poder.png');
    this.load.image('bolillo', 'chicles/poderes/bolillo_pal_susto/Bolillo_pal_susto.png');
    this.load.image('dulce', 'chicles/poderes/dulce/Dulce.png');
    this.load.image('dulce-poder', 'chicles/poderes/dulce_poder/Dulce_poder.png');
    this.load.image('vida-icon', 'chicles/poderes/vidas/Vida_1.png');
    // FIX: corrected path — was 404 because file is Agua_en_bolsita.png not Agua_en_bolsita_escudo.png
    this.load.image('power-agua', 'chicles/poderes/agua_en_bolsita/Agua_en_bolsita.png');
    this.load.image('power-chicharron', 'chicles/poderes/chicharron_preparado/Chicharron_preparado.png');
    this.load.image('power-chocolate', 'chicles/poderes/chocolate/Chocolate.png');
    this.load.image('power-combo', 'chicles/poderes/special_combo/Special_combo.png');
    this.load.image('power-vida', 'chicles/poderes/numero_de_vidas/Numero_vidas.png');
    this.load.image('pistola1', 'chicles/poderes/pistola_chicles/pistola_1.png');
    this.load.image('pistola2', 'chicles/poderes/pistola_chicles/pistola_2.png');
    this.load.image('misil-chicle1', 'chicles/poderes/pistola_chicles/misil_chicle_1.png');
    this.load.image('misil-chicle2', 'chicles/poderes/pistola_chicles/misil_chicle_2.png');

    // ====================== UI ======================
    this.load.image('btn-play', 'chicles/botones/play/Play.png');
    this.load.image('btn-pausa', 'chicles/botones/boton_pausa/Boton__pausa.png');
    this.load.image('btn-como-jugar', 'chicles/botones/boton_como_jugar/Como_Jugar.png');
    this.load.image('btn-creditos', 'chicles/botones/boton_creditos/Creditos.png');
    this.load.image('btn-salir', 'chicles/botones/boton_salir/Boton_salir.png');
    this.load.image('btn-reiniciar', 'chicles/botones/boton_reiniciar/Boton_reiniciar.png');
    this.load.image('logo', 'chicles/Logo.png');
    this.load.image('portada', 'chicles/portada.jpg');
    this.load.image('creditos', 'chicles/creditos_chicles.png');
    this.load.image('final-1', 'chicles/ui/final/final_1.jpg');
    this.load.image('final-2', 'chicles/ui/final/final_salva_a_la_abuela_2.jpg');
    this.load.image('final-3', 'chicles/ui/final/final_fin_3.jpg');

    // ====================== BACKGROUNDS ======================
    this.load.image('bg-calle', 'chicles/ui/tamalero_nivel_1/tamalero_nivel_1.jpg');
    this.load.image('tile-ground', 'chicles/ui/tamalero_nivel_1/tile_tamalero.jpg');
    this.load.image('lab-bg', 'chicles/ui/metro_nivel_final_4/metro_nivel_final_4.jpg');
    this.load.image('hoyo-bg-far', 'chicles/ui/hoyo_nivel_3/hoyo_nivel_3.jpg');
    this.load.image('hoyo-bg-mid', 'chicles/ui/hoyo_nivel_3/hoyo_nivel_3_1.jpg');
    this.load.image('zumba-bg1', 'chicles/ui/zumba_nivel_2/zumba_1.jpg');
    this.load.image('zumba-bg2', 'chicles/ui/zumba_nivel_2/zumba_2.jpg');

    // ====================== AUDIO ======================
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
    this.load.audio('nivel4_metro', 'chicles/sound/nivel_4_metro.mp3');
    this.load.audio('nivel3_hoyo', 'chicles/sound/nive_3_hoyo_gusanol.mp3');
    this.load.audio('nivel_final_victoria', 'chicles/sound/nivel_final_victoria.mp3');

    // ====================== LEVEL 2: ZUMBA ======================
    this.load.image('zumba-chicles1', 'chicles/chicles/zumba_chicles/Zumba_1.png');
    this.load.image('zumba-chicles2', 'chicles/chicles/zumba_chicles/Zumba_2.png');
    this.load.image('zumba-chicles3', 'chicles/chicles/zumba_chicles/Zumba_3.png');
    this.load.image('zumba-chicles4', 'chicles/chicles/zumba_chicles/Zumba_4.png');
    this.load.image('zumba-chicles5', 'chicles/chicles/zumba_chicles/Zumba_5.png');
    this.load.image('zumba-chicles6', 'chicles/chicles/zumba_chicles/Zumba_6.png');
    this.load.image('zumba-chichi-idle', 'chicles/zumba_chichi/idle_zumba_chichi/Idle_Zumba_chichi.png');
    this.load.image('zumba-chichi1', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_1.png');
    this.load.image('zumba-chichi2', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_2.png');
    this.load.image('zumba-chichi3', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_3.png');
    this.load.image('zumba-chichi4', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_4.png');
    this.load.image('zumba-chichi5', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_5.png');
    this.load.image('zumba-chichi-jump', 'chicles/zumba_chichi/jump_zumba_chichi/Jump_Zumba_chichi.png');
    this.load.image('zumba-chichi-defeat', 'chicles/zumba_chichi/baile_zumba_chihi/Zumba_chichi_derrota.png');
    this.load.image('zumba-npc1-1', 'chicles/zumba_chichi/npc_zumba/Npc1_zumba_1.png');
    this.load.image('zumba-npc1-2', 'chicles/zumba_chichi/npc_zumba/Npc1_zumba_2.png');
    this.load.image('zumba-npc1-3', 'chicles/zumba_chichi/npc_zumba/Npc1_zumba_3.png');
    this.load.image('zumba-npc1-4', 'chicles/zumba_chichi/npc_zumba/Npc1_zumba_4.png');
    this.load.image('zumba-npc2-2', 'chicles/zumba_chichi/npc_zumba/Npc2_zumba_2.png');
    this.load.image('zumba-npc2-3', 'chicles/zumba_chichi/npc_zumba/Npc2_zumba_3.png');
    this.load.image('zumba-dona', 'chicles/zumba_chichi/dona_cucaracha_podrida/Dona_cucaracha_podrida.png');
  }

  create() {
    this.scene.start('MenuScene');
  }
}
