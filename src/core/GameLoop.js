// =========================================================================
// ACCURATE TIMESTEP GAME LOOP
// =========================================================================

export class GameLoop {
  constructor(updateFn, renderFn) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    this.isRunning = false;
    this.lastTime = 0;
    this.rafId = null;
    this.maxDelta = 0.1; // clamp delta to 100ms to prevent spiral of death
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    let dt = (currentTime - this.lastTime) / 1000;
    if (dt > this.maxDelta) dt = this.maxDelta;
    this.lastTime = currentTime;

    this.updateFn(dt);
    this.renderFn();

    this.rafId = requestAnimationFrame(this.loop);
  }
}

