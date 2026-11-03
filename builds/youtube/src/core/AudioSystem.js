/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Procedural Web Audio API Sound Synthesizer
 * 100% self-contained, no external audio files required.
 */

export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.sfxGain = null;
    this.engineGain = null;
    this.isInitialized = false;
    this.engineOsc = null;
    this.engineFilter = null;
    this.isEngineRunning = false;

    // Monsoon Weather Audio State
    this.rainGain = null;
    this.rainFilter = null;
    this.rainSource = null;
    this.isRainRunning = false;

    // Load initial mute state
    try {
      const saved = localStorage.getItem('rr_laststop_audio_muted');
      this.isMuted = saved === 'true';
    } catch (e) {
      this.isMuted = false;
    }
  }

  /**
   * Lazily initializes Web Audio on first user gesture.
   */
  init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('Web Audio API not supported on this browser.');
        return;
      }
      this.ctx = new AudioCtx();

      // Master gain node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX gain node
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Engine gain node
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.engineGain.connect(this.masterGain);

      // Rain ambience gain node (Monsoon mode)
      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.rainGain.connect(this.masterGain);

      this.isInitialized = true;

      // Handle visibility changes to save battery & respect browser state
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend().catch(() => {});
          }
        } else {
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
          }
        }
      });
    } catch (err) {
      console.warn('Failed to initialize Web Audio:', err);
    }
  }

  ensureContext() {
    if (!this.isInitialized || !this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    try {
      localStorage.setItem('rr_laststop_audio_muted', String(muted));
    } catch (e) {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.03);
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /* -------------------------------------------------------------
   * SIGNATURE SOUND: 2-TONE INDIAN AUTO HORN ("Peee-pooo!")
   * ----------------------------------------------------------- */
  playHorn() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = 0.32;

    // Dual horn oscillators (authentic Indian brass horn frequencies)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'square';

    // Characteristic horn interval (~370Hz and ~466Hz)
    osc1.frequency.setValueAtTime(370, t);
    osc1.frequency.exponentialRampToValueAtTime(380, t + dur);

    osc2.frequency.setValueAtTime(466, t);
    osc2.frequency.exponentialRampToValueAtTime(475, t + dur);

    // Warm bandpass filter for metallic auto body acoustic resonance
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(3.0, t);

    // Volume envelope: punchy attack, steady sustain, crisp release
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
    gain.gain.setValueAtTime(0.38, t + dur - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + dur);
    osc2.stop(t + dur);
  }

  /* -------------------------------------------------------------
   * COIN COLLECTION: Crystal dual-bell chime
   * ----------------------------------------------------------- */
  playCoin() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [987.77, 1318.51]; // B5 then E6

    notes.forEach((freq, idx) => {
      const startTime = t + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.15);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.23);
    });
  }

  /* -------------------------------------------------------------
   * PASSENGER PICKUP: "Hey Auto!" cheerful chirp
   * ----------------------------------------------------------- */
  playPassengerPickup() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t); // A4
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12); // Octave jump

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.26);

    // Second harmonic sparkle
    const sparkle = this.ctx.createOscillator();
    const sGain = this.ctx.createGain();
    sparkle.type = 'sine';
    sparkle.frequency.setValueAtTime(1320, t + 0.08);
    sparkle.frequency.exponentialRampToValueAtTime(1760, t + 0.2);

    sGain.gain.setValueAtTime(0, t + 0.08);
    sGain.gain.linearRampToValueAtTime(0.2, t + 0.1);
    sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    sparkle.connect(sGain);
    sGain.connect(this.sfxGain);

    sparkle.start(t + 0.08);
    sparkle.stop(t + 0.31);
  }

  /* -------------------------------------------------------------
   * PASSENGER DELIVERY: Fanfare arpeggio + Cash Register Coins
   * ----------------------------------------------------------- */
  playPassengerDelivery() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    chord.forEach((freq, idx) => {
      const st = t + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0, st);
      gain.gain.linearRampToValueAtTime(0.3, st + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(st);
      osc.stop(st + 0.36);
    });

    // Cash register "cha-ching" burst
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const ct = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const ringOsc = this.ctx.createOscillator();
        const ringGain = this.ctx.createGain();
        ringOsc.type = 'sine';
        ringOsc.frequency.setValueAtTime(2000 + i * 400, ct + i * 0.04);
        ringGain.gain.setValueAtTime(0.18, ct + i * 0.04);
        ringGain.gain.exponentialRampToValueAtTime(0.0001, ct + i * 0.04 + 0.18);

        ringOsc.connect(ringGain);
        ringGain.connect(this.sfxGain);
        ringOsc.start(ct + i * 0.04);
        ringOsc.stop(ct + i * 0.04 + 0.19);
      }
    }, 280);
  }

  /* -------------------------------------------------------------
   * CHAYA SHIELD ACTIVATION
   * ----------------------------------------------------------- */
  playShieldActivate() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.35);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.46);
  }

  /* -------------------------------------------------------------
   * SHIELD HIT / DEFLECTION
   * ----------------------------------------------------------- */
  playShieldHit() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.25);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.29);
  }

  /* -------------------------------------------------------------
   * NEAR MISS: High-speed Doppler whoosh + ting
   * ----------------------------------------------------------- */
  playNearMiss(combo = 1) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Pitch rises with combo level!
    const baseFreq = 880 + (combo - 1) * 220;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.15);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.21);
  }

  /* -------------------------------------------------------------
   * COW REACTION: Synthesized Formant "Moooo!"
   * ----------------------------------------------------------- */
  playCowMoo() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = 0.55;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Downward moo pitch glide
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.2);
    osc.frequency.linearRampToValueAtTime(110, t + dur);

    // Formant filter for vowel acoustic resonance
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, t);
    filter.frequency.linearRampToValueAtTime(320, t + dur);
    filter.Q.setValueAtTime(5.0, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.08);
    gain.gain.setValueAtTime(0.28, t + dur - 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + dur);
  }

  /* -------------------------------------------------------------
   * COLLISION: Heavy crash impact with noise rumble
   * ----------------------------------------------------------- */
  playCollision() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = 0.45;

    // Noise buffer generation for metal crunch
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(800, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, t + dur);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    // Low sub-bass thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + dur);

    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);

    noise.start(t);
    osc.start(t);
    osc.stop(t + dur);
  }

  /* -------------------------------------------------------------
   * SPEED BOOST / NITRO WHOOSH
   * ----------------------------------------------------------- */
  playBoost() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + 0.4);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.46);
  }

  /* -------------------------------------------------------------
   * UI CLICK / WOODEN POP
   * ----------------------------------------------------------- */
  playClick() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  /* -------------------------------------------------------------
   * LOCATION / BIOME TRANSITION CHIME (Gentle Kerala Bell Fanfare)
   * ----------------------------------------------------------- */
  playLocationChime() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const st = t + idx * 0.1;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0, st);
      gain.gain.linearRampToValueAtTime(0.2, st + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(st);
      osc.stop(st + 0.48);
    });
  }

  /* -------------------------------------------------------------
   * CONTINUOUS 2-STROKE AUTO-RICKSHAW ENGINE SOUND
   * ----------------------------------------------------------- */
  startEngine() {
    this.ensureContext();
    if (!this.ctx || this.isEngineRunning) return;

    try {
      const t = this.ctx.currentTime;
      this.engineOsc = this.ctx.createOscillator();
      this.engineFilter = this.ctx.createBiquadFilter();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(42, t); // Authentic 2-stroke low hum

      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(260, t);

      this.engineGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, t);

      this.engineOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);

      this.engineOsc.start(t);
      this.isEngineRunning = true;
    } catch (e) {
      console.warn('Engine sound start failed:', e);
    }
  }

  updateEngine(speedRatio) {
    if (!this.isEngineRunning || !this.engineOsc || !this.ctx) return;
    try {
      const targetFreq = 42 + (speedRatio - 1) * 35;
      this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
    } catch (e) {}
  }

  stopEngine() {
    if (!this.isEngineRunning || !this.engineOsc) return;
    try {
      this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      setTimeout(() => {
        if (this.engineOsc) {
          try { this.engineOsc.stop(); } catch (e) {}
          this.engineOsc = null;
        }
        this.isEngineRunning = false;
      }, 150);
    } catch (e) {
      this.isEngineRunning = false;
    }
  }

  /* -------------------------------------------------------------
   * PHASE 4.5: MONSOON WEATHER AUDIO (PROCEDURAL WEB AUDIO)
   * ----------------------------------------------------------- */
  setRainIntensity(intensity = 0.0) {
    this.ensureContext();
    if (!this.ctx || !this.rainGain) return;

    if (intensity <= 0.01) {
      this.stopRain();
      return;
    }

    try {
      if (!this.isRainRunning || !this.rainSource) {
        // Create 2-second looped pink/white noise buffer for rain sound
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Pink-ish noise filter for gentle rainfall acoustic profile
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.15;
        }

        this.rainSource = this.ctx.createBufferSource();
        this.rainSource.buffer = buffer;
        this.rainSource.loop = true;

        this.rainFilter = this.ctx.createBiquadFilter();
        this.rainFilter.type = 'lowpass';
        this.rainFilter.frequency.setValueAtTime(650, this.ctx.currentTime);

        this.rainSource.connect(this.rainFilter);
        this.rainFilter.connect(this.rainGain);
        this.rainSource.start();
        this.isRainRunning = true;
      }

      // Smoothly scale filter cutoff and gain with weather intensity
      const targetGain = Math.min(0.24, 0.04 + intensity * 0.18);
      const targetCutoff = 500 + intensity * 1300;
      this.rainGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.35);
      if (this.rainFilter) {
        this.rainFilter.frequency.setTargetAtTime(targetCutoff, this.ctx.currentTime, 0.35);
      }
    } catch (e) {
      console.warn('[AudioSystem] Rain ambience error:', e);
    }
  }

  stopRain() {
    if (!this.isRainRunning && !this.rainGain) return;
    try {
      if (this.rainGain && this.ctx) {
        this.rainGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      }
      setTimeout(() => {
        if (this.rainSource) {
          try { this.rainSource.stop(); } catch (e) {}
          this.rainSource.disconnect();
          this.rainSource = null;
        }
        if (this.rainFilter) {
          this.rainFilter.disconnect();
          this.rainFilter = null;
        }
        this.isRainRunning = false;
      }, 200);
    } catch (e) {
      this.isRainRunning = false;
    }
  }

  playThunder() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const dur = 3.2;

      // Low frequency rolling rumble oscillator (42Hz -> 54Hz -> 24Hz)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(42, t);
      osc.frequency.linearRampToValueAtTime(54, t + 0.35);
      osc.frequency.exponentialRampToValueAtTime(24, t + dur);

      oscGain.gain.setValueAtTime(0.001, t);
      oscGain.gain.linearRampToValueAtTime(0.28, t + 0.12);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      // Lowpass filtered noise component for cracking air rumble
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(95, t);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.22, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + dur);
      noise.start(t);
      noise.stop(t + dur);
    } catch (e) {
      console.warn('[AudioSystem] Thunder error:', e);
    }
  }

  playWaterSplash() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const dur = 0.22;
      const bufferSize = this.ctx.sampleRate * dur;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(1.8, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(t);
      noise.stop(t + dur);
    } catch (e) {}
  }

  playWeatherChime() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const ct = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const st = ct + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0, st);
        gain.gain.linearRampToValueAtTime(0.2, st + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(st);
        osc.stop(st + 0.36);
      });
    } catch (e) {}
  }
}

// Global Audio Singleton
export const SoundFX = new AudioSystem();

