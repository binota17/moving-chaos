// =========================================================================
// PROCEDURAL AUDIO SYNTHESIZER (WEB AUDIO API)
// =========================================================================

export class SoundManager {
  constructor() {
    this.ctx = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.sfxOn = true;
    this.bgmOn = true;
    this.bgmVolume = 0.7;
    this.sfxVolume = 0.85;
    this.bgmTimer = null;
    this.step = 0;
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && !this.bgmGain && typeof this.ctx.createGain === 'function') {
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.bgmGain.gain.value = this.bgmOn ? this.bgmVolume : 0;
        this.sfxGain.gain.value = this.sfxOn ? this.sfxVolume : 0;
        this.bgmGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (_) {}
  }

  _getBgmDest() {
    return this.bgmGain || (this.ctx && this.ctx.destination);
  }

  _getSfxDest() {
    return this.sfxGain || (this.ctx && this.ctx.destination);
  }

  _syncGains() {
    if (this.bgmGain) this.bgmGain.gain.value = this.bgmOn ? this.bgmVolume : 0;
    if (this.sfxGain) this.sfxGain.gain.value = this.sfxOn ? this.sfxVolume : 0;
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
    this._syncGains();
    if (!this.bgmOn) this.stopBGM();
  }

  setSfxEnabled(enabled) {
    this.sfxOn = !!enabled;
    this._syncGains();
  }

  _withAudio(fn) {
    if (!this.sfxOn || this.sfxVolume <= 0.001 || !this.ctx) return;
    try {
      fn(this.ctx.currentTime);
    } catch (_) {}
  }

  _createNoiseBuffer(dur) {
    const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    return { buffer, data, bufferSize };
  }

  toggleSFX() {
    this.sfxOn = !this.sfxOn;
    this._syncGains();
    return this.sfxOn;
  }

  toggleBGM() {
    this.bgmOn = !this.bgmOn;
    this._syncGains();
    if (!this.bgmOn) this.stopBGM();
    else this.startBGM();
    return this.bgmOn;
  }

  startBGM() {
    if (!this.bgmOn || this.bgmVolume <= 0.001 || this.bgmTimer) return;
    this.init();
    if (!this.ctx) return;

    const melody = [261.63, 293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66];
    const bass = [130.81, 164.81, 196.00, 164.81];

    this.bgmTimer = setInterval(() => {
      if (!this.bgmOn || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const dest = this._getBgmDest();

        // Melody
        if (this.step % 2 === 0) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(melody[(this.step / 2) % melody.length], now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.connect(gain); gain.connect(dest);
          osc.start(now); osc.stop(now + 0.17);
        }

        // Bass
        if (this.step % 4 === 0) {
          const bOsc = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          bOsc.type = 'sawtooth';
          bOsc.frequency.setValueAtTime(bass[(this.step / 4) % bass.length], now);
          bGain.gain.setValueAtTime(0.07, now);
          bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          bOsc.connect(bGain); bGain.connect(dest);
          bOsc.start(now); bOsc.stop(now + 0.23);
        }

        this.step++;
      } catch (_) {}
    }, 180);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  jump() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.15);
    });
  }

  grab() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.11);
    });
  }

  throwItem() {
    this._withAudio((now) => {
      const dur = 0.22;
      const { buffer, data, bufferSize } = this._createNoiseBuffer(dur);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass'; filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + dur);
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
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.22);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.25);
    });
  }

  deliver() {
    this._withAudio((now) => {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.25, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now + idx * 0.05); osc.stop(now + idx * 0.05 + 0.21);
      });
    });
  }

  shatter() {
    this._withAudio((now) => {
      const dur = 0.35;
      const { buffer, data, bufferSize } = this._createNoiseBuffer(dur);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = 1300;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
      noise.connect(filter); filter.connect(gain); gain.connect(this._getSfxDest());
      noise.start(now);
    });
  }

  glassShatter() {
    this._withAudio((now) => {
      const dur = 0.45;
      const { buffer, data, bufferSize } = this._createNoiseBuffer(dur);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass'; filter.frequency.setValueAtTime(2800, now);
      filter.Q.value = 3.0;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
      noise.connect(filter); filter.connect(gain); gain.connect(this._getSfxDest());
      noise.start(now);
    });
  }

  bonk() {
    this._withAudio((now) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.22);
    });
  }

  pianoChord() {
    this._withAudio((now) => {
      [261.63, 329.63, 392.00, 523.25].forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now); osc.stop(now + 0.65);
      });
    });
  }

  horn() {
    this._withAudio((now) => {
      [220, 277].forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain); gain.connect(this._getSfxDest());
        osc.start(now); osc.stop(now + 0.42);
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
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);
      osc.connect(gain); gain.connect(this._getSfxDest());
      osc.start(now); osc.stop(now + 0.12);
    });
  }

  // Compatibility aliases so alternative callers never throw
  bounce() { this.trampoline(); }
  glassBreak() { this.glassShatter(); }
  stun() { this.bonk(); }
  breakItem() { this.shatter(); }
}

export const soundManager = new SoundManager();

