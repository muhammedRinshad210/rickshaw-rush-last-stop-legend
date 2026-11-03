/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Phase 5: Complete Publishing Materials Renderer & Screenshot Suite
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 8089;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

// 1. Static HTTP Server
const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';

  // Handle dynamic SVG wrapper page for precise aspect rendering
  if (reqUrl.startsWith('/render_svg/')) {
    const svgRel = reqUrl.replace('/render_svg/', '');
    const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; overflow: hidden; }
    html, body { width: 100%; height: 100%; background: transparent; }
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
  </style>
</head>
<body>
  <img src="/${svgRel}" />
</body>
</html>`;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(html);
  }

  const filePath = path.join(ROOT_DIR, reqUrl);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Destination directories
const pubDir = path.join(ROOT_DIR, 'publishing');
const brandingDir = path.join(pubDir, 'branding');
const coversDir = path.join(pubDir, 'covers');
const screenshotsDir = path.join(pubDir, 'screenshots');
const platformDir = path.join(pubDir, 'platform_assets');

[pubDir, brandingDir, coversDir, screenshotsDir, platformDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Task List: SVG Renders + Gameplay Captures
const TASKS = [
  // --- PART 1 & 2: BRANDING & COVERS ---
  {
    type: 'svg',
    url: '/render_svg/publishing/branding/logo_main.svg',
    outFile: path.join(brandingDir, 'logo_main.png'),
    width: 1920, height: 600, waitMs: 1500
  },
  {
    type: 'svg',
    url: '/render_svg/publishing/branding/logo_badge.svg',
    outFile: path.join(brandingDir, 'logo_badge.png'),
    width: 800, height: 800, waitMs: 1500
  },
  {
    type: 'svg',
    url: '/render_svg/publishing/covers/icon_512x512.svg',
    outFile: path.join(coversDir, 'icon_512x512.png'),
    width: 512, height: 512, waitMs: 1500
  },
  {
    type: 'svg',
    url: '/render_svg/publishing/covers/icon_512x512.svg',
    outFile: path.join(coversDir, 'icon_180x180.png'),
    width: 180, height: 180, waitMs: 1500
  },
  {
    type: 'svg',
    url: '/render_svg/publishing/covers/cover_landscape_1920x1080.svg',
    outFile: path.join(coversDir, 'cover_landscape_1920x1080.png'),
    width: 1920, height: 1080, waitMs: 1500
  },
  {
    type: 'svg',
    url: '/render_svg/publishing/covers/cover_landscape_1920x1080.svg',
    outFile: path.join(coversDir, 'cover_crazygames_800x450.png'),
    width: 800, height: 450, waitMs: 1500
  },
  {
    type: 'svg',
    url: '/render_svg/publishing/covers/cover_landscape_1920x1080.svg',
    outFile: path.join(coversDir, 'cover_crazygames_1200x630.png'),
    width: 1200, height: 630, waitMs: 1500
  },
  {
    type: 'svg',
    url: '/render_svg/publishing/covers/cover_landscape_1920x1080.svg',
    outFile: path.join(coversDir, 'cover_poki_1920x1080.png'),
    width: 1920, height: 1080, waitMs: 1500
  },
  {
    type: 'svg',
    url: '/render_svg/publishing/covers/cover_landscape_1920x1080.svg',
    outFile: path.join(coversDir, 'cover_standalone_630x500.png'),
    width: 630, height: 500, waitMs: 1500
  },
  {
    type: 'svg',
    url: '/render_svg/publishing/covers/cover_landscape_1920x1080.svg',
    outFile: path.join(coversDir, 'banner_youtube_playables.png'),
    width: 1920, height: 1080, waitMs: 1500
  },

  // --- PART 3: ACTUAL GAMEPLAY SCREENSHOTS ---
  {
    type: 'game',
    url: '/index.html?scene=game&env=village',
    outFile: path.join(screenshotsDir, '01_village_gameplay.png'),
    width: 720, height: 1280, waitMs: 3500
  },
  {
    type: 'game',
    url: '/index.html?scene=game&env=backwaters',
    outFile: path.join(screenshotsDir, '02_backwaters_gameplay.png'),
    width: 720, height: 1280, waitMs: 3500
  },
  {
    type: 'game',
    url: '/index.html?scene=game&env=coastal',
    outFile: path.join(screenshotsDir, '03_beach_gameplay.png'),
    width: 720, height: 1280, waitMs: 3500
  },
  {
    type: 'game',
    url: '/index.html?scene=game&env=hills',
    outFile: path.join(screenshotsDir, '04_munnar_gameplay.png'),
    width: 720, height: 1280, waitMs: 3500
  },
  {
    type: 'game',
    url: '/index.html?scene=game&env=town_night',
    outFile: path.join(screenshotsDir, '05_kochi_night_gameplay.png'),
    width: 720, height: 1280, waitMs: 3500
  },
  {
    type: 'game',
    url: '/index.html?scene=game&env=village&mode=monsoon',
    outFile: path.join(screenshotsDir, '06_kerala_monsoon_gameplay.png'),
    width: 720, height: 1280, waitMs: 3500
  },
  {
    type: 'game',
    url: '/index.html?scene=game&env=village&action=pickup',
    outFile: path.join(screenshotsDir, '07_passenger_pickup.png'),
    width: 720, height: 1280, waitMs: 3500
  },
  {
    type: 'game',
    url: '/index.html?scene=game&env=backwaters&action=dropoff',
    outFile: path.join(screenshotsDir, '08_passenger_delivery.png'),
    width: 720, height: 1280, waitMs: 3500
  },
  {
    type: 'game',
    url: '/index.html?scene=garage',
    outFile: path.join(screenshotsDir, '09_rickshaw_garage.png'),
    width: 720, height: 1280, waitMs: 3500
  }
];

function runCapture(task) {
  return new Promise((resolve) => {
    if (fs.existsSync(task.outFile)) {
      try { fs.unlinkSync(task.outFile); } catch (e) {}
    }

    const profileDir = path.join(ROOT_DIR, '.chrome-temp-' + Math.random().toString(36).substring(2));
    const args = [
      '--headless=new',
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      `--window-size=${task.width},${task.height}`,
      `--virtual-time-budget=${task.waitMs}`,
      `--screenshot=${task.outFile}`,
      `http://127.0.0.1:${PORT}${task.url}`
    ];

    console.log(`📸 Rendering [${path.basename(task.outFile)}] (${task.width}x${task.height})...`);
    const proc = spawn(CHROME_PATH, args);

    proc.on('close', () => {
      try {
        if (fs.existsSync(profileDir)) {
          fs.rmSync(profileDir, { recursive: true, force: true });
        }
      } catch (e) {}

      if (fs.existsSync(task.outFile) && fs.statSync(task.outFile).size > 1000) {
        console.log(`  ✓ Saved: ${path.basename(task.outFile)} (${fs.statSync(task.outFile).size} bytes)`);
        resolve(true);
      } else {
        console.warn(`  ✗ Failed: ${path.basename(task.outFile)}`);
        resolve(false);
      }
    });

    proc.on('error', (err) => {
      console.error(`  ✗ Error:`, err.message);
      resolve(false);
    });
  });
}

