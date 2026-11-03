/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Core Gameplay Scene
 */

import { CONFIG } from '../core/Config.js';
import { Storage } from '../core/Storage.js';
import { SoundFX } from '../core/AudioSystem.js';
import { PlayerAuto } from '../entities/PlayerAuto.js';
import { TrafficSpawner } from '../systems/TrafficSpawner.js';
import { NearMissSystem } from '../systems/NearMissSystem.js';
import { MissionSystem } from '../systems/MissionSystem.js';
import { EnvironmentScenery } from '../systems/EnvironmentScenery.js';
import { HUD } from '../ui/HUD.js';
import { PlatformManager } from '../platform/PlatformManager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(data) {
    // 1. Calculate Road Layout based on current viewport
    this.updateRoadGeometry();

    // 2. Score, Run Stats & Speed
    this.score = 0;
    this.coinsCollected = 0;
    this.distanceTraveled = 0;
    this.currentRoadSpeed = CONFIG.ROAD.SCROLL_SPEED_BASE;
    this.isPaused = false;
    this.isGameOver = false;

    // Active Drive Mode: normal vs monsoon
    let activeMode = (data && data.mode) ? data.mode : Storage.getDriveMode();
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const p = new URLSearchParams(window.location.search);
      if (p.get('mode') === 'monsoon') activeMode = CONFIG.DRIVE_MODES.MONSOON;
      else if (p.get('mode') === 'normal') activeMode = CONFIG.DRIVE_MODES.NORMAL;
    }
    this.driveMode = activeMode;

    // 3. Subsystems
    this.environment = new EnvironmentScenery(this);
    this.environment.setMode(this.driveMode);
    this.spawner = new TrafficSpawner(this);
    this.nearMissSystem = new NearMissSystem(this);
    this.missionSystem = new MissionSystem(this);

    // QA Query Parameter support (for rapid testing of specific biomes/states)
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const envParam = params.get('env');
      if (envParam) {
        const foundIdx = CONFIG.ENVIRONMENTS.findIndex(e => e.id === envParam);
        if (foundIdx >= 0) {
          this.environment.currentBiomeIndex = foundIdx;
          this.environment.targetBiomeIndex = foundIdx;
          const env = CONFIG.ENVIRONMENTS[foundIdx];
          this.environment.activeColors.asphalt = env.asphaltColor;
          this.environment.activeColors.shoulder = env.shoulderColor;
          this.environment.activeColors.curbA = env.curbColorA;
          this.environment.activeColors.curbB = env.curbColorB;
          this.environment.activeColors.lightTint = env.lightTint;
          this.environment.activeColors.lightAlpha = env.lightAlpha;
          this.environment.refreshAllSceneryTextures(env.id);
          this.environment.triggerLocationBanner(env);
        }
      }

      const actParam = params.get('action');
      if (actParam === 'pickup') {
        this.time.delayedCall(100, () => {
          this.spawner.spawnPassengerPickup();
          const pStop = this.spawner.passengerStops[this.spawner.passengerStops.length - 1];
          if (pStop) pStop.y = this.scale.height * 0.44;
        });
      } else if (actParam === 'dropoff') {
        const dest = CONFIG.DESTINATIONS[0];
        this.missionSystem.startPassengerMission({ destination: dest, type: 'tourist' });
        this.time.delayedCall(100, () => {
          this.spawner.spawnDropoffZone(dest);
          const dZone = this.spawner.dropoffZones[this.spawner.dropoffZones.length - 1];
          if (dZone) dZone.y = this.scale.height * 0.42;
        });
      }
    }

    // 4. Player Entity
    const selectedSkin = Storage.getSelectedSkin();
    const playerY = this.scale.height - 180;
    this.player = new PlayerAuto(this, this.getLaneCenterX(1), playerY, selectedSkin);

    // 5. HUD
    this.hud = new HUD(this);

    // 6. Setup Collision Overlaps
    this.setupCollisions();

    // 7. Input Controls (Touch, Keyboard, Mouse)
    this.setupInputs();

    // 8. Start Web Audio 2-stroke engine sound
    SoundFX.startEngine();

    // 9. Resize Listener & Lifecycle Cleanup
    this.scale.on('resize', this.onResize, this);

    this.events.once('shutdown', () => {
      this.cleanup();
    });

    this.events.once('destroy', () => {
      this.cleanup();
    });

    // 10. Platform Lifecycle: gameplayStart
    PlatformManager.current.gameplayStart();

    // QA Hook: testCrash
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('testCrash') === 'true') {
        this.time.delayedCall(800, () => this.handleCrash());
      }
    }
  }

  cleanup() {
    this.scale.off('resize', this.onResize, this);
    SoundFX.stopEngine();
    SoundFX.stopRain();
    if (this.environment) {
      this.environment.cleanup();
    }
    PlatformManager.current.gameplayStop();
  }

  updateRoadGeometry() {
    const w = this.scale.width;
    // Keep road width proportional and comfortable across 9:16 portrait to 16:9 widescreen
    this.roadWidth = Math.min(CONFIG.ROAD.WIDTH, w * 0.88);
    this.roadLeftX = (w - this.roadWidth) / 2;
    this.roadRightX = this.roadLeftX + this.roadWidth;
    this.laneWidth = this.roadWidth / CONFIG.ROAD.LANES_COUNT;
  }

  getLaneCenterX(laneIndex) {
    return this.roadLeftX + (laneIndex + 0.5) * this.laneWidth;
  }

  /* -------------------------------------------------------------
   * INPUT CONTROLS: Touch Swipes, Taps, and Keyboard
   * ----------------------------------------------------------- */
  setupInputs() {
    // Keyboard Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Touch Swipe / Tap Handling
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    this.input.on('pointerdown', (pointer) => {
      touchStartX = pointer.x;
      touchStartY = pointer.y;
      touchStartTime = this.time.now;
    });

    this.input.on('pointerup', (pointer) => {
      if (this.isGameOver || this.isPaused) return;

      const dx = pointer.x - touchStartX;
      const dy = pointer.y - touchStartY;
      const dt = this.time.now - touchStartTime;

      // Check for swipe gesture (horizontal delta > 30px within 350ms)
      if (Math.abs(dx) > 30 && dt < 350) {
        if (dx < 0) {
          this.player.moveLeft();
        } else {
          this.player.moveRight();
        }
      } else if (dt < 250 && Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        // Tap left or right half of the road to steer
        if (pointer.y < this.scale.height - 120) { // Don't trigger if tapping bottom bar
          if (pointer.x < this.scale.width / 2) {
            this.player.moveLeft();
          } else {
            this.player.moveRight();
          }
        }
      }
    });
  }

  handleKeyboardInputs() {
    if (this.isGameOver || this.isPaused) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.keyA)) {
      this.player.moveLeft();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keyD)) {
      this.player.moveRight();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keySpace) || Phaser.Input.Keyboard.JustDown(this.keyH)) {
      this.triggerHorn();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyP) || Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      this.pauseGame();
    }
  }

  triggerHorn() {
    const success = this.player.triggerHorn(this.time.now);
    if (success) {
      const scaredCows = this.spawner.onHonk(this.player.x, this.player.y);
      if (scaredCows > 0) {
        this.missionSystem.recordChallengeProgress('honk_3', scaredCows);
        this.addScore(scaredCows * 75);
        this.spawnFloatingText(this.player.x, this.player.y - 50, `COW CLEARED! +${scaredCows * 75}`, 0xFFD54F);
      }
    }
  }

  /* -------------------------------------------------------------
   * COLLISIONS & TRIGGERS
   * ----------------------------------------------------------- */
  setupCollisions() {
    // 1. Player vs Obstacles
    this.physics.add.overlap(this.player, this.spawner.obstacles, (player, obstacle) => {
      if (!this.player.isAlive || !obstacle.active || obstacle.isScared) return;

      if (this.player.hasActiveShield()) {
        // Shield absorbs the blow!
        this.player.absorbCollisionWithShield();
        obstacle.active = false;
        obstacle.setVisible(false);
        this.spawnConfetti(obstacle.x, obstacle.y);
      } else {
        // Fatal crash
        this.handleCrash();
      }
    });

    // 2. Player vs Coins
    this.physics.add.overlap(this.player, this.spawner.coins, (player, coin) => {
      if (!this.player.isAlive || coin.isCollected) return;

      const val = coin.collect();
      if (val > 0) {
        this.coinsCollected++;
        this.addScore(val);
        Storage.addCoins(1);
        this.missionSystem.recordChallengeProgress('coins_30', 1);
      }
    });

    // 3. Player vs PowerUps
    this.physics.add.overlap(this.player, this.spawner.powerups, (player, pup) => {
      if (!this.player.isAlive || pup.isCollected) return;

      const type = pup.collect();
      if (type === 'shield') {
        this.player.activateShield();
        this.spawnFloatingText(this.player.x, this.player.y - 60, 'CHAYA SHIELD!', 0xFFA000);
      } else if (type === 'magnet') {
        this.player.activateMagnet();
        this.spawnFloatingText(this.player.x, this.player.y - 60, 'COIN MAGNET!', 0xE91E63);
      } else if (type === 'boost') {
        this.player.activateBoost();
        this.spawnFloatingText(this.player.x, this.player.y - 60, 'TURBO BOOST!', 0x00E676);
      }
    });

    // 4. Player vs Passenger Pickup Stop
    this.physics.add.overlap(this.player, this.spawner.passengerStops, (player, stop) => {
      if (!this.player.isAlive || stop.isPickedUp || this.player.hasPassenger) return;

      const data = stop.collect();
      if (data) {
        this.player.boardPassenger(data);
        const mission = this.missionSystem.startPassengerMission(data);
        this.spawnFloatingText(this.player.x, this.player.y - 70, `PASSENGER ABOARD!\nTO ${data.destination.name.toUpperCase()}`, 0xFFD54F);
      }
    });

    // 5. Player vs Dropoff Zone
    this.physics.add.overlap(this.player, this.spawner.dropoffZones, (player, zone) => {
      if (!this.player.isAlive || zone.isDelivered || !this.player.hasPassenger) return;

      const fare = zone.deliver();
      if (fare > 0) {
        this.player.deliverPassenger();
        this.coinsCollected += fare;
        Storage.addCoins(fare);
        this.addScore(CONFIG.SCORING.PASSENGER_DELIVERY_BASE + fare * 2);
        this.missionSystem.completePassengerMission();
        this.spawnFloatingText(this.player.x, this.player.y - 70, `DELIVERY SUCCESS!\n+${fare} FARE COINS! ⭐`, 0x00E676);
      }
    });
  }

  handleCrash() {
    this.isGameOver = true;
    this.player.crash();
    SoundFX.stopEngine();
    SoundFX.stopRain();
    PlatformManager.current.gameplayStop();
    this.nearMissSystem.onPlayerCrash();

    // Screen camera shake
    this.cameras.main.shake(300, 0.025);

    // Save High Score
    Storage.setHighScore(Math.floor(this.score));

    // Transition to GameOver Scene after short dramatic delay
    this.time.delayedCall(1200, () => {
      this.scene.start('GameOverScene', {
        score: Math.floor(this.score),
        coins: this.coinsCollected,
        passengers: this.missionSystem.passengersDeliveredThisRun,
        distance: Math.floor(this.distanceTraveled),
      });
    });
  }

  addScore(points) {
    const multiplier = this.player.hasActiveBoost() ? CONFIG.POWERUPS.BOOST.scoreMultiplier : 1.0;
    this.score += points * multiplier;
  }

  onNearMissAchieved(combo) {
    this.missionSystem.recordChallengeProgress('near_miss_4', 1);
  }

  /* -------------------------------------------------------------
   * MAIN GAME LOOP
   * ----------------------------------------------------------- */
  update(time, delta) {
    if (this.isPaused) return;

    // Handle Keyboard inputs
    this.handleKeyboardInputs();

    if (this.isGameOver) {
      this.player.update(delta);
      return;
    }

    const deltaSeconds = delta / 1000;

    // Calculate Dynamic Road Speed with Boost & Difficulty
    let targetSpeed = CONFIG.ROAD.SCROLL_SPEED_BASE * (1 + (this.spawner.difficultyLevel - 1) * 0.45);
    if (this.player.hasActiveBoost()) {
      targetSpeed *= CONFIG.POWERUPS.BOOST.speedMultiplier;
    }
    this.currentRoadSpeed = Phaser.Math.Linear(this.currentRoadSpeed, targetSpeed, 0.08);

    // Update Distance & Score
    const distDelta = this.currentRoadSpeed * deltaSeconds;
    this.distanceTraveled += distDelta * 0.05; // 1 unit per ~20px
    this.addScore(distDelta * CONFIG.SCORING.DISTANCE_PER_PIXEL);

    // Update 2-stroke Audio pitch with current velocity
    const speedRatio = this.currentRoadSpeed / CONFIG.ROAD.SCROLL_SPEED_BASE;
    SoundFX.updateEngine(speedRatio);

    // Update Subsystems
    this.environment.update(this.currentRoadSpeed, delta);
    this.player.update(delta);
    this.spawner.update(delta, this.currentRoadSpeed, this.player);
    this.nearMissSystem.update(delta, this.player, this.spawner.obstacles);
    this.missionSystem.update(distDelta, this.spawner);

    // Update HUD
    this.hud.update(
      this.score,
      this.coinsCollected,
      this.missionSystem.activeMission,
      this.missionSystem.getMissionProgress(),
      this.nearMissSystem.combo,
      this.player,
      time
    );
  }

  /* -------------------------------------------------------------
   * VISUAL FX & FLOATING PARTICLES
   * ----------------------------------------------------------- */
  spawnFloatingText(x, y, message, hexColor = 0xFFFFFF) {
    const text = this.add.text(x, y, message, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontWeight: '900',
      color: '#' + hexColor.toString(16).padStart(6, '0'),
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5).setDepth(150);

    this.tweens.add({
      targets: text,
      y: y - 50,
      scaleX: 1.15,
      scaleY: 1.15,
      alpha: 0,
      duration: 900,
      ease: 'Quad.easeOut',
      onComplete: () => text.destroy()
    });
  }

  spawnNearMissSparks(x, y) {
    for (let i = 0; i < 6; i++) {
      const spark = this.add.image(x, y, 'fx_spark');
      spark.setDepth(90);
      spark.setTint(0xFFEB3B);

      const angle = Phaser.Math.FloatBetween(-Math.PI, Math.PI);
      const speed = Phaser.Math.Between(40, 100);

      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.1,
        duration: 250,
        onComplete: () => spark.destroy()
      });
    }
  }

  spawnSpeedSpark(x, y) {
    const spark = this.add.image(x, y, 'fx_spark');
    spark.setDepth(50);
    spark.setTint(0x00E676);

    this.tweens.add({
      targets: spark,
      y: y + 40,
      alpha: 0,
      scale: 0.2,
      duration: 180,
      onComplete: () => spark.destroy()
    });
  }

  spawnConfetti(x, y) {
    const colors = [0xFFD700, 0x4CAF50, 0x00E5FF, 0xE91E63, 0xFF9100];
    for (let i = 0; i < 16; i++) {
      const spark = this.add.image(x, y, 'fx_spark');
      spark.setDepth(95);
      spark.setTint(Phaser.Utils.Array.GetRandom(colors));

      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(30, 90);

      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.3,
        duration: 400,
        onComplete: () => spark.destroy()
      });
    }
  }

  /* -------------------------------------------------------------
   * PAUSE & RESIZE HANDLERS
   * ----------------------------------------------------------- */
  pauseGame() {
    if (this.isGameOver) return;
    this.isPaused = true;
    SoundFX.stopEngine();
    SoundFX.stopRain();
    PlatformManager.current.gameplayStop();
    this.scene.launch('PauseScene');
    this.scene.pause();
  }

  resumeGame() {
    this.isPaused = false;
    SoundFX.startEngine();
    if (this.driveMode === CONFIG.DRIVE_MODES.MONSOON && this.environment && this.environment.weatherSystem) {
      SoundFX.setRainIntensity(this.environment.weatherSystem.currentIntensity);
    }
    PlatformManager.current.gameplayStart();
    this.scene.resume();
  }

  onResize(gameSize) {
    this.updateRoadGeometry();

    // Update Player position to match new lane X coordinate
    if (this.player && this.player.isAlive) {
      this.player.x = this.getLaneCenterX(this.player.currentLane);
      this.player.y = gameSize.height - 180;
    }

    if (this.environment) {
      this.environment.onResize();
    }

    if (this.hud) {
      this.hud.onResize();
    }
  }
}

