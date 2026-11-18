// =========================================================================
// STYLIZED 3D PROP, TRUCK, TRAMPOLINE & LEVEL ARCHITECTURE FACTORY
// Generates charming Overcooked / Fall Guys style 3D props and rooms
// =========================================================================
import * as THREE from 'three';

function stdMat(color, roughness = 0.55, metalness = 0.05, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, ...opts });
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
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.62, 0.7), stdMat(0xd4a373, 0.75));
      box.position.y = 0.31;
      const tape = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.10, 0.18), stdMat(0xf5eedc, 0.4));
      tape.position.y = 0.61;
      group.add(box, tape);
      break;
    }
    case 'chair': {
      const wood = stdMat(0xa05a2c, 0.6);
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.08, 0.58), wood);
      seat.position.y = 0.42;
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.52, 0.08), wood);
      back.position.set(0, 0.70, -0.25);
      group.add(seat, back);
      [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.42, 8), wood);
        leg.position.set(lx, 0.21, lz);
        group.add(leg);
      });
      break;
    }
    case 'tv': {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.72, 0.14), stdMat(0x22262f, 0.35, 0.4));
      frame.position.y = 0.46;
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.98, 0.58, 0.04),
        stdMat(0x22b8cf, 0.1, 0.1, { emissive: 0x0b7285, emissiveIntensity: 0.7 })
      );
      screen.position.set(0, 0.46, 0.07);
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.10, 0.28), stdMat(0x1e222a, 0.4, 0.5));
      stand.position.y = 0.05;
      group.add(frame, screen, stand);
      break;
    }
    case 'sofa': {
      const fabric = stdMat(0xe84118, 0.8);
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.34, 0.75), fabric);
      base.position.y = 0.22;
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.46, 0.22), fabric);
      back.position.set(0, 0.58, -0.26);
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.48, 0.75), fabric);
      armL.position.set(-0.65, 0.36, 0);
      const armR = armL.clone();
      armR.position.x = 0.65;
      const cushion1 = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.14, 0.54), stdMat(0xff6b6b, 0.8));
      cushion1.position.set(-0.28, 0.42, 0.04);
      const cushion2 = cushion1.clone();
      cushion2.position.x = 0.28;
      group.add(base, back, armL, armR, cushion1, cushion2);
      break;
    }
    case 'vase': {
      const porcelain = stdMat(0x3498db, 0.15, 0.1);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.56, 14), porcelain);
      body.position.y = 0.28;
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.10, 0.20, 14), porcelain);
      neck.position.y = 0.65;
      const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 0), stdMat(0xff6b81, 0.5));
      flower.position.y = 0.85;
      group.add(body, neck, flower);
      break;
    }
    case 'fridge': {
      const metal = stdMat(0xdce4ee, 0.28, 0.35);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.48, 0.80), metal);
      body.position.y = 0.74;
      const handle1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.38, 0.08), stdMat(0x636e72, 0.3, 0.8));
      handle1.position.set(-0.30, 1.15, 0.42);
      const handle2 = handle1.clone();
      handle2.position.y = 0.55;
      group.add(body, handle1, handle2);
      break;
    }
    case 'piano': {
      const blackWood = stdMat(0x1a1c22, 0.18, 0.25);
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.58, 1.1), blackWood);
      body.position.y = 0.65;
      const lid = new THREE.Mesh(new THREE.BoxGeometry(1.50, 0.08, 0.95), blackWood);
      lid.position.set(0, 1.05, -0.15);
      lid.rotation.x = -0.35;
      const keys = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.10, 0.28), stdMat(0xf8f9fa, 0.2));
      keys.position.set(0, 0.62, 0.58);
      group.add(body, lid, keys);
      [[-0.65, 0.42], [0.65, 0.42], [0, -0.45]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.38, 8), blackWood);
        leg.position.set(lx, 0.19, lz);
        group.add(leg);
      });
      break;
    }
    case 'safe': {
      const steel = stdMat(0x4b5563, 0.35, 0.75);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.90), steel);
      body.position.y = 0.475;
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), stdMat(0xf59e0b, 0.2, 0.9));
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0.12, 0.52, 0.47);
      group.add(body, dial);
      break;
    }
    case 'aquarium': {
      const glass = stdMat(0x38bdf8, 0.08, 0.1, { transparent: true, opacity: 0.72, emissive: 0x0284c7, emissiveIntensity: 0.35 });
      const tank = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.56, 0.52), glass);
      tank.position.y = 0.28;
      const fish = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), stdMat(0xf97316, 0.3));
      fish.scale.set(1.4, 0.9, 0.6);
      fish.position.set(0.08, 0.30, 0);
      const rim = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.07, 0.56), stdMat(0x1e293b, 0.5));
      rim.position.y = 0.56;
      group.add(tank, fish, rim);
      break;
    }
    case 'statue': {
      const gold = stdMat(0xfbbf24, 0.22, 0.9, { emissive: 0x78350f, emissiveIntensity: 0.25 });
      const ped = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.24, 0.55), stdMat(0x7c2d12, 0.5));
      ped.position.y = 0.12;
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), gold);
      body.position.y = 0.45;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 12), gold);
      head.position.y = 0.76;
      group.add(ped, body, head);
      break;
    }
    case 'pc': {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.68, 0.65), stdMat(0x111827, 0.3, 0.6));
      tower.position.y = 0.34;
      const rgb = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.52, 0.50),
        stdMat(0xd946ef, 0.1, 0.1, { emissive: 0xc026d3, emissiveIntensity: 1.2 })
      );
      rgb.position.set(0.23, 0.34, 0);
      group.add(tower, rgb);
      break;
    }
    case 'lamp': {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.85, 10), stdMat(0x92400e, 0.5));
      pole.position.y = 0.425;
      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.32, 0.34, 14),
        stdMat(0xfef08a, 0.3, 0.0, { emissive: 0xfacc15, emissiveIntensity: 0.6 })
      );
      shade.position.y = 0.92;
      group.add(pole, shade);
      break;
    }
    case 'plant': {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.16, 0.32, 12), stdMat(0xc2410c, 0.7));
      pot.position.y = 0.16;
      const leafMat = stdMat(0x16a34a, 0.6);
      const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 1), leafMat);
      bush.position.y = 0.52;
      group.add(pot, bush);
      break;
    }
    case 'teddy': {
      const fur = stdMat(0xb45309, 0.85);
      const torso = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), fur);
      torso.position.y = 0.28;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 10), fur);
      head.position.y = 0.62;
      const earL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), fur);
      earL.position.set(-0.16, 0.78, 0);
      const earR = earL.clone();
      earR.position.x = 0.16;
      group.add(torso, head, earL, earR);
      break;
    }
    default: {
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.62, 0.68), stdMat(0xf59e0b, 0.55));
      cube.position.y = 0.31;
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.16, 0.70), stdMat(0xef4444, 0.4));
      band.position.y = 0.34;
      group.add(cube, band);
      break;
    }
  }

  // Fragile golden sparkle indicator or Heavy weight outline badge
  if (itemDef.isFragile) {
    const badge = new THREE.Mesh(
      new THREE.RingGeometry(0.38, 0.46, 20),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
    );
    badge.rotation.x = -Math.PI / 2;
    badge.position.y = 0.03;
    group.add(badge);
  } else if (itemDef.isSuperHeavy || itemDef.isHeavy) {
    const badge = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.56, 20),
      new THREE.MeshBasicMaterial({ color: 0xf97316, side: THREE.DoubleSide })
    );
    badge.rotation.x = -Math.PI / 2;
    badge.position.y = 0.03;
    group.add(badge);
  }

  enableShadows(group);
  return group;
}

