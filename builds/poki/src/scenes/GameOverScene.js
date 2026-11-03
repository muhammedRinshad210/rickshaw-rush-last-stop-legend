/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Game Over Scene
 */

import { Storage } from '../core/Storage.js';
import { SoundFX } from '../core/AudioSystem.js';
import { PlatformManager } from '../platform/PlatformManager.js';

export class GameOverScene extends Phaser.Scene {
  static lastAdTime = 0;

  static shouldShowCommercialBreak() {
    if (PlatformManager.current && (PlatformManager.current.isBasicLaunch || PlatformManager.current.name === 'crazygames-basic')) {
      return false;
    }
    const now = Date.now();
    // Enforce 60s minimum interval between interstitial ads
    if (now - GameOverScene.lastAdTime > 60000) {
      GameOverScene.lastAdTime = now;
      return true;
    }
    return false;
  }

  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data) {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;
    const w = this.scale.width;
    const h = this.scale.height;

    // Dark red & black tint background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x3E2723, 0x3E2723, 0x1A1A1A, 0x1A1A1A, 1);
    bg.fillRect(0, 0, w, h);

    const score = (data && data.score !== undefined) ? data.score : 4850;
    const coins = (data && data.coins !== undefined) ? data.coins : 65;
    const passengers = (data && data.passengers !== undefined) ? data.passengers : 3;
    const distance = (data && data.distance !== undefined) ? data.distance : 1250;

    const previousBest = Storage.getHighScore();
    const isNewBest = score > previousBest;
    if (isNewBest) {
      Storage.setHighScore(score);
    }
    const currentBest = Storage.getHighScore();

    // Platform sync: submit score and save data
    PlatformManager.current.submitScore(score);
    PlatformManager.current.saveData('highScore', currentBest);
    PlatformManager.current.saveData('coins', Storage.getCoins());

    // Central Card
    const card = this.add.container(cx, cy);

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x000000, 0.85);
    cardBg.fillRoundedRect(-160, -230, 320, 460, 20);
    cardBg.lineStyle(3, isNewBest ? 0xFFEB3B : 0xD32F2F, 1);
    cardBg.strokeRoundedRect(-160, -230, 320, 460, 20);
    card.add(cardBg);

    // Header Title
    const title = this.add.text(0, -185, isNewBest ? '★ NEW RECORD! ★' : 'CRASHED!', {
      fontFamily: 'sans-serif',
      fontSize: '24px',
      fontWeight: '900',
      color: isNewBest ? '#FFEB3B' : '#FF5252'
    }).setOrigin(0.5);
    card.add(title);

    // Score display
    const scoreLabel = this.add.text(0, -135, 'FINAL SCORE', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      fontWeight: 'bold',
      color: '#B0BEC5'
    }).setOrigin(0.5);
    card.add(scoreLabel);

    const scoreVal = this.add.text(0, -106, `${score.toLocaleString()}`, {
      fontFamily: 'sans-serif',
      fontSize: '32px',
      fontWeight: '900',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    card.add(scoreVal);

    const bestVal = this.add.text(0, -74, `BEST: ${currentBest.toLocaleString()}`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#FFD54F'
    }).setOrigin(0.5);
    card.add(bestVal);

    // Divider line
    const divG = this.add.graphics();
    divG.lineStyle(1.5, 0x424242, 1);
    divG.lineBetween(-120, -50, 120, -50);
    card.add(divG);

    // Stats Grid
    const statRows = [
      { label: 'PASSENGERS DELIVERED', val: `${passengers}` },
      { label: 'COINS COLLECTED', val: `+${coins}` },
      { label: 'DISTANCE TRAVELED', val: `${distance} m` },
    ];

    statRows.forEach((st, idx) => {
      const y = -26 + idx * 26;
      const lbl = this.add.text(-120, y, st.label, {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#90A4AE'
      });
      card.add(lbl);

      const val = this.add.text(120, y, st.val, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        fontWeight: '900',
        color: '#FFFFFF'
      }).setOrigin(1, 0);
      card.add(val);
    });

    // Action Buttons: RETRY, REWARDED AD (if supported), GARAGE
    const hasRewardAd = PlatformManager.current.supportsRewardedAd();

    const retryY = hasRewardAd ? 78 : 90;
    const garageY = hasRewardAd ? 182 : 155;

    this.createButton(card, 0, retryY, 'RETRY DRIVE', 0x2E7D32, 0x4CAF50, 220, 44, async () => {
      SoundFX.playClick();
      if (GameOverScene.shouldShowCommercialBreak()) {
        await PlatformManager.current.showCommercialBreak();
      }
      this.scene.start('GameScene');
    });

    if (hasRewardAd) {
      const rewardBtn = this.createButton(card, 0, 132, '🎁 BONUS +50 COINS (AD)', 0xE65100, 0xFF9800, 220, 38, async () => {
        SoundFX.playClick();
        rewardBtn.setAlpha(0.6);
        const success = await PlatformManager.current.showRewardAd();
        if (success) {
          Storage.addCoins(50);
          SoundFX.playCoin();
          rewardBtn.destroy();
          const bonusText = this.add.text(0, 132, '✓ +50 COINS ADDED!', {
            fontFamily: 'sans-serif',
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#4CAF50'
          }).setOrigin(0.5);
          card.add(bonusText);
        } else {
          rewardBtn.setAlpha(1.0);
        }
      });
    }

    this.createButton(card, 0, garageY, 'GARAGE (SKINS)', 0x1565C0, 0x1E88E5, 220, 38, () => {
      SoundFX.playClick();
      this.scene.start('GarageScene');
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

