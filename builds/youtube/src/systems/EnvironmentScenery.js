/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Phase 2: Kerala World Expansion & Parallax Scenery
 * 5 Distinct Kerala Biomes: Village, Backwaters, Coast, Munnar Hills, Town at Night
 * Smooth 2.5s Crossfades, Animated Location Banners, and Dynamic Scenery Events.
 */

import { CONFIG } from '../core/Config.js';
import { SoundFX } from '../core/AudioSystem.js';
import { WeatherSystem } from './WeatherSystem.js';

export class EnvironmentScenery {
  constructor(scene) {
    this.scene = scene;

    // Biome Sequence State
    this.currentBiomeIndex = 0;
    this.targetBiomeIndex = 0;
    this.gameplayElapsedTime = 0; // Precise gameplay timer (ms)
    this.biomeTimer = 0;
    this.isTransitioning = false;
    this.transitionProgress = 1.0;
    this.transitionDuration = 2500; // 2.5s smooth crossfade

    // Dynamic Road Geometry & Colors
    this.activeColors = {
      asphalt: CONFIG.ENVIRONMENTS[0].asphaltColor,
      shoulder: CONFIG.ENVIRONMENTS[0].shoulderColor,
      curbA: CONFIG.ENVIRONMENTS[0].curbColorA,
      curbB: CONFIG.ENVIRONMENTS[0].curbColorB,
      lightTint: CONFIG.ENVIRONMENTS[0].lightTint,
      lightAlpha: CONFIG.ENVIRONMENTS[0].lightAlpha,
    };

    // Parallax Road scroll offsets
    this.roadScrollY = 0;
    this.oceanWavePhase = 0;
    this.waterfallMistPhase = 0;
    this.cloudScrollX = 0;

    // Scenery pools
    this.leftScenery = [];
    this.rightScenery = [];
    this.backdropScenery = [];
    this.driftingClouds = [];

    // Containers and Graphics layers
    this.farBackdropGraphics = scene.add.graphics();
    this.backdropContainer = scene.add.container(0, 0);
    this.roadGraphics = scene.add.graphics();
    this.sceneryContainer = scene.add.container(0, 0);
    this.weatherOverlay = scene.add.graphics();

    // Weather System (Kerala Monsoon Mode)
    this.weatherSystem = new WeatherSystem(scene, this);

    // Send visual layers to back in correct depth order
    scene.children.sendToBack(this.weatherOverlay);
    scene.children.sendToBack(this.sceneryContainer);
    scene.children.sendToBack(this.roadGraphics);
    scene.children.sendToBack(this.backdropContainer);
    scene.children.sendToBack(this.farBackdropGraphics);

    // Location Announcement Banner UI Container
    this.createLocationBanner();

    // Initialize Pools
    this.initSceneryObjects();

    // Trigger initial location announcement for Village
    this.triggerLocationBanner(CONFIG.ENVIRONMENTS[0]);
  }

  /* -------------------------------------------------------------
   * LOCATION ANNOUNCEMENT BANNER
   * ----------------------------------------------------------- */
  createLocationBanner() {
    const w = this.scene.scale.width;
    this.bannerContainer = this.scene.add.container(w / 2, -120);
    this.bannerContainer.setDepth(200); // Above gameplay HUD

    // Banner background card with golden border
    this.bannerBg = this.scene.add.graphics();
    this.bannerContainer.add(this.bannerBg);

    // Malayalam title text
    this.bannerMalayalam = this.scene.add.text(0, -18, '', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#FFD54F'
    }).setOrigin(0.5);
    this.bannerContainer.add(this.bannerMalayalam);

    // English region title
    this.bannerTitle = this.scene.add.text(0, 2, '', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontWeight: '900',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    this.bannerContainer.add(this.bannerTitle);

    // Subtitle description
    this.bannerSubtitle = this.scene.add.text(0, 22, '', {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#B2DFDB'
    }).setOrigin(0.5);
    this.bannerContainer.add(this.bannerSubtitle);
  }