export function createTruck3D() {
  const truck = new THREE.Group();

  // Open cargo bed (Drop-off Zone!)
  const bedFloor = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.25, 4.8), stdMat(0x334155, 0.8));
  bedFloor.position.set(0, 0.45, 0);
  bedFloor.receiveShadow = true;
  truck.add(bedFloor);

  // Glowing green target zone pad inside truck bed
  const targetPad = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 4.4),
    new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.35 })
  );
  targetPad.rotation.x = -Math.PI / 2;
  targetPad.position.set(0, 0.59, 0);
  truck.add(targetPad);

  // Side walls of cargo bed (-X is OPEN loading entrance with glowing green lip!)
  const railMat = stdMat(0xf97316, 0.45);
  const entryLip = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.14, 4.4),
    stdMat(0x22c55e, 0.35, 0.1, { emissive: 0x16a34a, emissiveIntensity: 0.45 })
  );
  entryLip.position.set(-2.22, 0.48, 0);
  const railR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.85, 4.8), railMat);
  railR.position.set(2.1, 0.95, 0);
  const railBack = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.85, 0.2), railMat);
  railBack.position.set(0, 0.95, -2.3);
  truck.add(entryLip, railR, railBack);

  // Driver Cabin (Front)
  const cab = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 2.2), stdMat(0xea580c, 0.35));
  cab.position.set(0, 1.45, 3.5);
  cab.castShadow = true;
  truck.add(cab);

  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.9, 0.1),
    stdMat(0x7dd3fc, 0.1, 0.2)
  );
  windshield.position.set(0, 1.9, 4.6);
  truck.add(windshield);

  // Chunky Tires
  const tireMat = stdMat(0x18181b, 0.85);
  [[-2.2, -1.5], [2.2, -1.5], [-2.2, 3.2], [2.2, 3.2]].forEach(([wx, wz]) => {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.45, 16), tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.position.set(wx, 0.55, wz);
    tire.castShadow = true;
    truck.add(tire);
  });

  return truck;
}

export function createTrampoline3D() {
  const group = new THREE.Group();
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(1.55, 1.65, 0.28, 24),
    stdMat(0x2563eb, 0.4)
  );
  rim.position.y = 0.18;
  rim.castShadow = true;
  rim.receiveShadow = true;

  const mat = new THREE.Mesh(
    new THREE.CylinderGeometry(1.28, 1.28, 0.30, 24),
    stdMat(0x06b6d4, 0.3, 0.1, { emissive: 0x0891b2, emissiveIntensity: 0.4 })
  );
  mat.position.y = 0.20;

  group.add(rim, mat);
  return group;
}

export function createGlassWall3D(w, h, d) {
  const group = new THREE.Group();
  const pane = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    stdMat(0x67e8f9, 0.08, 0.15, { transparent: true, opacity: 0.48, emissive: 0x22d3ee, emissiveIntensity: 0.25 })
  );
  pane.position.y = h / 2;
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.1, h + 0.1, d + 0.06),
    stdMat(0x475569, 0.5, 0.5, { wireframe: true })
  );
  frame.position.y = h / 2;
  group.add(pane, frame);
  return group;
}
