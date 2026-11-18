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

    // Enable crisp shadows on all skinned meshes & optional color rim tint
    this.model.traverse((obj) => {
      if (obj.isMesh) {
        obj.userData.sharedGeometry = true;
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          obj.material = obj.material.clone();
          // Make materials vibrant stylized PBR under studio directional light
          if (obj.material.name === 'Mat_YellowBean' && tintHex) {
            obj.material.color.set(tintHex);
          }
        }
      }
    });

    // Find skeleton bones / sockets
    this.headBone = this.model.getObjectByName('Head');
    this.chestBone = this.model.getObjectByName('Chest');
    this.hatSocket = this.model.getObjectByName('Socket_Hat') || this.headBone;
    this.overheadSocket = this.model.getObjectByName('Socket_OverheadCarry') || this.chestBone;

    // Create dedicated mount for carried 3D objects above Bobi's head
    this.carryMount = new THREE.Group();
    this.carryMount.position.set(0, 1.38, 0.05);
    this.root.add(this.carryMount);

    // Attach variant modular headwear to Head/Socket_Hat
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

    // Subtle glowing foot locator ring (visible even when standing near tall furniture)
    const ringColor = variant === 'builder' ? 0xff7b00 : (variant === 'chef' ? 0x38bdf8 : 0xfacc15);
    const footRing = new THREE.Mesh(
      new THREE.RingGeometry(0.40, 0.49, 28),
      new THREE.MeshBasicMaterial({
        color: ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
        depthTest: false
      })
    );
    footRing.rotation.x = -Math.PI / 2;
    footRing.position.y = 0.04;
    footRing.renderOrder = 99;
    this.root.add(footRing);

    this.playAnimation('CHR_Base_Idle', 0.0);
  }

  attachModularAccessory(variant) {
    if (!this.headBone) return;

    if (variant === 'builder') {
      // LED Headlamp attached to front of construction hardhat
      const lampGroup = new THREE.Group();
      lampGroup.position.set(0.03, 0.16, 0.21);

      const bezel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.06, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.4, metalness: 0.6 })
      );
      bezel.rotation.x = Math.PI / 2;
      lampGroup.add(bezel);

      const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.042, 0.046, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x74f9ff,
          emissiveIntensity: 1.5,
          roughness: 0.1
        })
      );
      lens.rotation.x = Math.PI / 2;
      lampGroup.add(lens);

      // Orange safety vest collar accent on chest
      if (this.chestBone) {
        const stripe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.328, 0.338, 0.05, 24),
          new THREE.MeshStandardMaterial({ color: 0xe6eef8, roughness: 0.25, metalness: 0.8 })
        );
        stripe.position.set(0, -0.22, 0);
        this.chestBone.add(stripe);
      }

      this.headBone.add(lampGroup);
    } else if (variant === 'chef') {
      // Tall white pleated Chef Toque enveloping the cap silhouette
      const chefHat = new THREE.Group();
      chefHat.position.set(0.02, 0.16, -0.01);

      const whiteCloth = new THREE.MeshStandardMaterial({ color: 0xfbfcff, roughness: 0.65 });
      const crownBand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.225, 0.215, 0.17, 20),
        whiteCloth
      );
      crownBand.position.y = 0.06;
      crownBand.castShadow = true;
      chefHat.add(crownBand);

      const puffMain = new THREE.Mesh(
        new THREE.SphereGeometry(0.27, 20, 14),
        whiteCloth
      );
      puffMain.scale.set(1.0, 0.72, 1.0);
      puffMain.position.y = 0.22;
      puffMain.castShadow = true;
      chefHat.add(puffMain);

      // Decorative chef pleats around crown
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const puffLobe = new THREE.Mesh(
          new THREE.SphereGeometry(0.115, 12, 10),
          whiteCloth
        );
        puffLobe.position.set(Math.cos(ang) * 0.16, 0.21, Math.sin(ang) * 0.16);
        puffLobe.castShadow = true;
        chefHat.add(puffLobe);
      }

      this.headBone.add(chefHat);
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

    // Sync carryMount height nicely with overhead motion
    if (this.overheadSocket) {
      const worldPos = new THREE.Vector3();
      this.overheadSocket.getWorldPosition(worldPos);
      this.root.worldToLocal(worldPos);
      this.carryMount.position.lerp(worldPos, 0.35);
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
