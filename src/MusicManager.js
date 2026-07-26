/**
 * MusicManager - Singleton music controller for Un Bolillo Pal' Susto
 * Ensures only one background track plays at a time with smooth fades.
 */
var MusicManager = {
  currentTrack: null,
  currentKey: null,
  scene: null,

  init: function(scene) {
    this.scene = scene;
  },

  play: function(scene, key, config) {
    config = config || {};
    var volume = config.volume !== undefined ? config.volume : 0.6;
    var loop = config.loop !== undefined ? config.loop : true;
    var fadeIn = config.fadeIn !== undefined ? config.fadeIn : 1000;

    // Already playing this track
    if (this.currentKey === key && this.currentTrack && this.currentTrack.isPlaying) {
      return;
    }

    // Fade out current track, then start new one
    if (this.currentTrack && this.currentTrack.isPlaying) {
      var oldTrack = this.currentTrack;
      scene.tweens.add({
        targets: oldTrack,
        volume: 0,
        duration: 800,
        onComplete: function() {
          oldTrack.stop();
        }
      });
    }

    // Start new track
    var newTrack = scene.sound.add(key, { loop: loop, volume: 0 });
    newTrack.play();
    this.currentTrack = newTrack;
    this.currentKey = key;

    scene.tweens.add({
      targets: newTrack,
      volume: volume,
      duration: fadeIn
    });
  },

  fadeOut: function(scene, duration) {
    duration = duration || 800;
    if (this.currentTrack && this.currentTrack.isPlaying) {
      var track = this.currentTrack;
      scene.tweens.add({
        targets: track,
        volume: 0,
        duration: duration,
        onComplete: function() {
          track.stop();
        }
      });
      this.currentTrack = null;
      this.currentKey = null;
    }
  },

  stop: function() {
    if (this.currentTrack) {
      this.currentTrack.stop();
      this.currentTrack = null;
      this.currentKey = null;
    }
  }
};
