/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Poki HTML5 Platform Adapter
 * Complies with Poki SDK v2 and Phaser integration guide.
 */

import { PlatformBase } from './PlatformBase.js';

export class PokiPlatform extends PlatformBase {
  constructor() {
    super('poki');
    this.pokiSDK = null;
    this.isLoadingFinished = false;
  }

  async init() {
    if (typeof window !== 'undefined' && window.PokiSDK) {
      this.pokiSDK = window.PokiSDK;
      try {
        await this.pokiSDK.init();
        console.log('[Poki] SDK v2 initialized successfully.');
      } catch (e) {
        console.warn('[Poki] SDK init error / AdBlock detected:', e);
      }
    } else {
      console.log('[Poki] Mock mode (SDK not detected)');
    }
    return Promise.resolve();
  }

  gameReady() {
    if (this.isLoadingFinished) return;
    this.isLoadingFinished = true;
    if (this.pokiSDK && typeof this.pokiSDK.gameLoadingFinished === 'function') {
      try {
        this.pokiSDK.gameLoadingFinished();
        console.log('[Poki] gameLoadingFinished() fired.');
      } catch (e) {
        console.warn('[Poki] gameLoadingFinished error:', e);
      }
    }
  }

  gameplayStart() {
    if (this.isPlaying) return; // Prevent duplicate consecutive calls
    this.isPlaying = true;
    if (this.pokiSDK && typeof this.pokiSDK.gameplayStart === 'function') {
      try {
        this.pokiSDK.gameplayStart();
      } catch (e) {
        console.warn('[Poki] gameplayStart error:', e);
      }
    }
  }

  gameplayStop() {
    if (!this.isPlaying) return; // Prevent duplicate consecutive calls
    this.isPlaying = false;
    if (this.pokiSDK && typeof this.pokiSDK.gameplayStop === 'function') {
      try {
        this.pokiSDK.gameplayStop();
      } catch (e) {
        console.warn('[Poki] gameplayStop error:', e);
      }
    }
  }

  async showCommercialBreak() {
    if (this.pokiSDK && typeof this.pokiSDK.commercialBreak === 'function') {
      this.isAdShowing = true;
      this.audioCallbacks.forEach(cb => cb(false));
      this.pauseCallbacks.forEach(cb => cb());

      return new Promise((resolve) => {
        try {
          const res = this.pokiSDK.commercialBreak(() => {
            this.isAdShowing = false;
            this.audioCallbacks.forEach(cb => cb(true));
            this.resumeCallbacks.forEach(cb => cb());
            resolve(true);
          });
          // Handle promise return if SDK v2 returns a Promise
          if (res && typeof res.then === 'function') {
            res.then(() => {
              this.isAdShowing = false;
              this.audioCallbacks.forEach(cb => cb(true));
              this.resumeCallbacks.forEach(cb => cb());
              resolve(true);
            }).catch(() => {
              this.isAdShowing = false;
              this.audioCallbacks.forEach(cb => cb(true));
              this.resumeCallbacks.forEach(cb => cb());
              resolve(false);
            });
          }
        } catch (e) {
          this.isAdShowing = false;
          this.audioCallbacks.forEach(cb => cb(true));
          this.resumeCallbacks.forEach(cb => cb());
          resolve(false);
        }
      });
    }
    return Promise.resolve(true);
  }

  supportsRewardedAd() {
    return !!(this.pokiSDK && typeof this.pokiSDK.rewardedBreak === 'function');
  }

  async showRewardAd() {
    if (this.pokiSDK && typeof this.pokiSDK.rewardedBreak === 'function') {
      this.isAdShowing = true;
      this.audioCallbacks.forEach(cb => cb(false));
      this.pauseCallbacks.forEach(cb => cb());

      return new Promise((resolve) => {
        try {
          this.pokiSDK.rewardedBreak((success) => {
            this.isAdShowing = false;
            this.audioCallbacks.forEach(cb => cb(true));
            this.resumeCallbacks.forEach(cb => cb());
            resolve(Boolean(success));
          });
        } catch (e) {
          this.isAdShowing = false;
          this.audioCallbacks.forEach(cb => cb(true));
          this.resumeCallbacks.forEach(cb => cb());
          resolve(false);
        }
      });
    }
    return Promise.resolve(true);
  }
}

