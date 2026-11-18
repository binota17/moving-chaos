// =========================================================================
// MAIN ENTRY POINT - GAME CONTROLLER & COORDINATOR
// =========================================================================
import { CONFIG, LEVELS } from './config.js';
import { eventBus } from './core/EventBus.js';
import { GameLoop } from './core/GameLoop.js';
import { soundManager } from './core/SoundManager.js';
import { InputManager } from './core/InputManager.js';
import { PhysicsWorld } from './physics/PhysicsWorld.js';
import { Player } from './entities/Player.js';
import { FurnitureProp } from './entities/FurnitureProp.js';
import { DestructibleGlass } from './entities/DestructibleGlass.js';
import { Trampoline } from './entities/Trampoline.js';
import { Truck } from './entities/Truck.js';
import { ParticleSystem } from './render/ParticleSystem.js';
import { Renderer } from './render/Renderer.js';
import { UIManager } from './render/UIManager.js';
import { NetworkManager } from './network/NetworkManager.js';

class GameApp {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ui = new UIManager();
    this.renderer = new Renderer(this.canvas);
    this.physics = new PhysicsWorld();
    this.particles = new ParticleSystem(300);
    this.input = new InputManager(this.canvas);
    this.network = new NetworkManager();

    this.currentLevel = 1;
    this.gameMode = 'SOLO'; // 'SOLO', 'LOCAL_2P', 'LAN_COOP'
    this.gameState = 'MENU'; // 'MENU', 'PLAYING', 'GAMEOVER'

    this.score = 0;
    this.timeLeft = 70;
    this.timerInterval = null;
    this.itemsDelivered = 0;
    this.targetItemsCount = 8;
    this.landlordRage = 0;

    // Entities
    this.player1 = new Player(1, 'Thợ Cả Tèo', CONFIG.COLORS.P1_SUIT, CONFIG.COLORS.P1_HAT, 120, 530);
    this.player2 = new Player(2, 'Thợ Phụ Tí', CONFIG.COLORS.P2_SUIT, CONFIG.COLORS.P2_HAT, 220, 530);

    this.platforms = [];
    this.windows = [];
    this.items = [];
    this.trampoline = null;
    this.truck = null;

    this.setupEventHandlers();
    this.setupInputHandlers();
    this.setupDOMHandlers();

    // Setup initial level
    this.setupLevel(1);

