/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Game Bootstrap & Phaser Initialization
 */

import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { GarageScene } from './scenes/GarageScene.js';
import { PlatformManager } from './platform/PlatformManager.js';

async function bootstrap() {
  // 1. Initialize Active Platform Adapter
  const platform = await PlatformManager.init();

  // 2. Phaser 3 Game Configuration (Full Multi-Device Responsive)
  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#1A252F',
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%',
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      }
    },
    scene: [
      BootScene,
      MenuScene,
      GameScene,
      PauseScene,
      GameOverScene,
      GarageScene
    ],
    input: {
      activePointers: 3,
    },
    render: {
      pixelArt: false,
      antialias: true,
      powerPreference: 'high-performance',
    }
  };

  const game = new Phaser.Game(config);

  // Platform Lifecycle Hooks
  game.events.once('ready', () => {
    platform.firstFrameReady();
  });

  platform.onAudioChange((enabled) => {
    import('./core/AudioSystem.js').then(({ SoundFX }) => {
      SoundFX.setMuted(!enabled);
    });
  });

  platform.onPause(() => {
    const gameScene = game.scene.getScene('GameScene');
    if (gameScene && game.scene.isActive('GameScene')) {
      gameScene.pauseGame();
    }
  });

  platform.onResume(() => {
    const gameScene = game.scene.getScene('GameScene');
    if (gameScene && game.scene.isPaused('GameScene')) {
      gameScene.resumeGame();
    }
  });

  return game;
}

window.addEventListener('DOMContentLoaded', () => {
  bootstrap().catch(err => {
    console.error('Failed to start Rickshaw Rush:', err);
  });
});

