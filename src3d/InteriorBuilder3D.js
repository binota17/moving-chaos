// =========================================================================
// ARCHITECTURAL ROOM FLOORING, DOOR FRAMES & BUILT-IN FIXTURES (3D)
// Turns open level shells into believable houses, restaurants, supermarkets,
// museums, warehouses, ships, and mansions with real multi-room layouts.
// =========================================================================
import * as THREE from 'three';
import { getFloorPatternTex } from './PropFactory3D.js';

const interiorTexCache = new Map();

function stdMat(color, roughness = 0.55, metalness = 0.05, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, ...opts });
}

function getRoomRugTex(baseHex = '#fde2c4', stripeHex = '#f8a488') {
  const key = `room_rug_${baseHex}_${stripeHex}`;
  if (interiorTexCache.has(key)) return interiorTexCache.get(key);
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = stripeHex;
    for (let b = 0; b < 5; b++) {
      ctx.beginPath();
      const y0 = b * 51 + 10;
      ctx.moveTo(0, y0);
      for (let x = 0; x <= 256; x += 16) {
        ctx.lineTo(x, y0 + Math.sin((x / 256) * Math.PI * 6) * 7);
      }
      for (let x = 256; x >= 0; x -= 16) {
        ctx.lineTo(x, y0 + 22 + Math.sin((x / 256) * Math.PI * 6) * 7);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 240, 240);
  }
  const tex = new THREE.CanvasTexture(c);
  if ('SRGBColorSpace' in THREE) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  interiorTexCache.set(key, tex);
  return tex;
}

function getArtTex(variant = 0) {
  const key = `wall_art_${variant}`;
  if (interiorTexCache.has(key)) return interiorTexCache.get(key);
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  if (ctx) {
    const palettes = [
      ['#fef3c7', '#f97316', '#38bdf8'],
      ['#e0f2fe', '#0284c7', '#22c55e'],
      ['#fce7f3', '#db2777', '#facc15'],
      ['#ede9fe', '#6366f1', '#f43f5e']
    ];
    const [bg, c1, c2] = palettes[variant % palettes.length];
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.arc(82, 42, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.moveTo(12, 112);
    ctx.lineTo(54, 50);
    ctx.lineTo(96, 112);
    ctx.closePath();
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  if ('SRGBColorSpace' in THREE) tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  interiorTexCache.set(key, tex);
  return tex;
}

/**
 * Renders distinct per-room floor finishes, rugs, floor thresholds & open hinged door frames.
 */
export function buildRoomFloors3D(def, levelGroup) {
  // 1. Per-Room Floor Finishes (tiled kitchen, bath tiles, wooden bedrooms, polka living rooms...)
  (def.rooms || []).forEach((rm, idx) => {
    const rw = Math.max(0.5, rm.maxX - rm.minX);
    const rd = Math.max(0.5, rm.maxZ - rm.minZ);
    const cx = (rm.minX + rm.maxX) * 0.5;
    const cz = (rm.minZ + rm.maxZ) * 0.5;
    const baseY = (rm.y || 0) + 0.114;

    const tex = getFloorPatternTex(rm.style || 'polka_pink', rm.color || '#f47b8c').clone();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(Math.max(1, rw / 3.0), Math.max(1, rd / 3.0));
    tex.needsUpdate = true;

    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(rw, rd),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: tex,
        roughness: rm.style === 'bath_tile' || rm.style === 'bistro_tile' ? 0.36 : 0.65,
        metalness: 0.02,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
      })
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(cx, baseY, cz);
    floorMesh.receiveShadow = true;
    levelGroup.add(floorMesh);

    if (rm.rug) {
      const rg = rm.rug;
      const rugTex = getRoomRugTex(rg.color || '#fde2c4', rg.stripe || '#f8a488');
      const rugMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(rg.w || 3.2, rg.d || 2.2),
        new THREE.MeshStandardMaterial({
          map: rugTex,
          roughness: 0.92,
          polygonOffset: true,
          polygonOffsetFactor: -2 - (idx % 2),
          polygonOffsetUnits: -2
        })
      );
      rugMesh.rotation.x = -Math.PI / 2;
      rugMesh.position.set(rg.x ?? cx, baseY + 0.008, rg.z ?? cz);
      rugMesh.receiveShadow = true;
      levelGroup.add(rugMesh);
    }
  });

  // 2. Open Door Frames + Hinged Wooden Door Leaves (tucked cleanly open along jamb)
  const jambMat = stdMat(0xfef7e6, 0.52);
  const sillMat = stdMat(0xb45309, 0.65);
  (def.doors || []).forEach((dr) => {
    const g = new THREE.Group();
    const width = dr.width || 2.6;
    const h = dr.h || 2.85;
    const half = width * 0.5;
    const doorMat = stdMat(dr.doorColor || 0x854d27, 0.56);
    const knobMat = stdMat(0xfacc15, 0.25, 0.85);

    // Threshold sill strip flush on floor
    const sill = new THREE.Mesh(new THREE.BoxGeometry(width, 0.03, 0.32), sillMat);
    sill.position.y = 0.125;
    sill.receiveShadow = true;
    g.add(sill);

    // Left & Right Door Jamb Pillars
    [-half + 0.08, half - 0.08].forEach((px) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.34), jambMat);
      post.position.set(px, h / 2, 0);
      post.castShadow = true;
      g.add(post);
    });

    // Slim architectural top transom beam (clear overhead view)
    const header = new THREE.Mesh(new THREE.BoxGeometry(width + 0.16, 0.22, 0.36), jambMat);
    header.position.set(0, h - 0.11, 0);
    header.castShadow = true;
    g.add(header);

    // Hinged door leaf swung wide open (~100 deg) into room so carry-only items never catch!
    const leafW = Math.min(1.18, width * 0.46);
    const leafPivot = new THREE.Group();
    leafPivot.position.set(-half + 0.14, 0.14, 0);
    leafPivot.rotation.y = dr.swingDir === -1 ? -Math.PI * 0.58 : Math.PI * 0.58;

    const leaf = new THREE.Mesh(new THREE.BoxGeometry(leafW, h - 0.36, 0.09), doorMat);
    leaf.position.set(leafW * 0.5, (h - 0.36) * 0.5, 0);
    leaf.castShadow = true;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(leafW * 0.72, (h - 0.7) * 0.42, 0.11), stdMat(0x6b3b1b, 0.6));
    panel.position.set(leafW * 0.5, (h - 0.36) * 0.65, 0);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), knobMat);
    knob.position.set(leafW * 0.85, 1.05, 0.065);
    leafPivot.add(leaf, panel, knob);
    g.add(leafPivot);

    g.position.set(dr.x, dr.y || 0, dr.z);
    if (dr.dir === 'z') g.rotation.y = Math.PI / 2;
    levelGroup.add(g);
  });
}

