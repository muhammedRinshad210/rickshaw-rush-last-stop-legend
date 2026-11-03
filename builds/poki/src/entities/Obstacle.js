/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Traffic Obstacles & Hazards
 */

import { CONFIG } from '../core/Config.js';
import { SoundFX } from '../core/AudioSystem.js';

export class Obstacle extends Phaser.GameObjects.Container {
  constructor(scene, x, y, type = 'bus', lane = 1) {
    super(scene, x, y);
    this.scene = scene;
    this.type = type;
    this.lane = lane;
    this.config = CONFIG.OBSTACLES[type.toUpperCase()] || CONFIG.OBSTACLES.BUS;

    // Sprite
    this.sprite = scene.add.image(0, 0, `obs_${type}`);
    this.add(this.sprite);

    // Dimensions
    this.width = this.config.width;
    this.height = this.config.height;

    // Physics body
    scene.physics.world.enable(this);
    const bw = this.width - this.config.hitboxPaddingX * 2;
    const bh = this.height - this.config.hitboxPaddingY * 2;
    this.body.setSize(bw, bh);
    this.body.setOffset(-bw / 2, -bh / 2);

    // States
    this.isScared = false; // Cow only
    this.hasNearMissed = false; // Prevents duplicate near-miss awards
    this.speedFactor = this.config.speedFactor; // Relative to road scroll
    this.active = true;

    scene.add.existing(this);
  }

  reset(x, y, type, lane) {
    // Kill any active tweens (e.g. unfinished cow scurry)
    this.scene.tweens.killTweensOf(this);

    this.x = x;
    this.y = y;
    this.type = type;
    this.lane = lane;
    this.config = CONFIG.OBSTACLES[type.toUpperCase()] || CONFIG.OBSTACLES.BUS;

    this.sprite.setTexture(`obs_${type}`);
    this.width = this.config.width;
    this.height = this.config.height;

    const bw = this.width - this.config.hitboxPaddingX * 2;
    const bh = this.height - this.config.hitboxPaddingY * 2;

    // Reset physics body and restore collision flag
    if (this.body) {
      this.body.enable = true;
      this.body.checkCollision.none = false;
      this.body.setSize(bw, bh);
      this.body.setOffset(-bw / 2, -bh / 2);
      this.body.reset(x, y);
    }

    this.isScared = false;
    this.hasNearMissed = false;
    this.speedFactor = this.config.speedFactor;
    this.active = true;
    this.setVisible(true);
    this.rotation = 0;
  }

  /* -------------------------------------------------------------
   * COW HORN REACTION MECHANIC
   * ----------------------------------------------------------- */
  reactToHorn() {
    if (this.type !== 'cow' || this.isScared) return false;

    this.isScared = true;
    SoundFX.playCowMoo();

    // Switch to scared cartoon face
    this.sprite.setTexture('obs_cow_scared');

    // Determine nearest roadside (left or right verge)
    const roadLeft = this.scene.roadLeftX;
    const roadRight = this.scene.roadRightX;
    const distToLeft = Math.abs(this.x - roadLeft);
    const distToRight = Math.abs(this.x - roadRight);
    const targetX = distToLeft < distToRight ? roadLeft - 30 : roadRight + 30;

    // Cow scurries off the road into the grass
    this.scene.tweens.add({
      targets: this,
      x: targetX,
      rotation: targetX < this.x ? -0.3 : 0.3,
      duration: 650,
      ease: 'Quad.easeInOut',
      onComplete: () => {
        // Move disable hitbox so lane is 100% free
        if (this.body) {
          this.body.checkCollision.none = true;
        }
      }
    });

    return true;
  }

  update(roadSpeed, deltaSeconds) {
    if (!this.active) return;

    // Movement relative to road scrolling speed
    // Downwards movement speed: road moves down at `roadSpeed`.
    // Slower vehicles / stationary obstacles move down faster on screen relative to player
    const effectiveSpeed = roadSpeed * (1 - this.speedFactor);
    this.y += effectiveSpeed * deltaSeconds;
  }
}

