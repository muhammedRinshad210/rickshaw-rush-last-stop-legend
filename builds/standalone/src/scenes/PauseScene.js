/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Pause Overlay Scene
 */

import { SoundFX } from '../core/AudioSystem.js';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;
    const w = this.scale.width;
    const h = this.scale.height;

    // Dark backdrop overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.75);
    overlay.fillRect(0, 0, w, h);

    // Modal Card
    const card = this.add.container(cx, cy);

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x1B2631, 0.95);
    cardBg.fillRoundedRect(-140, -160, 280, 320, 20);
    cardBg.lineStyle(3, 0xFFD54F, 1);
    cardBg.strokeRoundedRect(-140, -160, 280, 320, 20);
    card.add(cardBg);

    // Title
    const title = this.add.text(0, -110, 'PAUSED', {
      fontFamily: 'sans-serif',
      fontSize: '28px',
      fontWeight: '900',
      color: '#FFEB3B'
    }).setOrigin(0.5);
    card.add(title);

    // 1. Resume Button
    this.createButton(card, 0, -35, 'RESUME', 0x2E7D32, 0x4CAF50, 190, 48, () => {
      SoundFX.playClick();
      const gameScene = this.scene.get('GameScene');
      if (gameScene) {
        gameScene.resumeGame();
      }
      this.scene.stop();
    });

    // 2. Restart Button
    this.createButton(card, 0, 30, 'RESTART', 0xC62828, 0xE53935, 190, 48, () => {
      SoundFX.playClick();
      this.scene.stop();
      this.scene.stop('GameScene');
      this.scene.start('GameScene');
    });

    // 3. Main Menu Button
    this.createButton(card, 0, 95, 'MAIN MENU', 0x1565C0, 0x1E88E5, 190, 48, () => {
      SoundFX.playClick();
      this.scene.stop();
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    });
  }

  createButton(parent, x, y, text, colorDark, colorLight, width, height, onClick) {
    const btn = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(colorDark, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 14);
    bg.lineStyle(2, colorLight, 1);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 14);
    btn.add(bg);

    const label = this.add.text(0, 0, text, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    btn.add(label);

    bg.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    bg.on('pointerdown', onClick);

    bg.on('pointerover', () => btn.setScale(1.05));
    bg.on('pointerout', () => btn.setScale(1.0));

    parent.add(btn);
  }
}