function buildKitchenCounter(w, h, d) {
  const g = new THREE.Group();
  const cabMat = stdMat(0xfef3c7, 0.62);
  const topMat = stdMat(0x334155, 0.32, 0.15);
  const sinkMat = stdMat(0xcbd5e1, 0.22, 0.85);
  const chromeMat = stdMat(0xe2e8f0, 0.15, 0.92);

  const base = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.08, d), cabMat);
  base.position.y = (h - 0.08) * 0.5;
  base.castShadow = true;
  base.receiveShadow = true;

  const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.06, 0.09, d + 0.06), topMat);
  top.position.y = h - 0.04;
  top.castShadow = true;
  top.receiveShadow = true;
  g.add(base, top);

  // Drawer fronts along front side
  const drawers = Math.max(2, Math.round(Math.max(w, d) / 0.85));
  const alongZ = d > w;
  for (let i = 0; i < drawers; i++) {
    const t = -0.38 * Math.max(w, d) + (i / Math.max(1, drawers - 1)) * 0.76 * Math.max(w, d);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(alongZ ? 0.05 : 0.22, 0.04, alongZ ? 0.22 : 0.05), chromeMat);
    handle.position.set(alongZ ? w * 0.5 + 0.02 : t, h * 0.62, alongZ ? t : d * 0.5 + 0.02);
    g.add(handle);
  }

  // Recessed steel sink basin & faucet + ceramic plate
  const sink = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.04, 0.48), sinkMat);
  sink.position.set(0, h + 0.015, 0);
  const faucetStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 8), chromeMat);
  faucetStem.position.set(0, h + 0.12, -0.20);
  const faucetSpout = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.16), chromeMat);
  faucetSpout.position.set(0, h + 0.22, -0.13);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.04, 14), stdMat(0xffffff, 0.25));
  plate.position.set(alongZ ? 0 : Math.min(w * 0.3, 0.65), h + 0.025, alongZ ? Math.min(d * 0.3, 0.65) : 0);
  g.add(sink, faucetStem, faucetSpout, plate);
  return g;
}

