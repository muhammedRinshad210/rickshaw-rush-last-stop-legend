/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Near-Miss Geometric Skill System
 */

import { CONFIG } from '../core/Config.js';
import { SoundFX } from '../core/AudioSystem.js';

export class NearMissSystem {
  constructor(scene) {
    this.scene = scene;
    this.combo = 1;
    this.comboTimer = 0;
    this.totalNearMisses = 0;

    this.calloutPhrases = [
      'NICE DODGE!',
      'CLOSE CALL!',
      'RISKY DRIFT!',
      'KERALA PRO!',
      'LEGENDARY!'
    ];
  }

  reset() {
    this.combo = 1;
    this.comboTimer = 0;
    this.totalNearMisses = 0;
  }

  update(delta, player, obstacles) {
    if (!player.isAlive) {
      this.combo = 1;
      this.comboTimer = 0;
      return;
    }

    // Handle combo timeout
    if (this.combo > 1) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.combo = 1;
      }
    }

    // Geometric proximity evaluation against active obstacles
    const playerBounds = player.getBounds();

    for (let i = 0; i < obstacles.length; i++) {
      const obs = obstacles[i];
      if (!obs.active || obs.hasNearMissed || obs.isScared) continue;

      const obsBounds = obs.getBounds();

      // Check vertical alignment: obstacle is passing alongside the player
      const verticalOverlap = (
        obsBounds.bottom > playerBounds.top &&
        obsBounds.top < playerBounds.bottom
      );

      if (verticalOverlap) {
        // Calculate lateral gap between hitboxes
        const gapLeft = playerBounds.left - obsBounds.right;
        const gapRight = obsBounds.left - playerBounds.right;
        const lateralGap = Math.max(gapLeft, gapRight);

        // Near miss triggers if gap is positive (no collision) and within threshold
        if (lateralGap > 4 && lateralGap <= CONFIG.NEAR_MISS.DISTANCE_THRESHOLD) {
          this.triggerNearMiss(player, obs);
        }
      }
    }
  }

  triggerNearMiss(player, obs) {
    obs.hasNearMissed = true;
    this.totalNearMisses++;

    // Increment combo up to max
    this.combo = Math.min(CONFIG.NEAR_MISS.MAX_COMBO, this.combo + 1);
    this.comboTimer = CONFIG.NEAR_MISS.COMBO_TIMEOUT_MS;

    const points = CONFIG.NEAR_MISS.BASE_POINTS * this.combo;

    // Audio cue with combo pitch modulation
    SoundFX.playNearMiss(this.combo);

    // Visual callout text
    const phrase = this.calloutPhrases[this.combo - 1] || 'NICE DODGE!';
    const displayText = `${phrase}\n+${points} [${this.combo}x]`;

    this.scene.spawnFloatingText(player.x, player.y - 60, displayText, 0xFFEB3B);

    // Particle sparks from the near-miss side
    const sideX = obs.x > player.x ? player.x + 35 : player.x - 35;
    this.scene.spawnNearMissSparks(sideX, player.y);

    // Notify scene of points award & challenges
    this.scene.addScore(points);
    if (this.scene.onNearMissAchieved) {
      this.scene.onNearMissAchieved(this.combo);
    }
  }

  onPlayerCrash() {
    this.combo = 1;
    this.comboTimer = 0;
  }
}

