// =========================================================================
// PROCEDURAL AUDIO & ADAPTIVE BGM SYNTHESIZER (WEB AUDIO API)
// Supports Master / Music / SFX independent volume & mute controls,
// multi-chapter adaptive BGM grooves, urgency speedup & layered 3D SFX.
// =========================================================================

const BGM_THEMES = {
  menu: {
    bpm: 112,
    leadWave: 'triangle',
    bassWave: 'triangle',
    melody: [523.25, 0, 659.25, 587.33, 523.25, 0, 783.99, 659.25, 587.33, 0, 659.25, 523.25, 440.00, 523.25, 587.33, 0],
    bass: [130.81, 0, 196.00, 0, 174.61, 0, 196.00, 0, 146.83, 0, 196.00, 0, 130.81, 164.81, 196.00, 0],
    chords: [[261.63, 329.63, 392.0], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66], [261.63, 329.63, 392.0]]
  },
  overworld: {
    bpm: 118,
    leadWave: 'triangle',
    bassWave: 'sawtooth',
    melody: [392.0, 493.88, 587.33, 0, 659.25, 587.33, 493.88, 392.0, 440.0, 523.25, 659.25, 0, 587.33, 523.25, 493.88, 0],
    bass: [196.0, 0, 146.83, 196.0, 164.81, 0, 196.0, 0, 174.61, 0, 130.81, 174.61, 196.0, 174.61, 146.83, 0],
    chords: [[196.0, 246.94, 293.66], [164.81, 196.0, 246.94], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66]]
  },
  chapter1: {
    bpm: 124,
    leadWave: 'triangle',
    bassWave: 'sawtooth',
    melody: [523.25, 587.33, 659.25, 0, 783.99, 659.25, 587.33, 523.25, 698.46, 659.25, 587.33, 523.25, 587.33, 659.25, 783.99, 0],
    bass: [130.81, 130.81, 196.0, 0, 174.61, 174.61, 220.0, 0, 196.0, 196.0, 146.83, 0, 130.81, 164.81, 196.0, 0],
    chords: [[261.63, 329.63, 392.0], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66], [261.63, 329.63, 392.0]]
  },
  chapter2: {
    bpm: 130,
    leadWave: 'square',
    bassWave: 'sawtooth',
    melody: [587.33, 0, 698.46, 659.25, 587.33, 523.25, 587.33, 0, 880.0, 783.99, 698.46, 659.25, 587.33, 659.25, 698.46, 0],
    bass: [146.83, 0, 146.83, 220.0, 174.61, 0, 174.61, 220.0, 196.0, 0, 196.0, 246.94, 220.0, 196.0, 164.81, 0],
    chords: [[293.66, 349.23, 440.0], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66], [220.0, 261.63, 329.63]]
  },
  chapter3: {
    bpm: 136,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    melody: [659.25, 783.99, 739.99, 659.25, 587.33, 659.25, 783.99, 0, 987.77, 880.0, 783.99, 739.99, 659.25, 783.99, 987.77, 0],
    bass: [164.81, 164.81, 0, 196.0, 146.83, 146.83, 0, 196.0, 130.81, 0, 164.81, 196.0, 123.47, 146.83, 164.81, 0],
    chords: [[164.81, 196.0, 246.94], [146.83, 185.0, 220.0], [130.81, 164.81, 196.0], [123.47, 146.83, 185.0]]
  },
  chapter4: {
    bpm: 134,
    leadWave: 'square',
    bassWave: 'sawtooth',
    melody: [659.25, 0, 783.99, 987.77, 1174.66, 0, 987.77, 783.99, 880.0, 0, 1046.50, 987.77, 783.99, 659.25, 587.33, 0],
    bass: [110.0, 110.0, 220.0, 110.0, 146.83, 146.83, 293.66, 146.83, 130.81, 130.81, 261.63, 130.81, 164.81, 196.0, 220.0, 0],
    chords: [[220.0, 261.63, 329.63], [146.83, 174.61, 220.0], [196.0, 246.94, 293.66], [220.0, 277.18, 329.63]]
  }
};

