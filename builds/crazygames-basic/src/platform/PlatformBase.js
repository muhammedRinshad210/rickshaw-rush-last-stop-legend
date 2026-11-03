/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Base Abstract Platform Adapter
 */

export class PlatformBase {
  constructor(name = 'base') {
    this.name = name;
    this.isPlaying = false;
    this.isAdShowing = false;
    this.isBasicLaunch = false;
    this.pauseCallbacks = [];
    this.resumeCallbacks = [];
    this.audioCallbacks = [];
  }

  async init() {
    return Promise.resolve();
  }

  firstFrameReady() {}

  gameReady() {}

  gameplayStart() {
    if (this.isPlaying) return;
    this.isPlaying = true;
  }

  gameplayStop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
  }

  async showCommercialBreak() {
    return Promise.resolve(true);
  }

  async showRewardAd() {
    return Promise.resolve(true);
  }

  supportsRewardedAd() {
    return false;
  }

  async saveData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
    return Promise.resolve();
  }

  async loadData(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(key);
      return Promise.resolve(val ? JSON.parse(val) : defaultValue);
    } catch (e) {
      return Promise.resolve(defaultValue);
    }
  }

  submitScore(score) {}

  isAudioEnabled() {
    return true;
  }

  onAudioChange(callback) {
    if (callback) this.audioCallbacks.push(callback);
  }

  onPause(callback) {
    if (callback) this.pauseCallbacks.push(callback);
  }

  onResume(callback) {
    if (callback) this.resumeCallbacks.push(callback);
  }
}

