// =========================================================================
// PARTICLE SYSTEM WITH OBJECT POOLING
// =========================================================================

export class ParticleSystem {
  constructor(maxParticles = 300) {
    this.particles = [];
    this.maxParticles = maxParticles;
  }

  emit(x, y, color, count = 16, spdMult = 1.0, gravity = 0.16) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }
      const ang = Math.random() * Math.PI * 2;
      const spd = (1.2 + Math.random() * 4.5) * spdMult;
      this.particles.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 1.2,
        size: 3 + Math.random() * 5,
        color,
        alpha: 1,
        rot: Math.random() * 6.28,
        vrot: (Math.random() - 0.5) * 0.3,
        gravity
      });
    }
  }

  emitGlassShards(x, y, count = 28) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) this.particles.shift();
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.0 + Math.random() * 5.5;
      this.particles.push({
        x, y,
        vx: Math.cos(ang) * spd + 2.5,
        vy: Math.sin(ang) * spd - 1.5,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.4 ? '#81ecec' : '#ffffff',
        alpha: 1,
        rot: Math.random() * 6.28,
        vrot: (Math.random() - 0.5) * 0.4,
        gravity: 0.25
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rot += p.vrot;
      p.alpha -= 0.018;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
  }

  clear() {
    this.particles = [];
  }
}

