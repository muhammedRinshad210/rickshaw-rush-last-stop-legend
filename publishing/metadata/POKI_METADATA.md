# POKI SUBMISSION METADATA & DEVELOPER PACK
## RICKSHAW RUSH: LAST STOP LEGEND

**Portal Target:** Poki Developers (developers.poki.com)  
**SDK Version:** Poki SDK v2 (`patch/js/poki-sdk.js`)  
**Engine:** Phaser 4.2.1 (Phaser 3 compatible API runtime, locally bundled)  
**Category:** Skill / Arcade / Car Games  

---

### 1. POKI DEVELOPER SUBMISSION FORM DRAFTS

- **Game Name:** Rickshaw Rush: Last Stop Legend
- **Tagline:** PICK UP. DODGE. DELIVER. REPEAT.
- **Short Pitch (Why is this game unique on Poki?):**  
  *Rickshaw Rush: Last Stop Legend* brings a colorful, fresh cultural theme to the endless runner genre. Players pilot an Indian auto-rickshaw through the tropical landscapes of Kerala. Unlike standard endless runners that only focus on obstacle dodging, Rickshaw Rush introduces an active passenger pickup and delivery mission cycle: players pull over to roadside stands to board quirky commuters, race against distance milestones to reach destination drop-off bays, and collect fare bonuses. Paired with a dedicated Kerala Monsoon Mode featuring real-time rainfall, cows cleared by honking, and near-miss skill combos, it offers instant accessibility with deep replayability.
- **Game Engine:** Phaser 4.2.1 (Custom lightweight canvas/WebGL architecture; zero external libraries; 415 KB package size).
- **Previous Publishing Experience:** Independent game development team with expertise in production-quality HTML5 web canvas architecture and multi-platform publishing.
- **Current Development Stage:** Fully finished production release candidate (Phases 1–5 complete, 56/56 automated tests passing).

---

### 2. POKI COMPLIANCE & BRANDING VERIFICATION

- **Responsive Canvas:** Resizes dynamically to any aspect ratio (standard 16:9 on desktop, 9:16 portrait on mobile phones) without letterboxing distortion.
- **Audio Integration:** Web Audio API sounds and music strictly mute during `PokiSDK.commercialBreak()` and `PokiSDK.rewardedBreak()`, and restore on completion.
- **Single-Event Guard:** Prevents duplicate consecutive `gameplayStart` or `gameplayStop` calls.
- **Zero Third-Party Branding:** Contains no external developer or portal watermarks on the game canvas.

---

### 3. THREE REQUIRED ACTUAL GAMEPLAY SCREENSHOTS (POKI SELECTION)

Poki strictly requires actual in-game screenshots showing authentic UI and gameplay:

1. **`poki_01_village_dodge.png` (94.0 KB):**  
   - High-speed traffic dodging through the lush Kerala Village, featuring transport buses, cars, coconut trees, and active HUD.
2. **`poki_02_backwaters_cruise.png` (88.9 KB):**  
   - Scenic drive across the Alappuzha Backwaters bridge alongside traditional *kettuvallam* houseboats and coconut palm riverbanks.
3. **`poki_03_monsoon_rush.png` (93.3 KB):**  
   - Kerala Monsoon Mode in action, showcasing slanted rain particles, roadside puddles, dimmed storm sky, and high-stakes maneuvering.

All three screenshots are pre-packaged in [`publishing/platform_assets/poki/`](file:///c:/Users/Muhammed%20Rinshad/Desktop/RICKSHAW%20RUSH/publishing/platform_assets/poki/).

---

### 4. SUBMISSION ASSET SUMMARY

| Asset | Dimension | File Path |
|---|---|---|
| **Poki Master Icon** | 512×512 | `publishing/platform_assets/poki/icon_512x512.png` |
| **Showcase Cover** | 1920×1080 | `publishing/platform_assets/poki/cover_1920x1080.png` |
| **Poki Screenshot 1** | 720×1280 | `publishing/platform_assets/poki/poki_01_village_dodge.png` |
| **Poki Screenshot 2** | 720×1280 | `publishing/platform_assets/poki/poki_02_backwaters_cruise.png` |
| **Poki Screenshot 3** | 720×1280 | `publishing/platform_assets/poki/poki_03_monsoon_rush.png` |
| **Gameplay Video Trailer** | 1280×720 (26s WebM) | `publishing/trailers/rickshaw_rush_trailer_720p.webm` |
| **Poki Production ZIP** | Standalone ZIP | `dist/rickshaw-rush-poki.zip` (415.1 KB) |

