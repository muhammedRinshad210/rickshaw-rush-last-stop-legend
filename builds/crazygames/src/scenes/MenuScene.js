/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Main Menu & Title Scene
 */

import { CONFIG } from '../core/Config.js';
import { Storage } from '../core/Storage.js';
import { SoundFX } from '../core/AudioSystem.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;
    const w = this.scale.width;
    const h = this.scale.height;

    // Background: Warm Kerala sunset gradient / village road backdrop
    this.bg = this.add.graphics();
    this.drawBackground(w, h);

    // Decorative Coconut Palms framing the menu
    this.palmL = this.add.image(w * 0.1, h * 0.2, 'scenery_palm').setScale(1.2).setAlpha(0.7);
    this.palmR = this.add.image(w * 0.9, h * 0.25, 'scenery_palm').setScale(1.3).setAlpha(0.7);

    // Main Title Banner
    this.titleContainer = this.add.container(cx, h * 0.18);

    // Malayalam header flourish
    const subTitleML = this.add.text(0, -56, 'ഓട്ടോ റഷ് : ലാസ്റ്റ് സ്റ്റോപ്പ്', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#FFD54F'
    }).setOrigin(0.5);
    this.titleContainer.add(subTitleML);

    // Big Arcade Title
    const titleMain = this.add.text(0, -18, 'RICKSHAW RUSH', {
      fontFamily: 'sans-serif',
      fontSize: '36px',
      fontWeight: '900',
      color: '#FFF8E1',
      stroke: '#D32F2F',
      strokeThickness: 8,
      shadow: { offsetX: 3, offsetY: 4, color: '#000000', blur: 4, fill: true }
    }).setOrigin(0.5);
    this.titleContainer.add(titleMain);

    const titleSub = this.add.text(0, 26, 'LAST STOP LEGEND', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontWeight: '900',
      color: '#FFEB3B',
      stroke: '#1B5E20',
      strokeThickness: 5
    }).setOrigin(0.5);
    this.titleContainer.add(titleSub);

    const tagline = this.add.text(0, 56, 'PICK UP. DODGE. DELIVER. REPEAT.', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      fontWeight: 'bold',
      color: '#ECEFF1',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 4 }
    }).setOrigin(0.5);
    this.titleContainer.add(tagline);

    // Title slight floating tween
    this.tweens.add({
      targets: this.titleContainer,
      y: h * 0.18 - 8,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Centerpiece: Animated Auto-Rickshaw preview with selected skin
    const selectedSkinId = Storage.getSelectedSkin();
    this.autoPreview = this.add.image(cx, h * 0.44, `rickshaw_${selectedSkinId}`);
    this.autoPreview.setScale(1.2);

    // Rickshaw gentle rumbling animation
    this.tweens.add({
      targets: this.autoPreview,
      y: h * 0.44 - 6,
      rotation: 0.04,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Best Score & Coins Badge
    const highScore = Storage.getHighScore();
    const totalCoins = Storage.getCoins();

    const scoreCard = this.add.container(cx, h * 0.55);
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x000000, 0.6);
    cardBg.fillRoundedRect(-160, -26, 320, 52, 14);
    cardBg.lineStyle(2, 0xFFC107, 0.8);
    cardBg.strokeRoundedRect(-160, -26, 320, 52, 14);
    scoreCard.add(cardBg);

    const hsText = this.add.text(-80, 0, `BEST: ${highScore}`, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#FFD54F'
    }).setOrigin(0.5);
    scoreCard.add(hsText);

    const coinIcon = this.add.image(40, 0, 'pickup_coin').setScale(0.55);
    scoreCard.add(coinIcon);

    const coinsText = this.add.text(85, 0, `${totalCoins}`, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    scoreCard.add(coinsText);

    // Mode Selector: NORMAL DRIVE vs MONSOON DRIVE
    this.selectedMode = Storage.getDriveMode();
    this.createModeSelector(cx, h * 0.63);

    // Action Buttons: START GAME & GARAGE & HOW TO PLAY
    this.createButton(cx, h * 0.71, 'START DRIVE', 0x2E7D32, 0x4CAF50, 240, 52, () => {
      SoundFX.playClick();
      if (!Storage.hasSeenTutorial()) {
        this.showTutorial(true);
      } else {
        this.scene.start('GameScene', { mode: this.selectedMode });
      }
    });

    this.createButton(cx - 70, h * 0.80, 'GARAGE', 0x1565C0, 0x1E88E5, 125, 42, () => {
      SoundFX.playClick();
      this.scene.start('GarageScene');
    });

    this.createButton(cx + 70, h * 0.80, 'HOW TO PLAY', 0xF57C00, 0xFFA000, 135, 42, () => {
      SoundFX.playClick();
      this.showTutorial(false);
    });

    // Bottom Controls Info
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const helpMsg = isTouch ? 'SWIPE / TAP SIDES TO STEER • TAP HORN TO SCARE COWS' : 'ARROW KEYS / A-D TO STEER • SPACE/H FOR HORN';
    this.add.text(cx, h * 0.89, helpMsg, {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#FFFFFFCC',
      align: 'center'
    }).setOrigin(0.5);

    // Sound Toggle Button (Top Right)
    this.createSoundToggle(w - 38, 38);

    // Listen to resize & lifecycle cleanup
    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.onResize, this);
    });
    this.events.once('destroy', () => {
      this.scale.off('resize', this.onResize, this);
    });

    // Auto-show tutorial on very first launch
    if (!Storage.hasSeenTutorial()) {
      this.time.delayedCall(400, () => this.showTutorial(false));
    }
  }

  createModeSelector(x, y) {
    const container = this.add.container(x, y);

    const normalBtn = this.add.container(-68, 0);
    const monsoonBtn = this.add.container(68, 0);

    const normalBg = this.add.graphics();
    const monsoonBg = this.add.graphics();

    normalBtn.add(normalBg);
    monsoonBtn.add(monsoonBg);

    const normalText = this.add.text(0, 0, '☀️ NORMAL', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontWeight: '900',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    normalBtn.add(normalText);

    const monsoonText = this.add.text(0, 0, '🌧️ MONSOON', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontWeight: '900',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    monsoonBtn.add(monsoonText);

    const drawPills = () => {
      const isMonsoon = this.selectedMode === CONFIG.DRIVE_MODES.MONSOON;

      // Normal Pill
      normalBg.clear();
      normalBg.fillStyle(isMonsoon ? 0x263238 : 0x2E7D32, isMonsoon ? 0.7 : 1);
      normalBg.fillRoundedRect(-60, -17, 120, 34, 10);
      normalBg.lineStyle(2, isMonsoon ? 0x455A64 : 0x4CAF50, 1);
      normalBg.strokeRoundedRect(-60, -17, 120, 34, 10);
      normalBtn.setAlpha(isMonsoon ? 0.65 : 1.0);

      // Monsoon Pill
      monsoonBg.clear();
      monsoonBg.fillStyle(isMonsoon ? 0x00695C : 0x263238, isMonsoon ? 1 : 0.7);
      monsoonBg.fillRoundedRect(-60, -17, 120, 34, 10);
      monsoonBg.lineStyle(2, isMonsoon ? 0x00E5FF : 0x455A64, 1);
      monsoonBg.strokeRoundedRect(-60, -17, 120, 34, 10);
      monsoonBtn.setAlpha(isMonsoon ? 1.0 : 0.65);
    };

    drawPills();

    normalBg.setInteractive(new Phaser.Geom.Rectangle(-60, -17, 120, 34), Phaser.Geom.Rectangle.Contains);
    normalBg.on('pointerdown', () => {
      SoundFX.playClick();
      this.selectedMode = CONFIG.DRIVE_MODES.NORMAL;
      Storage.setDriveMode(this.selectedMode);
      drawPills();
    });

    monsoonBg.setInteractive(new Phaser.Geom.Rectangle(-60, -17, 120, 34), Phaser.Geom.Rectangle.Contains);
    monsoonBg.on('pointerdown', () => {
      SoundFX.playClick();
      this.selectedMode = CONFIG.DRIVE_MODES.MONSOON;
      Storage.setDriveMode(this.selectedMode);
      drawPills();
    });

    container.add([normalBtn, monsoonBtn]);
    this.modeSelectorContainer = container;
  }

  showTutorial(startAfter = false) {
    if (this.tutorialContainer) {
      this.tutorialContainer.destroy();
    }

    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;
    const w = this.scale.width;
    const h = this.scale.height;

    this.tutorialContainer = this.add.container(cx, cy);
    this.tutorialContainer.setDepth(300);

    // Backdrop
    const backdrop = this.add.graphics();
    backdrop.fillStyle(0x000000, 0.82);
    backdrop.fillRect(-w / 2, -cy, w, h);
    backdrop.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -cy, w, h), Phaser.Geom.Rectangle.Contains);
    this.tutorialContainer.add(backdrop);

    // Card background
    const cardW = Math.min(360, w - 32);
    const cardH = 460;
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x1B2631, 0.98);
    cardBg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);
    cardBg.lineStyle(3, 0xFFD54F, 1);
    cardBg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);
    this.tutorialContainer.add(cardBg);

    // Title
    const title = this.add.text(0, -cardH / 2 + 28, 'HOW TO PLAY', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      fontWeight: '900',
      color: '#FFEB3B'
    }).setOrigin(0.5);
    this.tutorialContainer.add(title);

    // 4 Instructions
    const tips = [
      {
        icon: '↔️',
        title: 'STEER AUTO',
        desc: 'Swipe / tap left or right (or A/D / Arrows) to switch lanes and dodge Kerala traffic.'
      },
      {
        icon: '📯',
        title: 'USE HORN',
        desc: 'Tap the Horn button (or Space/H) to honk and scare cows safely off the road!'
      },
      {
        icon: '🙋',
        title: 'PASSENGER FARES',
        desc: 'Pull into roadside passengers to pick them up, then deliver to glowing drop-off bays!'
      },
      {
        icon: '☕',
        title: 'CHAYA SHIELD',
        desc: 'Collect tea cups for a 3s shield (absorbs 1 crash!), magnets, and turbo speed boost!'
      }
    ];

    let startY = -cardH / 2 + 76;
    tips.forEach(tip => {
      const icon = this.add.text(-cardW / 2 + 28, startY + 6, tip.icon, {
        fontSize: '20px'
      }).setOrigin(0.5);
      this.tutorialContainer.add(icon);

      const tTitle = this.add.text(-cardW / 2 + 50, startY, tip.title, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        fontWeight: '900',
        color: '#FFD54F'
      });
      this.tutorialContainer.add(tTitle);

      const tDesc = this.add.text(-cardW / 2 + 50, startY + 16, tip.desc, {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: '#ECEFF1',
        wordWrap: { width: cardW - 75 }
      });
      this.tutorialContainer.add(tDesc);

      startY += 62;
    });

    // Close / Start Button
    const btnLabel = startAfter ? 'LET’S DRIVE!' : 'GOT IT!';
    const closeBtn = this.createButton(0, cardH / 2 - 38, btnLabel, 0x2E7D32, 0x4CAF50, 180, 44, () => {
      SoundFX.playClick();
      Storage.setTutorialSeen();
      this.tutorialContainer.destroy();
      this.tutorialContainer = null;
      if (startAfter) {
        this.scene.start('GameScene');
      }
    });
    this.tutorialContainer.add(closeBtn);
  }

  createButton(x, y, text, colorDark, colorLight, width, height, onClick) {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(colorDark, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 16);
    bg.lineStyle(3, colorLight, 1);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 16);
    container.add(bg);

    const label = this.add.text(0, 0, text, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontWeight: '900',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    container.add(label);

    bg.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    bg.on('pointerdown', onClick);

    // Hover scale effect
    bg.on('pointerover', () => {
      container.setScale(1.05);
    });
    bg.on('pointerout', () => {
      container.setScale(1.0);
    });

    return container;
  }

  createSoundToggle(x, y) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.6);
    bg.fillCircle(0, 0, 22);
    bg.lineStyle(2, 0xFFD54F, 1);
    bg.strokeCircle(0, 0, 22);
    container.add(bg);

    const icon = this.add.text(0, 0, SoundFX.isMuted ? '🔇' : '🔊', {
      fontSize: '18px'
    }).setOrigin(0.5);
    container.add(icon);

    bg.setInteractive(new Phaser.Geom.Circle(0, 0, 22), Phaser.Geom.Circle.Contains);
    bg.on('pointerdown', (ptr) => {
      ptr.event.stopPropagation();
      const muted = SoundFX.toggleMute();
      icon.setText(muted ? '🔇' : '🔊');
    });
  }

  drawBackground(w, h) {
    const g = this.bg;
    g.clear();
    // Warm tropical sky gradient
    g.fillGradientStyle(0xE65100, 0xE65100, 0x1B5E20, 0x1B5E20, 1);
    g.fillRect(0, 0, w, h);

    // Road strip in center
    const roadW = Math.min(420, w * 0.7);
    const roadX = (w - roadW) / 2;
    g.fillStyle(0x263238, 0.9);
    g.fillRect(roadX, 0, roadW, h);

    // Yellow road markings
    g.fillStyle(0xFFEB3B, 0.7);
    g.fillRect(w / 2 - 3, 0, 6, h);
  }

  onResize(gameSize) {
    this.drawBackground(gameSize.width, gameSize.height);
  }
}

