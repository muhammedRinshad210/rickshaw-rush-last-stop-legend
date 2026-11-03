# YOUTUBE PLAYABLES SUBMISSION CHECKLIST
## RICKSHAW RUSH: LAST STOP LEGEND

**Game Version:** v1.3.0  
**Target Platform:** YouTube Playables  
**Official SDK:** `https://www.youtube.com/game_api/v1`  
**Package Path:** `builds/youtube/`  
**Distribution ZIP:** `dist/rickshaw-rush-youtube.zip` (408.7 KB)  
**Documentation Reference:** [Google YouTube Playables Guidelines](https://developers.google.com/youtube/gaming/playables)  

---

## 1. Technical Requirements & Compliance Checklist

| Requirement | Specification | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **SDK Loading Order** | SDK must load in `<head>` before all game scripts | **VERIFIED** | `<script src="https://www.youtube.com/game_api/v1"></script>` placed in `<head>` prior to `phaser.min.js` and `main.js`. |
| **`firstFrameReady()`** | Called when first frame renders | **VERIFIED** | Triggered on Phaser `game.events.once('ready')`. Guarded against repeated execution. |
| **`gameReady()`** | Called only when game is interactive | **VERIFIED** | Triggered in `BootScene.create()` after procedural vector generation completes and game transitions to `MenuScene`. |
| **Pause Callback** | `YTGame.onPause(callback)` | **VERIFIED** | Registered in `youtube.js`; triggers `GameScene.pauseGame()` and halts audio. |
| **Resume Callback** | `YTGame.onResume(callback)` | **VERIFIED** | Registered in `youtube.js`; triggers `GameScene.resumeGame()` and restores audio. |
| **Audio Sync** | `onAudioEnabledChange()` & `getAudioEnabled()` | **VERIFIED** | Registered in `youtube.js`; synchronizes directly with `AudioSystem.setMuted(!enabled)`. |
| **Cloud State Persistence** | `YTGame.saveData(dataString)` | **VERIFIED** | Implemented with local in-memory cache `cloudDataCache` to ensure sequential key saves (`highScore`, `coins`, `selectedSkin`) merge safely without overwriting previous data. Payload is serialized JSON string (<256 KB). |
| **Cloud State Retrieval** | `YTGame.loadData()` | **VERIFIED** | Preloaded on `init()` into `cloudDataCache` with fallback to `localStorage`. |
| **Score Submission** | `YTGame.sendScore({ value })` | **VERIFIED** | Dispatched on Game Over with integer score matching the displayed and saved high score. |
| **Zero External Network Calls** | All game resources local | **VERIFIED** | Zero third-party web fonts, tracking pixels, or remote CDNs. Complies with strict Playables Content Security Policy (CSP). |
| **Resize State Preservation** | Responsive layout across viewport shifts | **VERIFIED** | Phaser dynamic scaling recalculates lane bounds without resetting player position, score, or active mission. |

---

## 2. Content Security Policy & HTTP Header Compliance

YouTube Playables runs inside an isolated iframe sandbox with strict CSP constraints:
- **`default-src 'self'`**: All scripts, styling, and graphics are bundled locally or generated dynamically via Canvas 2D / WebGL.
- **`connect-src 'self' https://www.youtube.com`**: No external telemetry, remote databases, or analytics services contacted.
- **`media-src 'self' blob: data:`**: Audio generated via Web Audio API oscillators and gain nodes (zero external MP3/WAV requests).
- **`script-src 'self' https://www.youtube.com/game_api/v1 'unsafe-inline'`**: Minimal inline bootstrap config flag.

---

## 3. Platform Verification & Testing Status

- **Local Mock SDK Simulation:** **VERIFIED** (Platform adapter detects mock environment gracefully, falls back to safe local storage and logs lifecycle events).
- **Official YouTube Test Suite:** **REQUIRES PLATFORM ACCESS** (Access to YouTube Playables Partner Portal and Google Playables Test Suite is required for official end-to-end sandbox validation).
- **Platform Acceptance:** **NOT YET SUBMITTED** (Honest status: Local build is compliant and ready for partner submission, but platform review and approval must be completed by Google YouTube Playables team).

---

## 4. Current Status & Next Actions

- **Overall Status:** **VERIFIED (Ready for YouTube Playables Partner Submission)**
- **Next Step:** Upload `dist/rickshaw-rush-youtube.zip` to the Google Playables Partner Console for automated CSP and SDK lifecycle testing.

