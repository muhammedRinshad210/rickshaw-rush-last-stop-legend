/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Game Configuration and Constants
 */

export const CONFIG = {
  TITLE: 'RICKSHAW RUSH: LAST STOP LEGEND',
  TAGLINE: 'PICK UP. DODGE. DELIVER. REPEAT.',
  VERSION: '1.0.0',

  // Virtual Game Canvas Dimensions (Responsive base)
  BASE_WIDTH: 720,
  BASE_HEIGHT: 1280,
  MIN_WIDTH: 600,
  MAX_WIDTH: 1200,

  // Road & Lane Layout
  ROAD: {
    WIDTH: 520,             // Width of asphalt driving area
    LANES_COUNT: 3,
    LANE_WIDTH: 156,        // ~520 / 3 - margin
    KERB_WIDTH: 20,
    SHOULDER_WIDTH: 100,    // Grass/sand/curb shoulder on either side
    SCROLL_SPEED_BASE: 420, // Pixels per second at difficulty 1
    SCROLL_SPEED_MAX: 850,
    LANE_TWEEN_DURATION: 120, // Exactly 120ms smooth lane switch
  },

  // Auto-Rickshaw Skins (5 Distinct Kerala-themed designs)
  SKINS: [
    {
      id: 'classic_yellow',
      name: 'Kerala Classic',
      description: 'The quintessential green & yellow king of Kerala roads.',
      price: 0, // Default unlocked
      roofColor: 0xF5B002,     // Golden Yellow
      bodyColor: 0x1B5E20,     // Deep Green
      trimColor: 0xFFD54F,     // Soft Yellow
      stripeColor: 0xFFFFFF,   // White racing stripe
      accentColor: 0xD32F2F,   // Red reflector
      unlocked: true,
    },
    {
      id: 'malabar_fire',
      name: 'Malabar Fire',
      description: 'Blazing crimson speed machine with golden flame decals.',
      price: 250,
      roofColor: 0xD32F2F,     // Crimson Red
      bodyColor: 0x212121,     // Pitch Black
      trimColor: 0xFFA000,     // Flame Amber
      stripeColor: 0xFFEB3B,   // Bright Gold
      accentColor: 0xFF5722,   // Orange Flame
      unlocked: false,
    },
    {
      id: 'kochi_teal',
      name: 'Kochi Coastal',
      description: 'Cool oceanic teal inspired by Arabian Sea breezes.',
      price: 500,
      roofColor: 0x00ACC1,     // Cyan/Teal
      bodyColor: 0x004D40,     // Deep Sea Green
      trimColor: 0x80DEEA,     // Wave Blue
      stripeColor: 0xE0F7FA,   // Sea Foam White
      accentColor: 0x00E5FF,   // Neon Cyan
      unlocked: false,
    },
    {
      id: 'royal_purp',
      name: 'Royal Kozhikode',
      description: 'Regal royal purple adorned with heritage gold ornaments.',
      price: 800,
      roofColor: 0x6A1B9A,     // Royal Purple
      bodyColor: 0x311B92,     // Deep Indigo
      trimColor: 0xFFD700,     // Gold Trim
      stripeColor: 0xFFE082,   // Light Gold
      accentColor: 0xBA68C8,   // Lilac Accent
      unlocked: false,
    },
    {
      id: 'midnight_neon',
      name: 'Midnight Express',
      description: 'Stealth matte carbon black with high-voltage neon yellow.',
      price: 1200,
      roofColor: 0x1A1A1A,     // Matte Charcoal
      bodyColor: 0x0A0A0A,     // Obsidian Black
      trimColor: 0xEEFF41,     // Electric Neon Lime
      stripeColor: 0xC6FF00,   // High-vis Yellow
      accentColor: 0x00E676,   // Emerald Neon
      unlocked: false,
    }
  ],

  // Passenger Mission Destinations
  DESTINATIONS: [
    {
      id: 'tea_shop',
      name: 'Kayi’s Tea Shop',
      malayalamName: 'ചായക്കട',
      themeColor: 0xE65100, // Warm Chai Orange
      fareBonus: 100,
      iconKey: 'icon_tea',
      distanceMin: 1200,
      distanceMax: 2000,
    },
    {
      id: 'market',
      name: 'Chalakkudy Market',
      malayalamName: 'ചന്ത',
      themeColor: 0x2E7D32, // Fresh Vegetable Green
      fareBonus: 140,
      iconKey: 'icon_market',
      distanceMin: 1400,
      distanceMax: 2400,
    },
    {
      id: 'beach',
      name: 'Cherai Beach',
      malayalamName: 'തീരം',
      themeColor: 0x0277BD, // Ocean Blue
      fareBonus: 160,
      iconKey: 'icon_beach',
      distanceMin: 1600,
      distanceMax: 2600,
    },
    {
      id: 'railway',
      name: 'Central Railway',
      malayalamName: 'റെയിൽവേ',
      themeColor: 0xC62828, // Engine Red
      fareBonus: 200,
      iconKey: 'icon_railway',
      distanceMin: 1800,
      distanceMax: 2800,
    },
    {
      id: 'town_center',
      name: 'Town Clock Tower',
      malayalamName: 'ടൗൺ',
      themeColor: 0x7B1FA2, // Regal Town Purple
      fareBonus: 220,
      iconKey: 'icon_town',
      distanceMin: 2000,
      distanceMax: 3000,
    }
  ],

  // Horn Mechanic
  HORN: {
    COOLDOWN_MS: 1200,
    RANGE_Y: 480,          // Detection distance forward
    CONE_X: 180,           // Lateral sound cone width
    COW_SCARE_SPEED: 220,  // Speed at which scared cow moves to roadside
  },

  // Power-Ups
  POWERUPS: {
    SHIELD: {
      id: 'chaya_shield',
      name: 'Chaya Shield',
      durationMs: 3000,     // 3 seconds
      color: 0xFFA000,
      spawnWeight: 2,
    },
    MAGNET: {
      id: 'coin_magnet',
      name: 'Coin Magnet',
      durationMs: 6500,     // 6.5 seconds
      radius: 320,
      pullSpeed: 600,
      color: 0xE91E63,
      spawnWeight: 2,
    },
    BOOST: {
      id: 'speed_boost',
      name: 'Speed Boost',
      durationMs: 3500,     // 3.5 seconds
      speedMultiplier: 1.45,
      scoreMultiplier: 2.0,
      color: 0x00E676,
      spawnWeight: 1.5,
    }
  },

  // Skill System: Near Miss
  NEAR_MISS: {
    DISTANCE_THRESHOLD: 44, // Hitbox margin for near miss
    BASE_POINTS: 50,
    COMBO_TIMEOUT_MS: 3000,
    MAX_COMBO: 5,
  },

  // Obstacle Specifications
  OBSTACLES: {
    BUS: {
      type: 'bus',
      name: 'KSRTC Fast Passenger',
      width: 90,
      height: 200,
      speedFactor: 0.62, // Relative to road
      hitboxPaddingX: 8,
      hitboxPaddingY: 10,
    },
    LORRY: {
      type: 'lorry',
      name: 'Malabar Goods Lorry',
      width: 94,
      height: 220,
      speedFactor: 0.50,
      hitboxPaddingX: 8,
      hitboxPaddingY: 12,
    },
    COW: {
      type: 'cow',
      name: 'Kerala Street Cow',
      width: 72,
      height: 96,
      speedFactor: 0.15, // Almost stationary
      hitboxPaddingX: 10,
      hitboxPaddingY: 10,
      canScareWithHorn: true,
    },
    POTHOLE: {
      type: 'pothole',
      name: 'Monsoon Pothole',
      width: 80,
      height: 60,
      speedFactor: 0.0, // Fixed to road
      hitboxPaddingX: 12,
      hitboxPaddingY: 10,
    },
    BARRIER: {
      type: 'barrier',
      name: 'Kerala Police Barricade',
      width: 100,
      height: 48,
      speedFactor: 0.0,
      hitboxPaddingX: 6,
      hitboxPaddingY: 8,
    }
  },

  // Spawning & Safety Rules
  SPAWNER: {
    MIN_GAP_Y: 280,        // Never spawn obstacles closer than this vertically
    MAX_LANES_BLOCKED: 2,  // NEVER block 3 lanes simultaneously!
    WAVE_COOLDOWN_MIN: 1100,
    WAVE_COOLDOWN_MAX: 1800,
    COIN_LINE_PROBABILITY: 0.35,
    POWERUP_PROBABILITY: 0.12,
    PASSENGER_SPAWN_INTERVAL_MS: 14000, // Regular passenger pickup opportunities
  },

  // World Environments (5 Distinct Kerala Road-Trip Biomes)
  ENVIRONMENTS: [
    {
      id: 'village',
      name: 'Kerala Village',
      malayalamName: 'കേരള ഗ്രാമം',
      announcement: 'KERALA VILLAGE',
      subtitle: 'PADDY FIELDS & BANANA GROVES',
      duration: 45000,
      asphaltColor: 0x37474F,
      shoulderColor: 0x2E7D32, // Lush Paddy Green
      curbColorA: 0xD32F2F,    // Red
      curbColorB: 0xFAFAFA,    // White
      sceneryType: 'village',
      weather: 'sunny',
      lightTint: 0xFFFFFF,
      lightAlpha: 0.0,
      bridgeSection: false,
    },
    {
      id: 'backwaters',
      name: 'Alappuzha Backwaters',
      malayalamName: 'ആലപ്പുഴ കായൽ',
      announcement: 'ALAPPUZHA BACKWATERS',
      subtitle: 'HOUSEBOATS & PALM CANALS',
      duration: 45000,
      asphaltColor: 0x37474F,
      shoulderColor: 0x0277BD, // Wide Waterway Blue
      curbColorA: 0xFFD54F,    // Bridge Yellow
      curbColorB: 0xE0E0E0,    // Concrete White
      sceneryType: 'backwaters',
      weather: 'bright_water',
      lightTint: 0xE1F5FE,
      lightAlpha: 0.06,
      bridgeSection: true,
    },
    {
      id: 'coastal',
      name: 'Cherai Beach Road',
      malayalamName: 'തീരദേശ പാത',
      announcement: 'CHERAI BEACH ROAD',
      subtitle: 'ARABIAN SEA & LIGHTHOUSE',
      duration: 45000,
      asphaltColor: 0x455A64,
      shoulderColor: 0xC2B280, // Golden Beach Sand
      curbColorA: 0x00ACC1,    // Ocean Teal
      curbColorB: 0xFFFFFF,    // Foam White
      sceneryType: 'coastal',
      weather: 'sunset',
      lightTint: 0xFF9800,     // Golden Sunset Amber
      lightAlpha: 0.16,
      bridgeSection: false,
    },
    {
      id: 'hills',
      name: 'Munnar Tea Hills',
      malayalamName: 'മൂന്നാർ മലനിരകൾ',
      announcement: 'MUNNAR TEA HILLS',
      subtitle: 'MISTY PEAKS & WATERFALLS',
      duration: 45000,
      asphaltColor: 0x263238,
      shoulderColor: 0x1B5E20, // Tea Plantation Emerald
      curbColorA: 0x78909C,    // Mountain Granite
      curbColorB: 0xECEFF1,    // White
      sceneryType: 'hills',
      weather: 'mist',
      lightTint: 0xCFD8DC,     // Cool Mountain Mist
      lightAlpha: 0.14,
      bridgeSection: false,
    },
    {
      id: 'town_night',
      name: 'Kochi Town at Night',
      malayalamName: 'കൊച്ചി നഗരം',
      announcement: 'KOCHI TOWN AT NIGHT',
      subtitle: 'NEON LIGHTS & NIGHT BAZAAR',
      duration: 45000,
      asphaltColor: 0x1C252C,
      shoulderColor: 0x263238, // Paved Sidewalks
      curbColorA: 0xFFB300,    // High-Vis Amber
      curbColorB: 0x212121,    // Night Charcoal
      sceneryType: 'town_night',
      weather: 'night',
      lightTint: 0x0A1026,     // Midnight Deep Indigo
      lightAlpha: 0.45,
      bridgeSection: false,
    }
  ],

  // Weather Configuration (4 States for Monsoon Mode)
  WEATHER: {
    TRANSITION_DURATION_MS: 3500, // 3.5s smooth weather crossfade
    MAX_RAIN_PARTICLES: 60,
    STATES: {
      CLEAR_SKY: {
        id: 'clear_sky',
        name: 'Clear Sky',
        intensity: 0.0,
        darknessAlpha: 0.0,
        tint: 0xFFFFFF,
        rainActive: false,
        thunderActive: false,
        rainbowActive: false,
        durationRange: [16000, 24000],
      },
      LIGHT_RAIN: {
        id: 'light_rain',
        name: 'Light Rain',
        intensity: 0.4,
        darknessAlpha: 0.14,
        tint: 0xCFD8DC,
        rainActive: true,
        thunderActive: false,
        rainbowActive: false,
        durationRange: [18000, 26000],
      },
      HEAVY_MONSOON: {
        id: 'heavy_monsoon',
        name: 'Heavy Monsoon',
        intensity: 1.0,
        darknessAlpha: 0.28,
        tint: 0x90A4AE,
        rainActive: true,
        thunderActive: true,
        rainbowActive: false,
        durationRange: [20000, 30000],
      },
      AFTER_RAIN: {
        id: 'after_rain',
        name: 'After Rain',
        intensity: 0.15,
        darknessAlpha: 0.06,
        tint: 0xFFF9C4, // Warm clearing light
        rainActive: false,
        thunderActive: false,
        rainbowActive: true,
        durationRange: [14000, 20000],
      }
    }
  },

  // Game Drive Modes
  DRIVE_MODES: {
    NORMAL: 'normal',
    MONSOON: 'monsoon'
  },

  // Scoring & Economy
  SCORING: {
    DISTANCE_PER_PIXEL: 0.05,
    COIN_VALUE: 10,
    PASSENGER_DELIVERY_BASE: 250,
    SPEED_MULTIPLIER: 1.0,
  },

  // Storage Keys
  STORAGE_KEYS: {
    HIGH_SCORE: 'rr_laststop_high_score',
    TOTAL_COINS: 'rr_laststop_coins',
    SELECTED_SKIN: 'rr_laststop_skin',
    UNLOCKED_SKINS: 'rr_laststop_unlocked_skins',
    AUDIO_MUTED: 'rr_laststop_audio_muted',
    SFX_VOLUME: 'rr_laststop_sfx_vol',
    STATS: 'rr_laststop_stats',
    CHALLENGES: 'rr_laststop_challenges',
    DRIVE_MODE: 'rr_laststop_drive_mode',
  }
};

