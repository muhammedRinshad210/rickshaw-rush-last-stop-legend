/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Player Auto-Rickshaw Entity
 */

import { CONFIG } from '../core/Config.js';
import { SoundFX } from '../core/AudioSystem.js';

export class PlayerAuto extends Phaser.GameObjects.Container {
  constructor(scene, x, y, skinId = 'classic_yellow') {
    super(scene, x, y);
    this.scene = scene;
    this.skinId = skinId;

    // Current lane: 0 = Left, 1 = Middle, 2 = Right
    this.currentLane = 1;
    this.targetLane = 1;
    this.isChangingLane = false;
    this.laneTween = null;

    // Dimensions & Hitbox
    this.width = 84;
    this.height = 132;
    this.hitboxPaddingX = 14;
    this.hitboxPaddingY = 16;

    // Base Sprite
    this.sprite = scene.add.image(0, 0, `rickshaw_${skinId}`);
    this.add(this.sprite);

    // Passenger Backseat Visual (shown when passenger onboard)
    this.passengerSprite = scene.add.image(0, 24, 'passenger_student');
    this.passengerSprite.setScale(0.55);
    this.passengerSprite.setVisible(false);
    this.add(this.passengerSprite);

    // Headlight Beam Cone (Subtle warm glow ahead)
    this.headlightCone = scene.add.graphics();
    this.headlightCone.fillStyle(0xFFF9C4, 0.12);
    this.headlightCone.beginPath();
    this.headlightCone.moveTo(0, -50);
    this.headlightCone.lineTo(-45, -240);
    this.headlightCone.lineTo(45, -240);
    this.headlightCone.closePath();
    this.headlightCone.fill();
    this.add(this.headlightCone);
    this.sendToBack(this.headlightCone);

    // Power-Up Shield Visual
    this.shieldFX = scene.add.image(0, 0, 'fx_shield');
    this.shieldFX.setScale(1.15);
    this.shieldFX.setVisible(false);
    this.add(this.shieldFX);

    // Magnet Aura Visual
    this.magnetFX = scene.add.image(0, 0, 'fx_magnet');
    this.magnetFX.setScale(1.1);
    this.magnetFX.setVisible(false);
    this.add(this.magnetFX);

    // Physics Body
    scene.physics.world.enable(this);
    this.body.setSize(this.width - this.hitboxPaddingX * 2, this.height - this.hitboxPaddingY * 2);
    this.body.setOffset(-(this.width - this.hitboxPaddingX * 2) / 2, -(this.height - this.hitboxPaddingY * 2) / 2);

    // States
    this.isAlive = true;
    this.hasPassenger = false;
    this.passengerData = null;

    // Active Power-ups
    this.shieldTimer = 0;
    this.magnetTimer = 0;
    this.boostTimer = 0;

    // Horn Cooldown
    this.lastHornTime = 0;

    // Subtle engine idle shake
    this.idleTimer = 0;

    scene.add.existing(this);
  }

  setSkin(skinId) {
    this.skinId = skinId;
    if (this.scene.textures.exists(`rickshaw_${skinId}`)) {
      this.sprite.setTexture(`rickshaw_${skinId}`);
    }
  }

  /* -------------------------------------------------------------
   * LANE SWITCHING (120ms smooth tween with banking tilt)
   * ----------------------------------------------------------- */
  changeLane(direction) {
    if (!this.isAlive) return false;

    const nextLane = Phaser.Math.Clamp(this.currentLane + direction, 0, CONFIG.ROAD.LANES_COUNT - 1);
    if (nextLane === this.currentLane) {
      return false; // Already at road boundary
    }

    this.currentLane = nextLane;
    const targetX = this.scene.getLaneCenterX(this.currentLane);

    if (this.laneTween) {
      this.laneTween.stop();
    }

    const tiltAngle = direction > 0 ? 0.12 : -0.12; // Bank into turn
    this.isChangingLane = true;

    // 120ms tween as specified in CONFIG
    this.laneTween = this.scene.tweens.add({
      targets: this,
      x: targetX,
      rotation: tiltAngle,
      duration: CONFIG.ROAD.LANE_TWEEN_DURATION,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        // Return rotation to straight
        this.scene.tweens.add({
          targets: this,
          rotation: 0,
          duration: 60,
          ease: 'Quad.easeOut',
          onComplete: () => {
            this.isChangingLane = false;
          }
        });
      }
    });

