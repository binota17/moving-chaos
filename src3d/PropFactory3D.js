// =========================================================================
// STYLIZED 3D PROP, TRUCK, TRAMPOLINE & LEVEL ARCHITECTURE FACTORY
// Generates charming Overcooked / Moving Out style 3D props and vehicles
// =========================================================================
import * as THREE from 'three';

const texCache = new Map();

function stdMat(color, roughness = 0.5, metalness = 0.06, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, ...opts });
}

function getProceduralTexture(key, drawFn, size = 256, repeat = false) {
  if (texCache.has(key)) return texCache.get(key);
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) drawFn(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  if ('SRGBColorSpace' in THREE) tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
  }
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  texCache.set(key, tex);
  return tex;
}

function createRoundedBoxGeo(w, h, d, radius = 0.06, smoothness = 3) {
  const shape = new THREE.Shape();
  const eps = 0.00001;
  const r = Math.min(radius, w * 0.45, d * 0.45) - eps;
  const hw = w / 2 - r;
  const hd = d / 2 - r;

  shape.absarc(-hw, -hd, r, Math.PI, Math.PI * 1.5, false);
  shape.absarc(hw, -hd, r, Math.PI * 1.5, Math.PI * 2, false);
  shape.absarc(hw, hd, r, 0, Math.PI * 0.5, false);
  shape.absarc(-hw, hd, r, Math.PI * 0.5, Math.PI, false);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.02, h - r * 2),
    bevelEnabled: true,
    bevelSegments: smoothness,
    steps: 1,
    bevelSize: r,
    bevelThickness: r
  });
  geo.rotateX(-Math.PI / 2);
  geo.center();
  return geo;
}

function getCardboardTex() {
  return getProceduralTexture('cardboard', (ctx, s) => {
    ctx.fillStyle = '#d4a373';
    ctx.fillRect(0, 0, s, s);
    // Subtle corrugated fibers
    ctx.fillStyle = 'rgba(120, 72, 28, 0.10)';
    for (let y = 0; y < s; y += 8) {
      ctx.fillRect(0, y, s, 2);
    }
    // Packing label
    ctx.fillStyle = '#fefce8';
    ctx.fillRect(s * 0.16, s * 0.24, s * 0.42, s * 0.28);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(s * 0.16, s * 0.24, s * 0.42, s * 0.07);
    ctx.fillStyle = '#1e293b';
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(s * (0.20 + i * 0.04), s * 0.36, i % 2 === 0 ? 4 : 2, s * 0.11);
    }
  });
}

function getTvScreenTex() {
  return getProceduralTexture('tv_screen', (ctx, s) => {
    const grad = ctx.createLinearGradient(0, 0, s, s);
    grad.addColorStop(0, '#0ea5e9');
    grad.addColorStop(0.55, '#6366f1');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);

    // Stylized landscape & bright sun graphic
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.arc(s * 0.72, s * 0.28, s * 0.13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(15,23,42,0.45)';
    ctx.beginPath();
    ctx.moveTo(0, s);
    ctx.lineTo(s * 0.32, s * 0.52);
    ctx.lineTo(s * 0.58, s * 0.74);
    ctx.lineTo(s * 0.82, s * 0.44);
    ctx.lineTo(s, s * 0.72);
    ctx.lineTo(s, s);
    ctx.closePath();
    ctx.fill();

    // Subtle scanlines
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let y = 0; y < s; y += 6) ctx.fillRect(0, y, s, 1);
  });
}

function getPianoKeysTex() {
  return getProceduralTexture('piano_keys', (ctx, s) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, s, s);
    const whiteCount = 14;
    const kw = s / whiteCount;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    for (let i = 0; i <= whiteCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * kw, 0);
      ctx.lineTo(i * kw, s);
      ctx.stroke();
    }
    ctx.fillStyle = '#0f172a';
    const pattern = [1, 1, 0, 1, 1, 1, 0];
    for (let i = 0; i < whiteCount - 1; i++) {
      if (pattern[i % 7]) {
        ctx.fillRect((i + 0.68) * kw, 0, kw * 0.62, s * 0.62);
      }
    }
  });
}

function getWoodTex(base = '#9a5b2c', grain = 'rgba(62, 32, 10, 0.16)') {
  return getProceduralTexture(`wood_${base}`, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = grain;
    for (let i = 0; i < 24; i++) {
      ctx.fillRect(0, (i / 24) * s, s, 2 + (i % 3));
    }
  });
}

function getFabricTex(base = '#e84118', weave = 'rgba(255,255,255,0.08)') {
  return getProceduralTexture(`fabric_${base}`, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = weave;
    for (let i = 0; i < s; i += 8) {
      ctx.fillRect(i, 0, 2, s);
      ctx.fillRect(0, i, s, 2);
    }
  });
}

function getTruckPadTex() {
  return getProceduralTexture('truck_pad_v2', (ctx, s) => {
    ctx.fillStyle = '#eef2f6';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, s - 8, s - 8);

    // Repeating Moving-Out style 4-way blue arrow loading tiles
    const cells = 3;
    const step = s / cells;
    ctx.fillStyle = '#3b82f6';
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const cx = (c + 0.5) * step;
        const cy = (r + 0.5) * step;
        for (let a = 0; a < 4; a++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((a * Math.PI) / 2 + Math.PI / 4);
          ctx.beginPath();
          ctx.moveTo(0, -step * 0.34);
          ctx.lineTo(step * 0.12, -step * 0.16);
          ctx.lineTo(step * 0.045, -step * 0.16);
          ctx.lineTo(step * 0.045, -step * 0.05);
          ctx.lineTo(-step * 0.045, -step * 0.05);
          ctx.lineTo(-step * 0.045, -step * 0.16);
          ctx.lineTo(-step * 0.12, -step * 0.16);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }, 256);
}

export function getLawnTex() {
  return getProceduralTexture('lawn_meadow_v1', (ctx, s) => {
    ctx.fillStyle = '#7ec850';
    ctx.fillRect(0, 0, s, s);
    // Subtle sunlit mowed stripes & clover patches
    ctx.fillStyle = 'rgba(155, 224, 96, 0.22)';
    for (let i = 0; i < 4; i += 2) {
      ctx.fillRect(0, (i / 4) * s, s, s / 4);
    }
    ctx.fillStyle = 'rgba(92, 168, 56, 0.18)';
    const patches = [[0.2, 0.25, 24], [0.7, 0.35, 30], [0.42, 0.78, 28], [0.85, 0.82, 20]];
    patches.forEach(([px, py, r]) => {
      ctx.beginPath();
      ctx.arc(px * s, py * s, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }, 256, true);
}

export function getFloorPatternTex(styleKey = 'polka_pink', baseHex = '#f47b8c') {
  const tex = getProceduralTexture(`floor_${styleKey}_${baseHex}`, (ctx, s) => {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, s, s);
    if (styleKey === 'polka_pink' || styleKey === 'polka_blue') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      const step = s / 4;
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const ox = (y % 2 === 0 ? 0.25 : 0.75) * step + x * step;
          const oy = (y + 0.5) * step;
          ctx.beginPath();
          ctx.arc(ox % s, oy, s * 0.068, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (styleKey === 'bistro_tile' || styleKey === 'bath_tile') {
      const cells = 4;
      const cs = s / cells;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          if ((x + y) % 2 === 0) ctx.fillRect(x * cs, y * cs, cs, cs);
        }
      }
      ctx.strokeStyle = 'rgba(30, 36, 44, 0.08)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= cells; i++) {
        ctx.beginPath(); ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * cs); ctx.lineTo(s, i * cs); ctx.stroke();
      }
    } else if (styleKey === 'parquet_lavender') {
      const planks = 6;
      const pw = s / planks;
      for (let i = 0; i < planks; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(60,30,110,0.06)';
        ctx.fillRect(0, i * pw, s, pw);
        ctx.fillStyle = 'rgba(60,30,110,0.10)';
        ctx.fillRect(0, i * pw, s, 2);
      }
    } else {
      // Industrial / Concrete / Warehouse clean floor tiles
      const cells = 4;
      const cs = s / cells;
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.12)';
      ctx.lineWidth = 3;
      for (let i = 0; i <= cells; i++) {
        ctx.beginPath(); ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * cs); ctx.lineTo(s, i * cs); ctx.stroke();
      }
    }
  }, 256, true);
  return tex;
}

