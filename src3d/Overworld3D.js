// =========================================================================
// 3D OVERWORLD HUB — DRIVE THE MOVING TRUCK ACROSS 3 CHAPTER DISTRICTS
// Procedural sunny neighborhood road network with 12 contract pads (1..12)
// =========================================================================
import * as THREE from 'three';
import { LEVELS_3D } from './Levels3D.js';
import { getLevelText } from './i18n.js';

const PAD_SPOTS = [
  // Chapter 1: Sunny Suburbs (West/South-West)
  { id: 1, x: -16.0, z: 7.5, bx: -16.0, bz: 11.4, color: 0xf47b8c, chapter: 1 },
  { id: 2, x: -12.0, z: 1.0, bx: -15.8, bz: -1.5, color: 0xa855f7, chapter: 1 },
  { id: 3, x: -5.5, z: 7.5, bx: -5.5, bz: 11.4, color: 0xef4444, chapter: 1 },
  { id: 4, x: -2.0, z: 1.0, bx: -2.0, bz: -3.2, color: 0xf97316, chapter: 1 },
  // Chapter 2: Downtown & Works (Center/North)
  { id: 5, x: 4.5, z: -6.5, bx: 4.5, bz: -10.5, color: 0xeab308, chapter: 2 },
  { id: 6, x: 11.5, z: -6.5, bx: 11.5, bz: -10.5, color: 0x64748b, chapter: 2 },
  { id: 7, x: 5.5, z: 4.5, bx: 5.5, bz: 8.4, color: 0x38bdf8, chapter: 2 },
  { id: 8, x: 12.5, z: 4.5, bx: 12.5, bz: 8.4, color: 0xfb923c, chapter: 2 },
  // Chapter 3: VIP Harbor & Estate (East)
  { id: 9, x: 18.5, z: -5.5, bx: 22.4, bz: -6.2, color: 0x6366f1, chapter: 3 },
  { id: 10, x: 19.0, z: 1.0, bx: 23.0, bz: 1.0, color: 0x0ea5e9, chapter: 3 },
  { id: 11, x: 18.5, z: 7.5, bx: 22.4, bz: 8.0, color: 0xea580c, chapter: 3 },
  { id: 12, x: 11.0, z: 11.2, bx: 11.0, bz: 15.0, color: 0xf43f5e, chapter: 3 },
  // Chapter 4: Quantum Lab & Orbital Spaceport (North Wing)
  { id: 13, x: -12.0, z: -13.5, bx: -15.8, bz: -15.2, color: 0x06b6d4, chapter: 4 },
  { id: 14, x: -2.0, z: -13.5, bx: -2.0, bz: -17.4, color: 0xa855f7, chapter: 4 },
  { id: 15, x: 6.5, z: -13.5, bx: 6.5, bz: -17.4, color: 0x22d3ee, chapter: 4 },
  { id: 16, x: 15.5, z: -13.5, bx: 19.5, bz: -15.2, color: 0xf43f5e, chapter: 4 }
];

