// =========================================================================
// 3D VISUALS FOR LEVEL MECHANICS
// Pits, oil slicks, conveyor belts, industrial fans, plates, levers / traffic
// lights, rolling shutters, retractable bridges, elevators, cars & patrollers.
// =========================================================================
import * as THREE from 'three';

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.05, ...opts });
}

function shadowed(obj) {
  obj.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return obj;
}

function makeArrowGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.32);
  shape.lineTo(0.28, -0.12);
  shape.lineTo(0.1, -0.12);
  shape.lineTo(0.1, -0.3);
  shape.lineTo(-0.1, -0.3);
  shape.lineTo(-0.1, -0.12);
  shape.lineTo(-0.28, -0.12);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

function buildCar(color) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.62, 2.6), mat(color, { roughness: 0.35, metalness: 0.25 }));
  body.position.y = 0.55;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.52, 1.3), mat(0x93c5fd, { roughness: 0.1, metalness: 0.3 }));
  cabin.position.set(0, 1.1, -0.15);
  g.add(body, cabin);
  const tireMat = mat(0x111827, { roughness: 0.9 });
  [[-0.72, 0.85], [0.72, 0.85], [-0.72, -0.85], [0.72, -0.85]].forEach(([x, z]) => {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.24, 12), tireMat);
    t.rotation.z = Math.PI / 2;
    t.position.set(x, 0.3, z);
    g.add(t);
  });
  const headMat = new THREE.MeshBasicMaterial({ color: 0xfef9c3 });
  [-0.48, 0.48].forEach((x) => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.06), headMat);
    hl.position.set(x, 0.62, 1.31);
    g.add(hl);
  });
  const brakeMat = new THREE.MeshBasicMaterial({ color: 0x7f1d1d });
  [-0.5, 0.5].forEach((x) => {
    const bl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.06), brakeMat);
    bl.position.set(x, 0.62, -1.31);
    g.add(bl);
  });
  g.userData.brakeMat = brakeMat;
  return shadowed(g);
}

function buildPatroller(kind) {
  const g = new THREE.Group();
  if (kind === 'ghost') {
    const ghostMat = mat(0xf8fafc, { transparent: true, opacity: 0.78, emissive: 0xc4b5fd, emissiveIntensity: 0.45 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 14), ghostMat);
    head.position.y = 1.15;
    const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.9, 18, 1, true), ghostMat);
    skirt.position.y = 0.62;
    skirt.rotation.x = Math.PI;
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
    [-0.17, 0.17].forEach((x) => {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
      e.position.set(x, 1.22, 0.44);
      g.add(e);
    });
    g.add(head, skirt);
    g.userData.bob = true;
  } else if (kind === 'robot') {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.58, 0.26, 20), mat(0x475569, { metalness: 0.4, roughness: 0.35 }));
    base.position.y = 0.16;
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
    light.position.set(0, 0.32, 0.35);
    g.add(base, light);
  } else if (kind === 'cart') {
    const cart = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 1.1), mat(0xcbd5e1, { metalness: 0.6, roughness: 0.3 }));
    cart.position.y = 0.62;
    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.05, 1.15), mat(0xf97316));
    tray.position.y = 1.0;
    g.add(cart, tray);
    [[-0.38, 0.45], [0.38, 0.45], [-0.38, -0.45], [0.38, -0.45]].forEach(([x, z]) => {
      const w = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), mat(0x111827));
      w.position.set(x, 0.12, z);
      g.add(w);
    });
  } else {
    // Chef
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 1.0, 16), mat(0xf8fafc));
    body.position.y = 0.6;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 14, 12), mat(0xfcd5b5));
    head.position.y = 1.36;
    const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.4, 14), mat(0xffffff));
    hat.position.y = 1.78;
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 14), mat(0x1f2937, { metalness: 0.6 }));
    pan.position.set(0.42, 0.95, 0.25);
    g.add(body, head, hat, pan);
  }
  return shadowed(g);
}

