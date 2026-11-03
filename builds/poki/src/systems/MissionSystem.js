/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Passenger Mission and Rotating Objectives System
 */

import { CONFIG } from '../core/Config.js';
import { Storage } from '../core/Storage.js';

export class MissionSystem {
  constructor(scene) {
    this.scene = scene;

    // Active passenger mission
    this.activeMission = null; // { destination, passengerType, distanceRemaining, initialDistance, dropSpawned }
    this.passengersDeliveredThisRun = 0;
    this.totalFareCollected = 0;

    // Daily / Rotating Challenges
    this.challenges = Storage.getChallenges();
  }

  reset() {
    this.activeMission = null;
    this.passengersDeliveredThisRun = 0;
    this.totalFareCollected = 0;
  }

  startPassengerMission(pickupData) {
    const dest = pickupData.destination;
    const initialDistance = Phaser.Math.Between(dest.distanceMin, dest.distanceMax);

    this.activeMission = {
      destination: dest,
      passengerType: pickupData.type,
      distanceRemaining: initialDistance,
      initialDistance: initialDistance,
      dropSpawned: false,
    };

    return this.activeMission;
  }

  update(distanceDelta, spawner) {
    if (!this.activeMission) return;

    this.activeMission.distanceRemaining -= distanceDelta;

    // When approaching destination, trigger the drop-off bay spawner
    if (this.activeMission.distanceRemaining <= 380 && !this.activeMission.dropSpawned) {
      this.activeMission.dropSpawned = true;
      spawner.spawnDropoffZone(this.activeMission.destination);
    }
  }

  completePassengerMission() {
    if (!this.activeMission) return 0;

    const bonus = this.activeMission.destination.fareBonus;
    this.passengersDeliveredThisRun++;
    this.totalFareCollected += bonus;

    // Progress challenges
    this.recordChallengeProgress('passengers_2', 1);

    this.activeMission = null;
    return bonus;
  }

  hasActiveMission() {
    return this.activeMission !== null;
  }

  getMissionProgress() {
    if (!this.activeMission) return 0;
    const progress = 1 - (this.activeMission.distanceRemaining / this.activeMission.initialDistance);
    return Phaser.Math.Clamp(progress, 0, 1);
  }

  // --- Challenges Management ---

  recordChallengeProgress(challengeId, amount = 1) {
    let changed = false;
    this.challenges.forEach(ch => {
      if (ch.id === challengeId && !ch.completed) {
        ch.current += amount;
        if (ch.current >= ch.target) {
          ch.completed = true;
          // Award reward coins
          Storage.addCoins(ch.reward);
          this.scene.spawnFloatingText(
            this.scene.cameras.main.centerX,
            240,
            `CHALLENGE COMPLETE!\n+${ch.reward} COINS!`,
            0x00E676
          );
        }
        changed = true;
      }
    });

    if (changed) {
      Storage.saveChallenges(this.challenges);
    }
  }
}