function createPadTexture(num, stars, accentHex) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(0, 0, 256, 256);

    // Outer thick ring
    ctx.strokeStyle = '#' + new THREE.Color(accentHex).getHexString();
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(128, 128, 108, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#1e242c';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(128, 128, 94, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#1e242c';
    ctx.font = 'bold 88px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(num), 128, 106);

    // Stars row
    ctx.font = 'bold 42px sans-serif';
    for (let s = 0; s < 3; s++) {
      ctx.fillStyle = s < stars ? '#f59e0b' : '#cbd5e1';
      ctx.fillText('★', 74 + s * 54, 184);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  if ('SRGBColorSpace' in THREE) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function createMiniLandmark(spot) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: spot.color, roughness: 0.6 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xfef7e6, roughness: 0.55 });
  const roofMat = new THREE.MeshStandardMaterial({ color: spot.chapter === 3 ? 0x1e293b : (spot.chapter === 2 ? 0x475569 : 0xef4f27), roughness: 0.55 });

  const w = spot.id === 12 ? 4.2 : (spot.id === 6 || spot.id === 11 ? 3.8 : 3.0);
  const h = spot.id === 8 || spot.id === 12 ? 2.8 : (spot.id === 5 ? 2.4 : 1.9);
  const d = 2.8;

  const base = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bodyMat);
  base.position.y = h / 2;
  base.castShadow = true;
  base.receiveShadow = true;
  g.add(base);

  if (spot.chapter === 1) {
    // Cozy pitched house roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.72, 1.35, 4), roofMat);
    roof.position.y = h + 0.65;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    g.add(roof);
  } else if (spot.chapter === 2) {
    // Industrial flat cap + awning
    const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.25, 0.28, d + 0.25), trimMat);
    cap.position.y = h + 0.14;
    cap.castShadow = true;
    g.add(cap);
  } else if (spot.chapter === 4) {
    // Sci-Fi Quantum Lab / Orbital Dish Landmark
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(Math.max(w, d) * 0.44, 0.14, 8, 22),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = h + 0.16;
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.5, 8), roofMat);
    spire.position.y = h + 0.78;
    spire.castShadow = true;
    g.add(ring, spire);
  } else {
    // VIP Dome / Mast / Harbour Crane silhouette
    const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.26, d + 0.3), trimMat);
    cap.position.y = h + 0.13;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.95, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), roofMat);
    dome.position.y = h + 0.22;
    dome.castShadow = true;
    g.add(cap, dome);
  }

  // Little front door
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.0, 0.12), trimMat);
  door.position.set(0, 0.5, d / 2 + 0.04);
  g.add(door);

  return g;
}

function createMiniOverworldTruck() {
  const truck = new THREE.Group();
  const bodyGroup = new THREE.Group();
  truck.add(bodyGroup);
  truck.userData.bodyGroup = bodyGroup;

  const boxMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
  const cabMat = new THREE.MeshStandardMaterial({ color: 0xef4f27, roughness: 0.32 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x7dd3fc, roughness: 0.12, metalness: 0.2 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x1e242c, roughness: 0.85 });

  // Cargo box
  const cargo = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.15, 2.05), boxMat);
  cargo.position.set(0, 0.85, -0.45);
  cargo.castShadow = true;
  bodyGroup.add(cargo);

  // Orange/yellow racing stripe along box
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.22, 2.07), trimMat);
  stripe.position.set(0, 0.85, -0.45);
  bodyGroup.add(stripe);

  // Cab forward (+Z is forward)
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.96, 1.0), cabMat);
  cab.position.set(0, 0.74, 1.05);
  cab.castShadow = true;
  bodyGroup.add(cab);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.42, 0.08), glassMat);
  windshield.position.set(0, 0.92, 1.54);
  bodyGroup.add(windshield);

  // Roof beacon
  const beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.18, 0.16, 12),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.9 })
  );
  beacon.position.set(0, 1.3, 1.05);
  bodyGroup.add(beacon);

  // 4 tires
  [[-0.72, -0.95], [0.72, -0.95], [-0.72, 1.0], [0.72, 1.0]].forEach(([wx, wz]) => {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.22, 14), tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.position.set(wx, 0.30, wz);
    tire.castShadow = true;
    truck.add(tire);
  });

  return truck;
}

export class Overworld3D {
  constructor(group, progressStore, currentLevel = 1) {
    this.group = group;
    this.progressStore = progressStore;
    this.pads = [];
    this.hoveredLevelId = currentLevel || 1;
    this.truck = null;

    const startSpot = PAD_SPOTS.find(s => s.id === this.hoveredLevelId) || PAD_SPOTS[0];
    this.truckX = startSpot.x;
    this.truckZ = startSpot.z;
    this.truckRotY = Math.PI / 2;
    this.truckVx = 0;
    this.truckVz = 0;
    this.driveClock = 0;
    this._tmpVec = new THREE.Vector3();

    this.build();
  }

