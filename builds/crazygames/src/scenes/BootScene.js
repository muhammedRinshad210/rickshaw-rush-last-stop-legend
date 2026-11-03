/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Boot & Asset Generation Scene
 */

import { AssetFactory } from '../core/AssetFactory.js';
import { Storage } from '../core/Storage.js';
import { SoundFX } from '../core/AudioSystem.js';
import { PlatformManager } from '../platform/PlatformManager.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    // 1. Generate all procedural vector graphics
    AssetFactory.generateAll(this);

    // 2. Platform Lifecycle: Game loading finished / ready for interaction
    PlatformManager.current.gameReady();

    // 2. Setup user interaction listener to unlock Web Audio on first tap/click/key
    const unlockAudio = () => {
      SoundFX.init();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });

    // 3. Transition to target scene (default: MenuScene)
    let targetScene = 'MenuScene';
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const sc = params.get('scene');
      if (sc === 'game') targetScene = 'GameScene';
      else if (sc === 'garage') targetScene = 'GarageScene';
      else if (sc === 'gameover') targetScene = 'GameOverScene';
    }
    this.scene.start(targetScene);
  }
}