export class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.bgmGain = null;
    this.sfxGain = null;

    this.masterOn = true;
    this.sfxOn = true;
    this.bgmOn = true;

    this.masterVolume = 1.0;
    this.bgmVolume = 0.7;
    this.sfxVolume = 0.85;

    this.bgmTimer = null;
    this.bgmTheme = 'chapter1';
    this.bgmUrgent = false;
    this.nextNoteTime = 0;
    this.step = 0;
    this._noiseCache = new Map();
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && !this.masterGain && typeof this.ctx.createGain === 'function') {
        this.masterGain = this.ctx.createGain();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        if (typeof this.ctx.createDynamicsCompressor === 'function') {
          this.compressor = this.ctx.createDynamicsCompressor();
          this.compressor.threshold.value = -14;
          this.compressor.knee.value = 18;
          this.compressor.ratio.value = 4;
          this.compressor.attack.value = 0.004;
          this.compressor.release.value = 0.14;
          this.masterGain.connect(this.compressor);
          this.compressor.connect(this.ctx.destination);
        } else {
          this.masterGain.connect(this.ctx.destination);
        }

        this.bgmGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this._syncGains();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (_) {}
  }

  _getBgmDest() {
    return this.bgmGain || this.masterGain || (this.ctx && this.ctx.destination);
  }

  _getSfxDest() {
    return this.sfxGain || this.masterGain || (this.ctx && this.ctx.destination);
  }

  _applyGain(node, targetVal) {
    if (!node) return;
    if (this.ctx && node.gain.setTargetAtTime) {
      node.gain.setTargetAtTime(targetVal, this.ctx.currentTime, 0.025);
    } else {
      node.gain.value = targetVal;
    }
  }

  _syncGains() {
    const m = this.masterOn ? this.masterVolume : 0;
    const b = this.bgmOn ? this.bgmVolume : 0;
    const s = this.sfxOn ? this.sfxVolume : 0;
    this._applyGain(this.masterGain, m);
    this._applyGain(this.bgmGain, b);
    this._applyGain(this.sfxGain, s);
  }

  setMasterVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, Number(vol) || 0));
    this.masterOn = this.masterVolume > 0.001;
    this._syncGains();
  }

  setMasterEnabled(enabled) {
    this.masterOn = !!enabled;
    this._syncGains();
  }

  toggleMaster() {
    this.masterOn = !this.masterOn;
    if (this.masterOn && this.masterVolume <= 0.001) this.masterVolume = 1.0;
    this._syncGains();
    return this.masterOn;
  }

  setBgmVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, Number(vol) || 0));
    this.bgmOn = this.bgmVolume > 0.001;
    this._syncGains();
    if (!this.bgmOn) this.stopBGM();
  }

  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, Number(vol) || 0));
    this.sfxOn = this.sfxVolume > 0.001;
    this._syncGains();
  }

  setBgmEnabled(enabled) {
    this.bgmOn = !!enabled;
    if (this.bgmOn && this.bgmVolume <= 0.001) this.bgmVolume = 0.7;
    this._syncGains();
    if (!this.bgmOn) this.stopBGM();
  }

  setSfxEnabled(enabled) {
    this.sfxOn = !!enabled;
    if (this.sfxOn && this.sfxVolume <= 0.001) this.sfxVolume = 0.85;
    this._syncGains();
  }

  getVolumes() {
    return {
      masterVolume: this.masterVolume,
      bgmVolume: this.bgmVolume,
      sfxVolume: this.sfxVolume,
      masterOn: this.masterOn,
      bgmOn: this.bgmOn,
      sfxOn: this.sfxOn
    };
  }

  _withAudio(fn) {
    if (!this.masterOn || this.masterVolume <= 0.001) return;
    if (!this.sfxOn || this.sfxVolume <= 0.001 || !this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      fn(this.ctx.currentTime);
    } catch (_) {}
  }

  _createNoiseBuffer(dur, decayFactor = 0.3) {
    const key = `${Math.round(dur * 100)}_${Math.round(decayFactor * 100)}`;
    if (this._noiseCache.has(key)) return { buffer: this._noiseCache.get(key) };
    const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * decayFactor));
    }
    this._noiseCache.set(key, buffer);
    return { buffer };
  }

  toggleSFX() {
    this.sfxOn = !this.sfxOn;
    if (this.sfxOn && this.sfxVolume <= 0.001) this.sfxVolume = 0.85;
    this._syncGains();
    return this.sfxOn;
  }

  toggleBGM() {
    this.bgmOn = !this.bgmOn;
    if (this.bgmOn && this.bgmVolume <= 0.001) this.bgmVolume = 0.7;
    this._syncGains();
    if (!this.bgmOn) this.stopBGM();
    else this.startBGM(this.bgmTheme);
    return this.bgmOn;
  }

  setBgmTheme(theme = 'chapter1') {
    const next = BGM_THEMES[theme] ? theme : 'chapter1';
    if (this.bgmTheme === next && this.bgmTimer) return;
    this.bgmTheme = next;
    if (this.bgmTimer) {
      this.step = 0;
      this.nextNoteTime = this.ctx ? this.ctx.currentTime + 0.04 : 0;
    }
  }

  setBgmUrgency(isUrgent) {
    this.bgmUrgent = !!isUrgent;
  }

  startBGM(theme = null) {
    if (theme && BGM_THEMES[theme]) this.bgmTheme = theme;
    if (!this.bgmOn || this.bgmVolume <= 0.001) return;
    this.init();
    if (!this.ctx) return;
    if (this.bgmTimer) return;

    this.step = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    // Lookahead scheduler for tight Web Audio groove
    this.bgmTimer = setInterval(() => {
      if (!this.bgmOn || !this.masterOn || !this.ctx || this.ctx.state !== 'running') return;
      const spec = BGM_THEMES[this.bgmTheme] || BGM_THEMES.chapter1;
      const bpm = spec.bpm * (this.bgmUrgent ? 1.14 : 1.0);
      const sixteenthDur = 60 / bpm / 2; // 8th-note groove grid

      if (this.nextNoteTime < this.ctx.currentTime - 0.25) {
        this.nextNoteTime = this.ctx.currentTime + 0.03;
      }
      while (this.nextNoteTime < this.ctx.currentTime + 0.14) {
        this._scheduleBgmStep(spec, this.step, this.nextNoteTime, sixteenthDur);
        this.nextNoteTime += sixteenthDur;
        this.step++;
      }
    }, 35);
  }

  _scheduleBgmStep(spec, step, t, stepDur) {
    try {
      const dest = this._getBgmDest();
      if (!dest) return;
      const idx = step % 16;
      const isMenu = this.bgmTheme === 'menu';

      // 1. Melody lead
      const melFreq = spec.melody[idx];
      if (melFreq > 0) {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = spec.leadWave || 'triangle';
        osc.frequency.setValueAtTime(melFreq, t);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isMenu ? 1900 : 2800, t);
        const peak = isMenu ? 0.055 : 0.072;
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(peak, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, t + stepDur * 0.9);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + stepDur * 0.94);
      }

      // 2. Warm filtered bassline
      const bassFreq = spec.bass[idx];
      if (bassFreq > 0) {
        const bOsc = this.ctx.createOscillator();
        const bFilter = this.ctx.createBiquadFilter();
        const bGain = this.ctx.createGain();
        bOsc.type = spec.bassWave || 'sawtooth';
        bOsc.frequency.setValueAtTime(bassFreq, t);
        bFilter.type = 'lowpass';
        bFilter.frequency.setValueAtTime(480, t);
        bFilter.frequency.exponentialRampToValueAtTime(190, t + stepDur * 0.9);
        bGain.gain.setValueAtTime(0.001, t);
        bGain.gain.linearRampToValueAtTime(0.085, t + 0.01);
        bGain.gain.exponentialRampToValueAtTime(0.001, t + stepDur * 0.92);
        bOsc.connect(bFilter);
        bFilter.connect(bGain);
        bGain.connect(dest);
        bOsc.start(t);
        bOsc.stop(t + stepDur * 0.96);
      }

      // 3. Soft warm backing chord pad on beats 0, 4, 8, 12
      if (idx % 4 === 0 && spec.chords) {
        const chord = spec.chords[(idx / 4) % spec.chords.length];
        chord.forEach((cf) => {
          const cOsc = this.ctx.createOscillator();
          const cGain = this.ctx.createGain();
          cOsc.type = 'sine';
          cOsc.frequency.setValueAtTime(cf, t);
          cGain.gain.setValueAtTime(0.001, t);
          cGain.gain.linearRampToValueAtTime(0.022, t + 0.02);
          cGain.gain.exponentialRampToValueAtTime(0.001, t + stepDur * 3.6);
          cOsc.connect(cGain);
          cGain.connect(dest);
          cOsc.start(t);
          cOsc.stop(t + stepDur * 3.7);
        });
      }

      // 4. Crisp percussion: Kick (0, 6, 8, 14), Snare (4, 12), Hi-hat (offbeats or all on urgent)
      if (!isMenu && (idx === 0 || idx === 8 || idx === 6 || idx === 14)) {
        const kOsc = this.ctx.createOscillator();
        const kGain = this.ctx.createGain();
        kOsc.type = 'sine';
        kOsc.frequency.setValueAtTime(125, t);
        kOsc.frequency.exponentialRampToValueAtTime(42, t + 0.08);
        kGain.gain.setValueAtTime(idx % 8 === 0 ? 0.14 : 0.08, t);
        kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
        kOsc.connect(kGain);
        kGain.connect(dest);
        kOsc.start(t);
        kOsc.stop(t + 0.11);
      }
      if (!isMenu && (idx === 4 || idx === 12)) {
        const { buffer } = this._createNoiseBuffer(0.09, 0.25);
        const n = this.ctx.createBufferSource();
        n.buffer = buffer;
        const hp = this.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(1400, t);
        const sGain = this.ctx.createGain();
        sGain.gain.setValueAtTime(0.055, t);
        sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);
        n.connect(hp);
        hp.connect(sGain);
        sGain.connect(dest);
        n.start(t);
      }
      if (this.bgmUrgent || idx % 2 === 1) {
        const { buffer } = this._createNoiseBuffer(0.04, 0.22);
        const h = this.ctx.createBufferSource();
        h.buffer = buffer;
        const hp = this.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(5200, t);
        const hGain = this.ctx.createGain();
        hGain.gain.setValueAtTime(isMenu ? 0.015 : (this.bgmUrgent ? 0.038 : 0.025), t);
        hGain.gain.exponentialRampToValueAtTime(0.001, t + 0.038);
        h.connect(hp);
        hp.connect(hGain);
        hGain.connect(dest);
        h.start(t);
      }
    } catch (_) {}
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.bgmUrgent = false;
  }

  // -----------------------------------------------------------------------
  // UI & FEEDBACK SOUNDS
  // -----------------------------------------------------------------------
  uiClick() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(860, now + 0.045);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.065);
    });
  }

  uiTick() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(740, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.055);
    });
  }

  countdownTick(urgent = false) {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = urgent ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(urgent ? 987.77 : 659.25, now);
      gain.gain.setValueAtTime(urgent ? 0.22 : 0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.10);
    });
  }

  starEarned(starIndex = 1) {
    this._withAudio((now) => {
      const base = [587.33, 783.99, 1046.5][Math.max(0, Math.min(2, starIndex - 1))];
      [base, base * 1.25].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.045);
        gain.gain.setValueAtTime(0.24, now + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.22);
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now + i * 0.045); osc.stop(now + i * 0.045 + 0.23);
      });
    });
  }

  victory() {
    this._withAudio((now) => {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((f, i) => {
        const t = now + i * 0.075;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + (i === notes.length - 1 ? 0.55 : 0.2));
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(t); osc.stop(t + 0.58);
      });
    });
  }

  gameOver() {
    this._withAudio((now) => {
      const notes = [392.0, 369.99, 349.23, 311.13];
      notes.forEach((f, i) => {
        const t = now + i * 0.16;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t);
        if (i === notes.length - 1) osc.frequency.exponentialRampToValueAtTime(f * 0.78, t + 0.36);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, t);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + (i === notes.length - 1 ? 0.42 : 0.14));
        osc.connect(filter); filter.connect(gain); gain.connect(this._getSfxDest());
        osc.start(t); osc.stop(t + 0.45);
      });
    });
  }

  // -----------------------------------------------------------------------
  // GAMEPLAY ACTION & PHYSICS SOUNDS
  // -----------------------------------------------------------------------
  jump() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(270, now);
      osc.frequency.exponentialRampToValueAtTime(590, now + 0.11);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.13);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.14);
    });
  }

  land(heavy = false) {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(heavy ? 115 : 145, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.08);
      gain.gain.setValueAtTime(heavy ? 0.24 : 0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.10);
    });
  }

  grab(isHeavy = false) {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isHeavy ? 190 : 330, now);
      osc.frequency.exponentialRampToValueAtTime(isHeavy ? 280 : 510, now + 0.09);
      gain.gain.setValueAtTime(0.26, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.11);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.12);
    });
  }

  drop(isHeavy = false) {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isHeavy ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isHeavy ? 160 : 280, now);
      osc.frequency.exponentialRampToValueAtTime(isHeavy ? 62 : 120, now + 0.11);
      gain.gain.setValueAtTime(isHeavy ? 0.32 : 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.13);
    });
  }

  throwItem() {
    this._withAudio((now) => {
      const dur = 0.22;
      const { buffer } = this._createNoiseBuffer(dur, 0.3);
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass'; filter.frequency.setValueAtTime(880, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + dur);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
      noise.connect(filter); filter.connect(gain); gain.connect(this._getSfxDest());
      noise.start(now);
    });
  }

  trampoline() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.22);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(360, now);
      osc2.frequency.exponentialRampToValueAtTime(1080, now + 0.18);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.24);
      osc.connect(gain); osc2.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.25);
      osc2.start(now); osc2.stop(now + 0.22);
    });
  }

  deliver(combo = 1) {
    this._withAudio((now) => {
      const semitoneBoost = Math.min(6, Math.max(0, (combo - 1))) * 1.06;
      const pitchMult = combo > 1 ? Math.pow(2, Math.min(7, combo - 1) / 12) : 1.0;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * pitchMult + semitoneBoost, now + idx * 0.042);
        gain.gain.setValueAtTime(0.25, now + idx * 0.042);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.042 + 0.22);
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now + idx * 0.042); osc.stop(now + idx * 0.042 + 0.23);
      });
    });
  }

  dash() {
    this._withAudio((now) => {
      const dur = 0.14;
      const { buffer } = this._createNoiseBuffer(dur, 0.35);
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1150, now);
      filter.frequency.exponentialRampToValueAtTime(420, now + dur);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
      noise.connect(filter); filter.connect(gain); gain.connect(this._getSfxDest());
      noise.start(now);
    });
  }

  catchAir() {
    this._withAudio((now) => {
      [440, 659.25, 880].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.035);
        gain.gain.setValueAtTime(0.24, now + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.14);
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now + idx * 0.035); osc.stop(now + idx * 0.035 + 0.15);
      });
    });
  }

  emote() {
    this._withAudio((now) => {
      [523.25, 783.99].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);
        gain.gain.setValueAtTime(0.18, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.12);
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now + idx * 0.05); osc.stop(now + idx * 0.05 + 0.13);
      });
    });
  }

  petSound() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.17);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.18);
    });
  }

  shatter() {
    this._withAudio((now) => {
      const dur = 0.35;
      const { buffer } = this._createNoiseBuffer(dur, 0.2);
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = 1300;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
      noise.connect(filter); filter.connect(gain); gain.connect(this._getSfxDest());
      noise.start(now);
    });
  }

  glassShatter() {
    this._withAudio((now) => {
      const dur = 0.45;
      const { buffer } = this._createNoiseBuffer(dur, 0.25);
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass'; filter.frequency.setValueAtTime(2900, now);
      filter.Q.value = 2.6;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
      noise.connect(filter); filter.connect(gain); gain.connect(this._getSfxDest());
      noise.start(now);

      // Extra sparkling shards
      [2200, 3100, 3850].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.04);
        g.gain.setValueAtTime(0.11, now + i * 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.12);
        osc.connect(g); g.connect(this._getSfxDest());
        osc.start(now + i * 0.04); osc.stop(now + i * 0.04 + 0.13);
      });
    });
  }

  bonk() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(105, now + 0.18);
      gain.gain.setValueAtTime(0.52, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.22);
    });
  }

  pitFall() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.34);
      gain.gain.setValueAtTime(0.30, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.37);
    });
  }

  pianoChord() {
    this._withAudio((now) => {
      [261.63, 329.63, 392.00, 523.25].forEach(freq => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(filter); filter.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now); osc.stop(now + 0.65);
      });
    });
  }

  horn() {
    this._withAudio((now) => {
      [220, 277.18].forEach(f => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        gain.gain.setValueAtTime(0.26, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
        osc.connect(filter); filter.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now); osc.stop(now + 0.40);
      });
    });
  }

  switchToggle(isOn = true) {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isOn ? 520 : 420, now);
      osc.frequency.exponentialRampToValueAtTime(isOn ? 840 : 280, now + 0.09);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.12);
    });
  }

  slap() {
    this._withAudio((now) => {
      const dur = 0.09;
      const { buffer } = this._createNoiseBuffer(dur, 0.35);
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1750, now);
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.45, now);
      nGain.gain.exponentialRampToValueAtTime(0.01, now + dur);
      noise.connect(filter); filter.connect(nGain); nGain.connect(this._getSfxDest());
      noise.start(now);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.09);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.10);
    });
  }

  ping() {
    this._withAudio((now) => {
      [880, 1318.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.055);
        gain.gain.setValueAtTime(0.22, now + i * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.055 + 0.19);
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now + i * 0.055); osc.stop(now + i * 0.055 + 0.20);
      });
    });
  }

  laserZap() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.18);
      gain.gain.setValueAtTime(0.30, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.19);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.20);
    });
  }

  packBonus() {
    this._withAudio((now) => {
      [659.25, 880.0, 1174.66].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.045);
        gain.gain.setValueAtTime(0.20, now + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.18);
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now + i * 0.045); osc.stop(now + i * 0.045 + 0.19);
      });
    });
  }

  alertGuard() {
    this._withAudio((now) => {
      [740, 987.77].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.14, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.09);
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now + i * 0.06); osc.stop(now + i * 0.06 + 0.10);
      });
    });
  }

  // Compatibility aliases so alternative callers never throw
  bounce() { this.trampoline(); }
  glassBreak() { this.glassShatter(); }
  stun() { this.bonk(); }
  breakItem() { this.shatter(); }
}

export const soundManager = new SoundManager();