  build() {
    // 1. Wide Sunny Island Ground + North Sci-Fi Spaceport Platform (Chapter 4)
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(58, 1.2, 46),
      new THREE.MeshStandardMaterial({ color: 0x77c956, roughness: 0.9 })
    );
    ground.position.set(2, -0.62, -2);
    ground.receiveShadow = true;
    this.group.add(ground);

    const sciFiDeck = new THREE.Mesh(
      new THREE.BoxGeometry(44, 0.14, 11.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.35 })
    );
    sciFiDeck.position.set(2, -0.02, -15.5);
    sciFiDeck.receiveShadow = true;
    this.group.add(sciFiDeck);

    // Chapter Harbor Water Strip on East Coast (for levels 10 & 11)
    const water = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.4, 46),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.1 })
    );
    water.position.set(27.5, -0.26, -2);
    this.group.add(water);

    // 2. Clean Paved Road Network connecting all 16 pads
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x526071, roughness: 0.88 });
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });
    const roadSegs = [
      // Main East-West avenue + North Chapter 4 orbital boulevard
      { x: 1.5, z: 7.5, w: 38, d: 3.2 },
      { x: 3.5, z: -6.5, w: 33, d: 3.0 },
      { x: 0.5, z: 1.0, w: 28, d: 2.8 },
      { x: 2.0, z: -13.5, w: 33, d: 2.8 },
      // North-South connectors
      { x: -12.0, z: -3.5, w: 3.0, d: 24.0 },
      { x: -2.0, z: -3.5, w: 3.0, d: 23.0 },
      { x: 5.5, z: -3.0, w: 3.0, d: 24.0 },
      { x: 12.5, z: 1.5, w: 3.2, d: 22.0 },
      { x: 18.8, z: -2.5, w: 3.2, d: 23.5 }
    ];
    roadSegs.forEach((r) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(r.w, 0.08, r.d), roadMat);
      mesh.position.set(r.x, 0.01, r.z);
      mesh.receiveShadow = true;
      this.group.add(mesh);

      const line = new THREE.Mesh(
        new THREE.BoxGeometry(r.w > r.d ? r.w * 0.88 : 0.16, 0.09, r.w > r.d ? 0.16 : r.d * 0.88),
        stripeMat
      );
      line.position.set(r.x, 0.02, r.z);
      this.group.add(line);
    });

    // 3. Instanced decorative trees scattered safely off roads
    const treeTrunkGeo = new THREE.CylinderGeometry(0.16, 0.22, 0.9, 8);
    treeTrunkGeo.translate(0, 0.45, 0);
    const treeCrownGeo = new THREE.SphereGeometry(0.72, 10, 8);
    treeCrownGeo.translate(0, 1.35, 0);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0xa16236, roughness: 0.85 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x4ca657, roughness: 0.72 });
    const treeCoords = [
      [-21, -10], [-21, 0], [-21, 12], [-18, -12], [-8, -11], [-7, -2],
      [0, -12], [1, 12], [8, 0], [15, -12], [16, 13], [-15, 4], [8, -2]
    ];
    const trunksInst = new THREE.InstancedMesh(treeTrunkGeo, trunkMat, treeCoords.length);
    const crownsInst = new THREE.InstancedMesh(treeCrownGeo, leafMat, treeCoords.length);
    trunksInst.castShadow = true;
    crownsInst.castShadow = true;
    const dummy = new THREE.Object3D();
    treeCoords.forEach(([tx, tz], i) => {
      dummy.position.set(tx, 0, tz);
      dummy.scale.setScalar(0.85 + (i % 3) * 0.18);
      dummy.updateMatrix();
      trunksInst.setMatrixAt(i, dummy.matrix);
      crownsInst.setMatrixAt(i, dummy.matrix);
    });
    trunksInst.instanceMatrix.needsUpdate = true;
    crownsInst.instanceMatrix.needsUpdate = true;
    trunksInst.computeBoundingSphere();
    crownsInst.computeBoundingSphere();
    this.group.add(trunksInst, crownsInst);

    // 4. Level Parking Pads (1..12) + Miniature Buildings
    PAD_SPOTS.forEach((spot) => {
      const rec = this.progressStore.getLevelRecord(spot.id);
      const tex = createPadTexture(spot.id, rec.bestStars, spot.color);
      const padMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1.52, 1.58, 0.08, 24),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45 })
      );
      padMesh.position.set(spot.x, 0.05, spot.z);
      padMesh.receiveShadow = true;

      const beaconRing = new THREE.Mesh(
        new THREE.RingGeometry(1.55, 1.78, 24),
        new THREE.MeshBasicMaterial({ color: spot.color, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
      );
      beaconRing.rotation.x = -Math.PI / 2;
      beaconRing.position.set(spot.x, 0.10, spot.z);

      const building = createMiniLandmark(spot);
      building.position.set(spot.bx, 0, spot.bz);
      building.lookAt(spot.x, 0, spot.z);

      this.group.add(padMesh, beaconRing, building);
      this.pads.push({ ...spot, padMesh, beaconRing, stars: rec.bestStars });
    });

    // 5. Drivable Player Truck
    this.truck = createMiniOverworldTruck();
    this.truck.position.set(this.truckX, 0, this.truckZ);
    this.truck.rotation.y = this.truckRotY;
    this.group.add(this.truck);
  }

  update(dt, inputVecX, inputVecZ, camFwdXZ, camRightXZ) {
    this.driveClock += dt;
    // Camera-relative steering
    this._tmpVec.set(0, 0, 0)
      .addScaledVector(camFwdXZ, inputVecZ)
      .addScaledVector(camRightXZ, inputVecX);

    const hasInput = this._tmpVec.lengthSq() > 0.01;
    let targetVx = 0;
    let targetVz = 0;
    if (hasInput) {
      this._tmpVec.normalize();
      const speed = 10.5;
      targetVx = this._tmpVec.x * speed;
      targetVz = this._tmpVec.z * speed;

      const targetAng = Math.atan2(this._tmpVec.x, this._tmpVec.z);
      const diff = Math.atan2(Math.sin(targetAng - this.truckRotY), Math.cos(targetAng - this.truckRotY));
      this.truckRotY += diff * Math.min(1, dt * 10);
    }

    this.truckVx = THREE.MathUtils.lerp(this.truckVx, targetVx, Math.min(1, dt * 8));
    this.truckVz = THREE.MathUtils.lerp(this.truckVz, targetVz, Math.min(1, dt * 8));
    this.truckX = THREE.MathUtils.clamp(this.truckX + this.truckVx * dt, -22, 21.5);
    this.truckZ = THREE.MathUtils.clamp(this.truckZ + this.truckVz * dt, -19.5, 15.5);

    const spd = Math.hypot(this.truckVx, this.truckVz);
    if (this.truck) {
      this.truck.position.set(this.truckX, 0, this.truckZ);
      this.truck.rotation.y = this.truckRotY;
      const body = this.truck.userData.bodyGroup;
      if (body) {
        body.position.y = spd > 0.5 ? Math.abs(Math.sin(this.driveClock * 18)) * 0.06 : 0;
      }
    }

    // Pulse beacon rings & detect nearest parking pad
    let bestId = null;
    let bestDist = 2.6;
    for (const p of this.pads) {
      const dist = Math.hypot(this.truckX - p.x, this.truckZ - p.z);
      const isNear = dist < 2.6;
      if (dist < bestDist) {
        bestDist = dist;
        bestId = p.id;
      }
      const pulse = isNear ? (1.12 + Math.sin(this.driveClock * 6) * 0.08) : 1.0;
      p.beaconRing.scale.setScalar(pulse);
    }

    this.hoveredLevelId = bestId;
    const def = bestId ? LEVELS_3D[bestId] : null;
    const txt = bestId ? getLevelText(bestId) : null;
    return {
      levelId: bestId,
      levelDef: def,
      levelText: txt,
      truckX: this.truckX,
      truckZ: this.truckZ,
      speed: spd
    };
  }
}
