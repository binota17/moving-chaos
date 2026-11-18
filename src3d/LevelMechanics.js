// =========================================================================
// DATA-DRIVEN LEVEL MECHANICS (PURE LOGIC — NO THREE.JS DEPENDENCY)
// Switches (plates / levers), gates (doors / bridges), elevators, pits,
// surface zones (slippery / conveyor / wind) and moving hazards (cars / patrols).
// Host / Solo / Local 2P run authoritative simulation; LAN Client mirrors state.
// =========================================================================

const r2 = (n) => Math.round(n * 100) / 100;

export function inRect(r, x, z, pad = 0) {
  return x >= r.minX - pad && x <= r.maxX + pad && z >= r.minZ - pad && z <= r.maxZ + pad;
}

function centerRect(o) {
  return { minX: o.x - o.w / 2, maxX: o.x + o.w / 2, minZ: o.z - o.d / 2, maxZ: o.z + o.d / 2 };
}

function wrapDiff(diff, period) {
  if (!(period > 0)) return diff;
  let d = diff % period;
  if (d > period / 2) d -= period;
  if (d < -period / 2) d += period;
  return d;
}

const CAR_HALF_LEN = 1.35;
const CAR_HALF_WIDTH = 0.8;

export class LevelMechanics {
  constructor(def = {}) {
    this.def = def;
    this.time = 0;

    this.switches = (def.switches || []).map((s) => ({
      id: s.id,
      type: s.type || 'plate',
      style: s.style || null,
      labelKey: s.labelKey || null,
      x: s.x,
      y: s.y || 0,
      z: s.z,
      r: s.r || (s.type === 'lever' ? 0.5 : 0.8),
      holdSeconds: s.holdSeconds || 0,
      cooldownSeconds: s.cooldownSeconds || 0,
      initial: !!s.initial,
      active: !!s.initial,
      timer: 0,
      cooldown: 0,
      pressed: false
    }));
    this.switchById = new Map(this.switches.map((s) => [s.id, s]));

    this.gates = (def.gates || []).map((g) => {
      const gate = {
        kind: 'door',
        y: 0,
        speed: 1.8,
        ...g,
        switchIds: g.switchIds || (g.switchId ? [g.switchId] : []),
        progress: 0
      };
      gate.progress = this.isGateOpen(gate) ? 1 : 0;
      return gate;
    });

    this.zones = (def.zones || []).map((z) => ({ y: 0, ...z }));
    this.pits = (def.pits || []).map((p) => ({ ...p }));

    this.elevators = (def.elevators || []).map((e) => {
      const el = { yMin: 0, yMax: 2.4, speed: 1.2, pauseSec: 1.5, offset: 0, ...e };
      const travel = Math.max(0.1, (el.yMax - el.yMin) / el.speed);
      el._travel = travel;
      el._period = travel * 2 + el.pauseSec * 2;
      el.phase = el.offset || 0;
      el.y = el.yMin;
      return el;
    });

    this.hazards = (def.hazards || []).map((h) => {
      const hz = { speed: 2, offset: 0, radius: 0.62, ...h };
      hz.phase = hz.offset || 0;
      hz.x = 0;
      hz.z = 0;
      hz.rotY = 0;
      hz.hornCd = 0;
      hz.stopped = false;
      hz.stunTimer = 0;
      if (hz.type === 'car') {
        hz._period = Math.max(1, hz.to - hz.from);
      } else {
        const pts = hz.points || [[0, 0], [1, 0]];
        const segs = [];
        const count = hz.loop ? pts.length : pts.length - 1;
        for (let i = 0; i < count; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % pts.length];
          segs.push({ a, b, len: Math.max(0.001, Math.hypot(b[0] - a[0], b[1] - a[1])) });
        }
        hz._segs = segs;
        const pathLen = segs.reduce((s, seg) => s + seg.len, 0);
        hz._pathLen = pathLen;
        hz._period = hz.loop ? pathLen : pathLen * 2;
      }
      return hz;
    });

