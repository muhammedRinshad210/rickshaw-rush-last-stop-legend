/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Phase 4.5: Kerala Monsoon Weather System
 * Implements 4 distinct weather states: CLEAR_SKY, LIGHT_RAIN, HEAVY_MONSOON, AFTER_RAIN.
 * 100% fair, non-intrusive visuals, pooled rain particles, procedural Web Audio ambience.
 */

import { CONFIG } from '../core/Config.js';
import { SoundFX } from '../core/AudioSystem.js';

export class WeatherSystem {
  constructor(scene, environment) {
    this.scene = scene;
    this.environment = environment;

    // Active Drive Mode (normal vs monsoon)
    this.mode = CONFIG.DRIVE_MODES.NORMAL;

    // Weather State Cycle
    this.stateSequence = [
      CONFIG.WEATHER.STATES.LIGHT_RAIN,
      CONFIG.WEATHER.STATES.HEAVY_MONSOON,
      CONFIG.WEATHER.STATES.AFTER_RAIN,
      CONFIG.WEATHER.STATES.CLEAR_SKY
    ];
    this.currentStateIndex = 0;
    this.targetStateIndex = 0;
    this.currentState = this.stateSequence[0];
    this.targetState = this.stateSequence[0];

    // Transition & Timing
    this.weatherTimer = 0;
    this.currentWeatherDuration = 20000;
    this.isTransitioning = false;
    this.transitionProgress = 1.0;
    this.transitionDuration = CONFIG.WEATHER.TRANSITION_DURATION_MS;

    // Interpolated Visual Parameters
    this.currentIntensity = 0.0;
    this.currentDarkness = 0.0;
    this.currentTint = 0xFFFFFF;

    // Distant Thunder Timer (Heavy Monsoon)
    this.thunderTimer = 0;
    this.nextThunderInterval = 14000;

    // Visual Containers
    const w = scene.scale.width;
    const h = scene.scale.height;

    // Depth Layering: Must stay strictly below HUD (depth >= 100)
    // and above basic road background
    this.rainContainer = scene.add.container(0, 0);
    this.rainContainer.setDepth(85);

    this.puddleContainer = scene.add.container(0, 0);
    this.puddleContainer.setDepth(25); // Just above road asphalt, below vehicles

    this.rainbowContainer = scene.add.container(w / 2, 90);
    this.rainbowContainer.setDepth(20);

    // Rainbow sprite
    this.rainbowImage = scene.add.image(0, 0, 'weather_rainbow');
    this.rainbowImage.setAlpha(0);
    this.rainbowImage.setScale(Math.max(1.0, w / 400));
    this.rainbowContainer.add(this.rainbowImage);

    // Rain Particle Pool (Fixed 60 raindrops, zero update-loop allocations)
    this.raindrops = [];
    this.maxRaindrops = CONFIG.WEATHER.MAX_RAIN_PARTICLES;
    this.initRainPool(w, h);

    // Roadside Puddles Pool (Fixed 6 puddles)
    this.puddles = [];
    this.initPuddlePool(w, h);

    // Ambient Darkness Overlay
    this.darknessOverlay = scene.add.graphics();
    this.darknessOverlay.setDepth(86);
  }

  /* -------------------------------------------------------------
   * INITIALIZATION & POOLING
   * ----------------------------------------------------------- */
  initRainPool(w, h) {
    for (let i = 0; i < this.maxRaindrops; i++) {
      const drop = this.scene.add.image(
        Phaser.Math.Between(0, w + 120),
        Phaser.Math.Between(-100, h + 100),
        'weather_raindrop'
      );
      drop.fallSpeed = Phaser.Math.Between(780, 1150);
      drop.driftX = Phaser.Math.Between(-95, -50); // Diagonal monsoon angle
      drop.setScale(Phaser.Math.FloatBetween(0.8, 1.3));
      drop.setAlpha(0);
      this.raindrops.push(drop);
      this.rainContainer.add(drop);
    }
  }

