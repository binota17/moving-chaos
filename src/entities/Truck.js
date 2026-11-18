// =========================================================================
// MOVING TRUCK ENTITY
// =========================================================================

export class Truck {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.w = data.w;
    this.h = data.h;
    this.bedX = data.bedX;
    this.bedY = data.bedY;
    this.bedW = data.bedW;
    this.bedH = data.bedH;
    this.suspensionBounce = 0;
  }

  update() {
    if (this.suspensionBounce > 0) {
      this.suspensionBounce = Math.max(0, this.suspensionBounce - 0.8);
    }
  }

  deliver(isHeavy = false) {
    this.suspensionBounce = isHeavy ? 20 : 10;
  }
}

