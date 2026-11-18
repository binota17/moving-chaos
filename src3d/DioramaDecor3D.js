// =========================================================================
// DIORAMA SET DRESSING & COZY NEIGHBORHOOD PROPS
// Adds Moving-Out-inspired perimeter fences, instanced grass tufts,
// rounded trees/shrubs, sidewalk curbs, wavy rugs, welcome mats, wall clocks,
// kitchen counters & pink lawn flamingos without blocking gameplay paths.
// =========================================================================
import * as THREE from 'three';

const decorTexCache = new Map();

function getDecorTex(key, drawFn, size = 256) {
  if (decorTexCache.has(key)) return decorTexCache.get(key);
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) drawFn(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  if ('SRGBColorSpace' in THREE) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  decorTexCache.set(key, tex);
  return tex;
}

function getWavyRugTex() {
  return getDecorTex('wavy_rug_v1', (ctx, s) => {
    ctx.fillStyle = '#fde2c4';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#f8a488';
    const bands = 5;
    const bh = s / (bands * 2);
    for (let b = 0; b < bands; b++) {
      ctx.beginPath();
      const y0 = b * bh * 2 + bh * 0.4;
      ctx.moveTo(0, y0);
      for (let x = 0; x <= s; x += 16) {
        ctx.lineTo(x, y0 + Math.sin((x / s) * Math.PI * 6) * 8);
      }
      for (let x = s; x >= 0; x -= 16) {
        ctx.lineTo(x, y0 + bh * 0.85 + Math.sin((x / s) * Math.PI * 6) * 8);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, s - 16, s - 16);
  }, 256);
}

function getWelcomeMatTex() {
  return getDecorTex('welcome_mat_v1', (ctx, s) => {
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, s - 16, s - 16);
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WELCOME', s / 2, s / 2);
  }, 256);
}

function getWallClockTex() {
  return getDecorTex('wall_clock_v1', (ctx, s) => {
    const c = s / 2;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(c, c, c - 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e242c';
    ctx.lineWidth = 12;
    ctx.stroke();
    // Hour marks
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(c + Math.cos(a) * (c - 32), c + Math.sin(a) * (c - 32));
      ctx.lineTo(c + Math.cos(a) * (c - 18), c + Math.sin(a) * (c - 18));
      ctx.stroke();
    }
    // Clock hands
    ctx.strokeStyle = '#1e242c';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(c, c - 44);
    ctx.moveTo(c, c);
    ctx.lineTo(c + 34, c + 12);
    ctx.stroke();
  }, 192);
}

function isPointClearOfGameplay(x, z, def, pad = 1.65) {
  const b = def.bounds || { minX: -12, maxX: 12, minZ: -8, maxZ: 8 };
  if (x < b.minX + 0.5 || x > b.maxX - 0.5 || z < b.minZ + 0.5 || z > b.maxZ - 0.5) return false;
  for (const r of (def.roads || [])) {
    if (Math.abs(x - r.x) < r.w / 2 + pad && Math.abs(z - r.z) < r.d / 2 + pad) return false;
  }
  for (const p of (def.pits || [])) {
    if (x > p.minX - pad && x < p.maxX + pad && z > p.minZ - pad && z < p.maxZ + pad) return false;
  }
  for (const it of (def.items || [])) {
    if (Math.hypot(x - it.x, z - it.z) < pad) return false;
  }
  for (const sp of (def.spawns || [])) {
    if (Math.hypot(x - sp.x, z - sp.z) < pad) return false;
  }
  for (const tr of (def.trampolines || [])) {
    if (Math.hypot(x - tr.x, z - tr.z) < tr.r + pad) return false;
  }
  return true;
}

