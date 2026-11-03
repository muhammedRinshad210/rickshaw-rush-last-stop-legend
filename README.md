# RICKSHAW RUSH: LAST STOP LEGEND
### *PICK UP. DODGE. DELIVER. REPEAT.*

**Rickshaw Rush: Last Stop Legend** is a production-quality, responsive HTML5 arcade runner built with Phaser 3, Canvas/WebGL rendering, and pure Web Audio API synthesis. Set against the vibrant, tropical backdrop of Kerala, India, the player steers an authentic auto-rickshaw across three lanes of unpredictable highway traffic, picking up passengers, dodging colorful KSRTC buses and street cows, honking to clear the road, collecting fares, and unlocking legendary auto designs.

---

## 🌴 Phase 2: Kerala World Expansion (5 Continuous Road-Trip Biomes)

1. **Kerala Village (0–45s)**:
   - Green paddy fields, banana groves with *nendran* fruit bunches, coconut palms, electric poles with dangling cables, traditional red-tiled *veedu*, and roadside chai shops (*Kayi's Chaya Kada*).
   - Animated paddy field farmers in straw hats (*thoppi*) and peaceful roadside grazing cows.
2. **Alappuzha Backwaters (45–90s)**:
   - Shimmering blue Vembanad waterways flanking the road, floating purple water hyacinths (*kulavazha*), and white egrets in flight.
   - Traditional Kerala Houseboats (*Kettuvallam*) with arched thatch canopies cruising along the water, fishing canoes (*vallam*), and distant Snake Boat (*Chundan Vallam*) racers.
   - Reinforced concrete bridge crossings with safety balustrade guardrails.
3. **Kerala Coastal Road (90–135s)**:
   - Arabian Sea coastline with animated breaking ocean wave crests and golden sunset lighting.
   - Striped seaside lighthouse tower with illuminated lantern dome, iconic Kochi Chinese Fishing Nets (*Cheena Vala*), colorful wooden fishing boats on the sand, and gliding seagulls.
4. **Munnar Tea Hills (135–180s)**:
   - Emerald terraced tea plantation hills, cool mountain mist, drifting cloud puffs, tall Western Ghats pine trees, and British colonial planter bungalows.
   - Rocky mountain cliffs with cascading frothy waterfalls.
5. **Kochi Town at Night (180–225s+)**:
   - Deep midnight sky with illuminated 2-story town buildings and glowing neon signs (*"HOTEL ARYAAS"*, *"BAZAAR"*).
   - Warm golden streetlight pools illuminating the road shoulders, multi-colored festive light strings, and KSRTC bus stop shelters.
- **Continuous Crossfades & Banners**: 2.5-second visual color lerping between asphalt, shoulders, and kerbs without road resets, accompanied by sliding Malayalam & English location banners (*"ENTERING KUTTANAD WATERWAYS"*, *"CLIMBING MUNNAR TEA HILLS"*) and gentle melodic chimes.
  - Centered road geometry that dynamically scales across **9:16 portrait smartphones, 9:21 tall phones, 3:4 tablets, 1:1, 16:9 widescreen desktop, and 21:9 ultrawide monitors** without page reloads.
  - Smooth 120ms lane switching with banking tilt animation.
  - Parallax scrolling roadside scenery with coconut palms, traditional terracotta-roofed Kerala houses, roadside chai shops (*Kayi's Chaya Kada*), highway milestones, and Arabian coastal beaches.
  - Dynamic weather: Tropical sunshine with transitions into monsoon rain showers and wet asphalt reflections.

- **Signature Passenger Pickup & Delivery Mechanic**:
  - Roadside passenger stops with waiting passengers (Grandma in Kasavu saree, college student, uncle with umbrella, office commuter, beach tourist).
  - 5 iconic Kerala destinations: *Kayi’s Tea Shop (ചായക്കട)*, *Chalakkudy Market (ചന്ത)*, *Cherai Beach (തീരം)*, *Central Railway (റെയിൽവേ)*, and *Town Clock Tower (ടൗൺ)*.
  - Passenger boarding with backseat occupant sprite and active mission card displaying distance countdown and fare coin bounty.
  - Glowing roadside drop-off bays with confetti celebrations and cash-register fare coin rewards.

- **Signature Auto Horn System**:
  - Interactive on-screen retro rubber bulb horn button (thumb-friendly with radial cooldown sweep) or `Space` / `H` on desktop.
  - Synthesized dual-tone Indian electric auto horn (*Peee-pooo!*).
  - Startles street cows, prompting an alert `!` reaction, cute cow moo sound, and causing them to trot safely onto the grassy verge, clearing the blocked lane.

- **Skill & Power-Up Economy**:
  - **Chaya Shield**: 3-second golden cutting-chai shield absorbing 1 collision.
  - **Coin Magnet**: Gravitational field drawing gold coins toward the auto.
  - **Speed Boost**: Turbo chili nitro blast with speed lines, 2x score multiplier, and pitch-accelerated 2-stroke engine sound.
  - **Near-Miss Skill System**: Sub-pixel geometric proximity detection rewarding consecutive close dodges with floating callouts (*"NICE DODGE!", "RISKY DRIFT!"*) and combo multipliers up to 5x.
  - **Rotating Challenges & Garage**: 5 distinct cosmetic auto-rickshaw designs (*Kerala Classic*, *Malabar Fire*, *Kochi Coastal*, *Royal Kozhikode*, *Midnight Express*) unlockable using earned in-game fare coins.

- **100% Procedural Audio & Graphics**:
  - Zero external asset requests, zero copyright risk, zero bloated textures.
  - All sprites procedurally drawn onto crisp HTML5 canvas textures at boot.
  - 100% Web Audio API procedural synthesis: 2-stroke engine chug, dual-tone horn, coin arpeggios, cow moos, crash impacts, passenger chimes, and UI pops.

---

## 📁 Project Structure

```text
/
├── index.html                 # Master HTML5 entry point
├── package.json               # Project manifest & build scripts
├── vendor/
│   └── phaser.min.js          # Locally bundled Phaser 3 distribution
├── src/
│   ├── main.js                # Game bootstrap & responsive Phaser configuration
│   ├── core/
│   │   ├── Config.js          # Balance, lanes, skins, power-ups & destination parameters
│   │   ├── AudioSystem.js     # Procedural Web Audio API sound synthesizer
│   │   ├── AssetFactory.js    # 100% Procedural vector canvas texture generator
│   │   └── Storage.js         # Safe persistent storage with incognito fallbacks
│   ├── entities/
│   │   ├── PlayerAuto.js      # Player rickshaw entity (lanes, tweening, power-ups, horn)
│   │   ├── Obstacle.js        # KSRTC Bus, Goods Lorry, Cow, Pothole, Police Barrier
│   │   ├── Passenger.js       # Passenger pickup stops and destination drop-off bays
│   │   └── PowerUp.js         # Chaya Shield, Coin Magnet, Speed Boost, Gold Coins
│   ├── systems/
│   │   ├── TrafficSpawner.js  # Fair wave spawner guaranteeing reachable safe lanes
│   │   ├── NearMissSystem.js  # Geometric proximity detector with combo multiplier
│   │   ├── MissionSystem.js   # Passenger missions and rotating challenges
│   │   └── EnvironmentScenery.js # 3 Kerala biomes with parallax & dynamic weather
│   ├── ui/
│   │   └── HUD.js             # Responsive HUD (score, coins, mission card, horn button)
│   ├── scenes/
│   │   ├── BootScene.js       # Procedural asset generation & audio unlock
│   │   ├── MenuScene.js       # Title screen, high score, rickshaw preview
│   │   ├── GameScene.js       # Core gameplay loop and collision handling
│   │   ├── PauseScene.js      # Pause modal preserving game state
│   │   ├── GameOverScene.js   # Final score breakdown, record animation, instant retry
│   │   └── GarageScene.js     # 5-Skin auto customization & coin unlocking
│   └── platform/
│       ├── PlatformBase.js    # Unified platform interface
│       ├── PlatformManager.js # Auto-detection & platform routing
│       ├── standalone.js      # Standalone browser adapter (offline, localStorage)
│       ├── youtube.js         # YouTube Playables certified SDK adapter
│       ├── crazygames.js      # CrazyGames SDK v3 adapter
│       └── poki.js            # Poki HTML5 SDK v2 adapter
├── builds/
│   ├── standalone/            # Ready-to-host standalone web build
│   ├── youtube/               # Ready-to-submit YouTube Playables package
│   ├── crazygames/            # Ready-to-submit CrazyGames package
│   └── poki/                  # Ready-to-submit Poki package
├── scripts/
│   └── build.js               # Multi-platform build and packaging script
└── tests/
    └── automated_tests.js     # 20-Point automated verification suite
```

---

## 🚀 Running the Game Locally

1. Open a terminal in the project directory.
2. Run any static HTTP server (e.g. using Node or Python):
   ```bash
   # Using npx serve:
   npx serve .

   # Or using Python:
   python -m http.server 8080
   ```
3. Open `http://localhost:8080` in your web browser.

---

## 🧪 Running Automated Tests

Run the full 20-point automated test suite:
```bash
npm test
```
All 20 tests verify:
- Gameplay start & configuration integrity
- 120ms player lane switching & boundaries
- Passenger pickup stop mechanics
- Passenger drop-off and fare collection
- Cow horn scaring state machine
- Coin collection economy
- Special power-ups (Shield, Magnet, Boost)
- Near-miss geometric proximity & combo multiplier
- Difficulty progression scaling
- 1,000-wave fair obstacle generation guarantee (never 3 blocked lanes)
- Collision & crash state handling
- Instant retry without page reload
- Safe storage persistence & incognito mode safety
- Audio preferences & mute toggling
- Touch swipe & tap gesture detection
- Mouse controls & UI event isolation
- Keyboard key bindings (`A/D`, arrows, `Space/H`, `P/Esc`)
- Responsive resizing across 6 aspect ratios (9:16, 9:21, 3:4, 1:1, 16:9, 21:9)
- Mobile performance & object pooling
- Platform adapter behavior across Standalone, YouTube, CrazyGames, and Poki

---

## 📦 Building Platform Releases

Build all 4 isolated platform builds:
```bash
npm run build
```
This generates dedicated bundles in `/builds/`:
- `builds/standalone/`: Standalone offline package.
- `builds/youtube/`: Official YouTube Playables build (`YTGame.firstFrameReady()`, `gameReady()`, cloud save, audio hooks, responsive orientation-free layout).
- `builds/crazygames/`: CrazyGames SDK v3 build (`gameplayStart()`, `gameplayStop()`, midgame/rewarded ad hooks).
- `builds/poki/`: Poki SDK v2 build (`gameLoadingFinished()`, `gameplayStart()`, `commercialBreak()`, 16:9 responsive canvas).

---

## 🏆 Platform Submission Checklists

### 1. YouTube Playables Checklist
- [x] Correct SDK loading order (`https://www.youtube.com/game_api/v1`).
- [x] Calls `YTGame.firstFrameReady()` immediately on initial render.
- [x] Calls `YTGame.gameReady()` once interactive.
- [x] Subscribes to `YTGame.onPause` and `YTGame.onResume` lifecycle callbacks.
- [x] Implements cloud persistence via `YTGame.saveData` and `loadData`.
- [x] Submits final score via `YTGame.sendScore`.
- [x] Respects platform audio settings via `YTGame.onAudioChange`.
- [x] No orientation locking (responsive 9:16 to 16:9).
- [x] Zero external prohibited links or external social sharing prompts.
- [x] Preserves game state on resize without page reload.

### 2. CrazyGames Checklist
- [x] Includes CrazyGames SDK v3 script.
- [x] Initializes SDK via `window.CrazyGames.SDK.init()`.
- [x] Calls `gameplayStart()` when player starts driving.
- [x] Calls `gameplayStop()` upon crash / pause / game over.
- [x] Ad break triggers hooked to `requestAd('midgame')` and `requestAd('rewarded')`.
- [x] Safe fallback for local/standalone development.

### 3. Poki Checklist
- [x] Includes Poki SDK v2 script.
- [x] Initializes SDK with AdBlock safety.
- [x] Calls `PokiSDK.gameLoadingFinished()` when game is ready.
- [x] Calls `PokiSDK.gameplayStart()` and `PokiSDK.gameplayStop()`.
- [x] Commercial break callbacks hooked to `PokiSDK.commercialBreak`.
- [x] 16:9 responsive canvas support with mobile and tablet compatibility.
- [x] All game assets, Phaser engine, and fonts bundled 100% locally with zero external CDN dependencies.
- [x] Safe `try/catch` storage handling verified in incognito mode.

