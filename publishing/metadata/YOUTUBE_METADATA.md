# YOUTUBE PLAYABLES STORE METADATA & SUBMISSION PACK
## RICKSHAW RUSH: LAST STOP LEGEND

**Platform:** YouTube Playables (Google Play Games / YouTube Gaming)  
**API Specification:** YouTube Playables API v1  
**Category / Genre:** Arcade / Action / Casual Driving  
**Target Viewport:** Multi-Device Responsive (Mobile App 9:16 Portrait + Desktop Web 16:9 Landscape)  

---

### 1. GENERAL STORE METADATA

- **Game Title:** Rickshaw Rush: Last Stop Legend
- **Short Tagline:** Pick Up. Dodge. Deliver. Repeat.
- **Description:**  
  Take the wheel of an iconic Kerala auto-rickshaw! Dodge crazy traffic across God's Own Country, pick up waiting passengers, complete urgent delivery runs, and collect arcade coins. Journey through five stunning locations from tranquil green villages to the Alappuzha backwaters, Arabian sea coast, misty Munnar tea hills, and neon-lit Kochi night streets. Toggle between sunny Normal Drive and atmospheric Kerala Monsoon Mode with rain, puddles, and thunder!
- **Primary Genre:** Arcade
- **Secondary Genre:** Simulation / Runner
- **Supported Languages:**  
  - English (US / UK) — Full text & interface
  - Malayalam (മലയാളം) — Bilingual location announcements and cultural terms
- **Developer / Publisher:** Independent Game Studio (Self-Published HTML5 Division)
- **Content Security Policy (CSP):** 100% compliant with YouTube Playables strict sandbox:
  - `default-src 'self'`
  - Zero external CDN scripts, stylesheets, audio, or fonts.
  - Package size is only **415.1 KB** (far below YouTube's 5.0 MB initial download limit).

---

### 2. ACCESSIBILITY AUDIT & CLAIMS

Only verified accessibility features are claimed:
- **Audio Control:** Full one-tap mute toggle on all screens, responding instantly to YouTube system audio state (`onAudioEnabledChange`).
- **Input Flexibility:** Fully playable with one hand via touch taps, touch swipes, mouse clicks, or keyboard arrow / WASD keys.
- **Visual Contrast:** High-contrast text labels (bright yellow `#FFD54F` and white `#FFFFFF` against dark asphalt `#1A252F` and deep green `#1B5E20`).
- **Fair Pace:** Gradual linear difficulty scaling with safe clearance zones around all passenger pickup bays.

---

### 3. IARC (INTERNATIONAL AGE RATING COALITION) PRE-SUBMISSION FORM

- **Violence:** None. Vehicle collisions trigger a comical spin-out and tire smoke puff without gore, injuries, or destruction.
- **Fear / Horror:** None. Friendly cartoon arcade presentation.
- **Sexuality / Nudity:** None.
- **Gambling / Real Money:** None. In-game rewards are strictly arcade coins used exclusively for unlocking vehicle skins in the local Garage.
- **User Interaction / Chat:** None. Single-player local arcade game with no open chat or user-generated content.
- **Location Data / Tracking:** None. No personal data collected or transmitted.
- **Recommended Age Rating:** **PEGI 3 / ESRB Everyone (E) / USK 0 / IARC General.**

---

### 4. YOUTUBE PLAYABLES ASSETS

| Thumbnail Type | Aspect Ratio | Dimensions | File Path |
|---|---|---|---|
| **Square App Icon** | 1:1 | 512×512 | `publishing/platform_assets/youtube/icon_square_512x512.png` |
| **Landscape Banner** | 16:9 | 1920×1080 | `publishing/platform_assets/youtube/banner_1920x1080.png` |
| **Video Preview** | 16:9 | 1280×720 (WebM) | `publishing/trailers/rickshaw_rush_trailer_720p.webm` |
| **Playables Package** | Standalone ZIP | — | `dist/rickshaw-rush-youtube.zip` (415.1 KB) |

