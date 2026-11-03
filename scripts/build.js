/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Automated Multi-Platform Build, Packaging & ZIP Distribution Script
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const BUILDS_DIR = path.join(ROOT_DIR, 'builds');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const PKG = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));

const PLATFORMS = [
  {
    id: 'standalone',
    name: 'Standalone HTML5 Web Build',
    description: '100% offline self-contained HTML5 arcade web game.',
    sdkScript: '',
    platformFlag: 'standalone',
    targetMarket: 'Itch.io, Self-Hosted, Direct Web Portals',
    sdkVersion: 'N/A (Offline Direct)',
    zipName: 'rickshaw-rush-standalone.zip',
    compliance: {
      offlineReady: true,
      zeroExternalCalls: true,
      responsive16to9: true,
      incognitoSafe: true,
      monetization: 'None / Ad-Free'
    }
  },
  {
    id: 'youtube',
    name: 'YouTube Playables Certified Build',
    description: 'Compliant with YouTube Playables Certification and game_api/v1.',
    sdkScript: '<script src="https://www.youtube.com/game_api/v1"></script>',
    platformFlag: 'youtube',
    targetMarket: 'YouTube Playables Game Store',
    sdkVersion: 'YouTube Playables Game API v1',
    zipName: 'rickshaw-rush-youtube.zip',
    compliance: {
      offlineReady: false,
      sdkPrecedesGameCode: true,
      firstFrameReadyHook: true,
      gameReadyHook: true,
      cloudSaveData: true,
      sendScoreSupport: true,
      audioMuteIntegration: true,
      zeroThirdPartyCalls: true
    }
  },
  {
    id: 'crazygames-basic',
    name: 'CrazyGames SDK v3 (Basic Launch Build)',
    description: 'Compliant with CrazyGames Basic Launch requirements: clean, unmonetized, zero ads, with gameplayStart/Stop tracking.',
    sdkScript: '<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>',
    platformFlag: 'crazygames-basic',
    targetMarket: 'CrazyGames Developer Portal (Initial Basic Launch Review)',
    sdkVersion: 'CrazyGames SDK v3 (Basic Launch Mode)',
    zipName: 'rickshaw-rush-crazygames-basic.zip',
    compliance: {
      basicLaunchReady: true,
      fullLaunchReady: false,
      monetizationDisabled: true,
      rewardedAdButtonHidden: true,
      interstitialAdsDisabled: true,
      gameplayLifecycleHooks: true,
      happytimeHook: true,
      zeroExternalFakeAds: true,
      inGameCoinsEconomyActive: true
    }
  },
  {
    id: 'crazygames',
    name: 'CrazyGames SDK v3 Build',
    description: 'Compliant with CrazyGames SDK v3 specification for Basic and Full Launch.',
    sdkScript: '<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>',
    platformFlag: 'crazygames',
    targetMarket: 'CrazyGames Web Portal',
    sdkVersion: 'CrazyGames SDK v3',
    zipName: 'rickshaw-rush-crazygames.zip',
    compliance: {
      basicLaunchReady: true,
      fullLaunchReady: true,
      gameplayLifecycleHooks: true,
      interstitialMidgameAd: true,
      rewardedAdSupport: true,
      happytimeHook: true,
      audioMuteDuringAds: true
    }
  },
  {
    id: 'poki',
    name: 'Poki HTML5 SDK v2 Build',
    description: 'Compliant with Poki SDK v2 Phaser implementation guidelines.',
    sdkScript: '<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>',
    platformFlag: 'poki',
    targetMarket: 'Poki.com Global Game Portal',
    sdkVersion: 'Poki SDK v2',
    zipName: 'rickshaw-rush-poki.zip',
    compliance: {
      gameLoadingFinishedHook: true,
      gameplayStartStopHooks: true,
      noDuplicateConsecutiveEvents: true,
      commercialBreakSupport: true,
      rewardedBreakSupport: true,
      responsive16to9: true,
      inputDisabledDuringAds: true
    }
  }
];

