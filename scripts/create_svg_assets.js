/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Phase 5: High-Resolution SVG Vector Assets Generator
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. MAIN GAME LOGO SVG (1920x600)
function generateMainLogoSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 600" width="1920" height="600">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF176" />
      <stop offset="45%" stop-color="#FFD54F" />
      <stop offset="70%" stop-color="#FFA000" />
      <stop offset="100%" stop-color="#FF6F00" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#A5D6A7" />
      <stop offset="50%" stop-color="#2E7D32" />
      <stop offset="100%" stop-color="#1B5E20" />
    </linearGradient>
    <linearGradient id="creamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FFF9C4" />
    </linearGradient>
    <filter id="shadow3D" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="4" flood-color="#000000" flood-opacity="0.8" />
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Decorative Tropical Palm Silhouette in Background -->
  <g opacity="0.25">
    <path d="M 120 480 C 180 320, 240 220, 380 180 C 320 220, 290 280, 260 480 Z" fill="#2E7D32" />
    <path d="M 1780 480 C 1720 320, 1660 220, 1520 180 C 1580 220, 1610 280, 1640 480 Z" fill="#2E7D32" />
  </g>

  <!-- Auto Rickshaw Mini Emblem Center-Top -->
  <g transform="translate(960, 110) scale(0.9)">
    <!-- Yellow Canopy Roof -->
    <path d="M -50 -25 C -40 -40, 40 -40, 50 -25 L 45 5 L -45 5 Z" fill="#FFA000" stroke="#FF6F00" stroke-width="3" />
    <!-- Windshield -->
    <rect x="-38" y="-18" width="76" height="20" rx="3" fill="#E1F5FE" stroke="#0288D1" stroke-width="2" />
    <!-- Green Body -->
    <path d="M -44 5 L 44 5 L 40 28 L -40 28 Z" fill="#2E7D32" stroke="#1B5E20" stroke-width="3" />
    <!-- Chrome Headlight -->
    <circle cx="0" cy="18" r="9" fill="#FFFDE7" stroke="#FFA000" stroke-width="2.5" />
    <circle cx="0" cy="18" r="4" fill="#FFFFFF" />
  </g>

  <!-- RICKSHAW 3D Text Extrusion -->
  <g filter="url(#shadow3D)">
    <!-- Dark Extrusion Depth -->
    <text x="960" y="278" font-family="'Impact', 'Arial Black', sans-serif" font-size="146" font-weight="900" text-anchor="middle" letter-spacing="12" fill="#B71C1C">RICKSHAW</text>
    <text x="960" y="274" font-family="'Impact', 'Arial Black', sans-serif" font-size="146" font-weight="900" text-anchor="middle" letter-spacing="12" fill="#C62828">RICKSHAW</text>
    <text x="960" y="270" font-family="'Impact', 'Arial Black', sans-serif" font-size="146" font-weight="900" text-anchor="middle" letter-spacing="12" fill="#D32F2F">RICKSHAW</text>
    <!-- Foreground Text with Gold Gradient and Dark Outline -->
    <text x="960" y="264" font-family="'Impact', 'Arial Black', sans-serif" font-size="146" font-weight="900" text-anchor="middle" letter-spacing="12" fill="url(#goldGrad)" stroke="#3E2723" stroke-width="6" stroke-linejoin="round">RICKSHAW</text>
  </g>

  <!-- RUSH 3D Text Extrusion (Emerald Gradient) -->
  <g filter="url(#shadow3D)">
    <text x="960" y="414" font-family="'Impact', 'Arial Black', sans-serif" font-size="140" font-weight="900" text-anchor="middle" letter-spacing="16" fill="#0B3C11">RUSH</text>
    <text x="960" y="410" font-family="'Impact', 'Arial Black', sans-serif" font-size="140" font-weight="900" text-anchor="middle" letter-spacing="16" fill="#145A1E">RUSH</text>
    <text x="960" y="404" font-family="'Impact', 'Arial Black', sans-serif" font-size="140" font-weight="900" text-anchor="middle" letter-spacing="16" fill="url(#emeraldGrad)" stroke="#052208" stroke-width="6" stroke-linejoin="round">RUSH</text>
  </g>

  <!-- Decorative Subtitle Banner: LAST STOP LEGEND -->
  <g transform="translate(960, 470)">
    <!-- Ribbon Background -->
    <path d="M -320 -20 L 320 -20 L 300 20 L -300 20 Z" fill="#D32F2F" stroke="#FFD54F" stroke-width="3" />
    <text x="0" y="8" font-family="'Arial Black', sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="6" fill="#FFFFFF">LAST STOP LEGEND</text>
  </g>

  <!-- Tagline -->
  <text x="960" y="540" font-family="sans-serif" font-size="22" font-weight="800" text-anchor="middle" letter-spacing="5" fill="#FFE082">PICK UP. DODGE. DELIVER. REPEAT.</text>