function getBrickWallTex(baseHex = '#e69468', mortarHex = 'rgba(254, 243, 224, 0.35)') {
  return getProceduralTexture(`brick_${baseHex}`, (ctx, s) => {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, s, s);
    const rows = 8;
    const cols = 4;
    const rh = s / rows;
    const cw = s / cols;
    ctx.strokeStyle = mortarHex;
    ctx.lineWidth = 3;
    for (let r = 0; r < rows; r++) {
      const y = r * rh;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(s, y);
      ctx.stroke();
      const offset = (r % 2) * (cw * 0.5);
      for (let c = 0; c <= cols; c++) {
        const x = (c * cw + offset) % s;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + rh);
        ctx.stroke();
      }
      // Subtle brick shade variation
      ctx.fillStyle = r % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(120,40,10,0.06)';
      ctx.fillRect(((r * 73) % (s - cw)), y + 2, cw - 4, rh - 4);
    }
  }, 256, true);
}

function getPlasterWallTex(baseHex = '#7dd3fc') {
  return getProceduralTexture(`plaster_${baseHex}`, (ctx, s) => {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, s, s);
    // Subtle wainscot panel stripes like stylized diorama interiors
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(i * (s / 4) + 6, 10, s / 4 - 12, s - 20);
    }
    ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
    ctx.fillRect(0, s * 0.72, s, 4);
  }, 256, true);
}

/**
 * Builds either a low wooden garden picket fence (h < 1.5), an interior painted plaster wall,
 * or a cutaway exterior brick wall topped with a crisp cream cutaway cap.
 */
export function createDioramaWall3D(w, h, d, options = {}) {
  const isLowFence = h < 1.5;
  if (isLowFence) {
    const woodTex = getWoodTex('#c67b42', 'rgba(85, 42, 12, 0.18)');
    const railMat = stdMat(0xffffff, 0.72, 0.02, { map: woodTex, transparent: true, opacity: 1.0 });
    const baseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h * 0.22, d),
      railMat
    );
    baseMesh.position.y = h * 0.42;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;

    const alongZ = d >= w;
    const span = alongZ ? d : w;
    const postCount = Math.max(2, Math.round(span / 0.65));
    const linked = [];

    const topRail = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.16, d), railMat);
    topRail.position.y = h * 0.85 - h * 0.42;
    topRail.castShadow = true;
    baseMesh.add(topRail);
    linked.push(topRail);

    const picketW = alongZ ? w * 1.15 : Math.min(0.24, (span / postCount) * 0.62);
    const picketD = alongZ ? Math.min(0.24, (span / postCount) * 0.62) : d * 1.15;
    for (let i = 0; i <= postCount; i++) {
      const t = -span / 2 + 0.18 + ((span - 0.36) * i) / Math.max(1, postCount);
      const picket = new THREE.Mesh(
        createRoundedBoxGeo(picketW, h, picketD, 0.025, 1),
        railMat
      );
      picket.position.set(alongZ ? 0 : t, 0.08, alongZ ? t : 0);
      picket.castShadow = true;
      picket.receiveShadow = true;
      baseMesh.add(picket);
      linked.push(picket);
    }
    baseMesh.userData.linkedMeshes = linked;
    baseMesh.userData.overrideY = h * 0.42;
    return baseMesh;
  }

  const wallHex = options.wallHex || '#e59467';
  const baseTex = options.isInterior ? getPlasterWallTex(wallHex) : getBrickWallTex(wallHex);
  const tex = baseTex.clone();
  tex.needsUpdate = true;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  const longSpan = Math.max(w, d);
  tex.repeat.set(Math.max(1, longSpan / 2.2), Math.max(1, h / 1.8));

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: tex,
    roughness: options.isInterior ? 0.64 : 0.78,
    metalness: 0.02,
    transparent: true,
    opacity: 1.0
  });
  const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bodyMat);
  wallMesh.castShadow = true;
  wallMesh.receiveShadow = true;

  // Crisp cream cutaway top cap (classic Moving Out diorama rim)
  const capMat = new THREE.MeshStandardMaterial({
    color: options.capHex || 0xfef7e6,
    roughness: 0.55,
    metalness: 0.02,
    transparent: true,
    opacity: 1.0
  });
  const capMesh = new THREE.Mesh(
    createRoundedBoxGeo(w + 0.06, 0.11, d + 0.06, 0.03, 1),
    capMat
  );
  capMesh.position.y = h / 2 + 0.03;
  capMesh.castShadow = true;
  capMesh.receiveShadow = true;
  wallMesh.add(capMesh);

  // Clean cream baseboard trim along bottom edge
  const trimMesh = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.04, 0.12, d + 0.04),
    capMat
  );
  trimMesh.position.y = -h / 2 + 0.07;
  wallMesh.add(trimMesh);

  wallMesh.userData.linkedMeshes = [capMesh, trimMesh];
  return wallMesh;
}

