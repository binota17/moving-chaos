// =========================================================================
// BILINGUAL LOCALIZATION (VIETNAMESE / ENGLISH) FOR MOVING CHAOS 3D DEMO
// =========================================================================

let currentLang = 'vi';

const LEVEL_I18N = {
  1: {
    vi: { name: '🏠 1. Nhà Phố Khởi Động', shortDesc: '8 món • Hàng rào ném qua, 1 cửa kính & bạt lò xo.', bonusLabel: 'Không làm vỡ cửa kính' },
    en: { name: '🏠 1. Starter Home', shortDesc: '8 items • Toss over the fence, 1 glass panel & trampoline.', bonusLabel: 'Keep all glass intact' }
  },
  2: {
    vi: { name: '👻 2. Biệt Thự Ma Ám', shortDesc: '10 món • Xe đậu dưới, Ma tuần tra & Công tắc mở cửa.', bonusLabel: 'Không vỡ món đồ dễ vỡ nào' },
    en: { name: '👻 2. Haunted Manor', shortDesc: '10 items • South truck dock, Ghosts & Rolling shutter.', bonusLabel: 'Break zero fragile items' }
  },
  3: {
    vi: { name: '🚗 3. Đại Lộ Giờ Cao Điểm', shortDesc: '12 món • 2 nhà đối diện phố, Xe hơi chạy & Đèn đỏ.', bonusLabel: 'Không để xe tông người hay đồ' },
    en: { name: '🚗 3. Rush Hour Avenue', shortDesc: '12 items • Live 2-lane street, Traffic cars & Crosswalk light.', bonusLabel: 'Zero traffic collisions' }
  },
  4: {
    vi: { name: '🍳 4. Nhà Hàng Bếp Lửa', shortDesc: '12 món • Sàn dầu trơn, Quầy bar ném qua & Đầu bếp.', bonusLabel: 'Giữ nguyên vẹn cả 2 cửa kính' },
    en: { name: '🍳 4. 5-Star Kitchen', shortDesc: '12 items • Greasy slick floors, Bar toss & Patrolling Chef.', bonusLabel: 'Keep both glass windows intact' }
  },
  5: {
    vi: { name: '🏗️ 5. Công Trường Thang Nâng', shortDesc: '14 món • Thang nâng 3 tầng, Hố sâu, Cầu rút & Quạt gió.', bonusLabel: 'Bảo vệ nguyên toàn bộ đồ dễ vỡ' },
    en: { name: '🏗️ 5. Sky Crane Site', shortDesc: '14 items • Elevators, Pits, Retractable bridge & Crosswind.', bonusLabel: 'Protect all fragile equipment' }
  },
  6: {
    vi: { name: '🌀 6. Đại Kho Băng Chuyền', shortDesc: '16 món • Băng chuyền đảo chiều, Cửa kho, Cầu rút & Robot.', bonusLabel: 'Hoàn hảo: Không vỡ đồ & kính' },
    en: { name: '🌀 6. Conveyor Mega-Hub', shortDesc: '16 items • Reversible belts, Gate plate, Bridge & Robot.', bonusLabel: 'Flawless: 0 broken items & glass' }
  }
};

