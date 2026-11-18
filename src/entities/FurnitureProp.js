// =========================================================================
// FURNITURE PROP ENTITY
// =========================================================================

export class FurnitureProp {
  constructor(data) {
    this.type = data.type;
    this.name = data.name;
    this.value = data.value;
    this.x = data.x;
    this.y = data.y;

    this.isFragile = !!data.isFragile;
    this.isHeavy = !!data.isHeavy;
    this.isSuperHeavy = !!data.isSuperHeavy;

    this.vx = 0;
    this.vy = 0;
    this.rot = 0;
    this.vrot = 0;
    this.bounces = 0;

    this.isHeld = false;
    this.heldBy = null;
    this.isDelivered = false;
    this.isBroken = false;

    this.initDimensions();
  }

  initDimensions() {
    let w = 34, h = 34;
    switch (this.type) {
      case 'tv': w = 48; h = 32; break;
      case 'sofa': w = 62; h = 34; break;
      case 'fridge': w = 40; h = 58; break;
      case 'piano': w = 64; h = 48; break;
      case 'safe': w = 36; h = 42; break;
      case 'aquarium': w = 42; h = 32; break;
      case 'microwave': w = 36; h = 26; break;
      default: w = 34; h = 34; break;
    }
    this.w = w;
    this.h = h;
  }
}

