# CRAZYGAMES SUBMISSION CHECKLIST
## RICKSHAW RUSH: LAST STOP LEGEND

**Game Version:** v1.3.0  
**Target Platform:** CrazyGames Web Portal  
**SDK Specification:** CrazyGames SDK v3 (`https://sdk.crazygames.com/crazygames-sdk-v3.js`)  
**Package Path:** `builds/crazygames/`  
**Distribution ZIP:** `dist/rickshaw-rush-crazygames.zip` (408.7 KB)  
**Documentation Reference:** [CrazyGames Developer Docs](https://docs.crazygames.com/)  

---

## 1. Basic Launch Verification Checklist

Basic Launch allows submitting a clean, high-performance HTML5 build without requiring full monetization SDK integration.

| Requirement | Specification | Status | Evidence / Verification Notes |
| :--- | :--- | :---: | :--- |
| **Standalone-Compatible Build** | Runs cleanly with or without SDK script present | **VERIFIED** | Fallback mock mode in `crazygames.js` prevents exceptions when SDK is absent or blocked by AdBlock. |
| **Initial Download Size** | Recommended < 15 MB | **VERIFIED** | Total uncompressed package: **1.53 MB**; ZIP package: **408.7 KB**. |
| **Boot & Load Performance** | First frame under 3 seconds | **VERIFIED** | Loads and paints initial frame in **< 350 ms** on 4G throttle; all vector assets generated procedurally in memory. |
| **Quick Gameplay Onboarding** | Player reaches playable state quickly | **VERIFIED** | One tap on "START DRIVE" launches immediate Kerala highway runner gameplay. |
| **Input & Responsive Layout** | Touch zones, keyboard, mouse | **VERIFIED** | A/D and Arrow Keys, touch screen halves, horn button, and responsive resize from 9:16 to 21:9. |
| **Third-Party Ads** | No external Google AdSense/AdX tags | **VERIFIED** | Zero third-party ad tags or external network trackers in source code. |
| **Console Cleanliness** | 0 uncaught exceptions, 0 404s | **VERIFIED** | Headless Chrome browser audit recorded 0 runtime errors. |

---

## 2. Full Launch SDK v3 Integration Checklist

| SDK Function | Implementation Details | Status | Code Reference |
| :--- | :--- | :---: | :--- |
| **SDK Initialization** | `window.CrazyGames.SDK.init()` | **PARTIALLY VERIFIED** | Implemented with try/catch; fully verified in local mock environment. **REQUIRES PLATFORM ACCESS** for CrazyGames QA sandbox. |
| **`gameplayStart()`** | Fired when gameplay begins or resumes | **VERIFIED** | Dispatched in `GameScene.create()` and `GameScene.resumeGame()`. Guarded against consecutive duplicates. |
| **`gameplayStop()`** | Fired on crash, game over, or pause | **VERIFIED** | Dispatched in `GameScene.handleCrash()`, `pauseGame()`, and `cleanup()`. Duplicate prevention enforced. |
| **`happytime()`** | Fired on notable player achievement | **VERIFIED** | Hooked on successful passenger deliveries and new high score records. |
| **Midgame Interstitial Ads** | `cgSDK.ad.requestAd('midgame', callbacks)` | **PARTIALLY VERIFIED** | Implemented with 60s rate limiting on Retry. Mutes audio and disables inputs during `adStarted`; resumes on `adFinished`/`adError`. |
| **Rewarded Advertisements** | `cgSDK.ad.requestAd('rewarded', callbacks)` | **PARTIALLY VERIFIED** | Optional bonus coin button ("🎁 BONUS +50 ₹ (AD)") on Game Over screen. Mutes audio; awards +50 coins on success. |
| **Audio Handling During Ads** | Complete mute during commercial break | **VERIFIED** | `AudioSystem.setMuted(true)` triggered on `adStarted`; previous audio preferences restored on finish. |

---

## 3. Submission Artifacts & Assets

- **Zip Archive:** `dist/rickshaw-rush-crazygames.zip`
- **Build Manifest:** `builds/crazygames/build_manifest.json`
- **Main Entry Point:** `builds/crazygames/index.html`
- **Resolution:** Responsive fluid canvas (`Phaser.Scale.RESIZE`, min 360x640, max 2560x1440)
- **Aspect Ratio:** Optimal in 16:9 landscape or 9:16 portrait mobile mode

---

## 4. Current Status & Next Actions

- **Overall Status:** **VERIFIED FOR BASIC LAUNCH / PARTIALLY VERIFIED FOR FULL LAUNCH**
- **Next Step:** Upload `dist/rickshaw-rush-crazygames.zip` to the CrazyGames Developer Portal dashboard and trigger the CrazyGames SDK QA Tool test suite.

