/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Safe Wave-Based Traffic Spawner
 * Guarantees reachable safe lanes, fair reaction time, and object pooling.
 */

import { CONFIG } from '../core/Config.js';
import { Obstacle } from '../entities/Obstacle.js';
import { CoinItem, PowerUpItem } from '../entities/PowerUp.js';
import { PassengerStop, DropoffZone } from '../entities/Passenger.js';

export class TrafficSpawner {
  constructor(scene) {
    this.scene = scene;

    // Active entities collections
    this.obstacles = [];
    this.coins = [];
    this.powerups = [];
    this.passengerStops = [];
    this.dropoffZones = [];

    // Object pool for obstacles
    this.obstaclePool = [];

    // Spawning timers and trackers
    this.timeSinceLastWave = 0;
    this.waveCooldown = 1500; // ms
    this.lastFreeLane = 1;
    this.lastWaveY = -500;

    // Passenger mission timing
    this.timeSinceLastPassenger = 4000; // Start initial passenger quickly
    this.passengerInterval = CONFIG.SPAWNER.PASSENGER_SPAWN_INTERVAL_MS;

    // Difficulty scaling (increases every 10 seconds)
    this.elapsedGameTime = 0;
    this.difficultyLevel = 1.0;
  }

  reset() {
    this.obstacles.forEach(o => o.destroy());
    this.coins.forEach(c => c.destroy());
    this.powerups.forEach(p => p.destroy());
    this.passengerStops.forEach(ps => ps.destroy());
    this.dropoffZones.forEach(dz => dz.destroy());

    this.obstacles = [];
    this.coins = [];
    this.powerups = [];
    this.passengerStops = [];
    this.dropoffZones = [];
    this.obstaclePool = [];

    this.timeSinceLastWave = 0;
    this.waveCooldown = 1500;
    this.lastFreeLane = 1;
    this.timeSinceLastPassenger = 4000;
    this.elapsedGameTime = 0;
    this.difficultyLevel = 1.0;
  }

  update(delta, roadSpeed, player) {
    const deltaSeconds = delta / 1000;
    this.elapsedGameTime += delta;

    // Update Difficulty (gradual progression every 10s, capped at fair maximum)
    // Level goes from 1.0 to 2.2 max
    this.difficultyLevel = 1.0 + Math.min(1.2, (this.elapsedGameTime / 10000) * 0.12);

    // Dynamic wave cooldown based on difficulty (never below 900ms to preserve human reaction time)
    const baseCooldown = 1800 / this.difficultyLevel;
    this.waveCooldown = Math.max(950, baseCooldown);

    this.timeSinceLastWave += delta;
    this.timeSinceLastPassenger += delta;

    // 1. Check if time to spawn next obstacle wave
    if (this.timeSinceLastWave >= this.waveCooldown) {
      this.spawnSafeWave(player);
      this.timeSinceLastWave = 0;
    }

    // 2. Check if time to spawn passenger pickup stop (only if player has no active passenger)
    if (!player.hasPassenger && this.dropoffZones.length === 0 && this.passengerStops.length === 0) {
      if (this.timeSinceLastPassenger >= this.passengerInterval) {
        this.spawnPassengerPickup();
        this.timeSinceLastPassenger = 0;
      }
    }

    // 3. Update & Cull Obstacles
    const screenBottom = this.scene.scale.height + 260;
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.update(roadSpeed, deltaSeconds);

      // Despawn when past bottom of screen
      if (obs.y > screenBottom) {
        this.recycleObstacle(obs, i);
      }
    }

