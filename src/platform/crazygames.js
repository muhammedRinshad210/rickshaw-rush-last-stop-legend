/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * CrazyGames Official Platform Adapter
 * Complies with CrazyGames SDK v2 & v3 specifications.
 */

import { PlatformBase } from './PlatformBase.js';

export class CrazyGamesPlatform extends PlatformBase {
  constructor(options = {}) {
    const isBasic = !!(options.isBasicLaunch || (typeof window !== 'undefined' && (window.__RR_CRAZYGAMES_BASIC__ || window.__RR_PLATFORM__ === 'crazygames-basic')));
    super(isBasic ? 'crazygames-basic' : 'crazygames');
    this.cgSDK = null;
    this.isBasicLaunch = isBasic;
  }

  async init() {
    if (typeof window !== 'undefined' && window.CrazyGames && window.CrazyGames.SDK) {
      this.cgSDK = window.CrazyGames.SDK;
      try {
        await this.cgSDK.init();
        console.log(`[CrazyGames] SDK initialized successfully. Mode: ${this.isBasicLaunch ? 'BASIC LAUNCH (Unmonetized)' : 'FULL LAUNCH (Monetized)'}`);
      } catch (e) {
        console.warn('[CrazyGames] SDK init error / AdBlock detected:', e);
      }
    } else {
      console.log(`[CrazyGames] ${this.isBasicLaunch ? 'Basic Launch' : 'Full Launch'} Mock mode (SDK script not detected)`);
    }
    return Promise.resolve();
  }

  gameplayStart() {
    if (this.isPlaying) return; // Prevent duplicate consecutive start
    this.isPlaying = true;
    if (this.cgSDK && this.cgSDK.game && typeof this.cgSDK.game.gameplayStart === 'function') {
      try {
        this.cgSDK.game.gameplayStart();
      } catch (e) {
        console.warn('[CrazyGames] gameplayStart error:', e);
      }
    }
  }

  gameplayStop() {
    if (!this.isPlaying) return; // Prevent duplicate consecutive stop
    this.isPlaying = false;
    if (this.cgSDK && this.cgSDK.game && typeof this.cgSDK.game.gameplayStop === 'function') {
      try {
        this.cgSDK.game.gameplayStop();
      } catch (e) {
        console.warn('[CrazyGames] gameplayStop error:', e);
      }
    }
  }

  happytime() {
    if (this.cgSDK && this.cgSDK.game && typeof this.cgSDK.game.happytime === 'function') {
      try {
        this.cgSDK.game.happytime();
      } catch (e) {}
    }
  }

  async showCommercialBreak() {
    // Basic Launch Rule: Strictly zero interstitial advertising calls
    if (this.isBasicLaunch) {
      return Promise.resolve(true);
    }

    if (this.cgSDK && this.cgSDK.ad && typeof this.cgSDK.ad.requestAd === 'function') {
      this.isAdShowing = true;
      return new Promise((resolve) => {
        const callbacks = {
          adStarted: () => {
            this.audioCallbacks.forEach(cb => cb(false));
            this.pauseCallbacks.forEach(cb => cb());
          },
          adFinished: () => {
            this.isAdShowing = false;
            this.audioCallbacks.forEach(cb => cb(true));
            this.resumeCallbacks.forEach(cb => cb());
            resolve(true);
          },
          adError: (error) => {
            this.isAdShowing = false;
            this.audioCallbacks.forEach(cb => cb(true));
            this.resumeCallbacks.forEach(cb => cb());
            console.warn('[CrazyGames] adError:', error);
            resolve(false);
          }
        };
        try {
          this.cgSDK.ad.requestAd('midgame', callbacks);
        } catch (e) {
          this.isAdShowing = false;
          this.audioCallbacks.forEach(cb => cb(true));
          resolve(false);
        }
      });
    }
    return Promise.resolve(true);
  }

  supportsRewardedAd() {
    // Basic Launch Rule: Hide rewarded ad button completely
    if (this.isBasicLaunch) {
      return false;
    }
    return !!(this.cgSDK && this.cgSDK.ad && typeof this.cgSDK.ad.requestAd === 'function');
  }

  async showRewardAd() {
    // Basic Launch Rule: Strictly zero rewarded advertising calls
    if (this.isBasicLaunch) {
      return Promise.resolve(true);
    }

    if (this.cgSDK && this.cgSDK.ad && typeof this.cgSDK.ad.requestAd === 'function') {
      this.isAdShowing = true;
      return new Promise((resolve) => {
        const callbacks = {
          adStarted: () => {
            this.audioCallbacks.forEach(cb => cb(false));
            this.pauseCallbacks.forEach(cb => cb());
          },
          adFinished: () => {
            this.isAdShowing = false;
            this.audioCallbacks.forEach(cb => cb(true));
            this.resumeCallbacks.forEach(cb => cb());
            resolve(true);
          },
          adError: (error) => {
            this.isAdShowing = false;
            this.audioCallbacks.forEach(cb => cb(true));
            this.resumeCallbacks.forEach(cb => cb());
            console.warn('[CrazyGames] rewarded adError:', error);
            resolve(false);
          }
        };
        try {
          this.cgSDK.ad.requestAd('rewarded', callbacks);
        } catch (e) {
          this.isAdShowing = false;
          this.audioCallbacks.forEach(cb => cb(true));
          resolve(false);
        }
      });
    }
    return Promise.resolve(true);
  }
}