function getTrampolineTex() {
  return getProceduralTexture('trampoline_mat', (ctx, s) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, s, s);
    const cx = s / 2;
    const cy = s / 2;
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.08, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function createPropMesh3D(itemDef) {
  const group = new THREE.Group();
  const type = itemDef.type || 'box';

  const enableShadows = (g) => {
    g.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  };

  switch (type) {
    case 'box': {
      const box = new THREE.Mesh(
        createRoundedBoxGeo(0.74, 0.62, 0.74, 0.05, 2),
        stdMat(0xffffff, 0.78, 0.02, { map: getCardboardTex() })
      );
      box.position.y = 0.31;
      // Top flap seam + tape strips
      const tapeTop = new THREE.Mesh(createRoundedBoxGeo(0.76, 0.04, 0.16, 0.015, 1), stdMat(0xfef3c7, 0.38));
      tapeTop.position.y = 0.61;
      const tapeFront = new THREE.Mesh(createRoundedBoxGeo(0.16, 0.14, 0.04, 0.01, 1), stdMat(0xfef3c7, 0.38));
      tapeFront.position.set(0, 0.54, 0.37);
      const tapeBack = tapeFront.clone();
      tapeBack.position.z = -0.37;
      // Red fragile/arrow sticker on front
      const sticker = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.02), stdMat(0xef4444, 0.45));
      sticker.position.set(0.16, 0.28, 0.375);
      group.add(box, tapeTop, tapeFront, tapeBack, sticker);
      break;
    }

    case 'chair': {
      const woodMat = stdMat(0xffffff, 0.55, 0.04, { map: getWoodTex('#a86434') });
      const cushionMat = stdMat(0xffffff, 0.82, 0.02, { map: getFabricTex('#0ea5e9') });
      const brassMat = stdMat(0xfbbf24, 0.25, 0.85);

      const frameSeat = new THREE.Mesh(createRoundedBoxGeo(0.62, 0.08, 0.62, 0.03, 2), woodMat);
      frameSeat.position.y = 0.39;
      const cushion = new THREE.Mesh(createRoundedBoxGeo(0.56, 0.11, 0.56, 0.05, 2), cushionMat);
      cushion.position.y = 0.46;

      const backPad = new THREE.Mesh(createRoundedBoxGeo(0.56, 0.46, 0.11, 0.045, 2), cushionMat);
      backPad.position.set(0, 0.72, -0.24);
      backPad.rotation.x = -0.08;

      const backFrame = new THREE.Mesh(createRoundedBoxGeo(0.62, 0.50, 0.06, 0.03, 2), woodMat);
      backFrame.position.set(0, 0.72, -0.28);
      backFrame.rotation.x = -0.08;

      group.add(frameSeat, cushion, backPad, backFrame);

      // Tapered angled legs with brass caps
      [[-0.23, -0.23, 0.07, 0.07], [0.23, -0.23, -0.07, 0.07], [-0.23, 0.23, 0.07, -0.07], [0.23, 0.23, -0.07, -0.07]].forEach(([lx, lz, rx, rz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.024, 0.38, 10), woodMat);
        leg.position.set(lx, 0.19, lz);
        leg.rotation.set(rz, 0, rx);
        const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.023, 0.07, 10), brassMat);
        tip.position.set(lx * 1.07, 0.035, lz * 1.07);
        tip.rotation.set(rz, 0, rx);
        group.add(leg, tip);
      });
      break;
    }

    case 'tv': {
      const darkBody = stdMat(0x1e293b, 0.32, 0.45);
      const metalStand = stdMat(0x94a3b8, 0.25, 0.85);
      const frame = new THREE.Mesh(createRoundedBoxGeo(1.18, 0.74, 0.10, 0.035, 2), darkBody);
      frame.position.y = 0.50;
      const rearBump = new THREE.Mesh(createRoundedBoxGeo(0.84, 0.46, 0.06, 0.02, 1), stdMat(0x0f172a, 0.5, 0.3));
      rearBump.position.set(0, 0.46, -0.06);

      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(1.06, 0.62),
        stdMat(0xffffff, 0.12, 0.05, {
          map: getTvScreenTex(),
          emissive: 0x38bdf8,
          emissiveMap: getTvScreenTex(),
          emissiveIntensity: 0.45
        })
      );
      screen.position.set(0, 0.50, 0.052);

      // Sleek dual V-stand legs
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.06), metalStand);
      neck.position.set(0, 0.12, -0.01);
      const footL = new THREE.Mesh(createRoundedBoxGeo(0.08, 0.04, 0.34, 0.015, 1), metalStand);
      footL.position.set(-0.22, 0.02, 0.04);
      footL.rotation.y = 0.3;
      const footR = footL.clone();
      footR.position.x = 0.22;
      footR.rotation.y = -0.3;
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), stdMat(0x22c55e, 0.2, 0, { emissive: 0x22c55e, emissiveIntensity: 1.4 }));
      led.position.set(0, 0.15, 0.054);

      group.add(frame, rearBump, screen, neck, footL, footR, led);
      break;
    }

    case 'sofa': {
      const fabric = stdMat(0xffffff, 0.85, 0.02, { map: getFabricTex('#dc2626') });
      const cushionMat = stdMat(0xffffff, 0.82, 0.02, { map: getFabricTex('#ef4444') });
      const pillowMat1 = stdMat(0xfbbf24, 0.82);
      const pillowMat2 = stdMat(0x38bdf8, 0.82);
      const woodLeg = stdMat(0x78350f, 0.5);

      const base = new THREE.Mesh(createRoundedBoxGeo(1.52, 0.26, 0.80, 0.06, 2), fabric);
      base.position.y = 0.23;

      const back = new THREE.Mesh(createRoundedBoxGeo(1.50, 0.52, 0.24, 0.08, 2), fabric);
      back.position.set(0, 0.56, -0.28);

      const armL = new THREE.Mesh(createRoundedBoxGeo(0.24, 0.44, 0.80, 0.08, 2), fabric);
      armL.position.set(-0.66, 0.40, 0);
      const armR = armL.clone();
      armR.position.x = 0.66;

      const seatL = new THREE.Mesh(createRoundedBoxGeo(0.56, 0.16, 0.58, 0.06, 2), cushionMat);
      seatL.position.set(-0.29, 0.41, 0.06);
      const seatR = seatL.clone();
      seatR.position.x = 0.29;

      // Cozy throw pillows
      const pillowL = new THREE.Mesh(createRoundedBoxGeo(0.28, 0.26, 0.12, 0.05, 2), pillowMat1);
      pillowL.position.set(-0.44, 0.56, -0.06);
      pillowL.rotation.set(-0.25, 0.35, 0.18);
      const pillowR = new THREE.Mesh(createRoundedBoxGeo(0.28, 0.26, 0.12, 0.05, 2), pillowMat2);
      pillowR.position.set(0.44, 0.56, -0.06);
      pillowR.rotation.set(-0.25, -0.35, -0.18);

      group.add(base, back, armL, armR, seatL, seatR, pillowL, pillowR);
      [[-0.64, -0.28], [0.64, -0.28], [-0.64, 0.28], [0.64, 0.28]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.03, 0.14, 10), woodLeg);
        leg.position.set(lx, 0.07, lz);
        group.add(leg);
      });
      break;
    }

    case 'vase': {
      // Sculpted LatheGeometry porcelain amphora profile
      const profile = [
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.16, 0.0),
        new THREE.Vector2(0.18, 0.06),
        new THREE.Vector2(0.25, 0.24),
        new THREE.Vector2(0.24, 0.38),
        new THREE.Vector2(0.10, 0.54),
        new THREE.Vector2(0.09, 0.64),
        new THREE.Vector2(0.15, 0.72),
        new THREE.Vector2(0.12, 0.72),
        new THREE.Vector2(0.07, 0.60)
      ];
      const porcelain = stdMat(0x2563eb, 0.12, 0.15);
      const vaseBody = new THREE.Mesh(new THREE.LatheGeometry(profile, 22), porcelain);
      const goldBand = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.018, 8, 24), stdMat(0xfbbf24, 0.2, 0.9));
      goldBand.rotation.x = Math.PI / 2;
      goldBand.position.y = 0.34;

      // Bouquet of flowers & leaves
      const stemMat = stdMat(0x16a34a, 0.6);
      const petalColors = [0xf43f5e, 0xfbbf24, 0xec4899];
      for (let i = 0; i < 3; i++) {
        const ang = (i / 3) * Math.PI * 2 + 0.3;
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 6), stemMat);
        stem.position.set(Math.cos(ang) * 0.05, 0.78, Math.sin(ang) * 0.05);
        stem.rotation.set(Math.sin(ang) * 0.22, 0, -Math.cos(ang) * 0.22);
        const blossom = new THREE.Mesh(new THREE.DodecahedronGeometry(0.095, 1), stdMat(petalColors[i], 0.45));
        blossom.position.set(Math.cos(ang) * 0.09, 0.94 + (i === 0 ? 0.04 : 0), Math.sin(ang) * 0.09);
        const center = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), stdMat(0xfef08a, 0.3));
        center.position.copy(blossom.position).add(new THREE.Vector3(0, 0.05, 0));
        group.add(stem, blossom, center);
      }
      group.add(vaseBody, goldBand);
      break;
    }

    case 'fridge': {
      const enamel = stdMat(0xe2e8f0, 0.24, 0.35);
      const chrome = stdMat(0x94a3b8, 0.2, 0.9);
      const cabinet = new THREE.Mesh(createRoundedBoxGeo(0.88, 1.48, 0.78, 0.06, 2), enamel);
      cabinet.position.y = 0.76;

      // Upper freezer door & lower fridge door
      const freezerDoor = new THREE.Mesh(createRoundedBoxGeo(0.84, 0.46, 0.08, 0.035, 2), stdMat(0xf1f5f9, 0.22, 0.3));
      freezerDoor.position.set(0, 1.24, 0.39);
      const mainDoor = new THREE.Mesh(createRoundedBoxGeo(0.84, 0.94, 0.08, 0.035, 2), stdMat(0xf1f5f9, 0.22, 0.3));
      mainDoor.position.set(0, 0.51, 0.39);

      const handleTop = new THREE.Mesh(createRoundedBoxGeo(0.055, 0.30, 0.06, 0.02, 1), chrome);
      handleTop.position.set(-0.31, 1.24, 0.45);
      const handleBot = new THREE.Mesh(createRoundedBoxGeo(0.055, 0.48, 0.06, 0.02, 1), chrome);
      handleBot.position.set(-0.31, 0.66, 0.45);

      // Ice/water dispenser recess + cute fridge magnets
      const dispenser = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.03), stdMat(0x1e293b, 0.4, 0.5));
      dispenser.position.set(0.08, 0.72, 0.425);
      const dispLed = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.035), stdMat(0x38bdf8, 0.1, 0, { emissive: 0x38bdf8, emissiveIntensity: 1.0 }));
      dispLed.position.set(0.08, 0.82, 0.43);

      const mag1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 10), stdMat(0xef4444, 0.4));
      mag1.rotation.x = Math.PI / 2;
      mag1.position.set(0.24, 1.28, 0.435);
      const mag2 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 10), stdMat(0xfacc15, 0.4));
      mag2.rotation.x = Math.PI / 2;
      mag2.position.set(0.16, 1.18, 0.435);

      group.add(cabinet, freezerDoor, mainDoor, handleTop, handleBot, dispenser, dispLed, mag1, mag2);
      break;
    }

    case 'piano': {
      const lacquer = stdMat(0x111827, 0.14, 0.3);
      const brass = stdMat(0xfbbf24, 0.22, 0.9);

      // Curved grand piano rim shape
      const shape = new THREE.Shape();
      shape.moveTo(-0.78, 0.34);
      shape.lineTo(0.78, 0.34);
      shape.lineTo(0.78, -0.05);
      shape.bezierCurveTo(0.78, -0.45, 0.32, -0.68, -0.15, -0.66);
      shape.bezierCurveTo(-0.62, -0.64, -0.78, -0.25, -0.78, 0.34);

      const bodyGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.32, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2 });
      bodyGeo.rotateX(-Math.PI / 2);
      const body = new THREE.Mesh(bodyGeo, lacquer);
      body.position.y = 0.48;

      // Golden soundboard & strings inside
      const soundboard = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 0.65), stdMat(0xd97706, 0.35, 0.7));
      soundboard.position.set(-0.08, 0.82, -0.12);

      // Propped open angled lid + brass prop stick
      const lidGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 1 });
      lidGeo.rotateX(-Math.PI / 2);
      const lid = new THREE.Mesh(lidGeo, lacquer);
      lid.position.set(0, 0.85, 0.14);
      lid.rotation.z = 0.38;

      const propStick = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.56, 8), brass);
      propStick.position.set(0.42, 1.06, -0.05);
      propStick.rotation.z = -0.22;

      // Keyboard deck + textured 88 keys + music stand
      const keyDeck = new THREE.Mesh(createRoundedBoxGeo(1.48, 0.12, 0.34, 0.025, 1), lacquer);
      keyDeck.position.set(0, 0.56, 0.42);
      const keybed = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.05, 0.24), stdMat(0xffffff, 0.25, 0, { map: getPianoKeysTex() }));
      keybed.position.set(0, 0.63, 0.44);
      const sheet = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.28, 0.03), stdMat(0xfefce8, 0.7));
      sheet.position.set(0, 0.95, 0.26);
      sheet.rotation.x = -0.28;

      group.add(body, soundboard, lid, propStick, keyDeck, keybed, sheet);

      // 3 sculpted legs with brass casters + pedal lyre
      [[-0.64, 0.44], [0.64, 0.44], [-0.12, -0.52]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.04, 0.48, 10), lacquer);
        leg.position.set(lx, 0.25, lz);
        const caster = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), brass);
        caster.position.set(lx, 0.045, lz);
        group.add(leg, caster);
      });
      break;
    }

    case 'safe': {
      const steel = stdMat(0x475569, 0.32, 0.78);
      const darkSteel = stdMat(0x1e293b, 0.4, 0.7);
      const gold = stdMat(0xfbbf24, 0.2, 0.92);

      const body = new THREE.Mesh(createRoundedBoxGeo(0.96, 0.98, 0.90, 0.06, 2), steel);
      body.position.y = 0.50;
      const door = new THREE.Mesh(createRoundedBoxGeo(0.80, 0.82, 0.06, 0.03, 2), stdMat(0x64748b, 0.28, 0.8));
      door.position.set(0, 0.50, 0.44);

      // Vault wheel hub + 3 spokes
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16), gold);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(0.08, 0.52, 0.49);
      const wheelRing = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.028, 10, 22), gold);
      wheelRing.position.set(0.08, 0.52, 0.51);
      for (let i = 0; i < 3; i++) {
        const ang = (i / 3) * Math.PI * 2;
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.36, 8), gold);
        spoke.position.set(0.08, 0.52, 0.51);
        spoke.rotation.z = ang;
        group.add(spoke);
      }

      // Digital keypad + hinges
      const keypad = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.04), darkSteel);
      keypad.position.set(-0.22, 0.62, 0.47);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.04, 0.045), stdMat(0x22c55e, 0.2, 0, { emissive: 0x22c55e, emissiveIntensity: 0.9 }));
      led.position.set(-0.22, 0.69, 0.475);
      [-0.24, 0.24].forEach((hy) => {
        const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 10), darkSteel);
        hinge.position.set(-0.41, 0.50 + hy, 0.44);
        group.add(hinge);
      });

      group.add(body, door, hub, wheelRing, keypad, led);
      break;
    }

    case 'aquarium': {
      const frameMat = stdMat(0x1e293b, 0.42, 0.5);
      const base = new THREE.Mesh(createRoundedBoxGeo(0.94, 0.08, 0.58, 0.03, 1), frameMat);
      base.position.y = 0.04;
      const hood = new THREE.Mesh(createRoundedBoxGeo(0.94, 0.08, 0.58, 0.03, 1), frameMat);
      hood.position.y = 0.60;
      const sand = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.07, 0.48), stdMat(0xfde68a, 0.9));
      sand.position.y = 0.10;
      const water = new THREE.Mesh(
        new THREE.BoxGeometry(0.86, 0.48, 0.50),
        stdMat(0x38bdf8, 0.06, 0.1, { transparent: true, opacity: 0.55, emissive: 0x0284c7, emissiveIntensity: 0.35 })
      );
      water.position.y = 0.34;

      // Coral/seaweed + 2 cute multi-part fish
      const weed1 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.28, 7), stdMat(0x22c55e, 0.65));
      weed1.position.set(-0.24, 0.24, -0.06);
      const weed2 = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.22, 7), stdMat(0x10b981, 0.65));
      weed2.position.set(-0.14, 0.20, 0.08);

      const addFish = (x, y, z, color, flip = 1) => {
        const fg = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), stdMat(color, 0.3));
        body.scale.set(1.45, 0.95, 0.65);
        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.10, 4), stdMat(color, 0.3));
        tail.rotation.z = flip * Math.PI / 2;
        tail.position.x = -flip * 0.14;
        fg.add(body, tail);
        fg.position.set(x, y, z);
        group.add(fg);
      };
      addFish(0.10, 0.37, 0.05, 0xf97316, 1);
      addFish(-0.08, 0.28, -0.08, 0xfacc15, -1);

      group.add(base, hood, sand, water, weed1, weed2);
      break;
    }

    case 'statue': {
      const marble = stdMat(0x7c2d12, 0.45, 0.15);
      const gold = stdMat(0xfbbf24, 0.18, 0.92, { emissive: 0x92400e, emissiveIntensity: 0.25 });
      const ped1 = new THREE.Mesh(createRoundedBoxGeo(0.62, 0.12, 0.62, 0.03, 1), marble);
      ped1.position.y = 0.06;
      const ped2 = new THREE.Mesh(createRoundedBoxGeo(0.48, 0.14, 0.48, 0.02, 1), marble);
      ped2.position.y = 0.18;
      const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.07, 0.02), gold);
      plaque.position.set(0, 0.18, 0.245);

      // Sculpted trophy / owl-cat figurine
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.34, 16), gold);
      torso.position.y = 0.42;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 14), gold);
      head.position.y = 0.66;
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 8), gold);
      earL.position.set(-0.11, 0.81, 0);
      earL.rotation.z = 0.25;
      const earR = earL.clone();
      earR.position.x = 0.11;
      earR.rotation.z = -0.25;
      const crown = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 8, 16), stdMat(0xfef08a, 0.15, 0.95));
      crown.rotation.x = Math.PI / 2;
      crown.position.y = 0.84;

      group.add(ped1, ped2, plaque, torso, head, earL, earR, crown);
      break;
    }

    case 'pc': {
      const chassis = stdMat(0x0f172a, 0.28, 0.65);
      const tower = new THREE.Mesh(createRoundedBoxGeo(0.46, 0.72, 0.68, 0.04, 2), chassis);
      tower.position.y = 0.36;
      const sideGlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.56, 0.54),
        stdMat(0x1e293b, 0.08, 0.2, { transparent: true, opacity: 0.65 })
      );
      sideGlass.position.set(0.23, 0.36, 0);

      // 3 glowing RGB fans inside!
      const rgbColors = [0xd946ef, 0x38bdf8, 0x22d3ee];
      rgbColors.forEach((col, i) => {
        const fan = new THREE.Mesh(
          new THREE.TorusGeometry(0.075, 0.018, 8, 18),
          stdMat(col, 0.1, 0, { emissive: col, emissiveIntensity: 1.4 })
        );
        fan.rotation.y = Math.PI / 2;
        fan.position.set(0.22, 0.20 + i * 0.16, 0.20);
        group.add(fan);
      });
      const gpuBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.04, 0.34),
        stdMat(0xa855f7, 0.1, 0, { emissive: 0xa855f7, emissiveIntensity: 1.3 })
      );
      gpuBar.position.set(0.22, 0.34, -0.05);

      group.add(tower, sideGlass, gpuBar);
      break;
    }

    case 'lamp': {
      const brass = stdMat(0xd97706, 0.24, 0.88);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.06, 18), brass);
      base.position.y = 0.03;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.78, 12), brass);
      pole.position.y = 0.44;
      const collar = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), brass);
      collar.position.y = 0.78;
      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.20, 0.34, 0.34, 20, 1, false),
        stdMat(0xfef9c3, 0.45, 0.0, { emissive: 0xfacc15, emissiveIntensity: 0.65 })
      );
      shade.position.y = 0.96;
      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), brass);
      finial.position.y = 1.15;
      group.add(base, pole, collar, shade, finial);
      break;
    }

    case 'plant': {
      const terracotta = stdMat(0xc2410c, 0.72);
      const potProfile = [
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.16, 0.0),
        new THREE.Vector2(0.23, 0.32),
        new THREE.Vector2(0.26, 0.32),
        new THREE.Vector2(0.26, 0.38),
        new THREE.Vector2(0.20, 0.38),
        new THREE.Vector2(0.18, 0.30)
      ];
      const pot = new THREE.Mesh(new THREE.LatheGeometry(potProfile, 18), terracotta);
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.04, 14), stdMat(0x451a03, 0.95));
      soil.position.y = 0.31;

      const leafMat1 = stdMat(0x16a34a, 0.55);
      const leafMat2 = stdMat(0x22c55e, 0.50);
      group.add(pot, soil);
      for (let i = 0; i < 7; i++) {
        const ang = (i / 7) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), i % 2 === 0 ? leafMat1 : leafMat2);
        leaf.scale.set(1.2, 0.32, 0.75);
        leaf.position.set(Math.cos(ang) * 0.18, 0.52 + (i % 2) * 0.11, Math.sin(ang) * 0.18);
        leaf.rotation.set(0.35 * Math.sin(ang), -ang, -0.35 * Math.cos(ang));
        group.add(leaf);
      }
      const centerTop = new THREE.Mesh(new THREE.DodecahedronGeometry(0.15, 1), leafMat2);
      centerTop.position.y = 0.66;
      group.add(centerTop);
      break;
    }

    case 'teddy': {
      const fur = stdMat(0xb45309, 0.88);
      const bellyMat = stdMat(0xfde68a, 0.85);
      const noseMat = stdMat(0x1e293b, 0.2);

      const torso = new THREE.Mesh(new THREE.SphereGeometry(0.25, 14, 12), fur);
      torso.scale.set(1, 1.08, 0.88);
      torso.position.y = 0.29;
      const belly = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), bellyMat);
      belly.scale.set(0.95, 1.0, 0.45);
      belly.position.set(0, 0.28, 0.18);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 14, 12), fur);
      head.position.y = 0.62;
      const snout = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 10), bellyMat);
      snout.scale.set(1.1, 0.85, 0.85);
      snout.position.set(0, 0.58, 0.18);
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), noseMat);
      nose.position.set(0, 0.60, 0.255);

      const earL = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), fur);
      earL.position.set(-0.16, 0.78, 0);
      const earR = earL.clone();
      earR.position.x = 0.16;

      const armL = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 10), fur);
      armL.scale.set(0.8, 1.4, 0.8);
      armL.position.set(-0.24, 0.35, 0.05);
      armL.rotation.z = 0.4;
      const armR = armL.clone();
      armR.position.x = 0.24;
      armR.rotation.z = -0.4;

      const legL = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 10), fur);
      legL.scale.set(0.9, 0.8, 1.35);
      legL.position.set(-0.14, 0.10, 0.14);
      const legR = legL.clone();
      legR.position.x = 0.14;

      const bow = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.07, 0.06), stdMat(0xef4444, 0.5));
      bow.position.set(0, 0.46, 0.21);

      group.add(torso, belly, head, snout, nose, earL, earR, armL, armR, legL, legR, bow);
      break;
    }

    case 'pet': {
      const coat = stdMat(0xf97316, 0.78);
      const cream = stdMat(0xfef3c7, 0.8);
      const dark = stdMat(0x0f172a, 0.15, 0.1);
      const collarMat = stdMat(0xef4444, 0.35);
      const bellMat = stdMat(0xfacc15, 0.2, 0.9);

      const torso = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), coat);
      torso.scale.set(0.95, 0.88, 1.32);
      torso.position.set(0, 0.24, -0.02);

      const chest = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), cream);
      chest.position.set(0, 0.22, 0.17);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 14, 12), coat);
      head.position.set(0, 0.44, 0.22);

      const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), cream);
      muzzle.scale.set(1.15, 0.82, 0.9);
      muzzle.position.set(0, 0.39, 0.38);

      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), dark);
      nose.position.set(0, 0.42, 0.45);

      [-0.08, 0.08].forEach((ex) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), dark);
        eye.position.set(ex, 0.48, 0.40);
        const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), stdMat(0xfb7185, 0.6));
        cheek.position.set(ex * 1.65, 0.42, 0.35);
        group.add(eye, cheek);
      });

      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.14, 8), coat);
      earL.position.set(-0.13, 0.63, 0.20);
      earL.rotation.z = 0.25;
      const earR = earL.clone();
      earR.position.x = 0.13;
      earR.rotation.z = -0.25;

      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 8, 16), collarMat);
      collar.rotation.x = Math.PI / 2.3;
      collar.position.set(0, 0.33, 0.15);
      const bell = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), bellMat);
      bell.position.set(0, 0.27, 0.29);

      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.28, 8), coat);
      tail.position.set(0, 0.34, -0.34);
      tail.rotation.x = -0.75;

      [[-0.12, 0.16], [0.12, 0.16], [-0.12, -0.18], [0.12, -0.18]].forEach(([px, pz]) => {
        const paw = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.16, 8), cream);
        paw.position.set(px, 0.08, pz);
        group.add(paw);
      });

      group.add(torso, chest, head, muzzle, nose, earL, earR, collar, bell, tail);
      break;
    }

    case 'bed': {
      const woodMat = stdMat(0xffffff, 0.62, 0.04, { map: getWoodTex('#9a5b2c') });
      const sheetMat = stdMat(0xfef9c3, 0.85);
      const blanketMat = stdMat(0xffffff, 0.82, 0.02, { map: getFabricTex('#0ea5e9') });
      const pillowMat = stdMat(0xffffff, 0.85);

      const frame = new THREE.Mesh(createRoundedBoxGeo(1.18, 0.22, 1.48, 0.05, 2), woodMat);
      frame.position.y = 0.20;
      const headBoard = new THREE.Mesh(createRoundedBoxGeo(1.18, 0.64, 0.12, 0.04, 2), woodMat);
      headBoard.position.set(0, 0.48, -0.68);
      const mattress = new THREE.Mesh(createRoundedBoxGeo(1.08, 0.20, 1.36, 0.05, 2), sheetMat);
      mattress.position.set(0, 0.36, 0.02);
      const blanket = new THREE.Mesh(createRoundedBoxGeo(1.12, 0.14, 0.84, 0.05, 2), blanketMat);
      blanket.position.set(0, 0.42, 0.28);

      [-0.28, 0.28].forEach((px) => {
        const pillow = new THREE.Mesh(createRoundedBoxGeo(0.42, 0.12, 0.28, 0.05, 2), pillowMat);
        pillow.position.set(px, 0.49, -0.44);
        pillow.rotation.x = 0.15;
        group.add(pillow);
      });
      [[-0.50, -0.64], [0.50, -0.64], [-0.50, 0.64], [0.50, 0.64]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.14, 8), woodMat);
        leg.position.set(lx, 0.07, lz);
        group.add(leg);
      });
      group.add(frame, headBoard, mattress, blanket);
      break;
    }

    case 'washer': {
      const enamel = stdMat(0xf8fafc, 0.25, 0.25);
      const chrome = stdMat(0xcbd5e1, 0.18, 0.88);
      const body = new THREE.Mesh(createRoundedBoxGeo(0.84, 0.96, 0.80, 0.06, 2), enamel);
      body.position.y = 0.48;
      const topPanel = new THREE.Mesh(createRoundedBoxGeo(0.82, 0.16, 0.78, 0.03, 1), stdMat(0xe2e8f0, 0.3, 0.3));
      topPanel.position.set(0, 0.90, 0.01);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.045, 10, 24), chrome);
      rim.position.set(0, 0.46, 0.40);
      const doorGlass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.06, 20),
        stdMat(0x38bdf8, 0.08, 0.1, { transparent: true, opacity: 0.65, emissive: 0x0284c7, emissiveIntensity: 0.28 })
      );
      doorGlass.rotation.x = Math.PI / 2;
      doorGlass.position.set(0, 0.46, 0.39);
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 12), stdMat(0x334155, 0.3, 0.6));
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0.22, 0.90, 0.40);
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), stdMat(0x22c55e, 0.2, 0, { emissive: 0x22c55e, emissiveIntensity: 1.4 }));
      led.position.set(-0.24, 0.90, 0.40);
      const drawer = new THREE.Mesh(createRoundedBoxGeo(0.24, 0.09, 0.04, 0.015, 1), stdMat(0xcbd5e1, 0.35));
      drawer.position.set(-0.22, 0.90, 0.395);

      group.add(body, topPanel, rim, doorGlass, dial, led, drawer);
      break;
    }

    case 'stove': {
      const steel = stdMat(0xe2e8f0, 0.28, 0.72);
      const dark = stdMat(0x1e293b, 0.45, 0.55);
      const body = new THREE.Mesh(createRoundedBoxGeo(0.92, 0.88, 0.82, 0.05, 2), steel);
      body.position.y = 0.44;
      const cookTop = new THREE.Mesh(createRoundedBoxGeo(0.94, 0.06, 0.84, 0.02, 1), dark);
      cookTop.position.y = 0.89;
      const backGuard = new THREE.Mesh(createRoundedBoxGeo(0.94, 0.26, 0.08, 0.02, 1), steel);
      backGuard.position.set(0, 1.02, -0.37);

      const ovenWin = new THREE.Mesh(
        createRoundedBoxGeo(0.66, 0.42, 0.05, 0.02, 1),
        stdMat(0xfb923c, 0.15, 0.2, { emissive: 0xf97316, emissiveIntensity: 0.55 })
      );
      ovenWin.position.set(0, 0.38, 0.41);
      const ovenHandle = new THREE.Mesh(createRoundedBoxGeo(0.68, 0.045, 0.06, 0.015, 1), stdMat(0x94a3b8, 0.2, 0.88));
      ovenHandle.position.set(0, 0.64, 0.44);

      [[-0.22, -0.18], [0.22, -0.18], [-0.22, 0.18], [0.22, 0.18]].forEach(([bx, bz]) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 8, 16), stdMat(0x38bdf8, 0.2, 0, { emissive: 0x0ea5e9, emissiveIntensity: 0.8 }));
        ring.rotation.x = Math.PI / 2;
        ring.position.set(bx, 0.93, bz);
        group.add(ring);
      });
      [-0.30, -0.10, 0.10, 0.30].forEach((kx) => {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.04, 10), dark);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(kx, 0.78, 0.42);
        group.add(knob);
      });
      group.add(body, cookTop, backGuard, ovenWin, ovenHandle);
      break;
    }

    case 'dining_table': {
      const woodMat = stdMat(0xffffff, 0.52, 0.04, { map: getWoodTex('#b46b35') });
      const top = new THREE.Mesh(createRoundedBoxGeo(1.48, 0.10, 0.94, 0.04, 2), woodMat);
      top.position.y = 0.64;
      const runner = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.02, 0.28), stdMat(0xef4444, 0.82));
      runner.position.y = 0.70;
      group.add(top, runner);

      [-0.38, 0.38].forEach((px) => {
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.03, 14), stdMat(0xf8fafc, 0.2));
        plate.position.set(px, 0.71, 0.24);
        group.add(plate);
      });
      [[-0.60, -0.34], [0.60, -0.34], [-0.60, 0.34], [0.60, 0.34]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.038, 0.60, 10), woodMat);
        leg.position.set(lx, 0.30, lz);
        group.add(leg);
      });
      break;
    }

    case 'bookshelf': {
      const oak = stdMat(0xffffff, 0.62, 0.04, { map: getWoodTex('#8c4f24') });
      const frame = new THREE.Mesh(createRoundedBoxGeo(0.96, 1.32, 0.42, 0.035, 2), oak);
      frame.position.y = 0.66;
      const recess = new THREE.Mesh(new THREE.BoxGeometry(0.84, 1.18, 0.34), stdMat(0x5b3419, 0.85));
      recess.position.set(0, 0.66, 0.05);
      group.add(frame, recess);

      [0.34, 0.72, 1.08].forEach((sy, sIdx) => {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.05, 0.38), oak);
        shelf.position.set(0, sy, 0.03);
        group.add(shelf);
        const bookColors = [0xef4444, 0x3b82f6, 0xfacc15, 0x22c55e, 0xa855f7];
        for (let b = 0; b < 5; b++) {
          const bk = new THREE.Mesh(
            createRoundedBoxGeo(0.08, 0.22 + ((b + sIdx) % 2) * 0.05, 0.24, 0.01, 1),
            stdMat(bookColors[(b + sIdx) % bookColors.length], 0.7)
          );
          bk.position.set(-0.30 + b * 0.12, sy + 0.14, 0.06);
          if (b === 4) bk.rotation.z = -0.22;
          group.add(bk);
        }
      });
      break;
    }

    case 'drum': {
      const steelBlue = stdMat(0x2563eb, 0.38, 0.55);
      const bandMat = stdMat(0xfacc15, 0.35, 0.35);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.88, 20), steelBlue);
      body.rotation.z = Math.PI / 2;
      body.position.y = 0.36;
      [-0.24, 0.24].forEach((bx) => {
        const rib = new THREE.Mesh(new THREE.TorusGeometry(0.365, 0.032, 8, 22), bandMat);
        rib.rotation.y = Math.PI / 2;
        rib.position.set(bx, 0.36, 0);
        group.add(rib);
      });
      const hazard = new THREE.Mesh(new THREE.CylinderGeometry(0.366, 0.366, 0.22, 20), bandMat);
      hazard.rotation.z = Math.PI / 2;
      hazard.position.y = 0.36;
      group.add(body, hazard);
      break;
    }

    case 'generator': {
      const cageMat = stdMat(0x1e293b, 0.45, 0.72);
      const tankMat = stdMat(0xf59e0b, 0.35, 0.25);
      const engineMat = stdMat(0x64748b, 0.32, 0.82);

      const engine = new THREE.Mesh(createRoundedBoxGeo(0.76, 0.52, 0.58, 0.04, 2), engineMat);
      engine.position.y = 0.32;
      const tank = new THREE.Mesh(createRoundedBoxGeo(0.80, 0.24, 0.62, 0.05, 2), tankMat);
      tank.position.y = 0.68;
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.36, 0.04), stdMat(0x0f172a, 0.4, 0.6));
      panel.position.set(0.18, 0.36, 0.30);
      const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12), stdMat(0xfef9c3, 0.2));
      gauge.rotation.x = Math.PI / 2;
      gauge.position.set(0.18, 0.42, 0.325);
      const muffler = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.26, 10), cageMat);
      muffler.position.set(-0.34, 0.55, -0.18);

      // Tubular corner posts
      [[-0.42, -0.32], [0.42, -0.32], [-0.42, 0.32], [0.42, 0.32]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.86, 8), cageMat);
        post.position.set(px, 0.43, pz);
        group.add(post);
      });
      const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.90, 0.05, 0.70), cageMat);
      topRail.position.y = 0.85;
      group.add(engine, tank, panel, gauge, muffler, topRail);
      break;
    }

    case 'briefcase': {
      const caseMat = stdMat(0x334155, 0.32, 0.55);
      const chrome = stdMat(0xfbbf24, 0.2, 0.9);
      const body = new THREE.Mesh(createRoundedBoxGeo(0.72, 0.24, 0.52, 0.04, 2), caseMat);
      body.position.y = 0.14;
      const lid = new THREE.Mesh(createRoundedBoxGeo(0.72, 0.10, 0.52, 0.03, 2), caseMat);
      lid.position.set(0, 0.29, -0.02);
      lid.rotation.x = -0.14;
      const bills = new THREE.Mesh(createRoundedBoxGeo(0.56, 0.08, 0.36, 0.01, 1), stdMat(0x22c55e, 0.75));
      bills.position.set(0, 0.24, 0.02);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.022, 8, 14, Math.PI), chrome);
      handle.rotation.x = Math.PI / 2;
      handle.position.set(0, 0.18, 0.28);
      [-0.20, 0.20].forEach((lx) => {
        const latch = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, 0.03), chrome);
        latch.position.set(lx, 0.23, 0.265);
        group.add(latch);
      });
      group.add(body, lid, bills, handle);
      break;
    }

    case 'treasure': {
      const wood = stdMat(0xffffff, 0.58, 0.05, { map: getWoodTex('#8c4f24') });
      const gold = stdMat(0xfbbf24, 0.18, 0.92, { emissive: 0xb45309, emissiveIntensity: 0.2 });
      const base = new THREE.Mesh(createRoundedBoxGeo(0.82, 0.42, 0.56, 0.04, 2), wood);
      base.position.y = 0.21;
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.82, 14, 1, false, 0, Math.PI), wood);
      lid.rotation.z = Math.PI / 2;
      lid.position.y = 0.42;
      [-0.28, 0.28].forEach((sx) => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.46, 0.59), gold);
        strap.position.set(sx, 0.24, 0);
        group.add(strap);
      });
      const lock = new THREE.Mesh(createRoundedBoxGeo(0.14, 0.18, 0.05, 0.02, 1), gold);
      lock.position.set(0, 0.36, 0.29);
      group.add(base, lid, lock);
      break;
    }

    case 'console': {
      const shell = stdMat(0xf1f5f9, 0.32, 0.08);
      const trim = stdMat(0x6366f1, 0.35, 0.2);
      const deck = new THREE.Mesh(createRoundedBoxGeo(0.76, 0.18, 0.56, 0.04, 2), shell);
      deck.position.y = 0.10;
      const cartSlot = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.10), trim);
      cartSlot.position.set(0, 0.22, -0.08);
      const powerLed = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), stdMat(0xef4444, 0.2, 0, { emissive: 0xef4444, emissiveIntensity: 1.4 }));
      powerLed.position.set(-0.24, 0.19, 0.18);
      [-0.22, 0.22].forEach((cx) => {
        const pad = new THREE.Mesh(createRoundedBoxGeo(0.22, 0.06, 0.14, 0.02, 1), stdMat(0x334155, 0.45));
        pad.position.set(cx, 0.04, 0.42);
        const btn = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), stdMat(0xef4444, 0.3));
        btn.position.set(cx + 0.05, 0.075, 0.42);
        group.add(pad, btn);
      });
      group.add(deck, cartSlot, powerLed);
      break;
    }

    case 'toilet': {
      const porcelain = stdMat(0xffffff, 0.14, 0.08);
      const seatWood = stdMat(0xfbbf24, 0.45);
      const chrome = stdMat(0xcbd5e1, 0.18, 0.9);
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.32, 14), porcelain);
      ped.position.set(0, 0.16, 0.06);
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.18, 0.22, 16), porcelain);
      bowl.position.set(0, 0.36, 0.08);
      const seat = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.045, 8, 18), seatWood);
      seat.rotation.x = Math.PI / 2;
      seat.position.set(0, 0.48, 0.08);
      const tank = new THREE.Mesh(createRoundedBoxGeo(0.46, 0.44, 0.22, 0.04, 2), porcelain);
      tank.position.set(0, 0.58, -0.20);
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.03, 0.04), chrome);
      handle.position.set(-0.22, 0.72, -0.10);
      group.add(ped, bowl, seat, tank, handle);
      break;
    }

    case 'pot_soup': {
      const steel = stdMat(0xcbd5e1, 0.2, 0.88);
      const soup = stdMat(0xf59e0b, 0.12, 0.05, { emissive: 0xd97706, emissiveIntensity: 0.35 });
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.34, 0.48, 20), steel);
      pot.position.y = 0.24;
      const broth = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 18), soup);
      broth.position.y = 0.46;
      const ladle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 8), steel);
      ladle.position.set(0.14, 0.56, 0.05);
      ladle.rotation.z = -0.45;
      [-0.38, 0.38].forEach((hx) => {
        const ear = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 6, 12), steel);
        ear.position.set(hx, 0.36, 0);
        group.add(ear);
      });
      group.add(pot, broth, ladle);
      break;
    }

    case 'yoga_ball': {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.40, 20, 16), stdMat(0xec4899, 0.35, 0.04));
      ball.position.y = 0.40;
      const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.398, 0.035, 8, 24), stdMat(0xfef08a, 0.4));
      stripe.rotation.x = Math.PI / 2;
      stripe.position.y = 0.40;
      group.add(ball, stripe);
      break;
    }

    case 'toolbox': {
      const redSteel = stdMat(0xdc2626, 0.34, 0.52);
      const chrome = stdMat(0xcbd5e1, 0.2, 0.9);
      const base = new THREE.Mesh(createRoundedBoxGeo(0.76, 0.44, 0.46, 0.04, 2), redSteel);
      base.position.y = 0.22;
      const lid = new THREE.Mesh(createRoundedBoxGeo(0.78, 0.14, 0.48, 0.03, 2), redSteel);
      lid.position.y = 0.48;
      const handle = new THREE.Mesh(createRoundedBoxGeo(0.30, 0.05, 0.06, 0.015, 1), chrome);
      handle.position.y = 0.58;
      [-0.22, 0.22].forEach((lx) => {
        const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.03), chrome);
        clasp.position.set(lx, 0.40, 0.24);
        group.add(clasp);
      });
      group.add(base, lid, handle);
      break;
    }

    default: {
      const cube = new THREE.Mesh(createRoundedBoxGeo(0.70, 0.62, 0.70, 0.05, 2), stdMat(0xf59e0b, 0.55));
      cube.position.y = 0.31;
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.72), stdMat(0xef4444, 0.4));
      band.position.y = 0.34;
      group.add(cube, band);
      break;
    }
  }

  // Floor ring badges communicating item behavior cleanly at a glance
  if (itemDef.isFragile) {
    const badge = new THREE.Mesh(
      new THREE.RingGeometry(0.40, 0.48, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
    );
    badge.rotation.x = -Math.PI / 2;
    badge.position.y = 0.03;
    group.add(badge);
  } else if (itemDef.isLiving) {
    const badge = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.52, 24),
      new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide })
    );
    badge.rotation.x = -Math.PI / 2;
    badge.position.y = 0.03;
    group.add(badge);
  } else if (itemDef.isBouncy) {
    const badge = new THREE.Mesh(
      new THREE.RingGeometry(0.40, 0.49, 24),
      new THREE.MeshBasicMaterial({ color: 0xc084fc, side: THREE.DoubleSide })
    );
    badge.rotation.x = -Math.PI / 2;
    badge.position.y = 0.03;
    group.add(badge);
  } else if (itemDef.isRolling) {
    const badge = new THREE.Mesh(
      new THREE.RingGeometry(0.41, 0.50, 24),
      new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
    );
    badge.rotation.x = -Math.PI / 2;
    badge.position.y = 0.03;
    group.add(badge);
  } else if (itemDef.isCarryOnly || itemDef.isSuperHeavy || itemDef.isHeavy) {
    const outerRing = new THREE.Mesh(
      new THREE.RingGeometry(0.49, 0.62, 24),
      new THREE.MeshBasicMaterial({ color: 0xea580c, side: THREE.DoubleSide })
    );
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.032;
    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(0.37, 0.43, 24),
      new THREE.MeshBasicMaterial({ color: 0xfdba74, side: THREE.DoubleSide })
    );
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.032;
    const lugMat = stdMat(0xea580c, 0.35);
    [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach((ang) => {
      const lug = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.03, 0.08), lugMat);
      lug.position.set(Math.cos(ang) * 0.56, 0.038, Math.sin(ang) * 0.56);
      lug.rotation.y = -ang;
      group.add(lug);
    });
    group.add(outerRing, innerRing);
  }

  enableShadows(group);
  return group;
}

