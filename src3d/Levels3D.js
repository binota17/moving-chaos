// =========================================================================
// 2.5D ISOMETRIC 3D LEVEL DEFINITIONS — 12 ARCHITECTURAL MULTI-ROOM MAPS
// Every level models a distinct real building/venue with interior partition
// walls, open doorway frames, per-room floor finishes, rugs & built-in fixtures.
// World coordinates in meters: X (Left/Right), Y (Up), Z (Depth)
// =========================================================================

export const LEVELS_3D = {
  // -----------------------------------------------------------------------
  // CHAPTER 1: KHU PHỐ NẮNG (Levels 1 - 4)
  // -----------------------------------------------------------------------
  1: {
    id: 1,
    chapter: 1,
    name: 'Nhà Phố Khởi Động',
    targetItems: 8,
    timeLimit: 85,
    parTime: 58,
    bonusObjective: 'no_glass',
    bounds: { minX: -12, maxX: 12, minZ: -8, maxZ: 8 },
    spawns: [
      { x: 0.0, y: 0.1, z: 2.6 },
      { x: -2.4, y: 0.1, z: 1.4 },
      { x: -5.6, y: 0.1, z: -1.2 },
      { x: 3.2, y: 0.1, z: 2.6 }
    ],
    floorSize: { w: 26, d: 18 },
    houseBounds: { minX: -9.8, maxX: 1.8, minZ: -6.0, maxZ: 6.0 },
    rooms: [
      { name: 'Kitchen NW', minX: -9.8, maxX: -4.2, minZ: -6.0, maxZ: 0.0, style: 'bistro_tile', color: '#f8fafc' },
      { name: 'Bath & Laundry SW', minX: -9.8, maxX: -4.2, minZ: 0.0, maxZ: 6.0, style: 'bath_tile', color: '#7dd3c0' },
      {
        name: 'Study & Game NE',
        minX: -4.2,
        maxX: 1.8,
        minZ: -6.0,
        maxZ: -0.2,
        style: 'parquet_lavender',
        color: '#c4b5fd',
        rug: { x: -1.2, z: -3.0, w: 2.8, d: 1.8, color: '#fef3c7', stripe: '#a78bfa' }
      },
      {
        name: 'Living Room SE',
        minX: -4.2,
        maxX: 1.8,
        minZ: -0.2,
        maxZ: 6.0,
        style: 'polka_pink',
        color: '#f47b8c',
        rug: { x: -1.2, z: 2.9, w: 3.2, d: 2.1, color: '#fde2c4', stripe: '#f8a488' }
      }
    ],
    doors: [
      { x: -5.65, z: 0.0, dir: 'x', width: 2.8, swingDir: 1, doorColor: 0x854d27 },
      { x: -4.2, z: -2.9, dir: 'z', width: 2.8, swingDir: 1, doorColor: 0x854d27 },
      { x: -4.2, z: 2.7, dir: 'z', width: 2.8, swingDir: -1, doorColor: 0x854d27 },
      { x: -2.7, z: -0.2, dir: 'x', width: 2.8, swingDir: 1, doorColor: 0x854d27 },
      { x: 1.8, z: 2.7, dir: 'z', width: 3.0, swingDir: -1, doorColor: 0x7c3f1d }
    ],
    fixtures: [
      { type: 'kitchen_counter', x: -7.6, z: -5.3, w: 3.4, d: 0.9, h: 0.98 },
      { type: 'kitchen_island', x: -7.2, z: -2.5, w: 2.1, d: 0.95, h: 0.94 },
      { type: 'bathtub', x: -8.6, z: 4.9, w: 1.85, d: 0.98, h: 0.72 },
      { type: 'vanity_sink', x: -6.2, z: 5.3, w: 1.5, d: 0.72, h: 0.96 },
      { type: 'control_desk', x: -1.3, z: -5.2, w: 2.1, d: 0.85, h: 0.92 },
      { type: 'coffee_table', x: -1.2, z: 2.9, w: 1.35, d: 0.82, h: 0.46 },
      { type: 'potted_plant', x: -3.5, z: 5.2 },
      { type: 'potted_plant', x: 1.1, z: 5.2 },
      { type: 'wall_art', x: -0.5, z: -5.72, variant: 0 }
    ],
    roads: [
      { x: 8.4, z: 0, w: 6.4, d: 17.0, lanes: 'z' }
    ],
    platforms: [],
    ramps: [],
    walls: [
      // Exterior brick perimeter
      { x: -9.8, y: 1.5, z: 0, w: 0.4, h: 3.0, d: 12.4 },
      { x: -4.0, y: 1.5, z: -6.0, w: 12.0, h: 3.0, d: 0.4 },
      { x: -4.0, y: 1.5, z: 6.0, w: 12.0, h: 3.0, d: 0.4 },
      { x: 1.8, y: 1.5, z: -5.0, w: 0.35, h: 3.0, d: 2.2 },
      { x: 1.8, y: 1.5, z: 0.15, w: 0.35, h: 3.0, d: 2.1 },
      { x: 1.8, y: 1.5, z: 5.1, w: 0.35, h: 3.0, d: 2.0 },
      // Interior painted room partitions
      { x: -8.5, y: 1.4, z: 0.0, w: 2.6, h: 2.8, d: 0.3, isInterior: true, wallHex: '#93c5fd' },
      { x: -4.2, y: 1.4, z: -5.15, w: 0.3, h: 2.8, d: 1.7, isInterior: true, wallHex: '#93c5fd' },
      { x: -4.2, y: 1.4, z: -0.1, w: 0.3, h: 2.8, d: 2.8, isInterior: true, wallHex: '#93c5fd' },
      { x: -4.2, y: 1.4, z: 5.05, w: 0.3, h: 2.8, d: 1.9, isInterior: true, wallHex: '#93c5fd' },
      { x: 0.3, y: 1.4, z: -0.2, w: 3.0, h: 2.8, d: 0.3, isInterior: true, wallHex: '#fcd34d' },
      // Low front yard picket fence: walk around OR throw lighter items OVER it!
      { x: 3.4, y: 0.55, z: -2.6, w: 0.25, h: 1.1, d: 4.4 }
    ],
    windows: [
      { id: 'w1_1', x: 1.8, y: 0, z: -2.4, w: 0.25, h: 2.8, d: 3.0, hp: 2, isBroken: false }
    ],
    trampolines: [
      { x: 4.6, y: 0, z: 3.4, r: 1.5 }
    ],
    truck: { x: 8.4, y: 0, z: -0.5, bedW: 4.2, bedD: 4.6, rotY: 0 },
    items: [
      { type: 'box', x: -5.2, y: 0, z: -4.2, name: 'Thùng Quần Áo', value: 500000 },
      { type: 'chair', x: -1.4, y: 0, z: -3.5, name: 'Ghế Gỗ Sồi', value: 800000 },
      { type: 'tv', x: 0.5, y: 0, z: 1.1, name: 'Tivi Màn Hình Cong', value: 15000000, isFragile: true },
      { type: 'console', x: 0.5, y: 0, z: -4.6, name: 'Máy Game Retro', value: 6500000, isFragile: true },
      { type: 'pet', x: 0.5, y: 0, z: 4.4, name: 'Mèo Mướp Siêu Quậy', value: 4500000, isLiving: true },
      { type: 'sofa', x: -1.2, y: 0, z: 4.6, name: 'Sofa Da Bò', value: 12000000, isHeavy: true },
      { type: 'washer', x: -7.8, y: 0, z: 1.9, name: 'Máy Giặt Rung Lắc', value: 8200000, isHeavy: true, isVibrating: true },
      { type: 'aquarium', x: -3.1, y: 0, z: -4.6, name: 'Bể Cá Vàng Mini', value: 3500000, isFragile: true }
    ]
  },

  2: {
    id: 2,
    chapter: 1,
    name: 'Biệt Thự Ma Ám',
    targetItems: 11,
    timeLimit: 110,
    parTime: 78,
    bonusObjective: 'no_fragile_break',
    bounds: { minX: -15, maxX: 15, minZ: -10, maxZ: 10 },
    spawns: [
      { x: -11.4, y: 0.1, z: 3.0 },
      { x: -9.4, y: 0.1, z: 3.0 },
      { x: -7.4, y: 0.1, z: 3.0 },
      { x: -5.4, y: 0.1, z: 3.0 }
    ],
    floorSize: { w: 32, d: 22 },
    floorColor: 0xc4b5fd,
    wallColor: 0xddd6fe,
    houseBounds: { minX: -13.4, maxX: 13.4, minZ: -8.6, maxZ: 2.0 },
    rooms: [
      {
        name: 'West Banquet Hall',
        minX: -13.4,
        maxX: -4.8,
        minZ: -8.6,
        maxZ: 2.0,
        style: 'parquet_lavender',
        color: '#d8b4fe',
        rug: { x: -9.2, z: -2.6, w: 3.8, d: 2.6, color: '#fef3c7', stripe: '#f87171' }
      },
      {
        name: 'Center Marble Foyer',
        minX: -4.8,
        maxX: 2.6,
        minZ: -8.6,
        maxZ: 2.0,
        style: 'bistro_tile',
        color: '#f1f5f9',
        rug: { x: -1.1, z: -4.6, w: 3.2, d: 2.4, color: '#e9d5ff', stripe: '#a855f7' }
      },
      {
        name: 'Attic Ramp Hall',
        minX: 2.6,
        maxX: 13.4,
        minZ: -8.6,
        maxZ: -2.8,
        style: 'polka_blue',
        color: '#93c5fd'
      },
      {
        name: 'Locked Haunted Bath',
        minX: 2.6,
        maxX: 8.0,
        minZ: -2.8,
        maxZ: 2.0,
        style: 'bath_tile',
        color: '#5eead4'
      },
      {
        name: 'East Master Suite',
        minX: 8.0,
        maxX: 13.4,
        minZ: -2.8,
        maxZ: 2.0,
        style: 'parquet_lavender',
        color: '#c4b5fd',
        rug: { x: 10.6, z: -0.6, w: 2.6, d: 2.0, color: '#fce7f3', stripe: '#ec4899' }
      }
    ],
    doors: [
      { x: -11.4, z: 2.0, dir: 'x', width: 3.4, swingDir: -1, doorColor: 0x6b3b1b },
      { x: -4.8, z: -0.1, dir: 'z', width: 3.2, swingDir: 1, doorColor: 0x6b3b1b },
      { x: 2.6, z: -0.4, dir: 'z', width: 3.0, swingDir: -1, doorColor: 0x6b3b1b },
      { x: 8.0, z: -0.4, dir: 'z', width: 2.8, swingDir: 1, doorColor: 0x6b3b1b }
    ],
    fixtures: [
      { type: 'coffee_table', x: -9.2, z: -5.2, w: 1.35, d: 0.82, h: 0.46 },
      { type: 'bathtub', x: 4.5, z: -1.9, w: 1.75, d: 0.92, h: 0.72 },
      { type: 'vanity_sink', x: 6.7, z: -2.0, w: 1.4, d: 0.7, h: 0.96 },
      { type: 'wardrobe', x: 12.2, z: -1.9, w: 1.5, d: 0.72, h: 2.15 },
      { type: 'nightstand', x: 12.4, z: 1.1, w: 0.7, d: 0.65, h: 0.65 },
      { type: 'potted_plant', x: -12.6, z: -7.8 },
      { type: 'potted_plant', x: 1.6, z: -7.8 },
      { type: 'wall_art', x: -9.2, z: -8.32, variant: 3 }
    ],
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
      { x: 0, y: 1.6, z: -8.6, w: 27.2, h: 3.2, d: 0.4 },
      { x: -13.4, y: 1.6, z: -3.3, w: 0.4, h: 3.2, d: 11.0 },
      { x: 13.4, y: 1.6, z: -3.3, w: 0.4, h: 3.2, d: 11.0 },
      { x: -7.2, y: 1.6, z: 2.0, w: 4.8, h: 3.2, d: 0.35 },
      { x: 0.8, y: 1.6, z: 2.0, w: 5.2, h: 3.2, d: 0.35 },
      { x: 10.4, y: 1.6, z: 2.0, w: 6.0, h: 3.2, d: 0.35 },
      // Interior painted partition walls
      { x: -4.8, y: 1.4, z: -5.3, w: 0.35, h: 2.8, d: 6.6, isInterior: true, wallHex: '#ddd6fe' },
      { x: 2.6, y: 1.4, z: -5.3, w: 0.35, h: 2.8, d: 6.6, isInterior: true, wallHex: '#ddd6fe' },
      { x: 5.3, y: 1.4, z: -2.8, w: 5.2, h: 2.8, d: 0.3, isInterior: true, wallHex: '#99f6e4' },
      { x: 8.0, y: 1.4, z: 1.4, w: 0.32, h: 2.8, d: 1.1, isInterior: true, wallHex: '#99f6e4' }
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
      { type: 'dining_table', x: -9.2, y: 0, z: -2.6, name: 'Bàn Tiệc Cổ Điển', value: 16000000, isHeavy: true },
      { type: 'vase', x: -6.8, y: 0, z: -4.8, name: 'Bình Sứ Ma Ám', value: 14000000, isFragile: true },
      { type: 'sofa', x: -11.2, y: 0, z: -6.8, name: 'Sofa Nhung Đỏ', value: 18000000, isHeavy: true },
      { type: 'bookshelf', x: -11.2, y: 0, z: 0.2, name: 'Tủ Sách Mật Thất', value: 13500000, isHeavy: true },
      { type: 'piano', x: -1.4, y: 0, z: -6.4, name: 'Đại Dương Cầm Cổ', value: 48000000, isSuperHeavy: true },
      { type: 'console', x: -2.6, y: 0, z: -1.8, name: 'Máy Game Biệt Thự', value: 15000000, isFragile: true },
      { type: 'toilet', x: 5.3, y: 0, z: -0.2, name: 'Bồn Cầu Sứ Vàng', value: 19000000, isFragile: true },
      { type: 'bed', x: 10.2, y: 0, z: -0.8, name: 'Giường Ngủ Hoàng Gia', value: 32000000, isHeavy: true },
      { type: 'safe', x: 10.8, y: 2.2, z: -6.4, name: 'Két Bạc Gia Tộc', value: 65000000, isSuperHeavy: true },
      { type: 'statue', x: 8.2, y: 2.2, z: -6.6, name: 'Tượng Cú Đêm Vàng', value: 24000000, isFragile: true },
      { type: 'teddy', x: 9.6, y: 2.2, z: -4.0, name: 'Gấu Bông Tưng Tưng', value: 7500000, isBouncy: true }
    ]
  },

  3: {
    id: 3,
    chapter: 1,
    name: 'Đại Lộ Giờ Cao Điểm',
    targetItems: 13,
    timeLimit: 120,
    parTime: 86,
    bonusObjective: 'no_hazard_hit',
    bounds: { minX: -15, maxX: 15, minZ: -10, maxZ: 10 },
    spawns: [
      { x: -6.8, y: 0.1, z: -4.4 },
      { x: -6.8, y: 0.1, z: 3.6 },
      { x: -5.4, y: 0.1, z: -4.4 },
      { x: -4.9, y: 0.1, z: 4.9 }
    ],
    floorSize: { w: 32, d: 22 },
    houseZones: [
      { minX: -13.6, maxX: -4.0, minZ: -8.6, maxZ: -1.6, color: 0xfef3c7 },
      { minX: -13.6, maxX: -4.0, minZ: 1.6, maxZ: 8.6, color: 0xdbeafe }
    ],
    rooms: [
      { name: 'Showroom Vault & Display', minX: -13.6, maxX: -8.2, minZ: -8.6, maxZ: -1.6, style: 'parquet_lavender', color: '#fde68a' },
      { name: 'Showroom Front Counter', minX: -8.2, maxX: -4.0, minZ: -8.6, maxZ: -1.6, style: 'polka_blue', color: '#bae6fd' },
      { name: 'Cyber Streaming Corner', minX: -13.6, maxX: -8.2, minZ: 1.6, maxZ: 8.6, style: 'bistro_tile', color: '#e0f2fe' },
      {
        name: 'Acoustic Coffee Lounge',
        minX: -8.2,
        maxX: -4.0,
        minZ: 1.6,
        maxZ: 8.6,
        style: 'polka_pink',
        color: '#fbcfe8',
        rug: { x: -6.0, z: 5.0, w: 2.6, d: 1.9, color: '#fef3c7', stripe: '#60a5fa' }
      }
    ],
    doors: [
      { x: -4.0, z: -3.1, dir: 'z', width: 2.8, swingDir: 1, doorColor: 0x854d27 },
      { x: -4.0, z: 2.6, dir: 'z', width: 2.6, swingDir: -1, doorColor: 0x854d27 },
      { x: -8.2, z: -5.5, dir: 'z', width: 2.8, swingDir: -1, doorColor: 0x854d27 },
      { x: -8.2, z: 7.1, dir: 'z', width: 2.8, swingDir: 1, doorColor: 0x854d27 }
    ],
    fixtures: [
      { type: 'checkout_counter', x: -4.6, z: -6.4, w: 0.72, d: 2.2, h: 1.02 },
      { type: 'wardrobe', x: -12.8, z: -7.8, w: 1.3, d: 0.72, h: 2.1 },
      { type: 'control_desk', x: -11.4, z: 4.9, w: 1.9, d: 0.82, h: 0.92 },
      { type: 'coffee_table', x: -6.1, z: 5.4, w: 1.15, d: 0.72, h: 0.46 },
      { type: 'potted_plant', x: -4.6, z: 7.8 },
      { type: 'potted_plant', x: -4.6, z: -8.0 },
      { type: 'wall_art', x: -6.2, z: -8.32, variant: 1 }
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
      // North building (Furniture & Jewelry Showroom)
      { x: -13.6, y: 1.5, z: -5.1, w: 0.35, h: 3.0, d: 7.2 },
      { x: -8.8, y: 1.5, z: -8.6, w: 9.9, h: 3.0, d: 0.35 },
      { x: -8.2, y: 1.4, z: -2.9, w: 0.32, h: 2.8, d: 2.4, isInterior: true, wallHex: '#fef08a' },
      // South building (Cyber & Acoustic Lounge)
      { x: -13.6, y: 1.5, z: 5.1, w: 0.35, h: 3.0, d: 7.2 },
      { x: -8.8, y: 1.5, z: 8.6, w: 9.9, h: 3.0, d: 0.35 },
      { x: -8.2, y: 1.4, z: 4.2, w: 0.32, h: 2.8, d: 2.8, isInterior: true, wallHex: '#bfdbfe' }
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
      { type: 'bed', x: -11.4, y: 0, z: -2.6, name: 'Giường Đôi Bắc Âu', value: 24000000, isHeavy: true },
      { type: 'bookshelf', x: -6.4, y: 0, z: -2.6, name: 'Kệ Sách Showroom', value: 14000000, isHeavy: true },
      { type: 'tv', x: -6.0, y: 0, z: -6.8, name: 'Màn Hình 8K', value: 45000000, isFragile: true },
      { type: 'safe', x: -11.8, y: 2.2, z: -6.8, name: 'Két Tiệm Vàng', value: 95000000, isSuperHeavy: true },
      { type: 'statue', x: -9.8, y: 2.2, z: -6.8, name: 'Tượng Mèo Chiêu Tài', value: 28000000, isFragile: true },
      { type: 'lamp', x: -11.6, y: 2.2, z: -4.4, name: 'Đèn Trang Trí Studio', value: 6500000 },
      { type: 'pc', x: -11.8, y: 0, z: 3.0, name: 'Dàn PC Livestream', value: 55000000, isFragile: true },
      { type: 'fridge', x: -12.0, y: 0, z: 7.0, name: 'Tủ Mát Nước Ép', value: 22000000, isHeavy: true },
      { type: 'sofa', x: -6.2, y: 0, z: 7.0, name: 'Sofa Tiếp Khách', value: 28000000, isHeavy: true },
      { type: 'vase', x: -5.4, y: 0, z: 3.4, name: 'Bình Hoa Gốm Chu Đậu', value: 24000000, isFragile: true },
      { type: 'pet', x: -6.2, y: 0, z: 2.2, name: 'Cún Corgi Bỏ Trốn', value: 18000000, isLiving: true },
      { type: 'piano', x: -10.0, y: 0, z: 7.0, name: 'Piano Điện Concert', value: 60000000, isSuperHeavy: true },
      { type: 'yoga_ball', x: -9.6, y: 0, z: 2.8, name: 'Bóng Yoga Tưng Tưng', value: 8500000, isBouncy: true, isRolling: true }
    ]
  },

  4: {
    id: 4,
    chapter: 1,
    name: 'Nhà Hàng Bếp Lửa 5 Sao',
    targetItems: 13,
    timeLimit: 115,
    parTime: 84,
    bonusObjective: 'no_glass',
    bounds: { minX: -15, maxX: 15, minZ: -10, maxZ: 10 },
    spawns: [
      { x: -11.4, y: 0.1, z: -5.0 },
      { x: -11.4, y: 0.1, z: 4.4 },
      { x: -9.6, y: 0.1, z: -4.8 },
      { x: -9.6, y: 0.1, z: 4.4 }
    ],
    floorSize: { w: 32, d: 22 },
    floorColor: 0xfde68a,
    wallColor: 0xfef3c7,
    houseBounds: { minX: -13.6, maxX: 3.6, minZ: -8.4, maxZ: 8.4 },
    rooms: [
      { name: 'Prep Kitchen NW', minX: -13.6, maxX: -3.2, minZ: -8.4, maxZ: 0.0, style: 'bistro_tile', color: '#f8fafc' },
      { name: 'Scullery & Pass NE', minX: -3.2, maxX: 3.6, minZ: -8.4, maxZ: 0.0, style: 'bath_tile', color: '#fef9c3' },
      {
        name: 'VIP Dining Room South',
        minX: -13.6,
        maxX: 3.6,
        minZ: 0.0,
        maxZ: 8.4,
        style: 'parquet_lavender',
        color: '#fde68a',
        rug: { x: -5.6, z: 4.2, w: 4.4, d: 2.8, color: '#fee2e2', stripe: '#ef4444' }
      }
    ],
    doors: [
      { x: -3.2, z: -2.0, dir: 'z', width: 2.8, swingDir: 1, doorColor: 0x854d27 },
      { x: 0.4, z: 0.0, dir: 'x', width: 3.4, swingDir: -1, doorColor: 0x854d27 },
      { x: 3.6, z: 0.0, dir: 'z', width: 3.5, swingDir: -1, doorColor: 0x7c3f1d }
    ],
    fixtures: [
      { type: 'kitchen_counter', x: -10.0, z: 0.0, w: 4.6, d: 0.72, h: 0.98 },
      { type: 'kitchen_counter', x: -4.6, z: 0.0, w: 4.4, d: 0.72, h: 0.98 },
      { type: 'kitchen_island', x: 0.5, z: -4.5, w: 2.0, d: 0.9, h: 0.94 },
      { type: 'restaurant_table', x: -8.4, z: 2.5, w: 1.2, d: 1.2, h: 0.82 },
      { type: 'restaurant_table', x: -2.8, z: 4.2, w: 1.2, d: 1.2, h: 0.82 },
      { type: 'potted_plant', x: 2.8, z: 7.4 },
      { type: 'potted_plant', x: 2.8, z: -7.4 },
      { type: 'wall_art', x: -6.0, z: -8.12, variant: 2 }
    ],
    roads: [
      { x: 10.6, z: 0, w: 6.4, d: 20.4, lanes: 'z' }
    ],
    platforms: [],
    ramps: [],
    walls: [
      { x: -13.6, y: 1.6, z: 0, w: 0.4, h: 3.2, d: 17.2 },
      { x: -5.0, y: 1.6, z: -8.4, w: 17.6, h: 3.2, d: 0.4 },
      { x: -5.0, y: 1.6, z: 8.4, w: 17.6, h: 3.2, d: 0.4 },
      // Interior Prep/Scullery partition wall
      { x: -3.2, y: 1.4, z: -6.0, w: 0.35, h: 2.8, d: 4.4, isInterior: true, wallHex: '#fef08a' },
      // Front restaurant pillars leaving 3.5m doorway (-1.75..1.75)
      { x: 3.6, y: 1.6, z: -6.4, w: 0.35, h: 3.2, d: 4.0 },
      { x: 3.6, y: 1.6, z: 6.4, w: 0.35, h: 3.2, d: 4.0 }
    ],
    windows: [
      { id: 'w4_1', x: 3.6, y: 0, z: -3.0, w: 0.25, h: 2.8, d: 2.5, hp: 2, isBroken: false },
      { id: 'w4_2', x: 3.6, y: 0, z: 3.0, w: 0.25, h: 2.8, d: 2.5, hp: 2, isBroken: false }
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
      { type: 'fridge', x: -11.6, y: 0, z: -6.8, name: 'Tủ Đông Hải Sản', value: 24000000, isHeavy: true },
      { type: 'stove', x: -8.4, y: 0, z: -6.8, name: 'Bếp Gas Công Nghiệp', value: 28000000, isHeavy: true },
      { type: 'aquarium', x: -5.4, y: 0, z: -6.8, name: 'Bể Tôm Hùm Alaska', value: 38000000, isFragile: true },
      { type: 'pot_soup', x: -0.8, y: 0, z: -6.6, name: 'Nồi Súp Sôi Khổng Lồ', value: 12000000 },
      { type: 'washer', x: -0.8, y: 0, z: -2.0, name: 'Máy Rửa Bát Tốc Độ', value: 22000000, isHeavy: true, isVibrating: true },
      { type: 'vase', x: -5.4, y: 0, z: -1.8, name: 'Bình Rượu Vang Đỏ', value: 22000000, isFragile: true },
      { type: 'piano', x: -11.6, y: 0, z: 6.6, name: 'Đàn Piano Sảnh Tiệc', value: 72000000, isSuperHeavy: true },
      { type: 'safe', x: -11.6, y: 0, z: 2.2, name: 'Két Thu Ngân Nhà Hàng', value: 52000000, isSuperHeavy: true },
      { type: 'dining_table', x: -5.8, y: 0, z: 4.2, name: 'Bàn Tiệc Hoàng Gia', value: 32000000, isHeavy: true },
      { type: 'sofa', x: -4.8, y: 0, z: 6.8, name: 'Ghế Băng VIP Da Đỏ', value: 26000000, isHeavy: true },
      { type: 'chair', x: -1.0, y: 0, z: 4.2, name: 'Ghế Bàn Tiệc Pháp', value: 4500000 },
      { type: 'tv', x: -8.6, y: 0, z: 4.6, name: 'Bảng Menu LED 4K', value: 21000000, isFragile: true },
      { type: 'pet', x: 1.2, y: 0, z: 6.2, name: 'Mèo Bếp Trưởng', value: 15000000, isLiving: true }
    ]
  },

  // -----------------------------------------------------------------------
  // CHAPTER 2: CÔNG TRƯỜNG & THƯƠNG MẠI (Levels 5 - 8)
  // -----------------------------------------------------------------------
  5: {
    id: 5,
    chapter: 2,
    name: 'Công Trường Thang Nâng',
    targetItems: 14,
    timeLimit: 125,
    parTime: 92,
    bonusObjective: 'no_fragile_break',
    bounds: { minX: -15.5, maxX: 15.5, minZ: -10, maxZ: 10 },
    spawns: [
      { x: -9.4, y: 0.1, z: 0.0 },
      { x: -11.3, y: 2.5, z: -5.2 },
      { x: -8.2, y: 0.1, z: 1.8 },
      { x: -11.6, y: 4.3, z: 5.2 }
    ],
    floorSize: { w: 33, d: 22 },
    wallColor: 0xf59e0b,
    houseZones: [
      { minX: -14.0, maxX: -3.6, minZ: -8.4, maxZ: 8.4, color: 0x94a3b8 },
      { minX: 3.6, maxX: 7.4, minZ: -8.4, maxZ: 8.4, color: 0xcbd5e1 }
    ],
    rooms: [
      { name: 'Concrete Workshop Bay', minX: -14.0, maxX: -3.6, minZ: -8.4, maxZ: 8.4, style: 'concrete_site', color: '#94a3b8' },
      { name: 'East Receiving Pier', minX: 3.6, maxX: 7.4, minZ: -8.4, maxZ: 8.4, style: 'concrete_site', color: '#cbd5e1' },
      { name: 'Site Architect Office F2', minX: -13.9, maxX: -9.3, minZ: -8.0, maxZ: -2.4, y: 2.4, style: 'parquet_lavender', color: '#fde68a' },
      { name: 'Executive Tower Vault F3', minX: -13.9, maxX: -9.3, minZ: 2.4, maxZ: 8.0, y: 4.2, style: 'polka_blue', color: '#e0f2fe' }
    ],
    doors: [
      { x: -3.6, z: 0.0, dir: 'z', width: 3.0, swingDir: 1, doorColor: 0x475569 }
    ],
    fixtures: [
      { type: 'shipping_container', x: -11.6, z: 7.3, w: 3.8, d: 1.6, h: 2.1, color: 0xea580c },
      { type: 'control_desk', x: -6.0, z: 7.3, w: 2.0, d: 0.85, h: 0.92 },
      { type: 'control_desk', x: -13.1, y: 2.4, z: -5.2, w: 1.65, d: 0.75, h: 0.90, rotY: Math.PI / 2 }
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
      { x: -5.4, y: 1.4, z: -2.2, w: 0.35, h: 2.8, d: 2.6, isInterior: true, wallHex: '#fde047' }
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
      { type: 'generator', x: -11.8, y: 0, z: -0.2, name: 'Máy Phát Điện Công Trường', value: 48000000, isSuperHeavy: true, isVibrating: true },
      { type: 'fridge', x: -9.8, y: 0, z: 1.2, name: 'Tủ Đồ Nghề Cơ Khí', value: 28000000, isHeavy: true },
      { type: 'drum', x: -6.8, y: 0, z: -0.6, name: 'Thùng Phuy Lăn Tròn', value: 11500000, isRolling: true },
      { type: 'toolbox', x: -11.6, y: 0, z: 3.8, name: 'Hộp Đồ Nghề Thép', value: 12000000 },
      { type: 'pc', x: -1.6, y: 0, z: 0.0, name: 'Trạm Điều Khiển Cẩu', value: 52000000, isFragile: true },
      { type: 'lamp', x: -8.2, y: 0, z: -2.4, name: 'Đèn Pha Công Trường', value: 8500000 },
      { type: 'sofa', x: -12.4, y: 2.4, z: -6.6, name: 'Băng Ghế Nghỉ Thợ', value: 14000000, isHeavy: true },
      { type: 'tv', x: -10.2, y: 2.4, z: -6.8, name: 'Màn Hình Bản Vẽ CAD', value: 32000000, isFragile: true },
      { type: 'toolbox', x: -10.2, y: 2.4, z: -3.6, name: 'Bộ Máy Khoan Bê Tông', value: 15000000 },
      { type: 'chair', x: -12.4, y: 2.4, z: -3.6, name: 'Ghế Kỹ Sư Trưởng', value: 5800000 },
      { type: 'safe', x: -12.4, y: 4.2, z: 6.6, name: 'Két Hợp Đồng Dự Án', value: 95000000, isSuperHeavy: true },
      { type: 'statue', x: -10.2, y: 4.2, z: 6.6, name: 'Cúp Vàng An Toàn', value: 42000000, isFragile: true },
      { type: 'pc', x: -10.2, y: 4.2, z: 3.6, name: 'Laptop Đo Đạc Laser', value: 36000000, isFragile: true },
      { type: 'vase', x: -12.4, y: 4.2, z: 3.6, name: 'Bình Đo Áp Suất Kính', value: 19000000, isFragile: true }
    ]
  },

  6: {
    id: 6,
    chapter: 2,
    name: 'Đại Kho Băng Chuyền',
    targetItems: 16,
    timeLimit: 135,
    parTime: 98,
    bonusObjective: 'no_any_damage',
    bounds: { minX: -16.0, maxX: 16.0, minZ: -10.5, maxZ: 10.5 },
    spawns: [
      { x: -12.2, y: 0.1, z: -0.6 },
      { x: -12.2, y: 0.1, z: 0.8 },
      { x: -11.0, y: 0.1, z: -1.8 },
      { x: -11.0, y: 0.1, z: 1.8 }
    ],
    floorSize: { w: 34, d: 23 },
    floorColor: 0xcbd5e1,
    wallColor: 0x94a3b8,
    houseBounds: { minX: -14.2, maxX: 3.2, minZ: -8.8, maxZ: 8.8 },
    rooms: [
      { name: 'North Sorting Bay', minX: -14.2, maxX: 3.2, minZ: -8.8, maxZ: -2.2, style: 'warehouse_grid', color: '#cbd5e1' },
      { name: 'Central Dispatch Lane', minX: -14.2, maxX: 3.2, minZ: -2.2, maxZ: 2.2, style: 'concrete_site', color: '#94a3b8' },
      { name: 'South Cold Storage Bay', minX: -14.2, maxX: 3.2, minZ: 2.2, maxZ: 8.8, style: 'warehouse_grid', color: '#e2e8f0' },
      { name: 'Central Dispatch Loft', minX: -12.1, maxX: -7.5, minZ: -2.1, maxZ: 2.1, y: 2.3, style: 'parquet_lavender', color: '#fde68a' }
    ],
    doors: [
      { x: 3.2, z: -4.4, dir: 'z', width: 3.2, swingDir: -1, doorColor: 0x475569 },
      { x: 3.2, z: 4.8, dir: 'z', width: 3.2, swingDir: 1, doorColor: 0x475569 }
    ],
    fixtures: [
      { type: 'store_rack', x: -13.3, z: -4.8, w: 3.8, d: 0.76, h: 2.05, rotY: Math.PI / 2 },
      { type: 'store_rack', x: -13.3, z: 4.8, w: 3.8, d: 0.76, h: 2.05, rotY: Math.PI / 2 },
      { type: 'store_rack', x: -5.4, z: 7.9, w: 3.8, d: 0.76, h: 2.05 },
      { type: 'control_desk', x: -9.8, y: 2.3, z: 0.0, w: 1.5, d: 0.76, h: 0.90 }
    ],
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
      // Security bay partitions
      { x: -4.2, y: 1.5, z: -7.4, w: 0.35, h: 3.0, d: 2.4, isInterior: true, wallHex: '#94a3b8' },
      { x: -4.2, y: 1.5, z: 7.4, w: 0.35, h: 3.0, d: 2.4, isInterior: true, wallHex: '#94a3b8' },
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
      { type: 'piano', x: -11.2, y: 0, z: -4.6, name: 'Đại Dương Cầm VIP', value: 90000000, isSuperHeavy: true },
      { type: 'safe', x: -7.2, y: 0, z: -4.6, name: 'Két Ngân Hàng', value: 150000000, isSuperHeavy: true },
      { type: 'pc', x: -1.4, y: 0, z: -7.2, name: 'Server AI Cluster', value: 110000000, isFragile: true },
      { type: 'statue', x: -7.6, y: 0, z: -7.2, name: 'Tượng Rồng Vàng', value: 72000000, isFragile: true },
      { type: 'vase', x: 1.0, y: 0, z: -7.2, name: 'Bình Ngọc Hoàng Gia', value: 88000000, isFragile: true },
      { type: 'drum', x: -2.4, y: 0, z: 0.5, name: 'Thùng Phuy Hóa Chất', value: 22000000, isRolling: true },
      { type: 'pet', x: -1.0, y: 0, z: 2.0, name: 'Mèo Máy Turbo', value: 28000000, isLiving: true },
      { type: 'sofa', x: -11.2, y: 2.3, z: -1.2, name: 'Bộ Sofa Tiếp Khách', value: 44000000, isHeavy: true },
      { type: 'pc', x: -8.4, y: 2.3, z: 1.2, name: 'Bộ RTX 5090 Ti', value: 125000000, isFragile: true },
      { type: 'treasure', x: -11.2, y: 2.3, z: 1.2, name: 'Rương Vàng Kho Báu', value: 75000000 },
      { type: 'bookshelf', x: -8.4, y: 2.3, z: -1.2, name: 'Tủ Hồ Sơ Mật', value: 28000000, isHeavy: true },
      { type: 'fridge', x: -11.2, y: 0, z: 4.6, name: 'Tủ Lạnh Công Nghiệp', value: 35000000, isHeavy: true },
      { type: 'briefcase', x: -7.2, y: 0, z: 4.6, name: 'Vali Đô La Mỹ', value: 65000000 },
      { type: 'aquarium', x: -11.2, y: 0, z: 7.2, name: 'Hồ Cá Koi Nhật', value: 48000000, isFragile: true },
      { type: 'tv', x: -2.0, y: 0, z: 7.2, name: 'Màn Hình Rạp 100"', value: 78000000, isFragile: true },
      { type: 'yoga_ball', x: 0.8, y: 0, z: 7.2, name: 'Bóng Yoga Khổng Lồ', value: 24000000, isBouncy: true, isRolling: true }
    ]
  },

  7: {
    id: 7,
    chapter: 2,
    name: 'Siêu Thị Cuối Tuần',
    targetItems: 14,
    timeLimit: 120,
    parTime: 86,
    bonusObjective: 'no_glass',
    bounds: { minX: -15.5, maxX: 15.5, minZ: -10, maxZ: 10 },
    spawns: [
      { x: 0.2, y: 0.1, z: -1.6 },
      { x: 0.2, y: 0.1, z: 1.6 },
      { x: -1.6, y: 0.1, z: -1.6 },
      { x: -1.6, y: 0.1, z: 1.6 }
    ],
    floorSize: { w: 33, d: 22 },
    floorColor: 0xe0f2fe,
    wallColor: 0x38bdf8,
    houseBounds: { minX: -14.0, maxX: 3.4, minZ: -8.6, maxZ: 8.6 },
    rooms: [
      { name: 'Frozen Foods NW', minX: -14.0, maxX: -4.8, minZ: -8.6, maxZ: -3.2, style: 'bath_tile', color: '#bae6fd' },
      { name: 'Electronics & Toy Aisle', minX: -14.0, maxX: -4.8, minZ: -3.2, maxZ: 3.2, style: 'polka_blue', color: '#e0f2fe' },
      { name: 'Bakery & Deli SW', minX: -14.0, maxX: -4.8, minZ: 3.2, maxZ: 8.6, style: 'bistro_tile', color: '#fef3c7' },
      { name: 'Checkout Lanes East', minX: -4.8, maxX: 3.4, minZ: -8.6, maxZ: 8.6, style: 'bistro_tile', color: '#f8fafc' }
    ],
    doors: [
      { x: 3.4, z: 0.0, dir: 'z', width: 3.8, swingDir: -1, doorColor: 0x0284c7 }
    ],
    fixtures: [
      // Stocked supermarket aisles & conveyor checkout counters (replaced plain brick blocks)
      { type: 'store_rack', x: -8.6, z: -3.6, w: 5.4, d: 0.76, h: 2.05 },
      { type: 'store_rack', x: -8.6, z: 3.6, w: 5.4, d: 0.76, h: 2.05 },
      { type: 'checkout_counter', x: 0.8, z: -4.4, w: 0.82, d: 3.6, h: 1.02 },
      { type: 'checkout_counter', x: 0.8, z: 4.4, w: 0.82, d: 3.6, h: 1.02 },
      { type: 'kitchen_counter', x: -11.4, z: 7.9, w: 3.6, d: 0.76, h: 0.98 },
      { type: 'potted_plant', x: 2.6, z: -7.8 },
      { type: 'potted_plant', x: 2.6, z: 7.8 }
    ],
    roads: [
      { x: 10.8, z: 0, w: 6.4, d: 20.6, lanes: 'z' }
    ],
    platforms: [],
    ramps: [],
    walls: [
      { x: -14.0, y: 1.5, z: 0, w: 0.4, h: 3.0, d: 17.6 },
      { x: -5.3, y: 1.5, z: -8.6, w: 17.8, h: 3.0, d: 0.4 },
      { x: -5.3, y: 1.5, z: 8.6, w: 17.8, h: 3.0, d: 0.4 },
      // Front storefront wall pillars leaving 3.8m center automatic doors (-1.9..1.9)
      { x: 3.4, y: 1.6, z: -6.8, w: 0.35, h: 3.2, d: 3.6 },
      { x: 3.4, y: 1.6, z: 6.8, w: 0.35, h: 3.2, d: 3.6 }
    ],
    windows: [
      { id: 'w7_1', x: 3.4, y: 0, z: -3.4, w: 0.25, h: 2.8, d: 2.8, hp: 2, isBroken: false },
      { id: 'w7_2', x: 3.4, y: 0, z: 3.4, w: 0.25, h: 2.8, d: 2.8, hp: 2, isBroken: false }
    ],
    switches: [
      { id: 'm7_belt', type: 'lever', x: -0.6, y: 0, z: 0.0, cooldownSeconds: 0.8 }
    ],
    zones: [
      { type: 'slippery', minX: -13.2, maxX: -5.6, minZ: -8.0, maxZ: -4.4, y: 0 },
      { type: 'conveyor', minX: -4.4, maxX: 2.8, minZ: -1.4, maxZ: 1.4, y: 0, vx: 3.2, vz: 0, switchId: 'm7_belt', flipWhenActive: true }
    ],
    hazards: [
      { type: 'patrol', kind: 'cart', speed: 3.9, loop: true, radius: 0.66, points: [[-4.8, -6.2], [-1.2, -6.2], [-1.2, 6.2], [-4.8, 6.2]] },
      { type: 'patrol', kind: 'robot', speed: 3.3, loop: false, radius: 0.60, points: [[-12.2, -1.6], [-5.8, -1.6], [-5.8, 1.6], [-12.2, 1.6]] }
    ],
    trampolines: [
      { x: 5.8, y: 0, z: -4.4, r: 1.45 },
      { x: 5.8, y: 0, z: 4.4, r: 1.45 }
    ],
    truck: { x: 10.8, y: 0, z: 0.0, bedW: 4.4, bedD: 5.2, rotY: 0 },
    items: [
      { type: 'fridge', x: -12.0, y: 0, z: -6.4, name: 'Tủ Kem Đông Lạnh', value: 26000000, isHeavy: true },
      { type: 'washer', x: -9.4, y: 0, z: -6.4, name: 'Máy Giặt Khuyến Mãi', value: 22000000, isHeavy: true, isVibrating: true },
      { type: 'box', x: -6.8, y: 0, z: -6.4, name: 'Thùng Mì Siêu To', value: 6000000 },
      { type: 'tv', x: -12.0, y: 0, z: -1.0, name: 'Smart TV Black Friday', value: 42000000, isFragile: true },
      { type: 'console', x: -7.2, y: 0, z: -1.2, name: 'Máy Chơi Game Sale', value: 18000000, isFragile: true },
      { type: 'teddy', x: -9.8, y: 0, z: 0.8, name: 'Gấu Bông Khổng Lồ', value: 9000000, isBouncy: true },
      { type: 'yoga_ball', x: -7.2, y: 0, z: 1.2, name: 'Bóng Thể Thao', value: 7500000, isBouncy: true, isRolling: true },
      { type: 'dining_table', x: -11.4, y: 0, z: 6.0, name: 'Quầy Trưng Bày Gỗ', value: 24000000, isHeavy: true },
      { type: 'stove', x: -7.6, y: 0, z: 6.4, name: 'Lò Nướng Bánh Mì', value: 21000000, isHeavy: true },
      { type: 'aquarium', x: -3.2, y: 0, z: 6.6, name: 'Bể Hải Sản Tươi', value: 34000000, isFragile: true },
      { type: 'pot_soup', x: -3.2, y: 0, z: -6.6, name: 'Nồi Lẩu Dùng Thử', value: 11000000 },
      { type: 'safe', x: -12.0, y: 0, z: 3.4, name: 'Két Tiền Thu Ngân', value: 58000000, isSuperHeavy: true },
      { type: 'vase', x: 2.0, y: 0, z: -6.0, name: 'Chai Vang Hảo Hạng', value: 19500000, isFragile: true },
      { type: 'pet', x: 2.0, y: 0, z: 6.0, name: 'Cún Con Đi Lạc', value: 14000000, isLiving: true }
    ]
  },

  8: {
    id: 8,
    chapter: 2,
    name: 'Chung Cư Hai Tầng',
    targetItems: 14,
    timeLimit: 125,
    parTime: 90,
    bonusObjective: 'no_fragile_break',
    bounds: { minX: -15.5, maxX: 15.5, minZ: -10, maxZ: 10 },
    spawns: [
      { x: -1.6, y: 0.1, z: -2.0 },
      { x: -1.6, y: 0.1, z: 2.0 },
      { x: -11.4, y: 2.5, z: -4.2 },
      { x: -11.4, y: 2.5, z: 4.2 }
    ],
    floorSize: { w: 33, d: 22 },
    floorColor: 0xfef3c7,
    wallColor: 0xfb923c,
    houseBounds: { minX: -13.8, maxX: 3.6, minZ: -8.4, maxZ: 8.4 },
    rooms: [
      { name: 'Atrium & Stair Lobby', minX: -13.8, maxX: -3.2, minZ: -8.4, maxZ: 8.4, style: 'parquet_lavender', color: '#e9d5ff' },
      { name: 'Kitchen & Dining NE', minX: -3.2, maxX: 3.6, minZ: -8.4, maxZ: 0.0, style: 'bistro_tile', color: '#fef9c3' },
      {
        name: 'Living & Laundry SE',
        minX: -3.2,
        maxX: 3.6,
        minZ: 0.0,
        maxZ: 8.4,
        style: 'polka_pink',
        color: '#fbcfe8',
        rug: { x: 0.1, z: 3.3, w: 3.0, d: 1.9, color: '#fde2c4', stripe: '#f8a488' }
      },
      {
        name: 'Upper Master Suite NW',
        minX: -13.5,
        maxX: -8.1,
        minZ: -7.9,
        maxZ: -0.5,
        y: 2.4,
        style: 'parquet_lavender',
        color: '#c4b5fd',
        rug: { x: -11.0, z: -4.2, w: 2.4, d: 1.8, color: '#fce7f3', stripe: '#f472b6' }
      },
      { name: 'Upper Gaming Loft & Bath SW', minX: -13.5, maxX: -8.1, minZ: 0.5, maxZ: 7.9, y: 2.4, style: 'bath_tile', color: '#bae6fd' }
    ],
    doors: [
      { x: -3.2, z: 0.0, dir: 'z', width: 3.2, swingDir: 1, doorColor: 0x854d27 },
      { x: -1.4, z: 0.0, dir: 'x', width: 3.0, swingDir: -1, doorColor: 0x854d27 },
      { x: 3.6, z: 0.0, dir: 'z', width: 3.8, swingDir: -1, doorColor: 0x7c3f1d }
    ],
    fixtures: [
      { type: 'kitchen_counter', x: -0.8, z: -7.8, w: 2.8, d: 0.78, h: 0.98 },
      { type: 'coffee_table', x: 0.1, z: 3.3, w: 1.2, d: 0.75, h: 0.46 },
      { type: 'wardrobe', x: -12.8, y: 2.4, z: -7.5, w: 1.4, d: 0.65, h: 1.95 },
      { type: 'control_desk', x: -12.6, y: 2.4, z: 4.1, w: 1.7, d: 0.78, h: 0.90, rotY: Math.PI / 2 },
      { type: 'potted_plant', x: 2.8, z: 7.5 },
      { type: 'wall_art', x: -0.6, z: -8.12, variant: 1 }
    ],
    roads: [
      { x: 10.8, z: 0, w: 6.4, d: 20.4, lanes: 'z' }
    ],
    platforms: [
      { x: -10.8, y: 2.4, z: -4.2, w: 5.4, d: 7.4 },
      { x: -10.8, y: 2.4, z: 4.2, w: 5.4, d: 7.4 }
    ],
    ramps: [
      { minX: -8.1, maxX: -4.8, minZ: -2.2, maxZ: 2.2, yStart: 0, yEnd: 2.4, axis: 'x', dir: -1 }
    ],
    walls: [
      { x: -13.8, y: 2.0, z: 0, w: 0.4, h: 4.0, d: 17.2 },
      { x: -5.1, y: 2.0, z: -8.4, w: 17.8, h: 4.0, d: 0.4 },
      { x: -5.1, y: 2.0, z: 8.4, w: 17.8, h: 4.0, d: 0.4 },
      // Apartment interior dividers
      { x: -3.2, y: 1.5, z: -5.6, w: 0.35, h: 3.0, d: 5.4, isInterior: true, wallHex: '#93c5fd' },
      { x: -3.2, y: 1.5, z: 5.6, w: 0.35, h: 3.0, d: 5.4, isInterior: true, wallHex: '#93c5fd' },
      { x: 1.8, y: 1.4, z: 0.0, w: 3.2, h: 2.8, d: 0.3, isInterior: true, wallHex: '#fcd34d' },
      // Front balcony walls with wide center lobby exit (-2.2..2.2)
      { x: 3.6, y: 1.6, z: -6.4, w: 0.35, h: 3.2, d: 4.0 },
      { x: 3.6, y: 1.6, z: 6.4, w: 0.35, h: 3.2, d: 4.0 }
    ],
    windows: [
      { id: 'w8_1', x: 3.6, y: 0, z: -3.2, w: 0.25, h: 2.8, d: 2.2, hp: 2, isBroken: false },
      { id: 'w8_2', x: 3.6, y: 0, z: 3.2, w: 0.25, h: 2.8, d: 2.2, hp: 2, isBroken: false }
    ],
    elevators: [
      { x: -6.6, z: -5.8, w: 2.6, d: 3.0, yMin: 0, yMax: 2.4, speed: 1.5, pauseSec: 1.4, offset: 0 },
      { x: -6.6, z: 5.8, w: 2.6, d: 3.0, yMin: 0, yMax: 2.4, speed: 1.5, pauseSec: 1.4, offset: 2.2 }
    ],
    hazards: [
      { type: 'patrol', kind: 'ghost', speed: 3.0, loop: true, radius: 0.60, points: [[-1.6, -6.2], [2.2, -6.2], [2.2, 6.2], [-1.6, 6.2]] }
    ],
    trampolines: [
      { x: 6.0, y: 0, z: -4.2, r: 1.5 },
      { x: 6.0, y: 0, z: 4.2, r: 1.5 }
    ],
    truck: { x: 10.8, y: 0, z: 0.0, bedW: 4.4, bedD: 5.2, rotY: 0 },
    items: [
      { type: 'bed', x: -11.0, y: 2.4, z: -6.0, name: 'Giường Ngủ Master', value: 34000000, isHeavy: true },
      { type: 'bookshelf', x: -9.4, y: 2.4, z: -2.8, name: 'Tủ Sách Penthouse', value: 22000000, isHeavy: true },
      { type: 'tv', x: -12.0, y: 2.4, z: -2.0, name: 'Tivi OLED 75"', value: 48000000, isFragile: true },
      { type: 'pc', x: -10.8, y: 2.4, z: 2.2, name: 'Góc Gaming RGB', value: 52000000, isFragile: true },
      { type: 'sofa', x: -11.4, y: 2.4, z: 6.2, name: 'Sofa Ban Công', value: 30000000, isHeavy: true },
      { type: 'toilet', x: -9.2, y: 2.4, z: 6.2, name: 'Bồn Cầu Thông Minh', value: 25000000, isFragile: true },
      { type: 'piano', x: -5.8, y: 0, z: -3.0, name: 'Piano Sảnh Tầng 1', value: 68000000, isSuperHeavy: true },
      { type: 'dining_table', x: -0.6, y: 0, z: -5.6, name: 'Bàn Ăn Gia Đình', value: 28000000, isHeavy: true },
      { type: 'fridge', x: 1.8, y: 0, z: -6.6, name: 'Tủ Lạnh 4 Cánh', value: 32000000, isHeavy: true },
      { type: 'aquarium', x: -0.6, y: 0, z: 5.8, name: 'Bể Cá Thủy Sinh', value: 36000000, isFragile: true },
      { type: 'washer', x: 1.8, y: 0, z: 6.2, name: 'Máy Giặt Sấy Turbo', value: 24000000, isHeavy: true, isVibrating: true },
      { type: 'briefcase', x: -5.2, y: 0, z: 2.6, name: 'Vali Sổ Đỏ', value: 55000000 },
      { type: 'vase', x: -1.4, y: 0, z: 0.0, name: 'Bình Gốm Phong Thủy', value: 26000000, isFragile: true },
      { type: 'pet', x: 1.6, y: 0, z: 1.8, name: 'Mèo Anh Lông Ngắn', value: 18000000, isLiving: true }
    ]
  },

  // -----------------------------------------------------------------------
  // CHAPTER 3: CHUYẾN HÀNG SIÊU CẤP (Levels 9 - 12)
  // -----------------------------------------------------------------------
  9: {
    id: 9,
    chapter: 3,
    name: 'Bảo Tàng Cổ Vật',
    targetItems: 13,
    timeLimit: 120,
    parTime: 86,
    bonusObjective: 'no_fragile_break',
    bounds: { minX: -15.5, maxX: 15.5, minZ: -10, maxZ: 10 },
    spawns: [
      { x: 1.6, y: 0.1, z: -1.4 },
      { x: 1.6, y: 0.1, z: 1.4 },
      { x: 0.0, y: 0.1, z: -1.4 },
      { x: 0.0, y: 0.1, z: 1.4 }
    ],
    floorSize: { w: 33, d: 22 },
    floorColor: 0xe2e8f0,
    wallColor: 0x6366f1,
    houseBounds: { minX: -14.0, maxX: 3.4, minZ: -8.6, maxZ: 8.6 },
    rooms: [
      {
        name: 'East Marble Gallery',
        minX: -4.2,
        maxX: 3.4,
        minZ: -8.6,
        maxZ: 8.6,
        style: 'bistro_tile',
        color: '#f1f5f9',
        rug: { x: -0.4, z: 0.0, w: 2.8, d: 8.6, color: '#dc2626', stripe: '#facc15' }
      },
      { name: 'West Treasury Vault', minX: -14.0, maxX: -4.2, minZ: -8.6, maxZ: 8.6, style: 'parquet_lavender', color: '#c7d2fe' },
      { name: 'Pharaoh Pedestal Loft', minX: -13.6, maxX: -9.2, minZ: -3.2, maxZ: 3.2, y: 2.2, style: 'polka_blue', color: '#fde68a' }
    ],
    doors: [
      { x: 3.4, z: 0.0, dir: 'z', width: 3.6, swingDir: -1, doorColor: 0x4f46e5 }
    ],
    fixtures: [
      { type: 'museum_pedestal', x: 2.2, z: -3.4, w: 0.95, d: 0.95, h: 1.05 },
      { type: 'museum_pedestal', x: 2.2, z: 3.4, w: 0.95, d: 0.95, h: 1.05 },
      { type: 'potted_plant', x: 2.6, z: -7.8 },
      { type: 'potted_plant', x: 2.6, z: 7.8 },
      { type: 'wall_art', x: -0.4, z: -8.32, variant: 0 },
      { type: 'wall_art', x: -8.8, z: -8.32, variant: 3 }
    ],
    roads: [
      { x: 10.8, z: 0, w: 6.4, d: 20.6, lanes: 'z' }
    ],
    platforms: [
      { x: -11.4, y: 2.2, z: 0.0, w: 4.4, d: 6.4 }
    ],
    ramps: [
      { minX: -9.2, maxX: -6.4, minZ: -1.6, maxZ: 1.6, yStart: 0, yEnd: 2.2, axis: 'x', dir: -1 }
    ],
    walls: [
      { x: -14.0, y: 1.7, z: 0, w: 0.4, h: 3.4, d: 17.6 },
      { x: -5.3, y: 1.7, z: -8.6, w: 17.8, h: 3.4, d: 0.4 },
      { x: -5.3, y: 1.7, z: 8.6, w: 17.8, h: 3.4, d: 0.4 },
      // Vault partitions with central security shutter
      { x: -4.2, y: 1.6, z: -6.2, w: 0.35, h: 3.2, d: 4.8, isInterior: true, wallHex: '#a5b4fc' },
      { x: -4.2, y: 1.6, z: 6.2, w: 0.35, h: 3.2, d: 4.8, isInterior: true, wallHex: '#a5b4fc' },
      // Grand museum front columns (3.6m center doorway -1.8..1.8)
      { x: 3.4, y: 1.7, z: -5.4, w: 0.35, h: 3.4, d: 6.8 },
      { x: 3.4, y: 1.7, z: 5.4, w: 0.35, h: 3.4, d: 6.8 }
    ],
    windows: [],
    switches: [
      { id: 'm9_vault_btn', type: 'lever', x: -1.8, y: 0, z: -6.8, holdSeconds: 11.0, cooldownSeconds: 1.0 },
      { id: 'm9_plate', type: 'plate', x: -2.2, y: 0, z: 0.0, r: 0.9, holdSeconds: 3.5 }
    ],
    gates: [
      { id: 'm9_vault_door', kind: 'door', x: -4.2, y: 0, z: 0.0, w: 0.35, h: 3.2, d: 7.4, switchIds: ['m9_vault_btn', 'm9_plate'], speed: 2.8 }
    ],
    hazards: [
      { type: 'patrol', kind: 'robot', speed: 3.6, loop: true, radius: 0.62, points: [[-7.8, -6.2], [-5.4, -6.2], [-5.4, 6.2], [-7.8, 6.2]] },
      { type: 'patrol', kind: 'ghost', speed: 3.4, loop: true, radius: 0.60, points: [[-2.0, -5.0], [1.2, -5.0], [1.2, 5.0], [-2.0, 5.0]] }
    ],
    trampolines: [
      { x: 6.0, y: 0, z: -4.2, r: 1.45 },
      { x: 6.0, y: 0, z: 4.2, r: 1.45 }
    ],
    truck: { x: 10.8, y: 0, z: 0.0, bedW: 4.4, bedD: 5.2, rotY: 0 },
    items: [
      { type: 'treasure', x: -11.8, y: 2.2, z: -1.8, name: 'Rương Báu Pharaoh', value: 120000000 },
      { type: 'statue', x: -11.8, y: 2.2, z: 1.8, name: 'Tượng Nhân Sư Vàng', value: 95000000, isFragile: true },
      { type: 'safe', x: -11.4, y: 0, z: -6.4, name: 'Két Bảo Vật Hoàng Gia', value: 150000000, isSuperHeavy: true },
      { type: 'piano', x: -11.4, y: 0, z: 6.4, name: 'Cổ Cầm Mozart 1780', value: 130000000, isSuperHeavy: true },
      { type: 'vase', x: -7.2, y: 0, z: -6.8, name: 'Bình Gốm Chu Đậu Cổ', value: 68000000, isFragile: true },
      { type: 'vase', x: -7.2, y: 0, z: 6.8, name: 'Bình Ngọc Lục Bảo', value: 72000000, isFragile: true },
      { type: 'statue', x: -5.8, y: 0, z: -3.2, name: 'Tượng Chiến Binh Đồng', value: 54000000, isFragile: true },
      { type: 'dining_table', x: -1.2, y: 0, z: -5.2, name: 'Bàn Trưng Bày Pha Lê', value: 42000000, isHeavy: true },
      { type: 'bookshelf', x: -1.2, y: 0, z: 5.2, name: 'Tủ Sách Cổ Thư', value: 38000000, isHeavy: true },
      { type: 'aquarium', x: 1.2, y: 0, z: -6.2, name: 'Hộp Hóa Thạch Khủng Long', value: 82000000, isFragile: true },
      { type: 'briefcase', x: 1.4, y: 0, z: 6.2, name: 'Vali Kim Cương', value: 98000000 },
      { type: 'lamp', x: -2.0, y: 0, z: 2.8, name: 'Đèn Chùm Cổ Điển', value: 26000000 },
      { type: 'pc', x: -2.0, y: 0, z: -2.8, name: 'Máy Quét Laser Bảo Tàng', value: 44000000, isFragile: true }
    ]
  },

  10: {
    id: 10,
    chapter: 3,
    name: 'Sảnh Tiệc Du Thuyền',
    targetItems: 14,
    timeLimit: 125,
    parTime: 90,
    bonusObjective: 'no_hazard_hit',
    bounds: { minX: -16.0, maxX: 16.0, minZ: -10.5, maxZ: 10.5 },
    spawns: [
      { x: -10.8, y: 0.1, z: -2.4 },
      { x: -10.8, y: 0.1, z: 0.2 },
      { x: -8.4, y: 0.1, z: -2.4 },
      { x: -8.4, y: 0.1, z: 0.2 }
    ],
    floorSize: { w: 34, d: 23 },
    floorColor: 0xfde68a,
    wallColor: 0x0ea5e9,
    houseBounds: { minX: -14.2, maxX: 2.8, minZ: -8.8, maxZ: 8.8 },
    rooms: [
      {
        name: 'Fore Teak Lounge',
        minX: -14.2,
        maxX: 2.8,
        minZ: -8.8,
        maxZ: 1.6,
        style: 'parquet_lavender',
        color: '#fde68a',
        rug: { x: -5.4, z: -4.2, w: 3.4, d: 2.2, color: '#e0f2fe', stripe: '#0ea5e9' }
      },
      { name: 'Aft Pool Sun Deck', minX: -14.2, maxX: 2.8, minZ: 1.6, maxZ: 8.8, style: 'bath_tile', color: '#99f6e4' },
      { name: 'Upper Captain Bridge', minX: -13.8, maxX: -9.0, minZ: -8.3, maxZ: -3.7, y: 2.3, style: 'polka_blue', color: '#e0f2fe' }
    ],
    doors: [
      { x: 2.8, z: 0.0, dir: 'z', width: 3.6, swingDir: -1, doorColor: 0x0284c7 }
    ],
    fixtures: [
      // Two sleek cocktail bar islands forming the 7.4m yacht bar (replaces plain brick bar!)
      { type: 'kitchen_island', x: -7.0, z: 1.6, w: 3.5, d: 0.72, h: 1.02 },
      { type: 'kitchen_island', x: -3.3, z: 1.6, w: 3.5, d: 0.72, h: 1.02 },
      { type: 'yacht_helm', x: -13.1, y: 2.3, z: -7.5, w: 0.9, d: 0.9, h: 1.25 },
      { type: 'restaurant_table', x: -4.6, z: 7.4, w: 1.2, d: 1.2, h: 0.82 },
      { type: 'potted_plant', x: 2.0, z: -7.8 },
      { type: 'potted_plant', x: 2.0, z: 7.8 }
    ],
    roads: [
      { x: 11.4, z: 0, w: 6.4, d: 21.2, lanes: 'z' }
    ],
    platforms: [
      { x: -11.4, y: 2.3, z: -6.0, w: 4.8, d: 4.6 }
    ],
    ramps: [
      { minX: -9.0, maxX: -5.8, minZ: -7.4, maxZ: -4.6, yStart: 0, yEnd: 2.3, axis: 'x', dir: -1 }
    ],
    walls: [
      { x: -14.2, y: 1.5, z: 0, w: 0.4, h: 3.0, d: 18.0 },
      { x: -5.7, y: 1.5, z: -8.8, w: 17.4, h: 3.0, d: 0.4 },
      { x: -5.7, y: 1.5, z: 8.8, w: 17.4, h: 3.0, d: 0.4 },
      // Gangway deck railing
      { x: 2.8, y: 0.58, z: -6.2, w: 0.3, h: 1.15, d: 4.8 },
      { x: 2.8, y: 0.58, z: 6.2, w: 0.3, h: 1.15, d: 4.8 }
    ],
    windows: [],
    pits: [
      { minX: 3.4, maxX: 7.4, minZ: -8.4, maxZ: -2.4 },
      { minX: 3.4, maxX: 7.4, minZ: 2.4, maxZ: 8.4 }
    ],
    switches: [
      { id: 'm10_wind_off', type: 'lever', x: 1.6, y: 0, z: 0.0, holdSeconds: 10.0, cooldownSeconds: 2.0 }
    ],
    zones: [
      { type: 'slippery', minX: -12.6, maxX: 2.0, minZ: 2.6, maxZ: 7.8, y: 0 },
      { type: 'wind', minX: 2.2, maxX: 8.0, minZ: -4.0, maxZ: 4.0, yMin: -2, yMax: 7, fx: 0, fz: -5.2, fanX: 5.4, fanZ: 4.2, switchId: 'm10_wind_off', offWhenActive: true }
    ],
    hazards: [
      { type: 'patrol', kind: 'chef', speed: 3.5, loop: true, radius: 0.62, points: [[-10.2, -1.2], [0.8, -1.2], [0.8, 4.4], [-10.2, 4.4]] }
    ],
    trampolines: [
      { x: 1.2, y: 0, z: -5.4, r: 1.35 },
      { x: 1.2, y: 0, z: 5.4, r: 1.35 }
    ],
    truck: { x: 11.4, y: 0, z: 0.0, bedW: 4.5, bedD: 5.4, rotY: 0 },
    items: [
      { type: 'piano', x: -11.6, y: 2.3, z: -5.6, name: 'Đại Dương Cầm Boong Tàu', value: 86000000, isSuperHeavy: true },
      { type: 'sofa', x: -10.2, y: 2.3, z: -4.6, name: 'Sofa Ngắm Biển', value: 32000000, isHeavy: true },
      { type: 'aquarium', x: -12.2, y: 0, z: 0.6, name: 'Bể San Hô Đại Dương', value: 46000000, isFragile: true },
      { type: 'dining_table', x: -6.8, y: 0, z: 5.2, name: 'Bàn Tiệc Hải Sản', value: 34000000, isHeavy: true },
      { type: 'fridge', x: -12.2, y: 0, z: 6.6, name: 'Tủ Rượu Vang Du Thuyền', value: 38000000, isHeavy: true },
      { type: 'stove', x: -1.4, y: 0, z: 6.4, name: 'Bếp Nướng BBQ Boong', value: 28000000, isHeavy: true },
      { type: 'drum', x: -3.2, y: 0, z: -5.6, name: 'Thùng Rượu Gỗ Sồi', value: 18000000, isRolling: true },
      { type: 'yoga_ball', x: -0.6, y: 0, z: -5.4, name: 'Phao Bóng Biển', value: 12000000, isBouncy: true, isRolling: true },
      { type: 'treasure', x: -12.2, y: 0, z: -3.0, name: 'Rương Báu Thuyền Trưởng', value: 78000000 },
      { type: 'tv', x: -0.8, y: 0, z: -2.4, name: 'Màn Hình Karaoke VIP', value: 42000000, isFragile: true },
      { type: 'pot_soup', x: -5.4, y: 0, z: -2.0, name: 'Nồi Súp Tôm Hùm', value: 18500000 },
      { type: 'vase', x: -2.4, y: 0, z: 4.2, name: 'Bình Pha Lê Boong Tàu', value: 29000000, isFragile: true },
      { type: 'briefcase', x: -9.8, y: 0, z: 6.8, name: 'Vali Thẻ VIP Du Thuyền', value: 64000000 },
      { type: 'pet', x: 1.2, y: 0, z: 3.4, name: 'Mèo Thủy Thủ', value: 16000000, isLiving: true }
    ]
  },

  11: {
    id: 11,
    chapter: 3,
    name: 'Cảng Container Bão Tố',
    targetItems: 15,
    timeLimit: 135,
    parTime: 96,
    bonusObjective: 'no_any_damage',
    bounds: { minX: -16.0, maxX: 16.0, minZ: -10.5, maxZ: 10.5 },
    spawns: [
      { x: -9.2, y: 0.1, z: -2.0 },
      { x: -9.2, y: 0.1, z: 2.0 },
      { x: -7.2, y: 0.1, z: -1.0 },
      { x: -7.2, y: 0.1, z: 1.0 }
    ],
    floorSize: { w: 34, d: 23 },
    floorColor: 0x94a3b8,
    wallColor: 0xea580c,
    houseZones: [
      { minX: -14.2, maxX: -3.2, minZ: -8.8, maxZ: 8.8, color: 0x94a3b8 },
      { minX: 4.0, maxX: 7.8, minZ: -8.8, maxZ: 8.8, color: 0xcbd5e1 }
    ],
    rooms: [
      { name: 'West Port Container Yard', minX: -14.2, maxX: -3.2, minZ: -8.8, maxZ: 8.8, style: 'concrete_site', color: '#94a3b8' },
      { name: 'East Customs Pier', minX: 4.0, maxX: 7.8, minZ: -8.8, maxZ: 8.8, style: 'concrete_site', color: '#cbd5e1' },
      { name: 'Harbor Control Loft N', minX: -13.9, maxX: -9.3, minZ: -8.3, maxZ: -2.5, y: 2.4, style: 'warehouse_grid', color: '#bae6fd' },
      { name: 'Customs Vault Loft S', minX: -13.9, maxX: -9.3, minZ: 2.5, maxZ: 8.3, y: 2.4, style: 'parquet_lavender', color: '#fde68a' }
    ],
    doors: [
      { x: -3.2, z: 0.0, dir: 'z', width: 3.0, swingDir: 1, doorColor: 0xea580c }
    ],
    fixtures: [
      { type: 'shipping_container', x: -11.6, z: -7.6, w: 3.8, d: 1.5, h: 2.1, color: 0xef4444 },
      { type: 'shipping_container', x: -11.6, z: 7.6, w: 3.8, d: 1.5, h: 2.1, color: 0x0284c7 },
      { type: 'control_desk', x: -11.6, y: 2.4, z: -5.3, w: 1.7, d: 0.72, h: 0.90 }
    ],
    roads: [
      { x: 11.6, z: 0, w: 6.4, d: 21.4, lanes: 'z' }
    ],
    platforms: [
      { x: -11.6, y: 2.4, z: -5.4, w: 4.6, d: 5.8 },
      { x: -11.6, y: 2.4, z: 5.4, w: 4.6, d: 5.8 }
    ],
    ramps: [],
    walls: [
      { x: -14.2, y: 2.0, z: 0, w: 0.4, h: 4.0, d: 18.0 },
      { x: -8.7, y: 2.0, z: -8.8, w: 11.4, h: 4.0, d: 0.4 },
      { x: -8.7, y: 2.0, z: 8.8, w: 11.4, h: 4.0, d: 0.4 }
    ],
    windows: [],
    pits: [
      { minX: -3.2, maxX: 4.0, minZ: -8.6, maxZ: -1.6 },
      { minX: -3.2, maxX: 4.0, minZ: 1.6, maxZ: 8.6 }
    ],
    switches: [
      { id: 'm11_b1', type: 'lever', x: -4.2, y: 0, z: -3.2, holdSeconds: 12.0, cooldownSeconds: 1.0 },
      { id: 'm11_b2', type: 'plate', x: -4.2, y: 0, z: 0.0, r: 0.9, holdSeconds: 6.5 }
    ],
    gates: [
      { id: 'm11_bridge1', kind: 'bridge', x: 0.4, y: 0, z: -5.0, w: 7.6, d: 3.0, switchIds: ['m11_b1'], speed: 3.0 },
      { id: 'm11_bridge2', kind: 'bridge', x: 0.4, y: 0, z: 5.0, w: 7.6, d: 3.0, switchIds: ['m11_b2'], speed: 3.0 }
    ],
    elevators: [
      { x: -7.4, z: -5.4, w: 2.8, d: 3.2, yMin: 0, yMax: 2.4, speed: 1.7, pauseSec: 1.3, offset: 0 },
      { x: -7.4, z: 5.4, w: 2.8, d: 3.2, yMin: 0, yMax: 2.4, speed: 1.7, pauseSec: 1.3, offset: 1.8 }
    ],
    zones: [
      { type: 'conveyor', minX: -13.0, maxX: -4.0, minZ: -1.2, maxZ: 1.2, y: 0, vx: 3.4, vz: 0 },
      { type: 'wind', minX: -3.5, maxX: 4.2, minZ: -8.2, maxZ: 8.2, yMin: -2, yMax: 7, fx: 0, fz: 4.8, fanX: 0.4, fanZ: -8.5 }
    ],
    hazards: [
      { type: 'patrol', kind: 'robot', speed: 3.7, loop: true, radius: 0.62, points: [[4.8, -6.4], [6.8, -6.4], [6.8, 6.4], [4.8, 6.4]] }
    ],
    trampolines: [
      { x: 5.8, y: 0, z: -4.8, r: 1.45 },
      { x: 5.8, y: 0, z: 4.8, r: 1.45 }
    ],
    truck: { x: 11.6, y: 0, z: 0.0, bedW: 4.6, bedD: 5.6, rotY: 0 },
    items: [
      { type: 'generator', x: -11.6, y: 2.4, z: -6.9, name: 'Máy Phát Điện Tàu Thủy', value: 76000000, isSuperHeavy: true, isVibrating: true },
      { type: 'toolbox', x: -10.2, y: 2.4, z: -3.6, name: 'Hộp Đồ Nghề Cảng', value: 18000000 },
      { type: 'pc', x: -12.4, y: 2.4, z: -3.6, name: 'Radar Hàng Hải 3D', value: 64000000, isFragile: true },
      { type: 'safe', x: -11.6, y: 2.4, z: 6.8, name: 'Két Hải Quan VIP', value: 125000000, isSuperHeavy: true },
      { type: 'treasure', x: -10.2, y: 2.4, z: 3.8, name: 'Kiện Vàng Nhập Khẩu', value: 92000000 },
      { type: 'tv', x: -12.4, y: 2.4, z: 3.8, name: 'Bảng Điều Khiển Cẩu', value: 52000000, isFragile: true },
      { type: 'fridge', x: -11.8, y: 0, z: 0.0, name: 'Container Lạnh Mini', value: 48000000, isHeavy: true },
      { type: 'drum', x: -7.6, y: 0, z: -0.4, name: 'Thùng Phuy Xăng Dầu', value: 24000000, isRolling: true },
      { type: 'drum', x: -5.4, y: 0, z: 0.4, name: 'Thùng Phuy Hóa Học', value: 24000000, isRolling: true },
      { type: 'sofa', x: -5.4, y: 0, z: -6.8, name: 'Ghế Trạm Điều Phối', value: 26000000, isHeavy: true },
      { type: 'washer', x: -5.4, y: 0, z: 6.8, name: 'Máy Bơm Áp Lực Cao', value: 32000000, isHeavy: true, isVibrating: true },
      { type: 'briefcase', x: -1.4, y: 0, z: 0.0, name: 'Vali Vận Đơn Mật', value: 70000000 },
      { type: 'aquarium', x: -5.2, y: 0, z: 3.4, name: 'Thùng Tôm Hùm Xuất Khẩu', value: 48000000, isFragile: true },
      { type: 'statue', x: -5.2, y: 0, z: -3.4, name: 'Tượng Hải Đăng Vàng', value: 56000000, isFragile: true },
      { type: 'box', x: -10.4, y: 0, z: 1.8, name: 'Kiện Hàng Express', value: 14000000 }
    ]
  },

  12: {
    id: 12,
    chapter: 3,
    name: 'Biệt Thự Tỷ Phú',
    targetItems: 16,
    timeLimit: 145,
    parTime: 105,
    bonusObjective: 'no_any_damage',
    bounds: { minX: -16.5, maxX: 16.5, minZ: -11, maxZ: 11 },
    spawns: [
      { x: -1.6, y: 0.1, z: -1.6 },
      { x: -1.6, y: 0.1, z: 1.6 },
      { x: -3.2, y: 0.1, z: -1.6 },
      { x: -3.2, y: 0.1, z: 1.6 }
    ],
    floorSize: { w: 35, d: 24 },
    floorColor: 0xfef08a,
    wallColor: 0xf43f5e,
    houseZones: [
      { minX: -14.8, maxX: -2.2, minZ: -9.2, maxZ: 9.2, color: 0xfde68a },
      { minX: -2.2, maxX: 2.2, minZ: -9.2, maxZ: 9.2, color: 0xfef3c7 }
    ],
    rooms: [
      { name: 'NW Gold Spa & Master Suite', minX: -14.8, maxX: -5.4, minZ: -9.2, maxZ: 0.0, style: 'bath_tile', color: '#a7f3d0' },
      { name: 'SW Private Vault & Trading', minX: -14.8, maxX: -5.4, minZ: 0.0, maxZ: 9.2, style: 'parquet_lavender', color: '#c4b5fd' },
      {
        name: 'NE Grand Banquet Salon',
        minX: -5.4,
        maxX: 2.2,
        minZ: -9.2,
        maxZ: 0.0,
        style: 'bistro_tile',
        color: '#fef9c3',
        rug: { x: -1.6, z: -4.2, w: 3.0, d: 2.2, color: '#fee2e2', stripe: '#f59e0b' }
      },
      {
        name: 'SE Luxury Lounge',
        minX: -5.4,
        maxX: 2.2,
        minZ: 0.0,
        maxZ: 9.2,
        style: 'polka_pink',
        color: '#f9a8d4',
        rug: { x: -1.2, z: 4.4, w: 3.2, d: 2.2, color: '#fef3c7', stripe: '#f43f5e' }
      },
      { name: 'Upper Trophy Mezzanine', minX: -14.3, maxX: -9.3, minZ: -4.3, maxZ: 4.3, y: 2.4, style: 'parquet_lavender', color: '#fde68a' }
    ],
    doors: [
      { x: -5.4, z: -5.8, dir: 'z', width: 3.2, swingDir: -1, doorColor: 0x991b1b },
      { x: -5.4, z: 5.8, dir: 'z', width: 3.2, swingDir: 1, doorColor: 0x991b1b },
      { x: 2.2, z: 0.0, dir: 'z', width: 4.2, swingDir: -1, doorColor: 0x991b1b }
    ],
    fixtures: [
      { type: 'vanity_sink', x: -10.2, z: -8.5, w: 1.5, d: 0.72, h: 0.96 },
      { type: 'kitchen_island', x: -1.4, z: -8.4, w: 2.2, d: 0.85, h: 0.94 },
      { type: 'coffee_table', x: -1.2, z: 4.4, w: 1.35, d: 0.82, h: 0.46 },
      { type: 'museum_pedestal', x: -13.4, y: 2.4, z: 0.0, w: 0.85, d: 0.85, h: 1.0 },
      { type: 'potted_plant', x: 1.4, z: -8.2 },
      { type: 'potted_plant', x: 1.4, z: 8.2 },
      { type: 'wall_art', x: -10.2, z: 8.92, variant: 2 }
    ],
    roads: [
      { x: 5.6, z: 0, w: 5.6, d: 21.8, lanes: 'z', crosswalk: 0.0 },
      { x: 12.2, z: 0, w: 5.8, d: 21.8 }
    ],
    platforms: [
      { x: -11.8, y: 2.4, z: 0.0, w: 5.0, d: 8.6 }
    ],
    ramps: [
      { minX: -9.3, maxX: -6.0, minZ: -2.2, maxZ: 2.2, yStart: 0, yEnd: 2.4, axis: 'x', dir: -1 }
    ],
    walls: [
      { x: -14.8, y: 1.7, z: 0, w: 0.45, h: 3.4, d: 18.8 },
      { x: -6.3, y: 1.7, z: -9.2, w: 17.4, h: 3.4, d: 0.45 },
      { x: -6.3, y: 1.7, z: 9.2, w: 17.4, h: 3.4, d: 0.45 },
      // Vault Wing painted interior divider (north/south archways >= 3.2m)
      { x: -5.4, y: 1.5, z: 0.0, w: 0.35, h: 3.0, d: 6.4, isInterior: true, wallHex: '#fda4af' },
      // East facade with open grand portico (-2.2..2.2 = 4.4m wide!)
      { x: 2.2, y: 1.7, z: -6.6, w: 0.35, h: 3.4, d: 5.2 },
      { x: 2.2, y: 1.7, z: 6.6, w: 0.35, h: 3.4, d: 5.2 }
    ],
    windows: [
      { id: 'w12_1', x: 2.2, y: 0, z: -3.2, w: 0.25, h: 2.8, d: 2.0, hp: 2, isBroken: false },
      { id: 'w12_2', x: 2.2, y: 0, z: 3.2, w: 0.25, h: 2.8, d: 2.0, hp: 2, isBroken: false }
    ],
    switches: [
      { id: 'm12_traffic', type: 'lever', style: 'traffic', x: 2.4, y: 0, z: 0.0, holdSeconds: 7.0, cooldownSeconds: 3.0 }
    ],
    zones: [
      { type: 'slippery', minX: -4.8, maxX: 1.4, minZ: -8.4, maxZ: -4.4, y: 0 },
      { type: 'conveyor', minX: -13.6, maxX: -6.4, minZ: 5.4, maxZ: 8.2, y: 0, vx: 3.5, vz: 0 }
    ],
    hazards: [
      { type: 'car', axis: 'z', lane: 4.3, dir: 1, from: -12, to: 12, speed: 6.8, offset: 1.5, color: 0xeab308, stopSwitchId: 'm12_traffic' },
      { type: 'car', axis: 'z', lane: 6.9, dir: -1, from: -12, to: 12, speed: 7.4, offset: 8.0, color: 0x0f172a, stopSwitchId: 'm12_traffic' },
      { type: 'patrol', kind: 'robot', speed: 3.6, loop: true, radius: 0.62, points: [[-4.4, -4.6], [1.0, -4.6], [1.0, 4.6], [-4.4, 4.6]] }
    ],
    trampolines: [
      { x: 0.95, y: 0, z: -4.4, r: 1.35 },
      { x: 0.95, y: 0, z: 4.4, r: 1.35 }
    ],
    truck: { x: 12.2, y: 0, z: 0.0, bedW: 4.6, bedD: 5.8, rotY: 0 },
    items: [
      { type: 'piano', x: -12.0, y: 2.4, z: -2.4, name: 'Đại Dương Cầm Kim Cương', value: 180000000, isSuperHeavy: true },
      { type: 'safe', x: -12.0, y: 2.4, z: 2.4, name: 'Két Tỷ Đô Hoàng Gia', value: 250000000, isSuperHeavy: true },
      { type: 'treasure', x: -10.2, y: 2.4, z: 0.0, name: 'Rương Vàng 9999', value: 140000000 },
      { type: 'bed', x: -12.6, y: 0, z: -6.8, name: 'Giường Ngủ Đế Vương', value: 65000000, isHeavy: true },
      { type: 'bookshelf', x: -7.4, y: 0, z: -7.2, name: 'Tủ Sách Cổ Biệt Thự', value: 42000000, isHeavy: true },
      { type: 'toilet', x: -12.8, y: 0, z: -2.4, name: 'Bồn Cầu Vàng Ròng', value: 85000000, isFragile: true },
      { type: 'dining_table', x: -1.6, y: 0, z: -6.4, name: 'Bàn Tiệc Tỷ Phú', value: 58000000, isHeavy: true },
      { type: 'aquarium', x: 0.6, y: 0, z: -6.4, name: 'Bể Cá Rồng Huyết Long', value: 92000000, isFragile: true },
      { type: 'sofa', x: -2.2, y: 0, z: 6.8, name: 'Sofa Da Cá Sấu', value: 54000000, isHeavy: true },
      { type: 'tv', x: 0.4, y: 0, z: 6.8, name: 'Rạp Chiếu 120 Inch', value: 88000000, isFragile: true },
      { type: 'pc', x: -12.2, y: 0, z: 3.4, name: 'Siêu Máy Tính Trading', value: 115000000, isFragile: true },
      { type: 'fridge', x: -12.0, y: 0, z: 6.8, name: 'Tủ Lạnh Rượu Quý', value: 48000000, isHeavy: true },
      { type: 'statue', x: -7.4, y: 0, z: 6.8, name: 'Tượng Kỳ Lân Ngọc', value: 78000000, isFragile: true },
      { type: 'vase', x: -0.2, y: 0, z: -2.8, name: 'Bình Cổ Triều Nguyễn', value: 82000000, isFragile: true },
      { type: 'briefcase', x: -0.2, y: 0, z: 2.8, name: 'Vali Bitcoin Lạnh', value: 160000000 },
      { type: 'pet', x: 0.8, y: 0, z: 0.0, name: 'Chó Quý Tộc Poodle', value: 35000000, isLiving: true }
    ]
  },

  // =========================================================================
  // CHƯƠNG 4: PHÒNG THÍ NGHIỆM & TRẠM KHÔNG GIAN (MAPS 13–16)
  // =========================================================================
  13: {
    id: 13,
    chapter: 4,
    name: 'Phòng Thí Nghiệm Đổi Trọng',
    targetItems: 13,
    timeLimit: 122,
    parTime: 86,
    bonusObjective: 'no_fragile_break',
    bounds: { minX: -15.5, maxX: 15.5, minZ: -9.8, maxZ: 9.8 },
    spawns: [
      { x: -1.8, y: 0.1, z: -1.5 },
      { x: -1.8, y: 0.1, z: 1.5 },
      { x: -3.2, y: 0.1, z: -1.5 },
      { x: -3.2, y: 0.1, z: 1.5 }
    ],
    floorSize: { w: 32, d: 21 },
    floorColor: 0xbae6fd,
    wallColor: 0x38bdf8,
    houseZones: [
      { minX: -13.6, maxX: 2.4, minZ: -8.2, maxZ: 8.2, color: 0xe0f2fe }
    ],
    rooms: [
      { name: 'NW Cryo Bio-Lab', minX: -13.6, maxX: -5.4, minZ: -8.2, maxZ: 0.0, style: 'lab_grid', color: '#bae6fd' },
      { name: 'SW Gravity Reactor', minX: -13.6, maxX: -5.4, minZ: 0.0, maxZ: 8.2, style: 'lab_grid', color: '#a7f3d0' },
      { name: 'East Zero-G Airlock', minX: -5.4, maxX: 2.4, minZ: -8.2, maxZ: 8.2, style: 'space_deck', color: '#cbd5e1' }
    ],
    doors: [
      { x: -5.4, z: -4.4, dir: 'z', width: 3.0, swingDir: -1, doorColor: 0x0284c7 },
      { x: -5.4, z: 4.4, dir: 'z', width: 3.0, swingDir: 1, doorColor: 0x0284c7 },
      { x: 2.4, z: 0.0, dir: 'z', width: 3.6, swingDir: 1, doorColor: 0x0ea5e9 }
    ],
    fixtures: [
      { type: 'lab_bench', x: -12.2, z: -6.8, w: 2.2, d: 0.85, h: 0.92 },
      { type: 'cryo_tank', x: -12.4, z: 6.4, w: 1.15, d: 1.15, h: 2.2 },
      { type: 'server_rack', x: -8.6, z: -7.5, w: 1.6, d: 0.72, h: 2.1 }
    ],
    roads: [
      { x: 9.8, z: 0, w: 6.0, d: 19.6, lanes: 'z' }
    ],
    platforms: [],
    ramps: [],
    walls: [
      { x: -13.6, y: 1.7, z: 0, w: 0.4, h: 3.4, d: 16.8 },
      { x: -5.6, y: 1.7, z: -8.2, w: 16.4, h: 3.4, d: 0.4 },
      { x: -5.6, y: 1.7, z: 8.2, w: 16.4, h: 3.4, d: 0.4 },
      { x: -5.4, y: 1.5, z: 0.0, w: 0.35, h: 3.0, d: 4.6, isInterior: true, wallHex: '#38bdf8' },
      { x: 2.4, y: 1.7, z: -5.6, w: 0.35, h: 3.4, d: 5.2 },
      { x: 2.4, y: 1.7, z: 5.6, w: 0.35, h: 3.4, d: 5.2 }
    ],
    windows: [
      { id: 'w13_1', x: 2.4, y: 0, z: -2.4, w: 0.25, h: 2.8, d: 1.8, hp: 2, isBroken: false },
      { id: 'w13_2', x: 2.4, y: 0, z: 2.4, w: 0.25, h: 2.8, d: 1.8, hp: 2, isBroken: false }
    ],
    switches: [
      { id: 'm13_las', type: 'lever', x: -4.2, y: 0, z: -5.4, holdSeconds: 8.0, cooldownSeconds: 1.5 }
    ],
    lasers: [
      { id: 'l13_1', x1: -5.4, z1: 3.0, x2: -5.4, z2: 5.8, y: 0.9, activeSeconds: 2.4, cooldownSeconds: 2.2, offset: 0, switchId: 'm13_las', invertSwitch: true }
    ],
    zones: [
      { type: 'low_gravity', minX: -5.0, maxX: 1.8, minZ: -5.2, maxZ: 5.2, yMin: -0.5, yMax: 7.0, gravityScale: 0.42 }
    ],
    hazards: [
      {
        type: 'patrol', kind: 'guard', chaser: true, speed: 3.2, chaseSpeed: 4.4, chaseRange: 5.4, chaseRageTrigger: 35,
        leashBounds: { minX: -5.0, maxX: 2.0, minZ: -7.5, maxZ: 7.5 },
        loop: true, radius: 0.62, points: [[-3.8, -6.2], [1.0, -6.2], [1.0, 6.2], [-3.8, 6.2]]
      }
    ],
    trampolines: [
      { x: 4.6, y: 0, z: 0.0, r: 1.4 }
    ],
    truck: { x: 9.8, y: 0, z: 0.0, bedW: 4.5, bedD: 5.2, rotY: 0 },
    items: [
      { type: 'cryo_pod', x: -11.4, y: 0, z: -3.2, name: 'Khoang Đông Lạnh Mẫu X', value: 85000000, isSuperHeavy: true },
      { type: 'server_unit', x: -7.8, y: 0, z: -5.4, name: 'Máy Chủ Phân Tích DNA', value: 58000000, isHeavy: true },
      { type: 'hologram', x: -9.2, y: 0, z: -2.0, name: 'Máy Chiếu Hologram 3D', value: 64000000, isFragile: true },
      { type: 'crystal', x: -11.8, y: 0, z: 2.4, name: 'Tinh Thể Plasma Xanh', value: 78000000, isFragile: true },
      { type: 'crystal', x: -7.8, y: 0, z: 2.2, name: 'Lõi Năng Lượng Tím', value: 76000000, isFragile: true },
      { type: 'fridge', x: -9.8, y: 0, z: 6.4, name: 'Tủ Bảo Quản Vacxin', value: 44000000, isHeavy: true },
      { type: 'pc', x: -7.4, y: 0, z: -2.4, name: 'Siêu Máy Tính Lab', value: 52000000, isFragile: true },
      { type: 'aquarium', x: -11.4, y: 0, z: -0.6, name: 'Bể Sứa Phát Sáng', value: 60000000, isFragile: true },
      { type: 'safe', x: -7.4, y: 0, z: 6.6, name: 'Két Mẫu Vật Mật', value: 98000000, isSuperHeavy: true },
      { type: 'toolbox', x: -3.6, y: 0, z: -6.4, name: 'Hộp Kìm Chống Bức Xạ', value: 18000000 },
      { type: 'vase', x: -0.6, y: 0, z: 4.4, name: 'Ống Nghiệm Pha Lê', value: 42000000, isFragile: true },
      { type: 'drum', x: -0.8, y: 0, z: -4.4, name: 'Bình Khí Nitơ Lỏng', value: 26000000, isRolling: true },
      { type: 'pet', x: -3.4, y: 0, z: 3.4, name: 'Cún Thí Nghiệm Astro', value: 36000000, isLiving: true }
    ]
  },

  14: {
    id: 14,
    chapter: 4,
    name: 'Trạm Server Lượng Tử',
    targetItems: 14,
    timeLimit: 130,
    parTime: 92,
    bonusObjective: 'no_hazard_hit',
    bounds: { minX: -16.0, maxX: 16.0, minZ: -10.2, maxZ: 10.2 },
    spawns: [
      { x: -4.4, y: 0.1, z: -1.6 },
      { x: -4.4, y: 0.1, z: 1.6 },
      { x: -5.8, y: 0.1, z: -1.6 },
      { x: -5.8, y: 0.1, z: 1.6 }
    ],
    floorSize: { w: 34, d: 22 },
    floorColor: 0xcbd5e1,
    wallColor: 0xa855f7,
    houseZones: [
      { minX: -14.2, maxX: -2.8, minZ: -8.6, maxZ: 8.6, color: 0xe2e8f0 },
      { minX: 3.4, maxX: 7.4, minZ: -8.6, maxZ: 8.6, color: 0xf1f5f9 }
    ],
    rooms: [
      { name: 'West Mainframe Hall', minX: -14.2, maxX: -2.8, minZ: -8.6, maxZ: 8.6, style: 'space_deck', color: '#cbd5e1' },
      { name: 'Quantum Mezzanine', minX: -13.8, maxX: -9.2, minZ: -4.2, maxZ: 4.2, y: 2.4, style: 'lab_grid', color: '#e9d5ff' },
      { name: 'East Upload Pad', minX: 3.4, maxX: 7.4, minZ: -8.6, maxZ: 8.6, style: 'lab_grid', color: '#bae6fd' }
    ],
    doors: [
      { x: -2.8, z: 0.0, dir: 'z', width: 3.2, swingDir: 1, doorColor: 0x7c3aed }
    ],
    fixtures: [
      { type: 'server_rack', x: -12.8, z: -7.5, w: 1.8, d: 0.72, h: 2.1 },
      { type: 'server_rack', x: -8.2, z: -7.5, w: 1.8, d: 0.72, h: 2.1 },
      { type: 'lab_bench', x: -11.6, y: 2.4, z: 0.0, w: 1.6, d: 0.85, h: 0.92 },
      { type: 'control_desk', x: 5.2, z: -7.4, w: 1.7, d: 0.72, h: 0.90 }
    ],
    roads: [
      { x: 11.4, z: 0, w: 6.2, d: 20.8, lanes: 'z' }
    ],
    platforms: [
      { x: -11.5, y: 2.4, z: 0.0, w: 4.6, d: 8.4 }
    ],
    ramps: [],
    walls: [
      { x: -14.2, y: 1.7, z: 0, w: 0.4, h: 3.4, d: 17.6 },
      { x: -8.5, y: 1.7, z: -8.6, w: 11.8, h: 3.4, d: 0.4 },
      { x: -8.5, y: 1.7, z: 8.6, w: 11.8, h: 3.4, d: 0.4 },
      { x: -2.8, y: 1.7, z: -5.4, w: 0.35, h: 3.4, d: 6.4 },
      { x: -2.8, y: 1.7, z: 5.4, w: 0.35, h: 3.4, d: 6.4 }
    ],
    windows: [],
    pits: [
      { minX: -2.8, maxX: 3.4, minZ: -8.4, maxZ: -1.8 },
      { minX: -2.8, maxX: 3.4, minZ: 1.8, maxZ: 8.4 }
    ],
    switches: [
      { id: 'm14_br', type: 'lever', x: -3.8, y: 0, z: -3.2, holdSeconds: 11.0, cooldownSeconds: 1.2 },
      { id: 'm14_las', type: 'plate', x: -3.8, y: 0, z: 3.2, r: 0.9, holdSeconds: 7.0 }
    ],
    gates: [
      { id: 'm14_bridge1', kind: 'bridge', x: 0.3, y: 0, z: -4.8, w: 6.6, d: 3.0, switchIds: ['m14_br'], speed: 3.2 }
    ],
    lasers: [
      { id: 'l14_1', x1: -7.2, z1: -6.2, x2: -7.2, z2: -2.2, y: 0.9, activeSeconds: 2.2, cooldownSeconds: 2.4, offset: 0, switchId: 'm14_las', invertSwitch: true },
      { id: 'l14_2', x1: -7.2, z1: 2.2, x2: -7.2, z2: 6.2, y: 0.9, activeSeconds: 2.2, cooldownSeconds: 2.4, offset: 2.2, switchId: 'm14_las', invertSwitch: true }
    ],
    elevators: [
      { x: -7.6, z: 0.0, w: 2.8, d: 3.4, yMin: 0, yMax: 2.4, speed: 1.8, pauseSec: 1.2, offset: 0 }
    ],
    zones: [
      { type: 'conveyor', minX: -12.6, maxX: -3.4, minZ: -1.3, maxZ: 1.3, y: 0, vx: 3.6, vz: 0 },
      { type: 'low_gravity', minX: 3.8, maxX: 7.0, minZ: -4.6, maxZ: 4.6, yMin: -0.5, yMax: 7.0, gravityScale: 0.45 }
    ],
    hazards: [
      {
        type: 'patrol', kind: 'drone', chaser: true, speed: 3.6, chaseSpeed: 4.8, chaseRange: 5.5, chaseRageTrigger: 30,
        leashBounds: { minX: -8.5, maxX: -3.2, minZ: -7.5, maxZ: 7.5 },
        loop: true, radius: 0.62, points: [[-6.4, -6.2], [-3.8, -6.2], [-3.8, 6.2], [-6.4, 6.2]]
      }
    ],
    trampolines: [
      { x: 5.6, y: 0, z: -4.2, r: 1.35 },
      { x: 5.6, y: 0, z: 4.2, r: 1.35 }
    ],
    truck: { x: 11.4, y: 0, z: 0.0, bedW: 4.5, bedD: 5.4, rotY: 0 },
    items: [
      { type: 'server_unit', x: -11.8, y: 2.4, z: -2.8, name: 'Cụm CPU Lượng Tử A', value: 88000000, isHeavy: true },
      { type: 'cryo_pod', x: -11.8, y: 2.4, z: 2.8, name: 'Hệ Làm Mát Siêu Dẫn', value: 94000000, isSuperHeavy: true },
      { type: 'hologram', x: -10.0, y: 2.4, z: -2.6, name: 'Màn Chiếu Ma Trận', value: 68000000, isFragile: true },
      { type: 'crystal', x: -10.0, y: 2.4, z: 2.6, name: 'Chip Kim Cương Qubit', value: 82000000, isFragile: true },
      { type: 'generator', x: -12.2, y: 0, z: -5.4, name: 'Nguồn Dự Phòng UPS', value: 72000000, isSuperHeavy: true, isVibrating: true },
      { type: 'safe', x: -12.2, y: 0, z: 5.4, name: 'Két Ổ Cứng Mật', value: 120000000, isSuperHeavy: true },
      { type: 'server_unit', x: -9.8, y: 0, z: 5.8, name: 'Tủ Server Backup B', value: 58000000, isHeavy: true },
      { type: 'pc', x: -5.2, y: 0, z: -6.4, name: 'Máy Trạm Giám Sát', value: 54000000, isFragile: true },
      { type: 'tv', x: -5.2, y: 0, z: 6.4, name: 'Màn Hình Radar Dữ Liệu', value: 48000000, isFragile: true },
      { type: 'briefcase', x: -1.0, y: 0, z: 0.0, name: 'Vali Mã Khóa RSA', value: 75000000 },
      { type: 'toolbox', x: -10.2, y: 0, z: -1.8, name: 'Bộ Cáp Quang Vàng', value: 24000000 },
      { type: 'satellite', x: 5.2, y: 0, z: -5.6, name: 'Đĩa Vệ Tinh Thu Sóng', value: 78000000, isFragile: true },
      { type: 'box', x: -5.4, y: 0, z: 1.6, name: 'Thùng RAM Siêu Tốc', value: 22000000 },
      { type: 'drum', x: -9.4, y: 0, z: 1.8, name: 'Bình Làm Mát Argon', value: 28000000, isRolling: true }
    ]
  },

  15: {
    id: 15,
    chapter: 4,
    name: 'Phim Trường Sci-Fi Hollywood',
    targetItems: 15,
    timeLimit: 136,
    parTime: 96,
    bonusObjective: 'no_glass',
    bounds: { minX: -16.2, maxX: 16.2, minZ: -10.5, maxZ: 10.5 },
    spawns: [
      { x: -1.6, y: 0.1, z: -1.4 },
      { x: -1.6, y: 0.1, z: 1.4 },
      { x: -3.2, y: 0.1, z: -1.4 },
      { x: -3.2, y: 0.1, z: 1.4 }
    ],
    floorSize: { w: 34, d: 23 },
    floorColor: 0x0ea5e9,
    wallColor: 0x0284c7,
    houseZones: [
      { minX: -14.4, maxX: 2.2, minZ: -9.0, maxZ: 9.0, color: 0xe0f2fe }
    ],
    rooms: [
      { name: 'Stage A • Alien Moon Set', minX: -14.4, maxX: -5.2, minZ: -9.0, maxZ: 0.0, style: 'space_deck', color: '#94a3b8' },
      { name: 'Stage B • Starship Bridge', minX: -14.4, maxX: -5.2, minZ: 0.0, maxZ: 9.0, style: 'lab_grid', color: '#bae6fd' },
      { name: 'Studio Backlot & Green Lounge', minX: -5.2, maxX: 2.2, minZ: -9.0, maxZ: 9.0, style: 'bistro_tile', color: '#fef3c7' }
    ],
    doors: [
      { x: -5.2, z: -5.0, dir: 'z', width: 3.2, swingDir: -1, doorColor: 0x0369a1 },
      { x: -5.2, z: 5.0, dir: 'z', width: 3.2, swingDir: 1, doorColor: 0x0369a1 },
      { x: 2.2, z: 0.0, dir: 'z', width: 4.0, swingDir: 1, doorColor: 0x0ea5e9 }
    ],
    fixtures: [
      { type: 'spotlight_rig', x: -12.6, z: -7.8, w: 1.2, d: 1.2, h: 2.4 },
      { type: 'spotlight_rig', x: -12.6, z: 7.8, w: 1.2, d: 1.2, h: 2.4 },
      { type: 'lab_bench', x: -9.2, z: 7.8, w: 2.2, d: 0.85, h: 0.92 },
      { type: 'potted_plant', x: 1.4, z: -8.0 }
    ],
    roads: [
      { x: 5.6, z: 0, w: 5.4, d: 21.2, lanes: 'z', crosswalk: 0.0 },
      { x: 12.0, z: 0, w: 5.8, d: 21.2 }
    ],
    platforms: [],
    ramps: [],
    walls: [
      { x: -14.4, y: 1.7, z: 0, w: 0.45, h: 3.4, d: 18.4 },
      { x: -6.1, y: 1.7, z: -9.0, w: 17.0, h: 3.4, d: 0.45 },
      { x: -6.1, y: 1.7, z: 9.0, w: 17.0, h: 3.4, d: 0.45 },
      { x: -5.2, y: 1.5, z: 0.0, w: 0.35, h: 3.0, d: 5.2, isInterior: true, wallHex: '#38bdf8' },
      { x: 2.2, y: 1.7, z: -6.4, w: 0.35, h: 3.4, d: 5.2 },
      { x: 2.2, y: 1.7, z: 6.4, w: 0.35, h: 3.4, d: 5.2 }
    ],
    windows: [
      { id: 'w15_1', x: 2.2, y: 0, z: -3.0, w: 0.25, h: 2.8, d: 1.9, hp: 2, isBroken: false },
      { id: 'w15_2', x: 2.2, y: 0, z: 3.0, w: 0.25, h: 2.8, d: 1.9, hp: 2, isBroken: false }
    ],
    switches: [
      { id: 'm15_traffic', type: 'lever', style: 'traffic', x: 2.4, y: 0, z: 0.0, holdSeconds: 7.0, cooldownSeconds: 3.0 }
    ],
    lasers: [
      { id: 'l15_1', x1: -5.2, z1: -1.6, x2: -1.2, z2: -1.6, y: 0.9, activeSeconds: 2.4, cooldownSeconds: 2.6, offset: 0.5 }
    ],
    zones: [
      { type: 'low_gravity', minX: -13.6, maxX: -6.0, minZ: -8.2, maxZ: -1.0, yMin: -0.5, yMax: 7.0, gravityScale: 0.38 }
    ],
    hazards: [
      { type: 'car', axis: 'z', lane: 4.3, dir: 1, from: -11.5, to: 11.5, speed: 6.4, offset: 1.0, color: 0x38bdf8, stopSwitchId: 'm15_traffic' },
      { type: 'car', axis: 'z', lane: 6.9, dir: -1, from: -11.5, to: 11.5, speed: 7.0, offset: 7.0, color: 0xa855f7, stopSwitchId: 'm15_traffic' },
      {
        type: 'patrol', kind: 'guard', chaser: true, speed: 3.3, chaseSpeed: 4.5, chaseRange: 5.2, chaseRageTrigger: 35,
        leashBounds: { minX: -4.8, maxX: 1.8, minZ: -8.0, maxZ: 8.0 },
        loop: true, radius: 0.62, points: [[-4.0, -6.4], [0.8, -6.4], [0.8, 6.4], [-4.0, 6.4]]
      }
    ],
    trampolines: [
      { x: 0.9, y: 0, z: -4.6, r: 1.35 },
      { x: 0.9, y: 0, z: 4.6, r: 1.35 }
    ],
    truck: { x: 12.0, y: 0, z: 0.0, bedW: 4.5, bedD: 5.6, rotY: 0 },
    items: [
      { type: 'clapperboard', x: -11.6, y: 0, z: -4.8, name: 'Bảng Cảnh Quay Bom Tấn', value: 38000000 },
      { type: 'satellite', x: -8.2, y: 0, z: -6.2, name: 'Vệ Tinh Đạo Cụ Phim', value: 84000000, isFragile: true },
      { type: 'cryo_pod', x: -11.4, y: 0, z: 2.8, name: 'Buồng Ngủ Phi Hành Gia', value: 92000000, isSuperHeavy: true },
      { type: 'hologram', x: -8.4, y: 0, z: 2.6, name: 'Bản Đồ Thiên Hà 3D', value: 74000000, isFragile: true },
      { type: 'crystal', x: -8.2, y: 0, z: -2.6, name: 'Thiên Thạch Krypton', value: 76000000, isFragile: true },
      { type: 'sofa', x: -1.8, y: 0, z: 6.4, name: 'Ghế Sofa Đạo Diễn', value: 42000000, isHeavy: true },
      { type: 'piano', x: -12.0, y: 0, z: 5.4, name: 'Đàn Synth Giao Hưởng', value: 110000000, isSuperHeavy: true },
      { type: 'server_unit', x: -8.0, y: 0, z: 5.6, name: 'Tủ Điều Khiển Kỹ Xảo', value: 62000000, isHeavy: true },
      { type: 'tv', x: 0.6, y: 0, z: 6.4, name: 'Màn Hình Giám Sát Cảnh', value: 68000000, isFragile: true },
      { type: 'statue', x: -3.2, y: 0, z: -6.4, name: 'Tượng Oscar Phi Hành', value: 88000000, isFragile: true },
      { type: 'bookshelf', x: -1.6, y: 0, z: -6.6, name: 'Tủ Kịch Bản Sci-Fi', value: 36000000, isHeavy: true },
      { type: 'drum', x: -10.8, y: 0, z: -2.2, name: 'Thùng Khói Kỹ Xảo', value: 24000000, isRolling: true },
      { type: 'clapperboard', x: 0.2, y: 0, z: -2.4, name: 'Bảng Cắt Cảnh Final', value: 34000000 },
      { type: 'briefcase', x: -3.4, y: 0, z: 2.6, name: 'Vali Cuộn Phim IMAX', value: 65000000 },
      { type: 'pet', x: 0.4, y: 0, z: 1.6, name: 'Mèo Diễn Viên Không Gian', value: 45000000, isLiving: true }
    ]
  },

  16: {
    id: 16,
    chapter: 4,
    name: 'Trạm Không Gian Apex',
    targetItems: 16,
    timeLimit: 150,
    parTime: 108,
    bonusObjective: 'no_any_damage',
    bounds: { minX: -16.5, maxX: 16.5, minZ: -11.0, maxZ: 11.0 },
    spawns: [
      { x: -1.6, y: 0.1, z: -1.6 },
      { x: -1.6, y: 0.1, z: 1.6 },
      { x: -3.2, y: 0.1, z: -1.6 },
      { x: -3.2, y: 0.1, z: 1.6 }
    ],
    floorSize: { w: 35, d: 24 },
    floorColor: 0x0f172a,
    wallColor: 0x22d3ee,
    houseZones: [
      { minX: -14.8, maxX: 2.2, minZ: -9.2, maxZ: 9.2, color: 0xe2e8f0 }
    ],
    rooms: [
      { name: 'NW Cryo Fusion Wing', minX: -14.8, maxX: -5.4, minZ: -9.2, maxZ: 0.0, style: 'lab_grid', color: '#bae6fd' },
      { name: 'SW Quantum Hangar', minX: -14.8, maxX: -5.4, minZ: 0.0, maxZ: 9.2, style: 'space_deck', color: '#cbd5e1' },
      { name: 'East Zero-G Atrium', minX: -5.4, maxX: 2.2, minZ: -9.2, maxZ: 9.2, style: 'space_deck', color: '#e0f2fe' },
      { name: 'Upper Command Deck', minX: -14.3, maxX: -9.3, minZ: -4.2, maxZ: 4.2, y: 2.4, style: 'lab_grid', color: '#ddd6fe' }
    ],
    doors: [
      { x: -5.4, z: -5.8, dir: 'z', width: 3.2, swingDir: -1, doorColor: 0x06b6d4 },
      { x: -5.4, z: 5.8, dir: 'z', width: 3.2, swingDir: 1, doorColor: 0x06b6d4 },
      { x: 2.2, z: 0.0, dir: 'z', width: 4.2, swingDir: 1, doorColor: 0x22d3ee }
    ],
    fixtures: [
      { type: 'cryo_tank', x: -13.2, z: -7.8, w: 1.2, d: 1.2, h: 2.2 },
      { type: 'server_rack', x: -8.6, z: -8.2, w: 1.8, d: 0.72, h: 2.1 },
      { type: 'lab_bench', x: -12.6, y: 2.4, z: 0.0, w: 1.6, d: 0.85, h: 0.92 },
      { type: 'spotlight_rig', x: 1.2, z: -8.0, w: 1.1, d: 1.1, h: 2.4 },
      { type: 'spotlight_rig', x: 1.2, z: 8.0, w: 1.1, d: 1.1, h: 2.4 }
    ],
    roads: [
      { x: 11.8, z: 0, w: 6.2, d: 21.8, lanes: 'z' }
    ],
    platforms: [
      { x: -11.8, y: 2.4, z: 0.0, w: 5.0, d: 8.4 }
    ],
    ramps: [
      { minX: -9.3, maxX: -6.0, minZ: -2.0, maxZ: 2.0, yStart: 0, yEnd: 2.4, axis: 'x', dir: -1 }
    ],
    walls: [
      { x: -14.8, y: 1.7, z: 0, w: 0.45, h: 3.4, d: 18.8 },
      { x: -6.3, y: 1.7, z: -9.2, w: 17.4, h: 3.4, d: 0.45 },
      { x: -6.3, y: 1.7, z: 9.2, w: 17.4, h: 3.4, d: 0.45 },
      { x: -5.4, y: 1.5, z: 0.0, w: 0.35, h: 3.0, d: 6.4, isInterior: true, wallHex: '#0ea5e9' },
      { x: 2.2, y: 1.7, z: -6.6, w: 0.35, h: 3.4, d: 5.2 },
      { x: 2.2, y: 1.7, z: 6.6, w: 0.35, h: 3.4, d: 5.2 }
    ],
    windows: [
      { id: 'w16_1', x: 2.2, y: 0, z: -3.2, w: 0.25, h: 2.8, d: 2.0, hp: 2, isBroken: false },
      { id: 'w16_2', x: 2.2, y: 0, z: 3.2, w: 0.25, h: 2.8, d: 2.0, hp: 2, isBroken: false }
    ],
    pits: [
      { minX: 3.2, maxX: 7.4, minZ: -8.6, maxZ: -2.4 },
      { minX: 3.2, maxX: 7.4, minZ: 2.4, maxZ: 8.6 }
    ],
    switches: [
      { id: 'm16_las', type: 'lever', x: 2.5, y: 0, z: -1.8, holdSeconds: 9.0, cooldownSeconds: 1.5 },
      { id: 'm16_br', type: 'plate', x: 2.5, y: 0, z: 1.8, r: 0.9, holdSeconds: 9.0 }
    ],
    gates: [
      { id: 'm16_bridge', kind: 'bridge', x: 5.3, y: 0, z: -5.4, w: 4.6, d: 3.0, switchIds: ['m16_br'], speed: 3.2 }
    ],
    lasers: [
      { id: 'l16_1', x1: -5.4, z1: -7.2, x2: -5.4, z2: -4.4, y: 0.9, activeSeconds: 2.2, cooldownSeconds: 2.4, offset: 0, switchId: 'm16_las', invertSwitch: true },
      { id: 'l16_2', x1: -5.4, z1: 4.4, x2: -5.4, z2: 7.2, y: 0.9, activeSeconds: 2.2, cooldownSeconds: 2.4, offset: 2.2, switchId: 'm16_las', invertSwitch: true }
    ],
    elevators: [
      { x: -11.8, z: -6.2, w: 2.8, d: 2.8, yMin: 0, yMax: 2.4, speed: 1.8, pauseSec: 1.2, offset: 0 }
    ],
    zones: [
      { type: 'low_gravity', minX: -4.8, maxX: 1.6, minZ: -5.4, maxZ: 5.4, yMin: -0.5, yMax: 7.0, gravityScale: 0.36 },
      { type: 'conveyor', minX: -13.6, maxX: -6.4, minZ: 5.6, maxZ: 8.2, y: 0, vx: 3.5, vz: 0 },
      { type: 'wind', minX: 3.0, maxX: 7.8, minZ: -2.2, maxZ: 2.2, yMin: -1, yMax: 7, fx: 4.2, fz: 0, fanX: 2.8, fanZ: 0 }
    ],
    hazards: [
      {
        type: 'patrol', kind: 'drone', chaser: true, speed: 3.8, chaseSpeed: 5.0, chaseRange: 5.6, chaseRageTrigger: 30,
        leashBounds: { minX: -4.8, maxX: 1.8, minZ: -8.2, maxZ: 8.2 },
        loop: true, radius: 0.62, points: [[-4.0, -6.8], [0.8, -6.8], [0.8, 6.8], [-4.0, 6.8]]
      },
      {
        type: 'patrol', kind: 'guard', chaser: true, speed: 3.1, chaseSpeed: 4.3, chaseRange: 4.8, chaseRageTrigger: 40,
        leashBounds: { minX: -14.0, maxX: -6.0, minZ: -8.5, maxZ: 8.5 },
        loop: true, radius: 0.62, points: [[-10.4, -7.2], [-6.6, -7.2], [-6.6, 7.2], [-10.4, 7.2]]
      }
    ],
    trampolines: [
      { x: 5.2, y: 0, z: 0.0, r: 1.4 },
      { x: 0.9, y: 0, z: -6.8, r: 1.3 }
    ],
    truck: { x: 11.8, y: 0, z: 0.0, bedW: 4.6, bedD: 5.8, rotY: 0 },
    items: [
      { type: 'satellite', x: -11.8, y: 2.4, z: -2.4, name: 'Vệ Tinh Chỉ Huy Apex', value: 165000000, isFragile: true },
      { type: 'safe', x: -11.8, y: 2.4, z: 2.4, name: 'Két Lõi Phản Vật Chất', value: 240000000, isSuperHeavy: true },
      { type: 'hologram', x: -10.0, y: 2.4, z: 0.0, name: 'Bản Đồ Vũ Trụ Hologram', value: 110000000, isFragile: true },
      { type: 'cryo_pod', x: -12.4, y: 0, z: -4.2, name: 'Khoang Đông Phi Hành Trưởng', value: 125000000, isSuperHeavy: true },
      { type: 'server_unit', x: -7.8, y: 0, z: -6.2, name: 'Siêu Máy Chủ Điều Hướng', value: 78000000, isHeavy: true },
      { type: 'crystal', x: -7.8, y: 0, z: -3.0, name: 'Tinh Thể Quang Tử Alpha', value: 98000000, isFragile: true },
      { type: 'generator', x: -12.6, y: 0, z: 3.4, name: 'Lò Phản Ứng Mini', value: 115000000, isSuperHeavy: true, isVibrating: true },
      { type: 'piano', x: -12.0, y: 0, z: 6.8, name: 'Đại Dương Cầm Không Trọng Lực', value: 175000000, isSuperHeavy: true },
      { type: 'treasure', x: -7.6, y: 0, z: 6.8, name: 'Rương Thiên Thạch Vàng', value: 145000000 },
      { type: 'pc', x: -7.6, y: 0, z: 3.2, name: 'Trạm Radar Không Gian', value: 84000000, isFragile: true },
      { type: 'clapperboard', x: -2.2, y: 0, z: -6.6, name: 'Nhật Ký Sứ Mệnh Apex', value: 42000000 },
      { type: 'aquarium', x: 0.2, y: 0, z: -4.6, name: 'Bể San Hô Vũ Trụ', value: 94000000, isFragile: true },
      { type: 'crystal', x: 0.2, y: 0, z: 4.6, name: 'Lõi Sao Chổi Băng', value: 96000000, isFragile: true },
      { type: 'drum', x: -2.4, y: 0, z: 6.6, name: 'Bình Nhiên Liệu Đẩy Ion', value: 32000000, isRolling: true },
      { type: 'briefcase', x: -0.2, y: 0, z: 0.0, name: 'Vali Hộp Đen Trạm Vũ Trụ', value: 155000000 },
      { type: 'pet', x: -2.6, y: 0, z: 2.6, name: 'Thú Cưng Robot Astro', value: 65000000, isLiving: true }
    ]
  }
};