</svg>`;
}

// 2. SQUARE GAME ICON SVG (512x512)
function generateSquareIconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0288D1" />
      <stop offset="55%" stop-color="#4FC3F7" />
      <stop offset="85%" stop-color="#FFF9C4" />
      <stop offset="100%" stop-color="#FFE082" />
    </linearGradient>
    <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#263238" />
      <stop offset="100%" stop-color="#1A252F" />
    </linearGradient>
    <linearGradient id="yellowRoof" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF176" />
      <stop offset="60%" stop-color="#FFA000" />
      <stop offset="100%" stop-color="#FF6F00" />
    </linearGradient>
    <linearGradient id="greenBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4CAF50" />
      <stop offset="60%" stop-color="#2E7D32" />
      <stop offset="100%" stop-color="#1B5E20" />
    </linearGradient>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF9C4" />
      <stop offset="50%" stop-color="#FFD54F" />
      <stop offset="100%" stop-color="#FFA000" />
    </linearGradient>
    <filter id="iconShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Rounded App Icon Background -->
  <rect width="512" height="512" rx="105" fill="url(#bgSky)" />

  <!-- Tropical Palm Tree Silhouette (Kerala Touch) -->
  <g fill="#2E7D32" opacity="0.9">
    <path d="M 0 0 C 80 40, 140 100, 180 200 C 140 180, 80 140, 0 100 Z" />
    <path d="M 512 0 C 432 40, 372 100, 332 200 C 372 180, 432 140, 512 100 Z" />
  </g>

  <!-- Road & Perspective Lines -->
  <polygon points="120,512 392,512 300,260 212,260" fill="url(#roadGrad)" />
  <line x1="256" y1="280" x2="256" y2="512" stroke="#FFD54F" stroke-width="8" stroke-dasharray="24,18" />
  <!-- Road Curbs (Yellow/Black) -->
  <polygon points="100,512 120,512 212,260 200,260" fill="#E65100" />
  <polygon points="392,512 412,512 312,260 300,260" fill="#E65100" />

  <!-- Dynamic Speed Action Lines -->
  <g stroke="#FFFFFF" stroke-width="3" opacity="0.6">
    <line x1="40" y1="420" x2="110" y2="400" />
    <line x1="472" y1="420" x2="402" y2="400" />
    <line x1="30" y1="360" x2="120" y2="340" />
    <line x1="482" y1="360" x2="392" y2="340" />
  </g>

  <!-- Primary Subject: Hero Auto-Rickshaw (Centered & Powerful) -->
  <g transform="translate(256, 310)" filter="url(#iconShadow)">
    <!-- Shadow under vehicle -->
    <ellipse cx="0" cy="115" rx="130" ry="24" fill="#000000" opacity="0.45" />

    <!-- Wheels (Front & Rear) -->
    <rect x="-124" y="65" width="28" height="52" rx="8" fill="#212121" stroke="#424242" stroke-width="3" />
    <rect x="96" y="65" width="28" height="52" rx="8" fill="#212121" stroke="#424242" stroke-width="3" />
    <rect x="-16" y="80" width="32" height="42" rx="8" fill="#212121" stroke="#424242" stroke-width="3" />

    <!-- Chassis Base & Mudguards -->
    <path d="M -115 80 L 115 80 L 105 50 L -105 50 Z" fill="#212121" />

    <!-- Lower Green Cabin Body -->
    <path d="M -110 52 L 110 52 L 95 -15 L -95 -15 Z" fill="url(#greenBody)" stroke="#1B5E20" stroke-width="4" />

    <!-- Chrome Bumper -->
    <rect x="-105" y="44" width="210" height="12" rx="4" fill="#ECEFF1" stroke="#B0BEC5" stroke-width="2" />

    <!-- Large Iconic Center Headlamp -->
    <circle cx="0" cy="22" r="24" fill="#FFFDE7" stroke="#FFA000" stroke-width="4" />
    <circle cx="0" cy="22" r="14" fill="#FFFFFF" />
    <!-- Indicator Lights -->
    <circle cx="-75" cy="22" r="9" fill="#FF9800" stroke="#E65100" stroke-width="2" />
    <circle cx="75" cy="22" r="9" fill="#FF9800" stroke="#E65100" stroke-width="2" />

    <!-- Windshield Pillar Structure -->
    <polygon points="-86,-15 86,-15 72,-85 -72,-85" fill="#E0F7FA" stroke="#00838F" stroke-width="3" />
    <line x1="0" y1="-85" x2="0" y2="-15" stroke="#00838F" stroke-width="3" />
    <!-- Wiper -->
    <line x1="-30" y1="-20" x2="20" y2="-60" stroke="#212121" stroke-width="4" stroke-linecap="round" />

    <!-- Top Canopy Yellow Roof -->
    <path d="M -102 -82 C -80 -125, 80 -125, 102 -82 L 86 -70 L -86 -70 Z" fill="url(#yellowRoof)" stroke="#E65100" stroke-width="4" />
    <ellipse cx="0" cy="-90" rx="45" ry="8" fill="#FFF59D" opacity="0.5" />

    <!-- Rear-view Mirrors -->
    <rect x="-115" y="-35" width="14" height="24" rx="4" fill="#CFD8DC" stroke="#37474F" stroke-width="2" />
    <rect x="101" y="-35" width="14" height="24" rx="4" fill="#CFD8DC" stroke="#37474F" stroke-width="2" />
  </g>

  <!-- Title Badge on Bottom -->
  <g transform="translate(256, 455)" filter="url(#iconShadow)">
    <rect x="-175" y="-32" width="350" height="64" rx="14" fill="#1B5E20" stroke="#FFD54F" stroke-width="4" />
    <text x="0" y="6" font-family="'Impact', 'Arial Black', sans-serif" font-size="34" font-weight="900" text-anchor="middle" letter-spacing="4" fill="url(#goldText)" stroke="#3E2723" stroke-width="2">RICKSHAW RUSH</text>
  </g>
</svg>`;
}