  triggerLocationBanner(env) {
    const w = this.scene.scale.width;
    this.bannerContainer.x = w / 2;

    const bannerW = Math.min(340, w - 24);
    const fontScale = bannerW < 340 ? 0.85 : 1.0;

    this.bannerMalayalam.setText(env.malayalamName);
    this.bannerMalayalam.setFontSize(`${Math.floor(13 * fontScale)}px`);

    this.bannerTitle.setText(env.announcement);
    this.bannerTitle.setFontSize(`${Math.floor(15 * fontScale)}px`);

    this.bannerSubtitle.setText(env.subtitle);
    this.bannerSubtitle.setFontSize(`${Math.floor(9 * fontScale)}px`);

    // Draw stylized Kerala temple-arch card
    this.bannerBg.clear();
    this.bannerBg.fillStyle(0x000000, 0.85);
    this.bannerBg.fillRoundedRect(-bannerW / 2, -36, bannerW, 72, 16);
    this.bannerBg.lineStyle(3, 0xFFD54F, 1);
    this.bannerBg.strokeRoundedRect(-bannerW / 2, -36, bannerW, 72, 16);

    // Play gentle chime
    SoundFX.playLocationChime();

    // Slide down smoothly, stay, and slide up
    this.scene.tweens.killTweensOf(this.bannerContainer);
    this.bannerContainer.y = -120;

    this.scene.tweens.add({
      targets: this.bannerContainer,
      y: 118,
      duration: 600,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(2400, () => {
          this.scene.tweens.add({
            targets: this.bannerContainer,
            y: -120,
            duration: 500,
            ease: 'Back.easeIn'
          });
        });
      }
    });
  }

  refreshAllSceneryTextures(envId) {
    this.leftScenery.forEach(item => {
      item.setTexture(this.getTextureForBiome(envId, 'left'));
      this.positionSceneryItem(item, 'left');
    });
    this.rightScenery.forEach(item => {
      item.setTexture(this.getTextureForBiome(envId, 'right'));
      this.positionSceneryItem(item, 'right');
    });
  }

  /* -------------------------------------------------------------
   * SCENERY POOL INITIALIZATION
   * ----------------------------------------------------------- */
  initSceneryObjects() {
    // Populate roadside scenery pool (14 items on each shoulder)
    const count = 14;
    for (let i = 0; i < count; i++) {
      const itemL = this.createRandomSceneryItem('left', i * 140 - 200);
      const itemR = this.createRandomSceneryItem('right', i * 140 - 200);
      this.leftScenery.push(itemL);
      this.rightScenery.push(itemR);
    }

    // Drifting clouds for Munnar hills
    for (let i = 0; i < 4; i++) {
      const cloud = this.scene.add.image(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(40, this.scene.scale.height * 0.7),
        'scenery_cloud'
      );
      cloud.setScale(Phaser.Math.FloatBetween(0.8, 1.4));
      cloud.setAlpha(0);
      this.driftingClouds.push(cloud);
      this.backdropContainer.add(cloud);
    }
  }

  createRandomSceneryItem(side, initialY) {
    const biome = CONFIG.ENVIRONMENTS[this.currentBiomeIndex];
    const key = this.getTextureForBiome(biome.id, side);

    const item = this.scene.add.image(0, initialY, key);
    this.sceneryContainer.add(item);
    this.positionSceneryItem(item, side);
    return item;
  }

  getTextureForBiome(biomeId, side) {
    switch (biomeId) {
      case 'village': {
        const keys = [
          'scenery_palm',
          'scenery_house',
          'scenery_chaishop',
          'scenery_banana_tree',
          'scenery_electric_pole',
          'scenery_sign',
          'scenery_farmer',
          'scenery_village_cow'
        ];
        return Phaser.Utils.Array.GetRandom(keys);
      }
      case 'backwaters': {
        // Backwaters has water on one or both sides with houseboats & canoes
        if (side === 'left') {
          const keys = ['scenery_bridge_railing', 'scenery_palm', 'scenery_water_hyacinth', 'scenery_egret'];
          return Phaser.Utils.Array.GetRandom(keys);
        } else {
          const keys = ['scenery_houseboat', 'scenery_fishing_canoe', 'scenery_snake_boat', 'scenery_water_hyacinth', 'scenery_bridge_railing'];
          return Phaser.Utils.Array.GetRandom(keys);
        }
      }
      case 'coastal': {
        if (side === 'right') {
          // Ocean side: Lighthouse, Chinese net, boat, beach umbrella, seabird
          const keys = ['scenery_lighthouse', 'scenery_chinese_net', 'scenery_fishing_boat', 'scenery_beach_umbrella', 'scenery_seabird'];
          return Phaser.Utils.Array.GetRandom(keys);
        } else {
          // Land side: Coastal huts, palms, signs
          const keys = ['scenery_coastal_hut', 'scenery_palm', 'scenery_beach_umbrella', 'scenery_sign'];
          return Phaser.Utils.Array.GetRandom(keys);
        }
      }
      case 'hills': {
        const keys = [
          'scenery_tea_plantation',
          'scenery_waterfall',
          'scenery_mountain_tree',
          'scenery_estate_bungalow',
          'scenery_sign'
        ];
        return Phaser.Utils.Array.GetRandom(keys);
      }
      case 'town_night': {
        const keys = [
          'scenery_neon_shop',
          'scenery_streetlight',
          'scenery_festival_lights',
          'scenery_bus_stop',
          'scenery_chaishop',
          'scenery_sign'
        ];
        return Phaser.Utils.Array.GetRandom(keys);
      }
      default:
        return 'scenery_palm';
    }
  }

  positionSceneryItem(item, side) {
    const roadLeft = this.scene.roadLeftX;
    const roadRight = this.scene.roadRightX;
    const screenWidth = this.scene.scale.width;
    const kerbW = CONFIG.ROAD.KERB_WIDTH;

    // Special placement for bridge railings (snap precisely to road curb edge)
    if (item.texture && item.texture.key === 'scenery_bridge_railing') {
      item.setScale(1.0);
      item.x = side === 'left' ? Math.round(roadLeft - kerbW / 2) : Math.round(roadRight + kerbW / 2);
      return;
    }

    if (side === 'left') {
      const shoulderWidth = Math.max(24, roadLeft - kerbW);
      // Object-specific responsive scaling: ensures displayWidth fits comfortably within shoulder
      const maxAllowedWidth = Math.max(16, shoulderWidth - 10);
      const scale = Math.min(1.0, maxAllowedWidth / (item.width || 80));
      item.setScale(scale);

      const halfW = (item.width * scale) / 2;
      const minX = Math.round(4 + halfW);
      const maxX = Math.round(roadLeft - kerbW - 4 - halfW);

      if (minX <= maxX) {
        item.x = Phaser.Math.Between(minX, maxX);
      } else {
        item.x = Math.round((roadLeft - kerbW) / 2);
      }
    } else {
      const shoulderWidth = Math.max(24, screenWidth - (roadRight + kerbW));
      const maxAllowedWidth = Math.max(16, shoulderWidth - 10);
      const scale = Math.min(1.0, maxAllowedWidth / (item.width || 80));
      item.setScale(scale);

      const halfW = (item.width * scale) / 2;
      const minX = Math.round(roadRight + kerbW + 4 + halfW);
      const maxX = Math.round(screenWidth - 4 - halfW);

      if (minX <= maxX) {
        item.x = Phaser.Math.Between(minX, maxX);
      } else {
        item.x = Math.round(roadRight + kerbW + shoulderWidth / 2);
      }
    }
  }

  setMode(mode) {
    if (this.weatherSystem) {
      this.weatherSystem.setMode(mode);
    }
  }

  /* -------------------------------------------------------------
   * UPDATE LOOP & PARALLAX SCROLLING
   * ----------------------------------------------------------- */
  update(roadSpeed, delta) {
    const deltaSeconds = delta / 1000;
    this.roadScrollY = (this.roadScrollY + roadSpeed * deltaSeconds) % 80;
    this.oceanWavePhase += deltaSeconds * 2.5;
    this.waterfallMistPhase += deltaSeconds * 5.0;

    // 1. Precise Five-Location Road-Trip Timeline
    // Active gameplay elapsed time (pause freezes this because update isn't called)
    this.gameplayElapsedTime += delta;
    this.biomeTimer += delta;
    const currentEnv = CONFIG.ENVIRONMENTS[this.currentBiomeIndex];

    // Timeline Milestones:
    // 0-45s: Kerala Village (index 0)
    // 45-90s: Alappuzha Backwaters (index 1)
    // 90-135s: Cherai Beach Road (index 2)
    // 135-180s: Munnar Tea Hills (index 3)
    // 180s onwards: Kochi Town at Night (index 4) - stays until game over!
    if (!this.isTransitioning) {
      if (this.currentBiomeIndex === 0 && this.gameplayElapsedTime >= 45000) {
        this.transitionToBiome(1);
      } else if (this.currentBiomeIndex === 1 && this.gameplayElapsedTime >= 90000) {
        this.transitionToBiome(2);
      } else if (this.currentBiomeIndex === 2 && this.gameplayElapsedTime >= 135000) {
        this.transitionToBiome(3);
      } else if (this.currentBiomeIndex === 3 && this.gameplayElapsedTime >= 180000) {
        this.transitionToBiome(4);
      }
    }

    // 2. Handle Active Visual Crossfade (2.5s smooth interpolation)
    if (this.isTransitioning) {
      this.transitionProgress += delta / this.transitionDuration;
      if (this.transitionProgress >= 1.0) {
        this.transitionProgress = 1.0;
        this.isTransitioning = false;
        this.currentBiomeIndex = this.targetBiomeIndex;
      }
      this.interpolateColors();
    }

    // 3. Update Weather System (Monsoon Mode)
    if (this.weatherSystem) {
      this.weatherSystem.update(delta, roadSpeed, currentEnv.id);
    }

    // Scroll Scenery with Parallax
    const parallaxSpeed = roadSpeed * 0.85;
    const screenHeight = this.scene.scale.height;

    const updateSide = (list, side) => {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        item.y += parallaxSpeed * deltaSeconds;

        if (item.y > screenHeight + 140) {
          item.y = -150;
          // Refresh texture to match current/incoming biome
          const activeEnv = CONFIG.ENVIRONMENTS[this.targetBiomeIndex];
          const newTex = this.getTextureForBiome(activeEnv.id, side);
          item.setTexture(newTex);
          this.positionSceneryItem(item, side);
        }
      }
    };

    updateSide(this.leftScenery, 'left');
    updateSide(this.rightScenery, 'right');

    // Update Drifting Clouds (Munnar Hills)
    const isHills = (CONFIG.ENVIRONMENTS[this.currentBiomeIndex].id === 'hills');
    this.driftingClouds.forEach(cloud => {
      if (isHills) {
        cloud.alpha = Phaser.Math.Linear(cloud.alpha, 0.45, 0.05);
        cloud.x += 18 * deltaSeconds;
        cloud.y += roadSpeed * 0.25 * deltaSeconds;
        if (cloud.x > this.scene.scale.width + 100) {
          cloud.x = -100;
          cloud.y = Phaser.Math.Between(40, screenHeight * 0.7);
        }
      } else {
        cloud.alpha = Phaser.Math.Linear(cloud.alpha, 0, 0.05);
      }
    });

    // Redraw Dynamic Graphics Layers
    this.drawRoad();
    this.drawWeatherAndLighting();
  }

  /* -------------------------------------------------------------
   * BIOME TRANSITIONS & COLOR CROSSFADES
   * ----------------------------------------------------------- */
  transitionToBiome(targetIndex) {
    if (this.currentBiomeIndex === targetIndex || this.isTransitioning) return;
    this.biomeTimer = 0;
    this.targetBiomeIndex = targetIndex;
    this.isTransitioning = true;
    this.transitionProgress = 0;

    const targetEnv = CONFIG.ENVIRONMENTS[this.targetBiomeIndex];
    this.triggerLocationBanner(targetEnv);
  }

  startBiomeTransition() {
    // Legacy fallback wrapper
    if (this.currentBiomeIndex < CONFIG.ENVIRONMENTS.length - 1) {
      this.transitionToBiome(this.currentBiomeIndex + 1);
    }
  }

  interpolateColors() {
    const envA = CONFIG.ENVIRONMENTS[this.currentBiomeIndex];
    const envB = CONFIG.ENVIRONMENTS[this.targetBiomeIndex];
    const t = this.transitionProgress;

    this.activeColors.asphalt = this.lerpColor(envA.asphaltColor, envB.asphaltColor, t);
    this.activeColors.shoulder = this.lerpColor(envA.shoulderColor, envB.shoulderColor, t);
    this.activeColors.curbA = this.lerpColor(envA.curbColorA, envB.curbColorA, t);
    this.activeColors.curbB = this.lerpColor(envA.curbColorB, envB.curbColorB, t);
    this.activeColors.lightTint = this.lerpColor(envA.lightTint, envB.lightTint, t);
    this.activeColors.lightAlpha = Phaser.Math.Linear(envA.lightAlpha, envB.lightAlpha, t);
  }

  lerpColor(colA, colB, t) {
    const c1 = Phaser.Display.Color.IntegerToColor(colA);
    const c2 = Phaser.Display.Color.IntegerToColor(colB);
    const r = Math.round(Phaser.Math.Linear(c1.r, c2.r, t));
    const g = Math.round(Phaser.Math.Linear(c1.g, c2.g, t));
    const b = Math.round(Phaser.Math.Linear(c1.b, c2.b, t));
    return Phaser.Display.Color.GetColor(r, g, b);
  }

  /* -------------------------------------------------------------
   * ROAD & SCENERY RENDERING
   * ----------------------------------------------------------- */
  drawRoad() {
    const g = this.roadGraphics;
    g.clear();

    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    const roadLeft = this.scene.roadLeftX;
    const roadRight = this.scene.roadRightX;
    const roadWidth = this.scene.roadWidth;
    const biome = CONFIG.ENVIRONMENTS[this.currentBiomeIndex];
    const kerbW = CONFIG.ROAD.KERB_WIDTH;

    // 1. Base Shoulders / Background landscape fill
    g.fillStyle(this.activeColors.shoulder, 1);
    g.fillRect(0, 0, Math.floor(w), Math.floor(h));

    const leftShoulderW = Math.max(0, roadLeft - kerbW);
    const rightShoulderStart = roadRight + kerbW;
    const rightShoulderW = Math.max(0, w - rightShoulderStart);

    // Environment-Specific Background Scenery Layers:
    if (biome.id === 'village') {
      // Village: Layered emerald/lime paddy field stripes and roadside irrigation canal
      if (leftShoulderW > 0) {
        const stripeH = 48;
        for (let y = -stripeH + Math.floor(this.roadScrollY % stripeH); y < h + stripeH; y += stripeH) {
          const isLime = (Math.floor((y - this.roadScrollY) / stripeH) % 2 === 0);
          g.fillStyle(isLime ? 0x388E3C : 0x2E7D32, 0.45);
          g.fillRect(0, Math.floor(y), Math.floor(leftShoulderW * 0.72), stripeH);
        }
        // Narrow irrigation canal stream running along the road shoulder
        if (leftShoulderW > 22) {
          const canalW = Math.min(10, Math.floor(leftShoulderW * 0.24));
          const canalX = Math.floor(roadLeft - kerbW - canalW - 2);
          g.fillStyle(0x0288D1, 0.85); // Flowing blue stream
          g.fillRect(canalX, 0, canalW, Math.floor(h));
          // Canal water shimmer ripples
          g.lineStyle(1.5, 0x81D4FA, 0.5);
          for (let y = 0; y < h; y += 40) {
            const ry = Math.floor((y + this.roadScrollY * 0.5) % h);
            g.lineBetween(canalX + 1, ry, canalX + canalW - 1, ry);
          }
        }
      }

      if (rightShoulderW > 0) {
        const stripeH = 48;
        for (let y = -stripeH + Math.floor(this.roadScrollY % stripeH); y < h + stripeH; y += stripeH) {
          const isLime = (Math.floor((y - this.roadScrollY) / stripeH) % 2 === 0);
          g.fillStyle(isLime ? 0x43A047 : 0x2E7D32, 0.45);
          g.fillRect(Math.floor(rightShoulderStart + rightShoulderW * 0.28), Math.floor(y), Math.floor(rightShoulderW * 0.72), stripeH);
        }
        // Wooden fences along roadside edge
        if (rightShoulderW > 18) {
          const fenceX = Math.floor(rightShoulderStart + 4);
          g.lineStyle(2, 0x6D4C41, 0.75); // Fence horizontal rail
          g.lineBetween(fenceX, 0, fenceX, Math.floor(h));
          // Fence posts
          g.lineStyle(2.5, 0x4E342E, 0.9);
          for (let y = -30 + Math.floor(this.roadScrollY % 30); y < h + 30; y += 30) {
            const py = Math.floor(y);
            g.lineBetween(fenceX - 3, py, fenceX + 3, py);
          }
        }
      }
    } else if (biome.id === 'backwaters') {
      // Backwaters Theme: Wide shimmering lagoon waterways with reflections
      g.fillStyle(0x0288D1, 1);
      if (leftShoulderW > 0) g.fillRect(0, 0, Math.floor(leftShoulderW), Math.floor(h));
      if (rightShoulderW > 0) g.fillRect(Math.floor(rightShoulderStart), 0, Math.floor(rightShoulderW), Math.floor(h));

      // Water ripples and light reflections
      g.lineStyle(1.8, 0x81D4FA, 0.5);
      for (let y = 0; y < h; y += 36) {
        const ry = Math.floor((y + this.roadScrollY * 0.35) % h);
        if (leftShoulderW > 14) g.lineBetween(6, ry, Math.floor(leftShoulderW - 6), ry);
        if (rightShoulderW > 14) g.lineBetween(Math.floor(rightShoulderStart + 6), ry, Math.floor(w - 6), ry);
      }
    } else if (biome.id === 'coastal') {
      // Coastal Theme:
      // Left shoulder: Golden beach sand
      if (leftShoulderW > 0) {
        g.fillStyle(0xFFE082, 0.92);
        g.fillRect(0, 0, Math.floor(leftShoulderW), Math.floor(h));
      }

      // Right shoulder: Arabian Sea starts IMMEDIATELY adjacent to road kerb + narrow sandy margin
      if (rightShoulderW > 0) {
        const sandMargin = Math.min(8, Math.floor(rightShoulderW * 0.18));
        g.fillStyle(0xFFE082, 0.92);
        g.fillRect(Math.floor(rightShoulderStart), 0, sandMargin, Math.floor(h));

        const seaStartX = rightShoulderStart + sandMargin;
        const seaW = Math.max(0, w - seaStartX);
        if (seaW > 0) {
          g.fillStyle(0x01579B, 1);
          g.fillRect(Math.floor(seaStartX), 0, Math.floor(seaW), Math.floor(h));

          // Animated Shoreline Foam & Wave Crest
          const waveOffset = Math.sin(this.oceanWavePhase) * 6;
          g.fillStyle(0xE0F7FA, 0.85);
          g.fillRect(Math.floor(seaStartX + waveOffset), 0, Math.min(8, seaW), Math.floor(h));

          // Wave crest ripple lines
          g.lineStyle(2, 0x4FC3F7, 0.6);
          for (let y = 0; y < h; y += 44) {
            const ry = Math.floor((y + (this.roadScrollY * 0.4)) % h);
            g.lineBetween(Math.floor(seaStartX + 8), ry, Math.floor(w - 4), ry);
          }
        }
      }
    } else if (biome.id === 'hills') {
      // Munnar Hills Theme: Tea terrace contours and lush green steps
      g.lineStyle(2.5, 0x1B5E20, 0.7);
      for (let y = 0; y < h; y += 30) {
        const ry = Math.floor((y + this.roadScrollY * 0.6) % h);
        if (leftShoulderW > 8) g.lineBetween(0, ry, Math.floor(leftShoulderW), ry);
        if (rightShoulderW > 8) g.lineBetween(Math.floor(rightShoulderStart), ry, Math.floor(w), ry);
      }
      g.fillStyle(0x388E3C, 0.35);
      for (let y = -20 + Math.floor(this.roadScrollY % 60); y < h + 20; y += 60) {
        if (leftShoulderW > 12) g.fillRect(0, Math.floor(y), Math.floor(leftShoulderW * 0.6), 24);
        if (rightShoulderW > 12) g.fillRect(Math.floor(rightShoulderStart + rightShoulderW * 0.4), Math.floor(y), Math.floor(rightShoulderW * 0.6), 24);
      }
    } else if (biome.id === 'town_night') {
      // Kochi Town Night: Pavement sidewalks with curb stones and neon glow pools
      g.fillStyle(0x263238, 1);
      if (leftShoulderW > 0) g.fillRect(0, 0, Math.floor(leftShoulderW), Math.floor(h));
      if (rightShoulderW > 0) g.fillRect(Math.floor(rightShoulderStart), 0, Math.floor(rightShoulderW), Math.floor(h));

      // Sidewalk slab divider lines
      g.lineStyle(1.5, 0x37474F, 0.8);
      for (let y = -40 + Math.floor(this.roadScrollY % 40); y < h + 40; y += 40) {
        const ry = Math.floor(y);
        if (leftShoulderW > 0) g.lineBetween(0, ry, Math.floor(leftShoulderW), ry);
        if (rightShoulderW > 0) g.lineBetween(Math.floor(rightShoulderStart), ry, Math.floor(w), ry);
      }

      // Ambient storefront neon glow pools on sidewalk
      for (let y = -120 + Math.floor(this.roadScrollY % 240); y < h + 120; y += 240) {
        if (leftShoulderW > 10) {
          g.fillStyle(0xE91E63, 0.18); // Magenta neon pool
          g.fillCircle(Math.floor(leftShoulderW / 2), Math.floor(y), Math.min(45, leftShoulderW));
        }
        if (rightShoulderW > 10) {
          g.fillStyle(0x00E5FF, 0.16); // Cyan neon pool
          g.fillCircle(Math.floor(rightShoulderStart + rightShoulderW / 2), Math.floor(y + 120), Math.min(45, rightShoulderW));
        }
      }
    }

    // 2. Asphalt Road Bed
    g.fillStyle(this.activeColors.asphalt, 1);
    g.fillRect(Math.floor(roadLeft), 0, Math.floor(roadWidth), Math.floor(h));

    // 3. Rumble Kerbs (Alternating red/white, yellow/black, or concrete)
    const kerbSize = 32;
    for (let y = -kerbSize + Math.floor(this.roadScrollY % kerbSize); y < h + kerbSize; y += kerbSize) {
      const isA = (Math.floor((y - this.roadScrollY) / kerbSize) % 2 === 0);
      g.fillStyle(isA ? this.activeColors.curbA : this.activeColors.curbB, 1);

      // Left kerb
      g.fillRect(Math.floor(roadLeft - kerbW), Math.floor(y), Math.floor(kerbW), kerbSize);
      // Right kerb
      g.fillRect(Math.floor(roadRight), Math.floor(y), Math.floor(kerbW), kerbSize);
    }

    // 4. White Solid Road Outer Edges
    g.fillStyle(0xFFFFFF, 0.9);
    g.fillRect(Math.floor(roadLeft), 0, 5, Math.floor(h));
    g.fillRect(Math.floor(roadRight - 5), 0, 5, Math.floor(h));

    // 5. Dashed Lane Dividers (Animated downward scrolling)
    const laneWidth = this.scene.laneWidth;
    const dashLength = 36;
    const dashGap = 32;
    const dashCycle = dashLength + dashGap;

    g.fillStyle(0xFFEB3B, 0.85); // Highway yellow dashed markers

    for (let l = 1; l < CONFIG.ROAD.LANES_COUNT; l++) {
      const laneX = Math.floor(roadLeft + l * laneWidth);
      for (let y = -dashCycle + Math.floor(this.roadScrollY % dashCycle); y < h + dashCycle; y += dashCycle) {
        g.fillRect(Math.floor(laneX - 3), Math.floor(y), 6, dashLength);
      }
    }
  }

  /* -------------------------------------------------------------
   * DYNAMIC WEATHER & LIGHTING OVERLAYS
   * ----------------------------------------------------------- */
  drawWeatherAndLighting() {
    const g = this.weatherOverlay;
    g.clear();

    const w = this.scene.scale.width;
    const h = this.scene.scale.height;

    // 1. Ambient lighting tint per biome (e.g. golden sunset, misty hills, deep night)
    if (this.activeColors.lightAlpha > 0) {
      g.fillStyle(this.activeColors.lightTint, this.activeColors.lightAlpha);
      g.fillRect(0, 0, Math.floor(w), Math.floor(h));
    }

    // 2. Kerala Town at Night: Streetlight illumination glow cones
    const biome = CONFIG.ENVIRONMENTS[this.currentBiomeIndex];
    if (biome.id === 'town_night') {
      const roadLeft = this.scene.roadLeftX;
      const roadRight = this.scene.roadRightX;

      for (let y = -100 + Math.floor(this.roadScrollY % 240); y < h + 100; y += 240) {
        // Left streetlight pool
        g.fillStyle(0xFFD54F, 0.12);
        g.fillCircle(Math.floor(roadLeft - 20), Math.floor(y), 90);
        // Right streetlight pool
        g.fillCircle(Math.floor(roadRight + 20), Math.floor(y + 120), 90);
      }
    }
  }

  onResize() {
    this.leftScenery.forEach(item => this.positionSceneryItem(item, 'left'));
    this.rightScenery.forEach(item => this.positionSceneryItem(item, 'right'));
    if (this.bannerContainer) {
      this.bannerContainer.x = this.scene.scale.width / 2;
    }
    if (this.weatherSystem) {
      this.weatherSystem.onResize(this.scene.scale.width, this.scene.scale.height);
    }
  }

  cleanup() {
    if (this.weatherSystem) {
      this.weatherSystem.cleanup();
    }
    if (this.scene && this.scene.tweens && this.bannerContainer) {
      this.scene.tweens.killTweensOf(this.bannerContainer);
    }
  }
}
