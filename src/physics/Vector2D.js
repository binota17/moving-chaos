// =========================================================================
// 2D VECTOR MATH LIBRARY
// =========================================================================

export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mult(n) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  mag() {
    return Math.hypot(this.x, this.y);
  }

  magSq() {
    return this.x * this.x + this.y * this.y;
  }

  heading() {
    return Math.atan2(this.y, this.x);
  }

  normalize() {
    const m = this.mag();
    if (m !== 0) this.mult(1 / m);
    return this;
  }

  dist(v) {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
}

