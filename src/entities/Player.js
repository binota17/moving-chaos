// =========================================================================
// PLAYER ENTITY (PHYSICS, SQUASH, STUN & CONTROLS)
// =========================================================================
import { CONFIG } from '../config.js';

export class Player {
  constructor(id, name, suitColor, hatColor, startX = 120, startY = 530) {
    this.id = id;
    this.name = name;
    this.suitColor = suitColor;
    this.hatColor = hatColor;

    this.x = startX;
    this.y = startY;
    this.w = 32;
    this.h = 52;
    this.vx = 0;
    this.vy = 0;
    this.speed = CONFIG.PLAYER_SPEED;
    this.facing = 1;
    this.isGrounded = false;

    this.holdingItem = null;
    this.chargingThrow = false;
    this.throwPower = 0;
    this.wobble = 0;

    this.stunTimer = 0;
    this.squashX = 1.0;
    this.squashY = 1.0;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.holdingItem = null;
    this.chargingThrow = false;
    this.throwPower = 0;
    this.wobble = 0;
    this.stunTimer = 0;
    this.squashX = 1.0;
    this.squashY = 1.0;
  }

  jump() {
    if (this.stunTimer > 0) return false;
    if (this.isGrounded) {
      const pwr = (this.holdingItem && this.holdingItem.isSuperHeavy)
        ? CONFIG.JUMP_POWER_HEAVY
        : CONFIG.JUMP_POWER_NORMAL;
      this.vy = pwr;
      this.isGrounded = false;
      return true;
    }
    return false;
  }

  stun(duration = CONFIG.STUN_DURATION) {
    this.stunTimer = duration;
    this.squashY = 0.38;
    this.squashX = 1.45;

    let dropped = null;
    if (this.holdingItem) {
      dropped = this.holdingItem;
      dropped.isHeld = false;
      dropped.heldBy = null;
      dropped.vx = (Math.random() - 0.5) * 4;
      dropped.vy = -3;
      this.holdingItem = null;
    }
    return dropped;
  }

  update(dt, keys, platforms, floorY, boundsX) {
    // Squash spring recovery
    this.squashX += (1.0 - this.squashX) * 0.18;
    this.squashY += (1.0 - this.squashY) * 0.18;

    // Stun status
    if (this.stunTimer > 0) {
      this.stunTimer = Math.max(0, this.stunTimer - dt);
      this.vx = 0;
      this.vy += CONFIG.GRAVITY;
      this.y += this.vy;
      if (this.y + this.h >= floorY) {
        this.y = floorY - this.h;
        this.vy = 0;
        this.isGrounded = true;
      }
      return;
    }

    // Charging throw
    if (this.chargingThrow && this.holdingItem) {
      this.throwPower = Math.min(1.0, this.throwPower + dt * 1.6);
    }

    // Movement inputs
    let moveDir = 0;
    if (keys.left) { moveDir -= 1; this.facing = -1; }
    if (keys.right) { moveDir += 1; this.facing = 1; }

    let currentSpeed = this.speed;
    if (this.holdingItem) {
      if (this.holdingItem.isSuperHeavy) currentSpeed *= 0.55;
      else if (this.holdingItem.isHeavy) currentSpeed *= 0.75;
    }

    this.vx = moveDir * currentSpeed;
    this.vy += CONFIG.GRAVITY;

    if (moveDir !== 0) this.wobble += 0.35;

    // Vertical Integration
    this.y += this.vy;
    this.isGrounded = false;

    // Platform landing
    platforms.forEach(p => {
      if (p.isFloor) {
        if (this.x + this.w > p.x && this.x < p.x + p.w) {
          if (this.vy >= 0 && (this.y + this.h) >= p.y && (this.y + this.h) <= p.y + 16) {
            this.y = p.y - this.h;
            this.vy = 0;
            this.isGrounded = true;
          }
        }
      }
    });

    if (this.y + this.h >= floorY) {
      this.y = floorY - this.h;
      this.vy = 0;
      this.isGrounded = true;
    }

    // Horizontal Integration & Walls
    this.x += this.vx;
    platforms.forEach(p => {
      if (p.isWall) {
        if (this.y + this.h > p.y && this.y < p.y + p.h) {
          if (this.vx > 0 && this.x + this.w >= p.x && this.x < p.x) {
            this.x = p.x - this.w;
          } else if (this.vx < 0 && this.x <= p.x + p.w && this.x + this.w > p.x + p.w) {
            this.x = p.x + p.w;
          }
        }
      }
    });

    // Clamp
    this.x = Math.max(35, Math.min(boundsX - this.w - 10, this.x));
  }
}

