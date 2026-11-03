/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Standalone Browser Platform Adapter
 * Offline-first, browser localStorage, window visibility handling.
 */

import { PlatformBase } from './PlatformBase.js';

export class StandalonePlatform extends PlatformBase {
  constructor() {
    super('standalone');
    this.pauseCallbacks = [];
    this.resumeCallbacks = [];

    // Pause on tab visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseCallbacks.forEach(cb => cb());
      } else {
        this.resumeCallbacks.forEach(cb => cb());
      }
    });

    // Window blur pause
    window.addEventListener('blur', () => {
      this.pauseCallbacks.forEach(cb => cb());
    });
  }

  onPause(callback) {
    if (callback) this.pauseCallbacks.push(callback);
  }

  onResume(callback) {
    if (callback) this.resumeCallbacks.push(callback);
  }
}

