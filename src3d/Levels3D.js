// =========================================================================
// 2.5D ISOMETRIC 3D LEVEL DEFINITIONS — 6 DISTINCT MAPS & MECHANICS
// World coordinates in meters: X (Left/Right), Y (Up), Z (Depth)
// =========================================================================

export const LEVELS_3D = {
  // -----------------------------------------------------------------------
  // 1. NHÀ PHỐ KHỞI ĐỘNG (Làm quen cơ bản: Cửa kính, hàng rào thấp, bạt lò xo)
  // -----------------------------------------------------------------------
  1: {
    id: 1,
    name: 'Nhà Phố Khởi Động',
    targetItems: 8,
    timeLimit: 80,
    parTime: 55,
    bonusObjective: 'no_glass',
    bounds: { minX: -12, maxX: 12, minZ: -8, maxZ: 8 },
    spawns: [
      { x: -1.8, y: 0.1, z: 2.2 },
      { x: -1.8, y: 0.1, z: -1.6 }
    ],
    floorSize: { w: 26, d: 18 },
    houseBounds: { minX: -9.5, maxX: 1.2, minZ: -5.8, maxZ: 5.8 },
    roads: [
      { x: 8.2, z: 0, w: 6.4, d: 17.0, lanes: 'z' }
    ],
    platforms: [
      { x: -6.2, y: 2.3, z: -2.2, w: 5.6, d: 6.4 }
    ],
    ramps: [
      { minX: -3.4, maxX: -0.6, minZ: 1.5, maxZ: 4.5, yStart: 0, yEnd: 2.3, axis: 'x', dir: -1 }
    ],
    walls: [
      { x: -9.5, y: 1.5, z: 0, w: 0.4, h: 3.0, d: 12.0 },
      { x: -4.15, y: 1.5, z: -5.8, w: 11.1, h: 3.0, d: 0.4 },
      { x: 1.2, y: 1.5, z: -3.8, w: 0.35, h: 3.0, d: 4.0 },
      { x: 1.2, y: 1.5, z: 3.8, w: 0.35, h: 3.0, d: 4.0 },
      // Low front yard picket fence: walk around OR throw OVER it!
      { x: 2.8, y: 0.55, z: -2.2, w: 0.25, h: 1.1, d: 5.2 }
    ],
    windows: [
      { id: 'w1_1', x: 1.2, y: 0, z: 0, w: 0.25, h: 2.8, d: 3.4, hp: 2, isBroken: false }
    ],
    trampolines: [
      { x: 4.6, y: 0, z: 2.6, r: 1.55 }
    ],
    truck: { x: 8.2, y: 0, z: -0.5, bedW: 4.2, bedD: 4.6, rotY: 0 },
    items: [
      { type: 'box', x: -3.2, y: 0, z: 2.6, name: 'Thùng Quần Áo', value: 500000 },
      { type: 'chair', x: -1.6, y: 0, z: -2.4, name: 'Ghế Gỗ Sồi', value: 800000 },
      { type: 'tv', x: -6.4, y: 0, z: -3.6, name: 'Tivi Màn Hình Cong', value: 15000000, isFragile: true },
      { type: 'vase', x: -0.8, y: 0, z: -4.0, name: 'Bình Hoa Pha Lê', value: 6500000, isFragile: true },
      { type: 'plant', x: -0.2, y: 0, z: 3.8, name: 'Chậu Cây Cảnh', value: 950000 },
      { type: 'sofa', x: -7.0, y: 2.3, z: -1.8, name: 'Sofa Da Bò', value: 12000000, isHeavy: true },
      { type: 'lamp', x: -4.6, y: 2.3, z: -4.0, name: 'Đèn Cây Cổ Điển', value: 1200000 },
      { type: 'aquarium', x: -4.6, y: 2.3, z: 0.0, name: 'Bể Cá Vàng Mini', value: 3500000, isFragile: true }
    ]
  },

  // -----------------------------------------------------------------------
  // 2. BIỆT THỰ MA ÁM & CỬA CUỐN (Bố cục trên-dưới, Ma tuần tra, Công tắc)
  // Truck rotated & parked at the BOTTOM (+Z), facing UP (-Z)!
  // -----------------------------------------------------------------------
  2: {
    id: 2,
    name: 'Biệt Thự Ma Ám',
    targetItems: 10,
    timeLimit: 95,
    parTime: 68,
    bonusObjective: 'no_fragile_break',
    bounds: { minX: -12, maxX: 12, minZ: -8, maxZ: 8 },
    spawns: [
      { x: -8.2, y: 0.1, z: 2.4 },
      { x: -6.2, y: 0.1, z: 2.4 }
    ],
    floorSize: { w: 26, d: 18 },
    floorColor: 0xc4b5fd,
    wallColor: 0xddd6fe,
    houseBounds: { minX: -10.5, maxX: 10.5, minZ: -6.8, maxZ: 1.5 },
    roads: [
      { x: 0, z: 5.6, w: 26.0, d: 5.2, lanes: 'x' }
    ],
    platforms: [
      { x: 7.4, y: 2.2, z: -4.0, w: 5.4, d: 4.8 }
    ],
    ramps: [
      { minX: 2.2, maxX: 4.7, minZ: -5.6, maxZ: -2.8, yStart: 0, yEnd: 2.2, axis: 'x', dir: 1 }
    ],
    walls: [
      // Outer shell (North, West, East)
      { x: 0, y: 1.6, z: -6.8, w: 21.4, h: 3.2, d: 0.4 },
      { x: -10.5, y: 1.6, z: -2.65, w: 0.4, h: 3.2, d: 8.7 },
      { x: 10.5, y: 1.6, z: -2.65, w: 0.4, h: 3.2, d: 8.7 },
      // South facade with Far-Left corridor open, Glass at x=-3.2, and Shortcut Shutter at x=4.5
      { x: -6.0, y: 1.6, z: 1.5, w: 3.0, h: 3.2, d: 0.35 },
      { x: 0.4, y: 1.6, z: 1.5, w: 4.6, h: 3.2, d: 0.35 },
      { x: 8.4, y: 1.6, z: 1.5, w: 4.2, h: 3.2, d: 0.35 },
      // Interior room divider (Vault West wall leaving North doorway gap)
      { x: -1.8, y: 1.4, z: -1.2, w: 0.35, h: 2.8, d: 4.8 }
    ],
    windows: [
      { id: 'w2_1', x: -3.2, y: 0, z: 1.5, w: 2.6, h: 2.8, d: 0.25, hp: 2, isBroken: false }
    ],
    switches: [
      { id: 'm2_plate', type: 'plate', x: -0.6, y: 0, z: -0.6, r: 0.85, holdSeconds: 2.0 },
      { id: 'm2_lever', type: 'lever', x: 7.4, y: 0, z: 0.2, holdSeconds: 9.0, cooldownSeconds: 1.0 }
    ],
    gates: [
      { id: 'm2_shutter', kind: 'door', x: 4.5, y: 0, z: 1.5, w: 3.6, h: 2.9, d: 0.35, switchIds: ['m2_plate', 'm2_lever'], speed: 2.6 }
    ],
    hazards: [
      { type: 'patrol', kind: 'ghost', speed: 2.7, loop: true, radius: 0.62, points: [[-8.0, -4.6], [-4.2, -4.6], [-4.2, -0.5], [-8.0, -0.5]] },
      { type: 'patrol', kind: 'ghost', speed: 3.0, loop: false, radius: 0.62, offset: 4.0, points: [[0.8, -5.0], [0.8, 0.2], [5.8, 0.2]] }
    ],
    trampolines: [
      { x: -6.0, y: 0, z: 4.0, r: 1.4 }
    ],
    truck: { x: 4.5, y: 0, z: 5.5, bedW: 4.2, bedD: 4.6, rotY: -Math.PI / 2 },
    items: [
      { type: 'box', x: -8.6, y: 0, z: -0.6, name: 'Hòm Sách Cổ', value: 1200000 },
      { type: 'vase', x: -6.2, y: 0, z: -2.8, name: 'Bình Sứ Ma Ám', value: 14000000, isFragile: true },
      { type: 'sofa', x: -8.8, y: 0, z: -4.8, name: 'Ghế Bành Nhung Đỏ', value: 16000000, isHeavy: true },
      { type: 'tv', x: -3.2, y: 0, z: -4.8, name: 'Tivi Cổ Điển', value: 12000000, isFragile: true },
      { type: 'piano', x: 2.2, y: 0, z: -2.6, name: 'Đàn Organ Biệt Thự', value: 45000000, isSuperHeavy: true },
      { type: 'aquarium', x: 4.6, y: 0, z: -1.4, name: 'Bể Cá Đom Đóm', value: 18000000, isFragile: true },
      { type: 'lamp', x: 8.6, y: 0, z: -0.4, name: 'Đèn Chùm Nến', value: 4200000 },
      { type: 'safe', x: 8.4, y: 2.2, z: -4.8, name: 'Két Bạc Gia Tộc', value: 65000000, isSuperHeavy: true },
      { type: 'statue', x: 6.2, y: 2.2, z: -4.8, name: 'Tượng Cú Đêm Vàng', value: 24000000, isFragile: true },
      { type: 'teddy', x: 7.5, y: 2.2, z: -2.6, name: 'Gấu Bông Dracula', value: 3500000 }
    ]
  },

  // -----------------------------------------------------------------------
  // 3. ĐẠI LỘ GIỜ CAO ĐIỂM (2 Nhà bên trái đường -> Làn XE CHẠY ở giữa -> Xe tải bên kia phố)
  // -----------------------------------------------------------------------
  3: {
    id: 3,
    name: 'Đại Lộ Giờ Cao Điểm',
    targetItems: 12,
    timeLimit: 105,
    parTime: 74,
    bonusObjective: 'no_hazard_hit',
    bounds: { minX: -12, maxX: 12, minZ: -8, maxZ: 8 },
    spawns: [
      { x: -6.4, y: 0.1, z: -3.0 },
      { x: -6.4, y: 0.1, z: 3.2 }
    ],
    floorSize: { w: 26, d: 18 },
    houseZones: [
      { minX: -11.0, maxX: -3.6, minZ: -6.8, maxZ: -1.2, color: 0xfef3c7 },
      { minX: -11.0, maxX: -3.6, minZ: 1.2, maxZ: 6.8, color: 0xdbeafe }
    ],
    roads: [
      { x: 0.0, z: 0.0, w: 5.8, d: 17.4, lanes: 'z', crosswalk: 0.0 },
      { x: 8.4, z: 0.0, w: 5.8, d: 17.4 }
    ],
    platforms: [
      { x: -8.6, y: 2.2, z: -4.6, w: 4.2, d: 4.0 }
    ],
    ramps: [
      { minX: -6.5, maxX: -4.6, minZ: -5.8, maxZ: -3.4, yStart: 0, yEnd: 2.2, axis: 'x', dir: -1 }
    ],
    walls: [
      // North shop back & side walls (open to South & East crosswalk)
      { x: -11.0, y: 1.5, z: -4.0, w: 0.35, h: 3.0, d: 5.8 },
      { x: -7.3, y: 1.5, z: -6.8, w: 7.6, h: 3.0, d: 0.35 },
      // South shop back & bottom walls
      { x: -11.0, y: 1.5, z: 4.0, w: 0.35, h: 3.0, d: 5.8 },
      { x: -7.3, y: 1.5, z: 6.8, w: 7.6, h: 3.0, d: 0.35 },
      // Low curb planter box inviting crosswalk use or throwing over it
      { x: -3.6, y: 0.5, z: -4.8, w: 0.35, h: 1.0, d: 3.0 }
    ],
    windows: [
      { id: 'w3_1', x: -3.6, y: 0, z: 4.2, w: 0.25, h: 2.6, d: 3.0, hp: 2, isBroken: false }
    ],
    switches: [
      { id: 'm3_traffic', type: 'lever', style: 'traffic', x: -3.6, y: 0, z: 0.0, holdSeconds: 5.5, cooldownSeconds: 4.0 }
    ],
    hazards: [
      { type: 'car', axis: 'z', lane: -1.4, dir: 1, from: -11, to: 11, speed: 6.2, offset: 2.0, color: 0xef4444, stopSwitchId: 'm3_traffic' },
      { type: 'car', axis: 'z', lane: 1.4, dir: -1, from: -11, to: 11, speed: 7.0, offset: 9.0, color: 0x3b82f6, stopSwitchId: 'm3_traffic' }
    ],
    trampolines: [
      { x: -4.0, y: 0, z: -2.0, r: 1.3 },
      { x: -4.0, y: 0, z: 1.8, r: 1.3 }
    ],
    truck: { x: 8.2, y: 0, z: 0.0, bedW: 4.4, bedD: 5.0, rotY: 0 },
    items: [
      // North Shop
      { type: 'box', x: -5.4, y: 0, z: -2.0, name: 'Kiện Hàng Thời Trang', value: 3500000 },
      { type: 'chair', x: -8.6, y: 0, z: -1.8, name: 'Ghế Thư Giãn Bắc Âu', value: 4200000 },
      { type: 'tv', x: -9.8, y: 0, z: -2.2, name: 'Màn Hình 8K', value: 45000000, isFragile: true },
      { type: 'safe', x: -9.6, y: 2.2, z: -5.4, name: 'Két Tiệm Vàng', value: 95000000, isSuperHeavy: true },
      { type: 'statue', x: -7.4, y: 2.2, z: -5.4, name: 'Tượng Mèo Chiêu Tài', value: 28000000, isFragile: true },
      { type: 'lamp', x: -9.4, y: 2.2, z: -3.2, name: 'Đèn Trang Trí Studio', value: 6500000 },
      // South Shop
      { type: 'pc', x: -9.5, y: 0, z: 2.5, name: 'Dàn PC Livestream', value: 55000000, isFragile: true },
      { type: 'fridge', x: -9.6, y: 0, z: 5.2, name: 'Tủ Mát Nước Ép', value: 22000000, isHeavy: true },
      { type: 'sofa', x: -6.4, y: 0, z: 5.2, name: 'Sofa Tiếp Khách', value: 28000000, isHeavy: true },
      { type: 'vase', x: -5.0, y: 0, z: 5.4, name: 'Bình Hoa Gốm Chu Đậu', value: 24000000, isFragile: true },
      { type: 'plant', x: -5.2, y: 0, z: 2.2, name: 'Chậu Trầu Bà Nam Mỹ', value: 3800000 },
      { type: 'piano', x: -7.8, y: 0, z: 2.2, name: 'Piano Điện Concert', value: 60000000, isSuperHeavy: true }
    ]
  },

  // -----------------------------------------------------------------------
  // 4. NHÀ HÀNG BẾP LỬA 5 SAO (Sàn dầu trơn trượt + Quầy bar ném qua + Đầu bếp)
  // -----------------------------------------------------------------------
  4: {
    id: 4,
    name: 'Nhà Hàng Bếp Lửa 5 Sao',
    targetItems: 12,
    timeLimit: 100,
    parTime: 72,
    bonusObjective: 'no_glass',
    bounds: { minX: -12, maxX: 12, minZ: -8, maxZ: 8 },
    spawns: [
      { x: -8.6, y: 0.1, z: -4.2 },
      { x: -9.5, y: 0.1, z: 3.6 }
    ],
    floorSize: { w: 26, d: 18 },
    floorColor: 0xfde68a,
    wallColor: 0xfef3c7,
    houseBounds: { minX: -10.8, maxX: 2.6, minZ: -6.6, maxZ: 6.6 },
    roads: [
      { x: 8.5, z: 0, w: 6.2, d: 17.0, lanes: 'z' }
    ],
    platforms: [],
    ramps: [],
    walls: [
      { x: -10.8, y: 1.6, z: 0, w: 0.4, h: 3.2, d: 13.6 },
      { x: -4.1, y: 1.6, z: -6.6, w: 13.8, h: 3.2, d: 0.4 },
      { x: -4.1, y: 1.6, z: 6.6, w: 13.8, h: 3.2, d: 0.4 },
      // Bar counter between North Kitchen & South Dining (height 1.15m -> throw OVER it!)
      { x: -5.4, y: 0.58, z: 0.0, w: 9.2, h: 1.15, d: 0.55 },
      // Front wall pillars
      { x: 2.6, y: 1.6, z: -4.9, w: 0.35, h: 3.2, d: 3.4 },
      { x: 2.6, y: 1.6, z: 4.9, w: 0.35, h: 3.2, d: 3.4 }
    ],
    windows: [
      { id: 'w4_1', x: 2.6, y: 0, z: -1.6, w: 0.25, h: 2.8, d: 2.4, hp: 2, isBroken: false },
      { id: 'w4_2', x: 2.6, y: 0, z: 1.6, w: 0.25, h: 2.8, d: 2.4, hp: 2, isBroken: false }
    ],
    zones: [
      // Huge slippery oil slick across kitchen & dining pass-through!
      { type: 'slippery', minX: -9.8, maxX: 0.8, minZ: -5.8, maxZ: -1.0, y: 0 },
      { type: 'slippery', minX: -6.2, maxX: 1.5, minZ: 1.2, maxZ: 5.2, y: 0 }
    ],
    hazards: [
      { type: 'patrol', kind: 'chef', speed: 3.2, loop: false, radius: 0.62, points: [[-8.6, -2.4], [1.2, -2.4]] },
      { type: 'patrol', kind: 'cart', speed: 3.6, loop: true, radius: 0.68, points: [[-6.6, 2.0], [-0.4, 2.0], [-0.4, 4.6], [-6.6, 4.6]] }
    ],
    trampolines: [
      { x: 4.8, y: 0, z: -3.8, r: 1.5 },
      { x: 4.8, y: 0, z: 3.8, r: 1.5 }
    ],
    truck: { x: 8.5, y: 0, z: -0.4, bedW: 4.2, bedD: 4.8, rotY: 0 },
    items: [
      { type: 'fridge', x: -9.2, y: 0, z: -5.2, name: 'Tủ Đông Hải Sản', value: 24000000, isHeavy: true },
      { type: 'aquarium', x: -6.2, y: 0, z: -5.2, name: 'Bể Tôm Hùm Alaska', value: 38000000, isFragile: true },
      { type: 'box', x: -3.2, y: 0, z: -5.0, name: 'Thùng Gia Vị Bí Truyền', value: 5500000 },
      { type: 'box', x: -0.4, y: 0, z: -4.8, name: 'Nồi Hầm Inox Khổng Lồ', value: 6200000 },
      { type: 'vase', x: -1.2, y: 0, z: -1.5, name: 'Bình Rượu Vang Đỏ', value: 22000000, isFragile: true },
      { type: 'statue', x: -4.2, y: 0, z: -1.5, name: 'Tượng Đầu Bếp Vàng', value: 36000000, isFragile: true },
      { type: 'piano', x: -9.2, y: 0, z: 5.0, name: 'Đàn Piano Sảnh Tiệc', value: 72000000, isSuperHeavy: true },
      { type: 'safe', x: -9.2, y: 0, z: 2.2, name: 'Két Thu Ngân Nhà Hàng', value: 52000000, isSuperHeavy: true },
      { type: 'sofa', x: -4.2, y: 0, z: 5.4, name: 'Ghế Băng VIP Da Đỏ', value: 26000000, isHeavy: true },
      { type: 'chair', x: -1.2, y: 0, z: 3.5, name: 'Ghế Bàn Tiệc Pháp', value: 4500000 },
      { type: 'tv', x: -6.8, y: 0, z: 3.4, name: 'Bảng Menu LED 4K', value: 21000000, isFragile: true },
      { type: 'plant', x: 0.8, y: 0, z: 4.8, name: 'Cây Oliu Sảnh Chính', value: 6800000 }
    ]
  },

  // -----------------------------------------------------------------------
  // 5. CÔNG TRƯỜNG THANG NÂNG & GIÓ MẠNH (Thang máy 3 tầng + Hố sâu + Cầu rút + Quạt)
  // -----------------------------------------------------------------------
  5: {
    id: 5,
    name: 'Công Trường Thang Nâng',
    targetItems: 14,
    timeLimit: 115,
    parTime: 84,
    bonusObjective: 'no_fragile_break',
    bounds: { minX: -12, maxX: 12, minZ: -8, maxZ: 8 },
    spawns: [
      { x: -6.8, y: 0.1, z: 0.0 },
      { x: -8.8, y: 2.5, z: -4.0 }
    ],
    floorSize: { w: 26, d: 18 },
    wallColor: 0xf59e0b,
    houseZones: [
      { minX: -11.2, maxX: -3.2, minZ: -6.8, maxZ: 6.8, color: 0x94a3b8 },
      { minX: 3.0, maxX: 6.2, minZ: -6.8, maxZ: 6.8, color: 0xcbd5e1 }
    ],
    roads: [
      { x: 8.8, z: 0, w: 6.0, d: 17.0, lanes: 'z' }
    ],
    platforms: [
      // Tier 2 Scaffold (North-West) & Tier 3 Crane Deck (South-West)
      { x: -9.0, y: 2.4, z: -4.0, w: 4.2, d: 5.2 },
      { x: -9.0, y: 4.2, z: 4.0, w: 4.2, d: 5.2 }
    ],
    ramps: [],
    walls: [
      { x: -11.2, y: 2.4, z: 0, w: 0.4, h: 4.8, d: 14.0 },
      { x: -7.2, y: 2.4, z: -6.8, w: 8.4, h: 4.8, d: 0.4 },
      { x: -7.2, y: 2.4, z: 6.8, w: 8.4, h: 4.8, d: 0.4 }
    ],
    windows: [],
    pits: [
      { minX: -3.2, maxX: 3.0, minZ: -6.6, maxZ: -1.4 },
      { minX: -3.2, maxX: 3.0, minZ: 1.4, maxZ: 6.6 }
    ],
    switches: [
      { id: 'm5_bridge', type: 'lever', x: -4.0, y: 0, z: -2.0, holdSeconds: 12.0, cooldownSeconds: 1.0 },
      { id: 'm5_fan_off', type: 'lever', x: -4.0, y: 0, z: 0.6, holdSeconds: 10.0, cooldownSeconds: 2.5 }
    ],
    gates: [
      { id: 'm5_bridge_gate', kind: 'bridge', x: -0.1, y: 0, z: -4.0, w: 6.6, d: 2.6, switchIds: ['m5_bridge'], speed: 3.0 }
    ],
    elevators: [
      { x: -5.4, z: -4.0, w: 2.6, d: 2.8, yMin: 0, yMax: 2.4, speed: 1.5, pauseSec: 1.4, offset: 0 },
      { x: -5.4, z: 4.0, w: 2.6, d: 2.8, yMin: 0, yMax: 4.2, speed: 1.8, pauseSec: 1.5, offset: 2.0 }
    ],
    zones: [
      // Strong crosswind across the center pit! Flip m5_fan_off to disable temporarily.
      { type: 'wind', minX: -3.4, maxX: 3.2, minZ: -6.2, maxZ: 6.2, yMin: -2, yMax: 8, fx: 0, fz: 5.5, fanX: -0.1, fanZ: -6.5, switchId: 'm5_fan_off', offWhenActive: true }
    ],
    trampolines: [
      { x: -4.6, y: 0, z: 1.1, r: 1.25 },
      { x: 4.9, y: 0, z: -3.8, r: 1.4 }
    ],
    truck: { x: 8.6, y: 0, z: 0.0, bedW: 4.4, bedD: 5.2, rotY: 0 },
    items: [
      // Ground staging yard
      { type: 'safe', x: -9.4, y: 0, z: -0.2, name: 'Máy Phát Điện Mini', value: 48000000, isSuperHeavy: true },
      { type: 'fridge', x: -7.8, y: 0, z: 0.8, name: 'Tủ Đồ Nghề Cơ Khí', value: 28000000, isHeavy: true },
      { type: 'box', x: -5.6, y: 0, z: -1.0, name: 'Thùng Bu Lông Ốc Vít', value: 6500000 },
      { type: 'box', x: -9.4, y: 0, z: 5.6, name: 'Cuộn Cáp Đồng', value: 12000000 },
      { type: 'pc', x: -1.6, y: 0, z: 0.0, name: 'Trạm Điều Khiển Cẩu', value: 52000000, isFragile: true },
      { type: 'lamp', x: -7.4, y: 0, z: -2.2, name: 'Đèn Pha Công Trường', value: 8500000 },
      // Tier 2 Scaffold (Y = 2.4)
      { type: 'sofa', x: -9.6, y: 2.4, z: -4.8, name: 'Băng Ghế Nghỉ Thợ', value: 14000000, isHeavy: true },
      { type: 'tv', x: -7.6, y: 2.4, z: -5.4, name: 'Màn Hình Bản Vẽ CAD', value: 32000000, isFragile: true },
      { type: 'box', x: -7.6, y: 2.4, z: -2.6, name: 'Hộp Máy Khoan Bê Tông', value: 15000000 },
      { type: 'chair', x: -9.8, y: 2.4, z: -2.4, name: 'Ghế Kỹ Sư Trưởng', value: 5800000 },
      // Tier 3 Crane Deck (Y = 4.2)
      { type: 'safe', x: -9.6, y: 4.2, z: 5.2, name: 'Két Hợp Đồng Dự Án', value: 95000000, isSuperHeavy: true },
      { type: 'statue', x: -7.6, y: 4.2, z: 5.2, name: 'Cúp Vàng An Toàn', value: 42000000, isFragile: true },
      { type: 'pc', x: -7.6, y: 4.2, z: 2.6, name: 'Laptop Đo Đạc Laser', value: 36000000, isFragile: true },
      { type: 'vase', x: -9.8, y: 4.2, z: 2.6, name: 'Bình Đo Áp Suất Kính', value: 19000000, isFragile: true }
    ]
  },

  // -----------------------------------------------------------------------
  // 6. ĐẠI KHO BĂNG CHUYỀN HỖN LOẠN (Mạng băng chuyền đảo chiều + Cầu + Robot)
  // -----------------------------------------------------------------------
  6: {
    id: 6,
    name: 'Đại Kho Băng Chuyền',
    targetItems: 16,
    timeLimit: 125,
    parTime: 92,
    bonusObjective: 'no_any_damage',
    bounds: { minX: -12.4, maxX: 12.4, minZ: -8.2, maxZ: 8.2 },
    spawns: [
      { x: -9.8, y: 0.1, z: -0.6 },
      { x: -9.8, y: 0.1, z: 0.8 }
    ],
    floorSize: { w: 28, d: 18 },
    floorColor: 0xcbd5e1,
    wallColor: 0x94a3b8,
    houseBounds: { minX: -11.4, maxX: 2.6, minZ: -7.0, maxZ: 7.0 },
    roads: [
      { x: 9.0, z: 0, w: 6.4, d: 17.6, lanes: 'z' }
    ],
    platforms: [
      { x: -7.8, y: 2.3, z: 0.0, w: 4.2, d: 3.8 }
    ],
    ramps: [
      // Gentle ramp descending East into central aisle (y=0 at x=-3.2 -> y=2.3 at x=-5.7)
      { minX: -5.7, maxX: -3.2, minZ: -1.2, maxZ: 1.2, yStart: 0, yEnd: 2.3, axis: 'x', dir: -1 }
    ],
    walls: [
      { x: -11.4, y: 2.0, z: 0, w: 0.45, h: 4.0, d: 14.4 },
      { x: -4.4, y: 2.0, z: -7.0, w: 14.4, h: 4.0, d: 0.45 },
      { x: -4.4, y: 2.0, z: 7.0, w: 14.4, h: 4.0, d: 0.45 },
      // East warehouse partition with Glass center, open North Conveyor mouth & Lower Shutter
      { x: 2.6, y: 1.6, z: -5.8, w: 0.35, h: 3.2, d: 2.4 },
      { x: 2.6, y: 1.6, z: -1.4, w: 0.35, h: 3.2, d: 2.2 },
      { x: 2.6, y: 1.6, z: 6.2, w: 0.35, h: 3.2, d: 1.6 }
    ],
    windows: [
      { id: 'w6_1', x: 2.6, y: 0, z: 1.2, w: 0.25, h: 2.8, d: 2.8, hp: 2, isBroken: false }
    ],
    pits: [
      // Loading bay trench between warehouse east wall & truck dock!
      { minX: 3.2, maxX: 6.2, minZ: -2.2, maxZ: 2.2 }
    ],
    switches: [
      { id: 'm6_reverse', type: 'lever', x: -2.4, y: 0, z: -1.8, cooldownSeconds: 0.6 },
      { id: 'm6_plate', type: 'plate', x: 1.4, y: 0, z: 0.0, r: 0.85, holdSeconds: 4.5 }
    ],
    gates: [
      { id: 'm6_shutter', kind: 'door', x: 2.6, y: 0, z: 4.0, w: 0.35, h: 3.0, d: 2.8, switchIds: ['m6_plate'], speed: 2.8 },
      { id: 'm6_bridge', kind: 'bridge', x: 4.7, y: 0, z: 0.0, w: 3.2, d: 4.2, switchIds: ['m6_plate'], speed: 2.8 }
    ],
    zones: [
      // Top Conveyor: starts pushing INWARD (-X) until lever m6_reverse flips it toward truck!
      { type: 'conveyor', minX: -9.8, maxX: 2.2, minZ: -5.4, maxZ: -2.8, y: 0, vx: -3.6, vz: 0, switchId: 'm6_reverse', flipWhenActive: true },
      // Bottom Conveyor: continuously rushes heavy boxes toward the Lower Shutter Door!
      { type: 'conveyor', minX: -9.8, maxX: 2.2, minZ: 2.8, maxZ: 5.4, y: 0, vx: 3.2, vz: 0 }
    ],
    hazards: [
      { type: 'patrol', kind: 'robot', speed: 3.4, loop: true, radius: 0.62, points: [[-2.6, -1.5], [1.2, -1.5], [1.2, 1.5], [-2.6, 1.5]] }
    ],
    trampolines: [
      { x: 4.7, y: 0, z: -4.2, r: 1.55 },
      { x: 4.7, y: 0, z: 4.2, r: 1.55 }
    ],
    truck: { x: 9.0, y: 0, z: 0.0, bedW: 4.4, bedD: 5.4, rotY: 0 },
    items: [
      // North Wing (Upper Conveyor side)
      { type: 'piano', x: -8.6, y: 0, z: -4.2, name: 'Đại Dương Cầm VIP', value: 90000000, isSuperHeavy: true },
      { type: 'safe', x: -5.0, y: 0, z: -4.2, name: 'Két Ngân Hàng', value: 150000000, isSuperHeavy: true },
      { type: 'pc', x: -1.2, y: 0, z: -6.0, name: 'Server AI Cluster', value: 110000000, isFragile: true },
      { type: 'statue', x: -6.2, y: 0, z: -6.0, name: 'Tượng Rồng Vàng', value: 72000000, isFragile: true },
      { type: 'vase', x: 0.6, y: 0, z: -6.0, name: 'Bình Ngọc Hoàng Gia', value: 88000000, isFragile: true },
      // Central Floor & Mezzanine
      { type: 'chair', x: -2.0, y: 0, z: 0.5, name: 'Ghế Giám Đốc Da Thật', value: 16000000 },
      { type: 'box', x: -1.0, y: 0, z: 1.8, name: 'Kiện Hàng Express #1', value: 12000000 },
      { type: 'sofa', x: -7.8, y: 2.3, z: -0.8, name: 'Bộ Sofa Tiếp Khách', value: 44000000, isHeavy: true },
      { type: 'pc', x: -6.4, y: 2.3, z: 1.0, name: 'Bộ RTX 5090 Ti', value: 125000000, isFragile: true },
      { type: 'box', x: -8.8, y: 2.3, z: 1.0, name: 'Rương Vàng Kho Báu', value: 65000000 },
      { type: 'lamp', x: -6.4, y: 2.3, z: -1.0, name: 'Đèn Pha Lê Tiệp', value: 26000000, isFragile: true },
      // South Wing (Lower Conveyor side)
      { type: 'fridge', x: -8.8, y: 0, z: 4.1, name: 'Tủ Lạnh Công Nghiệp', value: 35000000, isHeavy: true },
      { type: 'box', x: -5.4, y: 0, z: 4.1, name: 'Vali Đô La Mỹ', value: 55000000 },
      { type: 'aquarium', x: -8.8, y: 0, z: 6.0, name: 'Hồ Cá Koi Nhật', value: 48000000, isFragile: true },
      { type: 'tv', x: -2.0, y: 0, z: 6.0, name: 'Màn Hình Rạp 100"', value: 78000000, isFragile: true },
      { type: 'plant', x: 0.5, y: 0, z: 6.0, name: 'Tùng La Hán Cổ Thụ', value: 32000000 }
    ]
  }
};
