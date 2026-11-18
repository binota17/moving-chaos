// =========================================================================
// CANVAS 2D VECTOR GRAPHICS RENDERER
// =========================================================================
import { CONFIG } from '../config.js';
import { ArcPredictor } from '../physics/ArcPredictor.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.screenShake = 0;
    this.floatingTexts = [];
  }

  shake(amount = 8) {
    this.screenShake = amount;
  }

  addFloatingText(text, x, y, color = '#f5cd79', size = 16, isComic = false) {
    this.floatingTexts.push({ text, x, y, color, size, isComic, vy: -1.8, alpha: 1, life: 55 });
  }

  update(dt) {
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - 0.7);
    }
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy;
      t.life--;
      t.alpha = t.life / 55;
      if (t.life <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  clear() {
    this.floatingTexts = [];
  }

  render(sceneState) {
    const ctx = this.ctx;
    ctx.save();

    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(sx, sy);
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Sky & Backdrop
    this.drawCityBackground();

    // 2. Building & Platforms
    this.drawBuilding(sceneState.platforms, sceneState.landlordRage);

    // 3. Destructible Windows
    this.drawWindows(sceneState.windows);

    // 4. Trampoline & Truck
    this.drawTrampoline(sceneState.trampoline);
    this.drawTruck(sceneState.truck);

    // 5. Furniture Props
    sceneState.items.forEach(it => this.drawProp(it));

    // 6. Players
    sceneState.activePlayers.forEach(p => this.drawPlayer(p));

    // 7. Trajectory Arcs
    if (sceneState.showP1Arc) {
      this.drawTrajectoryArc(sceneState.player1, sceneState.pointerAimActive, sceneState.pointerAim);
    }
    if (sceneState.showP2Arc) {
      this.drawTrajectoryArc(sceneState.player2, false, null);
    }

    // 8. Particles & Floating Texts
    if (sceneState.particleSystem) {
      sceneState.particleSystem.draw(ctx);
    }
    this.drawFloatingTexts();

    ctx.restore();
  }

  drawCityBackground() {
    const ctx = this.ctx;
    const sky = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    sky.addColorStop(0, '#2c3e50');
    sky.addColorStop(0.7, '#34495e');
    sky.addColorStop(1, '#1e272e');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Silhouette buildings
    ctx.fillStyle = '#1a252f';
    for (let i = 0; i < 9; i++) {
      const bx = 30 + i * 115;
      const bw = 85;
      const bh = 140 + ((i * 47) % 180);
      ctx.fillRect(bx, CONFIG.FLOOR_Y - bh, bw, bh);
    }

    // Grass & Driveway
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, CONFIG.FLOOR_Y, this.canvas.width, this.canvas.height - CONFIG.FLOOR_Y);
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(600, CONFIG.FLOOR_Y, this.canvas.width - 600, 16);
  }

  drawBuilding(platforms, landlordRage) {
    const ctx = this.ctx;
    ctx.save();

    ctx.fillStyle = '#dcdde1';
    ctx.fillRect(40, 80, 520, CONFIG.FLOOR_Y - 80);

    platforms.forEach(p => {
      if (p.isFloor) {
        ctx.fillStyle = '#718093';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#e1b12c';
        ctx.fillRect(p.x, p.y, p.w, 4);
      } else if (p.isWall) {
        ctx.fillStyle = '#2f3640';
        ctx.fillRect(p.x, p.y, p.w, p.h);
      }
    });

    // Balcony Railing
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(420, 260); ctx.lineTo(470, 260);
    ctx.moveTo(420, 230); ctx.lineTo(470, 230);
    for (let rx = 425; rx <= 465; rx += 8) {
      ctx.moveTo(rx, 260); ctx.lineTo(rx, 230);
    }
    ctx.stroke();

    // Angry Landlord Head at Top Window
    ctx.save();
    ctx.translate(140, 90);
    ctx.fillStyle = '#2d3436'; ctx.fillRect(-15, -10, 50, 50);
    ctx.fillStyle = '#ffeaa7'; ctx.fillRect(-10, -5, 40, 40);
    ctx.fillStyle = '#f5cd79';
    ctx.beginPath(); ctx.arc(10, 15, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff7675';
    ctx.beginPath();
    ctx.arc(2, 2, 4, 0, Math.PI * 2); ctx.arc(10, 0, 4, 0, Math.PI * 2); ctx.arc(18, 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = landlordRage > 50 ? '#d63031' : '#2d3436';
    ctx.beginPath(); ctx.arc(10, 22, landlordRage > 50 ? 5 : 2, 0, Math.PI); ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  drawWindows(windows) {
    const ctx = this.ctx;
    windows.forEach(win => {
      if (!win.isBroken) {
        ctx.save();
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 3;
        ctx.strokeRect(win.x, win.y, win.w, win.h);

        ctx.fillStyle = CONFIG.COLORS.GLASS;
        ctx.fillRect(win.x, win.y, win.w, win.h);

        // Highlight shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.beginPath();
        ctx.moveTo(win.x + 2, win.y + 10);
        ctx.lineTo(win.x + win.w - 2, win.y + 25);
        ctx.lineTo(win.x + win.w - 2, win.y + 35);
        ctx.lineTo(win.x + 2, win.y + 20);
        ctx.fill();

        if (win.hp === 1) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(win.x + win.w / 2, win.y + win.h / 2);
          ctx.lineTo(win.x + 2, win.y + win.h / 2 - 15);
          ctx.moveTo(win.x + win.w / 2, win.y + win.h / 2);
          ctx.lineTo(win.x + win.w - 2, win.y + win.h / 2 + 20);
          ctx.stroke();
        }
        ctx.restore();
      } else {
        ctx.fillStyle = '#2f3640';
        ctx.fillRect(win.x - 2, win.y, 4, win.h);
      }
    });
  }

  drawTrampoline(t) {
    const ctx = this.ctx;
    ctx.save();
    const bounce = Math.sin(t.springBounce) * 6;

    ctx.strokeStyle = '#718093';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(t.x + 15, t.y + 12); ctx.lineTo(t.x + 8, CONFIG.FLOOR_Y);
    ctx.moveTo(t.x + t.w - 15, t.y + 12); ctx.lineTo(t.x + t.w - 8, CONFIG.FLOOR_Y);
    ctx.stroke();

    ctx.fillStyle = CONFIG.COLORS.TRAMPOLINE;
    ctx.beginPath();
    ctx.roundRect(t.x, t.y + bounce, t.w, 14, 6);
    ctx.fill();

    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(t.x + t.w / 2, t.y + 7 + bounce, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(t.x + t.w / 2, t.y + 7 + bounce, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawTruck(truck) {
    const ctx = this.ctx;
    ctx.save();
    const bounce = Math.sin(truck.suspensionBounce) * 5;
    ctx.translate(truck.x, truck.y + bounce);

    // Wheels
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.arc(40, 150, 22, 0, Math.PI * 2);
    ctx.arc(160, 150, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b2bec3';
    ctx.beginPath();
    ctx.arc(40, 150, 10, 0, Math.PI * 2);
    ctx.arc(160, 150, 10, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = CONFIG.COLORS.TRUCK_BODY;
    ctx.beginPath(); ctx.roundRect(0, 40, 175, 110, 8); ctx.fill();

    // Cargo Bed
    ctx.fillStyle = CONFIG.COLORS.TRUCK_BED;
    ctx.fillRect(8, 48, 155, 95);

    // Tailgate
    ctx.fillStyle = '#7f8c8d';
    ctx.beginPath();
    ctx.moveTo(8, 143); ctx.lineTo(-25, 150); ctx.lineTo(-25, 145); ctx.lineTo(8, 138);
    ctx.fill();

    // Cabin
    ctx.fillStyle = '#f39c12';
    ctx.beginPath(); ctx.roundRect(175, 75, 55, 75, 6); ctx.fill();
    ctx.fillStyle = '#81ecec'; ctx.fillRect(185, 82, 35, 30);
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath(); ctx.arc(228, 130, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12px sans-serif';
    ctx.fillText('🚚 NHANH LÀ ĐƯỢC', 20, 32);
    ctx.restore();
  }

  drawProp(it) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(it.x + it.w / 2, it.y + it.h / 2);
    ctx.rotate(it.rot);

    if (it.isBroken) {
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('💥 VỠ!', -14, 4);
      ctx.restore();
      return;
    }

    switch (it.type) {
      case 'tv':
        ctx.fillStyle = '#2d3436';
        ctx.beginPath(); ctx.roundRect(-it.w / 2, -it.h / 2, it.w, it.h, 4); ctx.fill();
        ctx.fillStyle = '#0984e3';
        ctx.fillRect(-it.w / 2 + 3, -it.h / 2 + 3, it.w - 6, it.h - 6);
        break;
      case 'vase':
        ctx.fillStyle = '#00cec9';
        ctx.beginPath();
        ctx.moveTo(-8, -it.h / 2); ctx.lineTo(-14, it.h / 2); ctx.lineTo(14, it.h / 2); ctx.lineTo(8, -it.h / 2);
        ctx.fill();
        ctx.fillStyle = '#e84393';
        ctx.beginPath(); ctx.arc(0, -it.h / 2, 8, 0, Math.PI * 2); ctx.fill();
        break;
      case 'piano':
        ctx.fillStyle = '#1e272e';
        ctx.beginPath(); ctx.roundRect(-it.w / 2, -it.h / 2, it.w, it.h, 6); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-it.w / 2 + 6, it.h / 2 - 12, it.w - 12, 10);
        ctx.fillStyle = '#2d3436';
        for (let k = 0; k < 6; k++) ctx.fillRect(-it.w / 2 + 10 + k * 8, it.h / 2 - 12, 4, 6);
        break;
      case 'sofa':
        ctx.fillStyle = '#c0392b';
        ctx.beginPath(); ctx.roundRect(-it.w / 2, -it.h / 2, it.w, it.h, 8); ctx.fill();
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.roundRect(-it.w / 2 + 4, -it.h / 2 + 4, it.w - 8, it.h - 12, 4); ctx.fill();
        break;
      case 'fridge':
        ctx.fillStyle = '#ced6e0';
        ctx.beginPath(); ctx.roundRect(-it.w / 2, -it.h / 2, it.w, it.h, 4); ctx.fill();
        ctx.fillStyle = '#747d8c';
        ctx.fillRect(-it.w / 2, 0, it.w, 2);
        ctx.fillRect(it.w / 2 - 6, -15, 3, 10);
        ctx.fillRect(it.w / 2 - 6, 8, 3, 10);
        break;
      case 'aquarium':
        ctx.fillStyle = 'rgba(129, 236, 236, 0.7)';
        ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 2;
        ctx.strokeRect(-it.w / 2, -it.h / 2, it.w, it.h);
        ctx.fillRect(-it.w / 2, -it.h / 2, it.w, it.h);
        ctx.fillStyle = '#e17055';
        ctx.beginPath(); ctx.arc(2, 2, 4, 0, Math.PI * 2); ctx.fill();
        break;
      default:
        ctx.fillStyle = '#d35400';
        ctx.beginPath(); ctx.roundRect(-it.w / 2, -it.h / 2, it.w, it.h, 4); ctx.fill();
        ctx.strokeStyle = '#f39c12'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-it.w / 2, 0); ctx.lineTo(it.w / 2, 0);
        ctx.moveTo(0, -it.h / 2); ctx.lineTo(0, it.h / 2);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }

  drawPlayer(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h);
    ctx.scale(p.facing * p.squashX, p.squashY);

    const walkBob = Math.sin(p.wobble) * 2;
    ctx.translate(0, walkBob);

    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(0, 0, 16, 6, 0, 0, Math.PI * 2); ctx.fill();

    // Boots
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-10, -22, 8, 20);
    ctx.fillRect(2, -22, 8, 20);
    ctx.fillStyle = '#d35400';
    ctx.beginPath();
    ctx.roundRect(-12, -6, 11, 7, 2);
    ctx.roundRect(1, -6, 11, 7, 2);
    ctx.fill();

    // Torso / Suit
    ctx.fillStyle = p.suitColor;
    ctx.beginPath(); ctx.roundRect(-12, -40, 24, 22, 5); ctx.fill();

    // Head
    ctx.fillStyle = '#f5cd79';
    ctx.beginPath(); ctx.arc(0, -48, 11, 0, Math.PI * 2); ctx.fill();

    // Helmet
    ctx.fillStyle = p.hatColor;
    ctx.beginPath();
    ctx.arc(0, -52, 12, Math.PI, 0);
    ctx.lineTo(13, -50); ctx.lineTo(-13, -50);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#2d3436';
    if (p.stunTimer > 0) {
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('x', 0, -45);
    } else {
      ctx.beginPath(); ctx.arc(4, -48, 2, 0, Math.PI * 2); ctx.fill();
      if (p.holdingItem) {
        ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(4, -43, 3, 0, Math.PI); ctx.stroke();
      }
    }

    // Arms
    ctx.fillStyle = '#f5cd79';
    if (p.holdingItem) {
      ctx.fillRect(-14, -62, 6, 26);
      ctx.fillRect(8, -62, 6, 26);
    } else {
      ctx.fillRect(-14, -36, 6, 18);
      ctx.fillRect(8, -36, 6, 18);
    }

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.name.split(' ')[2], 0, -68);

    // Stun rotating stars
    if (p.stunTimer > 0) {
      const t = Date.now() * 0.008;
      for (let s = 0; s < 3; s++) {
        const ang = t + (s * (Math.PI * 2 / 3));
        const sx = Math.cos(ang) * 16;
        const sy = Math.sin(ang) * 6 - 65;
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  drawTrajectoryArc(p, usePointer = false, pointerAim = null) {
    const ctx = this.ctx;
    ctx.save();
    const startX = p.x + p.w / 2;
    const startY = p.y - 14;

    let initVx, initVy;
    if (usePointer && pointerAim && pointerAim.active) {
      const dx = pointerAim.curX - startX;
      const dy = pointerAim.curY - startY;
      const dist = Math.hypot(dx, dy);
      const power = Math.min(1.4, Math.max(0.35, dist / 160));
      const angle = Math.atan2(dy, dx);
      initVx = Math.cos(angle) * (18 * power);
      initVy = Math.sin(angle) * (18 * power);
    } else {
      initVx = p.facing * (10 + p.throwPower * 14);
      initVy = -8 - p.throwPower * 12;
    }

    const points = ArcPredictor.getTrajectoryPoints(startX, startY, initVx, initVy);
    ctx.fillStyle = p.hatColor;

    points.forEach(pt => {
      ctx.globalAlpha = pt.alpha;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  drawFloatingTexts() {
    const ctx = this.ctx;
    this.floatingTexts.forEach(t => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.alpha);
      if (t.isComic) {
        ctx.font = `900 ${t.size}px "Arial Black", Impact, sans-serif`;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(t.text, t.x, t.y);
      } else {
        ctx.font = `800 ${t.size}px "Segoe UI", sans-serif`;
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 5;
      }
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });
  }
}