function createRoundedTree(scale = 1.0) {
  const g = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0xa16236, roughness: 0.85 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x56b859, roughness: 0.7 });
  const hiLeafMat = new THREE.MeshStandardMaterial({ color: 0x76d666, roughness: 0.68 });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.30, 1.35, 10), trunkMat);
  trunk.position.y = 0.675;
  trunk.castShadow = true;

  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.95, 14, 12), leafMat);
  crown.scale.set(1.0, 1.25, 1.0);
  crown.position.y = 2.05;
  crown.castShadow = true;
  crown.receiveShadow = true;

  const crownTop = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 10), hiLeafMat);
  crownTop.position.set(0.18, 2.75, 0.14);
  crownTop.castShadow = true;

  g.add(trunk, crown, crownTop);
  g.scale.setScalar(scale);
  return g;
}

function createShrubCluster(scale = 1.0) {
  const g = new THREE.Group();
  const m1 = new THREE.MeshStandardMaterial({ color: 0x4ca657, roughness: 0.78 });
  const m2 = new THREE.MeshStandardMaterial({ color: 0x6ec964, roughness: 0.75 });
  const main = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 10), m1);
  main.scale.set(1.15, 0.85, 1.0);
  main.position.y = 0.32;
  main.castShadow = true;
  const side = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), m2);
  side.position.set(0.32, 0.24, 0.15);
  side.castShadow = true;
  g.add(main, side);
  g.scale.setScalar(scale);
  return g;
}

function createFlamingo() {
  const g = new THREE.Group();
  const pink = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
  const beakMat = new THREE.MeshStandardMaterial({ color: 0x1e242c, roughness: 0.3 });

  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.38, 6), legMat);
  leg.position.y = 0.19;
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), pink);
  body.scale.set(1.4, 0.85, 0.9);
  body.position.set(0, 0.40, 0);
  body.castShadow = true;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.28, 6), pink);
  neck.position.set(0.13, 0.54, 0);
  neck.rotation.z = -0.28;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), pink);
  head.position.set(0.18, 0.67, 0);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 6), beakMat);
  beak.rotation.z = -Math.PI * 0.65;
  beak.position.set(0.24, 0.65, 0);
  g.add(leg, body, neck, head, beak);
  return g;
}

function createMailbox() {
  const g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.72, 0.12), new THREE.MeshStandardMaterial({ color: 0x9a5b2c, roughness: 0.75 }));
  post.position.y = 0.36;
  post.castShadow = true;
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.44), new THREE.MeshStandardMaterial({ color: 0xef4f27, roughness: 0.42 }));
  box.position.set(0, 0.80, 0);
  box.castShadow = true;
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.44, 12, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0xfef7e6, roughness: 0.45 }));
  roof.rotation.z = Math.PI / 2;
  roof.rotation.y = Math.PI / 2;
  roof.position.set(0, 0.92, 0);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.07), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 }));
  flag.position.set(0.175, 0.88, 0.08);
  g.add(post, box, roof, flag);
  return g;
}