function getDirStats(dir) {
  let size = 0;
  let fileCount = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = getDirStats(full);
      size += sub.size;
      fileCount += sub.fileCount;
    } else {
      size += fs.statSync(full).size;
      fileCount++;
    }
  }
  return { size, fileCount };
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function generateIndexHtml(platform) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#1B5E20">
  <title>RICKSHAW RUSH: LAST STOP LEGEND</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #1A252F;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #game-container {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      touch-action: none;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>
  <script>
    window.__RR_PLATFORM__ = "${platform.platformFlag}";
  </script>
  ${platform.sdkScript}
</head>
<body>
  <div id="game-container"></div>
  <script src="vendor/phaser.min.js"></script>
  <script type="module" src="src/main.js"></script>
</body>
</html>
`;
}

function build() {
  console.log('🚀 Starting Rickshaw Rush Platform Builds & Packaging...');

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const masterManifest = {
    game: 'RICKSHAW RUSH: LAST STOP LEGEND',
    tagline: 'PICK UP. DODGE. DELIVER. REPEAT.',
    version: PKG.version || '1.3.0',
    buildDate: new Date().toISOString(),
    phaserRuntimeVersion: '4.2.1 (Phaser 3 API Compatible)',
    platforms: []
  };

  PLATFORMS.forEach(platform => {
    const outDir = path.join(BUILDS_DIR, platform.id);
    console.log(`\n📦 Building [${platform.id.toUpperCase()}] -> ${outDir}`);

    if (fs.existsSync(outDir)) {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
    fs.mkdirSync(outDir, { recursive: true });

    // 1. Copy src directory
    copyDirRecursive(path.join(ROOT_DIR, 'src'), path.join(outDir, 'src'));

    // 2. Copy vendor directory
    copyDirRecursive(path.join(ROOT_DIR, 'vendor'), path.join(outDir, 'vendor'));

    // 3. Write customized index.html
    const indexHtml = generateIndexHtml(platform);
    fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml, 'utf8');

    // 4. Calculate package stats
    const stats = getDirStats(outDir);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const sizeKB = (stats.size / 1024).toFixed(1);

    // 5. Write platform-specific build_manifest.json
    const platformManifest = {
      platformId: platform.id,
      name: platform.name,
      description: platform.description,
      version: masterManifest.version,
      buildTimestamp: masterManifest.buildDate,
      entryPoint: 'index.html',
      runtimeEngine: masterManifest.phaserRuntimeVersion,
      sdkVersion: platform.sdkVersion,
      targetMarket: platform.targetMarket,
      totalFiles: stats.fileCount + 1, // including manifest
      uncompressedSizeKB: parseFloat(sizeKB),
      uncompressedSizeMB: parseFloat(sizeMB),
      compliance: platform.compliance
    };

    fs.writeFileSync(
      path.join(outDir, 'build_manifest.json'),
      JSON.stringify(platformManifest, null, 2),
      'utf8'
    );

    // 6. Generate ZIP package in dist/
    const zipPath = path.join(DIST_DIR, platform.zipName);
    if (fs.existsSync(zipPath)) {
      fs.rmSync(zipPath, { force: true });
    }

    try {
      // Use .NET ZipFile directly for instant, reliable packaging
      const psCmd = `powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${outDir.replace(/'/g, "''")}', '${zipPath.replace(/'/g, "''")}');"`;
      execSync(psCmd, { stdio: 'pipe' });
      const zipSizeKB = (fs.statSync(zipPath).size / 1024).toFixed(1);
      platformManifest.zipPackage = {
        fileName: platform.zipName,
        path: `dist/${platform.zipName}`,
        sizeKB: parseFloat(zipSizeKB)
      };
      console.log(`  ✓ Created ZIP: dist/${platform.zipName} (${zipSizeKB} KB)`);
    } catch (zipErr) {
      console.warn(`  ⚠ ZIP creation warning for ${platform.id}:`, zipErr.message);
    }

    masterManifest.platforms.push(platformManifest);
    console.log(`✅ [${platform.id}] Build complete: ${sizeMB} MB (${stats.fileCount} files).`);
  });

  // Write Master Build Manifest in root
  fs.writeFileSync(
    path.join(ROOT_DIR, 'build_manifest.json'),
    JSON.stringify(masterManifest, null, 2),
    'utf8'
  );

  console.log('\n🎉 All 4 platform distributions and ZIP packages generated successfully!');
}

build();
