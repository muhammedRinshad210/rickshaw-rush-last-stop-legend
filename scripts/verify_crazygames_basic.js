/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Phase 6: Automated Browser Verification for CrazyGames Basic Launch
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const BASIC_DIR = path.join(ROOT_DIR, 'builds', 'crazygames-basic');
const PORT = 8097;
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

  const filePath = path.join(BASIC_DIR, reqUrl);
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

const outDir = path.join(ROOT_DIR, 'screenshots', 'crazygames_basic');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const TARGETS = [
  { name: 'basic_01_menu.png', query: '', waitMs: 3200 },
  { name: 'basic_02_gameplay.png', query: '?scene=game&env=village', waitMs: 3500 },
  { name: 'basic_03_gameover_no_ads.png', query: '?scene=gameover', waitMs: 3200 },
  { name: 'basic_04_monsoon.png', query: '?scene=game&env=village&mode=monsoon', waitMs: 3500 }
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
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--window-size=720,1280',
      `--virtual-time-budget=${target.waitMs}`,
      `--screenshot=${outFile}`,
      `http://127.0.0.1:${PORT}/index.html${target.query}`
    ];

    console.log(`📸 Capturing [${target.name}] from builds/crazygames-basic/...`);
    const proc = spawn(CHROME_PATH, args);

    proc.on('close', () => {
      try {
        if (fs.existsSync(profileDir)) fs.rmSync(profileDir, { recursive: true, force: true });
      } catch (e) {}

      if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
        console.log(`  ✓ Saved: ${target.name} (${fs.statSync(outFile).size} bytes)`);
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
    console.log(`\n🚀 Testing Dedicated CrazyGames Basic Launch Build on http://127.0.0.1:${PORT}...`);

    for (const t of TARGETS) {
      await capture(t);
    }

    server.close();
    console.log('🎉 Basic Launch Runtime Verification Complete!');
  });
}

run();

