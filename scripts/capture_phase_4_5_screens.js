/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Phase 4.5: Capture All 5 Locations in Normal and Monsoon Drive
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 8088;

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
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(ROOT_DIR, reqPath);
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

const outDir = path.join(ROOT_DIR, 'screenshots', 'phase4_5');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const CAPTURES = [
  { name: '00_start_menu_mode_selector.png', query: '', waitMs: 3200 },
  // Normal Drive across all 5 environments
  { name: 'normal_01_village.png', query: '?scene=game&env=village&mode=normal', waitMs: 3200 },
  { name: 'normal_02_backwaters.png', query: '?scene=game&env=backwaters&mode=normal', waitMs: 3200 },
  { name: 'normal_03_beach.png', query: '?scene=game&env=coastal&mode=normal', waitMs: 3200 },
  { name: 'normal_04_munnar.png', query: '?scene=game&env=hills&mode=normal', waitMs: 3200 },
  { name: 'normal_05_town_night.png', query: '?scene=game&env=town_night&mode=normal', waitMs: 3200 },
  // Monsoon Drive across all 5 environments
  { name: 'monsoon_01_village.png', query: '?scene=game&env=village&mode=monsoon', waitMs: 3500 },
  { name: 'monsoon_02_backwaters.png', query: '?scene=game&env=backwaters&mode=monsoon', waitMs: 3500 },
  { name: 'monsoon_03_beach.png', query: '?scene=game&env=coastal&mode=monsoon', waitMs: 3500 },
  { name: 'monsoon_04_munnar.png', query: '?scene=game&env=hills&mode=monsoon', waitMs: 3500 },
  { name: 'monsoon_05_town_night.png', query: '?scene=game&env=town_night&mode=monsoon', waitMs: 3500 },
];

function captureOne(item) {
  return new Promise((resolve) => {
    const outFile = path.join(outDir, item.name);
    if (fs.existsSync(outFile)) {
      try { fs.unlinkSync(outFile); } catch (e) {}
    }
    const profileDir = path.join(ROOT_DIR, '.chrome-temp-' + Math.random().toString(36).substring(2));

    const args = [
      '--headless=new',
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--window-size=720,1280',
      `--virtual-time-budget=${item.waitMs}`,
      `--screenshot=${outFile}`,
      `http://127.0.0.1:${PORT}/index.html${item.query}`
    ];

    console.log(`📸 Capturing [${item.name}] (${item.query || 'start'})...`);
    const proc = spawn(CHROME_PATH, args);

    proc.on('close', () => {
      try {
        if (fs.existsSync(profileDir)) {
          fs.rmSync(profileDir, { recursive: true, force: true });
        }
      } catch (e) {}

      if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
        const size = fs.statSync(outFile).size;
        console.log(`  ✓ Saved: ${item.name} (${size} bytes)`);
        resolve(true);
      } else {
        console.warn(`  ✗ Failed: ${item.name}`);
        resolve(false);
      }
    });

    proc.on('error', (err) => {
      console.error(`  ✗ Error on ${item.name}:`, err.message);
      resolve(false);
    });
  });
}

async function runAll() {
  server.listen(PORT, '127.0.0.1', async () => {
    console.log(`\n📸 Starting Phase 4.5 Capture Suite on http://127.0.0.1:${PORT}...`);

    for (const c of CAPTURES) {
      await captureOne(c);
    }

    server.close();
    console.log('🎉 All Phase 4.5 captures complete!');
  });
}

runAll();
