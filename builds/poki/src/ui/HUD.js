/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Responsive Heads-Up Display (HUD)
 */

import { CONFIG } from '../core/Config.js';
import { SoundFX } from '../core/AudioSystem.js';

export class HUD {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(100); // Always on top

    // --- Top Bar: Score & Coins ---
    this.scoreCard = scene.add.container(24, 28);
    this.container.add(this.scoreCard);

    // Score background pill
    const scoreBg = scene.add.graphics();
    scoreBg.fillStyle(0x000000, 0.65);
    scoreBg.fillRoundedRect(0, 0, 160, 48, 12);
    scoreBg.lineStyle(2, 0xFFD54F, 0.8);
    scoreBg.strokeRoundedRect(0, 0, 160, 48, 12);
    this.scoreCard.add(scoreBg);

    // Score Title & Value
    const scoreTitle = scene.add.text(14, 6, 'SCORE', {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#FFD54F'
    });
    this.scoreCard.add(scoreTitle);

    this.scoreText = scene.add.text(14, 20, '0', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontWeight: '900',
      color: '#FFFFFF'
    });
    this.scoreCard.add(this.scoreText);

    // Coin Card
    this.coinCard = scene.add.container(196, 28);
    this.container.add(this.coinCard);

    const coinBg = scene.add.graphics();
    coinBg.fillStyle(0x000000, 0.65);
    coinBg.fillRoundedRect(0, 0, 120, 48, 12);
    coinBg.lineStyle(2, 0xFFC107, 0.8);
    coinBg.strokeRoundedRect(0, 0, 120, 48, 12);
    this.coinCard.add(coinBg);

    const coinIcon = scene.add.image(22, 24, 'pickup_coin');
    coinIcon.setScale(0.65);
    this.coinCard.add(coinIcon);

    this.coinText = scene.add.text(42, 14, '0', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontWeight: '900',
      color: '#FFD54F'
    });
    this.coinCard.add(this.coinText);

    // Pause Button (Top Right)
    this.pauseBtn = scene.add.container(0, 28);
    this.container.add(this.pauseBtn);

    const pauseBg = scene.add.graphics();
    pauseBg.fillStyle(0x000000, 0.65);
    pauseBg.fillRoundedRect(0, 0, 48, 48, 12);
    pauseBg.lineStyle(2, 0xFFFFFF, 0.8);
    pauseBg.strokeRoundedRect(0, 0, 48, 48, 12);
    this.pauseBtn.add(pauseBg);

    // Pause bars icon
    const pauseG = scene.add.graphics();
    pauseG.fillStyle(0xFFFFFF, 1);
    pauseG.fillRect(16, 14, 5, 20);
    pauseG.fillRect(27, 14, 5, 20);
    this.pauseBtn.add(pauseG);

    // Pause button interactive
    pauseBg.setInteractive(new Phaser.Geom.Rectangle(0, 0, 48, 48), Phaser.Geom.Rectangle.Contains);
    pauseBg.on('pointerdown', (ptr) => {
      ptr.event.stopPropagation();
      SoundFX.playClick();
      this.scene.pauseGame();
    });

    // --- Active Mission Card (Middle Top) ---
    this.missionCard = scene.add.container(0, 88);
    this.missionCard.setVisible(false);
    this.container.add(this.missionCard);

    this.missionBg = scene.add.graphics();
    this.missionCard.add(this.missionBg);

    this.missionIcon = scene.add.image(-100, 0, 'icon_tea');
    this.missionIcon.setScale(0.65);
    this.missionCard.add(this.missionIcon);

    this.missionTitleText = scene.add.text(-65, -18, 'DESTINATION', {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#FFE082'
    });
    this.missionCard.add(this.missionTitleText);

    this.missionNameText = scene.add.text(-65, -4, 'Tea Shop', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#FFFFFF'
    });
    this.missionCard.add(this.missionNameText);

    this.missionProgressG = scene.add.graphics();
    this.missionCard.add(this.missionProgressG);

    // --- Combo Multiplier Badge ---
    this.comboBadge = scene.add.container(0, 160);
    this.comboBadge.setVisible(false);
    this.container.add(this.comboBadge);

    this.comboBg = scene.add.graphics();
    this.comboBg.fillStyle(0xFF9100, 0.9);
    this.comboBg.fillRoundedRect(-50, -16, 100, 32, 16);
    this.comboBadge.add(this.comboBg);

    this.comboText = scene.add.text(0, 0, 'x2 COMBO', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontWeight: '900',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    this.comboBadge.add(this.comboText);

    // --- Power-Up Gauges ---
    this.powerupContainer = scene.add.container(24, 88);
    this.container.add(this.powerupContainer);
    this.powerupGraphics = scene.add.graphics();
    this.powerupContainer.add(this.powerupGraphics);

    // --- Bottom Controls: Horn Button (Thumb reach) ---
    this.hornBtnContainer = scene.add.container(0, 0);
    this.container.add(this.hornBtnContainer);

    this.hornBtn = scene.add.image(0, 0, 'ui_horn_btn');
    this.hornBtn.setScale(0.9);
    this.hornBtnContainer.add(this.hornBtn);

    // Horn cooldown overlay
    this.hornCooldownG = scene.add.graphics();
    this.hornBtnContainer.add(this.hornCooldownG);

    // Interactivity for Horn Button
    this.hornBtn.setInteractive(new Phaser.Geom.Circle(0, 0, 44), Phaser.Geom.Circle.Contains);
    this.hornBtn.on('pointerdown', (ptr) => {
      ptr.event.stopPropagation();
      this.scene.triggerHorn();
    });

    this.layout();
  }

  layout() {
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;

    // Responsive Top Bar positioning
    if (w < 440) {
      this.scoreCard.x = 12;
      this.scoreCard.y = 20;
      this.coinCard.x = 144;
      this.coinCard.y = 20;
      this.pauseBtn.x = w - 54;
      this.pauseBtn.y = 20;
    } else {
      this.scoreCard.x = 24;
      this.scoreCard.y = 28;
      this.coinCard.x = 196;
      this.coinCard.y = 28;
      this.pauseBtn.x = w - 68;
      this.pauseBtn.y = 28;
    }

    // Mission Card centered near top
    this.missionCard.x = w / 2;
    this.missionCard.y = (w < 440) ? 78 : 88;

    // Draw Mission Card background (adaptive width)
    const cardHalfW = Math.min(140, (w - 40) / 2);
    this.missionBg.clear();
    this.missionBg.fillStyle(0x000000, 0.75);
    this.missionBg.fillRoundedRect(-cardHalfW, -28, cardHalfW * 2, 56, 14);
    this.missionBg.lineStyle(2, 0x4CAF50, 0.8);
    this.missionBg.strokeRoundedRect(-cardHalfW, -28, cardHalfW * 2, 56, 14);

    // Combo badge centered below mission
    this.comboBadge.x = w / 2;
    this.comboBadge.y = (w < 440) ? 146 : 160;

    // Horn Button position: bottom right for easy 1-thumb thumb press
    this.hornBtnContainer.x = w - 68;
    this.hornBtnContainer.y = h - 76;
  }

  update(score, coins, activeMission, missionProgress, combo, player, currentTime) {
    // 1. Update Score & Coins
    this.scoreText.setText(Math.floor(score).toLocaleString());
    this.coinText.setText(coins.toLocaleString());

    // 2. Update Active Mission Card
    if (activeMission) {
      this.missionCard.setVisible(true);
      this.missionIcon.setTexture(activeMission.destination.iconKey);
      this.missionNameText.setText(activeMission.destination.name);

      // Draw mission progress bar
      const g = this.missionProgressG;
      g.clear();
      g.fillStyle(0x424242, 0.8);
      g.fillRoundedRect(-65, 12, 160, 6, 3);
      g.fillStyle(activeMission.destination.themeColor, 1);
      g.fillRoundedRect(-65, 12, Math.max(8, 160 * missionProgress), 6, 3);
    } else {
      this.missionCard.setVisible(false);
    }

    // 3. Update Combo Indicator
    if (combo > 1) {
      this.comboBadge.setVisible(true);
      this.comboText.setText(`x${combo} COMBO!`);
    } else {
      this.comboBadge.setVisible(false);
    }

    // 4. Update Power-Up Gauges
    const pg = this.powerupGraphics;
    pg.clear();
    let pY = 0;

    if (player.hasActiveShield()) {
      const pct = player.shieldTimer / CONFIG.POWERUPS.SHIELD.durationMs;
      pg.fillStyle(0xFFA000, 0.8);
      pg.fillRoundedRect(0, pY, 120 * pct, 8, 4);
      pY += 14;
    }

    if (player.hasActiveMagnet()) {
      const pct = player.magnetTimer / CONFIG.POWERUPS.MAGNET.durationMs;
      pg.fillStyle(0xE91E63, 0.8);
      pg.fillRoundedRect(0, pY, 120 * pct, 8, 4);
      pY += 14;
    }

    if (player.hasActiveBoost()) {
      const pct = player.boostTimer / CONFIG.POWERUPS.BOOST.durationMs;
      pg.fillStyle(0x00E676, 0.8);
      pg.fillRoundedRect(0, pY, 120 * pct, 8, 4);
    }

    // 5. Update Horn Cooldown Indicator
    const hg = this.hornCooldownG;
    hg.clear();
    const cdProgress = player.getHornCooldownProgress(currentTime);

    if (cdProgress < 1.0) {
      // Draw radial cooldown wedge
      hg.fillStyle(0x000000, 0.55);
      hg.beginPath();
      hg.moveTo(0, 0);
      hg.arc(0, 0, 42, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cdProgress), false);
      hg.closePath();
      hg.fill();
      this.hornBtn.setAlpha(0.65);
    } else {
      this.hornBtn.setAlpha(1.0);
    }
  }

  onResize() {
    this.layout();
  }
}

