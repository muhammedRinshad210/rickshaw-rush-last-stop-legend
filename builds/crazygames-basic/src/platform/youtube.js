/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Official YouTube Playables Platform Adapter
 * Complies with YouTube Playables Certification and SDK Requirements.
 */

import { PlatformBase } from './PlatformBase.js';

export class YouTubePlayablesPlatform extends PlatformBase {
  constructor() {
    super('youtube');
    this.ytGame = null;
    this.cloudDataCache = {};
    this.hasFirstFrameReadyFired = false;
    this.hasGameReadyFired = false;
  }

  async init() {
    // Detect YouTube Playables SDK
    if (typeof window !== 'undefined' && window.YTGame) {
      this.ytGame = window.YTGame;

      // Register official pause and resume hooks
      if (typeof this.ytGame.onPause === 'function') {
        this.ytGame.onPause(() => {
          this.pauseCallbacks.forEach(cb => cb());
        });
      }

      if (typeof this.ytGame.onResume === 'function') {
        this.ytGame.onResume(() => {
          this.resumeCallbacks.forEach(cb => cb());
        });
      }

      // Audio setting change hook (support onAudioEnabledChange and fallback onAudioChange)
      const audioHook = this.ytGame.onAudioEnabledChange || this.ytGame.onAudioChange;
      if (typeof audioHook === 'function') {
        audioHook.call(this.ytGame, (enabled) => {
          this.audioCallbacks.forEach(cb => cb(enabled));
        });
      }

      // Preload cloud data into cache
      if (typeof this.ytGame.loadData === 'function') {
        try {
          const raw = await this.ytGame.loadData();
          if (raw && typeof raw === 'string') {
            this.cloudDataCache = JSON.parse(raw);
            console.log('[YouTube Playables] Cloud data loaded successfully.');
          }
        } catch (e) {
          console.warn('[YouTube Playables] Initial loadData parse warning:', e);
        }
      }
    } else {
      console.log('[YouTube Playables] Mock mode (SDK not detected in local dev environment)');
    }
    return Promise.resolve();
  }

  firstFrameReady() {
    if (this.hasFirstFrameReadyFired) return;
    this.hasFirstFrameReadyFired = true;
    if (this.ytGame && typeof this.ytGame.firstFrameReady === 'function') {
      try {
        this.ytGame.firstFrameReady();
        console.log('[YouTube Playables] firstFrameReady() dispatched.');
      } catch (e) {
        console.warn('[YTGame] firstFrameReady error:', e);
      }
    }
  }

  gameReady() {
    if (this.hasGameReadyFired) return;
    this.hasGameReadyFired = true;
    if (this.ytGame && typeof this.ytGame.gameReady === 'function') {
      try {
        this.ytGame.gameReady();
        console.log('[YouTube Playables] gameReady() dispatched.');
      } catch (e) {
        console.warn('[YTGame] gameReady error:', e);
      }
    }
  }

  async saveData(key, value) {
    this.cloudDataCache[key] = value;
    if (this.ytGame && typeof this.ytGame.saveData === 'function') {
      try {
        await this.ytGame.saveData(JSON.stringify(this.cloudDataCache));
        return;
      } catch (e) {
        console.warn('[YTGame] Cloud saveData fallback:', e);
      }
    }
    return super.saveData(key, value);
  }

  async loadData(key, defaultValue = null) {
    if (this.cloudDataCache && key in this.cloudDataCache) {
      return Promise.resolve(this.cloudDataCache[key]);
    }
    if (this.ytGame && typeof this.ytGame.loadData === 'function') {
      try {
        const raw = await this.ytGame.loadData();
        if (raw && typeof raw === 'string') {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            this.cloudDataCache = parsed;
            if (key in parsed) return parsed[key];
          }
        }
      } catch (e) {
        console.warn('[YTGame] Cloud loadData fallback:', e);
      }
    }
    return super.loadData(key, defaultValue);
  }

  submitScore(score) {
    if (this.ytGame && typeof this.ytGame.sendScore === 'function') {
      try {
        this.ytGame.sendScore({ value: Math.floor(score) });
        console.log('[YouTube Playables] sendScore dispatched:', Math.floor(score));
      } catch (e) {
        console.warn('[YTGame] sendScore error:', e);
      }
    }
  }

  isAudioEnabled() {
    if (this.ytGame && typeof this.ytGame.getAudioEnabled === 'function') {
      return this.ytGame.getAudioEnabled();
    }
    return true;
  }
}

