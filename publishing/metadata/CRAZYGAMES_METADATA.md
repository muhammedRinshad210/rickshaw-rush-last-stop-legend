# CRAZYGAMES STORE METADATA & SUBMISSION PACK
## RICKSHAW RUSH: LAST STOP LEGEND

**Developer Portal Target:** CrazyGames Developer Portal  
**Current SDK Target:** CrazyGames SDK v3 (JavaScript HTML5 Web Build)  
**Game Category:** Driving / Arcade / Runner  
**Tags:** Driving, Car, Simulation, Arcade, Runner, Traffic, Retro, Casual, Mobile  

---

### 1. BASIC LAUNCH METADATA (Initial Review Phase)

CrazyGames Basic Launch requires a clean, fast-loading build with zero active monetization before official QA approval:

- **Game Title:** Rickshaw Rush: Last Stop Legend
- **Short Description (80 chars max):** Dodge Kerala traffic, pick up passengers, and deliver fares in an auto-rickshaw!
- **Long Description:**  
  Take the wheel in Rickshaw Rush: Last Stop Legend! Drive through the colorful roads of Kerala, dodge crazy buses and cars, pick up passengers at roadside stands, and complete exciting delivery missions. Explore green villages, Alappuzha backwaters, Cherai beach, Munnar tea hills, and busy Kochi streets. Toggle Kerala Monsoon Mode for an atmospheric rainy drive, scare cows with your horn, and unlock cool rickshaw skins!
- **Game Controls:**  
  - A / D or Left / Right Arrow: Change lanes  
  - W / Up Arrow: Accelerate  
  - S / Down Arrow: Brake / Slow Down  
  - Spacebar or H: Honk Horn (Scares cows)  
  - Touch: Swipe or tap screen edges to change lanes; tap Horn button  
- **Orientation:** Portrait & Landscape Responsive (Auto-adapts to container)
- **Monetization Status during Basic Launch:** **INACTIVE** (No midgame or rewarded ads triggered; clean standalone gameplay flow).

---

### 2. FULL LAUNCH METADATA (Post-Approval Monetization)

Once Basic Launch is approved by the CrazyGames review team, Full Launch hooks in [`src/platform/crazygames.js`](file:///c:/Users/Muhammed%20Rinshad/Desktop/RICKSHAW%20RUSH/src/platform/crazygames.js) are activated:

- **Gameplay Lifecycle Hooks:**
  - `CrazyGames.SDK.game.gameplayStart()` called on GameScene start and unpause.
  - `CrazyGames.SDK.game.gameplayStop()` called on pause and game over crash.
  - `CrazyGames.SDK.game.happytime()` called on passenger delivery celebration.
- **Midgame Interstitial Ads:**
  - `CrazyGames.SDK.ad.requestAd('midgame', callbacks)` called on GameOverScene retry, rate-limited to once every 3 crashes with game audio automatically muted.
- **Rewarded Video Ads:**
  - `CrazyGames.SDK.ad.requestAd('rewarded', callbacks)` called when player taps optional `🎁 BONUS +50 COINS (AD)` button on game over screen. Awards +50 coins on success.

---

### 3. ASSET CHECKLIST FOR CRAZYGAMES

| Asset Name | Resolution | File Path | Status |
|---|---|---|---|
| **App Icon** | 512×512 | `publishing/platform_assets/crazygames/icon_512x512.png` | ✅ Generated (59.7 KB) |
| **Cover 16:9** | 800×450 | `publishing/platform_assets/crazygames/cover_800x450.png` | ✅ Generated (83.7 KB) |
| **Banner** | 1200×630 | `publishing/platform_assets/crazygames/banner_1200x630.png` | ✅ Generated (127.6 KB) |
| **Trailer Video** | 1280×720 (WebM) | `publishing/trailers/rickshaw_rush_trailer_720p.webm` | ✅ Generated (2.96 MB) |
| **Production ZIP** | Complete Bundle | `dist/rickshaw-rush-crazygames.zip` | ✅ Built (415.1 KB) |

