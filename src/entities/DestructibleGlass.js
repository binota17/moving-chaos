// =========================================================================
// DESTRUCTIBLE GLASS WINDOW ENTITY
// =========================================================================

export class DestructibleGlass {
  constructor(data) {
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.w = data.w || 14;
    this.h = data.h || 100;
    this.hp = data.hp || 2;
    this.maxHp = data.maxHp || 2;
    this.isBroken = !!data.isBroken;
  }

  hit(damage = 1) {
    if (this.isBroken) return false;
    this.hp -= damage;
    if (this.hp <= 0) {
      this.isBroken = true;
      return true; // shattered
    }
    return false; // cracked
  }
}

