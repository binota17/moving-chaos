// =========================================================================
// MOVING CHAOS 3D - 2.5D ISOMETRIC MULTIPLAYER GAME ENGINE
// Uses Three.js + Real Bobi glTF Models + 360° Isometric Controls + LAN Co-op
// =========================================================================
import * as THREE from 'three';
import { LEVELS_3D } from './Levels3D.js';
import { BobiModelCache } from './BobiModelLoader.js';
import { createPropMesh3D, createTruck3D, createTrampoline3D, createGlassWall3D, getLawnTex, getFloorPatternTex, createDioramaWall3D } from './PropFactory3D.js';
import { LevelMechanics, isInsideTruckBed, truckWorldToLocal, truckBox, inRect, getFixtureObstacles } from './LevelMechanics.js';
import { buildMechanicsVisuals, addRoadMarkings } from './MechanicsVisuals3D.js';
import { buildLevelSetDressing3D } from './DioramaDecor3D.js';
import { buildRoomFloors3D, buildArchitecturalFixtures3D } from './InteriorBuilder3D.js';
import { Overworld3D } from './Overworld3D.js';
import { t, setLang, getLevelText } from './i18n.js';
import { loadSettings, saveSettings, evaluateBonusStatus, evaluateMatchStars, ProgressStore, BOBI_SKINS, isSkinUnlocked } from './ProgressStore.js';
import { GamepadManager } from './GamepadManager.js';
import { soundManager } from '../src/core/SoundManager.js';
import { NetworkManager } from '../src/network/NetworkManager.js';
import { UIManager } from '../src/render/UIManager.js';
import { eventBus } from '../src/core/EventBus.js';

export class Game3DApp {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.floatingLayer = document.getElementById('floating-text-layer');
    this.ui = new UIManager();
    this.network = new NetworkManager();
    this.modelCache = new BobiModelCache();
    this.progressStore = new ProgressStore();
    this.settings = loadSettings();
    setLang(this.settings.lang);

    this.gameState = 'MENU'; // 'MENU', 'OVERWORLD', 'PLAYING', 'PAUSED', 'GAMEOVER'
    this.gameMode = 'SOLO';  // 'SOLO', 'LOCAL_2P', 'LOCAL_3P', 'LOCAL_4P', 'LAN_COOP'
    this.settingsModalOpen = false;
    this.controlsModalOpen = false;
    this.mapSelectModalOpen = false;
    this.currentLevel = 1;
    this.selectedVariantP1 = 'base';
    this.selectedVariantP2 = 'builder';
    this.selectedSkin = this.settings.selectedSkin || 'classic';
    this.selectedModifier = this.settings.modifier || 'normal';
    this.overworld = null;
    this.overworldLastPadId = null;
    this.truckCargoPlacements = [];

