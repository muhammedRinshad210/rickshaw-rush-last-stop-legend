/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Automated Browser Runtime Tester & Screenshot Capture
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 8085;

// MIME types for static server
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

// 1. Create static server
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

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`📡 Local server listening on http://127.0.0.1:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = path.join(ROOT_DIR, '.chrome-temp-prof-' + Date.now());

  if (!fs.existsSync(chromePath)) {
    console.warn('Chrome executable not found at expected path:', chromePath);
    server.close();
    process.exit(0);
  }

  const screenshotPath = path.join(screenshotsDir, 'start_screen.png');
  const args = [
    '--headless=new',
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=720,1280',
    '--virtual-time-budget=4000',
    `--screenshot=${screenshotPath}`,
    `http://127.0.0.1:${PORT}/index.html`
  ];

  console.log('📸 Launching Chrome headless to capture runtime start screen...');
  const child = spawn(chromePath, args);

  child.on('close', (code) => {
    console.log(`Chrome process exited with code ${code}`);
    server.close();

    // Clean up temp profile if exists
    try {
      if (fs.existsSync(profileDir)) {
        fs.rmSync(profileDir, { recursive: true, force: true });
      }
    } catch (e) {}

    if (fs.existsSync(screenshotPath) && fs.statSync(screenshotPath).size > 1000) {
      console.log(`✅ Success! Screenshot saved to ${screenshotPath} (${fs.statSync(screenshotPath).size} bytes)`);
    } else {
      console.log('⚠️ Screenshot was not created or empty.');
    }
  });

  child.on('error', (err) => {
    console.error('Failed to run Chrome:', err);
    server.close();
  });
});

