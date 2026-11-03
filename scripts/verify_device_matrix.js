/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Device Matrix & Responsive Viewport Verification Script
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

const matrixDir = path.join(ROOT_DIR, 'screenshots', 'matrix');
if (!fs.existsSync(matrixDir)) {
  fs.mkdirSync(matrixDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const DEVICES = [
  { name: 'android_portrait', label: 'Android Phone (Portrait)', w: 390, h: 844, touch: true },
  { name: 'android_landscape', label: 'Android Phone (Landscape)', w: 844, h: 390, touch: true },
  { name: 'tablet_ipad', label: 'Tablet (3:4 Portrait)', w: 768, h: 1024, touch: true },
  { name: 'desktop_chrome', label: 'Desktop Chrome (720p)', w: 1280, h: 720, touch: false },
  { name: 'desktop_edge', label: 'Desktop Edge (1080p)', w: 1920, h: 1080, touch: false },
  { name: 'incognito_browser', label: 'Incognito Browser Profile', w: 412, h: 915, incognito: true },
  { name: 'small_viewport', label: 'Small Viewport (Compact Phone)', w: 320, h: 568, touch: true },
  { name: 'large_viewport', label: 'Large Viewport (2K Ultrawide)', w: 2560, h: 1440, touch: false },
];

function captureDevice(device) {
  return new Promise((resolve, reject) => {
    const outFile = path.join(matrixDir, `${device.name}.png`);
    const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', `chrome_matrix_${device.name}_${Date.now()}`);

    const args = [
      '--headless=new',
      '--disable-gpu',
      `--window-size=${device.w},${device.h}`,
      `--screenshot=${outFile}`,
      '--default-background-color=00000000',
      '--virtual-time-budget=4000',
      '--hide-scrollbars',
      `--user-data-dir=${tempProfile}`
    ];

    if (device.incognito) {
      args.push('--incognito');
    }

    const url = `http://127.0.0.1:${PORT}/?scene=game&env=village`;
    args.push(url);

    const startTime = Date.now();
    const proc = spawn(CHROME_PATH, args);

    proc.on('close', (code) => {
      const elapsed = Date.now() - startTime;
      try {
        fs.rmSync(tempProfile, { recursive: true, force: true });
      } catch (e) {}

      if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
        const bytes = fs.statSync(outFile).size;
        console.log(`  ✓ [PASS] ${device.label} (${device.w}x${device.h}): ${bytes} bytes in ${elapsed}ms`);
        resolve({ device: device.label, resolution: `${device.w}x${device.h}`, status: 'PASS', sizeBytes: bytes, timeMs: elapsed });
      } else {
        console.warn(`  ✗ [FAIL] ${device.label}: Screenshot failed or empty`);
        resolve({ device: device.label, resolution: `${device.w}x${device.h}`, status: 'FAIL', sizeBytes: 0, timeMs: elapsed });
      }
    });

    proc.on('error', (err) => {
      console.error(`  ✗ [ERROR] ${device.label}:`, err.message);
      resolve({ device: device.label, resolution: `${device.w}x${device.h}`, status: 'ERROR', error: err.message });
    });
  });
}

async function runMatrix() {
  server.listen(PORT, async () => {
    console.log(`\n📱 Starting Device Matrix Runtime Verification on http://127.0.0.1:${PORT}`);
    const results = [];

    for (const dev of DEVICES) {
      const r = await captureDevice(dev);
      results.push(r);
    }

    server.close();
    console.log('\n📊 Device Matrix Summary:');
    console.table(results);

    // Save JSON summary
    fs.writeFileSync(
      path.join(matrixDir, 'matrix_results.json'),
      JSON.stringify(results, null, 2),
      'utf8'
    );
  });
}

runMatrix();

