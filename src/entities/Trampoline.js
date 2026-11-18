// =========================================================================
// TRAMPOLINE (BOUNCY SPRING BED) ENTITY
// =========================================================================

export class Trampoline {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.w = data.w;
    this.h = data.h;
    this.springBounce = 0;
  }

  update() {
    if (this.springBounce > 0) {
      this.springBounce = Math.max(0, this.springBounce - 0.8);
    }
  }

  bounce() {
    this.springBounce = 16;
  }
}