    return true;
  }

  moveLeft() {
    return this.changeLane(-1);
  }

  moveRight() {
    return this.changeLane(1);
  }

  /* -------------------------------------------------------------
   * SIGNATURE HORN MECHANIC
   * ----------------------------------------------------------- */
  triggerHorn(currentTime) {
    if (!this.isAlive) return false;
    if (currentTime - this.lastHornTime < CONFIG.HORN.COOLDOWN_MS) {
      return false; // Still cooling down
    }

    this.lastHornTime = currentTime;
    SoundFX.playHorn();

    // Visual horn blast pulse on rickshaw
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.1,
      scaleY: 1.08,
      duration: 80,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });

    // Notify scene to scare nearby cows
    if (this.scene.onPlayerHonk) {
      this.scene.onPlayerHonk(this.x, this.y);
    }

    return true;
  }

  getHornCooldownProgress(currentTime) {
    const elapsed = currentTime - this.lastHornTime;
    return Phaser.Math.Clamp(elapsed / CONFIG.HORN.COOLDOWN_MS, 0, 1);
  }

  /* -------------------------------------------------------------
   * PASSENGER STATE
   * ----------------------------------------------------------- */
  boardPassenger(passengerData) {
    this.hasPassenger = true;
    this.passengerData = passengerData;
    this.passengerSprite.setTexture(`passenger_${passengerData.type}`);
    this.passengerSprite.setVisible(true);

    // Boarding bounce animation
    this.passengerSprite.setScale(0.1);
    this.scene.tweens.add({
      targets: this.passengerSprite,
      scaleX: 0.55,
      scaleY: 0.55,
      duration: 250,
      ease: 'Back.easeOut'
    });
  }

  deliverPassenger() {
    this.hasPassenger = false;
    this.passengerData = null;

    // Disembark animation
    this.scene.tweens.add({
      targets: this.passengerSprite,
      scaleX: 0.1,
      scaleY: 0.1,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.passengerSprite.setVisible(false);
        this.passengerSprite.setAlpha(1);
        this.passengerSprite.setScale(0.55);
      }
    });
  }

  /* -------------------------------------------------------------
   * POWER-UPS MANAGEMENT
   * ----------------------------------------------------------- */
  activateShield(durationMs = CONFIG.POWERUPS.SHIELD.durationMs) {
    this.shieldTimer = durationMs;
    this.shieldFX.setVisible(true);
    SoundFX.playShieldActivate();
  }

  activateMagnet(durationMs = CONFIG.POWERUPS.MAGNET.durationMs) {
    this.magnetTimer = durationMs;
    this.magnetFX.setVisible(true);
  }

  activateBoost(durationMs = CONFIG.POWERUPS.BOOST.durationMs) {
    this.boostTimer = durationMs;
    SoundFX.playBoost();
  }

  hasActiveShield() {
    return this.shieldTimer > 0;
  }

  hasActiveMagnet() {
    return this.magnetTimer > 0;
  }

  hasActiveBoost() {
    return this.boostTimer > 0;
  }

  absorbCollisionWithShield() {
    this.shieldTimer = 0;
    this.shieldFX.setVisible(false);
    SoundFX.playShieldHit();

    // Deflection flash effect
    this.scene.cameras.main.flash(180, 255, 255, 255);
  }

  /* -------------------------------------------------------------
   * UPDATE LOOP
   * ----------------------------------------------------------- */
  update(delta) {
    if (!this.isAlive) return;

    // Power-up timers countdown
    if (this.shieldTimer > 0) {
      this.shieldTimer -= delta;
      this.shieldFX.rotation += 0.04;
      if (this.shieldTimer <= 0) {
        this.shieldFX.setVisible(false);
      }
    }

    if (this.magnetTimer > 0) {
      this.magnetTimer -= delta;
      this.magnetFX.rotation -= 0.05;
      if (this.magnetTimer <= 0) {
        this.magnetFX.setVisible(false);
      }
    }

    if (this.boostTimer > 0) {
      this.boostTimer -= delta;
      // Spawn boost trail sparks
      if (Math.random() < 0.4) {
        this.scene.spawnSpeedSpark(this.x + Phaser.Math.Between(-15, 15), this.y + 60);
      }
    }

    // Engine micro-vibration
    this.idleTimer += delta * 0.02;
    this.sprite.y = Math.sin(this.idleTimer) * 1.2;
  }

  crash() {
    this.isAlive = false;
    if (this.laneTween) {
      this.laneTween.stop();
      this.laneTween = null;
    }
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.killTweensOf(this.sprite);

    SoundFX.playCollision();
    this.shieldFX.setVisible(false);
    this.magnetFX.setVisible(false);

    // Spin out and crash animation
    this.scene.tweens.add({
      targets: this,
      rotation: 0.8,
      scaleX: 0.9,
      scaleY: 0.8,
      duration: 350,
      ease: 'Quad.easeOut'
    });
  }
}

