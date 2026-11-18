// =========================================================================
// MOVING CHAOS - GLOBAL CONFIG & GAME DEFINITIONS
// =========================================================================

export const CONFIG = {
  CANVAS_WIDTH: 1060,
  CANVAS_HEIGHT: 650,
  FLOOR_Y: 580,
  GRAVITY: 0.45,
  TIME_STEP: 1 / 60,
  MAX_DELTA: 0.1,

  // Player defaults
  PLAYER_SPEED: 4.8,
  JUMP_POWER_NORMAL: -10.5,
  JUMP_POWER_HEAVY: -7.5,
  STUN_DURATION: 1.8,

  // Colors
  COLORS: {
    P1_SUIT: '#2980b9',
    P1_HAT: '#f1c40f',
    P2_SUIT: '#e67e22',
    P2_HAT: '#00cec9',
    GLASS: 'rgba(129, 236, 236, 0.45)',
    GLASS_BORDER: '#81ecec',
    TRUCK_BODY: '#e67e22',
    TRUCK_BED: '#2c3e50',
    TRAMPOLINE: '#2980b9'
  }
};

export const LEVELS = {
  1: {
    id: 1,
    name: 'Nhà Phố 2 Tầng',
    targetItems: 8,
    timeLimit: 70,
    trampoline: { x: 650, y: 545, w: 110, h: 35 },
    truck: { x: 820, y: 430, w: 220, h: 155, bedX: 840, bedY: 480, bedW: 160, bedH: 95 },
    platforms: [
      { x: 40, y: 580, w: 580, h: 20, isFloor: true },
      { x: 40, y: 420, w: 460, h: 16, isFloor: true },
      { x: 40, y: 260, w: 420, h: 16, isFloor: true },
      { x: 30, y: 120, w: 16, h: 480, isWall: true },
      { x: 500, y: 276, w: 16, h: 144, isWall: true }
    ],
    windows: [
      { id: 'w1_1', x: 494, y: 326, w: 14, h: 94, hp: 2, maxHp: 2, isBroken: false }
    ],
    items: [
      { type: 'box', x: 120, y: 530, name: 'Thùng Quần Áo', value: 500000 },
      { type: 'chair', x: 220, y: 530, name: 'Ghế Gỗ Sồi', value: 800000 },
      { type: 'tv', x: 160, y: 370, name: 'Tivi Màn Hình Cong', value: 15000000, isFragile: true },
      { type: 'vase', x: 340, y: 370, name: 'Bình Hoa Pha Lê', value: 6500000, isFragile: true },
      { type: 'fan', x: 420, y: 370, name: 'Quạt Cây Điện Cơ', value: 450000 },
      { type: 'sofa', x: 140, y: 210, name: 'Sofa Da Bò', value: 12000000, isHeavy: true },
      { type: 'lamp', x: 280, y: 210, name: 'Đèn Cây Cổ Điển', value: 1200000 },
      { type: 'aquarium', x: 360, y: 210, name: 'Bể Cá Vàng Mini', value: 3500000, isFragile: true }
    ]
  },
  2: {
    id: 2,
    name: 'Chung Cư 3 Tầng',
    targetItems: 12,
    timeLimit: 85,
    trampoline: { x: 640, y: 545, w: 115, h: 35 },
    truck: { x: 820, y: 430, w: 220, h: 155, bedX: 840, bedY: 480, bedW: 160, bedH: 95 },
    platforms: [
      { x: 40, y: 580, w: 560, h: 20, isFloor: true },
      { x: 40, y: 440, w: 440, h: 16, isFloor: true },
      { x: 40, y: 300, w: 420, h: 16, isFloor: true },
      { x: 40, y: 160, w: 380, h: 16, isFloor: true },
      { x: 30, y: 80, w: 16, h: 520, isWall: true },
      { x: 480, y: 316, w: 16, h: 124, isWall: true },
      { x: 460, y: 176, w: 16, h: 124, isWall: true }
    ],
    windows: [
      { id: 'w2_1', x: 474, y: 340, w: 14, h: 100, hp: 2, maxHp: 2, isBroken: false },
      { id: 'w2_2', x: 454, y: 200, w: 14, h: 100, hp: 2, maxHp: 2, isBroken: false }
    ],
    items: [
      { type: 'box', x: 100, y: 530, name: 'Thùng Sách Vở', value: 600000 },
      { type: 'microwave', x: 240, y: 530, name: 'Lò Vi Sóng', value: 2500000 },
      { type: 'tv', x: 140, y: 390, name: 'Tivi OLED 65"', value: 24000000, isFragile: true },
      { type: 'vase', x: 320, y: 390, name: 'Bình Gốm Cổ', value: 14000000, isFragile: true },
      { type: 'guitar', x: 220, y: 390, name: 'Đàn Guitar Điện', value: 4800000 },
      { type: 'sofa', x: 120, y: 250, name: 'Sofa Băng Đôi', value: 15000000, isHeavy: true },
      { type: 'fridge', x: 300, y: 240, name: 'Tủ Lạnh 2 Cánh', value: 18000000, isHeavy: true },
      { type: 'aquarium', x: 370, y: 250, name: 'Bể Thủy Sinh', value: 5500000, isFragile: true },
      { type: 'box', x: 100, y: 110, name: 'Hộp Đồ Kỷ Niệm', value: 800000 },
      { type: 'clock', x: 180, y: 110, name: 'Đồng Hồ Quả Lắc', value: 7500000, isFragile: true },
      { type: 'plant', x: 260, y: 110, name: 'Chậu Kim Tiền', value: 1600000 },
      { type: 'teddy', x: 340, y: 110, name: 'Gấu Bông Khổng Lồ', value: 1200000 }
    ]
  },
  3: {
    id: 3,
    name: 'Biệt Thự Đại Gia',
    targetItems: 14,
    timeLimit: 95,
    trampoline: { x: 620, y: 545, w: 125, h: 35 },
    truck: { x: 820, y: 430, w: 220, h: 155, bedX: 840, bedY: 480, bedW: 160, bedH: 95 },
    platforms: [
      { x: 40, y: 580, w: 540, h: 20, isFloor: true },
      { x: 40, y: 440, w: 420, h: 16, isFloor: true },
      { x: 40, y: 290, w: 400, h: 16, isFloor: true },
      { x: 40, y: 140, w: 360, h: 16, isFloor: true },
      { x: 30, y: 60, w: 16, h: 540, isWall: true }
    ],
    windows: [
      { id: 'w3_1', x: 474, y: 340, w: 14, h: 100, hp: 2, maxHp: 2, isBroken: false },
      { id: 'w3_2', x: 434, y: 190, w: 14, h: 100, hp: 2, maxHp: 2, isBroken: false }
    ],
    items: [
      { type: 'piano', x: 180, y: 520, name: 'Đại Dương Cầm Steinway', value: 85000000, isSuperHeavy: true },
      { type: 'safe', x: 320, y: 530, name: 'Két Sắt Kim Cương', value: 120000000, isSuperHeavy: true },
      { type: 'statue', x: 140, y: 390, name: 'Tượng Thần Tài Mạ Vàng', value: 45000000, isFragile: true },
      { type: 'tv', x: 260, y: 390, name: 'Màn Hình 85 Inch 8K', value: 65000000, isFragile: true },
      { type: 'vase', x: 360, y: 390, name: 'Bình Cổ Thời Càn Long', value: 95000000, isFragile: true },
      { type: 'fridge', x: 120, y: 230, name: 'Tủ Rượu Vang Pháp', value: 55000000, isHeavy: true, isFragile: true },
      { type: 'sofa', x: 240, y: 240, name: 'Ghế Massage Da Ý', value: 38000000, isHeavy: true },
      { type: 'aquarium', x: 340, y: 240, name: 'Hồ Cá Rồng Hoàng Gia', value: 42000000, isFragile: true },
      { type: 'flamingo', x: 100, y: 90, name: 'Tượng Chim Hồng Hạc', value: 3500000 },
      { type: 'pc', x: 180, y: 90, name: 'Dàn PC RTX 5090', value: 98000000, isFragile: true },
      { type: 'box', x: 260, y: 90, name: 'Hộp Trang Sức Quý', value: 18000000 },
      { type: 'lamp', x: 320, y: 90, name: 'Đèn Chùm Pha Lê', value: 28000000, isFragile: true },
      { type: 'box', x: 80, y: 240, name: 'Vali Hàng Hiệu', value: 15000000 },
      { type: 'box', x: 80, y: 390, name: 'Hòm Sách Hiếm', value: 8000000 }
    ]
  }
};