    // 4. Update & Cull Coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      coin.update(roadSpeed, deltaSeconds, player.x, player.y, player.hasActiveMagnet());
      if (coin.y > screenBottom) {
        coin.destroy();
        this.coins.splice(i, 1);
      }
    }

    // 5. Update & Cull PowerUps
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const pup = this.powerups[i];
      pup.update(roadSpeed, deltaSeconds);
      if (pup.y > screenBottom) {
        pup.destroy();
        this.powerups.splice(i, 1);
      }
    }

    // 6. Update & Cull Passenger Stops
    for (let i = this.passengerStops.length - 1; i >= 0; i--) {
      const stop = this.passengerStops[i];
      stop.update(roadSpeed, deltaSeconds);
      if (stop.y > screenBottom) {
        stop.destroy();
        this.passengerStops.splice(i, 1);
      }
    }

    // 7. Update & Cull Dropoff Zones
    for (let i = this.dropoffZones.length - 1; i >= 0; i--) {
      const drop = this.dropoffZones[i];
      drop.update(roadSpeed, deltaSeconds);
      if (drop.y > screenBottom) {
        drop.destroy();
        this.dropoffZones.splice(i, 1);
      }
    }
  }

  /* -------------------------------------------------------------
   * SAFE WAVE-BASED OBSTACLE SPAWNING
   * ----------------------------------------------------------- */
  spawnSafeWave(player) {
    const spawnY = -220; // Off-screen top

    // Available obstacle types with weights based on difficulty
    const types = ['bus', 'lorry', 'cow', 'pothole', 'barrier'];
    const weights = [
      Math.min(3, 1 + this.difficultyLevel * 0.5), // Bus
      Math.min(3, 1 + this.difficultyLevel * 0.4), // Lorry
      1.5,                                         // Cow
      1.0,                                         // Pothole
      1.0                                          // Barrier
    ];

    // Determine how many lanes to block:
    // Difficulty < 1.3: block 1 lane.
    // Difficulty >= 1.3: 60% chance to block 2 lanes, 40% chance to block 1 lane.
    // ABSOLUTE RULE: NEVER BLOCK ALL 3 LANES.
    let lanesToBlockCount = 1;
    if (this.difficultyLevel >= 1.3 && Math.random() < 0.6) {
      lanesToBlockCount = 2;
    }

    // Ensure the safe lane is reachable from player's current lane & previous wave
    const allLanes = [0, 1, 2];
    Phaser.Utils.Array.Shuffle(allLanes);

    // Guaranteed safe lane
    let safeLane;
    // Prefer safe lane adjacent to previous free lane or player lane to avoid impossible shifts
    const candidateLanes = [player.currentLane, this.lastFreeLane];
    safeLane = Phaser.Utils.Array.GetRandom(candidateLanes);

    const blockedLanes = [0, 1, 2].filter(lane => lane !== safeLane).slice(0, lanesToBlockCount);
    this.lastFreeLane = safeLane;

    // Spawn obstacles in blocked lanes
    blockedLanes.forEach(lane => {
      const type = this.getRandomWeightedType(types, weights);
      const posX = this.scene.getLaneCenterX(lane);
      this.getOrCreateObstacle(posX, spawnY, type, lane);
    });

    // In the safe lane: chance to spawn a line of coins or a power-up!
    const roll = Math.random();
    if (roll < CONFIG.SPAWNER.POWERUP_PROBABILITY) {
      this.spawnPowerUp(safeLane, spawnY);
    } else if (roll < CONFIG.SPAWNER.POWERUP_PROBABILITY + CONFIG.SPAWNER.COIN_LINE_PROBABILITY) {
      this.spawnCoinLine(safeLane, spawnY);
    }
  }

  getRandomWeightedType(types, weights) {
    let total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < types.length; i++) {
      if (rand < weights[i]) return types[i];
      rand -= weights[i];
    }
    return types[0];
  }

  getOrCreateObstacle(x, y, type, lane) {
    let obs;
    if (this.obstaclePool.length > 0) {
      obs = this.obstaclePool.pop();
      obs.reset(x, y, type, lane);
    } else {
      obs = new Obstacle(this.scene, x, y, type, lane);
    }
    this.obstacles.push(obs);
    return obs;
  }

  recycleObstacle(obs, index) {
    obs.active = false;
    obs.setVisible(false);
    this.obstacles.splice(index, 1);
    this.obstaclePool.push(obs);
  }

  /* -------------------------------------------------------------
   * COINS & POWER-UPS SPAWNING
   * ----------------------------------------------------------- */
  spawnCoinLine(lane, startY) {
    const posX = this.scene.getLaneCenterX(lane);
    const count = Phaser.Math.Between(3, 5);
    const spacing = 52;

    for (let i = 0; i < count; i++) {
      const coin = new CoinItem(this.scene, posX, startY - i * spacing, lane);
      this.coins.push(coin);
    }
  }

  spawnPowerUp(lane, y) {
    const types = ['shield', 'magnet', 'boost'];
    const type = Phaser.Utils.Array.GetRandom(types);
    const posX = this.scene.getLaneCenterX(lane);

    const pup = new PowerUpItem(this.scene, posX, y, type, lane);
    this.powerups.push(pup);
  }

  /* -------------------------------------------------------------
   * PASSENGER MISSIONS SPAWNING (Safe Hazard-Free Spawning)
   * ----------------------------------------------------------- */
  spawnPassengerPickup() {
    // Passenger stops appear in left or right outer lanes (verge pickup)
    const pickupLane = Math.random() < 0.5 ? 0 : 2;
    const posX = this.scene.getLaneCenterX(pickupLane);
    const posY = -180;

    // Clear any nearby obstacles in the pickup lane to guarantee safe approach
    this.obstacles.forEach(obs => {
      if (obs.lane === pickupLane && Math.abs(obs.y - posY) < 240) {
        obs.active = false;
        obs.setVisible(false);
      }
    });

    // Provide a brief obstacle grace period around passenger boarding
    this.timeSinceLastWave = Math.min(this.timeSinceLastWave, 200);

    const destination = Phaser.Utils.Array.GetRandom(CONFIG.DESTINATIONS);
    const passengerTypes = ['grandma', 'student', 'uncle', 'office', 'tourist'];
    const pType = Phaser.Utils.Array.GetRandom(passengerTypes);

    const stop = new PassengerStop(this.scene, posX, posY, destination, pType, pickupLane);
    this.passengerStops.push(stop);
  }

  spawnDropoffZone(destination) {
    // Dropoff zone spawns ahead in one of the lanes (middle or left/right)
    const dropLane = Phaser.Math.Between(0, 2);
    const posX = this.scene.getLaneCenterX(dropLane);
    const posY = -260;

    // Clear any obstacles in the drop-off lane to guarantee safe arrival
    this.obstacles.forEach(obs => {
      if (obs.lane === dropLane && Math.abs(obs.y - posY) < 260) {
        obs.active = false;
        obs.setVisible(false);
      }
    });

    // Provide a safe window for the delivery celebration
    this.timeSinceLastWave = Math.min(this.timeSinceLastWave, 100);

    const zone = new DropoffZone(this.scene, posX, posY, destination, dropLane);
    this.dropoffZones.push(zone);
  }

  /* -------------------------------------------------------------
   * COW HONK DETECTION
   * ----------------------------------------------------------- */
  onHonk(playerX, playerY) {
    let cowsScaredCount = 0;

    this.obstacles.forEach(obs => {
      if (obs.type === 'cow' && !obs.isScared) {
        const dy = playerY - obs.y; // Obstacle is ahead of player
        const dx = Math.abs(obs.x - playerX);

        if (dy > 0 && dy < CONFIG.HORN.RANGE_Y && dx < CONFIG.HORN.CONE_X) {
          const success = obs.reactToHorn();
          if (success) cowsScaredCount++;
        }
      }
    });

    return cowsScaredCount;
  }
}