    // Start Game Loop
    this.loop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render()
    );
    this.loop.start();
  }

  setupLevel(lvl) {
    this.currentLevel = lvl;
    const def = LEVELS[lvl] || LEVELS[1];

    this.itemsDelivered = 0;
    this.landlordRage = 0;
    this.targetItemsCount = def.targetItems;
    this.timeLeft = def.timeLimit;

    this.platforms = [...def.platforms];
    this.windows = def.windows.map(w => new DestructibleGlass(w));
    this.items = def.items.map(it => new FurnitureProp(it));
    this.trampoline = new Trampoline(def.trampoline);
    this.truck = new Truck(def.truck);

    this.player1.reset(120, 530);
    this.player2.reset(220, 530);

    this.particles.clear();
    this.renderer.clear();

    this.ui.updateHUD(
      this.itemsDelivered,
      this.targetItemsCount,
      this.score,
      this.timeLeft,
      this.landlordRage,
      this.player1,
      this.player2,
      this.gameMode !== 'SOLO'
    );
  }

  setupEventHandlers() {
    eventBus.on('glassBreak', ({ window }) => {
      this.renderer.shake(8);
      this.particles.emitGlassShards(window.x + window.w / 2, window.y + window.h / 2, 28);
      this.renderer.addFloatingText('💥 VỠ KÍNH! CỬA THÔNG! 🪟', window.x - 30, window.y + window.h / 2, '#00cec9', 19, true);
      this.ui.addFeedPill('<span>🪟 Vỡ toang cửa kính!</span><b style="color:#00cec9;">Thông thoáng!</b>', 'glass');
    });

    eventBus.on('itemBreak', ({ item }) => {
      this.renderer.shake(9);
      const penalty = Math.floor(item.value * 0.4);
      this.score = Math.max(0, this.score - penalty);
      this.landlordRage = Math.min(100, this.landlordRage + 30);

      this.particles.emit(item.x + item.w / 2, item.y + item.h / 2, '#e74c3c', 28);
      this.renderer.addFloatingText(`XOẢNG! VỠ NÁT! -${penalty.toLocaleString()} đ`, item.x - 30, item.y - 20, '#ff7675', 20, true);
      this.ui.addFeedPill(`<span>💥 Vỡ tan tành: ${item.name}</span><b style="color:#e74c3c;">-${penalty.toLocaleString()} đ</b>`, 'broke');

      if (this.landlordRage >= 100) {
        setTimeout(() => this.endGame(), 800);
      }
    });

    eventBus.on('itemDeliver', ({ item }) => {
      this.itemsDelivered++;
      this.score += item.value;
      this.renderer.shake(item.isSuperHeavy ? 8 : 4);

      this.particles.emit(item.x + item.w / 2, item.y + item.h / 2, '#2ecc71', 25);
      this.renderer.addFloatingText(`AN TOÀN! +${item.value.toLocaleString()} đ`, item.x - 20, item.y - 25, '#2ecc71', 20, true);
      this.ui.addFeedPill(`<span>🚚 Lên xe: ${item.name}</span><b style="color:#2ecc71;">+${item.value.toLocaleString()} đ</b>`);

      if (this.itemsDelivered >= this.targetItemsCount) {
        setTimeout(() => this.endGame(), 1200);
      }
    });

    eventBus.on('playerStun', ({ player }) => {
      this.renderer.shake(6);
      this.renderer.addFloatingText('CHOÁNG VÁNG! 💫', player.x - 10, player.y - 35, '#f368e0', 17, true);
      this.ui.addFeedPill(`<span>💥 ${player.name} bị đè bẹp dí!</span><b style="color:#f368e0;">Choáng!</b>`, 'bonk');
    });

    eventBus.on('trampolineBounce', ({ item, trampoline }) => {
      this.particles.emit(item.x + item.w / 2, trampoline.y, '#f39c12', 15);
      this.renderer.addFloatingText('BOINGGG! 🚀', item.x, trampoline.y - 20, '#f1c40f', 18, true);
      this.ui.addFeedPill(`<span>Bạt lò xo: ${item.name}</span><b style="color:#f1c40f;">Bay vào xe!</b>`, 'bounce');
    });

    eventBus.on('peerConnected', () => {
      this.ui.addFeedPill('<span>Thợ Phụ P2 đã vào phòng!</span><b style="color:#00cec9;">Sẵn sàng!</b>');
      this.startGame();
    });

    eventBus.on('roomJoined', () => {
      this.ui.addFeedPill('<span>Đã vào phòng Host!</span><b style="color:#2ecc71;">Bắt đầu!</b>');
      this.startGame();
    });

    // LAN Network Handlers
    this.network.onP2InputReceived = (keys) => {
      Object.assign(this.input.keysP2, keys);
    };

    this.network.onStateReceived = (state) => {
      this.applyHostState(state);
    };
  }

  setupInputHandlers() {
    // P1 Jump & Grab
    this.input.onP1Jump = () => {
      soundManager.init();
      if (this.player1.jump()) soundManager.jump();
    };
    this.input.onP1Grab = () => {
      soundManager.init();
      this.toggleGrab(this.player1);
    };
    this.input.onP1ThrowRelease = () => {
      if (this.player1.chargingThrow && this.player1.holdingItem) {
        this.executeThrow(
          this.player1,
          this.player1.facing * (10 + this.player1.throwPower * 14),
          -8 - this.player1.throwPower * 12
        );
      }
      this.player1.chargingThrow = false;
      this.player1.throwPower = 0;
    };

    // P2 Jump & Grab
    this.input.onP2Jump = () => {
      if (this.gameMode === 'SOLO') return;
      soundManager.init();
      if (this.player2.jump()) soundManager.jump();
      this.sendP2InputIfClient();
    };
    this.input.onP2Grab = () => {
      if (this.gameMode === 'SOLO') return;
      soundManager.init();
      this.toggleGrab(this.player2);
      this.sendP2InputIfClient();
    };
    this.input.onP2ThrowRelease = () => {
      if (this.gameMode === 'SOLO') return;
      if (this.player2.chargingThrow && this.player2.holdingItem) {
        this.executeThrow(
          this.player2,
          this.player2.facing * (10 + this.player2.throwPower * 14),
          -8 - this.player2.throwPower * 12
        );
      }
      this.player2.chargingThrow = false;
      this.player2.throwPower = 0;
      this.sendP2InputIfClient();
    };

    // Mouse Aiming for P1
    this.input.onPointerPick = (cx, cy) => {
      soundManager.init();
      if (this.player1.holdingItem) return true;

      let found = false;
      this.items.forEach(it => {
        if (!it.isDelivered && !it.isBroken && !it.isHeld) {
          if (Math.hypot((it.x + it.w / 2) - cx, (it.y + it.h / 2) - cy) < 45) {
            if (Math.hypot((it.x + it.w / 2) - (this.player1.x + this.player1.w / 2), (it.y + it.h / 2) - this.player1.y) < 70) {
              this.grabItem(this.player1, it);
              found = true;
            }
          }
        }
      });
      if (!found) this.toggleGrab(this.player1);
      return this.player1.holdingItem !== null;
    };

    this.input.onPointerThrow = (sx, sy, cx, cy) => {
      if (!this.player1.holdingItem) return;
      const dx = cx - (this.player1.x + this.player1.w / 2);
      const dy = cy - (this.player1.y - 12);
      const dist = Math.hypot(dx, dy);
      const power = Math.min(1.4, Math.max(0.35, dist / 160));
      const angle = Math.atan2(dy, dx);

      this.executeThrow(this.player1, Math.cos(angle) * (18 * power), Math.sin(angle) * (18 * power));
    };
  }

  sendP2InputIfClient() {
    if (this.gameMode === 'LAN_COOP' && this.network.role === 'client') {
      this.network.sendClientInput(this.input.keysP2);
    }
  }

  setupDOMHandlers() {
    // Touch buttons
    const grabBtn = document.getElementById('touch-grab-btn');
    if (grabBtn) grabBtn.addEventListener('click', () => { soundManager.init(); this.toggleGrab(this.player1); });

    const throwBtn = document.getElementById('touch-throw-btn');
    if (throwBtn) {
      throwBtn.addEventListener('pointerdown', () => {
        soundManager.init();
        if (this.player1.holdingItem) this.player1.chargingThrow = true;
      });
      throwBtn.addEventListener('pointerup', () => {
        if (this.player1.chargingThrow && this.player1.holdingItem) {
          this.executeThrow(this.player1, this.player1.facing * (10 + this.player1.throwPower * 14), -8 - this.player1.throwPower * 12);
        }
        this.player1.chargingThrow = false;
        this.player1.throwPower = 0;
      });
    }

    // Audio & Header buttons
    const sndBtn = document.getElementById('sound-btn');
    if (sndBtn) {
      sndBtn.addEventListener('click', () => {
        soundManager.init();
        const on = soundManager.toggleSFX();
        sndBtn.innerText = on ? '🔊' : '🔈';
      });
    }

    const musBtn = document.getElementById('music-btn');
    if (musBtn) {
      musBtn.addEventListener('click', () => {
        soundManager.init();
        const on = soundManager.toggleBGM();
        musBtn.innerText = on ? '🎵' : '🔇';
      });
    }

    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        this.gameState = 'MENU';
        soundManager.stopBGM();
        this.ui.showStartMenu();
      });
    }

    // Mode Selector tabs
    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.gameMode = tab.dataset.mode;

        const p2Label = document.getElementById('p2-controls-label');
        const lanPanel = document.getElementById('lan-panel');

        if (this.gameMode === 'SOLO') {
          if (p2Label) p2Label.style.display = 'none';
          if (lanPanel) lanPanel.style.display = 'none';
        } else if (this.gameMode === 'LOCAL_2P') {
          if (p2Label) p2Label.style.display = 'inline';
          if (lanPanel) lanPanel.style.display = 'none';
        } else if (this.gameMode === 'LAN_COOP') {
          if (p2Label) p2Label.style.display = 'inline';
          if (lanPanel) lanPanel.style.display = 'block';
          this.checkLANStatus();
        }
      });
    });

    // Unified Guide modal & first-play HUD hint
    const guideModal = document.getElementById('guide-modal');
    const openGuideModal = () => {
      if (guideModal) guideModal.style.display = 'flex';
    };
    const closeGuideModal = () => {
      if (guideModal) guideModal.style.display = 'none';
    };
    const openGuideBtn = document.getElementById('open-guide-btn');
    const hudGuideBtn = document.getElementById('hud-guide-btn');
    const closeGuideBtn = document.getElementById('guide-close-btn');
    if (openGuideBtn) openGuideBtn.addEventListener('click', openGuideModal);
    if (hudGuideBtn) hudGuideBtn.addEventListener('click', openGuideModal);
    if (closeGuideBtn) closeGuideBtn.addEventListener('click', closeGuideModal);
    if (guideModal) {
      guideModal.addEventListener('click', (e) => {
        if (e.target === guideModal) closeGuideModal();
      });
    }

    const hintCloseBtn = document.getElementById('hud-hint-close-btn');
    if (hintCloseBtn) {
      hintCloseBtn.addEventListener('click', () => {
        const hintEl = document.getElementById('controls-hint-text');
        if (hintEl) hintEl.classList.remove('is-first-play');
        try { localStorage.setItem('moving_chaos_2d_guide_seen_v1', '1'); } catch { /* ignore */ }
      });
    }

    // Map select modal & Level selector
    const mapModal = document.getElementById('map-select-modal');
    const openMapBtn = document.getElementById('open-map-select-btn');
    const closeMapBtn = document.getElementById('map-select-close-btn');
    const closeMapModal = () => {
      if (mapModal) mapModal.style.display = 'none';
    };
    if (openMapBtn) {
      openMapBtn.addEventListener('click', () => {
        if (mapModal) mapModal.style.display = 'flex';
      });
    }
    if (closeMapBtn) {
      closeMapBtn.addEventListener('click', closeMapModal);
    }
    if (mapModal) {
      mapModal.addEventListener('click', (e) => {
        if (e.target === mapModal) closeMapModal();
      });
    }

    document.querySelectorAll('.level-card').forEach(c => {
      c.addEventListener('click', () => {
        document.querySelectorAll('.level-card').forEach(x => x.classList.remove('selected'));
        c.classList.add('selected');
        this.currentLevel = parseInt(c.dataset.level, 10);
        const nameEl = document.getElementById('selected-map-name');
        const descEl = document.getElementById('selected-map-desc');
        const cardTitle = c.querySelector('h4')?.innerText;
        const cardDesc = c.querySelector('p')?.innerText?.replace(/\n/g, ' • ');
        if (nameEl && cardTitle) nameEl.innerText = cardTitle;
        if (descEl && cardDesc) descEl.innerText = cardDesc;
        closeMapModal();
      });
    });

    const startPlayBtn = document.getElementById('start-play-btn');
    if (startPlayBtn) startPlayBtn.addEventListener('click', () => this.startGame());

    const replayBtn = document.getElementById('replay-btn');
    if (replayBtn) replayBtn.addEventListener('click', () => this.startGame());

    const backMenuBtn = document.getElementById('menu-back-btn');
    if (backMenuBtn) backMenuBtn.addEventListener('click', () => this.ui.showStartMenu());

    // LAN buttons
    const lanHostBtn = document.getElementById('btn-lan-host');
    if (lanHostBtn) {
      lanHostBtn.addEventListener('click', () => {
        const room = document.getElementById('lan-room-input').value.trim() || 'room1';
        this.connectLAN('host', room);
      });
    }

    const lanJoinBtn = document.getElementById('btn-lan-join');
    if (lanJoinBtn) {
      lanJoinBtn.addEventListener('click', () => {
        const room = document.getElementById('lan-room-input').value.trim() || 'room1';
        this.connectLAN('client', room);
      });
    }
  }

  checkLANStatus() {
    const statusPill = document.getElementById('lan-status-text');
    const guideText = document.getElementById('lan-guide-text');

    if (location.protocol.startsWith('http')) {
      if (statusPill) {
        statusPill.innerText = '🟢 Sẵn sàng kết nối';
        statusPill.style.color = '#2ecc71';
        statusPill.style.borderColor = '#2ecc71';
      }
      if (guideText) {
        guideText.innerHTML = `Đang chạy qua Server Web (${location.host}). Chọn Tạo Phòng hoặc Vào Phòng!`;
      }
    } else {
      if (statusPill) {
        statusPill.innerText = '🟡 Mở qua file://';
        statusPill.style.color = '#f1c40f';
      }
      if (guideText) {
        guideText.innerHTML = `Để chơi qua LAN, hãy mở Terminal chạy lệnh: <span class="kbd">node server.js</span> rồi mở link hiển thị!`;
      }
    }
  }

  connectLAN(role, roomId) {
    const statusPill = document.getElementById('lan-status-text');
    this.network.connect(role, roomId, (status, message) => {
      if (statusPill) {
        statusPill.innerText = message;
        if (status === 'ready' || status === 'connected') {
          statusPill.style.color = '#2ecc71';
          statusPill.style.borderColor = '#2ecc71';
        } else if (status === 'error') {
          statusPill.style.color = '#e74c3c';
          statusPill.style.borderColor = '#e74c3c';
        }
      }
    });
  }

  toggleGrab(p) {
    if (p.stunTimer > 0) return;

    if (p.holdingItem) {
      const it = p.holdingItem;
      it.isHeld = false;
      it.heldBy = null;
      it.x = p.x + (p.facing * 30);
      it.y = p.y + p.h - it.h;
      it.vx = p.facing * 1.5;
      it.vy = -1;
      p.holdingItem = null;
      soundManager.grab();
    } else {
      let nearest = null;
      let minD = 55;
      this.items.forEach(it => {
        if (!it.isDelivered && !it.isBroken && !it.isHeld) {
          const d = Math.hypot((it.x + it.w / 2) - (p.x + p.w / 2), (it.y + it.h / 2) - (p.y + p.h / 2));
          if (d < minD) {
            minD = d;
            nearest = it;
          }
        }
      });
      if (nearest) this.grabItem(p, nearest);
    }
  }

  grabItem(p, item) {
    p.holdingItem = item;
    item.isHeld = true;
    item.heldBy = p;
    item.vx = 0;
    item.vy = 0;
    soundManager.grab();
    this.renderer.addFloatingText(`${p.name.split(' ')[2]}: BÊ ĐỒ! 📦`, p.x, p.y - 25, '#f5cd79', 14);
  }

  executeThrow(p, vx, vy) {
    if (!p.holdingItem || p.stunTimer > 0) return;
    const it = p.holdingItem;
    it.isHeld = false;
    it.heldBy = null;
    it.x = p.x + p.w / 2 - it.w / 2;
    it.y = p.y - it.h - 6;

    let weightMult = 1.0;
    if (it.isSuperHeavy) weightMult = 0.65;
    else if (it.isHeavy) weightMult = 0.82;

    const other = (p === this.player1) ? this.player2 : this.player1;
    let coOpBonus = 1.0;
    if (this.gameMode !== 'SOLO' && Math.hypot(p.x - other.x, p.y - other.y) < 60) {
      coOpBonus = 1.35;
      this.renderer.addFloatingText('HỢP LỰC CO-OP! x1.5 LỰC 🚀', p.x, p.y - 45, '#00cec9', 18, true);
    }

    it.vx = vx * weightMult * coOpBonus;
    it.vy = vy * weightMult * coOpBonus;
    it.vrot = (Math.random() - 0.5) * 0.25;

    p.holdingItem = null;
    soundManager.throwItem();

    this.renderer.addFloatingText('QUĂNG ĐỒ! 🚀', p.x, p.y - 30, '#ff7675', 18, true);
    this.particles.emit(it.x + it.w / 2, it.y + it.h / 2, '#f5cd79', 12);
  }

  startGame() {
    soundManager.init();
    soundManager.startBGM();
    soundManager.horn();

    this.score = 0;
    this.gameState = 'PLAYING';
    this.setupLevel(this.currentLevel);

    this.ui.hideStartMenu();

    // Only show in-game controls hint on the player's very first play
    const hintEl = document.getElementById('controls-hint-text');
    let seen = false;
    try { seen = localStorage.getItem('moving_chaos_2d_guide_seen_v1') === '1'; } catch { seen = true; }
    if (hintEl) {
      hintEl.classList.toggle('is-first-play', !seen);
    }
    if (!seen) {
      try { localStorage.setItem('moving_chaos_2d_guide_seen_v1', '1'); } catch { /* ignore */ }
    }

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.gameState === 'PLAYING') {
        this.timeLeft--;
        this.ui.updateHUD(
          this.itemsDelivered,
          this.targetItemsCount,
          this.score,
          this.timeLeft,
          this.landlordRage,
          this.player1,
          this.player2,
          this.gameMode !== 'SOLO'
        );
        if (this.timeLeft <= 0) this.endGame();
      }
    }, 1000);
  }

  endGame() {
    if (this.gameState === 'GAMEOVER') return;
    this.gameState = 'GAMEOVER';
    soundManager.stopBGM();
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.ui.showGameOver(this.score, this.itemsDelivered, this.targetItemsCount, this.landlordRage);
  }

  broadcastHostState() {
    if (this.gameMode !== 'LAN_COOP' || this.network.role !== 'host') return;
    const state = {
      p1: { x: this.player1.x, y: this.player1.y, facing: this.player1.facing, wobble: this.player1.wobble, stun: this.player1.stunTimer },
      p2: { x: this.player2.x, y: this.player2.y, facing: this.player2.facing, wobble: this.player2.wobble, stun: this.player2.stunTimer },
      items: this.items.map(it => ({ id: it.name, x: it.x, y: it.y, rot: it.rot, isHeld: it.isHeld, isDelivered: it.isDelivered, isBroken: it.isBroken })),
      windows: this.windows.map(w => ({ id: w.id, isBroken: w.isBroken })),
      score: this.score,
      timeLeft: this.timeLeft,
      landlordRage: this.landlordRage
    };
    this.network.broadcastHostState(state);
  }

  applyHostState(state) {
    if (!state) return;
    this.player1.x = state.p1.x; this.player1.y = state.p1.y; this.player1.facing = state.p1.facing; this.player1.wobble = state.p1.wobble;
    this.player2.x = state.p2.x; this.player2.y = state.p2.y; this.player2.facing = state.p2.facing; this.player2.wobble = state.p2.wobble;

    if (state.windows) {
      state.windows.forEach((sw, i) => {
        if (this.windows[i]) this.windows[i].isBroken = sw.isBroken;
      });
    }
    if (state.items) {
      state.items.forEach((si, i) => {
        if (this.items[i]) {
          this.items[i].x = si.x; this.items[i].y = si.y; this.items[i].rot = si.rot;
          this.items[i].isHeld = si.isHeld; this.items[i].isDelivered = si.isDelivered; this.items[i].isBroken = si.isBroken;
        }
      });
    }
    this.score = state.score;
    this.timeLeft = state.timeLeft;
    this.landlordRage = state.landlordRage;
  }

  update(dt) {
    if (this.gameState !== 'PLAYING') return;

    const activePlayers = this.gameMode === 'SOLO' ? [this.player1] : [this.player1, this.player2];

    // Update Player 1
    this.player1.update(dt, this.input.keysP1, this.platforms, CONFIG.FLOOR_Y, this.trampoline.x);

    // Update Player 2
    if (this.gameMode !== 'SOLO') {
      this.player2.update(dt, this.input.keysP2, this.platforms, CONFIG.FLOOR_Y, this.trampoline.x);
    }

    // Physics Engine update
    this.physics.update(
      dt,
      activePlayers,
      this.items,
      this.windows,
      this.platforms,
      this.trampoline,
      this.truck
    );

    // Particles & Renderer update
    this.particles.update();
    this.renderer.update(dt);

    // UI HUD update
    this.ui.updateHUD(
      this.itemsDelivered,
      this.targetItemsCount,
      this.score,
      this.timeLeft,
      this.landlordRage,
      this.player1,
      this.player2,
      this.gameMode !== 'SOLO'
    );

    // LAN broadcast
    this.broadcastHostState();
  }

  render() {
    const activePlayers = this.gameMode === 'SOLO' ? [this.player1] : [this.player1, this.player2];

    this.renderer.render({
      platforms: this.platforms,
      windows: this.windows,
      trampoline: this.trampoline,
      truck: this.truck,
      items: this.items,
      activePlayers,
      player1: this.player1,
      player2: this.player2,
      showP1Arc: (this.input.pointerAim.active || this.player1.chargingThrow) && this.player1.holdingItem,
      pointerAimActive: this.input.pointerAim.active,
      pointerAim: this.input.pointerAim,
      showP2Arc: this.gameMode !== 'SOLO' && this.player2.chargingThrow && this.player2.holdingItem,
      particleSystem: this.particles,
      landlordRage: this.landlordRage
    });
  }
}

// Instantiate on window load
window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new GameApp();
});