// 3. LANDSCAPE PROMOTIONAL COVER SVG (1920x1080)
function generateLandscapeCoverSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#01579B" />
      <stop offset="35%" stop-color="#0288D1" />
      <stop offset="65%" stop-color="#4FC3F7" />
      <stop offset="90%" stop-color="#FFE082" />
      <stop offset="100%" stop-color="#FFB300" />
    </linearGradient>
    <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0288D1" />
      <stop offset="100%" stop-color="#00695C" />
    </linearGradient>
    <linearGradient id="hillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#388E3C" />
      <stop offset="100%" stop-color="#1B5E20" />
    </linearGradient>
    <linearGradient id="roadSurf" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#37474F" />
      <stop offset="100%" stop-color="#1C2833" />
    </linearGradient>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF9C4" />
      <stop offset="45%" stop-color="#FFD54F" />
      <stop offset="75%" stop-color="#FFA000" />
      <stop offset="100%" stop-color="#E65100" />
    </linearGradient>
    <filter id="bigShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="14" stdDeviation="6" flood-color="#000000" flood-opacity="0.7" />
    </filter>
  </defs>

  <!-- Sky Background -->
  <rect width="1920" height="1080" fill="url(#skyGrad)" />

  <!-- Distant Munnar Mountains -->
  <path d="M 0 540 Q 240 400, 520 480 T 1100 450 T 1600 490 Q 1780 430, 1920 480 L 1920 720 L 0 720 Z" fill="url(#hillGrad)" opacity="0.65" />
  <path d="M 0 580 Q 360 480, 720 540 T 1440 520 Q 1720 490, 1920 540 L 1920 760 L 0 760 Z" fill="url(#hillGrad)" opacity="0.85" />

  <!-- Backwaters / Arabian Sea Coastline -->
  <rect y="640" width="1920" height="160" fill="url(#seaGrad)" />
  <path d="M 0 680 Q 480 660, 960 680 T 1920 680 L 1920 740 L 0 740 Z" fill="#00897B" opacity="0.6" />

  <!-- Traditional Kerala Houseboat (Kettuvallam) Silhouette -->
  <g transform="translate(320, 650) scale(0.65)" opacity="0.95">
    <path d="M -90 20 C -70 -15, 70 -15, 90 20 Z" fill="#5D4037" />
    <path d="M -60 10 C -50 -10, 50 -10, 60 10 Z" fill="#8D6E63" />
    <!-- Thatched Arch Roof -->
    <path d="M -50 0 C -40 -28, 40 -28, 50 0 Z" fill="#D7CCC8" stroke="#3E2723" stroke-width="2" />
  </g>

  <!-- Foreground Kerala Roadway (Dynamic Angle) -->
  <polygon points="0,1080 1920,1080 1480,680 440,680" fill="url(#roadSurf)" />
  <!-- Road Curbs (Kerala Yellow & Black) -->
  <polygon points="400,680 440,680 0,1080 -60,1080" fill="#FFA000" />
  <polygon points="1480,680 1520,680 1980,1080 1920,1080" fill="#FFA000" />
  <!-- Center Dashed Lanes -->
  <line x1="960" y1="690" x2="960" y2="1080" stroke="#FFD54F" stroke-width="16" stroke-dasharray="55,40" />
  <line x1="720" y1="690" x2="480" y2="1080" stroke="#FFFFFF" stroke-width="8" stroke-dasharray="45,35" opacity="0.8" />
  <line x1="1200" y1="690" x2="1440" y2="1080" stroke="#FFFFFF" stroke-width="8" stroke-dasharray="45,35" opacity="0.8" />

  <!-- Tropical Coconut Palms (Framing Both Sides) -->
  <g fill="#1B5E20">
    <!-- Left Palm -->
    <path d="M -20 750 Q 80 500, 160 300 Q 120 480, 20 750 Z" fill="#4E342E" />
    <path d="M 160 300 Q 280 260, 420 320 Q 300 360, 160 300 Z" />
    <path d="M 160 300 Q 260 180, 360 140 Q 280 240, 160 300 Z" />
    <path d="M 160 300 Q 140 160, 100 80 Q 120 220, 160 300 Z" />
    <path d="M 160 300 Q 60 180, -20 200 Q 80 260, 160 300 Z" />
    <!-- Right Palm -->
    <path d="M 1940 750 Q 1840 500, 1760 300 Q 1800 480, 1900 750 Z" fill="#4E342E" />
    <path d="M 1760 300 Q 1640 260, 1500 320 Q 1620 360, 1760 300 Z" />
    <path d="M 1760 300 Q 1660 180, 1560 140 Q 1640 240, 1760 300 Z" />
    <path d="M 1760 300 Q 1780 160, 1820 80 Q 1800 220, 1760 300 Z" />
  </g>

  <!-- Speed Motion Effects / Wind Streaks -->
  <g stroke="#FFFFFF" stroke-width="4" opacity="0.45">
    <line x1="280" y1="920" x2="680" y2="880" />
    <line x1="1240" y1="880" x2="1680" y2="920" />
    <line x1="380" y1="800" x2="640" y2="780" />
    <line x1="1280" y1="780" x2="1540" y2="800" />
  </g>

  <!-- MAIN HERO AUTO-RICKSHAW (Dramatic Dynamic Front Pose) -->
  <g transform="translate(960, 840)" filter="url(#bigShadow)">
    <!-- Ground Shadow -->
    <ellipse cx="0" cy="180" rx="220" ry="38" fill="#000000" opacity="0.55" />

    <!-- Big Wheels -->
    <rect x="-210" y="90" width="46" height="84" rx="14" fill="#212121" stroke="#424242" stroke-width="4" />
    <rect x="164" y="90" width="46" height="84" rx="14" fill="#212121" stroke="#424242" stroke-width="4" />
    <rect x="-25" y="115" width="50" height="70" rx="12" fill="#212121" stroke="#424242" stroke-width="4" />

    <!-- Chassis Base -->
    <path d="M -190 115 L 190 115 L 175 65 L -175 65 Z" fill="#212121" />

    <!-- Lower Green Cabin -->
    <path d="M -180 70 L 180 70 L 155 -35 L -155 -35 Z" fill="#2E7D32" stroke="#1B5E20" stroke-width="6" />

    <!-- Chrome Heavy Front Bumper -->
    <rect x="-170" y="58" width="340" height="20" rx="6" fill="#ECEFF1" stroke="#B0BEC5" stroke-width="3" />

    <!-- Mega Headlamp with Glow -->
    <circle cx="0" cy="22" r="38" fill="#FFFDE7" stroke="#FFA000" stroke-width="6" />
    <circle cx="0" cy="22" r="22" fill="#FFFFFF" />
    <!-- Indicators -->
    <circle cx="-120" cy="22" r="14" fill="#FF9800" stroke="#E65100" stroke-width="3" />
    <circle cx="120" cy="22" r="14" fill="#FF9800" stroke="#E65100" stroke-width="3" />

    <!-- Windshield -->
    <polygon points="-140,-35 140,-35 115,-145 -115,-145" fill="#E0F7FA" stroke="#00838F" stroke-width="5" />
    <line x1="0" y1="-145" x2="0" y2="-35" stroke="#00838F" stroke-width="4" />
    <line x1="-50" y1="-45" x2="40" y2="-115" stroke="#212121" stroke-width="6" stroke-linecap="round" />

    <!-- Iconic Yellow Curved Canopy Roof -->
    <path d="M -165 -140 C -125 -205, 125 -205, 165 -140 L 140 -120 L -140 -120 Z" fill="#FFB300" stroke="#E65100" stroke-width="6" />
    <ellipse cx="0" cy="-155" rx="75" ry="14" fill="#FFF59D" opacity="0.6" />

    <!-- Rear-View Mirrors -->
    <rect x="-190" y="-70" width="22" height="38" rx="6" fill="#CFD8DC" stroke="#37474F" stroke-width="3" />
    <rect x="168" y="-70" width="22" height="38" rx="6" fill="#CFD8DC" stroke="#37474F" stroke-width="3" />
  </g>

  <!-- Floating Coins / Power-ups Effect -->
  <g transform="translate(680, 780)" filter="url(#bigShadow)">
    <circle cx="0" cy="0" r="28" fill="#FFD54F" stroke="#FFA000" stroke-width="4" />
    <text x="0" y="8" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#E65100">★</text>
  </g>
  <g transform="translate(1240, 760)" filter="url(#bigShadow)">
    <circle cx="0" cy="0" r="28" fill="#FFD54F" stroke="#FFA000" stroke-width="4" />
    <text x="0" y="8" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#E65100">★</text>
  </g>

  <!-- TOP BRANDING & PROMOTIONAL TITLE CARD -->
  <g transform="translate(960, 180)" filter="url(#bigShadow)">
    <!-- Backdrop Banner Box -->
    <rect x="-620" y="-120" width="1240" height="240" rx="28" fill="#1B5E20" opacity="0.92" stroke="#FFD54F" stroke-width="6" />

    <!-- RICKSHAW RUSH Text -->
    <text x="0" y="-10" font-family="'Impact', 'Arial Black', sans-serif" font-size="112" font-weight="900" text-anchor="middle" letter-spacing="10" fill="url(#goldText)" stroke="#3E2723" stroke-width="6" stroke-linejoin="round">RICKSHAW RUSH</text>

    <!-- LAST STOP LEGEND Ribbon -->
    <g transform="translate(0, 52)">
      <path d="M -260 -18 L 260 -18 L 240 18 L -240 18 Z" fill="#D32F2F" stroke="#FFD54F" stroke-width="2.5" />
      <text x="0" y="7" font-family="'Arial Black', sans-serif" font-size="24" font-weight="900" text-anchor="middle" letter-spacing="6" fill="#FFFFFF">LAST STOP LEGEND</text>
    </g>

    <!-- Tagline -->
    <text x="0" y="98" font-family="sans-serif" font-size="20" font-weight="800" text-anchor="middle" letter-spacing="6" fill="#FFE082">PICK UP. DODGE. DELIVER. REPEAT.</text>
  </g>
</svg>`;
}

// 4. WRITE SVG FILES TO DISK
const brandingDir = path.join(ROOT_DIR, 'publishing', 'branding');
const coversDir = path.join(ROOT_DIR, 'publishing', 'covers');

fs.writeFileSync(path.join(brandingDir, 'logo_main.svg'), generateMainLogoSVG(), 'utf8');
fs.writeFileSync(path.join(brandingDir, 'logo_badge.svg'), generateSquareIconSVG(), 'utf8');
fs.writeFileSync(path.join(coversDir, 'icon_512x512.svg'), generateSquareIconSVG(), 'utf8');
fs.writeFileSync(path.join(coversDir, 'cover_landscape_1920x1080.svg'), generateLandscapeCoverSVG(), 'utf8');

console.log('✅ Generated official SVG vector brand assets:');
console.log('  - publishing/branding/logo_main.svg');
console.log('  - publishing/branding/logo_badge.svg');
console.log('  - publishing/covers/icon_512x512.svg');
console.log('  - publishing/covers/cover_landscape_1920x1080.svg');

