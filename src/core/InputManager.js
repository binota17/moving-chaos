// =========================================================================
// UNIFIED INPUT MANAGER (KEYBOARD, MOUSE/POINTER & TOUCH)
// =========================================================================

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keysP1 = { left: false, right: false, up: false, grab: false, throw: false };
    this.keysP2 = { left: false, right: false, up: false, grab: false, throw: false };

    this.pointerAim = {
      active: false,
      startX: 0, startY: 0,
      curX: 0, curY: 0
    };

    this.onP1Grab = null;
    this.onP1Jump = null;
    this.onP1ThrowRelease = null;

    this.onP2Grab = null;
    this.onP2Jump = null;
    this.onP2ThrowRelease = null;

    this.onPointerThrow = null;
    this.onPointerPick = null;

    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      const code = e.code;

      // P1 Controls
      if (code === 'KeyA') this.keysP1.left = true;
      if (code === 'KeyD') this.keysP1.right = true;
      if (code === 'KeyW') {
        if (!this.keysP1.up && this.onP1Jump) this.onP1Jump();
        this.keysP1.up = true;
      }
      if (code === 'KeyE' || code === 'KeyF') {
        if (this.onP1Grab) this.onP1Grab();
      }
      if (code === 'Space' || code === 'KeyJ') {
        this.keysP1.throw = true;
      }

      // P2 Controls
      if (code === 'ArrowLeft') this.keysP2.left = true;
      if (code === 'ArrowRight') this.keysP2.right = true;
      if (code === 'ArrowUp') {
        if (!this.keysP2.up && this.onP2Jump) this.onP2Jump();
        this.keysP2.up = true;
      }
      if (code === 'KeyK' || code === 'Enter') {
        if (this.onP2Grab) this.onP2Grab();
      }
      if (code === 'KeyL' || code === 'ShiftRight') {
        this.keysP2.throw = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;

      // P1 Controls
      if (code === 'KeyA') this.keysP1.left = false;
      if (code === 'KeyD') this.keysP1.right = false;
      if (code === 'KeyW') this.keysP1.up = false;
      if (code === 'Space' || code === 'KeyJ') {
        if (this.keysP1.throw && this.onP1ThrowRelease) this.onP1ThrowRelease();
        this.keysP1.throw = false;
      }

      // P2 Controls
      if (code === 'ArrowLeft') this.keysP2.left = false;
      if (code === 'ArrowRight') this.keysP2.right = false;
      if (code === 'ArrowUp') this.keysP2.up = false;
      if (code === 'KeyL' || code === 'ShiftRight') {
        if (this.keysP2.throw && this.onP2ThrowRelease) this.onP2ThrowRelease();
        this.keysP2.throw = false;
      }
    });

    // Pointer / Mouse events on Canvas
    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', (e) => {
        const pos = this.getCanvasPos(e);
        if (this.onPointerPick) {
          const handled = this.onPointerPick(pos.x, pos.y);
          if (handled) {
            this.pointerAim.active = true;
            this.pointerAim.startX = pos.x;
            this.pointerAim.startY = pos.y;
            this.pointerAim.curX = pos.x;
            this.pointerAim.curY = pos.y;
          }
        }
      });

      window.addEventListener('pointermove', (e) => {
        if (this.pointerAim.active) {
          const pos = this.getCanvasPos(e);
          this.pointerAim.curX = pos.x;
          this.pointerAim.curY = pos.y;
        }
      });

      window.addEventListener('pointerup', (e) => {
        if (this.pointerAim.active) {
          const pos = this.getCanvasPos(e);
          if (this.onPointerThrow) {
            this.onPointerThrow(this.pointerAim.startX, this.pointerAim.startY, pos.x, pos.y);
          }
          this.pointerAim.active = false;
        }
      });
    }
  }

  getCanvasPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    return { x, y };
  }
}