const DICT = {
  vi: {
    page_title: 'Moving Chaos 3D — Dọn Nhà Siêu Tốc (Bobi 2.5D Isometric)',
    logo_title: '🐥 MOVING CHAOS 3D • DỌN NHÀ SIÊU TỐC',
    logo_sub: 'Phiên Bản 2.5D Isometric Demo • Mascot Hạt Đậu Bobi & 6 Bản Đồ',
    sec_character_mode: '1. Chọn Bobi & Chế Độ',
    sec_levels: '2. Chọn Bản Đồ Dọn Nhà (6 Màn)',
    variant_base_title: 'Base Bobi',
    variant_base_desc: 'Quần yếm Denim & Nơ đỏ',
    variant_builder_title: 'Công Nhân',
    variant_builder_desc: 'Phản quang & Đèn LED',
    variant_chef_title: 'Chef Bobi',
    variant_chef_desc: 'Tạp dề & Mũ đầu bếp',
    mode_solo: '👤 1 Người',
    mode_local2p: '👥 2P Chung Phím',
    mode_lan: '🌐 Co-op LAN',
    time_label: '⏱️ Thời gian:',
    time_standard: '⏳ Tiêu chuẩn',
    time_unlimited: '♾️ Unlimited Time',
    lan_header: '🌐 PHÒNG CO-OP WI-FI / LAN',
    lan_ready: 'Sẵn sàng',
    lan_host_btn: '🎮 Tạo Phòng',
    lan_join_btn: '📱 Vào Phòng',
    play_btn: '🚚 BẮT ĐẦU DỌN NHÀ 3D!',
    link_2d: '🕹️ Bản 2D Cổ điển',
    hud_truck: '🚚 Trên Xe:',
    hud_cash: '💰 Tiền:',
    hud_rage: '😡 Chủ Nhà:',
    hud_items_suffix: 'món',
    status_idle: 'Rảnh',
    status_stun: '💫 Choáng',
    touch_jump: '🦘 NHẢY',
    touch_grab: '📦 NHẶT [J]',
    touch_throw: '🚀 NÉM [K]',
    ctrl_single_hud: '<b>Moving Out PC:</b> <span class="kbd">WASD</span> 360°, <span class="kbd">Space</span> nhảy, <span class="kbd">Shift</span> chạy, <span class="kbd">J</span> nhặt/thả, <span class="kbd">K</span> / Chuột gồng &amp; ném, <span class="kbd">Q/R</span> xoay góc nhìn! (Hỗ trợ Tay cầm)',
    ctrl_p1_hud: '<b>P1 (Cam):</b> <span class="kbd">WASD</span>, <span class="kbd">Space</span> nhảy, <span class="kbd">C</span> nhặt, <span class="kbd">V</span> ném',
    ctrl_p2_hud: '| <b>P2 (Xanh):</b> <span class="kbd">Mũi tên</span>, <span class="kbd">Enter/Num0</span> nhảy, <span class="kbd">K/Num1</span> nhặt, <span class="kbd">L/Num2</span> ném',
    inst_solo: '<p>🎮 <b>Chuẩn Moving Out (2 Tay / Tay Cầm):</b> Tay trái <span class="kbd">WASD</span> 360° • <span class="kbd">Space</span> nhảy • <span class="kbd">Shift</span> chạy | Tay phải <span class="kbd">J</span> nhặt/thả • <span class="kbd">K</span> (hoặc Chuột) gồng & ném!</p><p>🎮 <b>Tay Cầm (Xbox/PS):</b> Stick Trái chạy • <span class="kbd">A</span> nhảy • <span class="kbd">X/LB/LT</span> nhặt • <span class="kbd">B/RB/RT</span> gồng & ném • Stick Phải xoay góc nhìn <span class="kbd">Q/R</span>!</p>',
    inst_local2p: '<p>👥 <b>2 Người Chung Phím / 2 Tay Cầm (Tách 2 Nửa • Có Thẻ P1/P2):</b></p><p>🟠 <b>P1 (Trái):</b> <span class="kbd">WASD</span> chạy 360°, <span class="kbd">Space</span> nhảy, <span class="kbd">C</span> nhặt/thả, <span class="kbd">V</span> gồng & ném (hoặc Tay Cầm #1)</p><p>🔵 <b>P2 (Phải):</b> <span class="kbd">Phím Mũi Tên</span> chạy 360°, <span class="kbd">Enter/Num0</span> nhảy, <span class="kbd">K/Num1</span> nhặt, <span class="kbd">L/Num2</span> ném (hoặc Tay Cầm #2)</p>',
    inst_lan: '<p>🌐 <b>Co-op Mạng LAN (0ms • Thẻ P1/P2):</b> Tay trái <span class="kbd">WASD + Space</span>, Tay phải <span class="kbd">J</span> nhặt/thả • <span class="kbd">K</span> (hoặc Chuột) ném, <span class="kbd">Q/R</span> xoay camera! Hỗ trợ Tay cầm!</p>',
    total_stars_fmt: '⭐ {stars} / {max} Sao',
    par_label: '⏱️ Par {sec}s',
    best_record_fmt: 'Kỷ lục: {score}đ • {time}s',
    no_record: 'Chưa hoàn thành',
    menu_settings_btn: '⚙️ Cài Đặt',
    gamepad_none: '🎮 Chưa nối tay cầm',
    gamepad_ready: '🎮 Đã nối {count} tay cầm',
    gamepad_connected_toast: '<span>🎮 Tay cầm P{idx} đã kết nối!</span><b>Sẵn sàng!</b>',
    gamepad_disconnected_toast: '<span>🎮 Tay cầm P{idx} đã ngắt kết nối</span>',
    // Pause / Settings modal
    pause_title: '⏸️ TẠM DỪNG & CÀI ĐẶT',
    settings_title: '⚙️ CÀI ĐẶT HỆ THỐNG',
    pause_lan_note: '🌐 Đang ở chế độ LAN Co-op: Trận đấu vẫn tiếp tục để đồng bộ với đồng đội.',
    set_language: '🌐 Ngôn ngữ / Language',
    set_bgm_vol: '🎵 Âm lượng Nhạc nền',
    set_sfx_vol: '🔊 Âm lượng Hiệu ứng',
    set_graphics: '✨ Chất lượng Đồ họa',
    set_gfx_high: 'Đẹp (Bóng đổ ON)',
    set_gfx_smooth: 'Siêu mượt 60FPS',
    set_rumble: '📳 Rung Tay cầm (Haptics)',
    set_on: 'BẬT',
    set_off: 'TẮT',
    set_fullscreen: '⛶ Toàn màn hình',
    set_fs_toggle: 'Bật / Thoát Fullscreen',
    btn_resume: '▶️ TIẾP TỤC CHƠI',
    btn_close: '✅ ĐÓNG',
    btn_restart_match: '🔄 CHƠI LẠI MÀN NÀY',
    btn_exit_menu: '🏠 VỀ MENU CHÍNH',
    // Bonus HUD pill
    bonus_hud_title: '🎯 Mục tiêu phụ',
    // End Game
    end_earnings_label: 'TỔNG TIỀN CÔNG & TIỀN BOA',
    end_replay_btn: '🔄 DỌN LẠI HIỆP NỮA',
    end_menu_btn: '🏠 CHỌN MÀN KHÁC',
    end_anger_title: '😡 CHỦ NHÀ NỔI GIẬN TỊCH THU XE!',
    end_anger_sub: 'Làm vỡ quá nhiều đồ quý khiến bà chủ hết chịu nổi!',
    end_win_title: '🎉 HOÀN THÀNH XUẤT SẮC!',
    end_win_sub: 'Toàn bộ đồ đạc đã lên xe tải an toàn, xuất phát thôi!',
    end_timeout_title: '⏰ HẾT GIỜ DỌN NHÀ! 🚚',
    end_timeout_sub: 'Chuyến xe dọn nhà đã chính thức lăn bánh!',
    end_stats_loaded: 'Đã tải lên xe',
    end_stats_rage: 'Tức giận của chủ nhà',
    end_stats_time: 'Thời gian hoàn thành',
    end_star_clear: 'Giao đủ đồ lên xe',
    end_star_par: 'Vượt mốc Par Time (≤ {par}s)',
    end_star_bonus: 'Mục tiêu phụ: {bonus}',
    end_new_record: '🏆 KỶ LỤC MỚI!',
    rank_disaster: '💥 THẢM HỌA DỌN NHÀ',
    quote_disaster: '"Bà chủ nhà đã tịch thu xe tải và đuổi việc toàn bộ đội thợ!"',
    rank_royal: '👑 ĐỘI TRƯỞNG DỌN NHÀ HOÀNG GIA',
    quote_royal: '"Tuyệt đỉnh! Toàn bộ đồ đạc đã hạ cánh an toàn vào xe trước giờ lăn bánh!"',
    rank_pro: '⭐ THỢ DỌN NHÀ CHUYÊN NGHIỆP',
    quote_pro: '"Nhanh nhẹn và chuẩn xác. Chuyến xe dọn nhà đã kịp giờ lăn bánh!"',
    rank_rookie: '🐢 THỢ TẬP SỰ CHẬM CHẠP',
    quote_rookie: '"Lần sau hãy mạnh dạn căn lực ném đồ bay vèo qua cửa sổ nhé!"',
    mech_switch_on: '🎚️ ĐÃ GẠT CÔNG TẮC! BẬT CƠ CHẾ!',
    mech_switch_off: '🎚️ CÔNG TẮC ĐÃ TRẢ VỀ!',
    mech_traffic_red: '🚦 ĐÈN ĐỎ! XE DỪNG LẠI!',
    mech_traffic_green: '🚦 ĐÈN XANH! CẨN THẬN XE CHẠY!',
    mech_pit_fall: '🕳️ LỌT HỐ! HỒI SINH!',
    mech_hazard_hit: '💥 ĐỤNG CHƯỚNG NGẠI VẬT!',
    mech_item_respawn: '♻️ RỚT ĐỒ! ĐẶT LẠI TRONG NHÀ!',
    controls_btn: '🎮 Điều Khiển',
    controls_modal_title: '🎮 HƯỚNG DẪN PHÍM & TAY CẦM',
    controls_quick_hint: '<b>Phím nhanh:</b> <span class="kbd">WASD</span> Đi • <span class="kbd">Space</span> Nhảy • <span class="kbd">J</span> Nhặt • <span class="kbd">K</span> Ném • <span class="kbd">Q/R</span> Xoay',
    spotlight_tag: 'HỢP ĐỒNG #{id}',
    spotlight_items: '📦 {count} món',
    spotlight_time: '⏱️ {sec}s',
    spotlight_unlimited: '♾️ Thư giãn',
    spotlight_bonus_prefix: '🎯 Mục tiêu phụ:',
    stage_cam_hint: '🎥 Xoay mô hình 3D'
  },
  en: {
    page_title: 'Moving Chaos 3D — Turbo Movers (Bobi 2.5D Isometric)',
    logo_title: '🐥 MOVING CHAOS 3D • TURBO MOVERS',
    logo_sub: '2.5D Isometric Demo • Bobi Mascot & 6 Action Maps',
    sec_character_mode: '1. Choose Bobi & Mode',
    sec_levels: '2. Select Moving Map (6 Levels)',
    variant_base_title: 'Base Bobi',
    variant_base_desc: 'Denim Overalls & Red Bow',
    variant_builder_title: 'Builder Bobi',
    variant_builder_desc: 'Safety Vest & LED Headlamp',
    variant_chef_title: 'Chef Bobi',
    variant_chef_desc: 'Apron & Chef Toque',
    mode_solo: '👤 1 Player',
    mode_local2p: '👥 2P Shared',
    mode_lan: '🌐 LAN Co-op',
    time_label: '⏱️ Timer:',
    time_standard: '⏳ Standard',
    time_unlimited: '♾️ Unlimited Time',
    lan_header: '🌐 WI-FI / LAN CO-OP LOBBY',
    lan_ready: 'Ready',
    lan_host_btn: '🎮 Host Room',
    lan_join_btn: '📱 Join Room',
    play_btn: '🚚 START MOVING 3D!',
    link_2d: '🕹️ Classic 2D Mode',
    hud_truck: '🚚 Loaded:',
    hud_cash: '💰 Cash:',
    hud_rage: '😡 Rage:',
    hud_items_suffix: 'items',
    status_idle: 'Ready',
    status_stun: '💫 Stunned',
    touch_jump: '🦘 JUMP',
    touch_grab: '📦 GRAB [J]',
    touch_throw: '🚀 THROW [K]',
    ctrl_single_hud: '<b>Moving Out PC:</b> <span class="kbd">WASD</span> 360°, <span class="kbd">Space</span> jump, <span class="kbd">Shift</span> sprint, <span class="kbd">J</span> grab/drop, <span class="kbd">K</span> / Mouse charge &amp; throw, <span class="kbd">Q/R</span> orbit camera! (Gamepad ready)',
    ctrl_p1_hud: '<b>P1 (Orange):</b> <span class="kbd">WASD</span>, <span class="kbd">Space</span> jump, <span class="kbd">C</span> grab, <span class="kbd">V</span> throw',
    ctrl_p2_hud: '| <b>P2 (Cyan):</b> <span class="kbd">Arrows</span>, <span class="kbd">Enter/Num0</span> jump, <span class="kbd">K/Num1</span> grab, <span class="kbd">L/Num2</span> throw',
    inst_solo: '<p>🎮 <b>Moving Out Ergonomic (2 Hands / Gamepad):</b> Left <span class="kbd">WASD</span> 360° • <span class="kbd">Space</span> jump • <span class="kbd">Shift</span> sprint | Right <span class="kbd">J</span> grab/drop • <span class="kbd">K</span> (or Mouse) charge & throw!</p><p>🎮 <b>Controller (Xbox/PS):</b> Left Stick move • <span class="kbd">A</span> jump • <span class="kbd">X/LB/LT</span> grab • <span class="kbd">B/RB/RT</span> throw • Right Stick orbit cam!</p>',
    inst_local2p: '<p>👥 <b>2 Players Split Keyboard / 2 Controllers (P1/P2 Overhead Badges):</b></p><p>🟠 <b>P1 (Left):</b> <span class="kbd">WASD</span> move, <span class="kbd">Space</span> jump, <span class="kbd">C</span> grab/drop, <span class="kbd">V</span> throw (or Controller #1)</p><p>🔵 <b>P2 (Right):</b> <span class="kbd">Arrow Keys</span> move, <span class="kbd">Enter/Num0</span> jump, <span class="kbd">K/Num1</span> grab, <span class="kbd">L/Num2</span> throw (or Controller #2)</p>',
    inst_lan: '<p>🌐 <b>LAN Co-op (0ms Sync • P1/P2 Badges):</b> Left <span class="kbd">WASD + Space</span>, Right <span class="kbd">J</span> grab/drop • <span class="kbd">K</span> (or Mouse) throw, <span class="kbd">Q/R</span> orbit camera! Gamepad supported!</p>',
    total_stars_fmt: '⭐ {stars} / {max} Stars',
    par_label: '⏱️ Par {sec}s',
    best_record_fmt: 'Best: {score}đ • {time}s',
    no_record: 'Not cleared yet',
    menu_settings_btn: '⚙️ Settings',
    gamepad_none: '🎮 No Gamepad',
    gamepad_ready: '🎮 {count} Gamepad Ready',
    gamepad_connected_toast: '<span>🎮 Controller P{idx} connected!</span><b>Ready!</b>',
    gamepad_disconnected_toast: '<span>🎮 Controller P{idx} disconnected</span>',
    // Pause / Settings modal
    pause_title: '⏸️ PAUSED & SETTINGS',
    settings_title: '⚙️ GAME SETTINGS',
    pause_lan_note: '🌐 LAN Co-op active: Match stays live to remain synchronized with your teammate.',
    set_language: '🌐 Language / Ngôn ngữ',
    set_bgm_vol: '🎵 Music Volume',
    set_sfx_vol: '🔊 Sound FX Volume',
    set_graphics: '✨ Graphics Preset',
    set_gfx_high: 'High (Shadows ON)',
    set_gfx_smooth: 'Ultra Smooth 60FPS',
    set_rumble: '📳 Controller Vibration',
    set_on: 'ON',
    set_off: 'OFF',
    set_fullscreen: '⛶ Display Mode',
    set_fs_toggle: 'Toggle Fullscreen',
    btn_resume: '▶️ RESUME',
    btn_close: '✅ CLOSE',
    btn_restart_match: '🔄 RESTART LEVEL',
    btn_exit_menu: '🏠 MAIN MENU',
    // Bonus HUD pill
    bonus_hud_title: '🎯 Bonus Goal',
    // End Game
    end_earnings_label: 'TOTAL PAYOUT & TIPS',
    end_replay_btn: '🔄 REPLAY LEVEL',
    end_menu_btn: '🏠 LEVEL SELECT',
    end_anger_title: '😡 LANDLORD TOOK THE TRUCK!',
    end_anger_sub: 'Too many priceless items smashed — contract terminated!',
    end_win_title: '🎉 LEVEL COMPLETE!',
    end_win_sub: 'Every single item loaded safely. Hit the road!',
    end_timeout_title: '⏰ TIME IS UP! 🚚',
    end_timeout_sub: 'The moving truck has officially rolled out!',
    end_stats_loaded: 'Loaded on truck',
    end_stats_rage: 'Landlord rage meter',
    end_stats_time: 'Completion time',
    end_star_clear: 'Deliver all items',
    end_star_par: 'Beat Par Time (≤ {par}s)',
    end_star_bonus: 'Bonus Goal: {bonus}',
    end_new_record: '🏆 NEW PERSONAL BEST!',
    rank_disaster: '💥 MOVING DISASTER',
    quote_disaster: '"The landlord impounded your truck and fired the whole crew!"',
    rank_royal: '👑 ROYAL MASTER MOVERS',
    quote_royal: '"Phenomenal teamwork! Every prized possession landed safely inside!"',
    rank_pro: '⭐ PRO MOVING CREW',
    quote_pro: '"Swift, clean, and reliable. Truck departed right on schedule!"',
    rank_rookie: '🐢 ROOKIE HAULERS',
    quote_rookie: '"Tip: Charge your throw through glass or launch via the trampoline!"',
    mech_switch_on: '🎚️ SWITCH ACTIVATED!',
    mech_switch_off: '🎚️ SWITCH RESET!',
    mech_traffic_red: '🚦 RED LIGHT! CARS STOPPED!',
    mech_traffic_green: '🚦 GREEN LIGHT! WATCH FOR CARS!',
    mech_pit_fall: '🕳️ FELL IN PIT! RESPAWNING!',
    mech_hazard_hit: '💥 HAZARD COLLISION!',
    mech_item_respawn: '♻️ ITEM DROPPED! RESET INSIDE!',
    controls_btn: '🎮 Controls',
    controls_modal_title: '🎮 CONTROLS & GAMEPAD GUIDE',
    controls_quick_hint: '<b>Quick Keys:</b> <span class="kbd">WASD</span> Move • <span class="kbd">Space</span> Jump • <span class="kbd">J</span> Grab • <span class="kbd">K</span> Throw • <span class="kbd">Q/R</span> Orbit',
    spotlight_tag: 'CONTRACT #{id}',
    spotlight_items: '📦 {count} items',
    spotlight_time: '⏱️ {sec}s',
    spotlight_unlimited: '♾️ Endless Chill',
    spotlight_bonus_prefix: '🎯 Bonus Goal:',
    stage_cam_hint: '🎥 Orbit 3D Diorama'
  }
};

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang === 'en' ? 'en' : 'vi';
  return currentLang;
}

export function t(key, vars = null) {
  const table = DICT[currentLang] || DICT.vi;
  let str = table[key] ?? DICT.vi[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}

export function getLevelText(lvlId) {
  const entry = LEVEL_I18N[lvlId] || LEVEL_I18N[1];
  return entry[currentLang] || entry.vi;
}
