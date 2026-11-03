/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Phase 5: Automated 26-Second Video Trailer Recorder
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 8096;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const trailerOut = path.join(ROOT_DIR, 'publishing', 'trailers', 'rickshaw_rush_trailer_720p.webm');

let trailerSaved = false;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/save_trailer') {
    const fileStream = fs.createWriteStream(trailerOut);
    req.pipe(fileStream);

    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      trailerSaved = true;
      console.log(`\n🎉 Trailer saved to disk: ${trailerOut} (${fs.statSync(trailerOut).size} bytes)!`);
    });
    return;
  }

  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/publishing/trailers/trailer_player.html';

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

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`🎬 Trailer Recorder Server running on http://127.0.0.1:${PORT}...`);

  const profileDir = path.join(ROOT_DIR, '.chrome-temp-trailer-' + Date.now());

  const args = [
    '--headless=new',
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--autoplay-policy=no-user-gesture-required',
    '--window-size=1280,720',
    `http://127.0.0.1:${PORT}/publishing/trailers/trailer_player.html`
  ];

  console.log('🎥 Launching Chrome to record 26-second gameplay trailer...');
  const proc = spawn(CHROME_PATH, args);

  // Poll for trailer completion (max 45 seconds timeout)
  const startTime = Date.now();
  const checkInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    process.stdout.write(`  ⏳ Recording trailer... ${Math.floor(elapsed / 1000)}s\r`);

    if (trailerSaved || elapsed > 45000) {
      clearInterval(checkInterval);
      console.log('\n🛑 Finishing trailer recording process...');
      proc.kill();
      server.close();
      try {
        if (fs.existsSync(profileDir)) fs.rmSync(profileDir, { recursive: true, force: true });
      } catch (e) {}

      if (fs.existsSync(trailerOut) && fs.statSync(trailerOut).size > 10000) {
        console.log(`✅ Trailer generation SUCCESS: ${trailerOut} (${(fs.statSync(trailerOut).size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        console.warn('⚠️ Trailer recording timed out or file is smaller than expected.');
      }
      process.exit(0);
    }
  }, 1000);
});

