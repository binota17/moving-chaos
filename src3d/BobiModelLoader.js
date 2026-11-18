// =========================================================================
// BOBI 3D GLTF MODEL LOADER, ANIMATION MIXER & MODULAR ATTACHMENTS
// Loads exported glTF 2.0 rigged/animated Bobi variants (Base, Builder, Chef)
// =========================================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const VARIANT_PATHS = {
  base: './CharacterProduction/exports/animations/CHR_Bobi_Animations.gltf',
  builder: './CharacterProduction/exports/modular/CHR_Bobi_VariantA_Builder.gltf',
  chef: './CharacterProduction/exports/modular/CHR_Bobi_VariantB_Chef.gltf'
};

const bobiTexCache = new Map();
const _tmpWorldPos = new THREE.Vector3();

function getBobiTexture(key, drawFn, size = 128) {
  if (bobiTexCache.has(key)) return bobiTexCache.get(key);
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) drawFn(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  if ('SRGBColorSpace' in THREE) tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  bobiTexCache.set(key, tex);
  return tex;
}

function getDenimTex(baseHex = '#2c5da8', stitchHex = 'rgba(255,255,255,0.12)') {
  return getBobiTexture(`denim_${baseHex}`, (ctx, s) => {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = stitchHex;
    for (let i = 0; i < s; i += 6) {
      ctx.fillRect(i, 0, 1, s);
      ctx.fillRect(0, i, s, 1);
    }
  });
}

function getGinghamTex() {
  return getBobiTexture('gingham_red', (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    const cell = s / 4;
    ctx.fillStyle = 'rgba(220, 38, 38, 0.52)';
    for (let y = 0; y < 4; y++) {
      if (y % 2 === 0) ctx.fillRect(0, y * cell, s, cell);
    }
    for (let x = 0; x < 4; x++) {
      if (x % 2 === 0) ctx.fillRect(x * cell, 0, cell, s);
    }
  }, 64);
}

export class BobiCharacterInstance {
  constructor(gltfScene, animations, variant = 'base', tintHex = null) {
    this.root = new THREE.Group();
    this.model = SkeletonUtils.clone(gltfScene);
    this.root.add(this.model);

    this.variant = variant;
    this.clips = animations || [];
    this.mixer = new THREE.AnimationMixer(this.model);
    this.actions = {};
    this.currentAnim = null;
    this.badgeSprite = null;

    // Enhance materials with stylized PBR toy-vinyl / fabric / glossy eyes per variant
    this.model.traverse((obj) => {
      if (obj.isMesh) {
        obj.userData.sharedGeometry = true;
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          obj.material = obj.material.clone();
          const mName = obj.material.name;
          if (mName === 'Mat_YellowBean') {
            obj.material.roughness = 0.34;
            obj.material.metalness = 0.04;
            if (tintHex) obj.material.color.set(tintHex);
          } else if (mName === 'Mat_EyesBlack') {
            obj.material.roughness = 0.04;
            obj.material.metalness = 0.15;
          } else if (mName === 'Mat_EyeWhite') {
            obj.material.emissive.setHex(0xffffff);
            obj.material.emissiveIntensity = 0.55;
          } else if (mName === 'Mat_ButtonGold') {
            obj.material.roughness = 0.18;
            obj.material.metalness = 0.92;
          } else if (mName === 'Mat_DenimBlue') {
            if (variant === 'builder') {
              obj.material.color.setHex(0xffffff);
              obj.material.map = getDenimTex('#ea580c', 'rgba(255,255,255,0.14)');
              obj.material.roughness = 0.65;
            } else if (variant === 'chef') {
              obj.material.color.setHex(0xffffff);
              obj.material.map = getDenimTex('#f8fafc', 'rgba(148,163,184,0.15)');
              obj.material.roughness = 0.55;
            } else {
              obj.material.color.setHex(0xffffff);
              obj.material.map = getDenimTex('#2c5da8', 'rgba(255,255,255,0.12)');
              obj.material.roughness = 0.68;
            }
            obj.material.needsUpdate = true;
          } else if (mName === 'Mat_BandanaRed') {
            if (variant === 'builder') {
              obj.material.color.setHex(0xfacc15);
            } else if (variant === 'chef') {
              obj.material.color.setHex(0xffffff);
              obj.material.map = getGinghamTex();
              obj.material.needsUpdate = true;
            }
          } else if (mName === 'Mat_BootsCharcoal' && variant === 'builder') {
            obj.material.color.setHex(0x6b4226);
            obj.material.roughness = 0.55;
          }
        }
      }
    });