    this.score = 0;
    this.timeLeft = 75;
    this.unlimitedTime = false;
    this.itemsDelivered = 0;
    this.targetItemsCount = 8;
    this.landlordRage = 0;
    this.matchStats = { windowsBroken: 0, fragileBroken: 0, anyItemBroken: 0, hazardHits: 0 };
    this.deliveryCombo = 0;
    this.comboTimer = 0;
    this.truckBounceOffset = 0;
    this.truckBounceVel = 0;
    this.deliveredSlotCount = 0;
    this.mechanics = null;
    this.mechVisuals = null;
    this.timerInterval = null;
    this.cameraShake = 0;
    this.camAngle = 0.22;
    this.targetCamAngle = 0.22;
    this.menuOrbitBias = 0;
    this.camRadius = 20.0;
    this.camHeight = 15.8;
    this.camZoom = 1.0;
    this.lastNetSyncTime = 0;
    this.lastP2SyncTime = 0;
    this.lastFullSyncTime = 0;
    this.lastHudSyncTime = 0;
    this.lastInputPayload = '';
    this.lastP2SentPayload = '';
    this.lastItemSnapshots = [];
    this.highQuality = this.settings.highQuality !== null
      ? this.settings.highQuality
      : !(navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
    this.avgDt = 0.016;
    this.lowFpsFrames = 0;
    this.levelLoadSeq = 0;
    this.isSettingUpLevel = false;
    this.contextLost = false;
    this.lastAnimateErrorTime = 0;

    // Input, Gamepad & Co-op event state
    this.keys = {};
    this.p2RemoteKeys = {};
    this.padStates = [null, null, null, null];
    this.gamepadManager = new GamepadManager((connected, idx, total) => {
      this.updateGamepadStatusChip(total);
      this.ui.addFeedPill(
        connected ? t('gamepad_connected_toast', { idx }) : t('gamepad_disconnected_toast', { idx }),
        connected ? 'glass' : 'bounce'
      );
    });
    this.gamepadManager.rumbleEnabled = this.settings.rumbleEnabled;
    soundManager.setBgmVolume(this.settings.bgmVolume);
    soundManager.setSfxVolume(this.settings.sfxVolume);
    soundManager.setBgmEnabled(this.settings.bgmEnabled);
    soundManager.setSfxEnabled(this.settings.sfxEnabled);

    this.touchMoveX = 0;
    this.touchMoveY = 0;
    this.pendingNetEvents = [];
    this.netEventSeq = 0;
    this.lastAppliedNetEventSeq = 0;
    this.lastCoopAssistHintAt = 0;
    this.mouseNDC = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.occlusionRay = new THREE.Raycaster();
    this.aimWorldPoint = new THREE.Vector3();
    this.pointerAiming = false;

    // Scene collections
    this.levelGroup = new THREE.Group();
    this.players = [];
    this.items = [];
    this.windows = [];
    this.trampolines = [];
    this.occluderMeshes = [];
    this.particles = [];
    this.trajectoryDots = [];
    this.sharedParticleGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    this.sharedPuffGeo = new THREE.SphereGeometry(0.16, 10, 8);
    this.puffMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.78 });
    this.particleMatCache = new Map();

    this.initThree();
    this.initTrajectoryDots();
    this.initHelpers3D();
    this.bindInputs();
    this.bindDOM();

    // Load initial scene & showcase Bobi immediately
    this.setupLevel(1).then(() => {
      this.animate();
    });
  }

  initThree() {
    const container = document.getElementById('game-container');
    const w = container.clientWidth || 1060;
    const h = container.clientHeight || 650;

    // Detect software WebGL rasterizers so shadow resolution & pixelRatio scale gracefully
    this.isSoftwareGl = false;
    try {
      const probeCanvas = document.createElement('canvas');
      const probeGl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (probeGl) {
        const dbg = probeGl.getExtension('WEBGL_debug_renderer_info');
        const rName = dbg ? probeGl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '';
        if (/SwiftShader|llvmpipe|Software|Microsoft Basic/i.test(String(rName))) {
          this.isSoftwareGl = true;
        }
        probeGl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    } catch (_) {
      this.isSoftwareGl = false;
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.highQuality,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h, false);
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if ('SRGBColorSpace' in THREE) {
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa7e0fb);
    this.scene.fog = new THREE.Fog(0xc2ebfd, 36, 82);

    // Lightweight procedural PMREM sky/lawn bounce environment (no external HDR/RoomEnvironment file needed)
    try {
      const pmremGen = new THREE.PMREMGenerator(this.renderer);
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0xdbf2ff);
      const envWarm = new THREE.Mesh(
        new THREE.BoxGeometry(8, 2, 8),
        new THREE.MeshBasicMaterial({ color: 0xfff3d1 })
      );
      envWarm.position.set(6, 10, 6);
      const envLawn = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.MeshBasicMaterial({ color: 0x76c052 })
      );
      envLawn.rotation.x = -Math.PI / 2;
      envLawn.position.y = -4;
      envScene.add(envWarm, envLawn);
      const envRT = pmremGen.fromScene(envScene, 0.04);
      this.scene.environment = envRT.texture;
      envWarm.geometry.dispose();
      envWarm.material.dispose();
      envLawn.geometry.dispose();
      envLawn.material.dispose();
      pmremGen.dispose();
    } catch (_) {
      // Fallback safely to direct lighting if PMREM isn't supported
    }

    // Rotatable 2.5D Isometric Camera (~36 degree angle)
    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.5, 110);
    this.baseCamLook = new THREE.Vector3(0.0, 0.9, 0.0);
    this.camFwdXZ = new THREE.Vector3();
    this.camRightXZ = new THREE.Vector3();
    this.updateCameraTransform(0, 0);

    // Warm toybox morning 3-point lighting with soft diffused shadows
    const hemi = new THREE.HemisphereLight(0xfffef6, 0x62aa5e, 1.15);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff5dc, 1.9);
    sun.position.set(10, 18, 12);
    sun.castShadow = true;
    const shadowRes = this.isSoftwareGl ? 512 : 2048;
    sun.shadow.mapSize.set(shadowRes, shadowRes);
    sun.shadow.radius = 2.8;
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 45;
    sun.shadow.camera.left = -16;
    sun.shadow.camera.right = 16;
    sun.shadow.camera.top = 13;
    sun.shadow.camera.bottom = -13;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    this.sunLight = sun;
    this.scene.add(sun);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.65);
    fillLight.position.set(-12, 9, -8);
    this.scene.add(fillLight);

    this.scene.add(this.levelGroup);
    this.applyGraphicsSettings();

    window.addEventListener('resize', () => {
      const nw = container.clientWidth || 1060;
      const nh = container.clientHeight || 650;
      this.renderer.setSize(nw, nh, false);
      this.camera.aspect = nw / nh;
      this.camera.updateProjectionMatrix();
    });

    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.contextLost = true;
      this.ui.addFeedPill('<span>⚠️ Đồ họa 3D tạm gián đoạn, đang khôi phục...</span>', 'broke');
    });

    this.canvas.addEventListener('webglcontextrestored', () => {
      this.contextLost = false;
      this.applyGraphicsSettings();
      this.ui.addFeedPill('<span>✅ Đã khôi phục đồ họa 3D!</span>', 'glass');
    });
  }

  rotateCamera(deltaAngle) {
    this.targetCamAngle += deltaAngle;
  }

  updateCameraTransform(focusX = 0, focusZ = 0, shakeOffsetX = 0, shakeOffsetY = 0) {
    const r = this.camRadius * this.camZoom;
    const h = this.camHeight * this.camZoom;
    const cx = focusX + Math.sin(this.camAngle) * r + shakeOffsetX;
    const cz = focusZ + Math.cos(this.camAngle) * r;
    const cy = h + shakeOffsetY;

    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(focusX, this.baseCamLook.y, focusZ);

    const fwd = new THREE.Vector3();
    this.camera.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    this.camFwdXZ.copy(fwd);
    this.camRightXZ.crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
  }

  updateWallOcclusionFade(activePlayer) {
    if (!activePlayer || this.occluderMeshes.length === 0) return;

    // Reset target opacity on all occluders
    for (const m of this.occluderMeshes) {
      m.userData.targetOpacity = 1.0;
    }

    const targetPos = new THREE.Vector3(activePlayer.x, activePlayer.y + 0.65, activePlayer.z);
    const dir = targetPos.clone().sub(this.camera.position);
    const dist = dir.length();
    if (dist > 0.1) {
      dir.divideScalar(dist);
      this.occlusionRay.set(this.camera.position, dir);
      this.occlusionRay.far = Math.max(0.5, dist - 0.45);
      const hits = this.occlusionRay.intersectObjects(this.occluderMeshes, false);
      for (const hit of hits) {
        hit.object.userData.targetOpacity = 0.25;
      }
    }

    for (const m of this.occluderMeshes) {
      const target = m.userData.targetOpacity ?? 1.0;
      m.material.opacity += (target - m.material.opacity) * 0.22;
      m.material.depthWrite = m.material.opacity > 0.85;
      if (Array.isArray(m.userData.linkedMeshes)) {
        for (const lm of m.userData.linkedMeshes) {
          if (lm.material && lm.material !== m.material) {
            lm.material.opacity = m.material.opacity;
            lm.material.depthWrite = m.material.depthWrite;
          }
        }
      }
    }
  }

  applyGraphicsSettings() {
    if (this.highQuality) {
      this.renderer.setPixelRatio(this.isSoftwareGl ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5));
      this.renderer.shadowMap.enabled = true;
      if (this.sunLight) this.sunLight.castShadow = true;
    } else {
      // Ultra-smooth 60 FPS mode for laptops/phones with integrated GPUs
      this.renderer.setPixelRatio(0.85);
      this.renderer.shadowMap.enabled = false;
      if (this.sunLight) this.sunLight.castShadow = false;
    }
    this.renderer.shadowMap.needsUpdate = true;
  }

  togglePerformanceMode() {
    this.highQuality = !this.highQuality;
    this.applyGraphicsSettings();
    this.settings.highQuality = this.highQuality;
    saveSettings(this.settings);
    return this.highQuality;
  }

  initTrajectoryDots() {
    const dotGeo = new THREE.SphereGeometry(0.11, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let i = 0; i < 14; i++) {
      const m = new THREE.Mesh(dotGeo, dotMat);
      m.visible = false;
      this.scene.add(m);
      this.trajectoryDots.push(m);
    }
  }

  initHelpers3D() {
    // Highlight ring beneath nearest grabbable item
    this.grabHighlightRing = new THREE.Mesh(
      new THREE.RingGeometry(0.50, 0.64, 24),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        depthTest: false
      })
    );
    this.grabHighlightRing.rotation.x = -Math.PI / 2;
    this.grabHighlightRing.renderOrder = 98;
    this.grabHighlightRing.visible = false;
    this.scene.add(this.grabHighlightRing);

    // Compass guide arrow pointing to Delivery Truck when holding an item
    const arrow = new THREE.Group();
    const arrowMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.92,
      depthTest: false
    });
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.44), arrowMat);
    shaft.position.z = 0.22;
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.34, 8), arrowMat);
    head.rotation.x = Math.PI / 2;
    head.position.z = 0.54;
    arrow.add(shaft, head);
    arrow.renderOrder = 98;
    arrow.visible = false;
    this.truckGuideArrow = arrow;
    this.scene.add(this.truckGuideArrow);
  }

  getVariantPerk(variant) {
    if (variant === 'builder') {
      return {
        speedMult: 1.0,
        throwMult: 1.0,
        grabBonus: 0,
        heavyCarryFloor: 0.86,
        heavyJump: 7.0,
        stunMult: 0.5,
        slipperyTractionMult: 1.0,
        fragileBreakVel: -7.5
      };
    }
    if (variant === 'chef') {
      return {
        speedMult: 1.0,
        throwMult: 1.0,
        grabBonus: 0,
        heavyCarryFloor: 0.65,
        heavyJump: 5.8,
        stunMult: 1.0,
        slipperyTractionMult: 2.8,
        fragileBreakVel: -9.8
      };
    }
    return {
      speedMult: 1.12,
      throwMult: 1.12,
      grabBonus: 0.35,
      heavyCarryFloor: 0.65,
      heavyJump: 5.8,
      stunMult: 1.0,
      slipperyTractionMult: 1.0,
      fragileBreakVel: -7.5
    };
  }

  findNearestGrabbable(p, maxDist = 2.0) {
    if (!p) return null;
    const perk = this.getVariantPerk(p.variant);
    let nearest = null;
    let bestScore = Infinity;
    this.items.forEach((it) => {
      if (!it.isHeld && !it.isDelivered && !it.isBroken) {
        const floorY = this.getFloorHeightAt(it.x, it.z, it.y);
        const isAirborne = it.y > floorY + 0.24 && (Math.abs(it.vy) > 0.35 || Math.hypot(it.vx, it.vz) > 1.0);
        const reach = maxDist + perk.grabBonus + (isAirborne ? 0.65 : 0);
        const d = Math.hypot(it.x - p.x, it.z - p.z) + Math.abs(it.y - p.y) * 0.55;
        const score = isAirborne ? d - 0.35 : d;
        if (d < reach && score < bestScore) {
          bestScore = score;
          nearest = it;
        }
      }
    });
    return nearest;
  }

  updateHelperVisuals(activePlayer, timeMs) {
    if (!this.grabHighlightRing || !this.truckGuideArrow) return;
    if (this.gameState !== 'PLAYING' || !activePlayer || activePlayer.stunTimer > 0) {
      this.grabHighlightRing.visible = false;
      this.truckGuideArrow.visible = false;
      return;
    }

    if (!activePlayer.holdingItem) {
      this.truckGuideArrow.visible = false;
      const target = this.findNearestGrabbable(activePlayer);
      const lever = this.mechanics?.findLeverNear(activePlayer.x, activePlayer.y, activePlayer.z, 1.45);
      const itemDist = target ? Math.hypot(target.x - activePlayer.x, target.z - activePlayer.z) : Infinity;
      if (lever && lever.dist <= itemDist + 0.25) {
        const pulse = 1 + Math.sin(timeMs * 0.01) * 0.12;
        this.grabHighlightRing.position.set(lever.sw.x, lever.sw.y + 0.18, lever.sw.z);
        this.grabHighlightRing.scale.setScalar(pulse);
        this.grabHighlightRing.visible = true;
      } else if (target) {
        const pulse = 1 + Math.sin(timeMs * 0.01) * 0.1;
        this.grabHighlightRing.position.set(target.x, target.y + 0.06, target.z);
        this.grabHighlightRing.scale.setScalar(pulse);
        this.grabHighlightRing.visible = true;
      } else {
        this.grabHighlightRing.visible = false;
      }
      return;
    }

    this.grabHighlightRing.visible = false;
    const def = LEVELS_3D[this.currentLevel];
    if (!def || !def.truck) return;
    const dx = def.truck.x - activePlayer.x;
    const dz = def.truck.z - activePlayer.z;
    if (Math.hypot(dx, dz) < 1.2) {
      this.truckGuideArrow.visible = false;
      return;
    }
    const ang = Math.atan2(dx, dz);
    this.truckGuideArrow.position.set(
      activePlayer.x + Math.sin(ang) * 0.65,
      activePlayer.y + 0.10,
      activePlayer.z + Math.cos(ang) * 0.65
    );
    this.truckGuideArrow.rotation.y = ang;
    this.truckGuideArrow.visible = true;
  }

  wrapAngleDiff(diff) {
    if (!Number.isFinite(diff)) return 0;
    return Math.atan2(Math.sin(diff), Math.cos(diff));
  }

  clearLevelObjects() {
    this.players.forEach((p) => {
      if (p && p.bobi) {
        if (p.bobi.mixer) p.bobi.mixer.stopAllAction();
        if (p.bobi.disposeBadge) p.bobi.disposeBadge();
      }
    });
    const sharedMats = new Set(this.particleMatCache.values());
    while (this.levelGroup.children.length > 0) {
      const child = this.levelGroup.children[0];
      this.levelGroup.remove(child);
      child.traverse((obj) => {
        if ((!obj.isMesh && !obj.isSprite) || obj.isSkinnedMesh) return;
        if (obj.geometry && obj.geometry !== this.sharedParticleGeo && obj.geometry !== this.sharedPuffGeo && !obj.userData.sharedGeometry && !obj.userData.sharedAsset) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m && m !== this.puffMat && !sharedMats.has(m)) {
              if (obj.isSprite && m.map) m.map.dispose();
              m.dispose();
            }
          });
        }
      });
    }
    this.players = [];
    this.items = [];
    this.windows = [];
    this.trampolines = [];
    this.occluderMeshes = [];
    this.particles = [];
    this.mechanics = null;
    this.mechVisuals = null;
    this.overworld = null;
    this.truckCargoPlacements = [];
    this.lastItemSnapshots = [];
    this.lastP2SentPayload = '';
    this.pendingNetEvents = [];
    this.trajectoryDots.forEach(d => d.visible = false);
    if (this.grabHighlightRing) this.grabHighlightRing.visible = false;
    if (this.truckGuideArrow) this.truckGuideArrow.visible = false;
  }

  isLocalMultiMode() {
    return this.gameMode === 'LOCAL_2P' || this.gameMode === 'LOCAL_3P' || this.gameMode === 'LOCAL_4P';
  }

  getTargetPlayerCount() {
    if (this.gameMode === 'LOCAL_4P') return 4;
    if (this.gameMode === 'LOCAL_3P') return 3;
    if (this.gameMode === 'LOCAL_2P' || this.gameMode === 'LAN_COOP') return 2;
    return 1;
  }

  getP1ActiveTintHex() {
    const levelIds = Object.keys(LEVELS_3D).map(Number);
    const totalStars = this.progressStore.getTotalStars(levelIds);
    if (!isSkinUnlocked(this.selectedSkin, totalStars)) return null;
    const skin = BOBI_SKINS.find(s => s.id === this.selectedSkin);
    return skin?.tintHex ?? null;
  }

  async setupLevel(lvlId) {
    const loadSeq = ++this.levelLoadSeq;
    this.isSettingUpLevel = true;
    try {
      this.currentLevel = lvlId;
      const def = LEVELS_3D[lvlId] || LEVELS_3D[1];

      this.itemsDelivered = 0;
      this.targetItemsCount = def.targetItems;
      const chillBonus = this.selectedModifier === 'chill' ? 30 : 0;
      this.timeLeft = this.unlimitedTime ? -1 : (def.timeLimit + chillBonus);
      this.landlordRage = 0;
      this.matchStats = { windowsBroken: 0, fragileBroken: 0, anyItemBroken: 0, hazardHits: 0 };
      this.deliveryCombo = 0;
      this.comboTimer = 0;
      this.truckBounceOffset = 0;
      this.truckBounceVel = 0;
      this.deliveredSlotCount = 0;
      this.cameraShake = 0;

      // Clear & dispose previous level objects
      this.clearLevelObjects();

    // 1. Build Dynamic Lawn Ground, Multi-Roads & Patterned House Floor Zones
    const yardW = (def.floorSize?.w || 26) + 14;
    const yardD = (def.floorSize?.d || 18) + 10;
    const lawnTex = getLawnTex().clone();
    lawnTex.wrapS = THREE.RepeatWrapping;
    lawnTex.wrapT = THREE.RepeatWrapping;
    lawnTex.repeat.set(Math.max(6, Math.round(yardW / 5.5)), Math.max(4, Math.round(yardD / 5.5)));
    lawnTex.needsUpdate = true;
    const yard = new THREE.Mesh(
      new THREE.BoxGeometry(yardW, 0.8, yardD),
      new THREE.MeshStandardMaterial({ color: 0xffffff, map: lawnTex, roughness: 0.92 })
    );
    yard.position.set(0.0, -0.42, 0);
    yard.receiveShadow = true;
    this.levelGroup.add(yard);

    if (this.sunLight) {
      const halfW = Math.max(16, (def.floorSize?.w || 26) * 0.62);
      const halfD = Math.max(13, (def.floorSize?.d || 18) * 0.68);
      this.sunLight.shadow.camera.left = -halfW;
      this.sunLight.shadow.camera.right = halfW;
      this.sunLight.shadow.camera.top = halfD;
      this.sunLight.shadow.camera.bottom = -halfD;
      this.sunLight.shadow.camera.updateProjectionMatrix();
    }

    const roadList = def.roads || [{ x: 8.2, z: 0, w: 7.6, d: 17.0 }];
    roadList.forEach((rd) => {
      const road = new THREE.Mesh(
        new THREE.BoxGeometry(rd.w, 0.06, rd.d),
        new THREE.MeshStandardMaterial({ color: 0x576574, roughness: 0.86 })
      );
      road.position.set(rd.x, 0.01, rd.z);
      road.receiveShadow = true;
      this.levelGroup.add(road);
      addRoadMarkings(this.levelGroup, rd);
    });

    const floorZones = def.houseZones || (def.houseBounds ? [def.houseBounds] : []);
    floorZones.forEach((hb, zIdx) => {
      const hw = hb.maxX - hb.minX;
      const hd = hb.maxZ - hb.minZ;
      let styleKey = 'polka_pink';
      let baseHex = '#f47b8c';
      if (lvlId === 2) {
        styleKey = 'parquet_lavender';
        baseHex = '#c4b5fd';
      } else if (lvlId === 3) {
        styleKey = zIdx === 0 ? 'bistro_tile' : 'polka_blue';
        baseHex = zIdx === 0 ? '#fef3c7' : '#bfdbfe';
      } else if (lvlId === 4) {
        styleKey = 'bistro_tile';
        baseHex = '#fde68a';
      } else if (lvlId === 5) {
        styleKey = 'concrete_site';
        baseHex = '#cbd5e1';
      } else if (lvlId === 6) {
        styleKey = 'warehouse_grid';
        baseHex = '#cbd5e1';
      } else if (lvlId === 7) {
        styleKey = 'bistro_tile';
        baseHex = '#e0f2fe';
      } else if (lvlId === 8) {
        styleKey = 'parquet_lavender';
        baseHex = '#fbcfe8';
      } else if (lvlId === 9) {
        styleKey = 'parquet_lavender';
        baseHex = '#fde68a';
      } else if (lvlId === 10) {
        styleKey = 'polka_blue';
        baseHex = '#bae6fd';
      } else if (lvlId === 11) {
        styleKey = 'concrete_site';
        baseHex = '#cbd5e1';
      } else if (lvlId === 12) {
        styleKey = 'parquet_lavender';
        baseHex = '#fef08a';
      }
      const patTex = getFloorPatternTex(styleKey, baseHex).clone();
      patTex.wrapS = THREE.RepeatWrapping;
      patTex.wrapT = THREE.RepeatWrapping;
      patTex.repeat.set(Math.max(1, hw / 3.2), Math.max(1, hd / 3.2));
      patTex.needsUpdate = true;
      const houseFloor = new THREE.Mesh(
        new THREE.BoxGeometry(hw, 0.14, hd),
        new THREE.MeshStandardMaterial({ color: 0xffffff, map: patTex, roughness: 0.62 })
      );
      houseFloor.position.set((hb.minX + hb.maxX) / 2, 0.04, (hb.minZ + hb.maxZ) / 2);
      houseFloor.receiveShadow = true;
      this.levelGroup.add(houseFloor);
    });

    // Distinct per-room flooring, rugs, thresholds & open door frames
    buildRoomFloors3D(def, this.levelGroup);

    // Platforms (Upper Tiers) - fadeable if occluding player below
    def.platforms.forEach((p) => {
      const deckMat = new THREE.MeshStandardMaterial({
        color: 0xd4a373, roughness: 0.6, transparent: true, opacity: 1.0
      });
      const deck = new THREE.Mesh(new THREE.BoxGeometry(p.w, 0.25, p.d), deckMat);
      deck.position.set(p.x, p.y - 0.125, p.z);
      deck.castShadow = true;
      deck.receiveShadow = true;
      this.levelGroup.add(deck);
      this.occluderMeshes.push(deck);

      // Support pillars
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
      const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, p.y, 10), pillarMat);
      pil.position.set(p.x + p.w / 2 - 0.3, p.y / 2, p.z + p.d / 2 - 0.3);
      pil.castShadow = true;
      this.levelGroup.add(pil);
    });

    // Ramps connecting floors
    def.ramps.forEach((r) => {
      const rW = r.maxX - r.minX;
      const rD = r.maxZ - r.minZ;
      const dy = r.yEnd - r.yStart;
      const span = r.axis === 'x' ? rW : rD;
      const len = Math.hypot(span, dy);
      const angle = Math.atan2(dy, span);

      const rampMesh = new THREE.Mesh(
        new THREE.BoxGeometry(r.axis === 'x' ? len : rW, 0.18, r.axis === 'x' ? rD : len),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 })
      );
      rampMesh.position.set((r.minX + r.maxX) / 2, (r.yStart + r.yEnd) / 2 - 0.05, (r.minZ + r.maxZ) / 2);
      if (r.axis === 'x') {
        rampMesh.rotation.z = r.dir < 0 ? -angle : angle;
      } else {
        rampMesh.rotation.x = r.dir > 0 ? -angle : angle;
      }
      rampMesh.castShadow = true;
      rampMesh.receiveShadow = true;
      this.levelGroup.add(rampMesh);
    });

    // Walls (cutaway brick walls with cream top caps + wooden garden fences)
    const wallPalette = {
      1: '#e59467',
      2: '#d98b72',
      3: '#e8b06b',
      4: '#d98a5f',
      5: '#d99043',
      6: '#94a3b8',
      7: '#60a5fa',
      8: '#f472b6',
      9: '#818cf8',
      10: '#38bdf8',
      11: '#64748b',
      12: '#f59e0b'
    };
    const wallHex = wallPalette[lvlId] || '#e59467';
    def.walls.forEach((w) => {
      const m = createDioramaWall3D(w.w, w.h, w.d, {
        wallHex: w.wallHex || wallHex,
        isInterior: !!w.isInterior,
        capHex: 0xfef7e6
      });
      m.position.set(w.x, m.userData.overrideY ?? w.y, w.z);
      this.levelGroup.add(m);
      this.occluderMeshes.push(m);
    });

    // Destructible Glass Partitions
    (def.windows || []).forEach((wDef) => {
      const mesh = createGlassWall3D(wDef.w, wDef.h, wDef.d);
      mesh.position.set(wDef.x, wDef.y, wDef.z);
      this.levelGroup.add(mesh);
      this.windows.push({ ...wDef, mesh, isBroken: false, hp: 2 });
    });

    // Trampolines (supports multiple trampolines per map)
    const trList = def.trampolines || (def.trampoline ? [def.trampoline] : []);
    trList.forEach((trDef) => {
      const trObj = { ...trDef, mesh: createTrampoline3D() };
      trObj.mesh.position.set(trDef.x, 0, trDef.z);
      this.levelGroup.add(trObj.mesh);
      this.trampolines.push(trObj);
    });

    // Delivery Truck (supports rotation for varied map layouts)
    this.truck = { ...def.truck, mesh: createTruck3D() };
    this.truck.mesh.position.set(def.truck.x, 0, def.truck.z);
    this.truck.mesh.rotation.y = def.truck.rotY || 0;
    this.levelGroup.add(this.truck.mesh);

    // Cozy diorama set dressing (sidewalk curbs, grass tufts, perimeter fence, trees, flamingos, rug, clock)
    buildLevelSetDressing3D(def, this.levelGroup, { lvlId });

    // Non-movable architectural room fixtures (counters, tubs, vanities, racks, desks, art, plants)
    buildArchitecturalFixtures3D(def, this.levelGroup);

    // Interactive Level Mechanics (switches, gates, pits, zones, elevators, hazards)
    this.mechanics = new LevelMechanics(def);
    this.mechVisuals = buildMechanicsVisuals(this.mechanics, this.levelGroup);

    // 2. Spawn 3D Furniture Items (with Carry-Only vs Throwable & Oriented Doorway Footprints)
    const FOOTPRINT_BY_TYPE = {
      bed: { footW: 1.05, footD: 1.55 },
      dining_table: { footW: 1.48, footD: 0.92 },
      sofa: { footW: 1.45, footD: 0.78 },
      bookshelf: { footW: 1.08, footD: 0.56 },
      piano: { footW: 1.32, footD: 0.95 },
      fridge: { footW: 0.86, footD: 0.86 },
      washer: { footW: 0.84, footD: 0.84 },
      stove: { footW: 0.88, footD: 0.84 },
      safe: { footW: 0.84, footD: 0.84 },
      generator: { footW: 0.92, footD: 0.78 }
    };

    def.items.forEach((iDef, idx) => {
      const isCarryOnly = iDef.isCarryOnly !== undefined
        ? !!iDef.isCarryOnly
        : !!(iDef.isHeavy || iDef.isSuperHeavy);
      const fp = FOOTPRINT_BY_TYPE[iDef.type] || null;
      const mesh = createPropMesh3D({ ...iDef, isCarryOnly });
      mesh.position.set(iDef.x, iDef.y + 0.05, iDef.z);
      this.levelGroup.add(mesh);
      this.items.push({
        id: idx,
        ...iDef,
        isCarryOnly,
        footW: fp ? fp.footW : 0,
        footD: fp ? fp.footD : 0,
        spawnX: iDef.x,
        spawnY: iDef.y,
        spawnZ: iDef.z,
        startY: iDef.y,
        vx: 0, vy: 0, vz: 0,
        vrot: 0,
        hazardCooldown: 0,
        hopTimer: 0.9 + Math.random() * 1.4,
        lastOwnerVariant: null,
        radius: (iDef.isSuperHeavy || iDef.type === 'sofa' || iDef.type === 'bed' || iDef.type === 'dining_table' || iDef.type === 'bookshelf' || iDef.type === 'piano') ? 0.64 : 0.42,
        isHeld: false,
        heldBy: null,
        isDelivered: false,
        isBroken: false,
        mesh
      });
    });

    // 3. Spawn 1-4 Real 3D Bobi Characters at map-defined spawn positions
    const pCount = this.getTargetPlayerCount();
    const playerSlots = [
      { variant: this.selectedVariantP1, tint: this.getP1ActiveTintHex(), badge: 'P1', color: '#f97316', fallback: { x: -1.5, y: 0.1, z: 1.5 } },
      { variant: this.selectedVariantP2, tint: 0xfda4af, badge: 'P2', color: '#0284c7', fallback: { x: -2.5, y: 0.1, z: -1.0 } },
      { variant: 'builder', tint: 0x86efac, badge: 'P3', color: '#16a34a', fallback: { x: -0.6, y: 0.1, z: -1.2 } },
      { variant: 'chef', tint: 0xc4b5fd, badge: 'P4', color: '#a855f7', fallback: { x: -2.4, y: 0.1, z: 1.8 } }
    ];

    for (let i = 0; i < pCount; i++) {
      const slotCfg = playerSlots[i];
      const sp = def.spawns?.[i] || slotCfg.fallback;
      const bobi = await this.modelCache.createCharacter(slotCfg.variant, slotCfg.tint);
      if (loadSeq !== this.levelLoadSeq) return;
      if (pCount > 1) {
        bobi.setPlayerBadge(slotCfg.badge, slotCfg.color);
      }
      const p = this.createPlayerEntity(i + 1, `Bobi ${slotCfg.badge}`, bobi, sp.x, sp.y, sp.z, slotCfg.variant);
      this.players.push(p);
      this.levelGroup.add(p.bobi.root);
    }

    this.syncHUD();
    } finally {
      if (loadSeq === this.levelLoadSeq) {
        this.isSettingUpLevel = false;
      }
    }
  }

  createPlayerEntity(id, name, bobiInstance, x, y, z, variant) {
    bobiInstance.root.position.set(x, y, z);
    return {
      id,
      name,
      variant,
      bobi: bobiInstance,
      spawnX: x, spawnY: y, spawnZ: z,
      x, y, z,
      netX: x, netY: y, netZ: z,
      vx: 0, vy: 0, vz: 0,
      rotY: 0.4,
      netRotY: 0.4,
      radius: 0.36,
      isGrounded: true,
      holdingItem: null,
      chargingThrow: false,
      throwPower: 0,
      throwCooldown: 0,
      stunTimer: 0,
      dashTimer: 0,
      dashCooldown: 0,
      dashHitCooldown: 0,
      catchBoostTimer: 0,
      puffTimer: 0,
      squashX: 1.0,
      squashY: 1.0
    };
  }

  async refreshMenuAvatar() {
    if (this.gameState !== 'MENU' || !this.players[0]) return;
    const p1 = this.players[0];
    if (p1.bobi) {
      if (p1.bobi.mixer) p1.bobi.mixer.stopAllAction();
      if (p1.bobi.disposeBadge) p1.bobi.disposeBadge();
    }
    this.levelGroup.remove(p1.bobi.root);
    const newBobi = await this.modelCache.createCharacter(this.selectedVariantP1, this.getP1ActiveTintHex());
    if (this.gameState !== 'MENU' || !this.players[0]) return;
    if (this.gameMode !== 'SOLO') {
      newBobi.setPlayerBadge('P1', '#f97316');
    }
    newBobi.root.position.set(p1.x, p1.y, p1.z);
    newBobi.root.rotation.y = p1.rotY;
    p1.bobi = newBobi;
    p1.variant = this.selectedVariantP1;
    this.levelGroup.add(newBobi.root);
  }

  bindInputs() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const code = e.code;
      const wasDown = this.keys[code];

      if (code === 'Escape') {
        if (this.mapSelectModalOpen) {
          this.closeMapSelectModal();
        } else if (this.controlsModalOpen) {
          this.closeControlsModal();
        } else if (this.settingsModalOpen) {
          this.closePauseOrSettings();
        } else if (this.gameState === 'OVERWORLD') {
          this.exitOverworldToMenu();
        } else if (this.gameState === 'PLAYING') {
          this.openPauseOrSettings();
        }
        return;
      }

      this.keys[code] = true;

      if (this.gameState === 'OVERWORLD' && !this.settingsModalOpen) {
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
          e.preventDefault();
        }
        if (!wasDown) {
          if (code === 'KeyQ') this.rotateCamera(-Math.PI / 4);
          if (code === 'KeyR') this.rotateCamera(Math.PI / 4);
          if ((code === 'Space' || code === 'Enter' || code === 'KeyJ') && this.overworld?.hoveredLevelId) {
            this.currentLevel = this.overworld.hoveredLevelId;
            this.startOrRestartMatch();
          }
        }
        return;
      }

      if (this.gameState !== 'PLAYING' || this.settingsModalOpen) return;

      const p1 = this.players[0];
      const p2 = this.players[1];

      // Prevent scrolling on game keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        e.preventDefault();
      }

      const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
      const isSingleKeyboard = !this.isLocalMultiMode();

      // Camera Rotate (Q / R) works anytime during gameplay
      if (!wasDown) {
        if (code === 'KeyQ') this.rotateCamera(-Math.PI / 4);
        if (code === 'KeyR') this.rotateCamera(Math.PI / 4);
        if (code === 'KeyG') {
          const emoteTarget = isLanClient ? p2 : p1;
          if (emoteTarget) this.triggerPlayerEmote(emoteTarget);
        }
        if (code === 'KeyH' && p2 && this.isLocalMultiMode()) {
          this.triggerPlayerEmote(p2);
        }
      }

      const isP1GrabKey = isSingleKeyboard ? code === 'KeyJ' : code === 'KeyC';
      const isP1ThrowKey = isSingleKeyboard ? code === 'KeyK' : code === 'KeyV';
      const isP1DashKey = code === 'KeyF';

      if (!wasDown && isLanClient && p2) {
        if (code === 'Space') this.playerJump(p2);
        if (isP1GrabKey) this.sendClientActionSafe('grab', p2);
        if (isP1DashKey && this.triggerDash(p2)) this.sendClientActionSafe('dash', p2);
        if (isP1ThrowKey && p2.holdingItem) {
          if (p2.holdingItem.isCarryOnly) {
            this.sendClientActionSafe('throw', p2, false);
          } else {
            p2.chargingThrow = true;
          }
        }
      } else if (!wasDown && !isLanClient && p1) {
        if (code === 'Space') this.playerJump(p1);
        if (isP1GrabKey) this.toggleGrab(p1);
        if (isP1DashKey) this.triggerDash(p1);
        if (isP1ThrowKey && p1.holdingItem) {
          if (p1.holdingItem.isCarryOnly) {
            this.releaseThrow(p1);
          } else {
            p1.chargingThrow = true;
          }
        }
      }

      if (!wasDown && p2 && this.isLocalMultiMode()) {
        if (code === 'ShiftRight' || code === 'Enter' || code === 'Numpad0') this.playerJump(p2);
        if (code === 'Slash' || code === 'Numpad3') this.triggerDash(p2);
        if (code === 'KeyK' || code === 'Numpad1') this.toggleGrab(p2);
        if ((code === 'KeyL' || code === 'Numpad2') && p2.holdingItem) {
          if (p2.holdingItem.isCarryOnly) {
            this.releaseThrow(p2);
          } else {
            p2.chargingThrow = true;
          }
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      this.keys[code] = false;

      if (this.gameState !== 'PLAYING') return;

      const p1 = this.players[0];
      const p2 = this.players[1];
      const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
      const isSingleKeyboard = !this.isLocalMultiMode();
      const isP1ThrowKey = isSingleKeyboard ? code === 'KeyK' : code === 'KeyV';

      if (isLanClient && isP1ThrowKey && p2 && p2.chargingThrow) {
        this.sendClientActionSafe('throw', p2, false);
        p2.chargingThrow = false;
        p2.throwPower = 0;
      } else if (!isLanClient && isP1ThrowKey && p1 && p1.chargingThrow) {
        this.releaseThrow(p1);
      }

      if ((code === 'KeyL' || code === 'Numpad2') && p2 && p2.chargingThrow && this.isLocalMultiMode()) {
        this.releaseThrow(p2);
      }
    });

    // Mouse Wheel Zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camZoom = THREE.MathUtils.clamp(this.camZoom + Math.sign(e.deltaY) * 0.08, 0.70, 1.45);
    }, { passive: false });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mouse Aim + Throw for active local player in single-keyboard modes (Solo / LAN Co-op)
    this.canvas.addEventListener('pointerdown', (e) => {
      if (this.gameState !== 'PLAYING' || this.isLocalMultiMode()) return;
      soundManager.init();
      const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
      const activePlayer = isLanClient ? this.players[1] : this.players[0];
      if (!activePlayer) return;

      this.updateMouseAim(e);

      // Right-click drops held item gently (or grabs when empty); Left-click grabs or aims+throws
      if (e.button === 2) {
        if (isLanClient) {
          this.sendClientActionSafe('grab', activePlayer);
        } else {
          this.toggleGrab(activePlayer);
        }
        return;
      }

      if (activePlayer.holdingItem) {
        if (activePlayer.holdingItem.isCarryOnly) {
          if (isLanClient) {
            this.sendClientActionSafe('throw', activePlayer, true);
          } else {
            this.releaseThrow(activePlayer, true);
          }
        } else {
          this.pointerAiming = true;
          activePlayer.chargingThrow = true;
        }
      } else if (isLanClient) {
        this.sendClientActionSafe('grab', activePlayer);
      } else {
        this.toggleGrab(activePlayer);
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (this.pointerAiming) {
        this.updateMouseAim(e);
      }
    });

    window.addEventListener('pointerup', () => {
      if (this.pointerAiming) {
        this.pointerAiming = false;
        const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
        const activePlayer = isLanClient ? this.players[1] : this.players[0];
        if (!activePlayer || !activePlayer.chargingThrow) return;

        if (isLanClient) {
          this.sendClientActionSafe('throw', activePlayer, true);
          activePlayer.chargingThrow = false;
          activePlayer.throwPower = 0;
        } else {
          this.releaseThrow(activePlayer, true);
        }
      }
    });
  }

  updateMouseAim(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouseNDC, this.camera);
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.raycaster.ray.intersectPlane(groundPlane, this.aimWorldPoint);
  }

  /**
   * Synchronizes menu instructions & HUD bottom keybinding hints for the active gameMode & language.
   */
  syncControlHints() {
    const lanPanel = document.getElementById('lan-panel');
    const p1Label = document.getElementById('p1-controls-label');
    const p2Label = document.getElementById('p2-controls-label');

    if (this.gameMode === 'SOLO') {
      if (lanPanel) lanPanel.style.display = 'none';
      if (p1Label) p1Label.innerHTML = t('ctrl_single_hud');
      if (p2Label) p2Label.style.display = 'none';
    } else if (this.isLocalMultiMode()) {
      if (lanPanel) lanPanel.style.display = 'none';
      if (p1Label) p1Label.innerHTML = t('ctrl_p1_hud');
      if (p2Label) {
        p2Label.style.display = 'inline';
        p2Label.innerHTML = t('ctrl_p2_hud');
      }
    } else if (this.gameMode === 'LAN_COOP') {
      if (lanPanel) lanPanel.style.display = 'block';
      if (p1Label) p1Label.innerHTML = t('ctrl_single_hud');
      if (p2Label) p2Label.style.display = 'none';
    }
  }

  bindDOM() {
    // Variant Selector Cards
    document.querySelectorAll('.variant-card').forEach((card) => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.variant-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedVariantP1 = card.dataset.variant;
        this.refreshMenuAvatar();
      });
    });

    // Level Selector Cards (inside Map Select Modal)
    document.querySelectorAll('.level-card').forEach((c) => {
      c.addEventListener('click', () => {
        document.querySelectorAll('.level-card').forEach(x => x.classList.remove('selected'));
        c.classList.add('selected');
        this.currentLevel = parseInt(c.dataset.level, 10);
        this.updateStageSpotlight();
        this.renderSelectedMapSummary();
        this.closeMapSelectModal();
        this.setupLevel(this.currentLevel);
      });
    });

    // Map Select Modal toggle
    document.getElementById('open-map-select-btn')?.addEventListener('click', () => this.openMapSelectModal());
    document.getElementById('map-select-close-btn')?.addEventListener('click', () => this.closeMapSelectModal());
    document.getElementById('map-select-modal')?.addEventListener('click', (e) => {
      if (e.target?.id === 'map-select-modal') this.closeMapSelectModal();
    });

    // Overworld 3D Map Hub Buttons
    document.getElementById('overworld-btn')?.addEventListener('click', () => this.enterOverworld());
    document.getElementById('overworld-back-btn')?.addEventListener('click', () => this.exitOverworldToMenu());
    document.getElementById('overworld-launch-btn')?.addEventListener('click', () => {
      if (this.overworld?.hoveredLevelId) {
        this.currentLevel = this.overworld.hoveredLevelId;
      }
      this.startOrRestartMatch();
    });
    document.getElementById('end-overworld-btn')?.addEventListener('click', () => this.enterOverworld());

    // Match Modifier Pills
    document.querySelectorAll('.mod-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.mod-pill').forEach(x => x.classList.remove('active'));
        pill.classList.add('active');
        this.selectedModifier = pill.dataset.mod || 'normal';
        this.settings.modifier = this.selectedModifier;
        saveSettings(this.settings);
      });
    });

    // Game Mode Tabs (1P, 2P, 3P, 4P, LAN)
    document.querySelectorAll('.mode-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.gameMode = tab.dataset.mode;

        this.syncControlHints();
        if (this.gameMode === 'LAN_COOP') {
          this.checkLANStatus();
        }
        this.setupLevel(this.currentLevel);
      });
    });

    this.syncControlHints();

    // Time Mode toggle (Standard Countdown vs Unlimited Time)
    document.querySelectorAll('.time-mode-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.time-mode-pill').forEach(x => x.classList.remove('active'));
        pill.classList.add('active');
        this.unlimitedTime = pill.dataset.unlimited === 'true';
        this.updateStageSpotlight();
      });
    });

    // Camera Orbit Buttons (Gameplay HUD + Menu Diorama Showcase)
    document.getElementById('cam-left-btn')?.addEventListener('click', () => this.rotateCamera(-Math.PI / 4));
    document.getElementById('cam-right-btn')?.addEventListener('click', () => this.rotateCamera(Math.PI / 4));
    document.getElementById('menu-cam-left')?.addEventListener('click', () => { this.menuOrbitBias -= Math.PI / 4; });
    document.getElementById('menu-cam-right')?.addEventListener('click', () => { this.menuOrbitBias += Math.PI / 4; });

    // Unified Guide Modal (menu + in-game HUD button + first-play hint close)
    document.getElementById('controls-toggle-btn')?.addEventListener('click', () => this.openControlsModal());
    document.getElementById('hud-guide-btn')?.addEventListener('click', () => this.openControlsModal());
    document.getElementById('controls-close-btn')?.addEventListener('click', () => this.closeControlsModal());
    document.getElementById('controls-modal')?.addEventListener('click', (e) => {
      if (e.target?.id === 'controls-modal') this.closeControlsModal();
    });
    document.getElementById('hud-hint-close-btn')?.addEventListener('click', () => {
      document.getElementById('controls-hint-text')?.classList.remove('is-first-play');
      this.settings.guideSeen = true;
      saveSettings(this.settings);
    });

    // Start, Replay, Pause & Menu buttons
    document.getElementById('start-play-btn')?.addEventListener('click', () => this.startOrRestartMatch());
    document.getElementById('replay-btn')?.addEventListener('click', () => this.requestOrRestartMatch());
    document.getElementById('menu-back-btn')?.addEventListener('click', () => this.returnToMenu());
    document.getElementById('menu-btn')?.addEventListener('click', () => this.returnToMenu());
    document.getElementById('pause-btn')?.addEventListener('click', () => this.handlePauseToggle());
    document.getElementById('menu-settings-btn')?.addEventListener('click', () => this.openPauseOrSettings());
    document.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
      this.setLanguage(this.settings.lang === 'vi' ? 'en' : 'vi');
    });

    // Pause / Settings Modal controls
    document.getElementById('set-lang-vi')?.addEventListener('click', () => this.setLanguage('vi'));
    document.getElementById('set-lang-en')?.addEventListener('click', () => this.setLanguage('en'));
    document.getElementById('bgm-vol-slider')?.addEventListener('input', (e) => {
      soundManager.init();
      const val = Number(e.target.value) / 100;
      this.settings.bgmVolume = val;
      this.settings.bgmEnabled = val > 0.001;
      soundManager.setBgmVolume(val);
      if (this.settings.bgmEnabled && this.gameState === 'PLAYING') soundManager.startBGM();
      saveSettings(this.settings);
      this.syncAudioButtons();
    });
    document.getElementById('sfx-vol-slider')?.addEventListener('input', (e) => {
      soundManager.init();
      const val = Number(e.target.value) / 100;
      this.settings.sfxVolume = val;
      this.settings.sfxEnabled = val > 0.001;
      soundManager.setSfxVolume(val);
      saveSettings(this.settings);
      this.syncAudioButtons();
    });
    document.getElementById('set-gfx-btn')?.addEventListener('click', () => {
      this.togglePerformanceMode();
      this.syncSettingsModalUI();
    });
    document.getElementById('set-rumble-btn')?.addEventListener('click', () => {
      this.settings.rumbleEnabled = !this.settings.rumbleEnabled;
      this.gamepadManager.rumbleEnabled = this.settings.rumbleEnabled;
      saveSettings(this.settings);
      if (this.settings.rumbleEnabled) this.gamepadManager.rumble(0, 0.35, 80);
      this.syncSettingsModalUI();
    });
    document.getElementById('set-fs-btn')?.addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('pause-resume-btn')?.addEventListener('click', () => this.closePauseOrSettings());
    document.getElementById('pause-restart-btn')?.addEventListener('click', () => {
      this.closePauseOrSettings();
      this.requestOrRestartMatch();
    });
    document.getElementById('pause-menu-btn')?.addEventListener('click', () => {
      this.closePauseOrSettings();
      this.returnToMenu();
    });

    // Touch buttons & Virtual Joystick
    this.bindTouchControls();

    document.getElementById('joystick-btn')?.addEventListener('click', () => {
      const zone = document.getElementById('touch-joystick-zone');
      if (zone) zone.classList.toggle('visible');
    });

    document.getElementById('sound-btn')?.addEventListener('click', () => {
      soundManager.init();
      this.settings.sfxEnabled = soundManager.toggleSFX();
      saveSettings(this.settings);
      this.syncAudioButtons();
    });
    document.getElementById('music-btn')?.addEventListener('click', () => {
      soundManager.init();
      this.settings.bgmEnabled = soundManager.toggleBGM();
      saveSettings(this.settings);
      this.syncAudioButtons();
    });
    document.getElementById('perf-btn')?.addEventListener('click', () => {
      const hq = this.togglePerformanceMode();
      this.ui.addFeedPill(`<span>${hq ? t('set_gfx_high') : t('set_gfx_smooth')}</span>`, 'glass');
      this.syncSettingsModalUI();
    });

    // Apply saved localization, audio sliders, controller pill & saved stars immediately
    this.applyLocalization();
    this.syncAudioButtons();
    this.syncSettingsModalUI();
    this.updateGamepadStatusChip(this.gamepadManager.connectedCount);

    // LAN Host & Join
    document.getElementById('btn-lan-host')?.addEventListener('click', () => {
      const room = document.getElementById('lan-room-input').value.trim() || 'room1';
      this.connectLAN('host', room);
    });
    document.getElementById('btn-lan-join')?.addEventListener('click', () => {
      const room = document.getElementById('lan-room-input').value.trim() || 'room1';
      this.connectLAN('client', room);
    });

    this.network.onP2StateReceived = (p2State) => {
      const p2 = this.players[1];
      if (!p2 || !p2State) return;
      if (Number.isFinite(p2State.x)) p2.netX = p2State.x;
      if (Number.isFinite(p2State.y)) p2.netY = p2State.y;
      if (Number.isFinite(p2State.z)) p2.netZ = p2State.z;
      if (Number.isFinite(p2State.rotY)) p2.netRotY = p2State.rotY;
      p2.squashX = Number.isFinite(p2State.sx) ? p2State.sx : 1.0;
      p2.squashY = Number.isFinite(p2State.sy) ? p2State.sy : 1.0;
      if (p2State.anim) p2.bobi.playAnimation(p2State.anim, 0.1);
    };

    this.network.onP2ActionReceived = (act) => {
      const p2 = this.players[1];
      if (!p2 || !act) return;
      // Snap P2 to exact client coords at action instant
      p2.x = p2.netX = act.x;
      p2.y = p2.netY = act.y;
      p2.z = p2.netZ = act.z;
      p2.rotY = p2.netRotY = act.rotY;

      if (act.type === 'grab') {
        this.toggleGrab(p2);
      } else if (act.type === 'dash') {
        this.triggerDash(p2, { isRemote: true });
      } else if (act.type === 'throw' && p2.holdingItem) {
        p2.throwPower = act.power ?? 0.6;
        if (act.useAim) {
          this.aimWorldPoint.set(act.aimX, 0, act.aimZ);
          this.releaseThrow(p2, true);
        } else {
          this.releaseThrow(p2, false);
        }
      } else if (act.type === 'pit_fall') {
        const dropped = this.detachHeldItem(p2);
        if (dropped) {
          this.respawnItemSafely(dropped, {
            toastText: t('mech_item_respawn'),
            feedLabel: '🕳️ Rớt hố',
            penaltyRatio: 0.15,
            countFragile: !!dropped.isFragile
          });
        }
      }
    };

    this.network.onStateReceived = (state) => this.applyHostState(state);

    eventBus.on('peerConnected', (info = {}) => {
      if (info.p2Variant) this.selectedVariantP2 = info.p2Variant;
      this.ui.addFeedPill('<span>P2 đã vào!</span><b style="color:#0284c7;">Sẵn sàng</b>');
      this.startOrRestartMatch();
    });
    eventBus.on('roomJoined', (info = {}) => {
      if (info.level) this.currentLevel = info.level;
      if (info.p1Variant) this.selectedVariantP1 = info.p1Variant;
      if (info.p2Variant) this.selectedVariantP2 = info.p2Variant;
      this.unlimitedTime = !!info.unlimitedTime;
      this.syncMenuSelectionsUI();
      this.ui.addFeedPill('<span>Đã vào phòng!</span><b style="color:#15803d;">Bắt đầu</b>');
      this.startGame();
    });
    eventBus.on('restartGame', (info = {}) => {
      if (info.level) this.currentLevel = info.level;
      if (info.p1Variant) this.selectedVariantP1 = info.p1Variant;
      if (info.p2Variant) this.selectedVariantP2 = info.p2Variant;
      if (info.unlimitedTime !== undefined) this.unlimitedTime = !!info.unlimitedTime;
      this.syncMenuSelectionsUI();
      this.ui.addFeedPill('<span>🔄 Host đã bắt đầu màn mới!</span>', 'glass');
      this.startGame();
    });
    eventBus.on('restartRequested', () => {
      if (this.gameMode === 'LAN_COOP' && this.network.role === 'host') {
        this.ui.addFeedPill('<span>🔄 Client P2 yêu cầu chơi lại!</span>', 'glass');
        this.startOrRestartMatch();
      }
    });
    eventBus.on('joinError', ({ message } = {}) => {
      const text = message || 'Không thể vào phòng LAN!';
      const statusPill = document.getElementById('lan-status-text');
      if (statusPill) {
        statusPill.innerText = text;
        statusPill.style.color = '#ef4444';
      }
      this.ui.addFeedPill(`<span>⚠️ ${text}</span>`, 'broke');
    });
  }

  syncMenuSelectionsUI() {
    document.querySelectorAll('.level-card').forEach((card) => {
      card.classList.toggle('selected', parseInt(card.dataset.level, 10) === this.currentLevel);
    });
    document.querySelectorAll('.time-mode-pill').forEach((pill) => {
      pill.classList.toggle('active', (pill.dataset.unlimited === 'true') === !!this.unlimitedTime);
    });
    this.updateStageSpotlight();
    this.renderSelectedMapSummary();
  }

  setLanguage(lang) {
    setLang(lang);
    this.settings.lang = lang === 'en' ? 'en' : 'vi';
    saveSettings(this.settings);
    this.applyLocalization();
    this.syncHUD();
  }

  applyLocalization() {
    document.title = t('page_title');
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text;
    };

    setText('logo-title', t('logo_title'));
    setText('logo-sub', t('logo_sub'));
    setText('sec-char-mode-label', t('sec_character_mode'));
    setText('sec-levels-label', t('sec_levels'));
    setText('open-map-select-btn', t('open_map_select_btn'));
    setText('overworld-btn', t('overworld_btn'));
    setText('overworld-launch-btn', t('overworld_launch_btn'));
    setText('overworld-back-btn', t('overworld_back_btn'));
    setText('map-select-modal-title', t('map_select_modal_title'));
    setText('map-select-close-btn', t('btn_close'));
    setText('var-base-title', t('variant_base_title'));
    setText('var-base-desc', t('variant_base_desc'));
    setText('var-base-perk', t('variant_base_perk'));
    setText('var-builder-title', t('variant_builder_title'));
    setText('var-builder-desc', t('variant_builder_desc'));
    setText('var-builder-perk', t('variant_builder_perk'));
    setText('var-chef-title', t('variant_chef_title'));
    setText('var-chef-desc', t('variant_chef_desc'));
    setText('var-chef-perk', t('variant_chef_perk'));
    setText('mode-tab-solo', t('mode_solo'));
    setText('mode-tab-local2p', t('mode_local2p'));
    setText('mode-tab-local3p', t('mode_local3p'));
    setText('mode-tab-local4p', t('mode_local4p'));
    setText('mode-tab-lan', t('mode_lan'));
    setText('skin-picker-label', t('skin_label'));
    setText('mod-picker-label', t('mod_label'));
    setText('mod-pill-normal', t('mod_normal'));
    setText('mod-pill-turbo', t('mod_turbo'));
    setText('mod-pill-bouncy', t('mod_bouncy'));
    setText('mod-pill-chill', t('mod_chill'));
    setText('time-mode-label', t('time_label'));
    setText('time-pill-std', t('time_standard'));
    setText('time-pill-unl', t('time_unlimited'));
    setText('lan-header-text', t('lan_header'));
    if (!this.network.isConnected) setText('lan-status-text', t('lan_ready'));
    setText('btn-lan-host', t('lan_host_btn'));
    setText('btn-lan-join', t('lan_join_btn'));
    setText('start-play-btn', t('play_btn'));
    setText('link-2d-mode', t('link_2d'));
    setText('menu-settings-btn', t('menu_settings_btn'));
    setText('controls-toggle-btn', t('controls_btn'));
    setText('controls-modal-title', t('controls_modal_title'));
    const guideBody = document.getElementById('guide-modal-body');
    if (guideBody) guideBody.innerHTML = t('guide_full_html');
    setText('controls-close-btn', t('btn_close'));
    setText('stage-cam-hint', t('stage_cam_hint'));
    setText('lang-toggle-btn', this.settings.lang === 'en' ? '🇺🇸 EN' : '🇻🇳 VI');

    setText('hud-truck-label', t('hud_truck'));
    setText('hud-cash-label', t('hud_cash'));
    setText('hud-rage-label', t('hud_rage'));
    setText('touch-dash-btn', t('touch_dash'));
    setText('touch-jump-btn', t('touch_jump'));
    setText('touch-grab-btn', t('touch_grab'));
    setText('touch-throw-btn', t('touch_throw'));
    setText('end-earnings-label', t('end_earnings_label'));
    setText('replay-btn', t('end_replay_btn'));
    setText('menu-back-btn', t('end_menu_btn'));

    setText('set-lang-label', t('set_language'));
    setText('set-bgm-label', t('set_bgm_vol'));
    setText('set-sfx-label', t('set_sfx_vol'));
    setText('set-gfx-label', t('set_graphics'));
    setText('set-rumble-label', t('set_rumble'));
    setText('set-fs-label', t('set_fullscreen'));
    setText('set-fs-btn', t('set_fs_toggle'));
    setText('pause-restart-btn', t('btn_restart_match'));
    setText('pause-menu-btn', t('btn_exit_menu'));

    this.syncControlHints();
    this.syncSettingsModalUI();
    this.renderProgressCards();
    this.updateGamepadStatusChip(this.gamepadManager.connectedCount);
  }

  renderSkinAndModifierUI(totalStars = 0) {
    const skinRow = document.getElementById('skin-picker-row');
    if (skinRow) {
      skinRow.innerHTML = '';
      BOBI_SKINS.forEach((skin) => {
        const unlocked = isSkinUnlocked(skin.id, totalStars);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'skin-swatch' + (this.selectedSkin === skin.id ? ' selected' : '') + (!unlocked ? ' locked' : '');
        btn.style.background = skin.swatch;
        btn.title = `${this.settings.lang === 'en' ? skin.nameEn : skin.nameVi}${unlocked ? '' : ` (${skin.reqStars}★)`}`;
        btn.innerHTML = unlocked ? (this.selectedSkin === skin.id ? '✓' : '') : `<span class="skin-lock-tag">🔒${skin.reqStars}★</span>`;
        btn.addEventListener('click', () => {
          if (!unlocked) {
            this.ui.addFeedPill(`<span>🔒 ${t('skin_locked_toast', { stars: skin.reqStars })}</span>`, 'bounce');
            soundManager.bonk();
            return;
          }
          this.selectedSkin = skin.id;
          this.settings.selectedSkin = skin.id;
          saveSettings(this.settings);
          this.renderSkinAndModifierUI(totalStars);
          this.refreshMenuAvatar();
        });
        skinRow.appendChild(btn);
      });
    }

    document.querySelectorAll('.mod-pill').forEach((pill) => {
      pill.classList.toggle('active', (pill.dataset.mod || 'normal') === this.selectedModifier);
    });
  }

  renderProgressCards() {
    const levelIds = Object.keys(LEVELS_3D).map(Number);
    const totalStars = this.progressStore.getTotalStars(levelIds);
    const maxStars = levelIds.length * 3;
    const totalPill = document.getElementById('total-stars-pill');
    if (totalPill) {
      totalPill.innerText = t('total_stars_fmt', { stars: totalStars, max: maxStars });
    }
    const ovPill = document.getElementById('overworld-stars-pill');
    if (ovPill) {
      ovPill.innerText = t('total_stars_fmt', { stars: totalStars, max: maxStars });
    }
    this.renderSkinAndModifierUI(totalStars);

    document.querySelectorAll('.level-card').forEach((card) => {
      const id = parseInt(card.dataset.level, 10);
      const def = LEVELS_3D[id];
      const txt = getLevelText(id);
      const rec = this.progressStore.getLevelRecord(id);
      if (!def) return;

      let starsHtml = '';
      for (let s = 1; s <= 3; s++) {
        starsHtml += `<span class="${s <= rec.bestStars ? 'star-lit' : 'star-dim'}">★</span>`;
      }

      const recordText = rec.bestTime !== null
        ? t('best_record_fmt', { score: rec.bestScore.toLocaleString('vi-VN'), time: rec.bestTime })
        : t('no_record');

      card.innerHTML = `
        <div class="level-card-top"><h4>${txt.name}</h4><span class="level-stars">${starsHtml}</span></div>
        <p>${txt.shortDesc}</p>
        <div class="level-card-meta"><span>${t('par_label', { sec: def.parTime || def.timeLimit })}</span><span>${recordText}</span></div>
      `;
    });
    this.renderSelectedMapSummary();
    this.updateStageSpotlight();
  }

  renderSelectedMapSummary() {
    const id = this.currentLevel || 1;
    const def = LEVELS_3D[id] || LEVELS_3D[1];
    const txt = getLevelText(id);
    const rec = this.progressStore.getLevelRecord(id);

    let starsHtml = '';
    for (let s = 1; s <= 3; s++) {
      starsHtml += `<span class="${s <= rec.bestStars ? 'star-lit' : 'star-dim'}">★</span>`;
    }
    const recordText = rec.bestTime !== null
      ? t('best_record_fmt', { score: rec.bestScore.toLocaleString('vi-VN'), time: rec.bestTime })
      : t('no_record');

    const nameEl = document.getElementById('selected-map-name');
    const starsEl = document.getElementById('selected-map-stars');
    const descEl = document.getElementById('selected-map-desc');
    const parEl = document.getElementById('selected-map-par');
    const recEl = document.getElementById('selected-map-record');
    if (nameEl) nameEl.innerText = txt.name;
    if (starsEl) starsEl.innerHTML = starsHtml;
    if (descEl) descEl.innerText = txt.shortDesc;
    if (parEl) parEl.innerText = t('par_label', { sec: def.parTime || def.timeLimit });
    if (recEl) recEl.innerText = recordText;
  }

  updateStageSpotlight() {
    const id = this.currentLevel || 1;
    const def = LEVELS_3D[id] || LEVELS_3D[1];
    const txt = getLevelText(id);
    const accents = {
      1: '#f59e0b',
      2: '#a855f7',
      3: '#ef4444',
      4: '#f97316',
      5: '#eab308',
      6: '#06b6d4',
      7: '#10b981',
      8: '#ec4899',
      9: '#6366f1',
      10: '#0ea5e9',
      11: '#475569',
      12: '#f59e0b'
    };
    const startOverlay = document.getElementById('start-overlay');
    if (startOverlay) startOverlay.style.setProperty('--active-lvl-accent', accents[id] || '#f59e0b');

    const tagEl = document.getElementById('spotlight-tag');
    const titleEl = document.getElementById('spotlight-title');
    const metaEl = document.getElementById('spotlight-meta');
    const bonusEl = document.getElementById('spotlight-bonus');
    if (tagEl) tagEl.innerText = t('spotlight_tag', { id });
    if (titleEl) titleEl.innerText = txt.name;
    if (metaEl) {
      const timeStr = this.unlimitedTime ? t('spotlight_unlimited') : t('spotlight_time', { sec: def.timeLimit });
      metaEl.innerText = `${t('spotlight_items', { count: def.targetItems })} • ${timeStr} • ${t('par_label', { sec: def.parTime || def.timeLimit })}`;
    }
    if (bonusEl) {
      bonusEl.innerText = `${t('spotlight_bonus_prefix')} ${txt.bonusLabel}`;
    }
  }

  openMapSelectModal() {
    this.mapSelectModalOpen = true;
    const modal = document.getElementById('map-select-modal');
    if (modal) modal.style.display = 'flex';
  }

  closeMapSelectModal() {
    this.mapSelectModalOpen = false;
    const modal = document.getElementById('map-select-modal');
    if (modal) modal.style.display = 'none';
  }

  openControlsModal() {
    this.controlsModalOpen = true;
    const modal = document.getElementById('controls-modal');
    if (modal) modal.style.display = 'flex';
  }

  closeControlsModal() {
    this.controlsModalOpen = false;
    const modal = document.getElementById('controls-modal');
    if (modal) modal.style.display = 'none';
  }

  updateGamepadStatusChip(count = 0) {
    const pill = document.getElementById('gamepad-status-pill');
    if (!pill) return;
    if (count > 0) {
      pill.style.display = 'inline-flex';
      pill.classList.add('pad-on');
      pill.innerText = t('gamepad_ready', { count });
    } else {
      pill.style.display = 'none';
      pill.classList.remove('pad-on');
    }
  }

  syncAudioButtons() {
    const sfxBtn = document.getElementById('sound-btn');
    const bgmBtn = document.getElementById('music-btn');
    if (sfxBtn) sfxBtn.innerText = soundManager.sfxOn && soundManager.sfxVolume > 0.001 ? '🔊' : '🔈';
    if (bgmBtn) bgmBtn.innerText = soundManager.bgmOn && soundManager.bgmVolume > 0.001 ? '🎵' : '🔇';

    const bgmSlider = document.getElementById('bgm-vol-slider');
    const sfxSlider = document.getElementById('sfx-vol-slider');
    const bgmVal = document.getElementById('bgm-vol-val');
    const sfxVal = document.getElementById('sfx-vol-val');
    const bgmPct = Math.round((this.settings.bgmEnabled ? this.settings.bgmVolume : 0) * 100);
    const sfxPct = Math.round((this.settings.sfxEnabled ? this.settings.sfxVolume : 0) * 100);
    if (bgmSlider) bgmSlider.value = String(bgmPct);
    if (sfxSlider) sfxSlider.value = String(sfxPct);
    if (bgmVal) bgmVal.innerText = `${bgmPct}%`;
    if (sfxVal) sfxVal.innerText = `${sfxPct}%`;
  }

  syncSettingsModalUI() {
    const isInMatch = this.gameState === 'PLAYING' || this.gameState === 'PAUSED';
    const titleEl = document.getElementById('pause-title');
    const lanNoteEl = document.getElementById('pause-lan-note');
    const resumeBtn = document.getElementById('pause-resume-btn');
    const matchActions = document.getElementById('pause-match-actions');

    if (titleEl) titleEl.innerText = isInMatch ? t('pause_title') : t('settings_title');
    if (lanNoteEl) {
      lanNoteEl.style.display = isInMatch && this.gameMode === 'LAN_COOP' ? 'block' : 'none';
      lanNoteEl.innerText = t('pause_lan_note');
    }
    if (resumeBtn) resumeBtn.innerText = isInMatch ? t('btn_resume') : t('btn_close');
    if (matchActions) matchActions.style.display = isInMatch ? 'flex' : 'none';

    document.getElementById('set-lang-vi')?.classList.toggle('active', this.settings.lang === 'vi');
    document.getElementById('set-lang-en')?.classList.toggle('active', this.settings.lang === 'en');

    const gfxBtn = document.getElementById('set-gfx-btn');
    if (gfxBtn) {
      gfxBtn.innerText = this.highQuality ? t('set_gfx_high') : t('set_gfx_smooth');
      gfxBtn.classList.toggle('active', this.highQuality);
    }
    const perfBtn = document.getElementById('perf-btn');
    if (perfBtn) perfBtn.innerText = this.highQuality ? '✨' : '⚡';

    const rumbleBtn = document.getElementById('set-rumble-btn');
    if (rumbleBtn) {
      rumbleBtn.innerText = this.settings.rumbleEnabled ? t('set_on') : t('set_off');
      rumbleBtn.classList.toggle('active', this.settings.rumbleEnabled);
    }
    this.syncAudioButtons();
  }

  handlePauseToggle() {
    if (this.settingsModalOpen) {
      this.closePauseOrSettings();
    } else {
      this.openPauseOrSettings();
    }
  }

  openPauseOrSettings() {
    if (this.gameState === 'PLAYING' && this.gameMode !== 'LAN_COOP') {
      this.gameState = 'PAUSED';
    }
    this.keys = {};
    this.pointerAiming = false;
    this.players.forEach((p) => { if (p) p.chargingThrow = false; });
    this.settingsModalOpen = true;
    this.syncSettingsModalUI();
    this.ui.setPauseModalVisible(true);
  }

  closePauseOrSettings() {
    this.settingsModalOpen = false;
    this.ui.setPauseModalVisible(false);
    if (this.gameState === 'PAUSED') {
      this.gameState = 'PLAYING';
    }
  }

  returnToMenu() {
    this.settingsModalOpen = false;
    this.ui.setPauseModalVisible(false);
    this.ui.hideOverworldHUD();
    this.gameState = 'MENU';
    soundManager.stopBGM();
    this.renderProgressCards();
    this.ui.showStartMenu();
    if (!this.players[0]) {
      this.setupLevel(this.currentLevel);
    }
  }

  enterOverworld() {
    soundManager.init();
    this.settingsModalOpen = false;
    this.closeControlsModal();
    this.closeMapSelectModal();
    this.ui.setPauseModalVisible(false);
    if (this.timerInterval) clearInterval(this.timerInterval);
    soundManager.stopBGM();

    this.clearLevelObjects();
    this.gameState = 'OVERWORLD';
    this.overworldLastPadId = null;
    this.overworld = new Overworld3D(this.levelGroup, this.progressStore, this.currentLevel);
    this.targetCamAngle = 0.0;
    this.camAngle = 0.0;

    const levelIds = Object.keys(LEVELS_3D).map(Number);
    const totalStars = this.progressStore.getTotalStars(levelIds);
    const ovPill = document.getElementById('overworld-stars-pill');
    if (ovPill) ovPill.innerText = t('total_stars_fmt', { stars: totalStars, max: levelIds.length * 3 });

    this.ui.showOverworldHUD();
    this.syncOverworldHUD({
      levelId: this.currentLevel,
      levelDef: LEVELS_3D[this.currentLevel],
      levelText: getLevelText(this.currentLevel)
    });
  }

  async exitOverworldToMenu() {
    this.ui.hideOverworldHUD();
    this.gameState = 'MENU';
    this.targetCamAngle = 0.22;
    await this.setupLevel(this.currentLevel);
    this.renderProgressCards();
    this.ui.showStartMenu();
  }

  syncOverworldHUD(ovState) {
    if (!ovState) return;
    const lvlId = ovState.levelId || this.currentLevel || 1;
    const def = ovState.levelDef || LEVELS_3D[lvlId] || LEVELS_3D[1];
    const txt = ovState.levelText || getLevelText(lvlId);
    const rec = this.progressStore.getLevelRecord(lvlId);
    const isParked = !!ovState.levelId;

    if (ovState.levelId && ovState.levelId !== this.overworldLastPadId) {
      this.overworldLastPadId = ovState.levelId;
      this.currentLevel = ovState.levelId;
      soundManager.grab();
    } else if (!ovState.levelId) {
      this.overworldLastPadId = null;
    }

    const chEl = document.getElementById('overworld-chapter');
    const nameEl = document.getElementById('overworld-map-name');
    const starsEl = document.getElementById('overworld-map-stars');
    const metaEl = document.getElementById('overworld-map-meta');
    const hintEl = document.getElementById('overworld-hint');
    const launchBtn = document.getElementById('overworld-launch-btn');

    if (chEl) chEl.innerText = txt.chapter || '';
    if (nameEl) nameEl.innerText = txt.name;
    if (starsEl) {
      let sHtml = '';
      for (let s = 1; s <= 3; s++) sHtml += `<span class="${s <= rec.bestStars ? 'star-lit' : 'star-dim'}">★</span>`;
      starsEl.innerHTML = sHtml;
    }
    if (metaEl) {
      metaEl.innerText = `${t('spotlight_items', { count: def.targetItems })} • ${def.timeLimit}s • ${t('par_label', { sec: def.parTime || def.timeLimit })}`;
    }
    if (hintEl) {
      hintEl.innerText = isParked ? t('overworld_park_hint') : t('overworld_roam_hint');
      hintEl.style.color = isParked ? '#179c52' : '#526071';
    }
    if (launchBtn) {
      launchBtn.disabled = !isParked;
      launchBtn.style.opacity = isParked ? '1' : '0.55';
    }
  }

  toggleFullscreen() {
    try {
      const container = document.getElementById('game-container') || document.documentElement;
      if (!document.fullscreenElement) {
        container.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    } catch (_) {}
  }

  bindTouchControls() {
    const zone = document.getElementById('touch-joystick-zone');
    const knob = document.getElementById('touch-joystick-knob');
    if (zone && knob) {
      let activePointerId = null;
      const maxRadius = 38;

      const updateStick = (clientX, clientY) => {
        const rect = zone.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = clientX - cx;
        let dy = clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > maxRadius) {
          dx = (dx / dist) * maxRadius;
          dy = (dy / dist) * maxRadius;
        }
        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        this.touchMoveX = THREE.MathUtils.clamp(dx / maxRadius, -1, 1);
        this.touchMoveY = THREE.MathUtils.clamp(-dy / maxRadius, -1, 1);
      };

      const resetStick = () => {
        activePointerId = null;
        knob.style.transform = 'translate(0px, 0px)';
        this.touchMoveX = 0;
        this.touchMoveY = 0;
      };

      zone.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        soundManager.init();
        activePointerId = e.pointerId;
        zone.setPointerCapture?.(e.pointerId);
        updateStick(e.clientX, e.clientY);
      });
      zone.addEventListener('pointermove', (e) => {
        if (activePointerId !== e.pointerId) return;
        updateStick(e.clientX, e.clientY);
      });
      zone.addEventListener('pointerup', (e) => {
        if (activePointerId === e.pointerId) resetStick();
      });
      zone.addEventListener('pointercancel', resetStick);
    }

    document.getElementById('touch-dash-btn')?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      soundManager.init();
      this.triggerActionDash();
    });
    document.getElementById('touch-jump-btn')?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      soundManager.init();
      this.triggerActionJump();
    });
    document.getElementById('touch-grab-btn')?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      soundManager.init();
      this.triggerActionGrab();
    });

    const throwBtn = document.getElementById('touch-throw-btn');
    if (throwBtn) {
      throwBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        soundManager.init();
        this.triggerTouchThrowStart();
      });
      const finishThrow = (e) => {
        e.preventDefault();
        this.triggerTouchThrowEnd();
      };
      throwBtn.addEventListener('pointerup', finishThrow);
      throwBtn.addEventListener('pointercancel', finishThrow);
    }
  }

  checkLANStatus() {
    const statusPill = document.getElementById('lan-status-text');
    const guideText = document.getElementById('lan-guide-text');
    if (statusPill) {
      statusPill.innerText = '🟢 Sẵn sàng kết nối';
      statusPill.style.color = '#2ecc71';
    }
    if (guideText) {
      guideText.innerHTML = `Server Web đang chạy tại <b>${location.host}</b>. Chọn Tạo Phòng hoặc Vào Phòng!`;
    }
  }

  connectLAN(role, roomId) {
    const statusPill = document.getElementById('lan-status-text');
    this.network.connect(role, roomId, (status, message) => {
      if (statusPill) {
        statusPill.innerText = message;
        statusPill.style.color = status === 'error' ? '#ef4444' : '#2ecc71';
      }
    }, {
      level: this.currentLevel,
      variant: this.selectedVariantP1,
      unlimitedTime: this.unlimitedTime
    });
  }

  sendClientStateSafe(p2) {
    if (!p2 || this.gameMode !== 'LAN_COOP' || this.network.role !== 'client') return;
    const r2 = (n) => Math.round(n * 100) / 100;
    const payload = {
      x: r2(p2.x), y: r2(p2.y), z: r2(p2.z),
      rotY: r2(p2.rotY),
      sx: r2(p2.squashX), sy: r2(p2.squashY),
      anim: p2.bobi.currentAnim
    };
    const sig = `${payload.x},${payload.y},${payload.z},${payload.rotY},${payload.anim}`;
    if (sig === this.lastP2SentPayload) return;
    this.lastP2SentPayload = sig;
    this.network.sendClientState(payload);
  }

  sendClientActionSafe(type, p2, useAim = false) {
    if (!p2 || this.gameMode !== 'LAN_COOP' || this.network.role !== 'client') return;
    const r2 = (n) => Math.round(n * 100) / 100;
    this.network.sendClientAction({
      type,
      x: r2(p2.x), y: r2(p2.y), z: r2(p2.z),
      rotY: r2(p2.rotY),
      power: r2(p2.throwPower),
      useAim,
      aimX: r2(this.aimWorldPoint.x),
      aimZ: r2(this.aimWorldPoint.z)
    });
  }

  triggerActionDash() {
    if (this.gameState !== 'PLAYING') return;
    const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
    const activeP = isLanClient ? this.players[1] : this.players[0];
    if (activeP && this.triggerDash(activeP) && isLanClient) {
      this.sendClientActionSafe('dash', activeP);
    }
  }

  triggerActionJump() {
    if (this.gameState !== 'PLAYING') return;
    const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
    const activeP = isLanClient ? this.players[1] : this.players[0];
    if (activeP) this.playerJump(activeP);
  }

  triggerActionGrab() {
    if (this.gameState !== 'PLAYING') return;
    if (this.gameMode === 'LAN_COOP' && this.network.role === 'client') {
      this.sendClientActionSafe('grab', this.players[1]);
    } else if (this.players[0]) {
      this.toggleGrab(this.players[0]);
    }
  }

  triggerTouchThrowStart() {
    if (this.gameState !== 'PLAYING') return;
    const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
    const activeP = isLanClient ? this.players[1] : this.players[0];
    if (activeP && activeP.holdingItem) {
      if (activeP.holdingItem.isCarryOnly) {
        if (isLanClient) {
          this.sendClientActionSafe('throw', activeP, false);
        } else {
          this.releaseThrow(activeP);
        }
        return;
      }
      activeP.throwPower = Math.max(0.25, activeP.throwPower || 0);
      activeP.chargingThrow = true;
    }
  }

  triggerTouchThrowEnd() {
    if (this.gameState !== 'PLAYING') return;
    const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
    const activeP = isLanClient ? this.players[1] : this.players[0];
    if (!activeP || !activeP.chargingThrow) return;
    activeP.throwPower = Math.max(0.5, activeP.throwPower);
    if (isLanClient) {
      this.sendClientActionSafe('throw', activeP, false);
      activeP.chargingThrow = false;
      activeP.throwPower = 0;
    } else {
      this.releaseThrow(activeP);
    }
  }

  triggerActionThrow() {
    if (this.gameState !== 'PLAYING') return;
    if (this.gameMode === 'LAN_COOP' && this.network.role === 'client') {
      const p2 = this.players[1];
      if (p2 && p2.holdingItem) {
        p2.throwPower = p2.holdingItem.isCarryOnly ? 0 : 0.7;
        this.sendClientActionSafe('throw', p2, false);
      }
    } else if (this.players[0]) {
      this.releaseThrow(this.players[0]);
    }
  }

  startOrRestartMatch() {
    this.startGame();
    if (this.gameMode === 'LAN_COOP' && this.network.role === 'host' && this.network.isConnected) {
      this.network.sendRestartGame({
        level: this.currentLevel,
        p1Variant: this.selectedVariantP1,
        p2Variant: this.selectedVariantP2,
        unlimitedTime: this.unlimitedTime
      });
    }
  }

  requestOrRestartMatch() {
    if (this.gameMode === 'LAN_COOP' && this.network.role === 'client' && this.network.isConnected) {
      this.network.requestRestart();
      this.ui.addFeedPill('<span>📨 Đã gửi yêu cầu chơi lại tới Host!</span>', 'glass');
      return;
    }
    this.startOrRestartMatch();
  }

  getElapsedSeconds() {
    const def = LEVELS_3D[this.currentLevel] || LEVELS_3D[1];
    if (this.unlimitedTime) {
      return Math.max(0, Math.abs(this.timeLeft + 1));
    }
    const baseTime = def.timeLimit + (this.selectedModifier === 'chill' ? 30 : 0);
    return Math.max(0, baseTime - Math.max(0, this.timeLeft));
  }

  rumblePlayer(p, intensity = 0.4, durationMs = 100) {
    if (!this.gamepadManager) return;
    const idx = this.players.indexOf(p);
    const slot = (this.isLocalMultiMode() && idx >= 0) ? idx : 0;
    this.gamepadManager.rumble(slot, intensity, durationMs);
  }

  rumbleAllActive(intensity = 0.4, durationMs = 110) {
    if (!this.gamepadManager) return;
    const count = this.isLocalMultiMode() ? Math.max(1, this.players.length) : 1;
    for (let i = 0; i < count; i++) {
      this.gamepadManager.rumble(i, intensity, durationMs);
    }
  }

  triggerPlayerEmote(p) {
    if (!p || this.gameState !== 'PLAYING') return;
    const now = performance.now();
    if (now - (p._lastEmoteAt || 0) < 420) return;
    p._lastEmoteAt = now;
    const emotes = ['👍 Đỉnh!', '🔥 Cố lên!', '🆘 Phụ với!', '😂 Hihi!'];
    p._emoteIdx = ((p._emoteIdx || 0) + 1) % emotes.length;
    p.squashX = 1.22;
    p.squashY = 0.82;
    soundManager.grab();
    this.emitBurst(p.x, p.y + 1.4, p.z, 0xfde047, 8);
    this.spawnFloatingText(emotes[p._emoteIdx], p.x, p.y + 2.05, p.z, '#fde047');
  }

  async startGame() {
    soundManager.init();
    if (this.settings.bgmEnabled && this.settings.bgmVolume > 0.001) {
      soundManager.startBGM();
    }
    soundManager.horn();

    this.score = 0;
    this.lastAppliedNetEventSeq = 0;
    this.netEventSeq = 0;
    this.pendingNetEvents = [];
    this.settingsModalOpen = false;
    this.closeControlsModal();
    this.closeMapSelectModal();
    this.targetCamAngle = 0.22;
    this.camAngle = 0.22;
    this.ui.hideStartMenu();

    await this.setupLevel(this.currentLevel);
    this.syncControlHints();

    // Show bottom controls hint ONLY on the player's very first match
    const hintEl = document.getElementById('controls-hint-text');
    if (hintEl) {
      const showFirstPlayHint = !this.settings.guideSeen;
      hintEl.classList.toggle('is-first-play', showFirstPlayHint);
      if (showFirstPlayHint) {
        this.settings.guideSeen = true;
        saveSettings(this.settings);
      }
    }

    this.gameState = 'PLAYING';
    this.syncHUD();

    if (this.timerInterval) clearInterval(this.timerInterval);
    const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
    if (!isLanClient) {
      this.timerInterval = setInterval(() => {
        // Freeze clock once paused OR once all required items are safely loaded
        if (this.gameState === 'PLAYING' && this.itemsDelivered < this.targetItemsCount) {
          if (this.unlimitedTime) {
            this.timeLeft--; // Negative counts elapsed time (-1, -2, -3...)
            this.syncHUD();
          } else {
            this.timeLeft--;
            this.syncHUD();
            if (this.timeLeft <= 0 && this.itemsDelivered < this.targetItemsCount) {
              this.endGame();
            }
          }
        }
      }, 1000);
    }
  }

  endGame() {
    if (this.gameState === 'GAMEOVER') return;
    this.gameState = 'GAMEOVER';
    this.settingsModalOpen = false;
    soundManager.stopBGM();
    if (this.timerInterval) clearInterval(this.timerInterval);

    const def = LEVELS_3D[this.currentLevel] || LEVELS_3D[1];
    const elapsedSeconds = this.getElapsedSeconds();
    const starEval = evaluateMatchStars(def, {
      itemsDelivered: this.itemsDelivered,
      landlordRage: this.landlordRage,
      elapsedSeconds,
      ...this.matchStats
    });

    const { isNewRecord } = this.progressStore.recordMatch(this.currentLevel, {
      completed: starEval.completed,
      stars: starEval.stars,
      score: this.score,
      elapsedSeconds,
      bonusPassed: starEval.bonusPassed
    });
    this.renderProgressCards();

    // Trigger Victory dance if successful!
    if (this.itemsDelivered >= this.targetItemsCount) {
      this.players.forEach(p => p.bobi.playAnimation('CHR_Base_Celebrate', 0.1));
      this.rumbleAllActive(0.55, 180);
    } else {
      this.rumbleAllActive(0.75, 220);
    }

    if (this.gameMode === 'LAN_COOP' && this.network.role === 'host') {
      this.broadcastSnapshot();
    }

    this.ui.showGameOver(this.score, this.itemsDelivered, this.targetItemsCount, this.landlordRage, {
      unlimitedTime: this.unlimitedTime,
      elapsedSeconds,
      stars: starEval.stars,
      starBreakdown: starEval.starBreakdown,
      parTime: starEval.parTime,
      bonusLabel: getLevelText(this.currentLevel).bonusLabel,
      isNewRecord
    });
  }

  playerJump(p) {
    if (p.stunTimer > 0) return;
    if (p.isGrounded) {
      const heavy = p.holdingItem && p.holdingItem.isSuperHeavy;
      const perk = this.getVariantPerk(p.variant);
      p.vy = heavy ? perk.heavyJump : 7.6;
      p.isGrounded = false;
      p.squashX = 0.82;
      p.squashY = 1.24;
      soundManager.jump();
      this.rumblePlayer(p, 0.22, 55);
    }
  }

  getArenaBounds(def = LEVELS_3D[this.currentLevel]) {
    return def?.bounds || { minX: -12.0, maxX: 12.0, minZ: -8.0, maxZ: 8.0 };
  }

  clampItemInBounds(it) {
    const r = it.radius || 0.4;
    const b = this.getArenaBounds();
    const minX = b.minX + 0.2 + r, maxX = b.maxX - 0.2 - r;
    const minZ = b.minZ + 0.2 + r, maxZ = b.maxZ - 0.2 - r;
    if (it.x < minX) {
      it.x = minX;
      it.vx = Math.abs(it.vx) * 0.45;
    } else if (it.x > maxX) {
      it.x = maxX;
      it.vx = -Math.abs(it.vx) * 0.45;
    }
    if (it.z < minZ) {
      it.z = minZ;
      it.vz = Math.abs(it.vz) * 0.45;
    } else if (it.z > maxZ) {
      it.z = maxZ;
      it.vz = -Math.abs(it.vz) * 0.45;
    }
    if (!Number.isFinite(it.x) || !Number.isFinite(it.y) || !Number.isFinite(it.z) || it.y < -4.0) {
      it.x = it.spawnX;
      it.y = it.spawnY + 0.1;
      it.z = it.spawnZ;
      it.vx = it.vy = it.vz = it.vrot = 0;
    }
  }

  activateLever(sw, p) {
    if (!this.mechanics || !sw) return false;
    const toggled = this.mechanics.toggleLever(sw.id);
    if (!toggled) return false;
    soundManager.switchToggle(sw.active);
    if (p) this.rumblePlayer(p, 0.28, 70);
    const msgKey = sw.style === 'traffic'
      ? (sw.active ? 'mech_traffic_red' : 'mech_traffic_green')
      : (sw.active ? 'mech_switch_on' : 'mech_switch_off');
    const color = sw.style === 'traffic'
      ? (sw.active ? '#ef4444' : '#22c55e')
      : (sw.active ? '#4ade80' : '#facc15');
    this.emitBurst(sw.x, sw.y + 0.9, sw.z, 0xfacc15, 10);
    this.spawnFloatingText(t(msgKey), sw.x, sw.y + 2.0, sw.z, color);
    this.pushNetEvent('switch_toggle', { x: sw.x, y: sw.y + 1.0, z: sw.z, on: sw.active, style: sw.style || '' });
    return true;
  }

  triggerDash(p, { isRemote = false } = {}) {
    if (!p || p.stunTimer > 0 || this.gameState !== 'PLAYING') return false;
    if (!isRemote && p.dashCooldown > 0) return false;
    p.dashTimer = 0.22;
    p.dashCooldown = 1.35;
    p.dashHitCooldown = 0;

    if (!isRemote) {
      const burst = p.holdingItem?.isSuperHeavy ? 10.5 : 13.5;
      p.vx = Math.sin(p.rotY) * burst;
      p.vz = Math.cos(p.rotY) * burst;
      if (p.isGrounded) p.vy = Math.max(p.vy, 2.2);
      p.squashX = 1.32;
      p.squashY = 0.76;
      soundManager.dash();
      this.rumblePlayer(p, 0.3, 65);
      this.emitBurst(p.x, p.y + 0.35, p.z, 0xe2e8f0, 10);
      this.spawnPuffSmoke(p.x, p.y + 0.25, p.z, 5, 1.15);
      this.spawnFloatingText('💨 VỤT!', p.x, p.y + 1.5, p.z, '#c084fc');
    } else {
      soundManager.dash();
      this.emitBurst(p.x, p.y + 0.35, p.z, 0xe2e8f0, 10);
      this.spawnPuffSmoke(p.x, p.y + 0.25, p.z, 5, 1.15);
      this.spawnFloatingText('💨 VỤT!', p.x, p.y + 1.5, p.z, '#c084fc');
    }
    return true;
  }

  mountDeliveredItemInTruck(it, landX = null, landZ = null) {
    const cargoMount = this.truck?.mesh?.userData?.cargoMount;
    if (!cargoMount || !it?.mesh) return;
    if (it.mesh.parent === cargoMount) return;

    const tk = LEVELS_3D[this.currentLevel]?.truck || this.truck || { x: 0, z: 0, bedW: 4.2, bedD: 4.6, rotY: 0 };
    const slot = this.deliveredSlotCount++;
    const wx = Number.isFinite(landX) ? landX : it.x;
    const wz = Number.isFinite(landZ) ? landZ : it.z;
    const local = truckWorldToLocal(tk, wx, wz);

    const halfW = Math.max(0.7, (tk.bedW || 4.2) * 0.5 - 0.55);
    const halfD = Math.max(0.8, (tk.bedD || 4.6) * 0.5 - 0.55);
    let lx = THREE.MathUtils.clamp(local.lx, -halfW, halfW);
    let lz = THREE.MathUtils.clamp(local.lz, -halfD, halfD);
    let ly = 0.64;

    // Physical packing: nudge away from nearby cargo or stack upward when bed is crowded
    for (let attempt = 0; attempt < 12; attempt++) {
      const crowded = this.truckCargoPlacements.some(
        (pos) => Math.hypot(pos.lx - lx, pos.lz - lz) < 0.72 && Math.abs(pos.ly - ly) < 0.65
      );
      if (!crowded) break;
      const angle = (slot * 1.9 + attempt * 1.15);
      const tryX = THREE.MathUtils.clamp(lx + Math.cos(angle) * 0.78, -halfW, halfW);
      const tryZ = THREE.MathUtils.clamp(lz + Math.sin(angle) * 0.78, -halfD, halfD);
      const stillCrowded = this.truckCargoPlacements.some(
        (pos) => Math.hypot(pos.lx - tryX, pos.lz - tryZ) < 0.72 && Math.abs(pos.ly - ly) < 0.65
      );
      if (!stillCrowded) {
        lx = tryX;
        lz = tryZ;
        break;
      }
      if (attempt % 3 === 2) {
        ly += 0.86;
      } else {
        lx = tryX;
        lz = tryZ;
      }
    }

    this.truckCargoPlacements.push({ lx, ly, lz });
    cargoMount.add(it.mesh);
    const isOversized = it.type === 'bed' || it.type === 'dining_table' || it.type === 'bookshelf' || it.type === 'piano';
    it.mesh.scale.setScalar(isOversized ? 0.78 : 0.86);
    it.mesh.position.set(lx, ly, lz);
    const relRot = (it.mesh.rotation?.y || 0) - (tk.rotY || 0);
    it.mesh.rotation.set(0, relRot, 0);
  }

  toggleGrab(p) {
    if (p.stunTimer > 0) return;

    if (p.holdingItem) {
      const it = p.holdingItem;
      p.holdingItem = null;
      it.isHeld = false;
      it.heldBy = null;
      it.thrownBy = p;
      it.lastOwnerVariant = p.variant;
      it.throwProtectTimer = 0.25;
      this.levelGroup.add(it.mesh);
      it.x = p.x + Math.sin(p.rotY) * 0.85;
      it.y = p.y + 0.35;
      it.z = p.z + Math.cos(p.rotY) * 0.85;
      it.vx = Math.sin(p.rotY) * 1.6;
      it.vy = 1.2;
      it.vz = Math.cos(p.rotY) * 1.6;
      this.clampItemInBounds(it);
      it.mesh.position.set(it.x, it.y, it.z);
      p.bobi.playAnimation('CHR_Base_Drop', 0.08);
      soundManager.grab();
      this.rumblePlayer(p, 0.25, 60);
      return;
    }

    const lever = this.mechanics?.findLeverNear(p.x, p.y, p.z, 1.45);
    const nearest = this.findNearestGrabbable(p, 2.0);
    const itemDist = nearest ? Math.hypot(nearest.x - p.x, nearest.z - p.z) : Infinity;
    if (lever && lever.dist <= itemDist + 0.25) {
      if (this.activateLever(lever.sw, p)) return;
    }

    if (nearest) {
      const floorY = this.getFloorHeightAt(nearest.x, nearest.z, nearest.y);
      const isAirborne = nearest.y > floorY + 0.24 && (Math.abs(nearest.vy) > 0.35 || Math.hypot(nearest.vx, nearest.vz) > 1.0);
      p.holdingItem = nearest;
      nearest.isHeld = true;
      nearest.heldBy = p;
      nearest.lastOwnerVariant = p.variant;
      nearest.vx = nearest.vy = nearest.vz = 0;

      // Mount directly to Bobi's Overhead Carry Socket!
      p.bobi.carryMount.add(nearest.mesh);
      nearest.mesh.position.set(0, 0.15, 0);
      nearest.mesh.rotation.set(0, 0, 0);

      p.bobi.playAnimation('CHR_Base_PickUp', 0.08);
      this.rumblePlayer(p, 0.25, 60);

      if (isAirborne) {
        p.catchBoostTimer = 2.5;
        soundManager.catchAir();
        this.emitBurst(nearest.x, nearest.y + 0.3, nearest.z, 0x38bdf8, 16);
        if (nearest.thrownBy && nearest.thrownBy !== p && nearest.coopPassEligible) {
          nearest.coopPassEligible = false;
          const passBonus = 250000;
          this.score += passBonus;
          const text = `⚡ BẮT TRÊN KHÔNG! +${passBonus.toLocaleString()}đ`;
          this.spawnFloatingText(text, p.x, p.y + 2.0, p.z, '#38bdf8');
          this.ui.addFeedPill(`<span>⚡ Bắt trên không: ${nearest.name}</span><b style="color:#0284c7;">+${passBonus.toLocaleString()}đ</b>`, 'glass');
          this.pushNetEvent('coop_pass', { x: p.x, y: p.y + 2.0, z: p.z, text, air: true });
        } else {
          const text = '⚡ BẮT ĐỈNH! +LỰC NÉM!';
          this.spawnFloatingText(text, p.x, p.y + 2.0, p.z, '#38bdf8');
          this.pushNetEvent('coop_pass', { x: p.x, y: p.y + 2.0, z: p.z, text, air: true });
        }
      } else {
        soundManager.grab();
        if (nearest.isLiving) {
          soundManager.petSound();
          this.spawnFloatingText('🐾 ÔM ĐƯỢC RỒI!', p.x, p.y + 1.8, p.z, '#fde68a');
        } else if (nearest.isCarryOnly) {
          this.spawnFloatingText(`${p.name}: ${t('carry_only_badge')}!`, p.x, p.y + 1.8, p.z, '#fb923c');
        } else {
          this.spawnFloatingText(`${p.name}: BÊ ĐỒ! 📦`, p.x, p.y + 1.8, p.z, '#fef08a');
        }
      }
    }
  }

  releaseThrow(p, useCursorAim = false) {
    if (!p.holdingItem || p.stunTimer > 0) {
      p.chargingThrow = false;
      p.throwPower = 0;
      return;
    }

    const it = p.holdingItem;
    p.holdingItem = null;
    it.isHeld = false;
    it.heldBy = null;
    it.thrownBy = p;
    it.lastOwnerVariant = p.variant;
    it.throwProtectTimer = 0.35;
    it.coopPassEligible = true;

    this.levelGroup.add(it.mesh);

    let dirX = Math.sin(p.rotY);
    let dirZ = Math.cos(p.rotY);
    let power = 0.55 + p.throwPower * 0.75;

    if (useCursorAim) {
      const dx = this.aimWorldPoint.x - p.x;
      const dz = this.aimWorldPoint.z - p.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 0.25) {
        dirX = dx / dist;
        dirZ = dz / dist;
        p.rotY = Math.atan2(dirX, dirZ);
        power = Math.min(1.35, Math.max(0.45, dist / 7.5));
      }
    }

    if (it.isCarryOnly) {
      // Carry-Only heavy/oversized items cannot be hurled — gentle forward shove/drop (~0.9m)
      it.x = p.x + dirX * 0.92;
      it.y = p.y + 0.45;
      it.z = p.z + dirZ * 0.92;
      this.clampItemInBounds(it);
      it.mesh.position.set(it.x, it.y, it.z);
      it.vx = dirX * 2.8;
      it.vz = dirZ * 2.8;
      it.vy = 1.7;
      it.vrot = 0;

      p.chargingThrow = false;
      p.throwPower = 0;
      p.throwCooldown = 0.28;
      p.bobi.playAnimation('CHR_Base_Drop', 0.06);
      soundManager.grab();
      this.rumblePlayer(p, 0.28, 70);
      this.spawnFloatingText(t('carry_only_hint'), p.x, p.y + 1.9, p.z, '#fb923c');
      this.emitBurst(it.x, it.y, it.z, 0xfb923c, 8);
      return;
    }

    it.x = p.x + Math.sin(p.rotY) * 0.6;
    it.y = p.y + 1.35;
    it.z = p.z + Math.cos(p.rotY) * 0.6;
    this.clampItemInBounds(it);
    it.mesh.position.set(it.x, it.y, it.z);

    const perk = this.getVariantPerk(p.variant);
    const hasCatchBoost = (p.catchBoostTimer || 0) > 0;
    const catchBoost = hasCatchBoost ? 1.18 : 1.0;
    const modThrowMult = this.selectedModifier === 'turbo' ? 1.2 : 1.0;
    p.catchBoostTimer = 0;

    const weightMult = it.isSuperHeavy ? 0.68 : (it.isHeavy ? 0.84 : 1.0);
    const speedXZ = 11.5 * power * weightMult * perk.throwMult * catchBoost * modThrowMult;
    const speedY = 6.2 * power * weightMult * perk.throwMult * catchBoost * modThrowMult;

    it.vx = dirX * speedXZ;
    it.vz = dirZ * speedXZ;
    it.vy = speedY;
    it.vrot = (Math.random() - 0.5) * 4.5;

    p.chargingThrow = false;
    p.throwPower = 0;
    p.throwCooldown = 0.35;
    p.bobi.playAnimation('CHR_Base_Throw', 0.05);
    soundManager.throwItem();
    this.rumblePlayer(p, 0.45, 95);

    this.spawnFloatingText(hasCatchBoost ? '⚡ SIÊU NÉM!! 🚀' : 'YEET!! 🚀', p.x, p.y + 1.9, p.z, hasCatchBoost ? '#38bdf8' : '#ff7675');
    this.emitBurst(it.x, it.y, it.z, hasCatchBoost ? 0x38bdf8 : 0xfde047, hasCatchBoost ? 16 : 10);
  }

  getFloorHeightAt(x, z, curY) {
    const def = LEVELS_3D[this.currentLevel];
    let groundY = this.mechanics ? this.mechanics.groundBaseAt(x, z) : 0;

    // 1. Check ramps
    for (const r of def.ramps) {
      if (x >= r.minX && x <= r.maxX && z >= r.minZ && z <= r.maxZ) {
        let t = 0;
        if (r.axis === 'x') {
          t = (x - r.minX) / (r.maxX - r.minX);
          if (r.dir < 0) t = 1.0 - t;
        } else {
          t = (z - r.minZ) / (r.maxZ - r.minZ);
          if (r.dir < 0) t = 1.0 - t;
        }
        const rampH = r.yStart + t * (r.yEnd - r.yStart);
        if (curY >= rampH - 0.7) {
          groundY = Math.max(groundY, rampH);
        }
      }
    }

    // 2. Check upper deck platforms
    for (const pl of def.platforms) {
      if (Math.abs(x - pl.x) <= pl.w / 2 && Math.abs(z - pl.z) <= pl.d / 2) {
        if (curY >= pl.y - 0.55) {
          groundY = Math.max(groundY, pl.y);
        }
      }
    }

    // 3. Dynamic floors (elevators & extended bridges)
    if (this.mechanics) {
      groundY = Math.max(groundY, this.mechanics.extraFloorAt(x, z, curY));
    }

    return groundY;
  }

  getTruckObstacles(def, isItem = false) {
    const tk = def.truck;
    if (!tk) return [];
    const halfBedW = (tk.bedW || 4.2) / 2;
    const halfBedD = (tk.bedD || 4.6) / 2;
    const list = [
      truckBox(tk, 0, halfBedD + 1.15, 4.2, 2.3, 1.2, 2.4)
    ];
    if (isItem) {
      // Far side & rear cargo bed rails act as backboard deflecting items into the bed
      list.push(
        truckBox(tk, 0, -halfBedD - 0.2, (tk.bedW || 4.2) + 0.4, 0.35, 1.0, 1.7),
        truckBox(tk, halfBedW + 0.2, 0, 0.35, (tk.bedD || 4.6) + 0.4, 1.0, 1.7)
      );
    }
    return list;
  }

  resolveWallCollisions(entity, radius, isItem = false) {
    const def = LEVELS_3D[this.currentLevel];
    const obstacles = [
      ...def.walls,
      ...getFixtureObstacles(def),
      ...this.windows.filter(w => !w.isBroken),
      ...(this.mechanics ? this.mechanics.getObstacles() : []),
      ...this.getTruckObstacles(def, isItem)
    ];

    // Oriented bounding footprint for large/long carry-only furniture through doorways
    let effRX = radius;
    let effRZ = radius;
    if (!isItem && entity.holdingItem && entity.holdingItem.footW > 0) {
      const c = Math.abs(Math.cos(entity.rotY || 0));
      const s = Math.abs(Math.sin(entity.rotY || 0));
      const fw = entity.holdingItem.footW;
      const fd = entity.holdingItem.footD || fw;
      effRX = Math.max(radius, (fw * c + fd * s) * 0.5);
      effRZ = Math.max(radius, (fw * s + fd * c) * 0.5);
    } else if (isItem && entity.footW > 0) {
      const rot = entity.mesh?.rotation?.y || 0;
      const c = Math.abs(Math.cos(rot));
      const s = Math.abs(Math.sin(rot));
      const fw = entity.footW;
      const fd = entity.footD || fw;
      effRX = Math.max(radius, (fw * c + fd * s) * 0.5);
      effRZ = Math.max(radius, (fw * s + fd * c) * 0.5);
    }

    let firstHit = null;
    for (const obs of obstacles) {
      const halfW = obs.w / 2 + effRX;
      const halfD = obs.d / 2 + effRZ;
      const obsTop = obs.y + (obs.h || 3.0) / 2;
      if (entity.y > obsTop - 0.3) continue;

      const dx = entity.x - obs.x;
      const dz = entity.z - obs.z;

      if (Math.abs(dx) < halfW && Math.abs(dz) < halfD) {
        const penX = halfW - Math.abs(dx);
        const penZ = halfD - Math.abs(dz);
        if (penX < penZ) {
          entity.x += dx >= 0 ? penX : -penX;
          entity.vx = isItem ? -entity.vx * 0.42 : 0;
        } else {
          entity.z += dz >= 0 ? penZ : -penZ;
          entity.vz = isItem ? -entity.vz * 0.42 : 0;
        }
        if (!firstHit) firstHit = obs;
      }
    }
    return firstHit;
  }

  detachHeldItem(p) {
    const it = p?.holdingItem;
    if (!it) return null;
    p.holdingItem = null;
    it.isHeld = false;
    it.heldBy = null;
    it.thrownBy = null;
    this.levelGroup.add(it.mesh);
    it.x = p.x;
    it.y = p.y + 0.35;
    it.z = p.z;
    it.vx = 0;
    it.vy = 0.8;
    it.vz = 0;
    it.mesh.position.set(it.x, it.y, it.z);
    return it;
  }

  respawnItemSafely(it, { toastText, feedLabel, burstColor = 0xfb923c, penaltyRatio = 0.25, countHazard = false, countFragile = false } = {}) {
    const bx = it.x;
    const by = Math.max(0.25, it.y + 0.3);
    const bz = it.z;
    const penalty = Math.floor(it.value * penaltyRatio);
    this.score = Math.max(0, this.score - penalty);
    if (countHazard) this.matchStats.hazardHits++;
    if (countFragile) {
      this.matchStats.fragileBroken++;
      this.matchStats.anyItemBroken++;
    }

    it.x = it.spawnX;
    it.y = it.spawnY + 0.15;
    it.z = it.spawnZ;
    it.vx = it.vy = it.vz = it.vrot = 0;
    it.mesh.position.set(it.x, it.y, it.z);

    this.cameraShake = 0.3;
    soundManager.shatter();
    this.rumbleAllActive(0.5, 110);
    this.emitBurst(bx, by, bz, burstColor, 20);
    const suffix = penalty > 0 ? ` -${penalty.toLocaleString()}đ` : '';
    this.spawnFloatingText(`${toastText}${suffix}`, it.x, it.y + 1.5, it.z, '#fb923c');
    if (feedLabel) {
      this.ui.addFeedPill(`<span>${feedLabel}: ${it.name}</span><b style="color:#c2410c;">-${penalty.toLocaleString()}đ</b>`, 'broke');
    }
    this.pushNetEvent('item_respawn', {
      bx, by, bz,
      rx: it.x, ry: it.y + 1.5, rz: it.z,
      name: it.name,
      penalty,
      color: burstColor,
      countHazard: !!countHazard,
      countFragile: !!countFragile
    });
  }

  applyPlayerHazardHit(p, hz = null, isPit = false) {
    if (!p || (!isPit && p.stunTimer > 0)) return;
    const hx = p.x;
    const hy = Math.max(0.5, p.y + 1.2);
    const hzPos = p.z;
    const dropped = this.detachHeldItem(p);
    if (dropped && isPit) {
      this.respawnItemSafely(dropped, {
        toastText: t('mech_item_respawn'),
        feedLabel: '🕳️ Rớt hố',
        penaltyRatio: 0.15,
        countFragile: !!dropped.isFragile
      });
    }

    const stunMult = this.getVariantPerk(p.variant).stunMult;
    p.stunTimer = (isPit ? 1.15 : 1.5) * stunMult;
    p.squashY = 0.38;
    p.squashX = 1.52;
    p.vy = 0;

    if (isPit) {
      p.x = p.spawnX;
      p.y = (p.spawnY || 0.1) + 0.25;
      p.z = p.spawnZ;
      p.vx = p.vz = 0;
      p.bobi.root.position.set(p.x, p.y, p.z);
    } else if (hz) {
      this.matchStats.hazardHits++;
      const dx = p.x - hz.x;
      const dz = p.z - hz.z;
      const dist = Math.hypot(dx, dz) || 1;
      p.vx = (dx / dist) * 6.5;
      p.vz = (dz / dist) * 6.5;
      p.vy = 3.2;
    }

    const isCar = hz?.type === 'car';
    if (isCar) soundManager.horn();
    else soundManager.bonk();
    this.cameraShake = 0.28;
    this.rumblePlayer(p, 0.6, 130);
    this.emitBurst(hx, hy, hzPos, isPit ? 0x64748b : 0xef4444, 16);
    const msg = isPit ? t('mech_pit_fall') : t('mech_hazard_hit');
    this.spawnFloatingText(msg, isPit ? p.x : hx, (isPit ? p.y : hy) + 0.8, isPit ? p.z : hzPos, '#f87171');
    this.pushNetEvent('hazard_hit', { x: hx, y: hy, z: hzPos, isCar, isPit, rx: p.x, ry: p.y + 1.4, rz: p.z });
  }

  processGamepadInputs() {
    const snap = this.gamepadManager.poll();
    this.padStates = snap.slots;

    const p1Pad = snap.slots[0];
    const activePadLimit = this.isLocalMultiMode() ? this.getTargetPlayerCount() : 1;
    let anyPausePressed = false;
    for (let i = 0; i < activePadLimit; i++) {
      if (snap.slots[i]?.justPause) {
        anyPausePressed = true;
        break;
      }
    }
    if (anyPausePressed && (this.gameState === 'PLAYING' || this.gameState === 'PAUSED' || this.settingsModalOpen)) {
      this.handlePauseToggle();
    }

    if (this.gameState === 'OVERWORLD' && !this.settingsModalOpen) {
      if (p1Pad && p1Pad.camRotateDir !== 0) {
        this.rotateCamera(p1Pad.camRotateDir * (Math.PI / 4));
      }
      if ((p1Pad?.justJump || p1Pad?.justGrab) && this.overworld?.hoveredLevelId) {
        this.currentLevel = this.overworld.hoveredLevelId;
        this.startOrRestartMatch();
      }
      return;
    }

    if (this.gameState !== 'PLAYING' || this.settingsModalOpen) return;

    if (p1Pad && p1Pad.camRotateDir !== 0) {
      this.rotateCamera(p1Pad.camRotateDir * (Math.PI / 4));
    }

    const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
    const handlePadActions = (pad, player, asLanClient) => {
      if (!pad || !player) return;
      if (pad.justJump) this.playerJump(player);
      if (pad.justGrab) {
        if (asLanClient) this.sendClientActionSafe('grab', player);
        else this.toggleGrab(player);
      }
      if (pad.justDash || (pad.justThrowStart && !player.holdingItem)) {
        if (this.triggerDash(player) && asLanClient) {
          this.sendClientActionSafe('dash', player);
        }
      }
      if (pad.justThrowStart && player.holdingItem) {
        if (player.holdingItem.isCarryOnly) {
          if (asLanClient) this.sendClientActionSafe('throw', player, false);
          else this.releaseThrow(player, false);
        } else {
          player.chargingThrow = true;
        }
      }
      if (pad.justThrowRelease && player.chargingThrow) {
        if (asLanClient) {
          this.sendClientActionSafe('throw', player, false);
          player.chargingThrow = false;
          player.throwPower = 0;
        } else {
          this.releaseThrow(player, false);
        }
      }
    };

    if (this.isLocalMultiMode()) {
      for (let i = 0; i < this.players.length; i++) {
        handlePadActions(snap.slots[i], this.players[i], false);
      }
    } else if (isLanClient) {
      handlePadActions(p1Pad, this.players[1], true);
    } else {
      handlePadActions(p1Pad, this.players[0], false);
    }
  }

  updatePlayers(dt) {
    if (this.gameMode === 'SOLO') {
      if (this.players[0]) this.updateSinglePlayerPhysics(this.players[0], dt, this.keys, true, true, this.padStates[0]);
    } else if (this.isLocalMultiMode()) {
      if (this.players[0]) this.updateSinglePlayerPhysics(this.players[0], dt, this.keys, true, false, this.padStates[0]);
      if (this.players[1]) this.updateSinglePlayerPhysics(this.players[1], dt, this.keys, false, true, this.padStates[1]);
      for (let i = 2; i < this.players.length; i++) {
        if (this.players[i]) this.updateSinglePlayerPhysics(this.players[i], dt, {}, false, false, this.padStates[i]);
      }
    } else if (this.gameMode === 'LAN_COOP') {
      if (this.network.role === 'client') {
        if (this.players[0]) this.interpolateSinglePlayer(this.players[0], dt);
        if (this.players[1]) this.updateSinglePlayerPhysics(this.players[1], dt, this.keys, true, true, this.padStates[0]);
      } else {
        if (this.players[0]) this.updateSinglePlayerPhysics(this.players[0], dt, this.keys, true, true, this.padStates[0]);
        if (this.players[1]) this.interpolateSinglePlayer(this.players[1], dt);
      }
    }
  }

  interpolateSinglePlayer(p, dt) {
    const smooth = 1 - Math.exp(-18 * dt);
    if (Number.isFinite(p.netX) && Number.isFinite(p.netY) && Number.isFinite(p.netZ)) {
      p.x = THREE.MathUtils.lerp(p.x, p.netX, smooth);
      p.y = THREE.MathUtils.lerp(p.y, p.netY, smooth);
      p.z = THREE.MathUtils.lerp(p.z, p.netZ, smooth);

      const diff = this.wrapAngleDiff(p.netRotY - p.rotY);
      p.rotY += diff * smooth;

      p.bobi.root.position.set(p.x, p.y, p.z);
      p.bobi.root.rotation.y = p.rotY;
      p.bobi.root.scale.set(p.squashX, p.squashY, p.squashX);
    }
    p.bobi.update(dt, p.stunTimer > 0);
  }

  updateSinglePlayerPhysics(p, dt, srcKeys, useWASD, useArrows, padState = null) {
    const def = LEVELS_3D[this.currentLevel];

    // Recover squash & stretch springs
    p.squashX += (1.0 - p.squashX) * Math.min(1, dt * 10);
    p.squashY += (1.0 - p.squashY) * Math.min(1, dt * 10);
    p.bobi.root.scale.set(p.squashX, p.squashY, p.squashX);

    const perk = this.getVariantPerk(p.variant);

    if (p.throwCooldown > 0) p.throwCooldown -= dt;
    if (p.dashCooldown > 0) p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    if (p.dashHitCooldown > 0) p.dashHitCooldown = Math.max(0, p.dashHitCooldown - dt);
    if (p.catchBoostTimer > 0) p.catchBoostTimer = Math.max(0, p.catchBoostTimer - dt);
    const isDashing = p.dashTimer > 0;
    if (p.dashTimer > 0) p.dashTimer = Math.max(0, p.dashTimer - dt);

    if (p.stunTimer > 0) {
      p.stunTimer -= dt;
      p.bobi.playAnimation('CHR_Base_Fall', 0.1);
      p.bobi.update(dt, true);
      if (p.stunTimer <= 0) {
        p.bobi.playAnimation('CHR_Base_GetUp', 0.1);
      }
      return;
    }

    // Compute camera-relative 360° input vector (Keyboard + Virtual Joystick + Gamepad)
    let inX = 0;
    let inY = 0;
    if ((useWASD && srcKeys['KeyW']) || (useArrows && srcKeys['ArrowUp'])) inY += 1;
    if ((useWASD && srcKeys['KeyS']) || (useArrows && srcKeys['ArrowDown'])) inY -= 1;
    if ((useWASD && srcKeys['KeyA']) || (useArrows && srcKeys['ArrowLeft'])) inX -= 1;
    if ((useWASD && srcKeys['KeyD']) || (useArrows && srcKeys['ArrowRight'])) inX += 1;
    if (useWASD && (Math.abs(this.touchMoveX) > 0.08 || Math.abs(this.touchMoveY) > 0.08)) {
      inX += this.touchMoveX;
      inY += this.touchMoveY;
    }
    if (padState) {
      inX += padState.moveX;
      inY += padState.moveY;
    }
    const sprinting = !!((useWASD && srcKeys['ShiftLeft']) || (!this.isLocalMultiMode() && useArrows && srcKeys['ShiftRight']) || padState?.sprint);

    const moveVec = new THREE.Vector3();
    moveVec.addScaledVector(this.camFwdXZ, inY);
    moveVec.addScaledVector(this.camRightXZ, inX);

    let carryMult = p.holdingItem
      ? (p.holdingItem.isSuperHeavy ? perk.heavyCarryFloor : Math.max(0.85, perk.heavyCarryFloor))
      : 1.0;
    if (p.holdingItem && (p.holdingItem.isHeavy || p.holdingItem.isSuperHeavy) && this.players.length > 1) {
      const mate = this.players.find(other => other !== p && other.stunTimer <= 0);
      if (mate && Math.hypot(mate.x - p.x, mate.z - p.z) <= 2.5) {
        carryMult = Math.min(1.0, carryMult * 1.45);
        const nowMs = performance.now();
        if (nowMs - this.lastCoopAssistHintAt > 2600) {
          this.lastCoopAssistHintAt = nowMs;
          this.spawnFloatingText('🤝 ĐẨY PHỤ! +Tốc độ', (p.x + mate.x) * 0.5, Math.max(p.y, mate.y) + 1.9, (p.z + mate.z) * 0.5, '#38bdf8');
        }
      }
    }
    const modSpeedMult = this.selectedModifier === 'turbo' ? 1.25 : 1.0;
    const maxSpeed = (sprinting ? 7.2 : 4.8) * carryMult * perk.speedMult * modSpeedMult;
    const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
    const surface = (p.isGrounded && this.mechanics)
      ? this.mechanics.surfaceAt(p.x, p.z, p.y)
      : { slippery: false, convX: 0, convZ: 0 };

    const hasInput = moveVec.lengthSq() > 0.01;
    let targetVx = surface.convX;
    let targetVz = surface.convZ;
    if (p.holdingItem?.isVibrating && p.isGrounded) {
      const vibT = performance.now() * 0.026 + p.id * 2.1;
      targetVx += Math.sin(vibT) * 0.85;
      targetVz += Math.cos(vibT * 1.3) * 0.85;
    }
    if (hasInput) {
      moveVec.normalize();
      targetVx += moveVec.x * maxSpeed;
      targetVz += moveVec.z * maxSpeed;

      // Smooth 360° Facing Rotation
      const targetAngle = Math.atan2(moveVec.x, moveVec.z);
      const diff = this.wrapAngleDiff(targetAngle - p.rotY);
      p.rotY += diff * Math.min(1, dt * 14);
    }

    const baseTraction = surface.slippery ? (hasInput ? 2.8 : 1.7) * perk.slipperyTractionMult : 14.0;
    const traction = isDashing ? 2.2 : baseTraction;
    p.vx = THREE.MathUtils.lerp(p.vx, targetVx, Math.min(1, dt * traction));
    p.vz = THREE.MathUtils.lerp(p.vz, targetVz, Math.min(1, dt * traction));

    if (isDashing && !isLanClient) {
      if (this.mechanics) {
        const stunnedHz = this.mechanics.stunPatrolNear(p.x, p.y, p.z, 1.45, 2.2);
        if (stunnedHz) {
          soundManager.bonk();
          this.rumblePlayer(p, 0.55, 110);
          this.emitBurst(stunnedHz.x, 1.0, stunnedHz.z, 0xfacc15, 16);
          this.spawnFloatingText('💫 CHOÁNG LUÔN!', stunnedHz.x, 2.0, stunnedHz.z, '#fde047');
          this.pushNetEvent('patrol_stun', { x: stunnedHz.x, y: 1.0, z: stunnedHz.z });
        }
      }
      if (this.players.length > 1 && p.dashHitCooldown <= 0) {
        const mate = this.players.find(other => other !== p && other.stunTimer <= 0 && Math.hypot(other.x - p.x, other.z - p.z) < 1.05 && Math.abs(other.y - p.y) < 1.1);
        if (mate) {
          p.dashHitCooldown = 0.6;
          const dx = mate.x - p.x;
          const dz = mate.z - p.z;
          const d = Math.hypot(dx, dz) || 1;
          const matePerk = this.getVariantPerk(mate.variant);
          mate.vx = (dx / d) * 7.2;
          mate.vz = (dz / d) * 7.2;
          mate.vy = 3.5;
          mate.stunTimer = 0.55 * matePerk.stunMult;
          mate.squashX = 1.38;
          mate.squashY = 0.68;
          soundManager.bonk();
          this.rumbleAllActive(0.45, 95);
          this.emitBurst(mate.x, mate.y + 0.8, mate.z, 0xf472b6, 12);
          this.spawnFloatingText('👋 BẠP! TRÊU TÍ!', mate.x, mate.y + 1.9, mate.z, '#f472b6');
          this.pushNetEvent('dash_slap', { x: mate.x, y: mate.y + 1.4, z: mate.z });
        }
      }
    }

    if (!p.isGrounded && this.mechanics) {
      const wind = this.mechanics.windAt(p.x, p.z, p.y);
      p.vx += wind.fx * 0.45 * dt;
      p.vz += wind.fz * 0.45 * dt;
    }

    if (p.chargingThrow && p.holdingItem) {
      p.throwPower = Math.min(1.0, p.throwPower + dt * 1.4);
    }

    // Gravity & Vertical Movement
    p.vy -= 20.0 * dt;
    p.x += p.vx * dt;
    p.z += p.vz * dt;
    p.y += p.vy * dt;

    // Keep inside per-level arena bounds
    const bounds = this.getArenaBounds(def);
    p.x = THREE.MathUtils.clamp(p.x, bounds.minX, bounds.maxX);
    p.z = THREE.MathUtils.clamp(p.z, bounds.minZ, bounds.maxZ);

    this.resolveWallCollisions(p, p.radius);

    // Floor / Ramp / Platform / Elevator / Bridge landing
    const floorY = this.getFloorHeightAt(p.x, p.z, p.y);
    if (p.y <= floorY && floorY > -1.0) {
      if (!p.isGrounded && p.vy < -5.5) {
        p.squashX = 1.24;
        p.squashY = 0.78;
        this.spawnPuffSmoke(p.x, floorY + 0.18, p.z, 3, 0.95);
      }
      p.y = floorY;
      p.vy = 0;
      p.isGrounded = true;
    } else {
      p.isGrounded = false;
    }

    // Pit recovery (resets safely at map spawn without soft-locking)
    if (p.y < -1.15) {
      if (isLanClient) {
        this.sendClientActionSafe('pit_fall', p);
        p.stunTimer = 1.15;
        p.squashY = 0.38;
        p.squashX = 1.52;
        p.x = p.spawnX;
        p.y = (p.spawnY || 0.1) + 0.25;
        p.z = p.spawnZ;
        p.vx = p.vy = p.vz = 0;
        soundManager.bonk();
        this.rumblePlayer(p, 0.55, 110);
        this.spawnFloatingText(t('mech_pit_fall'), p.x, p.y + 1.5, p.z, '#f87171');
      } else {
        this.applyPlayerHazardHit(p, null, true);
      }
    }

    // Trampoline bounce check for players (supports multiple trampolines)
    for (const tr of this.trampolines) {
      if (Math.hypot(p.x - tr.x, p.z - tr.z) < tr.r && p.y <= 0.45 && p.vy <= 0.5) {
        p.vy = 11.2;
        p.isGrounded = false;
        p.squashX = 0.72;
        p.squashY = 1.38;
        soundManager.trampoline();
        this.rumblePlayer(p, 0.45, 95);
        this.spawnFloatingText('BOINGGG! 🦘', tr.x, 1.4, tr.z, '#38bdf8');
        break;
      }
    }

    p.bobi.root.position.set(p.x, p.y, p.z);
    p.bobi.root.rotation.y = p.rotY;

    // Drive 3D Animation Clips & cartoon puff smoke footsteps
    const speedH = Math.hypot(p.vx, p.vz);
    if (p.isGrounded && speedH > 4.4) {
      p.puffTimer = (p.puffTimer || 0) - dt;
      if (p.puffTimer <= 0) {
        p.puffTimer = 0.15;
        this.spawnPuffSmoke(
          p.x - Math.sin(p.rotY) * 0.28,
          p.y + 0.2,
          p.z - Math.cos(p.rotY) * 0.28,
          1,
          0.88
        );
      }
    } else {
      p.puffTimer = 0;
    }
    if (p.throwCooldown <= 0) {
      if (p.holdingItem) {
        p.bobi.playAnimation(speedH > 0.6 ? 'CHR_Base_CarryWalk' : 'CHR_Base_CarryIdle', 0.12);
      } else if (speedH > 5.2) {
        p.bobi.playAnimation('CHR_Base_Run', 0.12);
      } else if (speedH > 0.6) {
        p.bobi.playAnimation('CHR_Base_Walk', 0.12);
      } else {
        p.bobi.playAnimation('CHR_Base_Idle', 0.15);
      }
    }

    p.bobi.update(dt, false);
  }

  updateItems(dt) {
    const def = LEVELS_3D[this.currentLevel];

    this.items.forEach((it) => {
      if (it.isHeld || it.isDelivered || it.isBroken) return;
      if (it.throwProtectTimer > 0) it.throwProtectTimer -= dt;
      if (it.hazardCooldown > 0) it.hazardCooldown -= dt;

      if (this.mechanics && !it.isHeavy && !it.isSuperHeavy && Math.abs(it.vy) > 0.2) {
        const wind = this.mechanics.windAt(it.x, it.z, it.y);
        it.vx += wind.fx * dt;
        it.vz += wind.fz * dt;
      }

      it.vy -= 18.0 * dt;
      it.x += it.vx * dt;
      it.y += it.vy * dt;
      it.z += it.vz * dt;
      it.mesh.rotation.y += it.vrot * dt;

      // Check collision with walls, destructible glass windows & truck backboard
      const hitObs = this.resolveWallCollisions(it, it.radius, true);
      if (hitObs && hitObs.id && !hitObs.isBroken) {
        const hitSpeed = Math.hypot(it.vx, it.vy, it.vz);
        if (hitSpeed > 2.2) {
          hitObs.isBroken = true;
          this.matchStats.windowsBroken++;
          this.levelGroup.remove(hitObs.mesh);
          this.cameraShake = 0.35;
          soundManager.glassShatter();
          this.rumbleAllActive(0.5, 110);
          this.emitBurst(hitObs.x, 1.4, hitObs.z, 0x67e8f9, 26);
          this.spawnFloatingText('💥 VỠ KÍNH! ĐƯỜNG THÔNG!', hitObs.x, 2.2, hitObs.z, '#22d3ee');
          this.ui.addFeedPill('<span>🪟 Vỡ kính!</span><b style="color:#0284c7;">Mở lối</b>', 'glass');
        }
      }

      // 2-Player Co-op Pass / Airborne Catch!
      const moveSpeed = Math.hypot(it.vx, it.vy, it.vz);
      if (this.players.length > 1 && moveSpeed > 1.8) {
        for (const catcher of this.players) {
          if (catcher.holdingItem || catcher.stunTimer > 0) continue;
          if (catcher === it.thrownBy) continue;
          if (Math.hypot(it.x - catcher.x, it.z - catcher.z) < 1.35 && Math.abs(it.y - (catcher.y + 0.85)) < 1.2) {
            catcher.holdingItem = it;
            catcher.catchBoostTimer = 2.5;
            it.isHeld = true;
            it.heldBy = catcher;
            it.lastOwnerVariant = catcher.variant;
            it.vx = it.vy = it.vz = it.vrot = 0;
            catcher.bobi.carryMount.add(it.mesh);
            it.mesh.position.set(0, 0.15, 0);
            it.mesh.rotation.set(0, 0, 0);
            catcher.bobi.playAnimation('CHR_Base_PickUp', 0.08);
            soundManager.catchAir();
            this.emitBurst(catcher.x, catcher.y + 1.0, catcher.z, 0x38bdf8, 14);
            let text = '⚡ BẮT ĐỒ! +LỰC NÉM!';
            if (it.coopPassEligible) {
              it.coopPassEligible = false;
              const passBonus = 250000;
              this.score += passBonus;
              text = `⚡ CHUYỀN CHUẨN! +${passBonus.toLocaleString()}đ`;
              this.ui.addFeedPill(`<span>⚡ Chuyền: ${it.name}</span><b style="color:#0284c7;">+${passBonus.toLocaleString()}đ</b>`, 'glass');
            }
            this.spawnFloatingText(text, catcher.x, catcher.y + 2.0, catcher.z, '#38bdf8');
            this.pushNetEvent('coop_pass', { x: catcher.x, y: catcher.y + 2.0, z: catcher.z, text, air: true });
            return;
          }
        }
      }

      // Check Trampoline bounce (multi-trampoline parabolic trajectory into Truck)
      for (const tr of this.trampolines) {
        if (Math.hypot(it.x - tr.x, it.z - tr.z) < tr.r + 0.2 && it.y <= 0.6 && it.vy < 0) {
          const vyLaunch = 10.5;
          const g = 18.0;
          const targetY = 0.65;
          const disc = Math.max(1.0, vyLaunch * vyLaunch - 2 * g * (targetY - it.y));
          const flightTime = (vyLaunch + Math.sqrt(disc)) / g;
          it.vy = vyLaunch;
          it.vx = THREE.MathUtils.clamp((def.truck.x - it.x) / flightTime, -16, 16);
          it.vz = THREE.MathUtils.clamp((def.truck.z - it.z) / flightTime, -16, 16);
          soundManager.trampoline();
          this.emitBurst(tr.x, 0.5, tr.z, 0xfacc15, 14);
          this.spawnFloatingText('NẢY VÀO XE! 🚀', tr.x, 1.6, tr.z, '#facc15');
          this.pushNetEvent('trampoline_item', { x: tr.x, y: 0.5, z: tr.z });
          break;
        }
      }

      // Check Truck Bed Delivery (Combo Chain + Cargo Stack + Suspension Bounce)
      const tk = def.truck;
      if (isInsideTruckBed(tk, it.x, it.z) && it.y >= 0.0 && it.y <= 1.45) {
        it.isDelivered = true;
        it.vx = it.vy = it.vz = it.vrot = 0;
        this.mountDeliveredItemInTruck(it, it.x, it.z);

        this.deliveryCombo = this.comboTimer > 0 ? this.deliveryCombo + 1 : 1;
        this.comboTimer = 5.5;
        const comboBonus = this.deliveryCombo >= 2 ? Math.min(4, this.deliveryCombo - 1) * 350000 : 0;
        const totalGain = it.value + comboBonus;

        this.itemsDelivered++;
        this.score += totalGain;
        this.cameraShake = 0.2;
        this.truckBounceVel = it.isSuperHeavy ? -3.4 : (it.isHeavy ? -2.6 : -1.8);

        if (it.type === 'piano') soundManager.pianoChord();
        else if (it.isLiving) {
          soundManager.petSound();
          soundManager.deliver(this.deliveryCombo);
        } else {
          soundManager.deliver(this.deliveryCombo);
        }

        this.rumbleAllActive(0.35, 90);
        this.emitBurst(it.x, 1.1, it.z, comboBonus > 0 ? 0xfacc15 : 0x22c55e, comboBonus > 0 ? 28 : 22);
        if (comboBonus > 0) {
          this.spawnFloatingText(`🔥 x${this.deliveryCombo}! +${totalGain.toLocaleString()}đ`, it.x, 2.35, it.z, '#f59e0b');
          this.ui.addFeedPill(`<span>🔥 x${this.deliveryCombo} ${it.name}</span><b>+${totalGain.toLocaleString()}đ</b>`, 'bounce');
        } else {
          this.spawnFloatingText(`+${it.value.toLocaleString()}đ`, it.x, 2.2, it.z, '#16a34a');
          this.ui.addFeedPill(`<span>✓ ${it.name}</span><b>+${it.value.toLocaleString()}đ</b>`);
        }

        if (this.itemsDelivered >= this.targetItemsCount) {
          setTimeout(() => this.endGame(), 1200);
        }
        return;
      }

      // Check Moving Road Traffic Impact on Loose Item (Street Cars only — NPC patrols never penalize loose items)
      if (this.mechanics && it.hazardCooldown <= 0) {
        const hitHz = this.mechanics.hazardHitting(it, it.radius, { carsOnly: true });
        if (hitHz) {
          it.hazardCooldown = 1.2;
          soundManager.horn();
          this.respawnItemSafely(it, {
            toastText: '🚗 XE TÔNG ĐỒ!',
            feedLabel: '🚗 Xe tông đồ',
            burstColor: 0xef4444,
            penaltyRatio: 0.25,
            countHazard: true,
            countFragile: !!it.isFragile
          });
          return;
        }
      }

      // Check Heavy Item Squashing Players (Slapstick Pancake Stun!)
      if (it.vy < -3.5) {
        this.players.forEach((p) => {
          if (p.stunTimer <= 0 && Math.hypot(it.x - p.x, it.z - p.z) < 0.7 && Math.abs(it.y - (p.y + 0.8)) < 0.75) {
            const stunMult = this.getVariantPerk(p.variant).stunMult;
            p.stunTimer = 2.0 * stunMult;
            p.squashY = 0.35;
            p.squashX = 1.55;
            this.detachHeldItem(p);
            soundManager.bonk();
            this.cameraShake = 0.25;
            this.spawnFloatingText('BẸP DÍ! 💫', p.x, p.y + 1.8, p.z, '#f472b6');
            this.pushNetEvent('bonk', { x: p.x, y: p.y + 1.8, z: p.z });
          }
        });
      }

      // Pit Recovery for items dropped into a trench
      if (it.y < -1.15) {
        this.respawnItemSafely(it, {
          toastText: t('mech_item_respawn'),
          feedLabel: '🕳️ Rớt xuống hố',
          burstColor: 0x64748b,
          penaltyRatio: 0.2,
          countFragile: !!it.isFragile
        });
        return;
      }

      // Ground / Floor Impact, Surface Physics, Fragile Check & Living/Bouncy props
      const floorY = this.getFloorHeightAt(it.x, it.z, it.y);
      if (it.y <= floorY && floorY > -1.0) {
        const chefSafe = it.lastOwnerVariant === 'chef' || it.thrownBy?.variant === 'chef';
        const breakVel = chefSafe ? -9.8 : -7.5;
        const skipFragileBreak = this.selectedModifier === 'chill';
        if (!skipFragileBreak && it.isFragile && it.vy < breakVel) {
          const penalty = Math.floor(it.value * 0.4);
          this.score = Math.max(0, this.score - penalty);
          this.matchStats.fragileBroken++;
          this.matchStats.anyItemBroken++;
          this.cameraShake = 0.35;
          soundManager.shatter();
          this.rumbleAllActive(0.6, 130);
          this.emitBurst(it.x, floorY + 0.3, it.z, 0xef4444, 24);

          if (this.unlimitedTime) {
            // In Unlimited Time (Chill) mode, respawn fragile item back in house so level always completes
            this.pushNetEvent('fragile_respawn', {
              bx: it.x, by: floorY + 0.3, bz: it.z,
              name: it.name, penalty,
              rx: it.spawnX, ry: it.spawnY + 1.5, rz: it.spawnZ
            });
            it.x = it.spawnX;
            it.y = it.spawnY + 0.1;
            it.z = it.spawnZ;
            it.vx = it.vy = it.vz = it.vrot = 0;
            it.mesh.position.set(it.x, it.y, it.z);
            this.spawnFloatingText(`VỠ! ĐẶT LẠI TRONG NHÀ! -${penalty.toLocaleString()}đ`, it.x, it.y + 1.5, it.z, '#fb923c');
            this.ui.addFeedPill(`<span>♻️ ${it.name}</span><b style="color:#c2410c;">-${penalty.toLocaleString()}đ</b>`, 'broke');
            return;
          }

          it.isBroken = true;
          this.levelGroup.remove(it.mesh);
          this.landlordRage = Math.min(100, this.landlordRage + 30);
          this.spawnFloatingText(`XOẢNG! -${penalty.toLocaleString()}đ`, it.x, floorY + 1.5, it.z, '#ef4444');
          this.ui.addFeedPill(`<span>💥 ${it.name}</span><b style="color:#dc2626;">-${penalty.toLocaleString()}đ</b>`, 'broke');

          if (this.landlordRage >= 100) {
            setTimeout(() => this.endGame(), 900);
          }
          return;
        }
        if (it.isFragile && chefSafe && it.vy < -7.5) {
          this.spawnFloatingText('🍳 ĐỠ KHÉO!', it.x, floorY + 1.3, it.z, '#6ee7b7');
          this.emitBurst(it.x, floorY + 0.25, it.z, 0x6ee7b7, 8);
        }

        it.y = floorY;
        const isBouncyMod = this.selectedModifier === 'bouncy';
        const baseBounce = it.isBouncy ? 0.64 : (it.isLiving ? 0.45 : 0.3);
        const bounceFactor = isBouncyMod ? Math.min(0.92, baseBounce * 1.55) : baseBounce;
        const minBounceVel = isBouncyMod ? 1.1 : (it.isBouncy ? 1.8 : 2.8);
        if ((it.isBouncy || isBouncyMod) && Math.abs(it.vy) > minBounceVel) {
          this.emitBurst(it.x, floorY + 0.2, it.z, 0xfde68a, 6);
        }
        it.vy = Math.abs(it.vy) > minBounceVel ? -it.vy * bounceFactor : 0;

        const surf = this.mechanics ? this.mechanics.surfaceAt(it.x, it.z, floorY) : null;
        const dampRate = it.isRolling
          ? (surf?.slippery ? -0.9 : -2.1)
          : (surf?.slippery ? -1.4 : -16.0);
        const damp = Math.exp(dampRate * dt);
        it.vx *= damp;
        it.vz *= damp;
        it.vrot *= Math.exp((it.isRolling ? -2.5 : -10.0) * dt);
        if (it.isRolling && (Math.abs(it.vx) > 0.1 || Math.abs(it.vz) > 0.1)) {
          it.mesh.rotation.z -= (it.vx / 0.38) * dt;
          it.mesh.rotation.x += (it.vz / 0.38) * dt;
        }
        if (surf && (Math.abs(surf.convX) > 0.01 || Math.abs(surf.convZ) > 0.01)) {
          const blend = Math.min(1, dt * 8);
          it.vx = THREE.MathUtils.lerp(it.vx, surf.convX, blend);
          it.vz = THREE.MathUtils.lerp(it.vz, surf.convZ, blend);
        }

        // Living Pet hops around playfully near its home area!
        if (it.isLiving && Math.abs(it.vy) < 0.25) {
          it.hopTimer = (it.hopTimer ?? 1.2) - dt;
          if (it.hopTimer <= 0) {
            it.hopTimer = 1.4 + Math.random() * 1.9;
            const toHomeX = it.spawnX - it.x;
            const toHomeZ = it.spawnZ - it.z;
            const distHome = Math.hypot(toHomeX, toHomeZ);
            const ang = distHome > 2.4
              ? Math.atan2(toHomeZ, toHomeX) + (Math.random() - 0.5) * 0.7
              : Math.random() * Math.PI * 2;
            it.vx = Math.cos(ang) * 2.4;
            it.vz = Math.sin(ang) * 2.4;
            it.vy = 3.7;
            it.mesh.rotation.y = Math.atan2(it.vx, it.vz);
            if (Math.random() < 0.45 && this.players[0] && Math.hypot(this.players[0].x - it.x, this.players[0].z - it.z) < 6.5) {
              soundManager.petSound();
            }
          }
        }
      }

      this.clampItemInBounds(it);
      if (it.isVibrating && Math.abs(it.vy) < 0.2) {
        const vibNow = performance.now() * 0.045 + it.id * 1.7;
        it.mesh.position.set(it.x + Math.sin(vibNow) * 0.018, it.y, it.z + Math.cos(vibNow * 1.2) * 0.014);
        it.mesh.rotation.z = Math.sin(vibNow * 1.1) * 0.032;
      } else {
        it.mesh.position.set(it.x, it.y, it.z);
        if (!it.isRolling) it.mesh.rotation.z = 0;
      }
    });
  }

  updateTrajectoryVisual() {
    const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';
    const activeP = isLanClient ? this.players[1] : this.players[0];
    if (!activeP || !activeP.chargingThrow || !activeP.holdingItem || activeP.holdingItem.isCarryOnly || this.gameState !== 'PLAYING') {
      this.trajectoryDots.forEach(d => d.visible = false);
      return;
    }

    const it = activeP.holdingItem;
    let dirX = Math.sin(activeP.rotY);
    let dirZ = Math.cos(activeP.rotY);
    let power = 0.55 + activeP.throwPower * 0.75;

    if (this.pointerAiming) {
      const dx = this.aimWorldPoint.x - activeP.x;
      const dz = this.aimWorldPoint.z - activeP.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 0.25) {
        dirX = dx / dist;
        dirZ = dz / dist;
        power = Math.min(1.35, Math.max(0.45, dist / 7.5));
      }
    }

    const perk = this.getVariantPerk(activeP.variant);
    const catchBoost = (activeP.catchBoostTimer || 0) > 0 ? 1.18 : 1.0;
    const modThrowMult = this.selectedModifier === 'turbo' ? 1.2 : 1.0;
    const weightMult = it.isSuperHeavy ? 0.68 : (it.isHeavy ? 0.84 : 1.0);
    const mult = power * weightMult * perk.throwMult * catchBoost * modThrowMult;
    const vx = dirX * 11.5 * mult;
    const vz = dirZ * 11.5 * mult;
    const vy = 6.2 * mult;

    for (let i = 0; i < this.trajectoryDots.length; i++) {
      const t = (i + 1) * 0.08;
      const dot = this.trajectoryDots[i];
      dot.position.set(
        activeP.x + vx * t,
        Math.max(0.08, activeP.y + 1.35 + vy * t - 0.5 * 18.0 * t * t),
        activeP.z + vz * t
      );
      dot.visible = true;
    }
  }

  spawnPuffSmoke(x, y, z, count = 2, scale = 1.0) {
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(this.sharedPuffGeo, this.puffMat);
      m.position.set(
        x + (Math.random() - 0.5) * 0.35,
        y + Math.random() * 0.12,
        z + (Math.random() - 0.5) * 0.35
      );
      const baseScale = scale * (0.75 + Math.random() * 0.45);
      m.scale.setScalar(baseScale);
      this.levelGroup.add(m);
      this.particles.push({
        mesh: m,
        isPuff: true,
        baseScale,
        vx: (Math.random() - 0.5) * 1.4,
        vy: 0.9 + Math.random() * 0.8,
        vz: (Math.random() - 0.5) * 1.4,
        life: 0.38 + Math.random() * 0.16,
        maxLife: 0.52
      });
    }
  }

  emitBurst(x, y, z, colorHex, count = 16) {
    let mat = this.particleMatCache.get(colorHex);
    if (!mat) {
      mat = new THREE.MeshBasicMaterial({ color: colorHex });
      this.particleMatCache.set(colorHex, mat);
    }
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(this.sharedParticleGeo, mat);
      m.position.set(x, y, z);
      this.levelGroup.add(m);
      this.particles.push({
        mesh: m,
        vx: (Math.random() - 0.5) * 7,
        vy: Math.random() * 6 + 2,
        vz: (Math.random() - 0.5) * 7,
        life: 0.7 + Math.random() * 0.4
      });
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      if (pt.life <= 0) {
        this.levelGroup.remove(pt.mesh);
        this.particles.splice(i, 1);
        continue;
      }
      if (pt.isPuff) {
        pt.mesh.position.x += pt.vx * dt;
        pt.mesh.position.y += pt.vy * dt;
        pt.mesh.position.z += pt.vz * dt;
        pt.vx *= 0.92;
        pt.vz *= 0.92;
        const tNorm = Math.max(0, pt.life / (pt.maxLife || 0.5));
        const puffScale = pt.baseScale * (0.4 + Math.sin(tNorm * Math.PI) * 1.15);
        pt.mesh.scale.setScalar(Math.max(0.05, puffScale));
      } else {
        pt.vy -= 14 * dt;
        pt.mesh.position.x += pt.vx * dt;
        pt.mesh.position.y += pt.vy * dt;
        pt.mesh.position.z += pt.vz * dt;
        pt.mesh.rotation.x += 6 * dt;
        pt.mesh.rotation.y += 6 * dt;
        pt.mesh.scale.setScalar(Math.max(0.05, pt.life));
      }
    }
  }

  spawnFloatingText(text, wx, wy, wz, color = '#ffffff') {
    if (!this.floatingLayer) return;
    const vec = new THREE.Vector3(wx, wy, wz);
    vec.project(this.camera);

    const w = this.canvas.clientWidth || 1060;
    const h = this.canvas.clientHeight || 650;
    const sx = (vec.x * 0.5 + 0.5) * w;
    const sy = (-vec.y * 0.5 + 0.5) * h;

    const el = document.createElement('div');
    el.className = 'floating-3d-toast';
    el.innerText = text;
    el.style.left = `${sx}px`;
    el.style.top = `${sy}px`;
    el.style.color = color;
    this.floatingLayer.appendChild(el);

    setTimeout(() => el.remove(), 1150);
  }

  syncHUD() {
    const def = LEVELS_3D[this.currentLevel] || LEVELS_3D[1];
    const bonusState = evaluateBonusStatus(def.bonusObjective, this.matchStats);
    this.ui.updateHUD(
      this.itemsDelivered,
      this.targetItemsCount,
      this.score,
      this.timeLeft,
      this.landlordRage,
      this.players[0],
      this.players[1],
      this.players.length > 1,
      {
        players: this.players,
        bonusLabel: getLevelText(this.currentLevel).bonusLabel,
        bonusFailed: bonusState.failedLive,
        parTime: def.parTime || def.timeLimit,
        elapsedSeconds: this.getElapsedSeconds(),
        combo: this.deliveryCombo,
        comboTimer: this.comboTimer
      }
    );
  }

  pushNetEvent(kind, payload = {}) {
    if (this.gameMode !== 'LAN_COOP' || this.network.role !== 'host') return;
    const now = performance.now();
    this.pendingNetEvents.push({ seq: ++this.netEventSeq, kind, ...payload, _ts: now });
    this.pendingNetEvents = this.pendingNetEvents.filter(ev => now - ev._ts < 1500).slice(-12);
  }

  handleRemoteNetEvent(ev) {
    if (!ev || !ev.kind) return;
    if (ev.kind === 'trampoline_item') {
      soundManager.trampoline();
      this.emitBurst(ev.x, ev.y, ev.z, 0xfacc15, 14);
      this.spawnFloatingText('NẢY VÀO XE! 🚀', ev.x, 1.6, ev.z, '#facc15');
    } else if (ev.kind === 'bonk') {
      soundManager.bonk();
      this.cameraShake = 0.25;
      this.spawnFloatingText('BẸP DÍ! 💫', ev.x, ev.y, ev.z, '#f472b6');
    } else if (ev.kind === 'coop_pass') {
      if (ev.air) soundManager.catchAir();
      else soundManager.grab();
      this.spawnFloatingText(ev.text || '⚡ BẮT ĐỒ! 📦', ev.x, ev.y, ev.z, '#38bdf8');
    } else if (ev.kind === 'patrol_stun') {
      soundManager.bonk();
      this.emitBurst(ev.x, ev.y, ev.z, 0xfacc15, 16);
      this.spawnFloatingText('💫 CHOÁNG LUÔN!', ev.x, ev.y + 1.0, ev.z, '#fde047');
    } else if (ev.kind === 'dash_slap') {
      soundManager.bonk();
      this.emitBurst(ev.x, ev.y, ev.z, 0xf472b6, 12);
      this.spawnFloatingText('👋 BẠP! TRÊU TÍ!', ev.x, ev.y + 0.5, ev.z, '#f472b6');
    } else if (ev.kind === 'switch_toggle') {
      soundManager.switchToggle(ev.on);
      this.emitBurst(ev.x, ev.y, ev.z, 0xfacc15, 10);
      const msgKey = ev.style === 'traffic'
        ? (ev.on ? 'mech_traffic_red' : 'mech_traffic_green')
        : (ev.on ? 'mech_switch_on' : 'mech_switch_off');
      this.spawnFloatingText(t(msgKey), ev.x, ev.y + 1.0, ev.z, ev.on ? '#4ade80' : '#facc15');
    } else if (ev.kind === 'hazard_hit') {
      if (!ev.isPit) this.matchStats.hazardHits++;
      if (ev.isCar) soundManager.horn();
      else soundManager.bonk();
      this.cameraShake = 0.28;
      this.rumbleAllActive(0.5, 110);
      this.emitBurst(ev.x, ev.y, ev.z, ev.isPit ? 0x64748b : 0xef4444, 16);
      this.spawnFloatingText(t(ev.isPit ? 'mech_pit_fall' : 'mech_hazard_hit'), ev.rx, ev.ry, ev.rz, '#f87171');
    } else if (ev.kind === 'item_respawn' || ev.kind === 'fragile_respawn') {
      if (ev.countHazard) this.matchStats.hazardHits++;
      if (ev.countFragile || ev.kind === 'fragile_respawn') {
        this.matchStats.fragileBroken++;
        this.matchStats.anyItemBroken++;
      }
      soundManager.shatter();
      this.rumbleAllActive(0.55, 120);
      this.cameraShake = 0.35;
      this.emitBurst(ev.bx, ev.by, ev.bz, ev.color || 0xef4444, 22);
      const penText = ev.penalty ? ` -${ev.penalty.toLocaleString()}đ` : '';
      this.spawnFloatingText(`${t('mech_item_respawn')}${penText}`, ev.rx, ev.ry, ev.rz, '#fb923c');
      this.ui.addFeedPill(`<span>♻️ ${ev.name}</span><b style="color:#c2410c;">-${(ev.penalty || 0).toLocaleString()}đ</b>`, 'broke');
    }
  }

  applyHostState(state) {
    if (!state) return;

    // P1 is owned by Host -> update interpolation target on Client
    const p1 = this.players[0];
    if (state.p1 && p1) {
      if (Number.isFinite(state.p1.x)) p1.netX = state.p1.x;
      if (Number.isFinite(state.p1.y)) p1.netY = state.p1.y;
      if (Number.isFinite(state.p1.z)) p1.netZ = state.p1.z;
      if (Number.isFinite(state.p1.rotY)) p1.netRotY = state.p1.rotY;
      p1.stunTimer = state.p1.stun ? 1.0 : 0;
      p1.squashX = Number.isFinite(state.p1.sx) ? state.p1.sx : 1.0;
      p1.squashY = Number.isFinite(state.p1.sy) ? state.p1.sy : 1.0;
      p1.holdingItem = (state.p1.heldIdx >= 0 && this.items[state.p1.heldIdx]) ? this.items[state.p1.heldIdx] : null;
      if (state.p1.anim) p1.bobi.playAnimation(state.p1.anim, 0.1);
    }

    // P2 is locally simulated by Client -> only accept authoritative heldItem & stun events
    const p2 = this.players[1];
    if (state.p2 && p2) {
      p2.holdingItem = (state.p2.heldIdx >= 0 && this.items[state.p2.heldIdx]) ? this.items[state.p2.heldIdx] : null;
      if (state.p2.stun && p2.stunTimer <= 0) {
        p2.stunTimer = 2.0;
        p2.squashY = 0.35;
        p2.squashX = 1.55;
      }
    }

    // Apply delta item updates + synchronized audiovisual transitions
    if (state.items) {
      state.items.forEach((si) => {
        const idx = si.i;
        const it = this.items[idx];
        if (!it) return;
        const wasDelivered = it.isDelivered;
        const wasBroken = it.isBroken;
        it.isDelivered = !!si.d;
        it.isBroken = !!si.b;

        if (!wasDelivered && it.isDelivered) {
          const netCombo = state.combo || 1;
          this.cameraShake = 0.2;
          this.truckBounceVel = it.isSuperHeavy ? -3.4 : (it.isHeavy ? -2.6 : -1.8);
          if (it.type === 'piano') soundManager.pianoChord();
          else if (it.isLiving) {
            soundManager.petSound();
            soundManager.deliver(netCombo);
          } else {
            soundManager.deliver(netCombo);
          }
          this.rumbleAllActive(0.35, 90);
          this.emitBurst(si.x, 1.15, si.z, netCombo >= 2 ? 0xfacc15 : 0x22c55e, 24);
          if (netCombo >= 2) {
            this.spawnFloatingText(`🔥 x${netCombo}!`, si.x, 2.35, si.z, '#f59e0b');
            this.ui.addFeedPill(`<span>🔥 x${netCombo} ${it.name}</span>`, 'bounce');
          } else {
            this.spawnFloatingText(`+${it.value.toLocaleString()}đ`, si.x, 2.2, si.z, '#16a34a');
            this.ui.addFeedPill(`<span>✓ ${it.name}</span><b style="color:#15803d;">+${it.value.toLocaleString()}đ</b>`);
          }
        }

        if (!wasBroken && it.isBroken) {
          this.matchStats.anyItemBroken++;
          if (it.isFragile) this.matchStats.fragileBroken++;
          const penalty = Math.floor(it.value * 0.4);
          this.cameraShake = 0.35;
          soundManager.shatter();
          this.rumbleAllActive(0.55, 120);
          this.emitBurst(it.x, it.y + 0.3, it.z, 0xef4444, 24);
          this.spawnFloatingText(`XOẢNG! -${penalty.toLocaleString()}đ`, it.x, it.y + 1.5, it.z, '#ef4444');
          this.ui.addFeedPill(`<span>💥 ${it.name}</span><b style="color:#dc2626;">-${penalty.toLocaleString()}đ</b>`, 'broke');
        }

        if (it.isBroken) {
          if (it.mesh.parent) it.mesh.parent.remove(it.mesh);
          return;
        }
        if (it.isDelivered) {
          this.mountDeliveredItemInTruck(it, si.x, si.z);
          return;
        }
        if (si.h >= 0 && this.players[si.h]) {
          const holder = this.players[si.h];
          if (it.mesh.parent !== holder.bobi.carryMount) {
            holder.bobi.carryMount.add(it.mesh);
            it.mesh.position.set(0, 0.15, 0);
            it.mesh.rotation.set(0, 0, 0);
          }
        } else {
          if (it.mesh.parent !== this.levelGroup) this.levelGroup.add(it.mesh);
          it.netX = si.x;
          it.netY = si.y;
          it.netZ = si.z;
        }
      });
    }

    if (state.windows) {
      state.windows.forEach((isBroken, idx) => {
        const w = this.windows[idx];
        if (w && isBroken && !w.isBroken) {
          w.isBroken = true;
          this.matchStats.windowsBroken++;
          this.levelGroup.remove(w.mesh);
          this.cameraShake = 0.35;
          soundManager.glassShatter();
          this.rumbleAllActive(0.5, 110);
          this.emitBurst(w.x, 1.4, w.z, 0x67e8f9, 26);
          this.spawnFloatingText('💥 VỠ KÍNH!', w.x, 2.2, w.z, '#38bdf8');
          this.ui.addFeedPill('<span>🪟 Vỡ kính!</span><b style="color:#0284c7;">Mở lối</b>', 'glass');
        }
      });
    }

    if (state.mech && this.mechanics) {
      const flipped = this.mechanics.applyState(state.mech);
      if (flipped.length > 0) soundManager.switchToggle(flipped[0].active);
    }

    if (Array.isArray(state.events)) {
      state.events.forEach((ev) => {
        if (ev.seq > this.lastAppliedNetEventSeq) {
          this.lastAppliedNetEventSeq = ev.seq;
          this.handleRemoteNetEvent(ev);
        }
      });
    }

    this.itemsDelivered = state.itemsDelivered ?? this.itemsDelivered;
    this.score = state.score;
    this.timeLeft = state.timeLeft;
    this.landlordRage = state.landlordRage;
    if (Number.isFinite(state.combo)) this.deliveryCombo = state.combo;
    if (Number.isFinite(state.comboTimer)) this.comboTimer = state.comboTimer;

    if (state.isGameOver && this.gameState === 'PLAYING') {
      this.endGame();
    }
  }

  interpolateFreeItems(dt) {
    const smooth = 1 - Math.exp(-18 * dt);
    this.items.forEach((it) => {
      if (!it.isBroken && it.mesh.parent === this.levelGroup && it.netX !== undefined) {
        it.x = THREE.MathUtils.lerp(it.x, it.netX, smooth);
        it.y = THREE.MathUtils.lerp(it.y, it.netY, smooth);
        it.z = THREE.MathUtils.lerp(it.z, it.netZ, smooth);
        it.mesh.position.set(it.x, it.y, it.z);
      }
    });
  }

  updateMechanics(dt, isLanClient) {
    if (!this.mechanics) return;
    const prevElevY = this.mechanics.elevators.map(e => e.y);
    const changedSwitches = this.mechanics.update(dt, {
      authoritative: !isLanClient,
      players: this.players,
      items: this.items
    });

    // Ride vertical delta smoothly on moving elevators
    this.mechanics.elevators.forEach((el, idx) => {
      const dy = el.y - prevElevY[idx];
      if (Math.abs(dy) < 0.0001) return;
      const onDeck = (e) => e && Math.abs(e.x - el.x) <= el.w / 2 && Math.abs(e.z - el.z) <= el.d / 2 && Math.abs(e.y - prevElevY[idx]) < 0.45;
      const checkPlayers = isLanClient ? [this.players[1]] : this.players;
      checkPlayers.forEach((p) => {
        if (p && p.isGrounded && onDeck(p)) {
          p.y += dy;
          p.bobi.root.position.y = p.y;
        }
      });
      if (!isLanClient) {
        this.items.forEach((it) => {
          if (!it.isHeld && !it.isDelivered && !it.isBroken && Math.abs(it.vy) < 0.5 && onDeck(it)) {
            it.y += dy;
            it.mesh.position.y = it.y;
          }
        });
      }
    });

    if (!isLanClient) {
      if (changedSwitches.length > 0) {
        soundManager.switchToggle(changedSwitches[0].active);
      }
      // Car warning horn approaching center crosswalk
      for (const h of this.mechanics.hazards) {
        if (h.type === 'car' && !h.stopped && h.hornCd <= 0) {
          const approaching = h.axis === 'x'
            ? (Math.abs(h.x) < 4.5 && ((h.dir >= 0 && h.x < -0.5) || (h.dir < 0 && h.x > 0.5)))
            : (Math.abs(h.z) < 4.5 && ((h.dir >= 0 && h.z < -0.5) || (h.dir < 0 && h.z > 0.5)));
          if (approaching) {
            h.hornCd = 3.2;
            soundManager.horn();
          }
        }
      }
      // Player hazard collisions (Cars & Patrollers)
      this.players.forEach((p) => {
        if (!p || p.stunTimer > 0) return;
        const hz = this.mechanics.hazardHitting(p, p.radius);
        if (hz) this.applyPlayerHazardHit(p, hz, false);
      });
    }

    this.mechVisuals?.update(this.mechanics, dt);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.contextLost || this.isSettingUpLevel) return;

    const now = performance.now();
    const rawDt = (now - (this.lastTime || now)) / 1000;
    const dt = Math.min(0.05, Math.max(0.001, rawDt));
    this.lastTime = now;
    const isLanClient = this.gameMode === 'LAN_COOP' && this.network.role === 'client';

    try {
      this.processGamepadInputs();

      // Adaptive FPS safeguard: auto-switch off shadows if device sustains <32 FPS
      if (this.highQuality && rawDt > 0.032) {
        this.lowFpsFrames++;
        if (this.lowFpsFrames > 45) {
          this.highQuality = false;
          this.applyGraphicsSettings();
          this.syncSettingsModalUI();
          this.ui.addFeedPill(`<span>⚡ ${t('set_gfx_smooth')}</span>`, 'glass');
          this.lowFpsFrames = 0;
        }
      } else {
        this.lowFpsFrames = Math.max(0, this.lowFpsFrames - 1);
      }

      let ovState = null;
      if (this.gameState === 'MENU') {
        this.targetCamAngle = 0.26 + Math.sin(now * 0.00024) * 0.24 + (this.menuOrbitBias || 0);
        if (this.mechanics) {
          this.mechanics.update(dt, { authoritative: false });
          this.mechVisuals?.update(this.mechanics, dt);
        }
        if (this.players[0]) {
          this.players[0].bobi.root.rotation.y += dt * 0.85;
          this.players[0].bobi.update(dt, false);
        }
      } else if (this.gameState === 'OVERWORLD' && this.overworld) {
        let ovInX = 0;
        let ovInY = 0;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) ovInY += 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) ovInY -= 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) ovInX -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) ovInX += 1;
        if (Math.abs(this.touchMoveX) > 0.08 || Math.abs(this.touchMoveY) > 0.08) {
          ovInX += this.touchMoveX;
          ovInY += this.touchMoveY;
        }
        if (this.padStates[0]) {
          ovInX += this.padStates[0].moveX;
          ovInY += this.padStates[0].moveY;
        }
        ovState = this.overworld.update(dt, ovInX, ovInY, this.camFwdXZ, this.camRightXZ);
        this.syncOverworldHUD(ovState);
      } else if (this.gameState === 'PLAYING') {
        if (!isLanClient && this.comboTimer > 0) {
          this.comboTimer = Math.max(0, this.comboTimer - dt);
          if (this.comboTimer === 0) this.deliveryCombo = 0;
        }
        const truckBody = this.truck?.mesh?.userData?.bodyGroup;
        if (truckBody) {
          const accel = -165 * this.truckBounceOffset - 11 * this.truckBounceVel;
          this.truckBounceVel += accel * dt;
          this.truckBounceOffset += this.truckBounceVel * dt;
          truckBody.position.y = this.truckBounceOffset;
          truckBody.rotation.z = this.truckBounceOffset * 0.14;
        }

        this.updateMechanics(dt, isLanClient);
        this.updatePlayers(dt);
        this.updateTrajectoryVisual();

        if (!isLanClient) {
          this.updateItems(dt);
        } else {
          this.interpolateFreeItems(dt);
          // Send compact P2 local position/anim state to Host at 25Hz (only if changed)
          if (this.players[1] && now - this.lastP2SyncTime >= 40) {
            this.lastP2SyncTime = now;
            this.sendClientStateSafe(this.players[1]);
          }
        }
        this.updateParticles(dt);

        // Update HUD at ~10 Hz
        if (now - this.lastHudSyncTime >= 100) {
          this.lastHudSyncTime = now;
          this.syncHUD();
        }

        // Host broadcasts compact delta world snapshot at 25 Hz
        if (this.gameMode === 'LAN_COOP' && this.network.role === 'host' && this.players[0] && now - this.lastNetSyncTime >= 40) {
          this.lastNetSyncTime = now;
          const forceFull = (now - this.lastFullSyncTime >= 900);
          if (forceFull) this.lastFullSyncTime = now;
          this.broadcastSnapshot(forceFull);
        }
      } else if (this.gameState === 'GAMEOVER') {
        this.players.forEach(p => p.bobi.update(dt, false));
        this.updateParticles(dt);
      }

      // Smooth rotatable camera orbit + dynamic zoom & follow targeting 1-4 local players or Overworld truck
      this.camAngle = THREE.MathUtils.lerp(this.camAngle, this.targetCamAngle, Math.min(1, dt * 10));
      const curDef = LEVELS_3D[this.currentLevel];
      const mapZoomBase = 1.0 + Math.max(0, (curDef?.floorSize?.w || 26) - 26) * 0.024;
      const camTargetPlayer = (isLanClient && this.players[1]) ? this.players[1] : this.players[0];

      let targetFX = 0;
      let targetFZ = 0;
      let targetZoom = mapZoomBase;
      if (this.gameState === 'OVERWORLD' && ovState) {
        targetFX = THREE.MathUtils.clamp(ovState.truckX * 0.85, -24, 24);
        targetFZ = THREE.MathUtils.clamp(ovState.truckZ * 0.85, -16, 16);
        targetZoom = 1.12 + Math.min(0.16, ovState.speed * 0.012);
      } else if (this.gameState !== 'MENU') {
        if (this.isLocalMultiMode() && this.players.length > 1) {
          let sumX = 0;
          let sumZ = 0;
          for (const pl of this.players) {
            sumX += pl.x;
            sumZ += pl.z;
          }
          const midX = sumX / this.players.length;
          const midZ = sumZ / this.players.length;
          let maxSpan = 0;
          for (let a = 0; a < this.players.length; a++) {
            for (let b = a + 1; b < this.players.length; b++) {
              maxSpan = Math.max(maxSpan, Math.hypot(this.players[a].x - this.players[b].x, this.players[a].z - this.players[b].z));
            }
          }
          targetFX = THREE.MathUtils.clamp(midX * 0.52, -9.5, 9.5);
          targetFZ = THREE.MathUtils.clamp(midZ * 0.42, -6.5, 6.5);
          targetZoom = THREE.MathUtils.clamp(mapZoomBase + Math.max(0, maxSpan - 7.5) * 0.032, 1.0, 1.56);
        } else if (camTargetPlayer) {
          targetFX = THREE.MathUtils.clamp(camTargetPlayer.x * 0.52, -9.5, 9.5);
          targetFZ = THREE.MathUtils.clamp(camTargetPlayer.z * 0.42, -6.5, 6.5);
        }
      }
      this.camFocusX = THREE.MathUtils.lerp(this.camFocusX || 0, targetFX, Math.min(1, dt * 5));
      this.camFocusZ = THREE.MathUtils.lerp(this.camFocusZ || 0, targetFZ, Math.min(1, dt * 5));
      this.camZoom = THREE.MathUtils.lerp(this.camZoom || 1.0, targetZoom, Math.min(1, dt * 3.5));

      let shakeX = 0, shakeY = 0;
      if (this.cameraShake > 0) {
        shakeX = (Math.random() - 0.5) * this.cameraShake;
        shakeY = (Math.random() - 0.5) * this.cameraShake;
        this.cameraShake = Math.max(0, this.cameraShake - dt * 1.4);
      }

      this.updateCameraTransform(this.camFocusX, this.camFocusZ, shakeX, shakeY);
      if (this.gameState !== 'OVERWORLD') {
        this.updateHelperVisuals(camTargetPlayer, now);
      }
      if (this.gameState === 'PLAYING') {
        this.updateWallOcclusionFade(camTargetPlayer);
      }
      this.renderer.render(this.scene, this.camera);
    } catch (err) {
      if (now - this.lastAnimateErrorTime > 1500) {
        this.lastAnimateErrorTime = now;
        console.error('[Game3DApp] Frame error caught:', err);
      }
    }
  }

  broadcastSnapshot(forceFull = false) {
    if (!this.players[0]) return;
    const r2 = (n) => Math.round(n * 100) / 100;
    const serializePlayer = (p) => p ? {
      x: r2(p.x), y: r2(p.y), z: r2(p.z), rotY: r2(p.rotY),
      sx: r2(p.squashX), sy: r2(p.squashY),
      stun: p.stunTimer > 0 ? 1 : 0,
      heldIdx: p.holdingItem ? this.items.indexOf(p.holdingItem) : -1,
      anim: p.bobi.currentAnim
    } : null;

    // Delta compress items: only emit items that moved or changed status
    const deltaItems = [];
    this.items.forEach((it, idx) => {
      const heldIdx = it.heldBy ? this.players.indexOf(it.heldBy) : -1;
      const snap = {
        i: idx,
        x: r2(it.x),
        y: r2(it.y),
        z: r2(it.z),
        d: it.isDelivered ? 1 : 0,
        b: it.isBroken ? 1 : 0,
        h: heldIdx
      };
      const sig = `${snap.x},${snap.y},${snap.z},${snap.d},${snap.b},${snap.h}`;
      if (forceFull || this.lastItemSnapshots[idx] !== sig) {
        this.lastItemSnapshots[idx] = sig;
        deltaItems.push(snap);
      }
    });

    const recentEvents = this.pendingNetEvents.length > 0
      ? this.pendingNetEvents.slice(-8).map(({ _ts, ...ev }) => ev)
      : undefined;

    this.network.broadcastHostState({
      p1: serializePlayer(this.players[0]),
      p2: serializePlayer(this.players[1]),
      items: deltaItems,
      windows: this.windows.map(w => w.isBroken ? 1 : 0),
      mech: this.mechanics ? this.mechanics.serialize() : undefined,
      events: recentEvents,
      itemsDelivered: this.itemsDelivered,
      score: this.score,
      timeLeft: this.timeLeft,
      landlordRage: this.landlordRage,
      combo: this.deliveryCombo,
      comboTimer: r2(this.comboTimer),
      isGameOver: this.gameState === 'GAMEOVER'
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameApp3D = new Game3DApp();
});
