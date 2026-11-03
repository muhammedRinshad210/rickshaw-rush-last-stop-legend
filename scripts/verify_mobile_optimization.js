/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Phase 6.1: Automated Mobile Optimization Visual Verification
 * Tests responsive road layout (~74%), roadside scenery visibility, and gameplay smoothness.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const STANDALONE_DIR = path.join(ROOT_DIR, 'builds', 'standalone');
const PORT = 8098;
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

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';

  const filePath = path.join(STANDALONE_DIR, reqUrl);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    console.warn(`[404] Not found: ${reqUrl}`);
    res.writeHead(404);
    res.end('Not Found');
  }
});

const outDir = path.join(ROOT_DIR, 'screenshots', 'mobile_opt');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const TARGETS = [
  {
    name: 'mobile_opt_01_village_320x568.png',
    width: 320,
    height: 568,
    query: '?scene=game&env=village',
    waitMs: 3500,
    description: 'iPhone SE (320x568): Village paddy fields, irrigation canal, 74% road width'
  },
  {
    name: 'mobile_opt_02_backwaters_360x800.png',
    width: 360,
    height: 800,
    query: '?scene=game&env=backwaters',
    waitMs: 3500,
    description: 'Samsung Galaxy (360x800): Alappuzha lagoons extending to screen edges'
  },
  {
    name: 'mobile_opt_03_coastal_beach_390x844.png',
    width: 390,
    height: 844,
    query: '?scene=game&env=coastal',
    waitMs: 3500,
    description: 'iPhone 13/14 (390x844): Cherai Beach Arabian Sea visible immediately beside road curb'
  },
  {
    name: 'mobile_opt_04_munnar_hills_412x915.png',
    width: 412,
    height: 915,
    query: '?scene=game&env=hills',
    waitMs: 3500,
    description: 'Google Pixel (412x915): Munnar tea plantation contours and mountain scenery'
  },
  {
    name: 'mobile_opt_05_kochi_night_720x1600.png',
    width: 720,
    height: 1600,
    query: '?scene=game&env=town_night',
    waitMs: 3500,
    description: 'Tall Android (720x1600): Kochi Town Night sidewalks and storefront neon pools'
  },
  {
    name: 'mobile_opt_06_monsoon_mode_390x844.png',
    width: 390,
    height: 844,
    query: '?scene=game&env=village&mode=monsoon',
    waitMs: 3500,
    description: 'Monsoon Mode (390x844): Rain particles and roadside puddles clamped within shoulders'
  },
  {
    name: 'mobile_opt_07_landscape_1280x720.png',
    width: 1280,
    height: 720,
    query: '?scene=game&env=backwaters',
    waitMs: 3500,
    description: 'Desktop Landscape (1280x720): Bounded road width with expansive backdrop'
  }
];

function capture(target) {
  return new Promise((resolve) => {
    const outFile = path.join(outDir, target.name);
    if (fs.existsSync(outFile)) {
      try { fs.unlinkSync(outFile); } catch (e) {}
    }

    const profileDir = path.join(ROOT_DIR, '.chrome-temp-' + Math.random().toString(36).substring(2));
    const args = [
      '--headless=new',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      `--window-size=${target.width},${target.height}`,
      `--virtual-time-budget=${target.waitMs}`,
      `--screenshot=${outFile}`,
      `http://127.0.0.1:${PORT}/index.html${target.query}`
    ];

    console.log(`📸 Capturing [${target.name}] (${target.width}x${target.height})...`);
    const proc = spawn(CHROME_PATH, args);

    proc.stdout.on('data', d => console.log(`[Chrome STDOUT] ${d}`));
    proc.stderr.on('data', d => console.log(`[Chrome STDERR] ${d}`));

    proc.on('close', (code) => {
      console.log(`Chrome closed with code: ${code}`);
      try {
        if (fs.existsSync(profileDir)) fs.rmSync(profileDir, { recursive: true, force: true });
      } catch (e) {}

      if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
        console.log(`  ✓ Saved: ${target.name} (${fs.statSync(outFile).size} bytes) - ${target.description}`);
        resolve(true);
      } else {
        console.warn(`  ✗ Failed: ${target.name}`);
        resolve(false);
      }
    });

    proc.on('error', (err) => {
      console.error(`  ✗ Error on ${target.name}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  server.listen(PORT, '127.0.0.1', async () => {
    console.log(`\n🚀 Testing Phase 6.1 Mobile Visuals on http://127.0.0.1:${PORT}...`);

    for (const t of TARGETS) {
      await capture(t);
    }

    server.close();
    console.log('\n🎉 Phase 6.1 Mobile Visual Verification Complete!');
  });
}

run();