function buildKitchenIsland(w, h, d) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.1, d), stdMat(0x1e293b, 0.55));
  base.position.y = (h - 0.1) * 0.5;
  base.castShadow = true;
  base.receiveShadow = true;

  const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, 0.10, d + 0.12), stdMat(0xf8fafc, 0.30));
  top.position.y = h - 0.05;
  top.castShadow = true;
  top.receiveShadow = true;
  g.add(base, top);

  // Cute dish & coffee mug on counter
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.04, 14), stdMat(0xfef3c7, 0.3));
  dish.position.set(0, h + 0.02, -d * 0.18);
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.14, 10), stdMat(0x38bdf8, 0.3));
  mug.position.set(0.12, h + 0.07, d * 0.22);
  g.add(dish, mug);
  return g;
}

function buildBathtub(w, h, d) {
  const g = new THREE.Group();
  const tubMat = stdMat(0xffffff, 0.22, 0.06);
  const outer = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), tubMat);
  outer.position.y = h * 0.5;
  outer.castShadow = true;
  outer.receiveShadow = true;

  const water = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.24, 0.06, d - 0.24),
    stdMat(0x38bdf8, 0.1, 0.15, { transparent: true, opacity: 0.78 })
  );
  water.position.y = h - 0.06;

  const chrome = stdMat(0xe2e8f0, 0.15, 0.9);
  const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.24, 8), chrome);
  faucet.position.set(-w * 0.4, h + 0.10, 0);
  const mat = new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, 0.03, 0.42), stdMat(0xf472b6, 0.9));
  mat.position.set(0, 0.02, -d * 0.62);
  g.add(outer, water, faucet, mat);
  return g;
}

function buildVanitySink(w, h, d) {
  const g = new THREE.Group();
  const cab = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.1, d), stdMat(0xe0f2fe, 0.48));
  cab.position.y = (h - 0.1) * 0.5;
  cab.castShadow = true;
  const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.06, 0.08, d + 0.04), stdMat(0xffffff, 0.25));
  top.position.y = h - 0.04;
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.10, 14), stdMat(0xf8fafc, 0.2));
  bowl.position.set(0, h + 0.02, 0);
  const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, 0.85, 0.06), stdMat(0xb45309, 0.55));
  mirrorFrame.position.set(0, h + 0.65, d * 0.44);
  const mirror = new THREE.Mesh(new THREE.BoxGeometry(w * 0.65, 0.72, 0.07), stdMat(0xbae6fd, 0.08, 0.6));
  mirror.position.set(0, h + 0.65, d * 0.44);
  g.add(cab, top, bowl, mirrorFrame, mirror);
  return g;
}

function buildCoffeeTable(w, h, d) {
  const g = new THREE.Group();
  const wood = stdMat(0x854d27, 0.58);
  const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), wood);
  top.position.y = h - 0.04;
  top.castShadow = true;
  top.receiveShadow = true;
  g.add(top);
  [[-w * 0.4, -d * 0.38], [w * 0.4, -d * 0.38], [-w * 0.4, d * 0.38], [w * 0.4, d * 0.38]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, h - 0.06, 8), wood);
    leg.position.set(lx, (h - 0.06) * 0.5, lz);
    leg.castShadow = true;
    g.add(leg);
  });
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.24), stdMat(0xfef08a, 0.65));
  book.position.set(-0.18, h + 0.02, 0.05);
  const coaster = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 10), stdMat(0xf43f5e, 0.5));
  coaster.position.set(0.24, h + 0.01, -0.08);
  g.add(book, coaster);
  return g;
}

function buildWardrobe(w, h, d) {
  const g = new THREE.Group();
  const wood = stdMat(0x9a5b2c, 0.58);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.1, d), wood);
  body.position.y = (h - 0.1) * 0.5;
  body.castShadow = true;
  body.receiveShadow = true;
  const crown = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, 0.12, d + 0.08), stdMat(0x78350f, 0.55));
  crown.position.y = h - 0.05;
  const seam = new THREE.Mesh(new THREE.BoxGeometry(0.03, h - 0.25, d + 0.02), stdMat(0x451a03, 0.7));
  seam.position.y = h * 0.48;
  const knob1 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), stdMat(0xfacc15, 0.25, 0.85));
  knob1.position.set(-0.12, h * 0.52, d * 0.5 + 0.02);
  const knob2 = knob1.clone();
  knob2.position.x = 0.12;
  g.add(body, crown, seam, knob1, knob2);
  return g;
}

