// =========================================================================
// 2.5D ISOMETRIC 3D LEVEL DEFINITIONS — 6 MULTI-ROOM DIORAMA MAPS
// World coordinates in meters: X (Left/Right), Y (Up), Z (Depth)
// =========================================================================

export const LEVELS_3D = {
  // -----------------------------------------------------------------------
  // 1. NHÀ PHỐ KHỞI ĐỘNG (Gọn gàng làm quen cơ bản: Cửa kính, hàng rào, bạt lò xo)
  // -----------------------------------------------------------------------
  1: {
    id: 1,
    name: 'Nhà Phố Khởi Động',
    targetItems: 8,
    timeLimit: 85,
    parTime: 58,
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
      { type: 'console', x: -1.0, y: 0, z: -4.2, name: 'Máy Game Retro', value: 6500000, isFragile: true },
      { type: 'pet', x: -0.2, y: 0, z: 3.8, name: 'Mèo Mướp Siêu Quậy', value: 4500000, isLiving: true },
      { type: 'sofa', x: -7.0, y: 2.3, z: -1.8, name: 'Sofa Da Bò', value: 12000000, isHeavy: true },
      { type: 'washer', x: -7.6, y: 0, z: 3.8, name: 'Máy Giặt Rung Lắc', value: 8200000, isHeavy: true, isVibrating: true },
      { type: 'aquarium', x: -4.6, y: 2.3, z: 0.0, name: 'Bể Cá Vàng Mini', value: 3500000, isFragile: true }
    ]
  },

  // -----------------------------------------------------------------------
  // 2. BIỆT THỰ MA ÁM 3 PHÒNG (Mở rộng 32x22m: Phòng Khách - Đại Sảnh - Phòng Ngủ & WC)
  // -----------------------------------------------------------------------
  2: {
    id: 2,
    name: 'Biệt Thự Ma Ám',
    targetItems: 11,
    timeLimit: 110,
    parTime: 78,
    bonusObjective: 'no_fragile_break',
    bounds: { minX: -15, maxX: 15, minZ: -10, maxZ: 10 },
    spawns: [
      { x: -11.4, y: 0.1, z: 3.0 },
      { x: -9.4, y: 0.1, z: 3.0 }
    ],
    floorSize: { w: 32, d: 22 },
    floorColor: 0xc4b5fd,
    wallColor: 0xddd6fe,
    houseBounds: { minX: -13.4, maxX: 13.4, minZ: -8.6, maxZ: 2.0 },
    roads: [
      { x: 0, z: 6.8, w: 32.0, d: 5.4, lanes: 'x' }
    ],
    platforms: [
      { x: 9.8, y: 2.2, z: -5.4, w: 5.6, d: 5.2 }
    ],
    ramps: [
      { minX: 4.0, maxX: 7.0, minZ: -7.2, maxZ: -4.2, yStart: 0, yEnd: 2.2, axis: 'x', dir: 1 }
    ],
    walls: [
      // Outer shell (North, West, East)
      { x: 0, y: 1.6, z: -8.6, w: 27.2, h: 3.2, d: 0.4 },
      { x: -13.4, y: 1.6, z: -3.3, w: 0.4, h: 3.2, d: 11.0 },
      { x: 13.4, y: 1.6, z: -3.3, w: 0.4, h: 3.2, d: 11.0 },
      // South facade with Far-Left entrance, Glass at x=-3.3, and Shortcut Shutter at x=5.4
      { x: -7.2, y: 1.6, z: 2.0, w: 4.8, h: 3.2, d: 0.35 },
      { x: 0.8, y: 1.6, z: 2.0, w: 5.2, h: 3.2, d: 0.35 },
      { x: 10.4, y: 1.6, z: 2.0, w: 6.0, h: 3.2, d: 0.35 },
      // Multi-room interior dividers (West Lounge <-> Center Hall <-> East Bedroom/Bath)
      { x: -4.8, y: 1.4, z: -1.8, w: 0.35, h: 2.8, d: 6.6 },
      { x: 2.6, y: 1.4, z: -4.8, w: 0.35, h: 2.8, d: 6.6 }
    ],
    windows: [
      { id: 'w2_1', x: -3.3, y: 0, z: 2.0, w: 3.0, h: 2.8, d: 0.25, hp: 2, isBroken: false }
    ],
    switches: [
      { id: 'm2_plate', type: 'plate', x: -1.2, y: 0, z: 0.2, r: 0.85, holdSeconds: 2.5 },
      { id: 'm2_lever', type: 'lever', x: 9.2, y: 0, z: 0.6, holdSeconds: 10.0, cooldownSeconds: 1.0 }
    ],
    gates: [
      { id: 'm2_shutter', kind: 'door', x: 5.4, y: 0, z: 2.0, w: 4.0, h: 2.9, d: 0.35, switchIds: ['m2_plate', 'm2_lever'], speed: 2.8 }
    ],
    hazards: [
      { type: 'patrol', kind: 'ghost', speed: 2.8, loop: true, radius: 0.62, points: [[-10.8, -6.4], [-6.6, -6.4], [-6.6, -0.4], [-10.8, -0.4]] },
      { type: 'patrol', kind: 'ghost', speed: 3.1, loop: false, radius: 0.62, offset: 4.0, points: [[-2.4, -6.8], [-2.4, 0.2], [6.4, 0.2]] }
    ],
    trampolines: [
      { x: -7.6, y: 0, z: 3.8, r: 1.4 }
    ],
    truck: { x: 6.2, y: 0, z: 6.7, bedW: 4.2, bedD: 4.6, rotY: -Math.PI / 2 },
    items: [
      // West Lounge
      { type: 'dining_table', x: -9.2, y: 0, z: -2.6, name: 'Bàn Tiệc Cổ Điển', value: 16000000, isHeavy: true },
      { type: 'vase', x: -6.8, y: 0, z: -4.8, name: 'Bình Sứ Ma Ám', value: 14000000, isFragile: true },
      { type: 'sofa', x: -11.2, y: 0, z: -6.8, name: 'Sofa Nhung Đỏ', value: 18000000, isHeavy: true },
      { type: 'bookshelf', x: -11.2, y: 0, z: 0.2, name: 'Tủ Sách Mật Thất', value: 13500000, isHeavy: true },
      // Center Hall
      { type: 'piano', x: -1.4, y: 0, z: -5.8, name: 'Đại Dương Cầm Cổ', value: 48000000, isSuperHeavy: true },
      { type: 'console', x: -2.6, y: 0, z: -1.8, name: 'Máy Game Biệt Thự', value: 15000000, isFragile: true },
      // East Bedroom & Bath
      { type: 'toilet', x: 5.2, y: 0, z: -1.2, name: 'Bồn Cầu Sứ Vàng', value: 19000000, isFragile: true },
      { type: 'bed', x: 10.6, y: 0, z: -1.0, name: 'Giường Ngủ Hoàng Gia', value: 32000000, isHeavy: true },
      // Upper Loft
      { type: 'safe', x: 10.8, y: 2.2, z: -6.4, name: 'Két Bạc Gia Tộc', value: 65000000, isSuperHeavy: true },
      { type: 'statue', x: 8.2, y: 2.2, z: -6.6, name: 'Tượng Cú Đêm Vàng', value: 24000000, isFragile: true },
      { type: 'teddy', x: 9.6, y: 2.2, z: -4.0, name: 'Gấu Bông Tưng Tưng', value: 7500000, isBouncy: true }
    ]
  },

  // -----------------------------------------------------------------------
  // 3. ĐẠI LỘ GIỜ CAO ĐIỂM (Mở rộng 32x22m: 2 Cửa hàng nhiều gian + Đại lộ xe cộ)
  // -----------------------------------------------------------------------
  3: {
    id: 3,
    name: 'Đại Lộ Giờ Cao Điểm',
    targetItems: 13,
    timeLimit: 120,
    parTime: 86,
    bonusObjective: 'no_hazard_hit',
    bounds: { minX: -15, maxX: 15, minZ: -10, maxZ: 10 },
    spawns: [
      { x: -6.8, y: 0.1, z: -4.4 },
      { x: -6.8, y: 0.1, z: 4.4 }
    ],
    floorSize: { w: 32, d: 22 },
    houseZones: [
      { minX: -13.6, maxX: -4.0, minZ: -8.6, maxZ: -1.6, color: 0xfef3c7 },
      { minX: -13.6, maxX: -4.0, minZ: 1.6, maxZ: 8.6, color: 0xdbeafe }
    ],
    roads: [
      { x: 0.2, z: 0.0, w: 6.2, d: 20.6, lanes: 'z', crosswalk: 0.0 },
      { x: 10.6, z: 0.0, w: 6.0, d: 20.6 }
    ],
    platforms: [
      { x: -11.0, y: 2.2, z: -5.8, w: 4.6, d: 4.6 }
    ],
    ramps: [
      { minX: -8.7, maxX: -6.2, minZ: -7.2, maxZ: -4.6, yStart: 0, yEnd: 2.2, axis: 'x', dir: -1 }
    ],
    walls: [
      // North Showroom
      { x: -13.6, y: 1.5, z: -5.1, w: 0.35, h: 3.0, d: 7.2 },
      { x: -8.8, y: 1.5, z: -8.6, w: 9.9, h: 3.0, d: 0.35 },
      { x: -8.2, y: 1.4, z: -2.9, w: 0.35, h: 2.8, d: 2.4 },
      { x: -4.0, y: 0.5, z: -6.2, w: 0.35, h: 1.0, d: 3.4 },
      // South Tech Studio & Pet Lounge
      { x: -13.6, y: 1.5, z: 5.1, w: 0.35, h: 3.0, d: 7.2 },
      { x: -8.8, y: 1.5, z: 8.6, w: 9.9, h: 3.0, d: 0.35 },
      { x: -8.2, y: 1.4, z: 4.2, w: 0.35, h: 2.8, d: 2.8 }
    ],
    windows: [
      { id: 'w3_1', x: -4.0, y: 0, z: 5.2, w: 0.25, h: 2.6, d: 3.4, hp: 2, isBroken: false }
    ],
    switches: [
      { id: 'm3_traffic', type: 'lever', style: 'traffic', x: -4.0, y: 0, z: 0.0, holdSeconds: 6.0, cooldownSeconds: 3.5 }
    ],
    hazards: [
      { type: 'car', axis: 'z', lane: -1.3, dir: 1, from: -12, to: 12, speed: 6.4, offset: 2.0, color: 0xef4444, stopSwitchId: 'm3_traffic' },
      { type: 'car', axis: 'z', lane: 1.7, dir: -1, from: -12, to: 12, speed: 7.2, offset: 10.0, color: 0x3b82f6, stopSwitchId: 'm3_traffic' }
    ],
    trampolines: [
      { x: -4.4, y: 0, z: -2.6, r: 1.35 },
      { x: -4.4, y: 0, z: 2.4, r: 1.35 }
    ],
    truck: { x: 10.5, y: 0, z: 0.0, bedW: 4.4, bedD: 5.2, rotY: 0 },
    items: [
      // North Showroom
      { type: 'bed', x: -11.4, y: 0, z: -2.6, name: 'Giường Đôi Bắc Âu', value: 24000000, isHeavy: true },
      { type: 'bookshelf', x: -6.2, y: 0, z: -2.6, name: 'Kệ Sách Showroom', value: 14000000, isHeavy: true },
      { type: 'tv', x: -5.4, y: 0, z: -6.8, name: 'Màn Hình 8K', value: 45000000, isFragile: true },
      { type: 'safe', x: -11.8, y: 2.2, z: -6.8, name: 'Két Tiệm Vàng', value: 95000000, isSuperHeavy: true },
      { type: 'statue', x: -9.8, y: 2.2, z: -6.8, name: 'Tượng Mèo Chiêu Tài', value: 28000000, isFragile: true },
      { type: 'lamp', x: -11.6, y: 2.2, z: -4.4, name: 'Đèn Trang Trí Studio', value: 6500000 },
      // South Tech & Pet Lounge
      { type: 'pc', x: -11.8, y: 0, z: 3.0, name: 'Dàn PC Livestream', value: 55000000, isFragile: true },
      { type: 'fridge', x: -11.6, y: 0, z: 6.8, name: 'Tủ Mát Nước Ép', value: 22000000, isHeavy: true },
      { type: 'sofa', x: -6.2, y: 0, z: 6.8, name: 'Sofa Tiếp Khách', value: 28000000, isHeavy: true },
      { type: 'vase', x: -5.4, y: 0, z: 4.2, name: 'Bình Hoa Gốm Chu Đậu', value: 24000000, isFragile: true },
      { type: 'pet', x: -6.2, y: 0, z: 2.4, name: 'Cún Corgi Bỏ Trốn', value: 18000000, isLiving: true },
      { type: 'piano', x: -10.2, y: 0, z: 6.8, name: 'Piano Điện Concert', value: 60000000, isSuperHeavy: true },
      { type: 'yoga_ball', x: -9.8, y: 0, z: 2.8, name: 'Bóng Yoga Tưng Tưng', value: 8500000, isBouncy: true, isRolling: true }
    ]
  },

  // -----------------------------------------------------------------------
  // 4. NHÀ HÀNG BẾP LỬA 5 SAO (Mở rộng 32x22m: Kho bếp - Quầy Bar - Sảnh VIP)
  // -----------------------------------------------------------------------
  4: {
    id: 4,
    name: 'Nhà Hàng Bếp Lửa 5 Sao',
    targetItems: 13,
    timeLimit: 115,
    parTime: 84,
    bonusObjective: 'no_glass',
    bounds: { minX: -15, maxX: 15, minZ: -10, maxZ: 10 },
    spawns: [
      { x: -11.4, y: 0.1, z: -5.4 },
      { x: -11.6, y: 0.1, z: 4.8 }
    ],
    floorSize: { w: 32, d: 22 },
    floorColor: 0xfde68a,
    wallColor: 0xfef3c7,
    houseBounds: { minX: -13.6, maxX: 3.6, minZ: -8.4, maxZ: 8.4 },
    roads: [
      { x: 10.6, z: 0, w: 6.4, d: 20.4, lanes: 'z' }
    ],
    platforms: [],
    ramps: [],
    walls: [
      { x: -13.6, y: 1.6, z: 0, w: 0.4, h: 3.2, d: 17.2 },
      { x: -5.0, y: 1.6, z: -8.4, w: 17.6, h: 3.2, d: 0.4 },
      { x: -5.0, y: 1.6, z: 8.4, w: 17.6, h: 3.2, d: 0.4 },
      // Bar counter separating Kitchen & Dining (1.15m tall -> throw OVER it!)
      { x: -7.2, y: 0.58, z: 0.0, w: 10.6, h: 1.15, d: 0.55 },
      // Pantry partition in North Kitchen
      { x: -3.2, y: 1.5, z: -6.0, w: 0.35, h: 3.0, d: 4.4 },
      // Front pillars
      { x: 3.6, y: 1.6, z: -6.2, w: 0.35, h: 3.2, d: 4.4 },
      { x: 3.6, y: 1.6, z: 6.2, w: 0.35, h: 3.2, d: 4.4 }
    ],
    windows: [
      { id: 'w4_1', x: 3.6, y: 0, z: -2.0, w: 0.25, h: 2.8, d: 3.0, hp: 2, isBroken: false },
      { id: 'w4_2', x: 3.6, y: 0, z: 2.0, w: 0.25, h: 2.8, d: 3.0, hp: 2, isBroken: false }
    ],
    zones: [
      { type: 'slippery', minX: -12.4, maxX: 1.8, minZ: -7.4, maxZ: -1.4, y: 0 },
      { type: 'slippery', minX: -8.0, maxX: 2.2, minZ: 1.4, maxZ: 6.8, y: 0 }
    ],
    hazards: [
      { type: 'patrol', kind: 'chef', speed: 3.4, loop: false, radius: 0.62, points: [[-11.2, -3.2], [1.6, -3.2]] },
      { type: 'patrol', kind: 'cart', speed: 3.8, loop: true, radius: 0.68, points: [[-8.8, 2.4], [-0.4, 2.4], [-0.4, 6.0], [-8.8, 6.0]] }
    ],
    trampolines: [
      { x: 6.2, y: 0, z: -4.6, r: 1.5 },
      { x: 6.2, y: 0, z: 4.6, r: 1.5 }
    ],
    truck: { x: 10.6, y: 0, z: -0.4, bedW: 4.4, bedD: 5.0, rotY: 0 },
    items: [
      // Kitchen & Pantry
      { type: 'fridge', x: -11.6, y: 0, z: -6.8, name: 'Tủ Đông Hải Sản', value: 24000000, isHeavy: true },
      { type: 'stove', x: -8.4, y: 0, z: -6.8, name: 'Bếp Gas Công Nghiệp', value: 28000000, isHeavy: true },
      { type: 'aquarium', x: -5.4, y: 0, z: -6.8, name: 'Bể Tôm Hùm Alaska', value: 38000000, isFragile: true },
      { type: 'pot_soup', x: -0.8, y: 0, z: -6.6, name: 'Nồi Súp Sôi Khổng Lồ', value: 12000000 },
      { type: 'washer', x: -0.8, y: 0, z: -2.0, name: 'Máy Rửa Bát Tốc Độ', value: 22000000, isHeavy: true, isVibrating: true },
      { type: 'vase', x: -5.4, y: 0, z: -1.8, name: 'Bình Rượu Vang Đỏ', value: 22000000, isFragile: true },
      // VIP Dining Hall
      { type: 'piano', x: -11.6, y: 0, z: 6.6, name: 'Đàn Piano Sảnh Tiệc', value: 72000000, isSuperHeavy: true },
      { type: 'safe', x: -11.6, y: 0, z: 2.2, name: 'Két Thu Ngân Nhà Hàng', value: 52000000, isSuperHeavy: true },
      { type: 'dining_table', x: -5.8, y: 0, z: 4.2, name: 'Bàn Tiệc Hoàng Gia', value: 32000000, isHeavy: true },
      { type: 'sofa', x: -4.8, y: 0, z: 6.8, name: 'Ghế Băng VIP Da Đỏ', value: 26000000, isHeavy: true },
      { type: 'chair', x: -1.2, y: 0, z: 4.2, name: 'Ghế Bàn Tiệc Pháp', value: 4500000 },
      { type: 'tv', x: -8.6, y: 0, z: 4.2, name: 'Bảng Menu LED 4K', value: 21000000, isFragile: true },
      { type: 'pet', x: 1.2, y: 0, z: 6.2, name: 'Mèo Bếp Trưởng', value: 15000000, isLiving: true }
    ]
  },

  // -----------------------------------------------------------------------
  // 5. CÔNG TRƯỜNG THANG NÂNG & GIÓ MẠNH (Mở rộng 33x22m: 3 Tầng giàn giáo + Hố sâu)
  // -----------------------------------------------------------------------
  5: {
    id: 5,
    name: 'Công Trường Thang Nâng',
    targetItems: 14,
    timeLimit: 125,
    parTime: 92,
    bonusObjective: 'no_fragile_break',
    bounds: { minX: -15.5, maxX: 15.5, minZ: -10, maxZ: 10 },
    spawns: [
      { x: -9.4, y: 0.1, z: 0.0 },
      { x: -11.6, y: 2.5, z: -5.2 }
    ],
    floorSize: { w: 33, d: 22 },
    wallColor: 0xf59e0b,
    houseZones: [
      { minX: -14.0, maxX: -3.6, minZ: -8.4, maxZ: 8.4, color: 0x94a3b8 },
      { minX: 3.6, maxX: 7.4, minZ: -8.4, maxZ: 8.4, color: 0xcbd5e1 }
    ],
    roads: [
      { x: 11.0, z: 0, w: 6.2, d: 20.4, lanes: 'z' }
    ],
    platforms: [
      { x: -11.6, y: 2.4, z: -5.2, w: 4.6, d: 5.6 },
      { x: -11.6, y: 4.2, z: 5.2, w: 4.6, d: 5.6 }
    ],
    ramps: [],
    walls: [
      { x: -14.0, y: 2.4, z: 0, w: 0.4, h: 4.8, d: 17.2 },
      { x: -8.8, y: 2.4, z: -8.4, w: 10.8, h: 4.8, d: 0.4 },
      { x: -8.8, y: 2.4, z: 8.4, w: 10.8, h: 4.8, d: 0.4 },
      // Site office interior barrier
      { x: -5.4, y: 1.4, z: -2.2, w: 0.35, h: 2.8, d: 2.6 }
    ],
    windows: [],
    pits: [
      { minX: -3.6, maxX: 3.6, minZ: -8.2, maxZ: -1.6 },
      { minX: -3.6, maxX: 3.6, minZ: 1.6, maxZ: 8.2 }
    ],
    switches: [
      { id: 'm5_bridge', type: 'lever', x: -4.4, y: 0, z: -2.6, holdSeconds: 13.0, cooldownSeconds: 1.0 },
      { id: 'm5_fan_off', type: 'lever', x: -4.4, y: 0, z: 0.8, holdSeconds: 11.0, cooldownSeconds: 2.5 }
    ],
    gates: [
      { id: 'm5_bridge_gate', kind: 'bridge', x: 0.0, y: 0, z: -4.8, w: 7.6, d: 2.8, switchIds: ['m5_bridge'], speed: 3.0 }
    ],
    elevators: [
      { x: -7.4, z: -5.2, w: 2.8, d: 3.0, yMin: 0, yMax: 2.4, speed: 1.6, pauseSec: 1.4, offset: 0 },
      { x: -7.4, z: 5.2, w: 2.8, d: 3.0, yMin: 0, yMax: 4.2, speed: 1.85, pauseSec: 1.5, offset: 2.0 }
    ],
    zones: [
      { type: 'wind', minX: -3.8, maxX: 3.8, minZ: -7.8, maxZ: 7.8, yMin: -2, yMax: 8, fx: 0, fz: 5.8, fanX: 0.0, fanZ: -8.1, switchId: 'm5_fan_off', offWhenActive: true }
    ],
    trampolines: [
      { x: -4.8, y: 0, z: 1.2, r: 1.25 },
      { x: 5.5, y: 0, z: -4.8, r: 1.45 }
    ],
    truck: { x: 11.0, y: 0, z: 0.0, bedW: 4.4, bedD: 5.2, rotY: 0 },
    items: [
      // Ground staging yard
      { type: 'generator', x: -11.8, y: 0, z: -0.2, name: 'Máy Phát Điện Công Trường', value: 48000000, isSuperHeavy: true, isVibrating: true },
      { type: 'fridge', x: -9.8, y: 0, z: 1.2, name: 'Tủ Đồ Nghề Cơ Khí', value: 28000000, isHeavy: true },
      { type: 'drum', x: -6.8, y: 0, z: -0.6, name: 'Thùng Phuy Lăn Tròn', value: 11500000, isRolling: true },
      { type: 'toolbox', x: -11.8, y: 0, z: 7.0, name: 'Hộp Đồ Nghề Thép', value: 12000000 },
      { type: 'pc', x: -1.6, y: 0, z: 0.0, name: 'Trạm Điều Khiển Cẩu', value: 52000000, isFragile: true },
      { type: 'lamp', x: -8.2, y: 0, z: -2.4, name: 'Đèn Pha Công Trường', value: 8500000 },
      // Tier 2 Scaffold
      { type: 'sofa', x: -12.4, y: 2.4, z: -6.4, name: 'Băng Ghế Nghỉ Thợ', value: 14000000, isHeavy: true },
      { type: 'tv', x: -10.2, y: 2.4, z: -6.8, name: 'Màn Hình Bản Vẽ CAD', value: 32000000, isFragile: true },
      { type: 'toolbox', x: -10.2, y: 2.4, z: -3.6, name: 'Bộ Máy Khoan Bê Tông', value: 15000000 },
      { type: 'chair', x: -12.4, y: 2.4, z: -3.6, name: 'Ghế Kỹ Sư Trưởng', value: 5800000 },
      // Tier 3 Crane Deck
      { type: 'safe', x: -12.4, y: 4.2, z: 6.6, name: 'Két Hợp Đồng Dự Án', value: 95000000, isSuperHeavy: true },
      { type: 'statue', x: -10.2, y: 4.2, z: 6.6, name: 'Cúp Vàng An Toàn', value: 42000000, isFragile: true },
      { type: 'pc', x: -10.2, y: 4.2, z: 3.6, name: 'Laptop Đo Đạc Laser', value: 36000000, isFragile: true },
      { type: 'vase', x: -12.4, y: 4.2, z: 3.6, name: 'Bình Đo Áp Suất Kính', value: 19000000, isFragile: true }
    ]
  },

  // -----------------------------------------------------------------------
  // 6. ĐẠI KHO BĂNG CHUYỀN HỖN LOẠN (Mở rộng 34x23m: 3 Phân khu + Băng chuyền + Cầu)
  // -----------------------------------------------------------------------
  6: {
    id: 6,
    name: 'Đại Kho Băng Chuyền',
    targetItems: 16,
    timeLimit: 135,
    parTime: 98,
    bonusObjective: 'no_any_damage',
    bounds: { minX: -16.0, maxX: 16.0, minZ: -10.5, maxZ: 10.5 },
    spawns: [
      { x: -12.2, y: 0.1, z: -0.6 },
      { x: -12.2, y: 0.1, z: 0.8 }
    ],
    floorSize: { w: 34, d: 23 },
    floorColor: 0xcbd5e1,
    wallColor: 0x94a3b8,
    houseBounds: { minX: -14.2, maxX: 3.2, minZ: -8.8, maxZ: 8.8 },
    roads: [
      { x: 11.4, z: 0, w: 6.6, d: 21.4, lanes: 'z' }
    ],
    platforms: [
      { x: -9.8, y: 2.3, z: 0.0, w: 4.6, d: 4.2 }
    ],
    ramps: [
      { minX: -7.5, maxX: -4.6, minZ: -1.4, maxZ: 1.4, yStart: 0, yEnd: 2.3, axis: 'x', dir: -1 }
    ],
    walls: [
      { x: -14.2, y: 2.0, z: 0, w: 0.45, h: 4.0, d: 18.0 },
      { x: -5.5, y: 2.0, z: -8.8, w: 17.8, h: 4.0, d: 0.45 },
      { x: -5.5, y: 2.0, z: 8.8, w: 17.8, h: 4.0, d: 0.45 },
      // Wing dividers inside warehouse (North & South vaults)
      { x: -4.2, y: 1.5, z: -7.4, w: 0.35, h: 3.0, d: 2.4 },
      { x: -4.2, y: 1.5, z: 7.4, w: 0.35, h: 3.0, d: 2.4 },
      // East warehouse partition with Glass center, North Conveyor mouth & Lower Shutter
      { x: 3.2, y: 1.6, z: -7.4, w: 0.35, h: 3.2, d: 2.8 },
      { x: 3.2, y: 1.6, z: -1.6, w: 0.35, h: 3.2, d: 2.4 },
      { x: 3.2, y: 1.6, z: 7.7, w: 0.35, h: 3.2, d: 2.2 }
    ],
    windows: [
      { id: 'w6_1', x: 3.2, y: 0, z: 1.3, w: 0.25, h: 2.8, d: 3.0, hp: 2, isBroken: false }
    ],
    pits: [
      { minX: 3.8, maxX: 7.4, minZ: -2.4, maxZ: 2.4 }
    ],
    switches: [
      { id: 'm6_reverse', type: 'lever', x: -2.8, y: 0, z: -2.0, cooldownSeconds: 0.6 },
      { id: 'm6_plate', type: 'plate', x: 1.8, y: 0, z: 0.0, r: 0.85, holdSeconds: 4.5 }
    ],
    gates: [
      { id: 'm6_shutter', kind: 'door', x: 3.2, y: 0, z: 4.8, w: 0.35, h: 3.0, d: 3.2, switchIds: ['m6_plate'], speed: 2.8 },
      { id: 'm6_bridge', kind: 'bridge', x: 5.6, y: 0, z: 0.0, w: 3.8, d: 4.4, switchIds: ['m6_plate'], speed: 2.8 }
    ],
    zones: [
      { type: 'conveyor', minX: -12.4, maxX: 2.8, minZ: -6.0, maxZ: -3.2, y: 0, vx: -3.6, vz: 0, switchId: 'm6_reverse', flipWhenActive: true },
      { type: 'conveyor', minX: -12.4, maxX: 2.8, minZ: 3.2, maxZ: 6.0, y: 0, vx: 3.4, vz: 0 }
    ],
    hazards: [
      { type: 'patrol', kind: 'robot', speed: 3.6, loop: true, radius: 0.62, points: [[-3.2, -1.8], [1.6, -1.8], [1.6, 1.8], [-3.2, 1.8]] }
    ],
    trampolines: [
      { x: 5.6, y: 0, z: -5.2, r: 1.55 },
      { x: 5.6, y: 0, z: 5.2, r: 1.55 }
    ],
    truck: { x: 11.4, y: 0, z: 0.0, bedW: 4.6, bedD: 5.6, rotY: 0 },
    items: [
      // North Wing
      { type: 'piano', x: -11.2, y: 0, z: -4.6, name: 'Đại Dương Cầm VIP', value: 90000000, isSuperHeavy: true },
      { type: 'safe', x: -7.2, y: 0, z: -4.6, name: 'Két Ngân Hàng', value: 150000000, isSuperHeavy: true },
      { type: 'pc', x: -1.4, y: 0, z: -7.2, name: 'Server AI Cluster', value: 110000000, isFragile: true },
      { type: 'statue', x: -7.6, y: 0, z: -7.2, name: 'Tượng Rồng Vàng', value: 72000000, isFragile: true },
      { type: 'vase', x: 1.0, y: 0, z: -7.2, name: 'Bình Ngọc Hoàng Gia', value: 88000000, isFragile: true },
      // Central Mezzanine & Floor
      { type: 'drum', x: -2.4, y: 0, z: 0.5, name: 'Thùng Phuy Hóa Chất', value: 22000000, isRolling: true },
      { type: 'pet', x: -1.0, y: 0, z: 2.0, name: 'Mèo Máy Turbo', value: 28000000, isLiving: true },
      { type: 'sofa', x: -10.2, y: 2.3, z: -1.0, name: 'Bộ Sofa Tiếp Khách', value: 44000000, isHeavy: true },
      { type: 'pc', x: -8.6, y: 2.3, z: 1.2, name: 'Bộ RTX 5090 Ti', value: 125000000, isFragile: true },
      { type: 'treasure', x: -11.2, y: 2.3, z: 1.2, name: 'Rương Vàng Kho Báu', value: 75000000 },
      { type: 'bookshelf', x: -8.6, y: 2.3, z: -1.2, name: 'Tủ Hồ Sơ Mật', value: 28000000, isHeavy: true },
      // South Wing
      { type: 'fridge', x: -11.2, y: 0, z: 4.6, name: 'Tủ Lạnh Công Nghiệp', value: 35000000, isHeavy: true },
      { type: 'briefcase', x: -7.2, y: 0, z: 4.6, name: 'Vali Đô La Mỹ', value: 65000000 },
      { type: 'aquarium', x: -11.2, y: 0, z: 7.2, name: 'Hồ Cá Koi Nhật', value: 48000000, isFragile: true },
      { type: 'tv', x: -2.0, y: 0, z: 7.2, name: 'Màn Hình Rạp 100"', value: 78000000, isFragile: true },
      { type: 'yoga_ball', x: 0.8, y: 0, z: 7.2, name: 'Bóng Yoga Khổng Lồ', value: 24000000, isBouncy: true, isRolling: true }
    ]
  }
};
