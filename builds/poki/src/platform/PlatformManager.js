/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Platform Manager Dispatcher
 */

import { StandalonePlatform } from './standalone.js';
import { YouTubePlayablesPlatform } from './youtube.js';
import { CrazyGamesPlatform } from './crazygames.js';
import { PokiPlatform } from './poki.js';

class PlatformManagerClass {
  constructor() {
    this.platform = null;
  }

  detectPlatform() {
    // 1. Check window override (configured during build or index.html)
    if (typeof window !== 'undefined' && window.__RR_PLATFORM__) {
      return window.__RR_PLATFORM__;
    }

    // 2. Check URL search param (?platform=youtube | crazygames | crazygames-basic | poki | standalone)
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('platform');
      if (p) return p.toLowerCase();
    }

    // 3. Check for specific SDK presence in global scope
    if (typeof window !== 'undefined') {
      if (window.__RR_CRAZYGAMES_BASIC__) return 'crazygames-basic';
      if (window.YTGame) return 'youtube';
      if (window.CrazyGames) return 'crazygames';
      if (window.PokiSDK) return 'poki';
    }

    return 'standalone';
  }

  async init() {
    const target = this.detectPlatform();
    console.log(`[PlatformManager] Initializing platform adapter: ${target}`);

    switch (target) {
      case 'youtube':
        this.platform = new YouTubePlayablesPlatform();
        break;
      case 'crazygames-basic':
        this.platform = new CrazyGamesPlatform({ isBasicLaunch: true });
        break;
      case 'crazygames':
        this.platform = new CrazyGamesPlatform({ isBasicLaunch: false });
        break;
      case 'poki':
        this.platform = new PokiPlatform();
        break;
      default:
        this.platform = new StandalonePlatform();
        break;
    }

    await this.platform.init();
    return this.platform;
  }

  get current() {
    if (!this.platform) {
      this.platform = new StandalonePlatform();
    }
    return this.platform;
  }
}

export const PlatformManager = new PlatformManagerClass();