function buildNightstand(w, h, d) {
  const g = new THREE.Group();
  const wood = stdMat(0xa16236, 0.56);
  const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wood);
  box.position.y = h * 0.5;
  box.castShadow = true;
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.16, 10), stdMat(0x334155, 0.4, 0.5));
  lampBase.position.set(0, h + 0.08, 0);
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.18, 12),
    stdMat(0xfef08a, 0.4, 0, { emissive: 0xfde047, emissiveIntensity: 0.45 })
  );
  shade.position.set(0, h + 0.24, 0);
  g.add(box, lampBase, shade);
  return g;
}

function buildStoreRack(w, h, d) {
  const g = new THREE.Group();
  const steel = stdMat(0x64748b, 0.4, 0.6);
  const shelfMat = stdMat(0xe2e8f0, 0.55);
  const back = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.08), steel);
  back.position.y = h * 0.5;
  back.castShadow = true;
  g.add(back);

  const levels = [0.22, 0.82, 1.42, h - 0.08];
  const itemColors = [0xef4444, 0x3b82f6, 0xfacc15, 0x22c55e, 0xf97316, 0xa855f7];
  levels.forEach((sy, li) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, d), shelfMat);
    shelf.position.y = sy;
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    g.add(shelf);
    if (li < 3) {
      const count = Math.max(3, Math.floor(w / 0.62));
      for (let i = 0; i < count; i++) {
        const px = -w * 0.42 + (i / Math.max(1, count - 1)) * (w * 0.84);
        const col = itemColors[(i + li * 2) % itemColors.length];
        const pkg = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.24), stdMat(col, 0.42));
        pkg.position.set(px, sy + 0.20, d * 0.22);
        pkg.castShadow = true;
        const pkgBack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.30, 0.24), stdMat(itemColors[(i + li + 3) % itemColors.length], 0.45));
        pkgBack.position.set(px, sy + 0.18, -d * 0.22);
        g.add(pkg, pkgBack);
      }
    }
  });
  return g;
}

function buildCheckoutCounter(w, h, d) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.08, d), stdMat(0x0284c7, 0.48));
  body.position.y = (h - 0.08) * 0.5;
  body.castShadow = true;
  const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.06, 0.08, d + 0.06), stdMat(0xf8fafc, 0.35));
  top.position.y = h - 0.04;
  const belt = new THREE.Mesh(new THREE.BoxGeometry(w * 0.56, 0.03, d * 0.56), stdMat(0x1e293b, 0.78));
  belt.position.set(0, h + 0.015, -d * 0.16);
  const reg = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.34), stdMat(0x334155, 0.35, 0.4));
  reg.position.set(0, h + 0.16, d * 0.28);
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.05), stdMat(0x38bdf8, 0.2, 0.1, { emissive: 0x0ea5e9, emissiveIntensity: 0.45 }));
  screen.position.set(0, h + 0.42, d * 0.28);
  g.add(body, top, belt, reg, screen);
  return g;
}

function buildRestaurantTable(w, h, d) {
  const g = new THREE.Group();
  const cloth = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.46, w * 0.48, 0.14, 18), stdMat(0xfef2f2, 0.75));
  cloth.position.y = h - 0.07;
  cloth.castShadow = true;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.24, h - 0.1, 12), stdMat(0x334155, 0.35, 0.6));
  stem.position.y = (h - 0.1) * 0.5;
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 8), stdMat(0xfef08a, 0.3, 0, { emissive: 0xfacc15, emissiveIntensity: 0.55 }));
  candle.position.y = h + 0.07;
  g.add(cloth, stem, candle);
  return g;
}

function buildMuseumPedestal(w, h, d) {
  const g = new THREE.Group();
  const marble = stdMat(0xf1f5f9, 0.28, 0.08);
  const trim = stdMat(0xfacc15, 0.25, 0.8);
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, 0.16, d), marble);
  base.position.y = 0.08;
  const col = new THREE.Mesh(new THREE.BoxGeometry(w * 0.78, h - 0.28, d * 0.78), marble);
  col.position.y = 0.16 + (h - 0.28) * 0.5;
  col.castShadow = true;
  const cap = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, 0.12, d * 0.96), trim);
  cap.position.y = h - 0.06;
  const dome = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.68, 0.45, d * 0.68),
    stdMat(0xbae6fd, 0.08, 0.1, { transparent: true, opacity: 0.35 })
  );
  dome.position.y = h + 0.22;
  g.add(base, col, cap, dome);
  return g;
}