  initPuddlePool(w, h) {
    const puddleCount = 6;
    for (let i = 0; i < puddleCount; i++) {
      const puddle = this.scene.add.image(0, -200, 'weather_puddle');
      puddle.setAlpha(0);
      puddle.side = (i % 2 === 0) ? 'left' : 'right';
      puddle.y = (i * (h / 3)) + Phaser.Math.Between(-40, 40);
      this.puddles.push(puddle);
      this.puddleContainer.add(puddle);
    }
    this.updatePuddlePositions();
  }

  updatePuddlePositions() {
    const w = this.scene.scale.width;
    const roadWidth = this.environment.scene.roadWidth || Math.min(CONFIG.ROAD.WIDTH, w * 0.88);
    const roadLeft = (w - roadWidth) / 2;
    const roadRight = roadLeft + roadWidth;

    this.puddles.forEach(puddle => {
      if (puddle.side === 'left') {
        puddle.x = roadLeft - Phaser.Math.Between(20, 50);
      } else {
        puddle.x = roadRight + Phaser.Math.Between(20, 50);
      }
    });
  }

  /* -------------------------------------------------------------
   * MODE CONFIGURATION
   * ----------------------------------------------------------- */
  setMode(mode) {
    this.mode = (mode === CONFIG.DRIVE_MODES.MONSOON) ? CONFIG.DRIVE_MODES.MONSOON : CONFIG.DRIVE_MODES.NORMAL;

    if (this.mode === CONFIG.DRIVE_MODES.NORMAL) {
      // Normal Drive: clear sky, zero rain, zero darkness
      this.currentState = CONFIG.WEATHER.STATES.CLEAR_SKY;
      this.targetState = CONFIG.WEATHER.STATES.CLEAR_SKY;
      this.currentIntensity = 0.0;
      this.currentDarkness = 0.0;
      this.isTransitioning = false;
      this.rainbowImage.setAlpha(0);
      SoundFX.stopRain();
    } else {
      // Monsoon Drive: starts with atmospheric light rain
      this.currentStateIndex = 0;
      this.currentState = this.stateSequence[0];
      this.targetState = this.stateSequence[0];
      this.currentIntensity = this.currentState.intensity;
      this.currentDarkness = this.currentState.darknessAlpha;
      this.currentWeatherDuration = Phaser.Math.Between(this.currentState.durationRange[0], this.currentState.durationRange[1]);
      this.weatherTimer = 0;
      SoundFX.setRainIntensity(this.currentIntensity);
    }
  }

