// =========================================================================
// WEB GAMEPAD API MANAGER (XBOX / DUALSENSE / STANDARD + HAPTIC RUMBLE)
// =========================================================================

export class GamepadManager {
  constructor(onConnectionChange = null) {
    this.onConnectionChange = onConnectionChange;
    this.rumbleEnabled = true;
    this.connectedCount = 0;
    this.prevSlots = [this._emptyPrev(), this._emptyPrev(), this._emptyPrev(), this._emptyPrev()];
    this._bindEvents();
  }

  _emptyPrev() {
    return {
      jump: false,
      grab: false,
      throwHeld: false,
      dash: false,
      pause: false,
      camLeft: false,
      camRight: false
    };
  }

  _bindEvents() {
    if (typeof window === 'undefined') return;
    window.addEventListener('gamepadconnected', (e) => {
      this._refreshCount();
      if (this.onConnectionChange) {
        this.onConnectionChange(true, (e.gamepad?.index ?? 0) + 1, this.connectedCount);
      }
    });
    window.addEventListener('gamepaddisconnected', (e) => {
      const idx = e.gamepad?.index ?? 0;
      if (idx >= 0 && idx < this.prevSlots.length) {
        this.prevSlots[idx] = this._emptyPrev();
      }
      this._refreshCount();
      if (this.onConnectionChange) {
        this.onConnectionChange(false, idx + 1, this.connectedCount);
      }
    });
  }

  _getActivePads() {
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
      return [];
    }
    const raw = navigator.getGamepads() || [];
    const active = [];
    for (let i = 0; i < raw.length; i++) {
      const gp = raw[i];
      if (gp && gp.connected) active.push(gp);
    }
    return active;
  }

  _refreshCount() {
    const count = this._getActivePads().length;
    this.connectedCount = count;
    return count;
  }

  _btnDown(gp, idx, threshold = 0.55) {
    const b = gp.buttons?.[idx];
    if (!b) return false;
    return Boolean(b.pressed || b.value >= threshold);
  }

  /**
   * Reads live movement & edge-triggered actions for up to 4 controller slots (P1..P4).
   */
  poll() {
    const pads = this._getActivePads();
    this.connectedCount = pads.length;

    const results = [null, null, null, null];
    for (let slot = 0; slot < 4; slot++) {
      const gp = pads[slot];
      if (!gp) {
        this.prevSlots[slot] = this._emptyPrev();
        continue;
      }

      const prev = this.prevSlots[slot];

      // Left analog stick with radial deadzone + D-Pad directional fallback
      const rawX = gp.axes?.[0] ?? 0;
      const rawY = gp.axes?.[1] ?? 0;
      const mag = Math.hypot(rawX, rawY);
      const deadzone = 0.18;
      let moveX = 0;
      let moveY = 0;
      if (mag > deadzone) {
        const scaled = Math.min(1, (mag - deadzone) / (1 - deadzone));
        moveX = (rawX / mag) * scaled;
        moveY = -(rawY / mag) * scaled; // Push stick UP (-1 axis) -> +camFwdXZ
      }
      if (this._btnDown(gp, 12)) moveY = 1;  // D-Pad Up
      if (this._btnDown(gp, 13)) moveY = -1; // D-Pad Down
      if (this._btnDown(gp, 14)) moveX = -1; // D-Pad Left
      if (this._btnDown(gp, 15)) moveX = 1;  // D-Pad Right

      const sprint = this._btnDown(gp, 3) || this._btnDown(gp, 10); // Y / L3
      const jumpNow = this._btnDown(gp, 0); // A / Cross
      const grabNow = this._btnDown(gp, 2) || this._btnDown(gp, 4) || this._btnDown(gp, 6); // X / LB / LT
      const throwNow = this._btnDown(gp, 1) || this._btnDown(gp, 5) || this._btnDown(gp, 7); // B / RB / RT
      const dashNow = this._btnDown(gp, 10); // L3 click (plus empty-handed B handled in Game3DApp)
      const pauseNow = this._btnDown(gp, 9); // Start / Options

      // Right Stick horizontal flick orbits isometric camera
      const rsX = gp.axes?.[2] ?? 0;
      const camLeftNow = rsX < -0.72;
      const camRightNow = rsX > 0.72;

      const state = {
        connected: true,
        moveX: Math.max(-1, Math.min(1, moveX)),
        moveY: Math.max(-1, Math.min(1, moveY)),
        sprint,
        justJump: jumpNow && !prev.jump,
        justGrab: grabNow && !prev.grab,
        throwDown: throwNow,
        justThrowStart: throwNow && !prev.throwHeld,
        justThrowRelease: !throwNow && prev.throwHeld,
        justDash: dashNow && !prev.dash,
        justPause: pauseNow && !prev.pause,
        camRotateDir: (camLeftNow && !prev.camLeft) ? -1 : ((camRightNow && !prev.camRight) ? 1 : 0)
      };

      prev.jump = jumpNow;
      prev.grab = grabNow;
      prev.throwHeld = throwNow;
      prev.dash = dashNow;
      prev.pause = pauseNow;
      prev.camLeft = camLeftNow;
      prev.camRight = camRightNow;

      results[slot] = state;
    }

    return { connectedCount: this.connectedCount, slots: results };
  }

  /**
   * Triggers gentle controller vibration if supported and enabled in settings.
   */
  rumble(slot = 0, intensity = 0.45, durationMs = 110) {
    if (!this.rumbleEnabled) return;
    const pads = this._getActivePads();
    const gp = pads[slot];
    if (!gp || !gp.vibrationActuator || typeof gp.vibrationActuator.playEffect !== 'function') return;
    try {
      gp.vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: durationMs,
        weakMagnitude: Math.min(1, intensity * 0.65),
        strongMagnitude: Math.min(1, intensity)
      }).catch(() => {});
    } catch (_) {}
  }
}