    // Find skeleton bones / sockets
    this.hipsBone = this.model.getObjectByName('Hips');
    this.headBone = this.model.getObjectByName('Head');
    this.chestBone = this.model.getObjectByName('Chest');
    this.hatSocket = this.model.getObjectByName('Socket_Hat') || this.headBone;
    this.backpackSocket = this.model.getObjectByName('Socket_Backpack') || this.chestBone;
    this.overheadSocket = this.model.getObjectByName('Socket_OverheadCarry') || this.chestBone;

    // Create dedicated mount for carried 3D objects above Bobi's head
    this.carryMount = new THREE.Group();
    this.carryMount.position.set(0, 1.38, 0.05);
    this.root.add(this.carryMount);

    // Attach variant modular headwear, chest gear & backpack props
    this.attachModularAccessory(variant);

    // Initialize AnimationActions for all 13 exported glTF clips
    this.clips.forEach((clip) => {
      const action = this.mixer.clipAction(clip);
      const isOneShot = [
        'CHR_Base_PickUp',
        'CHR_Base_Drop',
        'CHR_Base_Throw',
        'CHR_Base_Fall',
        'CHR_Base_GetUp'
      ].includes(clip.name);

      if (isOneShot) {
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
      } else {
        action.setLoop(THREE.LoopRepeat);
      }
      this.actions[clip.name] = action;
    });

    // Dizzy stun stars group
    this.stunGroup = this.createStunStars();
    this.stunGroup.visible = false;
    this.root.add(this.stunGroup);