  /* -------------------------------------------------------------
   * UPDATE LOOP
   * ----------------------------------------------------------- */
  update(delta, roadSpeed, currentBiomeId) {
    if (this.mode !== CONFIG.DRIVE_MODES.MONSOON) {
      this.clearVisuals();
      return;
    }

    const dt = delta / 1000;
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;

    // 1. Weather State Cycle Timer
    this.weatherTimer += delta;
    if (this.weatherTimer >= this.currentWeatherDuration && !this.isTransitioning) {
      this.startWeatherTransition();
    }

    // 2. Weather Crossfade Interpolation
    if (this.isTransitioning) {
      this.transitionProgress += delta / this.transitionDuration;
      if (this.transitionProgress >= 1.0) {
        this.transitionProgress = 1.0;
        this.isTransitioning = false;
        this.currentState = this.targetState;
        this.currentStateIndex = this.targetStateIndex;

        // Trigger transition chime when reaching AFTER_RAIN
        if (this.currentState.id === 'after_rain') {
          SoundFX.playWeatherChime();
        }
      }
      this.interpolateWeather();
    }

    // 3. Update Audio Ambience
    SoundFX.setRainIntensity(this.currentIntensity);

    // 4. Distant Thunder in Heavy Monsoon
    if (this.currentState.thunderActive || (this.targetState.thunderActive && this.isTransitioning)) {
      this.thunderTimer += delta;
      if (this.thunderTimer >= this.nextThunderInterval) {
        this.thunderTimer = 0;
        this.nextThunderInterval = Phaser.Math.Between(12000, 20000);
        SoundFX.playThunder();

        // Subtle atmospheric sky illumination (no large screen flash)
        this.scene.tweens.add({
          targets: this.darknessOverlay,
          alpha: Math.max(0.08, this.currentDarkness * 0.45),
          duration: 90,
          yoyo: true,
          repeat: 1,
          ease: 'Sine.easeInOut'
        });
      }
    }

    // 5. Update Pooled Rain Particles
    const activeDropCount = Math.floor(this.maxRaindrops * this.currentIntensity);
    for (let i = 0; i < this.maxRaindrops; i++) {
      const drop = this.raindrops[i];
      if (i < activeDropCount) {
        drop.alpha = Phaser.Math.Linear(drop.alpha, Math.min(0.85, 0.4 + this.currentIntensity * 0.45), 0.1);
        drop.y += (drop.fallSpeed + roadSpeed * 0.4) * dt;
        drop.x += drop.driftX * dt;

        if (drop.y > h + 30 || drop.x < -40) {
          drop.y = Phaser.Math.Between(-60, -10);
          drop.x = Phaser.Math.Between(20, w + 80);
        }
      } else {
        drop.alpha = Phaser.Math.Linear(drop.alpha, 0, 0.1);
      }
    }

    // 6. Update Roadside Puddles
    const targetPuddleAlpha = (this.currentIntensity > 0.15 || this.currentState.id === 'after_rain') ? 0.75 : 0.0;
    this.puddles.forEach(puddle => {
      puddle.alpha = Phaser.Math.Linear(puddle.alpha, targetPuddleAlpha, 0.05);
      puddle.y += roadSpeed * dt;
      if (puddle.y > h + 60) {
        puddle.y = -80;
      }
    });

    // 7. Update Rainbow (After Rain)
    const targetRainbowAlpha = (this.currentState.rainbowActive || this.targetState.rainbowActive) ? 0.42 : 0.0;
    this.rainbowImage.alpha = Phaser.Math.Linear(this.rainbowImage.alpha, targetRainbowAlpha, 0.03);

    // 8. Render Ambient Weather Darkness
    this.renderDarkness(w, h, currentBiomeId);
  }

  /* -------------------------------------------------------------
   * STATE TRANSITION & LERP
   * ----------------------------------------------------------- */
  startWeatherTransition() {
    this.weatherTimer = 0;
    this.targetStateIndex = (this.currentStateIndex + 1) % this.stateSequence.length;
    this.targetState = this.stateSequence[this.targetStateIndex];
    this.isTransitioning = true;
    this.transitionProgress = 0.0;

    const range = this.targetState.durationRange;
    this.currentWeatherDuration = Phaser.Math.Between(range[0], range[1]);
  }

  interpolateWeather() {
    const t = this.transitionProgress;
    this.currentIntensity = Phaser.Math.Linear(this.currentState.intensity, this.targetState.intensity, t);
    this.currentDarkness = Phaser.Math.Linear(this.currentState.darknessAlpha, this.targetState.darknessAlpha, t);
  }

  renderDarkness(w, h, currentBiomeId) {
    this.darknessOverlay.clear();

    // Adjust darkness by environment (e.g. night town is already dark)
    let ambientDarkness = this.currentDarkness;
    if (currentBiomeId === 'town_night') {
      ambientDarkness *= 0.6; // Don't overpower night visuals
    } else if (currentBiomeId === 'hills') {
      ambientDarkness *= 1.15; // Mountain mist density
    }

    if (ambientDarkness > 0.01) {
      this.darknessOverlay.fillStyle(0x1A252F, ambientDarkness);
      this.darknessOverlay.fillRect(0, 0, w, h);
    }
  }

  clearVisuals() {
    this.raindrops.forEach(d => { d.alpha = 0; });
    this.puddles.forEach(p => { p.alpha = 0; });
    this.rainbowImage.alpha = 0;
    this.darknessOverlay.clear();
  }

  onResize(w, h) {
    this.updatePuddlePositions();
    this.rainbowContainer.x = w / 2;
    this.rainbowImage.setScale(Math.max(1.0, w / 400));
  }

  cleanup() {
    SoundFX.stopRain();
    this.clearVisuals();
  }
}