async function copyPlatformPacks() {
  console.log('\n📦 Packaging platform-specific folders...');

  // 1. Poki Platform Pack
  const pokiDir = path.join(platformDir, 'poki');
  if (!fs.existsSync(pokiDir)) fs.mkdirSync(pokiDir, { recursive: true });

  fs.copyFileSync(path.join(coversDir, 'icon_512x512.png'), path.join(pokiDir, 'icon_512x512.png'));
  fs.copyFileSync(path.join(coversDir, 'cover_poki_1920x1080.png'), path.join(pokiDir, 'cover_1920x1080.png'));
  // 3 distinct actual gameplay screenshots for Poki
  fs.copyFileSync(path.join(screenshotsDir, '01_village_gameplay.png'), path.join(pokiDir, 'poki_01_village_dodge.png'));
  fs.copyFileSync(path.join(screenshotsDir, '02_backwaters_gameplay.png'), path.join(pokiDir, 'poki_02_backwaters_cruise.png'));
  fs.copyFileSync(path.join(screenshotsDir, '06_kerala_monsoon_gameplay.png'), path.join(pokiDir, 'poki_03_monsoon_rush.png'));
  console.log('  ✓ Poki assets prepared in publishing/platform_assets/poki/');

  // 2. CrazyGames Platform Pack
  const cgDir = path.join(platformDir, 'crazygames');
  if (!fs.existsSync(cgDir)) fs.mkdirSync(cgDir, { recursive: true });

  fs.copyFileSync(path.join(coversDir, 'icon_512x512.png'), path.join(cgDir, 'icon_512x512.png'));
  fs.copyFileSync(path.join(coversDir, 'cover_crazygames_800x450.png'), path.join(cgDir, 'cover_800x450.png'));
  fs.copyFileSync(path.join(coversDir, 'cover_crazygames_1200x630.png'), path.join(cgDir, 'banner_1200x630.png'));
  console.log('  ✓ CrazyGames assets prepared in publishing/platform_assets/crazygames/');

  // 3. YouTube Playables Platform Pack
  const ytDir = path.join(platformDir, 'youtube');
  if (!fs.existsSync(ytDir)) fs.mkdirSync(ytDir, { recursive: true });

  fs.copyFileSync(path.join(coversDir, 'icon_512x512.png'), path.join(ytDir, 'icon_square_512x512.png'));
  fs.copyFileSync(path.join(coversDir, 'banner_youtube_playables.png'), path.join(ytDir, 'banner_1920x1080.png'));
  console.log('  ✓ YouTube Playables assets prepared in publishing/platform_assets/youtube/');

  // 4. Standalone Web Platform Pack
  const standDir = path.join(platformDir, 'standalone');
  if (!fs.existsSync(standDir)) fs.mkdirSync(standDir, { recursive: true });

  fs.copyFileSync(path.join(coversDir, 'icon_512x512.png'), path.join(standDir, 'icon_512x512.png'));
  fs.copyFileSync(path.join(coversDir, 'cover_standalone_630x500.png'), path.join(standDir, 'cover_630x500.png'));
  console.log('  ✓ Standalone assets prepared in publishing/platform_assets/standalone/');
}

async function main() {
  server.listen(PORT, '127.0.0.1', async () => {
    console.log(`\n🚀 Starting Publishing Materials Suite on http://127.0.0.1:${PORT}...`);

    for (const task of TASKS) {
      await runCapture(task);
    }

    await copyPlatformPacks();

    server.close();
    console.log('\n🎉 ALL PUBLISHING MATERIALS GENERATED & PACKAGED SUCCESSFULLY!');
  });
}

main();