    this._computeElevators();
    this._computeHazards();
  }

  // ---------------------------------------------------------------------
  // Switch / Gate state
  // ---------------------------------------------------------------------
  isSwitchActive(id) {
    const s = this.switchById.get(id);
    return !!(s && s.active);
  }

  isGateOpen(g) {
    const any = g.switchIds.some((id) => this.isSwitchActive(id));
    return g.invert ? !any : any;
  }

  _plateOccupied(s, players, items) {
    const near = (e, pad) => Math.hypot(e.x - s.x, e.z - s.z) < s.r + pad && Math.abs(e.y - s.y) < 0.6;
    for (const p of players) {
      if (p && near(p, 0.2)) return true;
    }
    for (const it of items) {
      if (it && !it.isHeld && !it.isDelivered && !it.isBroken && near(it, 0.15)) return true;
    }
    return false;
  }

  findLeverNear(x, y, z, maxDist = 1.4) {
    let best = null;
    for (const s of this.switches) {
      if (s.type !== 'lever') continue;
      if (Math.abs(y - s.y) > 1.0) continue;
      const dist = Math.hypot(x - s.x, z - s.z);
      if (dist <= maxDist && (!best || dist < best.dist)) best = { sw: s, dist };
    }
    return best;
  }

  /** Returns true when the lever actually toggled (false while cooling down). */
  toggleLever(id) {
    const s = this.switchById.get(id);
    if (!s || s.type !== 'lever' || s.cooldown > 0) return false;
    s.active = !s.active;
    if (s.holdSeconds > 0) {
      if (s.active !== s.initial) {
        s.timer = s.holdSeconds;
      } else {
        s.timer = 0;
        s.cooldown = s.cooldownSeconds;
      }
    } else {
      s.cooldown = Math.max(s.cooldownSeconds, 0.35);
    }
    return true;
  }

  // ---------------------------------------------------------------------
  // Simulation tick
  // ---------------------------------------------------------------------
  update(dt, ctx = {}) {
    const { authoritative = true, players = [], items = [] } = ctx;
    const changed = [];
    this.time += dt;

    for (const s of this.switches) {
      if (s.cooldown > 0) s.cooldown = Math.max(0, s.cooldown - dt);
      if (!authoritative) continue;
      const prev = s.active;
      if (s.type === 'plate') {
        s.pressed = this._plateOccupied(s, players, items);
        if (s.pressed) {
          s.active = true;
          s.timer = s.holdSeconds;
        } else if (s.timer > 0) {
          s.timer -= dt;
          s.active = s.timer > 0;
        } else {
          s.active = false;
        }
      } else if (s.type === 'lever' && s.holdSeconds > 0 && s.active !== s.initial) {
        s.timer -= dt;
        if (s.timer <= 0) {
          s.timer = 0;
          s.active = s.initial;
          s.cooldown = s.cooldownSeconds;
        }
      }
      if (prev !== s.active) changed.push(s);
    }

    for (const g of this.gates) {
      const target = this.isGateOpen(g) ? 1 : 0;
      const step = dt * g.speed;
      g.progress = target > g.progress ? Math.min(target, g.progress + step) : Math.max(target, g.progress - step);
    }

    for (const e of this.elevators) e.phase = (e.phase + dt) % e._period;
    this._computeElevators();

    for (const h of this.hazards) {
      if (h.stunTimer > 0) h.stunTimer = Math.max(0, h.stunTimer - dt);
      h.stopped = !!(h.stopSwitchId && this.isSwitchActive(h.stopSwitchId));
      if (!h.stopped && !(h.stunTimer > 0)) h.phase = (h.phase + h.speed * dt) % h._period;
      if (h.hornCd > 0) h.hornCd -= dt;
    }
    this._computeHazards();

    return changed;
  }

  _computeElevators() {
    for (const e of this.elevators) {
      const p = ((e.phase % e._period) + e._period) % e._period;
      const span = e.yMax - e.yMin;
      const smooth = (t) => t * t * (3 - 2 * t);
      if (p < e.pauseSec) {
        e.y = e.yMin;
      } else if (p < e.pauseSec + e._travel) {
        e.y = e.yMin + span * smooth((p - e.pauseSec) / e._travel);
      } else if (p < e.pauseSec * 2 + e._travel) {
        e.y = e.yMax;
      } else {
        e.y = e.yMax - span * smooth((p - e.pauseSec * 2 - e._travel) / e._travel);
      }
    }
  }

  _computeHazards() {
    for (const h of this.hazards) {
      const s = ((h.phase % h._period) + h._period) % h._period;
      if (h.type === 'car') {
        const along = h.dir >= 0 ? h.from + s : h.to - s;
        if (h.axis === 'x') {
          h.x = along;
          h.z = h.lane;
          h.rotY = h.dir >= 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
          h.x = h.lane;
          h.z = along;
          h.rotY = h.dir >= 0 ? 0 : Math.PI;
        }
        continue;
      }

      // Polyline patrol (loop or ping-pong)
      let dist = s;
      let forward = true;
      if (!h.loop && dist > h._pathLen) {
        dist = h._period - dist;
        forward = false;
      }
      let acc = 0;
      for (const seg of h._segs) {
        if (dist <= acc + seg.len || seg === h._segs[h._segs.length - 1]) {
          const t = Math.max(0, Math.min(1, (dist - acc) / seg.len));
          h.x = seg.a[0] + (seg.b[0] - seg.a[0]) * t;
          h.z = seg.a[1] + (seg.b[1] - seg.a[1]) * t;
          const dx = (seg.b[0] - seg.a[0]) * (forward ? 1 : -1);
          const dz = (seg.b[1] - seg.a[1]) * (forward ? 1 : -1);
          h.rotY = Math.atan2(dx, dz);
          break;
        }
        acc += seg.len;
      }
    }
  }

  // ---------------------------------------------------------------------
  // Physics queries
  // ---------------------------------------------------------------------
  /** Base ground height (pits drop the ground to -3m). */
  groundBaseAt(x, z) {
    for (const p of this.pits) {
      if (inRect(p, x, z)) return -3.0;
    }
    return 0;
  }

  isOverPit(x, z) {
    return this.groundBaseAt(x, z) < -1;
  }

  /** Extra dynamic floors (elevators, lowered bridges). Returns -Infinity when none. */
  extraFloorAt(x, z, curY) {
    let best = -Infinity;
    for (const e of this.elevators) {
      if (inRect(centerRect(e), x, z) && curY >= e.y - 0.6) best = Math.max(best, e.y);
    }
    for (const g of this.gates) {
      if (g.kind !== 'bridge' || g.progress < 0.85) continue;
      if (inRect(centerRect(g), x, z) && curY >= g.y - 0.6) best = Math.max(best, g.y);
    }
    return best;
  }

  /** Solid blockers: closed doors & stopped cars. (Never carries an `id`, so it is not treated as glass.) */
  getObstacles() {
    const list = [];
    for (const g of this.gates) {
      if (g.kind === 'door' && g.progress < 0.7) {
        list.push({ x: g.x, y: g.y + g.h / 2, z: g.z, w: g.w, h: g.h, d: g.d });
      }
    }
    for (const h of this.hazards) {
      if (h.type === 'car' && h.stopped) {
        const alongZ = h.axis !== 'x';
        list.push({
          x: h.x, y: 0.7, z: h.z, h: 1.4,
          w: alongZ ? CAR_HALF_WIDTH * 2 : CAR_HALF_LEN * 2,
          d: alongZ ? CAR_HALF_LEN * 2 : CAR_HALF_WIDTH * 2
        });
      }
    }
    return list;
  }

  conveyorVelocity(zone) {
    let vx = zone.vx || 0;
    let vz = zone.vz || 0;
    if (zone.switchId && this.isSwitchActive(zone.switchId)) {
      if (zone.flipWhenActive) { vx = -vx; vz = -vz; }
      if (zone.stopWhenActive) { vx = 0; vz = 0; }
    }
    return { vx, vz };
  }

  isWindActive(zone) {
    if (zone.switchId && this.isSwitchActive(zone.switchId)) return !zone.offWhenActive;
    return !!zone.offWhenActive || !zone.switchId;
  }

  /** Ground surface effects for an entity standing at height y. */
  surfaceAt(x, z, y) {
    const out = { slippery: false, convX: 0, convZ: 0 };
    let conveyorFound = false;
    for (const zone of this.zones) {
      if (zone.type !== 'slippery' && zone.type !== 'conveyor') continue;
      if (!inRect(zone, x, z) || Math.abs(y - zone.y) > 0.45) continue;
      if (zone.type === 'slippery') out.slippery = true;
      if (zone.type === 'conveyor' && !conveyorFound) {
        const v = this.conveyorVelocity(zone);
        out.convX = v.vx;
        out.convZ = v.vz;
        conveyorFound = true;
      }
    }
    return out;
  }

  windAt(x, z, y) {
    let fx = 0;
    let fz = 0;
    for (const zone of this.zones) {
      if (zone.type !== 'wind' || !inRect(zone, x, z)) continue;
      if (y < (zone.yMin ?? -5) || y > (zone.yMax ?? 8)) continue;
      if (!this.isWindActive(zone)) continue;
      fx += zone.fx || 0;
      fz += zone.fz || 0;
    }
    return { fx, fz };
  }

  /** Returns the moving hazard overlapping the entity (stopped cars never hit; carsOnly skips NPC patrollers). */
  hazardHitting(entity, radius = 0.4, { carsOnly = false } = {}) {
    for (const h of this.hazards) {
      if (carsOnly && h.type !== 'car') continue;
      if (h.type === 'car') {
        if (h.stopped || entity.y > 1.5) continue;
        const alongZ = h.axis !== 'x';
        const halfX = (alongZ ? CAR_HALF_WIDTH : CAR_HALF_LEN) + radius;
        const halfZ = (alongZ ? CAR_HALF_LEN : CAR_HALF_WIDTH) + radius;
        if (Math.abs(entity.x - h.x) < halfX && Math.abs(entity.z - h.z) < halfZ) return h;
      } else {
        if (h.stopped || h.stunTimer > 0 || entity.y > 1.6) continue;
        if (Math.hypot(entity.x - h.x, entity.z - h.z) < h.radius + radius) return h;
      }
    }
    return null;
  }

  /** Temporarily stuns a nearby patrolling NPC/robot when slapped or dashed into. */
  stunPatrolNear(x, y, z, maxDist = 1.35, duration = 2.0) {
    if (y > 1.8) return null;
    let best = null;
    let bestDist = maxDist;
    for (const h of this.hazards) {
      if (h.type === 'car' || h.stunTimer > 0) continue;
      const d = Math.hypot(x - h.x, z - h.z);
      if (d <= bestDist) {
        bestDist = d;
        best = h;
      }
    }
    if (best) best.stunTimer = duration;
    return best;
  }

  // ---------------------------------------------------------------------
  // LAN Sync
  // ---------------------------------------------------------------------
  serialize() {
    return {
      s: this.switches.map((s) => (s.active ? 1 : 0)),
      e: this.elevators.map((e) => r2(e.phase)),
      h: this.hazards.map((h) => r2(h.phase)),
      st: this.hazards.map((h) => (h.stunTimer > 0 ? r2(h.stunTimer) : 0))
    };
  }

  /** Applies a host snapshot; returns switches whose state flipped (for client-side feedback). */
  applyState(st) {
    const changed = [];
    if (!st) return changed;
    if (Array.isArray(st.s)) {
      st.s.forEach((v, i) => {
        const s = this.switches[i];
        if (!s) return;
        const next = !!v;
        if (s.active !== next) {
          s.active = next;
          changed.push(s);
        }
      });
    }
    const blend = (obj, target) => {
      if (!Number.isFinite(target)) return;
      const diff = wrapDiff(target - obj.phase, obj._period);
      if (Math.abs(diff) > obj._period * 0.25) obj.phase = target;
      else obj.phase = (obj.phase + diff * 0.5 + obj._period) % obj._period;
    };
    if (Array.isArray(st.e)) st.e.forEach((v, i) => this.elevators[i] && blend(this.elevators[i], v));
    if (Array.isArray(st.h)) st.h.forEach((v, i) => this.hazards[i] && blend(this.hazards[i], v));
    if (Array.isArray(st.st)) st.st.forEach((v, i) => { if (this.hazards[i] && Number.isFinite(v)) this.hazards[i].stunTimer = v; });
    this._computeElevators();
    this._computeHazards();
    return changed;
  }
}

// ---------------------------------------------------------------------
// Truck helpers (supports trucks rotated in 90° steps)
// ---------------------------------------------------------------------
export function truckLocalToWorld(tk, lx, lz) {
  const rot = tk.rotY || 0;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  return { x: tk.x + lx * c + lz * s, z: tk.z - lx * s + lz * c };
}

export function truckWorldToLocal(tk, x, z) {
  const rot = tk.rotY || 0;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const dx = x - tk.x;
  const dz = z - tk.z;
  return { lx: dx * c - dz * s, lz: dx * s + dz * c };
}

export function isInsideTruckBed(tk, x, z) {
  const { lx, lz } = truckWorldToLocal(tk, x, z);
  return Math.abs(lx) < (tk.bedW || 4.2) / 2 && Math.abs(lz) < (tk.bedD || 4.6) / 2;
}

/** Axis-aligned obstacle box defined in truck-local space. */
export function truckBox(tk, lx, lz, w, d, y, h) {
  const p = truckLocalToWorld(tk, lx, lz);
  const swap = Math.abs(Math.sin(tk.rotY || 0)) > 0.5;
  return { x: p.x, y, z: p.z, w: swap ? d : w, h, d: swap ? w : d };
}