    // Crisp Moving-Out style dual-tone foot ring beneath Bobi
    const ringColor = variant === 'builder' ? 0xf97316 : (variant === 'chef' ? 0x0284c7 : 0xef4f27);
    const footRingGroup = new THREE.Group();
    footRingGroup.position.y = 0.045;
    const outerRing = new THREE.Mesh(
      new THREE.RingGeometry(0.41, 0.53, 32),
      new THREE.MeshBasicMaterial({
        color: ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        depthTest: false
      })
    );
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.renderOrder = 99;
    const innerRim = new THREE.Mesh(
      new THREE.RingGeometry(0.38, 0.415, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        depthTest: false
      })
    );
    innerRim.rotation.x = -Math.PI / 2;
    innerRim.renderOrder = 99;
    footRingGroup.add(outerRing, innerRim);
    this.footRingOuter = outerRing;
    this.root.add(footRingGroup);

    this.playAnimation('CHR_Base_Idle', 0.0);
  }

  attachModularAccessory(variant) {
    if (!this.headBone) return;

    if (variant === 'base') {
      // Cute mover mini-antennae sprouts flanking the cap + compact mover backpack
      const sproutMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
      [-1, 1].forEach((side) => {
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.09, 8), sproutMat);
        stem.position.set(side * 0.16, 0.25, 0.0);
        stem.rotation.z = -side * 0.48;
        const bobble = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), sproutMat);
        bobble.position.set(side * 0.20, 0.29, 0.0);
        this.headBone.add(stem, bobble);
      });

      if (this.chestBone) {
        // Denim chest pocket + red tag
        const pocket = new THREE.Mesh(
          new THREE.BoxGeometry(0.20, 0.15, 0.04),
          new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.65 })
        );
        pocket.position.set(0, -0.14, 0.30);
        const tag = new THREE.Mesh(
          new THREE.BoxGeometry(0.11, 0.05, 0.045),
          new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.4 })
        );
        tag.position.set(0, -0.12, 0.305);
        this.chestBone.add(pocket, tag);
      }

      if (this.backpackSocket) {
        const pack = new THREE.Group();
        const bag = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 0.28, 0.14),
          new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.55 })
        );
        const flap = new THREE.Mesh(
          new THREE.BoxGeometry(0.30, 0.09, 0.15),
          new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 })
        );
        flap.position.y = 0.09;
        const buckle = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.06, 0.16),
          new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25, metalness: 0.8 })
        );
        buckle.position.y = 0.04;
        pack.add(bag, flap, buckle);
        pack.position.set(0, 0.02, 0.02);
        this.backpackSocket.add(pack);
      }
    } else if (variant === 'builder') {
      // Sculpted Construction Hardhat with crest rib, front visor & bright LED Headlamp
      const hatGroup = new THREE.Group();
      hatGroup.position.set(0.01, 0.17, 0.0);

      const shellMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.28, metalness: 0.1 });
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), shellMat);
      dome.scale.set(1.02, 0.92, 1.08);
      dome.castShadow = true;

      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.14, 0.34), shellMat);
      rib.position.set(0, 0.13, 0);

      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.24, 0.032, 20), shellMat);
      brim.position.set(0, 0.01, 0.02);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.028, 0.14), shellMat);
      visor.position.set(0, 0.005, 0.21);
      visor.rotation.x = 0.12;

      const strap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.225, 0.225, 0.032, 20),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 })
      );
      strap.position.set(0, 0.055, 0);

      // LED Headlamp on front of hardhat
      const bezel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.068, 0.05, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.7 })
      );
      bezel.rotation.x = Math.PI / 2;
      bezel.position.set(0, 0.075, 0.22);

      const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.056, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x38bdf8,
          emissiveIntensity: 1.7,
          roughness: 0.08
        })
      );
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 0.075, 0.225);

      hatGroup.add(dome, rib, brim, visor, strap, bezel, lens);
      this.headBone.add(hatGroup);

      // High-Vis Safety Vest Silver Reflective Stripes & Utility Belt
      if (this.chestBone) {
        const reflMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2, metalness: 0.85, emissive: 0x94a3b8, emissiveIntensity: 0.2 });
        const stripeUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.326, 0.334, 0.042, 24), reflMat);
        stripeUpper.position.set(0, -0.11, 0);
        const stripeLower = new THREE.Mesh(new THREE.CylinderGeometry(0.336, 0.342, 0.042, 24), reflMat);
        stripeLower.position.set(0, -0.22, 0);
        this.chestBone.add(stripeUpper, stripeLower);
      }

      if (this.hipsBone) {
        // Tool belt + miniature hammer on side
        const belt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.345, 0.345, 0.055, 24),
          new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.65 })
        );
        belt.position.y = -0.02;
        const buckle = new THREE.Mesh(
          new THREE.BoxGeometry(0.11, 0.07, 0.05),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, metalness: 0.9 })
        );
        buckle.position.set(0, -0.02, 0.34);
        const hammerHandle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.016, 0.20, 8),
          new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 })
        );
        hammerHandle.position.set(0.35, -0.07, 0.04);
        hammerHandle.rotation.x = 0.2;
        const hammerHead = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.045, 0.12),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.85 })
        );
        hammerHead.position.set(0.35, 0.02, 0.06);
        this.hipsBone.add(belt, buckle, hammerHandle, hammerHead);
      }
    } else if (variant === 'chef') {
      // Sculpted Tall White Pleated Chef Toque with red trim band
      const chefHat = new THREE.Group();
      chefHat.position.set(0.01, 0.16, -0.01);

      const whiteCloth = new THREE.MeshStandardMaterial({ color: 0xfbfcff, roughness: 0.6 });
      const redTrim = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });

      const trimRing = new THREE.Mesh(new THREE.CylinderGeometry(0.222, 0.218, 0.045, 22), redTrim);
      trimRing.position.y = 0.01;
      const crownBand = new THREE.Mesh(new THREE.CylinderGeometry(0.228, 0.215, 0.16, 22), whiteCloth);
      crownBand.position.y = 0.09;
      crownBand.castShadow = true;

      const puffMain = new THREE.Mesh(new THREE.SphereGeometry(0.265, 22, 14), whiteCloth);
      puffMain.scale.set(1.0, 0.72, 1.0);
      puffMain.position.y = 0.24;
      puffMain.castShadow = true;
      chefHat.add(trimRing, crownBand, puffMain);

      // Decorative chef pleats around crown
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const puffLobe = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 10), whiteCloth);
        puffLobe.position.set(Math.cos(ang) * 0.17, 0.22, Math.sin(ang) * 0.17);
        puffLobe.castShadow = true;
        chefHat.add(puffLobe);
      }
      this.headBone.add(chefHat);

      // Chef Apron Pocket, Wooden Spoon & Double-Breasted Buttons
      if (this.chestBone) {
        const pocket = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 0.15, 0.04),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 })
        );
        pocket.position.set(0, -0.17, 0.305);

        const spoonHandle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.014, 0.014, 0.20, 8),
          new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.55 })
        );
        spoonHandle.position.set(-0.04, -0.08, 0.315);
        spoonHandle.rotation.z = 0.24;
        const spoonBowl = new THREE.Mesh(
          new THREE.SphereGeometry(0.036, 10, 8),
          new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 })
        );
        spoonBowl.scale.set(1, 1.35, 0.45);
        spoonBowl.position.set(-0.065, 0.015, 0.315);
        spoonBowl.rotation.z = 0.24;

        // Chef double-breasted buttons
        const btnMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
        [-0.08, 0.08].forEach((bx) => {
          [-0.04, -0.10].forEach((by) => {
            const btn = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), btnMat);
            btn.position.set(bx, by, 0.325);
            this.chestBone.add(btn);
          });
        });

        this.chestBone.add(pocket, spoonHandle, spoonBowl);
      }
    }
  }

  createStunStars() {
    const group = new THREE.Group();
    group.position.set(0, 1.38, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffdd33,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8
    });
    for (let i = 0; i < 3; i++) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), starMat);
      const ang = (i / 3) * Math.PI * 2;
      star.position.set(Math.cos(ang) * 0.35, 0, Math.sin(ang) * 0.35);
      group.add(star);
    }
    return group;
  }

  /**
   * Disposes overhead player badge texture and material if present.
   */
  disposeBadge() {
    if (!this.badgeSprite) return;
    this.root.remove(this.badgeSprite);
    const mat = this.badgeSprite.material;
    if (mat) {
      if (mat.map) mat.map.dispose();
      mat.dispose();
    }
    this.badgeSprite = null;
  }

  /**
   * Creates or removes a crisp billboard overhead player badge (e.g. "P1", "P2") for Co-op.
   */
  setPlayerBadge(label = null, colorHex = '#f97316') {
    this.disposeBadge();
    if (this.footRingOuter?.material && colorHex) {
      this.footRingOuter.material.color.set(colorHex);
    }
    if (!label || typeof document === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pill background + downward pointer triangle
    const x = 28;
    const y = 8;
    const w = 136;
    const h = 58;
    const r = 24;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(108, y + h);
    ctx.lineTo(96, y + h + 16);
    ctx.lineTo(84, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    ctx.fillStyle = colorHex;
    ctx.fill();
    ctx.restore();

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // High-contrast bold player label
    ctx.font = '900 38px "Outfit", "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 7;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.strokeText(label, 96, y + h / 2 + 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, 96, y + h / 2 + 1);

    const tex = new THREE.CanvasTexture(canvas);
    if ('SRGBColorSpace' in THREE) {
      tex.colorSpace = THREE.SRGBColorSpace;
    }
    tex.minFilter = THREE.LinearFilter;

    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.86, 0.43, 1);
    sprite.position.set(0, 1.98, 0);
    sprite.renderOrder = 120;
    this.root.add(sprite);
    this.badgeSprite = sprite;
  }

  playAnimation(name, fadeTime = 0.15) {
    if (this.currentAnim === name) return;
    const nextAction = this.actions[name];
    if (!nextAction) return;

    nextAction.reset();
    nextAction.play();

    if (this.currentAnim && this.actions[this.currentAnim]) {
      const prevAction = this.actions[this.currentAnim];
      nextAction.crossFadeFrom(prevAction, fadeTime, true);
    }
    this.currentAnim = name;
  }

  update(dt, isStunned = false) {
    this.mixer.update(dt);

    // Sync carryMount height nicely with overhead motion (zero per-frame Vector3 alloc)
    if (this.overheadSocket) {
      this.overheadSocket.getWorldPosition(_tmpWorldPos);
      this.root.worldToLocal(_tmpWorldPos);
      this.carryMount.position.lerp(_tmpWorldPos, 0.35);
    }

    this.stunGroup.visible = isStunned;
    if (isStunned) {
      this.stunGroup.rotation.y += dt * 5.0;
    }

    if (this.badgeSprite) {
      const isCarrying = !!(this.carryMount && this.carryMount.children.length > 0);
      const bob = Math.sin(Date.now() * 0.0045) * 0.035;
      const targetY = (isCarrying ? 2.48 : 1.98) + bob;
      const smooth = 1 - Math.exp(-12 * dt);
      this.badgeSprite.position.y = THREE.MathUtils.lerp(this.badgeSprite.position.y, targetY, smooth);
    }
  }
}

export class BobiModelCache {
  constructor() {
    this.loader = new GLTFLoader();
    this.cache = new Map();
  }

  async loadVariant(variant = 'base') {
    const key = VARIANT_PATHS[variant] ? variant : 'base';
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const url = VARIANT_PATHS[key];
    const gltf = await new Promise((resolve, reject) => {
      this.loader.load(url, resolve, undefined, reject);
    });

    this.cache.set(key, gltf);
    return gltf;
  }

  async createCharacter(variant = 'base', tintHex = null) {
    const gltf = await this.loadVariant(variant);
    return new BobiCharacterInstance(gltf.scene, gltf.animations, variant, tintHex);
  }
}
