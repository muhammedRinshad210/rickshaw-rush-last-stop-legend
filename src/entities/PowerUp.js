/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Collectible Items & Power-Ups
 */

import { CONFIG } from '../core/Config.js';
import { SoundFX } from '../core/AudioSystem.js';

export class CoinItem extends Phaser.GameObjects.Container {
  constructor(scene, x, y, lane = 1) {
    super(scene, x, y);
    this.scene = scene;
    this.lane = lane;
    this.value = CONFIG.SCORING.COIN_VALUE;
    this.isCollected = false;

    // Sprite
    this.sprite = scene.add.image(0, 0, 'pickup_coin');
    this.add(this.sprite);

    // Subtle floating rotation/pulse
    scene.tweens.add({
      targets: this.sprite,
      scaleX: 0.85,
      duration: 350,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Physics
    scene.physics.world.enable(this);
    this.body.setSize(38, 38);
    this.body.setOffset(-19, -19);

    scene.add.existing(this);
  }

  collect() {
    if (this.isCollected) return 0;
    this.isCollected = true;
    SoundFX.playCoin();

    // Burst upwards
    this.scene.tweens.add({
      targets: this,
      y: this.y - 45,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      }
    });

    return this.value;
  }

  update(roadSpeed, deltaSeconds, playerX, playerY, magnetActive) {
    if (this.isCollected) return;

    // If magnet is active and coin is in range, pull towards player
    if (magnetActive) {
      const dx = playerX - this.x;
      const dy = playerY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < CONFIG.POWERUPS.MAGNET.radius) {
        const pullFactor = CONFIG.POWERUPS.MAGNET.pullSpeed * deltaSeconds;
        this.x += (dx / dist) * pullFactor;
        this.y += (dy / dist) * pullFactor;
        return;
      }
    }

    this.y += roadSpeed * deltaSeconds;
  }
}

export class PowerUpItem extends Phaser.GameObjects.Container {
  constructor(scene, x, y, type = 'shield', lane = 1) {
    super(scene, x, y);
    this.scene = scene;
    this.type = type; // 'shield', 'magnet', 'boost'
    this.lane = lane;
    this.isCollected = false;

    // Sprite texture lookup
    const key = `powerup_${type}`;
    this.sprite = scene.add.image(0, 0, key);
    this.add(this.sprite);

    // Floating bobbing effect
    scene.tweens.add({
      targets: this.sprite,
      y: -6,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Physics
    scene.physics.world.enable(this);
    this.body.setSize(48, 48);
    this.body.setOffset(-24, -24);

    scene.add.existing(this);
  }

  collect() {
    if (this.isCollected) return null;
    this.isCollected = true;

    // Sparkle burst
    this.scene.spawnConfetti(this.x, this.y);

    this.scene.tweens.add({
      targets: this,
      scaleX: 1.4,
      scaleY: 1.4,
      alpha: 0,
      duration: 220,
      onComplete: () => {
        this.destroy();
      }
    });

    return this.type;
  }

  update(roadSpeed, deltaSeconds) {
    if (this.isCollected) return;
    this.y += roadSpeed * deltaSeconds;
  }
}