export function buildMechanicsVisuals(mech, group) {
  const refs = { switches: [], gates: [], elevators: [], hazards: [], conveyors: [], fans: [] };
  const arrowGeo = makeArrowGeometry();

  // --- Pits (dark void + caution border) ---
  const cautionMat = mat(0xfacc15, { roughness: 0.5 });
  mech.pits.forEach((p) => {
    const w = p.maxX - p.minX;
    const d = p.maxZ - p.minZ;
    const cx = (p.minX + p.maxX) / 2;
    const cz = (p.minZ + p.maxZ) / 2;
    const hole = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), new THREE.MeshBasicMaterial({ color: 0x040507 }));
    hole.position.set(cx, 0.14, cz);
    group.add(hole);
    [
      [cx, p.minZ, w + 0.2, 0.16], [cx, p.maxZ, w + 0.2, 0.16],
      [p.minX, cz, 0.16, d + 0.2], [p.maxX, cz, 0.16, d + 0.2]
    ].forEach(([x, z, bw, bd]) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.06, bd), cautionMat);
      b.position.set(x, 0.16, z);
      group.add(b);
    });
  });

  // --- Surface zones ---
  mech.zones.forEach((zone) => {
    const w = zone.maxX - zone.minX;
    const d = zone.maxZ - zone.minZ;
    const cx = (zone.minX + zone.maxX) / 2;
    const cz = (zone.minZ + zone.maxZ) / 2;
    const baseY = zone.y || 0;

    if (zone.type === 'slippery') {
      const slick = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.02, d),
        mat(0xd9a404, { transparent: true, opacity: 0.55, roughness: 0.05, metalness: 0.6, emissive: 0x854d0e, emissiveIntensity: 0.25 })
      );
      slick.position.set(cx, baseY + 0.13, cz);
      slick.receiveShadow = true;
      group.add(slick);
    } else if (zone.type === 'conveyor') {
      const belt = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), mat(0x1f2937, { roughness: 0.85 }));
      belt.position.set(cx, baseY + 0.1, cz);
      belt.receiveShadow = true;
      group.add(belt);
      const railMat = mat(0x64748b, { metalness: 0.5 });
      const alongX = w >= d;
      [-1, 1].forEach((side) => {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(alongX ? w : 0.12, 0.18, alongX ? 0.12 : d),
          railMat
        );
        rail.position.set(alongX ? cx : cx + side * (w / 2), baseY + 0.14, alongX ? cz + side * (d / 2) : cz);
        group.add(rail);
      });
      const arrowMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide });
      const len = alongX ? w : d;
      const count = Math.max(2, Math.floor(len / 1.4));
      const arrows = [];
      for (let i = 0; i < count; i++) {
        const a = new THREE.Mesh(arrowGeo, arrowMat);
        a.rotation.x = -Math.PI / 2;
        a.userData.sharedGeometry = true;
        group.add(a);
        arrows.push(a);
      }
      refs.conveyors.push({ zone, arrows, alongX, len, cx, cz, baseY, offset: 0, arrowMat });
    } else if (zone.type === 'wind') {
      // Fan sits on the upstream edge of the wind zone
      const dirX = Math.sign(zone.fx || 0);
      const dirZ = Math.sign(zone.fz || 0);
      const fx = zone.fanX ?? (dirX > 0 ? zone.minX - 0.4 : dirX < 0 ? zone.maxX + 0.4 : cx);
      const fz = zone.fanZ ?? (dirZ > 0 ? zone.minZ - 0.4 : dirZ < 0 ? zone.maxZ + 0.4 : cz);
      const fan = new THREE.Group();
      const housing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.12, 10, 24), mat(0x334155, { metalness: 0.6 }));
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.4, 0.25), mat(0x475569));
      stand.position.y = -0.85;
      const blades = new THREE.Group();
      const bladeMat = mat(0xe2e8f0, { metalness: 0.4 });
      for (let i = 0; i < 4; i++) {
        const bl = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.05), bladeMat);
        bl.position.y = 0.42;
        const pivot = new THREE.Group();
        pivot.rotation.z = (i * Math.PI) / 2;
        pivot.add(bl);
        blades.add(pivot);
      }
      fan.add(housing, stand, blades);
      fan.position.set(fx, 1.6, fz);
      fan.rotation.y = Math.atan2(dirX, dirZ);
      group.add(shadowed(fan));

      const streakMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 });
      const streaks = [];
      for (let i = 0; i < 10; i++) {
        const s = new THREE.Mesh(new THREE.BoxGeometry(dirX ? 0.7 : 0.05, 0.05, dirZ ? 0.7 : 0.05), streakMat);
        s.position.set(
          zone.minX + Math.random() * w,
          0.6 + Math.random() * 2.4,
          zone.minZ + Math.random() * d
        );
        group.add(s);
        streaks.push(s);
      }
      refs.fans.push({ zone, blades, streaks, streakMat });
    }
  });

  // --- Switches ---
  mech.switches.forEach((s) => {
    const root = new THREE.Group();
    root.position.set(s.x, s.y, s.z);
    const ref = { sw: s, root };
    if (s.type === 'plate') {
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(s.r, s.r + 0.08, 0.08, 24), mat(0x374151, { metalness: 0.5 }));
      rim.position.y = 0.14;
      const padMat = mat(0xef4444, { emissive: 0xef4444, emissiveIntensity: 0.55 });
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(s.r - 0.1, s.r - 0.1, 0.08, 24), padMat);
      pad.position.y = 0.2;
      root.add(rim, pad);
      ref.pad = pad;
      ref.padMat = padMat;
    } else {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.3, 0.4), mat(0x1f2937, { metalness: 0.4 }));
      base.position.y = 0.15;
      const pivot = new THREE.Group();
      pivot.position.y = 0.3;
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8), mat(0x9ca3af, { metalness: 0.7 }));
      stick.position.y = 0.35;
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), mat(0xef4444));
      knob.position.y = 0.72;
      pivot.add(stick, knob);
      root.add(base, pivot);
      ref.pivot = pivot;

      const lampMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      if (s.style === 'traffic') {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.6, 8), mat(0x374151));
        pole.position.set(0.45, 1.3, 0);
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.7, 0.3), mat(0x111827));
        box.position.set(0.45, 2.6, 0);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), lampMat);
        lamp.position.set(0.45, 2.6, 0.16);
        root.add(pole, box, lamp);
      } else {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8), mat(0x374151));
        post.position.set(0.38, 0.6, 0);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), lampMat);
        lamp.position.set(0.38, 1.25, 0);
        root.add(post, lamp);
      }
      ref.lampMat = lampMat;

      // Floor ring hint for interaction
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.75, 0.88, 28),
        new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.16;
      root.add(ring);
      ref.ring = ring;
    }
    group.add(shadowed(root));
    refs.switches.push(ref);
  });

  // --- Gates (rolling shutters / bridges) ---
  mech.gates.forEach((g) => {
    if (g.kind === 'bridge') {
      const bridge = new THREE.Group();
      const deck = new THREE.Mesh(new THREE.BoxGeometry(g.w, 0.18, g.d), mat(0x78716c, { metalness: 0.55, roughness: 0.4 }));
      bridge.add(deck);
      const railMat = mat(0xfacc15);
      const alongX = g.w >= g.d;
      [-1, 1].forEach((side) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(alongX ? g.w : 0.08, 0.5, alongX ? 0.08 : g.d), railMat);
        rail.position.set(alongX ? 0 : side * (g.w / 2), 0.3, alongX ? side * (g.d / 2) : 0);
        bridge.add(rail);
      });
      bridge.position.set(g.x, g.y - 0.09, g.z);
      group.add(shadowed(bridge));
      refs.gates.push({ gate: g, mesh: bridge });
    } else {
      const shutterMat = mat(0xf59e0b, { roughness: 0.5, metalness: 0.3 });
      const shutter = new THREE.Mesh(new THREE.BoxGeometry(g.w, g.h, g.d), shutterMat);
      const stripeMat = mat(0x111827);
      const stripes = new THREE.Group();
      for (let i = 0; i < 4; i++) {
        const st = new THREE.Mesh(new THREE.BoxGeometry(g.w + 0.02, 0.12, g.d + 0.02), stripeMat);
        st.position.y = -g.h / 2 + 0.3 + i * (g.h / 4);
        stripes.add(st);
      }
      const holder = new THREE.Group();
      holder.add(shutter, stripes);
      holder.position.set(g.x, g.y + g.h / 2, g.z);
      group.add(shadowed(holder));
      refs.gates.push({ gate: g, mesh: holder });
    }
  });

  // --- Elevators ---
  mech.elevators.forEach((e) => {
    const plat = new THREE.Group();
    const deck = new THREE.Mesh(new THREE.BoxGeometry(e.w, 0.22, e.d), mat(0xfbbf24, { metalness: 0.3 }));
    deck.position.y = -0.11;
    const edge = new THREE.Mesh(new THREE.BoxGeometry(e.w + 0.06, 0.06, e.d + 0.06), mat(0x111827));
    edge.position.y = 0.01;
    plat.add(deck, edge);
    group.add(shadowed(plat));
    const postMat = mat(0x475569, { metalness: 0.5 });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, e.yMax + 0.6, 0.14), postMat);
      post.position.set(e.x + sx * (e.w / 2 + 0.1), (e.yMax + 0.6) / 2, e.z + sz * (e.d / 2 + 0.1));
      post.castShadow = true;
      group.add(post);
    });
    refs.elevators.push({ el: e, mesh: plat });
  });

  // --- Hazards ---
  mech.hazards.forEach((h) => {
    const mesh = h.type === 'car' ? buildCar(h.color || 0xef4444) : buildPatroller(h.kind || 'chef');
    group.add(mesh);
    refs.hazards.push({ hz: h, mesh });
  });

  let clock = 0;
  const api = {
    update(m, dt) {
      clock += dt;
      refs.switches.forEach((ref) => {
        const on = ref.sw.active;
        if (ref.padMat) {
          const c = on ? 0x22c55e : 0xef4444;
          ref.padMat.color.setHex(c);
          ref.padMat.emissive.setHex(c);
          ref.pad.position.y = on ? 0.16 : 0.2;
        }
        if (ref.pivot) {
          ref.pivot.rotation.z = THREE.MathUtils.lerp(ref.pivot.rotation.z, on ? -0.65 : 0.65, Math.min(1, dt * 12));
        }
        if (ref.lampMat) {
          const traffic = ref.sw.style === 'traffic';
          ref.lampMat.color.setHex(on ? (traffic ? 0xef4444 : 0x22c55e) : (traffic ? 0x22c55e : 0xef4444));
        }
        if (ref.ring) {
          ref.ring.material.opacity = ref.sw.cooldown > 0 ? 0.15 : 0.35 + Math.sin(clock * 5) * 0.2;
        }
      });

      refs.gates.forEach(({ gate, mesh }) => {
        const p = gate.progress;
        if (gate.kind === 'bridge') {
          mesh.visible = p > 0.02;
          mesh.position.y = gate.y - 0.09 - (1 - p) * 2.6;
        } else {
          const visibleH = Math.max(0.06, gate.h * (1 - p));
          mesh.scale.y = visibleH / gate.h;
          mesh.position.y = gate.y + gate.h - visibleH / 2;
        }
      });

      refs.elevators.forEach(({ el, mesh }) => {
        mesh.position.set(el.x, el.y, el.z);
      });

      refs.hazards.forEach(({ hz, mesh }) => {
        mesh.position.set(hz.x, 0, hz.z);
        mesh.rotation.y = hz.rotY;
        if (mesh.userData.bob) mesh.position.y = 0.15 + Math.sin(clock * 3 + hz.phase) * 0.12;
        if (mesh.userData.brakeMat) mesh.userData.brakeMat.color.setHex(hz.stopped ? 0xff2222 : 0x7f1d1d);
      });

      refs.conveyors.forEach((cv) => {
        const v = m.conveyorVelocity(cv.zone);
        const speed = cv.alongX ? v.vx : v.vz;
        cv.offset = (cv.offset + speed * dt) % cv.len;
        const heading = cv.alongX ? (speed >= 0 ? -Math.PI / 2 : Math.PI / 2) : (speed >= 0 ? Math.PI : 0);
        cv.arrowMat.color.setHex(Math.abs(speed) < 0.01 ? 0x6b7280 : 0xfacc15);
        const n = cv.arrows.length;
        cv.arrows.forEach((a, i) => {
          let t = ((i / n) * cv.len + cv.offset) % cv.len;
          if (t < 0) t += cv.len;
          const pos = -cv.len / 2 + t;
          a.position.set(cv.alongX ? cv.cx + pos : cv.cx, cv.baseY + 0.16, cv.alongX ? cv.cz : cv.cz + pos);
          a.rotation.z = heading;
        });
      });

      refs.fans.forEach((fan) => {
        const on = m.isWindActive(fan.zone);
        if (on) fan.blades.rotation.z += dt * 14;
        fan.streakMat.opacity = on ? 0.45 : 0.0;
        const z = fan.zone;
        fan.streaks.forEach((s) => {
          if (!on) return;
          s.position.x += Math.sign(z.fx || 0) * dt * 7;
          s.position.z += Math.sign(z.fz || 0) * dt * 7;
          if (s.position.x > z.maxX) s.position.x = z.minX;
          if (s.position.x < z.minX) s.position.x = z.maxX;
          if (s.position.z > z.maxZ) s.position.z = z.minZ;
          if (s.position.z < z.minZ) s.position.z = z.maxZ;
        });
      });
    }
  };
  api.update(mech, 0);
  return api;
}

/** Dashed center-line markings for a road strip. */
export function addRoadMarkings(group, road) {
  if (!road.lanes) return;
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  const alongZ = road.lanes === 'z';
  const len = alongZ ? road.d : road.w;
  for (let s = -len / 2 + 0.6; s < len / 2; s += 1.8) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(alongZ ? 0.14 : 0.9, 0.02, alongZ ? 0.9 : 0.14), dashMat);
    dash.position.set(alongZ ? road.x : road.x + s, 0.07, alongZ ? road.z + s : road.z);
    group.add(dash);
  }
  if (road.crosswalk) {
    const cw = road.crosswalk;
    for (let i = -3; i <= 3; i++) {
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(alongZ ? road.w * 0.9 / 7 * 0.6 : 0.4, 0.02, alongZ ? 1.4 : road.d * 0.9 / 7 * 0.6),
        dashMat
      );
      if (alongZ) stripe.position.set(road.x + i * (road.w * 0.9 / 7), 0.075, cw);
      else stripe.position.set(cw, 0.075, road.z + i * (road.d * 0.9 / 7));
      group.add(stripe);
    }
  }
}