function buildControlDesk(w, h, d) {
  const g = new THREE.Group();
  const desk = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), stdMat(0x334155, 0.42, 0.35));
  desk.position.y = h - 0.05;
  desk.castShadow = true;
  [-w * 0.42, w * 0.42].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, h - 0.08, d * 0.85), stdMat(0x1e293b, 0.45, 0.5));
    leg.position.set(lx, (h - 0.08) * 0.5, 0);
    leg.castShadow = true;
    g.add(leg);
  });
  [-0.38, 0.38].forEach((mx) => {
    const mon = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.38, 0.05),
      stdMat(0x0ea5e9, 0.18, 0.2, { emissive: 0x38bdf8, emissiveIntensity: 0.42 })
    );
    mon.position.set(mx, h + 0.24, -d * 0.22);
    mon.rotation.y = mx < 0 ? 0.18 : -0.18;
    g.add(mon);
  });
  const blueprint = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.02, 0.38), stdMat(0x93c5fd, 0.8));
  blueprint.position.set(0, h + 0.015, d * 0.18);
  g.add(desk, blueprint);
  return g;
}

function buildShippingContainer(w, h, d, color = 0x0284c7) {
  const g = new THREE.Group();
  const steel = stdMat(color, 0.52, 0.35);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), steel);
  body.position.y = h * 0.5;
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);
  const ribMat = stdMat(0xffffff, 0.4, 0.25, { transparent: true, opacity: 0.18 });
  const alongX = w >= d;
  const span = alongX ? w : d;
  const ribs = Math.max(3, Math.floor(span / 0.55));
  for (let i = 0; i < ribs; i++) {
    const t = -span * 0.44 + (i / Math.max(1, ribs - 1)) * (span * 0.88);
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(alongX ? 0.09 : w + 0.05, h * 0.88, alongX ? d + 0.05 : 0.09),
      ribMat
    );
    rib.position.set(alongX ? t : 0, h * 0.5, alongX ? 0 : t);
    g.add(rib);
  }
  return g;
}

function buildPottedPlant() {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.36, 12), stdMat(0xd97706, 0.7));
  pot.position.y = 0.18;
  pot.castShadow = true;
  const leafMat = stdMat(0x22c55e, 0.55);
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), leafMat);
    leaf.scale.set(1.25, 0.42, 0.75);
    leaf.position.set(Math.cos(ang) * 0.16, 0.46 + (i % 2) * 0.1, Math.sin(ang) * 0.16);
    leaf.rotation.y = ang;
    leaf.castShadow = true;
    g.add(leaf);
  }
  g.add(pot);
  return g;
}

function buildWallArt(variant = 0) {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.82, 0.07), stdMat(0x78350f, 0.55));
  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(0.98, 0.66),
    stdMat(0xffffff, 0.45, 0, { map: getArtTex(variant) })
  );
  art.position.z = 0.04;
  g.add(frame, art);
  return g;
}

function buildYachtHelm() {
  const g = new THREE.Group();
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.0, 12), stdMat(0xf8fafc, 0.35));
  ped.position.y = 0.5;
  ped.castShadow = true;
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.045, 8, 20), stdMat(0x9a5b2c, 0.45));
  wheel.position.set(0, 1.02, 0.16);
  wheel.rotation.x = -0.35;
  const compass = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.1, 12), stdMat(0xfacc15, 0.25, 0.85));
  compass.position.set(0, 1.05, -0.04);
  g.add(ped, wheel, compass);
  return g;
}

function buildLabBench(w, h, d) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.08, d), stdMat(0xe2e8f0, 0.35, 0.3));
  base.position.y = (h - 0.08) * 0.5;
  base.castShadow = true;
  const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, 0.09, d + 0.08), stdMat(0x0f172a, 0.25, 0.4));
  top.position.y = h - 0.04;
  g.add(base, top);
  [-0.55, 0.55].forEach((bx, idx) => {
    const vial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.38, 12),
      stdMat(idx === 0 ? 0x22d3ee : 0xa855f7, 0.1, 0.1, { emissive: idx === 0 ? 0x06b6d4 : 0x9333ea, emissiveIntensity: 0.7 })
    );
    vial.position.set(bx, h + 0.2, 0);
    g.add(vial);
  });
  return g;
}

