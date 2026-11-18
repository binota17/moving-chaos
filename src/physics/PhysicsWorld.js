// =========================================================================
// 2D PHYSICS WORLD & INTERACTION ENGINE
// =========================================================================
import { CONFIG } from '../config.js';
import { Collision2D } from './Collision2D.js';
import { eventBus } from '../core/EventBus.js';
import { soundManager } from '../core/SoundManager.js';

export class PhysicsWorld {
  constructor() {
    this.gravity = CONFIG.GRAVITY;
    this.floorY = CONFIG.FLOOR_Y;
  }

  update(dt, players, items, windows, platforms, trampoline, truck) {
    trampoline.update();
    truck.update();

    // Update each active item
    items.forEach(it => {
      if (it.isDelivered || it.isBroken) return;

      if (it.isHeld && it.heldBy) {
        const h = it.heldBy;
        it.x = h.x + h.w / 2 - it.w / 2;
        it.y = h.y - it.h - 4 + Math.sin(h.wobble) * 2;
        it.rot = Math.sin(h.wobble) * 0.08;
        return;
      }

      // Gravity & Integration
      it.vy += this.gravity * (it.isSuperHeavy ? 1.25 : 1.0);
      it.x += it.vx;
      it.y += it.vy;
      it.rot += it.vrot;

      // 1. Collisions with Destructible Windows
      windows.forEach(win => {
        if (!win.isBroken) {
          if (Collision2D.aabb(it, win)) {
            const impact = Math.hypot(it.vx, it.vy);
            if (impact > 3.2 || it.isHeavy || it.isSuperHeavy) {
              win.isBroken = true;
              it.vx *= 0.85;
              soundManager.glassShatter();
              eventBus.emit('glassBreak', { window: win });
            } else {
              it.vx = -it.vx * 0.4;
              if (win.hit(1)) {
                soundManager.glassShatter();
                eventBus.emit('glassBreak', { window: win });
              }
            }
          }
        }
      });

      // 2. Collisions with Floor Platforms inside building
      platforms.forEach(p => {
        if (p.isFloor) {
          if (it.x + it.w > p.x && it.x < p.x + p.w) {
            if (it.vy > 0 && (it.y + it.h) >= p.y && (it.y + it.h) <= p.y + 18) {
              it.y = p.y - it.h;
              it.vy = -it.vy * 0.25;
              it.vx *= 0.75;
              it.vrot *= 0.5;
            }
          }
        }
      });

      // 3. Head Bonk & Stun on Players
      if (it.vy > 4.0 || Math.abs(it.vx) > 5.0) {
        players.forEach(p => {
          if (Collision2D.aabb(it, { x: p.x, y: p.y, w: p.w, h: p.h * 0.6 })) {
            const dropped = p.stun(CONFIG.STUN_DURATION);
            it.vy = -4.5;
            it.vx = (Math.random() - 0.5) * 3;
            soundManager.bonk();
            eventBus.emit('playerStun', { player: p, item: it, dropped });
          }
        });
      }

      // 4. Trampoline Ricochet
      if (it.x + it.w > trampoline.x && it.x < trampoline.x + trampoline.w) {
        if (it.y + it.h >= trampoline.y && it.y + it.h <= trampoline.y + trampoline.h + 10) {
          if (it.vy > 0) {
            trampoline.bounce();
            soundManager.trampoline();
            it.bounces++;
            it.vy = -12.5;
            it.vx = 4.8;
            it.vrot = 0.2;
            eventBus.emit('trampolineBounce', { item: it, trampoline });
          }
        }
      }

      // 5. Truck Delivery
      if (it.x + it.w / 2 >= truck.bedX && it.x + it.w / 2 <= truck.bedX + truck.bedW) {
        if (it.y + it.h >= truck.bedY && it.y <= truck.bedY + truck.bedH) {
          it.isDelivered = true;
          it.vx = 0;
          it.vy = 0;
          truck.deliver(it.isSuperHeavy || it.isHeavy);

          if (it.type === 'piano') soundManager.pianoChord();
          else soundManager.deliver();

          eventBus.emit('itemDeliver', { item: it });
        }
      }

      // 6. Ground Hit
      if (it.y + it.h >= this.floorY) {
        it.y = this.floorY - it.h;

        if (it.isFragile && Math.abs(it.vy) > 3.0) {
          it.isBroken = true;
          soundManager.shatter();
          eventBus.emit('itemBreak', { item: it });
        } else {
          it.vy = -it.vy * 0.35;
          it.vx *= 0.65;
          it.vrot *= 0.5;
        }
      }

      // Right boundary
      if (it.x + it.w > CONFIG.CANVAS_WIDTH) {
        it.x = CONFIG.CANVAS_WIDTH - it.w;
        it.vx = -it.vx * 0.5;
      }
    });
  }
}

