/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Safe Storage Adapter with Incognito and Platform Fallback
 */

import { CONFIG } from './Config.js';

class SafeStorage {
  constructor() {
    this.memoryStore = {};
    this.isLocalStorageAvailable = this.checkLocalStorage();
  }

  checkLocalStorage() {
    try {
      const testKey = '__rr_test_storage__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('localStorage is not accessible. Using in-memory fallback.', e);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      if (this.isLocalStorageAvailable) {
        const val = window.localStorage.getItem(key);
        return val !== null ? val : defaultValue;
      }
    } catch (e) {}
    return key in this.memoryStore ? this.memoryStore[key] : defaultValue;
  }

  setItem(key, value) {
    const strVal = String(value);
    try {
      if (this.isLocalStorageAvailable) {
        window.localStorage.setItem(key, strVal);
      }
    } catch (e) {}
    this.memoryStore[key] = strVal;
  }

  getJSON(key, defaultValue = null) {
    const raw = this.getItem(key);
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return defaultValue;
    }
  }

  setJSON(key, obj) {
    try {
      this.setItem(key, JSON.stringify(obj));
    } catch (e) {}
  }

  // --- Game-specific convenient accessors ---

  getHighScore() {
    return parseInt(this.getItem(CONFIG.STORAGE_KEYS.HIGH_SCORE, '0'), 10) || 0;
  }

  setHighScore(score) {
    const current = this.getHighScore();
    if (score > current) {
      this.setItem(CONFIG.STORAGE_KEYS.HIGH_SCORE, score);
      return true; // New record!
    }
    return false;
  }

  getCoins() {
    return parseInt(this.getItem(CONFIG.STORAGE_KEYS.TOTAL_COINS, '0'), 10) || 0;
  }

  addCoins(amount) {
    const total = this.getCoins() + Math.max(0, amount);
    this.setItem(CONFIG.STORAGE_KEYS.TOTAL_COINS, total);
    return total;
  }

  spendCoins(amount) {
    const current = this.getCoins();
    if (current >= amount) {
      this.setItem(CONFIG.STORAGE_KEYS.TOTAL_COINS, current - amount);
      return true;
    }
    return false;
  }

  getSelectedSkin() {
    return this.getItem(CONFIG.STORAGE_KEYS.SELECTED_SKIN, 'classic_yellow');
  }

  setSelectedSkin(skinId) {
    this.setItem(CONFIG.STORAGE_KEYS.SELECTED_SKIN, skinId);
  }

  getUnlockedSkins() {
    const list = this.getJSON(CONFIG.STORAGE_KEYS.UNLOCKED_SKINS, ['classic_yellow']);
    return Array.isArray(list) ? list : ['classic_yellow'];
  }

  unlockSkin(skinId) {
    const list = this.getUnlockedSkins();
    if (!list.includes(skinId)) {
      list.push(skinId);
      this.setJSON(CONFIG.STORAGE_KEYS.UNLOCKED_SKINS, list);
    }
  }

  isSkinUnlocked(skinId) {
    return this.getUnlockedSkins().includes(skinId);
  }

  getChallenges() {
    const defaults = [
      { id: 'coins_30', desc: 'Collect 30 coins in one run', target: 30, current: 0, reward: 50, completed: false },
      { id: 'passengers_2', desc: 'Deliver 2 passengers in one run', target: 2, current: 0, reward: 80, completed: false },
      { id: 'near_miss_4', desc: 'Perform 4 near misses', target: 4, current: 0, reward: 60, completed: false },
      { id: 'honk_3', desc: 'Scare 3 cows with your horn', target: 3, current: 0, reward: 50, completed: false },
    ];
    return this.getJSON(CONFIG.STORAGE_KEYS.CHALLENGES, defaults);
  }

  saveChallenges(challenges) {
    this.setJSON(CONFIG.STORAGE_KEYS.CHALLENGES, challenges);
  }

  hasSeenTutorial() {
    return this.getItem('rr_laststop_tutorial_seen', 'false') === 'true';
  }

  setTutorialSeen() {
    this.setItem('rr_laststop_tutorial_seen', 'true');
  }

  getDriveMode() {
    return this.getItem(CONFIG.STORAGE_KEYS.DRIVE_MODE, CONFIG.DRIVE_MODES.NORMAL);
  }

  setDriveMode(mode) {
    const validMode = (mode === CONFIG.DRIVE_MODES.MONSOON) ? CONFIG.DRIVE_MODES.MONSOON : CONFIG.DRIVE_MODES.NORMAL;
    this.setItem(CONFIG.STORAGE_KEYS.DRIVE_MODE, validMode);
    return validMode;
  }
}

export const Storage = new SafeStorage();