export function buildLevelSetDressing3D(def, levelGroup, { lvlId = 1 } = {}) {
  const b = def.bounds || { minX: -12, maxX: 12, minZ: -8, maxZ: 8 };
  const roads = def.roads || [];
  const zones = def.houseZones || (def.houseBounds ? [def.houseBounds] : []);

  // 1. Bright Concrete Sidewalk Borders flanking roads
  const curbMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.75 });
  roads.forEach((rd) => {
    if (rd.lanes === 'z') {
      [-1, 1].forEach((side) => {
        const curb = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.08, rd.d), curbMat);
        curb.position.set(rd.x + side * (rd.w / 2 + 0.47), 0.02, rd.z);
        curb.receiveShadow = true;
        levelGroup.add(curb);
      });
    } else if (rd.lanes === 'x') {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(rd.w, 0.08, 0.95), curbMat);
      curb.position.set(rd.x, 0.02, rd.z - rd.d / 2 - 0.47);
      curb.receiveShadow = true;
      levelGroup.add(curb);
    }
  });

  // 2. Instanced Grass Tufts scattered across dynamic lawn size (1 draw call)
  const yardSpanW = (def.floorSize?.w || 26) + 8;
  const yardSpanD = (def.floorSize?.d || 18) + 6;
  const tuftGeo = new THREE.ConeGeometry(0.08, 0.24, 4);
  tuftGeo.translate(0, 0.12, 0);
  const tuftMat = new THREE.MeshStandardMaterial({ color: 0x99e265, roughness: 0.8 });
  const maxTufts = 220;
  const tufts = new THREE.InstancedMesh(tuftGeo, tuftMat, maxTufts);
  tufts.receiveShadow = true;
  const dummy = new THREE.Object3D();
  let placed = 0;

  const insideAnyZone = (px, pz) => {
    for (const z of zones) {
      if (px > z.minX - 0.6 && px < z.maxX + 0.6 && pz > z.minZ - 0.6 && pz < z.maxZ + 0.6) return true;
    }
    for (const rd of roads) {
      if (Math.abs(px - rd.x) < rd.w / 2 + 1.2 && Math.abs(pz - rd.z) < rd.d / 2 + 1.2) return true;
    }
    for (const p of (def.pits || [])) {
      if (px > p.minX - 0.8 && px < p.maxX + 0.8 && pz > p.minZ - 0.8 && pz < p.maxZ + 0.8) return true;
    }
    return false;
  };

  for (let i = 0; i < 600 && placed < maxTufts; i++) {
    // Deterministic pseudo-random scatter
    const s1 = Math.sin(i * 12.9898 + lvlId * 7.13) * 43758.5453;
    const s2 = Math.sin(i * 78.233 + lvlId * 3.77) * 43758.5453;
    const rx = (s1 - Math.floor(s1)) * yardSpanW - yardSpanW * 0.5;
    const rz = (s2 - Math.floor(s2)) * yardSpanD - yardSpanD * 0.5;
    if (insideAnyZone(rx, rz)) continue;
    dummy.position.set(rx, -0.02, rz);
    dummy.rotation.set((s1 % 0.16) - 0.08, (s2 % 6.28), (s2 % 0.16) - 0.08);
    const sc = 0.75 + (s1 - Math.floor(s1)) * 0.65;
    dummy.scale.set(sc, sc, sc);
    dummy.updateMatrix();
    tufts.setMatrixAt(placed++, dummy.matrix);
  }
  tufts.count = placed;
  tufts.instanceMatrix.needsUpdate = true;
  tufts.computeBoundingSphere();
  levelGroup.add(tufts);

  // 3. Perimeter Wooden Yard Fence framing the outdoor property (safely stopping before any Z-road)
  const postMat = new THREE.MeshStandardMaterial({ color: 0xb66f3a, roughness: 0.78 });
  const railMat = new THREE.MeshStandardMaterial({ color: 0xcd8449, roughness: 0.75 });
  if (lvlId <= 4) {
    const zRoad = roads.find((r) => r.lanes === 'z');
    const roadStopX = zRoad ? (zRoad.x - zRoad.w / 2 - 1.2) : (b.maxX - 3.5);
    const fz = b.minZ - 1.5;
    const fxStart = b.minX - 1.8;
    const fxEnd = Math.min(b.maxX - 3.5, roadStopX);
    const span = fxEnd - fxStart;
    if (span > 4) {
      const railTop = new THREE.Mesh(new THREE.BoxGeometry(span, 0.11, 0.10), railMat);
      railTop.position.set((fxStart + fxEnd) / 2, 0.86, fz);
      railTop.castShadow = true;
      const railBot = new THREE.Mesh(new THREE.BoxGeometry(span, 0.11, 0.10), railMat);
      railBot.position.set((fxStart + fxEnd) / 2, 0.38, fz);
      railBot.castShadow = true;
      levelGroup.add(railTop, railBot);
      for (let x = fxStart; x <= fxEnd; x += 1.45) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.15, 0.18), postMat);
        post.position.set(x, 0.56, fz);
        post.castShadow = true;
        levelGroup.add(post);
      }
    }
  }

  // 4. Outer Trees, Bushes & Cozy Neighborhood Flamingos/Mailbox
  const outerTreeSpots = [
    [b.minX - 2.4, b.minZ - 0.8, 1.15],
    [b.minX - 2.3, b.maxZ + 0.6, 1.0],
    [b.minX + 1.8, b.minZ - 2.4, 0.92],
    [b.maxX + 2.2, b.minZ - 0.8, 1.05]
  ];
  outerTreeSpots.forEach(([tx, tz, sc]) => {
    if (!insideAnyZone(tx, tz)) {
      const tree = createRoundedTree(sc);
      tree.position.set(tx, -0.02, tz);
      levelGroup.add(tree);
    }
  });

  if (lvlId === 1) {
    // Neighborhood front yard shrubs, pink flamingos & mailbox like Moving Out
    [[2.4, 3.6, 0.9], [2.4, 4.6, 0.78], [1.9, -4.4, 0.85]].forEach(([sx, sz, sc]) => {
      if (isPointClearOfGameplay(sx, sz, def, 0.8)) {
        const shrub = createShrubCluster(sc);
        shrub.position.set(sx, -0.02, sz);
        levelGroup.add(shrub);
      }
    });
    const flam1 = createFlamingo();
    flam1.position.set(3.4, -0.02, -4.8);
    flam1.rotation.y = 0.6;
    const flam2 = createFlamingo();
    flam2.position.set(3.9, -0.02, -4.3);
    flam2.rotation.y = -0.5;
    levelGroup.add(flam1, flam2);

    const mb = createMailbox();
    mb.position.set(4.5, -0.02, -6.2);
    mb.rotation.y = Math.PI / 2;
    levelGroup.add(mb);
  } else if (lvlId === 2) {
    const mb = createMailbox();
    mb.position.set(-12.6, -0.02, 2.8);
    levelGroup.add(mb);
  }

  // 5. Interior Cozy Details: Wavy Living Rug, WELCOME Mat & North Wall Clock
  if (lvlId === 1 || lvlId === 2 || lvlId === 4) {
    const hb = zones[0];
    if (hb) {
      const rugMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 2.4),
        new THREE.MeshStandardMaterial({
          map: getWavyRugTex(),
          roughness: 0.92,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2
        })
      );
      rugMesh.rotation.x = -Math.PI / 2;
      const rx = lvlId === 2 ? -9.2 : ((hb.minX + hb.maxX) * 0.5 + 1.1);
      const rz = lvlId === 2 ? -2.6 : ((hb.minZ + hb.maxZ) * 0.5);
      rugMesh.position.set(rx, 0.118, rz);
      rugMesh.receiveShadow = true;
      levelGroup.add(rugMesh);

      // Wall clock on North wall
      const clockMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.44, 0.44, 0.08, 20),
        new THREE.MeshStandardMaterial({ map: getWallClockTex(), roughness: 0.4 })
      );
      clockMesh.rotation.x = Math.PI / 2;
      clockMesh.position.set((hb.minX + hb.maxX) * 0.5 + 1.0, 2.15, hb.minZ + 0.25);
      levelGroup.add(clockMesh);

      // WELCOME Doormat near main threshold
      const matMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.35, 0.82),
        new THREE.MeshStandardMaterial({
          map: getWelcomeMatTex(),
          roughness: 0.9,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2
        })
      );
      matMesh.rotation.x = -Math.PI / 2;
      if (lvlId === 1) {
        matMesh.rotation.z = Math.PI / 2;
        matMesh.position.set(1.9, 0.04, 0.0);
      } else if (lvlId === 2) {
        matMesh.position.set(-11.2, 0.04, 2.6);
      } else {
        matMesh.rotation.z = Math.PI / 2;
        matMesh.position.set(4.3, 0.04, 0.0);
      }
      levelGroup.add(matMesh);
    }
  }
}