export function createTruck3D() {
  const truck = new THREE.Group();
  const bodyGroup = new THREE.Group();
  const cargoMount = new THREE.Group();
  truck.add(bodyGroup);
  bodyGroup.add(cargoMount);
  truck.userData.bodyGroup = bodyGroup;
  truck.userData.cargoMount = cargoMount;

  // Chassis rails underneath
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.24, 9.2), stdMat(0x1e293b, 0.65, 0.5));
  chassis.position.set(0, 0.36, 0.8);
  bodyGroup.add(chassis);

  // Open cargo bed (Drop-off Zone!)
  const bedFloor = new THREE.Mesh(createRoundedBoxGeo(4.4, 0.26, 4.8, 0.06, 2), stdMat(0xcbd5e1, 0.65));
  bedFloor.position.set(0, 0.48, 0);
  bedFloor.receiveShadow = true;
  bodyGroup.add(bedFloor);

  // Moving Out signature light gray/blue arrow cargo floor pad
  const targetPad = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 4.4),
    new THREE.MeshBasicMaterial({ map: getTruckPadTex() })
  );
  targetPad.rotation.x = -Math.PI / 2;
  targetPad.position.set(0, 0.62, 0);
  bodyGroup.add(targetPad);

  // Side walls of cargo bed (-X is OPEN loading entrance with glowing green ramp lip!)
  const railMat = stdMat(0x94a3b8, 0.42, 0.22);
  const railTrimMat = stdMat(0xfef7e6, 0.38);
  const entryLip = new THREE.Mesh(
    createRoundedBoxGeo(0.42, 0.14, 4.5, 0.04, 1),
    stdMat(0x22c55e, 0.35, 0.08, { emissive: 0x16a34a, emissiveIntensity: 0.35 })
  );
  entryLip.position.set(-2.24, 0.48, 0);

  const railR = new THREE.Mesh(createRoundedBoxGeo(0.22, 0.92, 4.8, 0.04, 2), railMat);
  railR.position.set(2.12, 0.98, 0);
  const railRStripe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.14, 4.6), railTrimMat);
  railRStripe.position.set(2.12, 1.04, 0);

  const railBack = new THREE.Mesh(createRoundedBoxGeo(4.4, 0.92, 0.22, 0.04, 2), railMat);
  railBack.position.set(0, 0.98, -2.3);
  const railFront = new THREE.Mesh(createRoundedBoxGeo(4.4, 1.15, 0.22, 0.04, 2), railMat);
  railFront.position.set(0, 1.08, 2.3);
  bodyGroup.add(entryLip, railR, railRStripe, railBack, railFront);

  // Driver Cabin (Front - Coral Toybox Orange)
  const cab = new THREE.Mesh(createRoundedBoxGeo(4.2, 2.15, 2.3, 0.16, 2), stdMat(0xef4f27, 0.34, 0.1));
  cab.position.set(0, 1.52, 3.55);
  cab.castShadow = true;
  bodyGroup.add(cab);

  // Roof deflector / sun visor
  const visor = new THREE.Mesh(createRoundedBoxGeo(3.8, 0.28, 0.65, 0.08, 2), stdMat(0xffd84d, 0.32, 0.12));
  visor.position.set(0, 2.66, 3.7);
  bodyGroup.add(visor);

  // Tinted windshield & side mirrors
  const windshield = new THREE.Mesh(
    createRoundedBoxGeo(3.6, 0.92, 0.12, 0.04, 1),
    stdMat(0x93c5fd, 0.08, 0.25, { emissive: 0x38bdf8, emissiveIntensity: 0.15 })
  );
  windshield.position.set(0, 1.92, 4.68);
  const grille = new THREE.Mesh(createRoundedBoxGeo(2.8, 0.54, 0.10, 0.03, 1), stdMat(0x1e293b, 0.4, 0.65));
  grille.position.set(0, 0.98, 4.70);
  const bumper = new THREE.Mesh(createRoundedBoxGeo(4.36, 0.28, 0.34, 0.05, 1), stdMat(0xe2e8f0, 0.3, 0.65));
  bumper.position.set(0, 0.55, 4.72);
  bodyGroup.add(windshield, grille, bumper);

  // Headlights & Taillights
  [-1.65, 1.65].forEach((lx) => {
    const headlight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12),
      stdMat(0xfef08a, 0.1, 0.1, { emissive: 0xfacc15, emissiveIntensity: 1.2 })
    );
    headlight.rotation.x = Math.PI / 2;
    headlight.position.set(lx, 0.98, 4.72);
    const taillight = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.14, 0.08),
      stdMat(0xef4444, 0.2, 0, { emissive: 0xdc2626, emissiveIntensity: 0.9 })
    );
    taillight.position.set(lx, 0.56, -2.42);
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.40, 0.14), stdMat(0x1e293b, 0.4));
    mirror.position.set(lx > 0 ? 2.26 : -2.26, 1.88, 4.0);
    bodyGroup.add(headlight, taillight, mirror);
  });

  // Chunky Tires with alloy rims & hubcaps (anchored to road while bodyGroup bounces)
  const tireMat = stdMat(0x18181b, 0.85);
  const rimMat = stdMat(0xcbd5e1, 0.25, 0.85);
  [[-2.2, -1.45], [2.2, -1.45], [-2.2, 3.25], [2.2, 3.25]].forEach(([wx, wz]) => {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.46, 20), tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.position.set(wx, 0.56, wz);
    tire.castShadow = true;
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.48, 16), rimMat);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(wx, 0.56, wz);
    truck.add(tire, rim);
  });

  return truck;
}