function buildServerRack(w, h, d) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stdMat(0x1e293b, 0.38, 0.72));
  body.position.y = h * 0.5;
  body.castShadow = true;
  g.add(body);
  for (let i = 0; i < 6; i++) {
    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.78, 0.08, d + 0.03),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x22c55e : 0x38bdf8 })
    );
    glow.position.y = 0.35 + i * 0.28;
    g.add(glow);
  }
  return g;
}

function buildCryoTank(w, h, d) {
  const g = new THREE.Group();
  const capMat = stdMat(0x334155, 0.35, 0.7);
  const bot = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.45, w * 0.48, 0.28, 18), capMat);
  bot.position.y = 0.14;
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(w * 0.38, w * 0.38, h - 0.56, 18),
    stdMat(0x67e8f9, 0.08, 0.1, { transparent: true, opacity: 0.55, emissive: 0x06b6d4, emissiveIntensity: 0.6 })
  );
  tube.position.y = h * 0.5;
  const top = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.46, w * 0.46, 0.28, 18), capMat);
  top.position.y = h - 0.14;
  g.add(bot, tube, top);
  return g;
}

function buildSpotlightRig(w, h, d) {
  const g = new THREE.Group();
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.32, h * 0.8, 12), stdMat(0x1e293b, 0.4, 0.7));
  stand.position.y = h * 0.4;
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.44, 14), stdMat(0x334155, 0.3, 0.8));
  head.rotation.x = Math.PI / 3;
  head.position.set(0, h * 0.84, 0.1);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.22, 14), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
  lens.position.set(0, h * 0.76, 0.28);
  lens.rotation.x = 0.5;
  g.add(stand, head, lens);
  return g;
}

/**
 * Renders non-movable room fixtures (kitchen counters, tubs, shelves, desks, plants, art).
 */
export function buildArchitecturalFixtures3D(def, levelGroup) {
  (def.fixtures || []).forEach((f, idx) => {
    let mesh = null;
    const w = f.w;
    const h = f.h;
    const d = f.d;

    switch (f.type) {
      case 'kitchen_counter': mesh = buildKitchenCounter(w || 2.6, h || 0.98, d || 0.9); break;
      case 'kitchen_island': mesh = buildKitchenIsland(w || 2.2, h || 0.94, d || 1.0); break;
      case 'bathtub': mesh = buildBathtub(w || 1.85, h || 0.72, d || 0.98); break;
      case 'vanity_sink': mesh = buildVanitySink(w || 1.5, h || 0.96, d || 0.72); break;
      case 'coffee_table': mesh = buildCoffeeTable(w || 1.35, h || 0.46, d || 0.82); break;
      case 'wardrobe': mesh = buildWardrobe(w || 1.5, h || 2.15, d || 0.72); break;
      case 'nightstand': mesh = buildNightstand(w || 0.7, h || 0.65, d || 0.65); break;
      case 'store_rack': mesh = buildStoreRack(w || 4.4, h || 2.05, d || 0.76); break;
      case 'checkout_counter': mesh = buildCheckoutCounter(w || 0.82, h || 1.02, d || 3.2); break;
      case 'restaurant_table': mesh = buildRestaurantTable(w || 1.25, h || 0.82, d || 1.25); break;
      case 'museum_pedestal': mesh = buildMuseumPedestal(w || 1.1, h || 1.15, d || 1.1); break;
      case 'control_desk': mesh = buildControlDesk(w || 2.1, h || 0.92, d || 0.86); break;
      case 'shipping_container': mesh = buildShippingContainer(w || 4.2, h || 2.4, d || 2.0, f.color || 0x0284c7); break;
      case 'potted_plant': mesh = buildPottedPlant(); break;
      case 'wall_art': mesh = buildWallArt(f.variant ?? idx); break;
      case 'yacht_helm': mesh = buildYachtHelm(); break;
      case 'lab_bench': mesh = buildLabBench(w || 2.6, h || 0.98, d || 0.9); break;
      case 'server_rack': mesh = buildServerRack(w || 1.1, h || 2.15, d || 0.9); break;
      case 'cryo_tank': mesh = buildCryoTank(w || 1.25, h || 2.25, d || 1.25); break;
      case 'spotlight_rig': mesh = buildSpotlightRig(w || 0.9, h || 1.9, d || 0.9); break;
      default: break;
    }

    if (!mesh) return;
    const baseLift = (f.y || 0) + (f.type === 'wall_art' ? (f.mountY || 1.85) : 0.11);
    mesh.position.set(f.x, baseLift, f.z);
    if (f.rotY) mesh.rotation.y = f.rotY;
    levelGroup.add(mesh);
  });
}
