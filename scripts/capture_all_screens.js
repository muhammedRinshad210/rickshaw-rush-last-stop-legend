/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Comprehensive Screenshot Capture Automation for QA Audit
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 8086;

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

const screenshotsDir = path.join(ROOT_DIR, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const TARGETS = [
  { name: '01_start_screen.png', query: '', waitMs: 3500 },
  { name: '02_village_gameplay.png', query: '?scene=game&env=village', waitMs: 3500 },
  { name: '03_backwater_gameplay.png', query: '?scene=game&env=backwaters', waitMs: 3500 },
  { name: '04_beach_gameplay.png', query: '?scene=game&env=coastal', waitMs: 3500 },
  { name: '05_munnar_gameplay.png', query: '?scene=game&env=hills', waitMs: 3500 },
  { name: '06_night_gameplay.png', query: '?scene=game&env=town_night', waitMs: 3500 },
  { name: '07_game_over.png', query: '?scene=gameover', waitMs: 3500 },
  { name: '08_garage_screen.png', query: '?scene=garage', waitMs: 3500 },
];

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function captureTarget(target) {
  return new Promise((resolve) => {
    const profileDir = path.join(ROOT_DIR, '.chrome-temp-' + Math.random().toString(36).substring(2));
    const outPath = path.join(screenshotsDir, target.name);

    const args = [
      '--headless=new',
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--window-size=720,1280',
      `--virtual-time-budget=${target.waitMs}`,
      `--screenshot=${outPath}`,
      `http://127.0.0.1:${PORT}/index.html${target.query}`
    ];

    console.log(`📸 Capturing [${target.name}] (${target.query || 'start'})...`);
    const child = spawn(chromePath, args);

    child.on('close', (code) => {
      try {
        if (fs.existsSync(profileDir)) {
          fs.rmSync(profileDir, { recursive: true, force: true });
        }
      } catch (e) {}

      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
        console.log(`  ✓ Saved: ${target.name} (${fs.statSync(outPath).size} bytes)`);
      } else {
        console.log(`  ✗ Failed to capture ${target.name}`);
      }
      resolve();
    });

    child.on('error', (err) => {
      console.error(`Error capturing ${target.name}:`, err);
      resolve();
    });
  });
}

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`📡 QA Test Server running on http://127.0.0.1:${PORT}`);
  for (const target of TARGETS) {
    await captureTarget(target);
  }
  console.log('🎉 All captures completed!');
  server.close();
});