export function createTrampoline3D() {
  const group = new THREE.Group();
  const frameSteel = stdMat(0x475569, 0.35, 0.75);
  const padMat = stdMat(0x2563eb, 0.45);
  const springMat = stdMat(0xcbd5e1, 0.2, 0.9);

  // 6 sturdy tubular legs
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.28, 10), frameSteel);
    leg.position.set(Math.cos(ang) * 1.48, 0.14, Math.sin(ang) * 1.48);
    group.add(leg);
  }

  // Padded outer torus ring
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.46, 0.18, 12, 32), padMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.26;
  rim.castShadow = true;
  rim.receiveShadow = true;

  // Radial springs
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.24), springMat);
    sp.position.set(Math.cos(ang) * 1.32, 0.26, Math.sin(ang) * 1.32);
    sp.rotation.y = -ang + Math.PI / 2;
    group.add(sp);
  }

  // Bounce mat with high-contrast target graphic
  const mat = new THREE.Mesh(
    new THREE.CylinderGeometry(1.24, 1.24, 0.08, 28),
    stdMat(0xffffff, 0.35, 0.05, {
      map: getTrampolineTex(),
      emissive: 0x0891b2,
      emissiveMap: getTrampolineTex(),
      emissiveIntensity: 0.35
    })
  );
  mat.position.y = 0.25;

  group.add(rim, mat);
  return group;
}

export function createGlassWall3D(w, h, d) {
  const group = new THREE.Group();
  const pane = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    stdMat(0x93e6fb, 0.08, 0.12, { transparent: true, opacity: 0.42, emissive: 0x38bdf8, emissiveIntensity: 0.18 })
  );
  pane.position.y = h / 2;

  // Warm cream cutaway architectural window sill & mullions
  const frameMat = stdMat(0xfef7e6, 0.52, 0.04);
  const t = 0.09;
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(w + t, t, d + 0.08), frameMat);
  topBar.position.y = h;
  const botBar = new THREE.Mesh(new THREE.BoxGeometry(w + t, t * 2.2, d + 0.10), frameMat);
  botBar.position.y = t * 1.1;
  const leftBar = new THREE.Mesh(new THREE.BoxGeometry(t, h, d + 0.08), frameMat);
  leftBar.position.set(-w / 2, h / 2, 0);
  const rightBar = leftBar.clone();
  rightBar.position.x = w / 2;

  group.add(pane, topBar, botBar, leftBar, rightBar);
  return group;
}
