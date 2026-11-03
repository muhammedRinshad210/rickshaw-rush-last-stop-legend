/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Rickshaw Garage & Cosmetic Customization Scene
 */

import { CONFIG } from '../core/Config.js';
import { Storage } from '../core/Storage.js';
import { SoundFX } from '../core/AudioSystem.js';

export class GarageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GarageScene' });
  }

  create() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;
    const w = this.scale.width;
    const h = this.scale.height;

    this.currentIndex = 0;
    const selectedSkinId = Storage.getSelectedSkin();
    const foundIdx = CONFIG.SKINS.findIndex(s => s.id === selectedSkinId);
    if (foundIdx >= 0) this.currentIndex = foundIdx;

    // Workshop garage background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x212121, 0x212121, 0x0D1B2A, 0x0D1B2A, 1);
    bg.fillRect(0, 0, w, h);

    // Header Title
    this.add.text(cx, h * 0.1, 'RICKSHAW GARAGE', {
      fontFamily: 'sans-serif',
      fontSize: '24px',
      fontWeight: '900',
      color: '#FFD54F'
    }).setOrigin(0.5);

    // Total Coins Pill (Top Right)
    this.coinsContainer = this.add.container(w - 75, h * 0.1);
    const coinBg = this.add.graphics();
    coinBg.fillStyle(0x000000, 0.65);
    coinBg.fillRoundedRect(-55, -16, 110, 32, 16);
    coinBg.lineStyle(2, 0xFFC107, 1);
    coinBg.strokeRoundedRect(-55, -16, 110, 32, 16);
    this.coinsContainer.add(coinBg);

    const coinIcon = this.add.image(-32, 0, 'pickup_coin').setScale(0.5);
    this.coinsContainer.add(coinIcon);

    this.coinsText = this.add.text(5, 0, `${Storage.getCoins()}`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#FFD54F'
    }).setOrigin(0.5);
    this.coinsContainer.add(this.coinsText);

    // Central Vehicle Showcase Platform
    const platformG = this.add.graphics();
    platformG.fillStyle(0x1B2631, 0.9);
    platformG.fillEllipse(cx, h * 0.46, 180, 70);
    platformG.lineStyle(3, 0x00E5FF, 0.7);
    platformG.strokeEllipse(cx, h * 0.46, 180, 70);

    // Auto-Rickshaw Preview Sprite
    this.autoSprite = this.add.image(cx, h * 0.42, `rickshaw_${CONFIG.SKINS[this.currentIndex].id}`);
    this.autoSprite.setScale(1.5);

    this.tweens.add({
      targets: this.autoSprite,
      y: h * 0.42 - 6,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Arrow Navigation Controls (Left & Right)
    this.createArrowBtn(cx - 130, h * 0.42, '<', () => this.navigate(-1));
    this.createArrowBtn(cx + 130, h * 0.42, '>', () => this.navigate(1));

    // Vehicle Info Card
    this.infoContainer = this.add.container(cx, h * 0.64);

    this.skinNameText = this.add.text(0, -32, '', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontWeight: '900',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    this.infoContainer.add(this.skinNameText);

    this.skinDescText = this.add.text(0, -6, '', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#B0BEC5',
      align: 'center',
      wordWrap: { width: 280 }
    }).setOrigin(0.5);
    this.infoContainer.add(this.skinDescText);

    // Equip / Unlock Action Button
    this.actionBtnContainer = this.add.container(cx, h * 0.78);

    // Back to Menu Button
    this.createButton(cx, h * 0.90, 'BACK TO MENU', 0x424242, 0x616161, 200, 44, () => {
      SoundFX.playClick();
      this.scene.start('MenuScene');
    });

    this.updateCard();
  }

  createArrowBtn(x, y, label, onClick) {
    const btn = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    bg.fillCircle(0, 0, 24);
    bg.lineStyle(2, 0xFFD54F, 1);
    bg.strokeCircle(0, 0, 24);
    btn.add(bg);

    const txt = this.add.text(0, 0, label, {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    btn.add(txt);

    bg.setInteractive(new Phaser.Geom.Circle(0, 0, 24), Phaser.Geom.Circle.Contains);
    bg.on('pointerdown', onClick);
    bg.on('pointerover', () => btn.setScale(1.1));
    bg.on('pointerout', () => btn.setScale(1.0));
  }

  createButton(x, y, text, colorDark, colorLight, width, height, onClick) {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(colorDark, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 14);
    bg.lineStyle(2, colorLight, 1);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 14);
    container.add(bg);

    const label = this.add.text(0, 0, text, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    container.add(label);

    bg.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    bg.on('pointerdown', onClick);

    bg.on('pointerover', () => container.setScale(1.05));
    bg.on('pointerout', () => container.setScale(1.0));

    return container;
  }

  navigate(direction) {
    SoundFX.playClick();
    this.currentIndex = (this.currentIndex + direction + CONFIG.SKINS.length) % CONFIG.SKINS.length;
    this.updateCard();
  }

  updateCard() {
    const skin = CONFIG.SKINS[this.currentIndex];
    this.autoSprite.setTexture(`rickshaw_${skin.id}`);

    this.skinNameText.setText(skin.name.toUpperCase());
    this.skinDescText.setText(skin.description);

    this.actionBtnContainer.removeAll(true);

    const isUnlocked = Storage.isSkinUnlocked(skin.id);
    const isEquipped = Storage.getSelectedSkin() === skin.id;
    const currentCoins = Storage.getCoins();

    if (isEquipped) {
      // Equipped Badge
      const bg = this.add.graphics();
      bg.fillStyle(0x1B5E20, 1);
      bg.fillRoundedRect(-110, -22, 220, 44, 14);
      bg.lineStyle(2, 0x4CAF50, 1);
      bg.strokeRoundedRect(-110, -22, 220, 44, 14);
      this.actionBtnContainer.add(bg);

      const label = this.add.text(0, 0, '✓ EQUIPPED', {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontWeight: '900',
        color: '#FFFFFF'
      }).setOrigin(0.5);
      this.actionBtnContainer.add(label);
    } else if (isUnlocked) {
      // Equip Button
      const btn = this.createButton(0, 0, 'EQUIP RICKSHAW', 0x1565C0, 0x42A5F5, 220, 44, () => {
        SoundFX.playClick();
        Storage.setSelectedSkin(skin.id);
        this.updateCard();
      });
      this.actionBtnContainer.add(btn);
    } else {
      // Unlock with Coins
      const canAfford = currentCoins >= skin.price;
      const btnText = canAfford ? `UNLOCK (${skin.price} COINS)` : `NEED ${skin.price - currentCoins} MORE COINS`;
      const darkCol = canAfford ? 0xE65100 : 0x37474F;
      const lightCol = canAfford ? 0xFFA000 : 0x546E7A;

      const btn = this.createButton(0, 0, btnText, darkCol, lightCol, 240, 46, () => {
        if (canAfford) {
          SoundFX.playPassengerDelivery();
          Storage.spendCoins(skin.price);
          Storage.unlockSkin(skin.id);
          Storage.setSelectedSkin(skin.id);
          this.coinsText.setText(`${Storage.getCoins()}`);
          this.updateCard();
        } else {
          SoundFX.playClick();
          this.cameras.main.shake(150, 0.01);
        }
      });
      this.actionBtnContainer.add(btn);
    }
  }
}

