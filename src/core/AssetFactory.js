/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Procedural Vector Asset Generator
 * Creates 100% original, crisp, arcade-quality 2D cartoon textures.
 */

import { CONFIG } from './Config.js';

export class AssetFactory {
  /**
   * Helper to create an off-screen HTML5 Canvas, draw on it, and register as Phaser texture.
   */
  static createCanvasTexture(scene, key, width, height, drawFn) {
    if (scene.textures.exists(key)) {
      scene.textures.remove(key);
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(width);
    canvas.height = Math.ceil(height);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;

    drawFn(ctx, width, height);

    scene.textures.addCanvas(key, canvas);
    return key;
  }

  /**
   * Generate all game textures.
   */
  static generateAll(scene) {
    // 1. Auto-Rickshaw Skins
    CONFIG.SKINS.forEach(skin => {
      this.generatePlayerRickshaw(scene, skin);
    });

    // 2. Traffic Obstacles
    this.generateBus(scene);
    this.generateLorry(scene);
    this.generateCow(scene);
    this.generatePothole(scene);
    this.generateBarrier(scene);

    // 3. Collectibles & Power-Ups
    this.generateCoin(scene);
    this.generateChayaShield(scene);
    this.generateCoinMagnet(scene);
    this.generateSpeedBoost(scene);

    // 4. Passenger Mission Elements
    this.generatePassengers(scene);
    this.generateDestinationIcons(scene);
    this.generateDropoffZone(scene);

    // 5. Kerala Scenery & Road Elements
    this.generatePalmTree(scene);
    this.generateKeralaHouse(scene);
    this.generateChaiShop(scene);
    this.generateRoadSign(scene);
    this.generateBeachScenery(scene);

    // Phase 2: Kerala World Expansion Scenery
    this.generateElectricPole(scene);
    this.generateBananaTree(scene);
    this.generateFarmer(scene);
    this.generateVillageCow(scene);
    this.generateHouseboat(scene);
    this.generateFishingCanoe(scene);
    this.generateSnakeBoat(scene);
    this.generateWaterHyacinth(scene);
    this.generateBridgeRailing(scene);
    this.generateLighthouse(scene);
    this.generateChineseNet(scene);
    this.generateFishingBoat(scene);
    this.generateCoastalHut(scene);
    this.generateTeaPlantation(scene);
    this.generateWaterfall(scene);
    this.generateMountainTree(scene);
    this.generateEstateBungalow(scene);
    this.generateCloud(scene);
    this.generateNeonShop(scene);
    this.generateStreetlight(scene);
    this.generateFestivalLights(scene);
    this.generateBusStop(scene);
    this.generateBirds(scene);

    // 6. UI & FX Elements
    this.generateHornButton(scene);
    this.generateShieldFX(scene);
    this.generateMagnetAura(scene);
    this.generateParticleSpark(scene);

    // Phase 4.5: Kerala Monsoon Weather Elements
    this.generateRaindrop(scene);
    this.generateRainPuddle(scene);
    this.generateRainbow(scene);
    this.generateRainRipple(scene);
    this.generateRainCloud(scene);
  }

  /* =============================================================
   * 1. AUTO-RICKSHAW (PLAYER)
   * =========================================================== */
  static generatePlayerRickshaw(scene, skin) {
    const key = `rickshaw_${skin.id}`;
    const w = 84;
    const h = 132;

    this.createCanvasTexture(scene, key, w, h, (ctx) => {
      const cx = w / 2;

      // Soft ground drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(cx, h / 2 + 6, 38, 58, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rear Wheels (left & right)
      ctx.fillStyle = '#1A1A1A';
      // Left wheel
      ctx.beginPath();
      ctx.roundRect(8, 76, 12, 28, 4);
      ctx.fill();
      // Right wheel
      ctx.beginPath();
      ctx.roundRect(w - 20, 76, 12, 28, 4);
      ctx.fill();

      // Wheel rims
      ctx.fillStyle = '#757575';
      ctx.fillRect(11, 84, 6, 12);
      ctx.fillRect(w - 17, 84, 6, 12);

      // Front Wheel (single central wheel)
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.roundRect(cx - 6, 4, 12, 24, 4);
      ctx.fill();
      ctx.fillStyle = '#9E9E9E';
      ctx.fillRect(cx - 3, 10, 6, 12);

      // Main Lower Body Shell (Green or custom skin body color)
      ctx.fillStyle = this.colorToHex(skin.bodyColor);
      ctx.beginPath();
      // Aerodynamic tapered nose at front, wider cabin at rear
      ctx.moveTo(cx - 16, 22);
      ctx.lineTo(cx + 16, 22);
      ctx.quadraticCurveTo(cx + 36, 48, cx + 36, 114);
      ctx.lineTo(cx - 36, 114);
      ctx.quadraticCurveTo(cx - 36, 48, cx - 16, 22);
      ctx.closePath();
      ctx.fill();

      // Lower body outline
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#111111';
      ctx.stroke();

      // Rear Chrome Bumper & Mudguards
      ctx.fillStyle = '#B0BEC5';
      ctx.beginPath();
      ctx.roundRect(cx - 34, 112, 68, 8, 3);
      ctx.fill();
      ctx.stroke();

      // Rear Red Reflectors / Tail Lights
      ctx.fillStyle = '#D32F2F';
      ctx.beginPath();
      ctx.arc(cx - 26, 115, 3.5, 0, Math.PI * 2);
      ctx.arc(cx + 26, 115, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Open Cabin Interior Floor (Dark Grey)
      ctx.fillStyle = '#263238';
      ctx.beginPath();
      ctx.roundRect(cx - 28, 42, 56, 68, 6);
      ctx.fill();

      // Passenger Backseat Cushion
      ctx.fillStyle = '#5D4037';
      ctx.beginPath();
      ctx.roundRect(cx - 26, 88, 52, 20, 4);
      ctx.fill();
      // Cushion stitching
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Driver Seat
      ctx.fillStyle = '#424242';
      ctx.beginPath();
      ctx.roundRect(cx - 14, 52, 28, 16, 3);
      ctx.fill();

      // Driver (Khaki uniform shirt & cap)
      // Driver shoulders
      ctx.fillStyle = '#BCAAA4'; // Khaki shirt
      ctx.beginPath();
      ctx.ellipse(cx, 58, 12, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Driver cap
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.arc(cx, 57, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Handlebar Steering
      ctx.strokeStyle = '#CFD8DC';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 14, 40);
      ctx.lineTo(cx + 14, 40);
      ctx.stroke();

      // Side Grab Rails (Chrome)
      ctx.strokeStyle = '#ECEFF1';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx - 32, 50, 4, 38);
      ctx.strokeRect(cx + 28, 50, 4, 38);

      // Side Mirrors
      ctx.fillStyle = '#ECEFF1';
      ctx.beginPath();
      ctx.roundRect(cx - 36, 32, 5, 8, 2);
      ctx.roundRect(cx + 31, 32, 5, 8, 2);
      ctx.fill();

      // Front Windshield (Glass reflection)
      ctx.fillStyle = '#80DEEA';
      ctx.beginPath();
      ctx.moveTo(cx - 18, 30);
      ctx.lineTo(cx + 18, 30);
      ctx.lineTo(cx + 22, 42);
      ctx.lineTo(cx - 22, 42);
      ctx.closePath();
      ctx.fill();
      // Windshield glass specular highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 12, 33);
      ctx.lineTo(cx + 2, 39);
      ctx.stroke();

      // Characteristic Curved Roof / Canopy (Yellow or Skin Color)
      ctx.fillStyle = this.colorToHex(skin.roofColor);
      ctx.beginPath();
      ctx.roundRect(cx - 30, 40, 60, 68, [12, 12, 8, 8]);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#212121';
      ctx.stroke();

      // Decorative Decal / Racing Stripe on Roof
      ctx.fillStyle = this.colorToHex(skin.stripeColor);
      ctx.beginPath();
      ctx.roundRect(cx - 5, 42, 10, 64, 2);
      ctx.fill();

      // Roof Accent Trim (Side stripes)
      ctx.fillStyle = this.colorToHex(skin.trimColor);
      ctx.fillRect(cx - 28, 48, 4, 52);
      ctx.fillRect(cx + 24, 48, 4, 52);

      // Front Headlight (Bright yellow bulb glow)
      ctx.fillStyle = '#FFF59D';
      ctx.beginPath();
      ctx.arc(cx, 22, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#E0E0E0';
      ctx.stroke();

      // Headlight center bright core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, 21, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* =============================================================
   * 2. TRAFFIC: KERALA KSRTC BUS ("Aana Vandi")
   * =========================================================== */
  static generateBus(scene) {
    const w = CONFIG.OBSTACLES.BUS.width;
    const h = CONFIG.OBSTACLES.BUS.height;

    this.createCanvasTexture(scene, 'obs_bus', w, h, (ctx) => {
      const cx = w / 2;

      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.roundRect(4, 6, w - 8, h - 8, 16);
      ctx.fill();

      // Bus Base Shell (Curved aerodynamic front and boxy rear)
      ctx.fillStyle = '#C62828'; // Iconic KSRTC Red base
      ctx.beginPath();
      ctx.roundRect(6, 4, w - 12, h - 8, 14);
      ctx.fill();

      // Yellow top half / roof livery
      ctx.fillStyle = '#FDD835'; // Vibrant Kerala transport yellow
      ctx.beginPath();
      ctx.roundRect(6, 4, w - 12, (h - 8) * 0.65, [14, 14, 0, 0]);
      ctx.fill();

      // White dividing cheat line
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(6, (h - 8) * 0.65, w - 12, 6);

      // Outer outline
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#212121';
      ctx.beginPath();
      ctx.roundRect(6, 4, w - 12, h - 8, 14);
      ctx.stroke();

      // Front Windshield (Dual panoramic curved glass)
      ctx.fillStyle = '#4DD0E1';
      ctx.beginPath();
      ctx.roundRect(14, 12, w - 28, 32, 6);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1E272C';
      ctx.stroke();

      // Central windshield divider
      ctx.fillStyle = '#1E272C';
      ctx.fillRect(cx - 2, 12, 4, 32);

      // Route Destination Board ("KSRTC FAST PASSENGER")
      ctx.fillStyle = '#1B5E20'; // Green LED destination board
      ctx.beginPath();
      ctx.roundRect(16, 48, w - 32, 14, 3);
      ctx.fill();
      ctx.fillStyle = '#CCFF90';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('K S R T C', cx, 55);

      // Roof Luggage Carrier (Silver rack with luggage tarpaulin)
      ctx.strokeStyle = '#78909C';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(18, 70, w - 36, 85);
      // Rack crossbars
      for (let y = 82; y < 155; y += 14) {
        ctx.beginPath();
        ctx.moveTo(18, y);
        ctx.lineTo(w - 18, y);
        ctx.stroke();
      }
      // Tarpaulin luggage bundle
      ctx.fillStyle = '#1565C0'; // Blue tarp
      ctx.beginPath();
      ctx.roundRect(22, 75, w - 44, 45, 6);
      ctx.fill();
      ctx.fillStyle = '#8D6E63'; // Brown suitcase
      ctx.beginPath();
      ctx.roundRect(25, 125, 20, 22, 3);
      ctx.fill();

      // Side Windows
      ctx.fillStyle = '#80DEEA';
      for (let y = 72; y < 165; y += 22) {
        ctx.fillRect(8, y, 6, 16);
        ctx.fillRect(w - 14, y, 6, 16);
      }

      // Front Bumper & Dual Headlights
      ctx.fillStyle = '#ECEFF1';
      ctx.beginPath();
      ctx.roundRect(10, 4, w - 20, 6, 3);
      ctx.fill();

      ctx.fillStyle = '#FFF59D';
      ctx.beginPath();
      ctx.arc(16, 8, 4, 0, Math.PI * 2);
      ctx.arc(w - 16, 8, 4, 0, Math.PI * 2);
      ctx.fill();

      // Rear Warning Lights
      ctx.fillStyle = '#E53935';
      ctx.fillRect(10, h - 8, 12, 4);
      ctx.fillRect(w - 22, h - 8, 12, 4);
    });
  }

  /* =============================================================
   * 3. TRAFFIC: MALABAR GOODS LORRY (TRUCK)
   * =========================================================== */
  static generateLorry(scene) {
    const w = CONFIG.OBSTACLES.LORRY.width;
    const h = CONFIG.OBSTACLES.LORRY.height;

    this.createCanvasTexture(scene, 'obs_lorry', w, h, (ctx) => {
      const cx = w / 2;

      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.roundRect(4, 6, w - 8, h - 8, 10);
      ctx.fill();

      // Truck Cabin (Front, colorful painted Indian truck style)
      ctx.fillStyle = '#0288D1'; // Peacock Blue cabin
      ctx.beginPath();
      ctx.roundRect(8, 6, w - 16, 68, [12, 12, 4, 4]);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#212121';
      ctx.stroke();

      // Cabin Sunshield & "ALL INDIA PERMIT" banner
      ctx.fillStyle = '#FFB300';
      ctx.fillRect(10, 6, w - 20, 10);
      ctx.fillStyle = '#212121';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ALL INDIA PERMIT', cx, 11);

      // Windshield
      ctx.fillStyle = '#4DD0E1';
      ctx.beginPath();
      ctx.roundRect(14, 20, w - 28, 22, 4);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#263238';
      ctx.stroke();

      // Cabin Roof Floral Garland (Ornate Indian truck deco)
      ctx.fillStyle = '#E91E63';
      ctx.beginPath();
      ctx.arc(cx - 16, 48, 4, 0, Math.PI * 2);
      ctx.arc(cx, 48, 5, 0, Math.PI * 2);
      ctx.arc(cx + 16, 48, 4, 0, Math.PI * 2);
      ctx.fill();

      // Wooden Cargo Body (Rear)
      ctx.fillStyle = '#5D4037'; // Sturdy dark wood bed
      ctx.beginPath();
      ctx.roundRect(8, 76, w - 16, h - 84, 4);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#212121';
      ctx.stroke();

      // Wooden Plank slats
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 2;
      for (let y = 92; y < h - 20; y += 18) {
        ctx.beginPath();
        ctx.moveTo(8, y);
        ctx.lineTo(w - 8, y);
        ctx.stroke();
      }

      // Cargo: Coconut Sacks & Timber Crates
      ctx.fillStyle = '#A1887F';
      ctx.beginPath();
      ctx.roundRect(14, 84, w - 28, 40, 6);
      ctx.fill();
      // Jute ropes binding the sacks
      ctx.strokeStyle = '#FFE082';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(14, 88);
      ctx.lineTo(w - 14, 120);
      ctx.moveTo(w - 14, 88);
      ctx.lineTo(14, 120);
      ctx.stroke();

      // Second cargo bundle (Crates)
      ctx.fillStyle = '#D7CCC8';
      ctx.beginPath();
      ctx.roundRect(14, 132, w - 28, 42, 4);
      ctx.fill();

      // Rear Tailgate: "SOUND HORN PLEASE"
      ctx.fillStyle = '#FFC107';
      ctx.beginPath();
      ctx.roundRect(10, h - 22, w - 20, 14, 3);
      ctx.fill();
      ctx.fillStyle = '#C62828';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BLOW HORN', cx, h - 15);
    });
  }

  /* =============================================================
   * 4. TRAFFIC: KERALA STREET COW
   * =========================================================== */
  static generateCow(scene) {
    const w = CONFIG.OBSTACLES.COW.width;
    const h = CONFIG.OBSTACLES.COW.height;

    this.createCanvasTexture(scene, 'obs_cow', w, h, (ctx) => {
      const cx = w / 2;

      // Soft drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(cx, h / 2 + 6, 26, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main Cow Body (White/cream with brown patches)
      ctx.fillStyle = '#FAFAFA';
      ctx.beginPath();
      ctx.ellipse(cx, 50, 24, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#3E2723';
      ctx.stroke();

      // Brown spots on back
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.ellipse(cx - 10, 42, 10, 14, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 9, 62, 8, 12, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Tail with tuft
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, 80);
      ctx.quadraticCurveTo(cx - 8, 88, cx - 12, 92);
      ctx.stroke();
      ctx.fillStyle = '#5D4037';
      ctx.beginPath();
      ctx.arc(cx - 12, 92, 4, 0, Math.PI * 2);
      ctx.fill();

      // Cow Head (Forward/top)
      ctx.fillStyle = '#FAFAFA';
      ctx.beginPath();
      ctx.ellipse(cx, 22, 16, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#3E2723';
      ctx.stroke();

      // Horns (Gracefully curved grey horns)
      ctx.strokeStyle = '#616161';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 10, 16);
      ctx.quadraticCurveTo(cx - 18, 6, cx - 14, 4);
      ctx.moveTo(cx + 10, 16);
      ctx.quadraticCurveTo(cx + 18, 6, cx + 14, 4);
      ctx.stroke();

      // Big Floppy Ears
      ctx.fillStyle = '#FFCDD2';
      ctx.beginPath();
      ctx.ellipse(cx - 18, 20, 7, 4, -0.4, 0, Math.PI * 2);
      ctx.ellipse(cx + 18, 20, 7, 4, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Snout / Muzzle
      ctx.fillStyle = '#FFAB91';
      ctx.beginPath();
      ctx.ellipse(cx, 12, 11, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Nostrils
      ctx.fillStyle = '#D84315';
      ctx.beginPath();
      ctx.arc(cx - 4, 12, 2, 0, Math.PI * 2);
      ctx.arc(cx + 4, 12, 2, 0, Math.PI * 2);
      ctx.fill();

      // Eyes (Gentle peaceful cartoon eyes)
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(cx - 7, 20, 3, 0, Math.PI * 2);
      ctx.arc(cx + 7, 20, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx - 8, 19, 1, 0, Math.PI * 2);
      ctx.arc(cx + 6, 19, 1, 0, Math.PI * 2);
      ctx.fill();
    });

    // Also generate Cow Alerted State (Eyes wide, startled exclamation)
    this.createCanvasTexture(scene, 'obs_cow_scared', w, h, (ctx) => {
      // Draw base cow
      const img = scene.textures.get('obs_cow').getSourceImage();
      ctx.drawImage(img, 0, 0);

      const cx = w / 2;
      // Startled wide eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx - 7, 20, 5, 0, Math.PI * 2);
      ctx.arc(cx + 7, 20, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(cx - 7, 20, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + 7, 20, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Startled sweat drop / exclamation mark
      ctx.fillStyle = '#FFD600';
      ctx.beginPath();
      ctx.roundRect(cx + 16, 2, 6, 12, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 19, 18, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* =============================================================
   * 5. TRAFFIC: MONSOON POTHOLE & POLICE BARRIER
   * =========================================================== */
  static generatePothole(scene) {
    const w = CONFIG.OBSTACLES.POTHOLE.width;
    const h = CONFIG.OBSTACLES.POTHOLE.height;

    this.createCanvasTexture(scene, 'obs_pothole', w, h, (ctx) => {
      const cx = w / 2;
      const cy = h / 2;

      // Outer cracked asphalt rim
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 38, 26, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Crack lines radiating outwards
      ctx.strokeStyle = '#121212';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 36, cy);
      ctx.lineTo(cx - 42, cy - 6);
      ctx.moveTo(cx + 34, cy + 4);
      ctx.lineTo(cx + 40, cy + 10);
      ctx.moveTo(cx - 12, cy - 24);
      ctx.lineTo(cx - 16, cy - 28);
      ctx.stroke();

      // Deep dark puddle cavity
      ctx.fillStyle = '#0D47A1'; // Deep murky monsoon water
      ctx.beginPath();
      ctx.ellipse(cx + 2, cy + 1, 30, 18, 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Water surface ripple & sky reflections
      ctx.strokeStyle = '#64B5F6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx - 4, cy - 3, 16, 8, 0, 0, Math.PI * 1.5);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx + 10, cy + 3, 6, 0.2, Math.PI * 1.2);
      ctx.stroke();
    });
  }

  static generateBarrier(scene) {
    const w = CONFIG.OBSTACLES.BARRIER.width;
    const h = CONFIG.OBSTACLES.BARRIER.height;

    this.createCanvasTexture(scene, 'obs_barrier', w, h, (ctx) => {
      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.roundRect(4, h - 14, w - 8, 12, 4);
      ctx.fill();

      // Heavy metal support legs
      ctx.fillStyle = '#424242';
      ctx.fillRect(12, 10, 8, h - 18);
      ctx.fillRect(w - 20, 10, 8, h - 18);
      // Feet
      ctx.fillRect(6, h - 12, 20, 6);
      ctx.fillRect(w - 26, h - 12, 20, 6);

      // Main Cross Bar (Diagonal Red & White warning stripes)
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(8, 12, w - 16, 24, 4);
      ctx.clip();

      // Base white
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(8, 12, w - 16, 24);

      // Red diagonal hazard stripes
      ctx.fillStyle = '#D32F2F';
      for (let x = -20; x < w + 30; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, 12);
        ctx.lineTo(x + 12, 12);
        ctx.lineTo(x - 2, 36);
        ctx.lineTo(x - 14, 36);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Bar border
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#212121';
      ctx.strokeRect(8, 12, w - 16, 24);

      // Central Blinking Warning Light
      ctx.fillStyle = '#FF9100';
      ctx.beginPath();
      ctx.arc(w / 2, 10, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFF9C4';
      ctx.beginPath();
      ctx.arc(w / 2, 9, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* =============================================================
   * 6. COLLECTIBLES & POWER-UPS
   * =========================================================== */
  static generateCoin(scene) {
    const size = 44;
    this.createCanvasTexture(scene, 'pickup_coin', size, size, (ctx) => {
      const c = size / 2;

      // Glow shadow
      ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(c, c, 20, 0, Math.PI * 2);
      ctx.fill();

      // Outer gold rim
      ctx.fillStyle = '#FFB300';
      ctx.beginPath();
      ctx.arc(c, c, 17, 0, Math.PI * 2);
      ctx.fill();

      // Inner coin face
      ctx.fillStyle = '#FFD54F';
      ctx.beginPath();
      ctx.arc(c, c, 13.5, 0, Math.PI * 2);
      ctx.fill();

      // Coin Star Motif (Arcade Coin)
      ctx.fillStyle = '#E65100';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', c, c + 1);

      // Specular highlight sparkle
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(c - 6, c - 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  static generateChayaShield(scene) {
    const size = 56;
    this.createCanvasTexture(scene, 'powerup_shield', size, size, (ctx) => {
      const c = size / 2;

      // Golden aura
      ctx.fillStyle = 'rgba(255, 160, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(c, c, 26, 0, Math.PI * 2);
      ctx.fill();

      // Glass Tumbler of Kerala Meter Chaya
      ctx.fillStyle = '#ECEFF1';
      ctx.beginPath();
      ctx.moveTo(c - 14, c - 18);
      ctx.lineTo(c + 14, c - 18);
      ctx.lineTo(c + 10, c + 16);
      ctx.lineTo(c - 10, c + 16);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#B0BEC5';
      ctx.stroke();

      // Golden Hot Tea fill
      ctx.fillStyle = '#795548'; // Rich brewed tea
      ctx.beginPath();
      ctx.moveTo(c - 12, c - 6);
      ctx.lineTo(c + 12, c - 6);
      ctx.lineTo(c + 9, c + 14);
      ctx.lineTo(c - 9, c + 14);
      ctx.closePath();
      ctx.fill();

      // Frothy White Foam on top
      ctx.fillStyle = '#FFF8E1';
      ctx.beginPath();
      ctx.ellipse(c, c - 6, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Steam curls
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c - 4, c - 18);
      ctx.quadraticCurveTo(c - 8, c - 24, c - 3, c - 26);
      ctx.moveTo(c + 4, c - 18);
      ctx.quadraticCurveTo(c + 8, c - 24, c + 3, c - 26);
      ctx.stroke();
    });
  }

  static generateCoinMagnet(scene) {
    const size = 56;
    this.createCanvasTexture(scene, 'powerup_magnet', size, size, (ctx) => {
      const c = size / 2;

      // Aura
      ctx.fillStyle = 'rgba(233, 30, 99, 0.25)';
      ctx.beginPath();
      ctx.arc(c, c, 26, 0, Math.PI * 2);
      ctx.fill();

      // Red Horseshoe Magnet
      ctx.lineWidth = 9;
      ctx.strokeStyle = '#E91E63';
      ctx.beginPath();
      ctx.arc(c, c + 4, 14, Math.PI, 0, false);
      ctx.stroke();

      // Silver magnetic poles
      ctx.strokeStyle = '#ECEFF1';
      ctx.beginPath();
      ctx.moveTo(c - 14, c + 4);
      ctx.lineTo(c - 14, c + 15);
      ctx.moveTo(c + 14, c + 4);
      ctx.lineTo(c + 14, c + 15);
      ctx.stroke();

      // Magnetic spark arcs
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(c, c + 16, 8, 0, Math.PI);
      ctx.stroke();
    });
  }

  static generateSpeedBoost(scene) {
    const size = 56;
    this.createCanvasTexture(scene, 'powerup_boost', size, size, (ctx) => {
      const c = size / 2;

      // Fiery aura
      ctx.fillStyle = 'rgba(0, 230, 118, 0.3)';
      ctx.beginPath();
      ctx.arc(c, c, 26, 0, Math.PI * 2);
      ctx.fill();

      // Turbo / Red Hot Kerala Chili Pepper
      ctx.fillStyle = '#D50000';
      ctx.beginPath();
      ctx.moveTo(c - 12, c - 14);
      ctx.quadraticCurveTo(c + 16, c - 4, c + 14, c + 16);
      ctx.quadraticCurveTo(c + 4, c + 18, c - 8, c + 2);
      ctx.closePath();
      ctx.fill();

      // Green Chili Stem
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(c - 12, c - 14);
      ctx.quadraticCurveTo(c - 18, c - 20, c - 14, c - 24);
      ctx.stroke();

      // Lightning / Turbo streaks
      ctx.strokeStyle = '#FFEB3B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(c + 6, c - 18);
      ctx.lineTo(c, c - 8);
      ctx.lineTo(c + 8, c - 8);
      ctx.lineTo(c + 2, c);
      ctx.stroke();
    });
  }

  /* =============================================================
   * 7. PASSENGER MISSION & DESTINATION ELEMENTS
   * =========================================================== */
  static generatePassengers(scene) {
    // 5 Kerala Passenger Variations
    const types = [
      { id: 'grandma', hatColor: '#FFD700', dressColor: '#FFFDD0', hairColor: '#B0BEC5' }, // Kasavu saree Grandma
      { id: 'student', hatColor: '#1E88E5', dressColor: '#1565C0', hairColor: '#212121' }, // College Student
      { id: 'uncle',   hatColor: '#2E7D32', dressColor: '#FFFFFF', hairColor: '#424242' }, // Uncle with umbrella
      { id: 'office',  hatColor: '#5E35B1', dressColor: '#3949AB', hairColor: '#212121' }, // Office Worker
      { id: 'tourist', hatColor: '#FFA000', dressColor: '#00897B', hairColor: '#795548' }, // Beach Tourist
    ];

    types.forEach(p => {
      const w = 54;
      const h = 76;
      this.createCanvasTexture(scene, `passenger_${p.id}`, w, h, (ctx) => {
        const cx = w / 2;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(cx, h - 8, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body / Outfit
        ctx.fillStyle = p.dressColor;
        ctx.beginPath();
        ctx.roundRect(cx - 13, 26, 26, 38, [8, 8, 4, 4]);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#212121';
        ctx.stroke();

        // Head
        ctx.fillStyle = '#FFCC80';
        ctx.beginPath();
        ctx.arc(cx, 16, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Hair / Hat / Scarf
        ctx.fillStyle = p.hairColor;
        ctx.beginPath();
        ctx.arc(cx, 13, 11, Math.PI, 0);
        ctx.fill();

        // Cheerful cartoon face
        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.arc(cx - 4, 16, 1.8, 0, Math.PI * 2);
        ctx.arc(cx + 4, 16, 1.8, 0, Math.PI * 2);
        ctx.fill();
        // Smile
        ctx.beginPath();
        ctx.arc(cx, 18, 4, 0, Math.PI);
        ctx.stroke();

        // Waving Hand / Luggage
        ctx.strokeStyle = '#FFCC80';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx + 13, 34);
        ctx.lineTo(cx + 20, 24);
        ctx.stroke();

        // "WAITING" bounce indicator pill above passenger
        ctx.fillStyle = '#FF5722';
        ctx.beginPath();
        ctx.roundRect(cx - 18, 0, 36, 12, 6);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PICK ME!', cx, 6);
      });
    });
  }

  static generateDestinationIcons(scene) {
    const size = 56;

    // 1. Tea Shop Icon
    this.createCanvasTexture(scene, 'icon_tea', size, size, (ctx) => {
      const c = size / 2;
      ctx.fillStyle = '#E65100';
      ctx.beginPath();
      ctx.arc(c, c, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Cup
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(c - 12, c - 6, 20, 16, [2, 2, 8, 8]);
      ctx.fill();
      // Handle
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(c + 10, c + 1, 5, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      // Steam
      ctx.beginPath();
      ctx.moveTo(c - 6, c - 9);
      ctx.lineTo(c - 6, c - 15);
      ctx.moveTo(c + 2, c - 9);
      ctx.lineTo(c + 2, c - 15);
      ctx.stroke();
    });

    // 2. Market Icon
    this.createCanvasTexture(scene, 'icon_market', size, size, (ctx) => {
      const c = size / 2;
      ctx.fillStyle = '#2E7D32';
      ctx.beginPath();
      ctx.arc(c, c, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Market Basket
      ctx.fillStyle = '#FFE082';
      ctx.beginPath();
      ctx.roundRect(c - 14, c - 4, 28, 16, [4, 4, 8, 8]);
      ctx.fill();
      // Fruits
      ctx.fillStyle = '#FF5252';
      ctx.beginPath();
      ctx.arc(c - 6, c - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#69F0AE';
      ctx.beginPath();
      ctx.arc(c + 4, c - 7, 5.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Beach Icon
    this.createCanvasTexture(scene, 'icon_beach', size, size, (ctx) => {
      const c = size / 2;
      ctx.fillStyle = '#0277BD';
      ctx.beginPath();
      ctx.arc(c, c, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Sun
      ctx.fillStyle = '#FFD600';
      ctx.beginPath();
      ctx.arc(c - 7, c - 7, 7, 0, Math.PI * 2);
      ctx.fill();
      // Ocean wave
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(c + 4, c + 6, 9, Math.PI, 0, true);
      ctx.stroke();
    });

    // 4. Railway Icon
    this.createCanvasTexture(scene, 'icon_railway', size, size, (ctx) => {
      const c = size / 2;
      ctx.fillStyle = '#C62828';
      ctx.beginPath();
      ctx.arc(c, c, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Train Locomotive
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(c - 12, c - 12, 24, 24, 6);
      ctx.fill();
      ctx.fillStyle = '#C62828';
      ctx.fillRect(c - 9, c - 8, 18, 8); // Window
      ctx.fillStyle = '#FFD54F';
      ctx.beginPath();
      ctx.arc(c, c + 5, 3.5, 0, Math.PI * 2); // Headlight
      ctx.fill();
    });

    // 5. Town Clock Tower Icon
    this.createCanvasTexture(scene, 'icon_town', size, size, (ctx) => {
      const c = size / 2;
      ctx.fillStyle = '#7B1FA2';
      ctx.beginPath();
      ctx.arc(c, c, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Clock face
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(c, c, 13, 0, Math.PI * 2);
      ctx.fill();
      // Hands
      ctx.strokeStyle = '#7B1FA2';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.lineTo(c, c - 8);
      ctx.moveTo(c, c);
      ctx.lineTo(c + 5, c);
      ctx.stroke();
    });
  }

  static generateDropoffZone(scene) {
    const w = 160;
    const h = 72;
    this.createCanvasTexture(scene, 'dropoff_bay', w, h, (ctx) => {
      // Glowing green/gold drop-off bay
      ctx.fillStyle = 'rgba(76, 175, 80, 0.35)';
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 8);
      ctx.fill();

      // Checkered drop-off strip
      const checkW = 16;
      for (let x = 0; x < w; x += checkW) {
        ctx.fillStyle = ((x / checkW) % 2 === 0) ? '#4CAF50' : '#FAFAFA';
        ctx.fillRect(x, 0, checkW, 10);
        ctx.fillRect(x, h - 10, checkW, 10);
      }

      // Animated target arrow / "STOP & DROP"
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★ DROP OFF ★', w / 2, h / 2);
    });
  }

  /* =============================================================
   * 8. KERALA SCENERY & ROADSIDE ELEMENTS
   * =========================================================== */
  static generatePalmTree(scene) {
    const size = 128;
    this.createCanvasTexture(scene, 'scenery_palm', size, size, (ctx) => {
      const c = size / 2;

      // Soft palm tree shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(c + 8, c + 8, 42, 42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Trunk center stump
      ctx.fillStyle = '#6D4C41';
      ctx.beginPath();
      ctx.arc(c, c, 10, 0, Math.PI * 2);
      ctx.fill();

      // Coconut clusters
      ctx.fillStyle = '#4E342E';
      ctx.beginPath();
      ctx.arc(c - 6, c - 4, 5, 0, Math.PI * 2);
      ctx.arc(c + 6, c - 4, 5, 0, Math.PI * 2);
      ctx.arc(c, c + 6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Radiating lush tropical palm fronds
      const fronds = 8;
      for (let i = 0; i < fronds; i++) {
        const angle = (i * Math.PI * 2) / fronds;
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(angle);

        // Frond blade
        ctx.fillStyle = (i % 2 === 0) ? '#2E7D32' : '#388E3C';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(14, -36, 0, -58);
        ctx.quadraticCurveTo(-14, -36, 0, 0);
        ctx.fill();

        // Central frond rib
        ctx.strokeStyle = '#7CB342';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -56);
        ctx.stroke();

        ctx.restore();
      }
    });
  }

  static generateKeralaHouse(scene) {
    const w = 130;
    const h = 100;
    this.createCanvasTexture(scene, 'scenery_house', w, h, (ctx) => {
      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(8, 8, w - 16, h - 16);

      // Traditional Kerala Sloping Terracotta Tiled Roof
      ctx.fillStyle = '#BF360C'; // Red clay tile
      ctx.beginPath();
      ctx.moveTo(w / 2, 8);
      ctx.lineTo(w - 10, 48);
      ctx.lineTo(10, 48);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#5D4037';
      ctx.stroke();

      // Roof ridges / tile grooves
      ctx.strokeStyle = '#870000';
      ctx.lineWidth = 1.5;
      for (let x = 20; x < w - 20; x += 12) {
        ctx.beginPath();
        ctx.moveTo(w / 2, 8);
        ctx.lineTo(x, 48);
        ctx.stroke();
      }

      // Whitewashed Wall & Veranda (Poomukham)
      ctx.fillStyle = '#FFF8E1';
      ctx.fillRect(16, 48, w - 32, 42);
      ctx.strokeRect(16, 48, w - 32, 42);

      // Wooden pillars
      ctx.fillStyle = '#6D4C41';
      ctx.fillRect(24, 48, 6, 42);
      ctx.fillRect(w - 30, 48, 6, 42);

      // Wooden Door
      ctx.fillStyle = '#4E342E';
      ctx.fillRect(w / 2 - 10, 60, 20, 30);
    });
  }

  static generateChaiShop(scene) {
    const w = 140;
    const h = 100;
    this.createCanvasTexture(scene, 'scenery_chaishop', w, h, (ctx) => {
      // Blue metal tin roof
      ctx.fillStyle = '#1565C0';
      ctx.fillRect(10, 10, w - 20, 36);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0D47A1';
      ctx.strokeRect(10, 10, w - 20, 36);

      // Wooden counter & stall
      ctx.fillStyle = '#8D6E63';
      ctx.fillRect(16, 46, w - 32, 44);
      ctx.strokeStyle = '#4E342E';
      ctx.strokeRect(16, 46, w - 32, 44);

      // Signboard: "KAYI'S CHAYA KADA"
      ctx.fillStyle = '#FFC107';
      ctx.fillRect(20, 14, w - 40, 14);
      ctx.fillStyle = '#212121';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('☕ CHAYA KADA', w / 2, 21);

      // Brass Tea Samovar Boiler on counter
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.roundRect(24, 52, 18, 24, 3);
      ctx.fill();

      // Glass Snack Shelf (Pazham Pori / Samosas)
      ctx.fillStyle = '#80DEEA';
      ctx.fillRect(w - 52, 52, 28, 22);
      ctx.fillStyle = '#FF9800'; // Banana fritters
      ctx.fillRect(w - 48, 60, 20, 6);
    });
  }

  static generateRoadSign(scene) {
    const w = 84;
    const h = 54;
    this.createCanvasTexture(scene, 'scenery_sign', w, h, (ctx) => {
      // Sign post
      ctx.fillStyle = '#757575';
      ctx.fillRect(w / 2 - 3, 24, 6, 30);

      // Green Kerala Highway Board
      ctx.fillStyle = '#1B5E20';
      ctx.beginPath();
      ctx.roundRect(4, 4, w - 8, 26, 4);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KOCHI 12 KM', w / 2, 17);
    });
  }

  static generateBeachScenery(scene) {
    const size = 96;
    this.createCanvasTexture(scene, 'scenery_beach_umbrella', size, size, (ctx) => {
      const c = size / 2;

      // Beach umbrella shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(c + 6, c + 6, 28, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Striped Sun Umbrella
      const sectors = 8;
      for (let i = 0; i < sectors; i++) {
        const start = (i * Math.PI * 2) / sectors;
        const end = ((i + 1) * Math.PI * 2) / sectors;
        ctx.fillStyle = (i % 2 === 0) ? '#D32F2F' : '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.arc(c, c, 32, start, end);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = '#FFD54F';
      ctx.beginPath();
      ctx.arc(c, c, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* -------------------------------------------------------------
   * PHASE 2: NEW SCENERY GENERATORS FOR 5 KERALA BIOMES
   * ----------------------------------------------------------- */

  // 1. Village Scenery Elements
  static generateElectricPole(scene) {
    const w = 60;
    const h = 140;
    this.createCanvasTexture(scene, 'scenery_electric_pole', w, h, (ctx) => {
      // Concrete Pole
      ctx.fillStyle = '#78909C';
      ctx.fillRect(w / 2 - 4, 10, 8, h - 10);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#455A64';
      ctx.strokeRect(w / 2 - 4, 10, 8, h - 10);

      // Horizontal Crossarm
      ctx.fillStyle = '#546E7A';
      ctx.fillRect(6, 16, w - 12, 6);
      ctx.strokeRect(6, 16, w - 12, 6);

      // Ceramic Insulators
      ctx.fillStyle = '#8D6E63';
      ctx.fillRect(10, 10, 6, 8);
      ctx.fillRect(w / 2 - 3, 10, 6, 8);
      ctx.fillRect(w - 16, 10, 6, 8);

      // Wires dangling down
      ctx.strokeStyle = '#263238';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(13, 10);
      ctx.quadraticCurveTo(w / 4, 34, 0, 48);
      ctx.moveTo(w - 13, 10);
      ctx.quadraticCurveTo(w * 0.75, 34, w, 48);
      ctx.stroke();
    });
  }

  static generateBananaTree(scene) {
    const size = 110;
    this.createCanvasTexture(scene, 'scenery_banana_tree', size, size, (ctx) => {
      const c = size / 2;

      // Soft shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(c, c + 4, 38, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // Broad Banana Leaves
      const angles = [0, 0.9, 1.8, 2.7, 3.6, 4.5, 5.4];
      angles.forEach((ang, idx) => {
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(ang);

        // Broad oval leaf blade
        ctx.fillStyle = (idx % 2 === 0) ? '#43A047' : '#4CAF50';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(16, -26, 0, -48);
        ctx.quadraticCurveTo(-16, -26, 0, 0);
        ctx.fill();

        // Central rib
        ctx.strokeStyle = '#AEEA00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -46);
        ctx.stroke();

        ctx.restore();
      });

      // Green Kerala Bananas Bunch
      ctx.fillStyle = '#C6FF00';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(c - 6 + i * 3, c - 2, 3, 8, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Purple Flower Blossom (Vazhakoombu)
      ctx.fillStyle = '#6A1B9A';
      ctx.beginPath();
      ctx.ellipse(c, c + 6, 6, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  static generateFarmer(scene) {
    const w = 50;
    const h = 70;
    this.createCanvasTexture(scene, 'scenery_farmer', w, h, (ctx) => {
      const cx = w / 2;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(cx, h - 6, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body (White shirt & folded mundu)
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(cx - 8, 26, 16, 22);

      // Traditional Conical Palm Straw Hat (Thoppi)
      ctx.fillStyle = '#FFE082';
      ctx.beginPath();
      ctx.moveTo(cx, 4);
      ctx.lineTo(cx + 18, 22);
      ctx.lineTo(cx - 18, 22);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#8D6E63';
      ctx.stroke();

      // Face under hat
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.arc(cx, 22, 6, 0, Math.PI);
      ctx.fill();

      // Spade/Tool
      ctx.strokeStyle = '#4E342E';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx + 12, 16);
      ctx.lineTo(cx + 14, h - 8);
      ctx.stroke();
      ctx.fillStyle = '#78909C';
      ctx.fillRect(cx + 10, h - 14, 8, 8);
    });
  }

  static generateVillageCow(scene) {
    const w = 70;
    const h = 56;
    this.createCanvasTexture(scene, 'scenery_village_cow', w, h, (ctx) => {
      const cx = w / 2;
      const cy = h / 2;

      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 12, 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cow body resting in grass
      ctx.fillStyle = '#F5F5F5';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 2, 22, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#424242';
      ctx.stroke();

      // Brown spots
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.arc(cx - 6, cy - 2, 8, 0, Math.PI * 2);
      ctx.arc(cx + 10, cy + 6, 6, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#F5F5F5';
      ctx.beginPath();
      ctx.ellipse(cx + 18, cy - 8, 10, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Horns
      ctx.strokeStyle = '#616161';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx + 18, cy - 14);
      ctx.lineTo(cx + 20, cy - 20);
      ctx.stroke();

      // Ears
      ctx.fillStyle = '#FFCDD2';
      ctx.beginPath();
      ctx.ellipse(cx + 12, cy - 8, 5, 2.5, -0.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // 2. Alappuzha Backwaters Scenery Elements
  static generateHouseboat(scene) {
    const w = 180;
    const h = 90;
    this.createCanvasTexture(scene, 'scenery_houseboat', w, h, (ctx) => {
      const cx = w / 2;

      // Water reflection & ripple
      ctx.fillStyle = 'rgba(0, 150, 255, 0.2)';
      ctx.beginPath();
      ctx.ellipse(cx, h - 14, 76, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wooden Canoe Hull (Curved front bow and rear stern)
      ctx.fillStyle = '#4E342E'; // Teak wood
      ctx.beginPath();
      ctx.moveTo(12, 54);
      ctx.quadraticCurveTo(cx, 74, w - 12, 54);
      ctx.lineTo(w - 18, 44);
      ctx.quadraticCurveTo(cx, 58, 18, 44);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#27170E';
      ctx.stroke();

      // Bamboo / Reed Arched Thatch Canopy (Panambu roof)
      ctx.fillStyle = '#D7CCC8'; // Golden dry reed thatch
      ctx.beginPath();
      ctx.roundRect(26, 18, w - 52, 34, [16, 16, 4, 4]);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#6D4C41';
      ctx.stroke();

      // Coir rope weaves on the roof
      ctx.strokeStyle = '#8D6E63';
      ctx.lineWidth = 1.5;
      for (let x = 36; x < w - 36; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, 18);
        ctx.lineTo(x, 52);
        ctx.stroke();
      }

      // Windows
      ctx.fillStyle = '#80DEEA';
      for (let x = 40; x < w - 40; x += 22) {
        ctx.fillRect(x, 30, 12, 14);
        ctx.strokeRect(x, 30, 12, 14);
      }

      // Kerala / Indian Flag on the bow
      ctx.fillStyle = '#FF9800';
      ctx.fillRect(w - 20, 24, 12, 8);
      ctx.strokeStyle = '#3E2723';
      ctx.beginPath();
      ctx.moveTo(w - 20, 24);
      ctx.lineTo(w - 20, 44);
      ctx.stroke();
    });
  }

  static generateFishingCanoe(scene) {
    const w = 120;
    const h = 48;
    this.createCanvasTexture(scene, 'scenery_fishing_canoe', w, h, (ctx) => {
      const cx = w / 2;

      // Water ripple
      ctx.fillStyle = 'rgba(2, 136, 209, 0.3)';
      ctx.beginPath();
      ctx.ellipse(cx, 32, 52, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Slender wooden hull
      ctx.fillStyle = '#5D4037';
      ctx.beginPath();
      ctx.moveTo(8, 24);
      ctx.quadraticCurveTo(cx, 38, w - 8, 24);
      ctx.quadraticCurveTo(cx, 28, 8, 24);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#27170E';
      ctx.stroke();

      // Fisherman seated
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.arc(cx - 8, 14, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E0E0E0';
      ctx.fillRect(cx - 12, 19, 9, 8);

      // Oar
      ctx.strokeStyle = '#FFE082';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 14, 12);
      ctx.lineTo(cx + 6, 36);
      ctx.stroke();
    });
  }

  static generateSnakeBoat(scene) {
    const w = 220;
    const h = 54;
    this.createCanvasTexture(scene, 'scenery_snake_boat', w, h, (ctx) => {
      // Extremely long slender hull
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.moveTo(6, 34);
      ctx.quadraticCurveTo(w / 2, 46, w - 24, 34);
      ctx.lineTo(w - 28, 30);
      ctx.quadraticCurveTo(w / 2, 36, 12, 30);
      ctx.closePath();
      ctx.fill();

      // Iconic tall curved serpent stern at the back
      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(12, 32);
      ctx.quadraticCurveTo(4, 18, 16, 6);
      ctx.stroke();

      // Gold ornament on snake boat hood
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(16, 6, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Row of synchronized rowers in white
      ctx.fillStyle = '#FFFFFF';
      for (let x = 32; x < w - 32; x += 10) {
        ctx.fillRect(x, 24, 4, 7);
      }

      // Red temple umbrella in center
      ctx.fillStyle = '#D32F2F';
      ctx.beginPath();
      ctx.arc(w / 2, 20, 8, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w / 2, 20);
      ctx.lineTo(w / 2, 32);
      ctx.stroke();
    });
  }

  static generateWaterHyacinth(scene) {
    const size = 68;
    this.createCanvasTexture(scene, 'scenery_water_hyacinth', size, size, (ctx) => {
      const c = size / 2;

      // Rounded floating leaves
      ctx.fillStyle = '#2E7D32';
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI * 2) / 6;
        ctx.beginPath();
        ctx.ellipse(c + Math.cos(ang) * 16, c + Math.sin(ang) * 16, 12, 9, ang, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central purple flower
      ctx.fillStyle = '#BA68C8';
      ctx.beginPath();
      ctx.arc(c, c, 8, 0, Math.PI * 2);
      ctx.fill();

      // Blue & yellow petal center
      ctx.fillStyle = '#FFEB3B';
      ctx.beginPath();
      ctx.arc(c, c, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  static generateBridgeRailing(scene) {
    const w = 50;
    const h = 120;
    this.createCanvasTexture(scene, 'scenery_bridge_railing', w, h, (ctx) => {
      // Concrete Post
      ctx.fillStyle = '#B0BEC5';
      ctx.fillRect(w / 2 - 8, 0, 16, h);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#546E7A';
      ctx.strokeRect(w / 2 - 8, 0, 16, h);

      // Yellow safety reflector stripes
      ctx.fillStyle = '#FFC107';
      ctx.fillRect(w / 2 - 8, 20, 16, 12);
      ctx.fillRect(w / 2 - 8, 60, 16, 12);
      ctx.fillRect(w / 2 - 8, 100, 16, 12);

      // Steel horizontal guardrails
      ctx.strokeStyle = '#ECEFF1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(w, 30);
      ctx.moveTo(0, 80);
      ctx.lineTo(w, 80);
      ctx.stroke();
    });
  }

  // 3. Coastal Scenery Elements
  static generateLighthouse(scene) {
    const w = 90;
    const h = 180;
    this.createCanvasTexture(scene, 'scenery_lighthouse', w, h, (ctx) => {
      const cx = w / 2;

      // Base shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(cx, h - 8, 38, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Conical Tower (Alternating Red and White bands)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - 28, h - 12);
      ctx.lineTo(cx - 14, 38);
      ctx.lineTo(cx + 14, 38);
      ctx.lineTo(cx + 28, h - 12);
      ctx.closePath();
      ctx.clip();

      // Base white
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, w, h);

      // Red bands
      ctx.fillStyle = '#D32F2F';
      ctx.fillRect(0, 40, w, 28);
      ctx.fillRect(0, 96, w, 32);
      ctx.fillRect(0, 150, w, 30);
      ctx.restore();

      // Tower outline
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#212121';
      ctx.beginPath();
      ctx.moveTo(cx - 28, h - 12);
      ctx.lineTo(cx - 14, 38);
      ctx.lineTo(cx + 14, 38);
      ctx.lineTo(cx + 28, h - 12);
      ctx.closePath();
      ctx.stroke();

      // Observation Catwalk Gallery
      ctx.fillStyle = '#37474F';
      ctx.fillRect(cx - 20, 32, 40, 6);
      ctx.strokeRect(cx - 20, 32, 40, 6);

      // Lantern Room (Glass with glowing beacon bulb)
      ctx.fillStyle = '#FFF59D';
      ctx.beginPath();
      ctx.roundRect(cx - 12, 14, 24, 18, 2);
      ctx.fill();
      ctx.strokeRect(cx - 12, 14, 24, 18);

      // Lighthouse Dome Roof
      ctx.fillStyle = '#C62828';
      ctx.beginPath();
      ctx.arc(cx, 14, 12, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
    });
  }

  static generateChineseNet(scene) {
    const size = 140;
    this.createCanvasTexture(scene, 'scenery_chinese_net', size, size, (ctx) => {
      const c = size / 2;

      // Heavy Teak Cantilever Frame
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(c - 40, c + 50);
      ctx.lineTo(c, c - 10);
      ctx.lineTo(c + 40, c + 50);
      ctx.stroke();

      // Pivot Crossbeam & bamboo arms extending into water
      ctx.strokeStyle = '#8D6E63';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(c, c - 10);
      ctx.lineTo(c + 55, c - 45);
      ctx.moveTo(c, c - 10);
      ctx.lineTo(c - 55, c - 45);
      ctx.stroke();

      // Suspended Web Net (Delicate grid)
      ctx.strokeStyle = 'rgba(255, 235, 59, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(c - 45, c - 50, 90, 40);
      for (let x = c - 45; x <= c + 45; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, c - 50);
        ctx.lineTo(x, c - 10);
        ctx.stroke();
      }

      // Hanging counterweight stones on ropes
      ctx.fillStyle = '#78909C';
      ctx.beginPath();
      ctx.arc(c - 25, c + 30, 6, 0, Math.PI * 2);
      ctx.arc(c + 25, c + 30, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  static generateFishingBoat(scene) {
    const w = 120;
    const h = 70;
    this.createCanvasTexture(scene, 'scenery_fishing_boat', w, h, (ctx) => {
      // Sand shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(w / 2, 48, 50, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cyan / Orange coastal boat hull
      ctx.fillStyle = '#00ACC1';
      ctx.beginPath();
      ctx.moveTo(12, 38);
      ctx.quadraticCurveTo(w / 2, 54, w - 12, 38);
      ctx.lineTo(w - 18, 26);
      ctx.quadraticCurveTo(w / 2, 38, 18, 26);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#006064';
      ctx.stroke();

      // Orange trim stripe
      ctx.fillStyle = '#FF5722';
      ctx.fillRect(16, 28, w - 32, 4);

      // Rolled nets & wooden oar
      ctx.fillStyle = '#A1887F';
      ctx.fillRect(w / 2 - 14, 20, 28, 8);
    });
  }

  static generateCoastalHut(scene) {
    const w = 110;
    const h = 90;
    this.createCanvasTexture(scene, 'scenery_coastal_hut', w, h, (ctx) => {
      // Sloping thatched coconut palm frond roof
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.moveTo(w / 2, 8);
      ctx.lineTo(w - 6, 44);
      ctx.lineTo(6, 44);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#4E342E';
      ctx.stroke();

      // Thatch texture lines
      ctx.strokeStyle = '#BCAAA4';
      ctx.lineWidth = 1.5;
      for (let x = 14; x < w - 14; x += 10) {
        ctx.beginPath();
        ctx.moveTo(w / 2, 8);
        ctx.lineTo(x, 44);
        ctx.stroke();
      }

      // Bamboo Woven Walls
      ctx.fillStyle = '#FFE082';
      ctx.fillRect(16, 44, w - 32, 36);
      ctx.strokeRect(16, 44, w - 32, 36);

      // Doorway
      ctx.fillStyle = '#3E2723';
      ctx.fillRect(w / 2 - 8, 52, 16, 28);
    });
  }

  // 4. Munnar Hill Scenery Elements
  static generateTeaPlantation(scene) {
    const w = 160;
    const h = 120;
    this.createCanvasTexture(scene, 'scenery_tea_plantation', w, h, (ctx) => {
      // Contoured green tea terraces
      ctx.fillStyle = '#1B5E20';
      ctx.fillRect(0, 0, w, h);

      // Rows of rounded emerald & lime tea bushes
      const bushColors = ['#2E7D32', '#388E3C', '#43A047', '#66BB6A'];
      for (let y = 14; y < h; y += 22) {
        for (let x = 10; x < w; x += 26) {
          ctx.fillStyle = Phaser.Utils.Array.GetRandom(bushColors);
          ctx.beginPath();
          ctx.ellipse(x, y, 16, 10, 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
        // Narrow picker pathway
        ctx.strokeStyle = '#8D6E63';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y + 10);
        ctx.lineTo(w, y + 10);
        ctx.stroke();
      }
    });
  }

  static generateWaterfall(scene) {
    const w = 120;
    const h = 160;
    this.createCanvasTexture(scene, 'scenery_waterfall', w, h, (ctx) => {
      const cx = w / 2;

      // Dark Mountain Rock Wall
      ctx.fillStyle = '#37474F';
      ctx.beginPath();
      ctx.roundRect(8, 4, w - 16, h - 8, 12);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#212121';
      ctx.stroke();

      // Mossy green patches
      ctx.fillStyle = '#2E7D32';
      ctx.beginPath();
      ctx.arc(24, 30, 14, 0, Math.PI * 2);
      ctx.arc(w - 24, 70, 16, 0, Math.PI * 2);
      ctx.arc(30, 120, 15, 0, Math.PI * 2);
      ctx.fill();

      // Cascading White & Cyan Waterfall Stream
      ctx.fillStyle = '#E0F7FA';
      ctx.beginPath();
      ctx.roundRect(cx - 16, 6, 32, h - 24, 6);
      ctx.fill();

      // Water foam streaks
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 2;
      for (let x = cx - 12; x <= cx + 12; x += 6) {
        ctx.beginPath();
        ctx.moveTo(x, 8);
        ctx.lineTo(x, h - 22);
        ctx.stroke();
      }

      // Foaming mist splash pool at base
      ctx.fillStyle = '#B2EBF2';
      ctx.beginPath();
      ctx.ellipse(cx, h - 16, 26, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  static generateMountainTree(scene) {
    const w = 110;
    const h = 140;
    this.createCanvasTexture(scene, 'scenery_mountain_tree', w, h, (ctx) => {
      const cx = w / 2;

      // Trunk
      ctx.fillStyle = '#4E342E';
      ctx.fillRect(cx - 6, h - 36, 12, 36);

      // Layered conical pine canopy
      const layers = [
        { y: h - 32, rw: 48, rh: 26, col: '#1B5E20' },
        { y: h - 56, rw: 40, rh: 24, col: '#2E7D32' },
        { y: h - 78, rw: 32, rh: 22, col: '#388E3C' },
        { y: h - 98, rw: 22, rh: 20, col: '#43A047' },
      ];

      layers.forEach(l => {
        ctx.fillStyle = l.col;
        ctx.beginPath();
        ctx.moveTo(cx, l.y - l.rh);
        ctx.lineTo(cx + l.rw, l.y);
        ctx.lineTo(cx - l.rw, l.y);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#0D3814';
        ctx.stroke();
      });
    });
  }

  static generateEstateBungalow(scene) {
    const w = 140;
    const h = 110;
    this.createCanvasTexture(scene, 'scenery_estate_bungalow', w, h, (ctx) => {
      // Sloping British Planter Red Tin Roof
      ctx.fillStyle = '#C62828';
      ctx.beginPath();
      ctx.moveTo(w / 2, 8);
      ctx.lineTo(w - 8, 48);
      ctx.lineTo(8, 48);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#5D4037';
      ctx.stroke();

      // Brick Chimney
      ctx.fillStyle = '#8D6E63';
      ctx.fillRect(w - 38, 12, 12, 24);
      // Puff of white smoke
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(w - 32, 6, 6, 0, Math.PI * 2);
      ctx.fill();

      // Colonial Whitewash Wall
      ctx.fillStyle = '#ECEFF1';
      ctx.fillRect(16, 48, w - 32, 44);
      ctx.strokeRect(16, 48, w - 32, 44);

      // Veranda & Glass French Windows
      ctx.fillStyle = '#80DEEA';
      ctx.fillRect(26, 56, 20, 20);
      ctx.fillRect(w - 46, 56, 20, 20);
      ctx.strokeRect(26, 56, 20, 20);
      ctx.strokeRect(w - 46, 56, 20, 20);
    });
  }

  static generateCloud(scene) {
    const w = 140;
    const h = 70;
    this.createCanvasTexture(scene, 'scenery_cloud', w, h, (ctx) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.arc(40, 44, 24, 0, Math.PI * 2);
      ctx.arc(70, 32, 32, 0, Math.PI * 2);
      ctx.arc(100, 42, 26, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // 5. Town at Night Scenery Elements
  static generateNeonShop(scene) {
    const w = 150;
    const h = 120;
    this.createCanvasTexture(scene, 'scenery_neon_shop', w, h, (ctx) => {
      const cx = w / 2;

      // Dark Building Façade
      ctx.fillStyle = '#212121';
      ctx.fillRect(8, 8, w - 16, h - 16);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#424242';
      ctx.strokeRect(8, 8, w - 16, h - 16);

      // Glowing Neon Signboard ("HOTEL ARYAAS / BAZAAR")
      ctx.fillStyle = '#D500F9'; // Neon Pink glow
      ctx.beginPath();
      ctx.roundRect(16, 14, w - 32, 26, 4);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★ HOTEL ARYAAS ★', cx, 27);

      // Lit Ground Floor Shop Window (Warm golden interior)
      ctx.fillStyle = '#FFF176';
      ctx.fillRect(20, 52, w - 40, 46);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#F57F17';
      ctx.strokeRect(20, 52, w - 40, 46);

      // Shop Counter & Merchandise
      ctx.fillStyle = '#E65100';
      ctx.fillRect(26, 76, w - 52, 22);
    });
  }

  static generateStreetlight(scene) {
    const w = 70;
    const h = 120;
    this.createCanvasTexture(scene, 'scenery_streetlight', w, h, (ctx) => {
      const cx = w / 2;

      // Warm Golden Light Pool on ground
      const grad = ctx.createRadialGradient(cx, 18, 4, cx, 18, 38);
      grad.addColorStop(0, 'rgba(255, 235, 59, 0.8)');
      grad.addColorStop(0.5, 'rgba(255, 193, 7, 0.3)');
      grad.addColorStop(1, 'rgba(255, 193, 7, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, 18, 36, 0, Math.PI * 2);
      ctx.fill();

      // Cast iron pole
      ctx.fillStyle = '#1A1A1A';
      ctx.fillRect(cx - 3, 24, 6, h - 24);

      // Curved Lamp Arm & Glass Lantern
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, 24);
      ctx.quadraticCurveTo(cx - 14, 16, cx - 14, 10);
      ctx.stroke();

      // Golden Lantern Head
      ctx.fillStyle = '#FFF9C4';
      ctx.beginPath();
      ctx.arc(cx, 18, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  static generateFestivalLights(scene) {
    const w = 140;
    const h = 40;
    this.createCanvasTexture(scene, 'scenery_festival_lights', w, h, (ctx) => {
      // Swag cable
      ctx.strokeStyle = '#424242';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.quadraticCurveTo(w / 2, 32, w, 10);
      ctx.stroke();

      // Multi-colored glowing festival bulbs
      const colors = ['#FF1744', '#FFEA00', '#00E676', '#00E5FF', '#D500F9'];
      for (let i = 0; i < 7; i++) {
        const t = (i + 0.5) / 7;
        const x = t * w;
        const y = Math.sin(t * Math.PI) * 16 + 10;

        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  static generateBusStop(scene) {
    const w = 130;
    const h = 90;
    this.createCanvasTexture(scene, 'scenery_bus_stop', w, h, (ctx) => {
      // Modern Red/Yellow Transport Shelter Roof
      ctx.fillStyle = '#C62828';
      ctx.fillRect(8, 8, w - 16, 22);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#D32F2F';
      ctx.strokeRect(8, 8, w - 16, 22);

      // Support Posts
      ctx.fillStyle = '#78909C';
      ctx.fillRect(16, 30, 6, 52);
      ctx.fillRect(w - 22, 30, 6, 52);

      // Advertising Billboard Poster in Shelter
      ctx.fillStyle = '#FFC107';
      ctx.fillRect(26, 34, w - 52, 40);
      ctx.fillStyle = '#212121';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KSRTC BUS STOP', w / 2, 54);
    });
  }

  static generateBirds(scene) {
    // 1. White Egret (Backwaters)
    this.createCanvasTexture(scene, 'scenery_egret', 48, 36, (ctx) => {
      ctx.fillStyle = '#FAFAFA';
      // Arched wings
      ctx.beginPath();
      ctx.moveTo(4, 24);
      ctx.quadraticCurveTo(24, 6, 44, 24);
      ctx.lineTo(24, 18);
      ctx.closePath();
      ctx.fill();

      // Slender neck and yellow beak
      ctx.strokeStyle = '#FFC107';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(24, 18);
      ctx.lineTo(24, 30);
      ctx.stroke();
    });

    // 2. Coastal Seagull
    this.createCanvasTexture(scene, 'scenery_seabird', 44, 32, (ctx) => {
      ctx.strokeStyle = '#ECEFF1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(4, 20);
      ctx.quadraticCurveTo(14, 8, 22, 16);
      ctx.quadraticCurveTo(30, 8, 40, 20);
      ctx.stroke();
    });
  }

  /* =============================================================
   * 9. UI & FX GRAPHICS
   * =========================================================== */
  static generateHornButton(scene) {
    const size = 96;
    this.createCanvasTexture(scene, 'ui_horn_btn', size, size, (ctx) => {
      const c = size / 2;

      // Outer ring
      ctx.fillStyle = '#F57C00'; // Amber Orange
      ctx.beginPath();
      ctx.arc(c, c, 44, 0, Math.PI * 2);
      ctx.fill();

      // Inner disc
      ctx.fillStyle = '#FFA000';
      ctx.beginPath();
      ctx.arc(c, c, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFE082';
      ctx.stroke();

      // Retro Squeeze Bulb Horn Icon
      ctx.fillStyle = '#212121'; // Rubber bulb
      ctx.beginPath();
      ctx.arc(c - 14, c, 12, 0, Math.PI * 2);
      ctx.fill();

      // Brass Trumpet Horn Flute
      ctx.fillStyle = '#FFE082';
      ctx.beginPath();
      ctx.moveTo(c - 6, c - 5);
      ctx.lineTo(c + 12, c - 14);
      ctx.lineTo(c + 12, c + 14);
      ctx.lineTo(c - 6, c + 5);
      ctx.closePath();
      ctx.fill();

      // Sound Waves
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(c + 12, c, 8, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(c + 12, c, 14, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();

      // "HORN" text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HORN', c, c + 24);
    });
  }

  static generateShieldFX(scene) {
    const size = 160;
    this.createCanvasTexture(scene, 'fx_shield', size, size, (ctx) => {
      const c = size / 2;
      // Glowing rotating energy sphere
      const grad = ctx.createRadialGradient(c, c, 40, c, c, 76);
      grad.addColorStop(0, 'rgba(255, 193, 7, 0.05)');
      grad.addColorStop(0.7, 'rgba(255, 193, 7, 0.4)');
      grad.addColorStop(1, 'rgba(255, 235, 59, 0.8)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c, c, 74, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFF9C4';
      ctx.stroke();
    });
  }

  static generateMagnetAura(scene) {
    const size = 160;
    this.createCanvasTexture(scene, 'fx_magnet', size, size, (ctx) => {
      const c = size / 2;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(c, c, 70, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(c, c, 50, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  static generateParticleSpark(scene) {
    const size = 16;
    this.createCanvasTexture(scene, 'fx_spark', size, size, (ctx) => {
      const c = size / 2;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(c, c, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* =============================================================
   * PHASE 4.5: MONSOON WEATHER ELEMENTS
   * =========================================================== */
  static generateRaindrop(scene) {
    const w = 4;
    const h = 24;
    this.createCanvasTexture(scene, 'weather_raindrop', w, h, (ctx) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(179, 229, 252, 0.1)');
      grad.addColorStop(0.7, 'rgba(128, 216, 255, 0.7)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w, h - 2);
      ctx.quadraticCurveTo(w / 2, h + 2, 0, h - 2);
      ctx.closePath();
      ctx.fill();
    });
  }

  static generateRainPuddle(scene) {
    const w = 72;
    const h = 32;
    this.createCanvasTexture(scene, 'weather_puddle', w, h, (ctx) => {
      const cx = w / 2;
      const cy = h / 2;

      // Dark wet base
      ctx.fillStyle = 'rgba(28, 37, 44, 0.65)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 32, 13, 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Specular sheen
      const grad = ctx.createLinearGradient(cx - 20, cy - 8, cx + 20, cy + 8);
      grad.addColorStop(0, 'rgba(128, 222, 234, 0.4)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.55)');
      grad.addColorStop(1, 'rgba(128, 222, 234, 0.2)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(cx - 2, cy - 1, 24, 8, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Ripple glint
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(cx - 8, cy - 2, 1.5, 0, Math.PI * 2);
      ctx.arc(cx + 6, cy + 1, 1.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  static generateRainbow(scene) {
    const w = 360;
    const h = 180;
    this.createCanvasTexture(scene, 'weather_rainbow', w, h, (ctx) => {
      const cx = w / 2;
      const cy = h;
      const radius = 140;
      const bands = [
        'rgba(244, 67, 54, 0.28)',   // Red
        'rgba(255, 152, 0, 0.28)',  // Orange
        'rgba(255, 235, 59, 0.28)', // Yellow
        'rgba(76, 175, 80, 0.28)',  // Green
        'rgba(3, 169, 244, 0.28)',  // Cyan
        'rgba(63, 81, 181, 0.28)',  // Indigo
        'rgba(156, 39, 176, 0.25)'  // Violet
      ];

      ctx.lineWidth = 4;
      bands.forEach((col, idx) => {
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.arc(cx, cy, radius - idx * 4, Math.PI, 0, false);
        ctx.stroke();
      });
    });
  }

  static generateRainRipple(scene) {
    const size = 36;
    this.createCanvasTexture(scene, 'weather_ripple', size, size / 2, (ctx) => {
      const cx = size / 2;
      const cy = size / 4;
      ctx.strokeStyle = 'rgba(179, 229, 252, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 14, 5, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 8, 2.8, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  static generateRainCloud(scene) {
    const w = 180;
    const h = 95;
    this.createCanvasTexture(scene, 'scenery_rain_cloud', w, h, (ctx) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#546E7A');
      grad.addColorStop(1, '#263238');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.arc(45, 55, 32, 0, Math.PI * 2);
      ctx.arc(90, 40, 42, 0, Math.PI * 2);
      ctx.arc(135, 55, 30, 0, Math.PI * 2);
      ctx.rect(30, 55, 120, 25);
      ctx.fill();

      // Lower dark moisture tint
      ctx.fillStyle = 'rgba(15, 23, 30, 0.35)';
      ctx.beginPath();
      ctx.rect(25, 65, 130, 18);
      ctx.fill();
    });
  }

  static colorToHex(num) {
    return '#' + num.toString(16).padStart(6, '0');
  }
}

