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
    page_title: 'Moving Chaos 3D',
    logo_title: 'MOVING CHAOS',
    logo_sub: '',
    sec_character_mode: '',
    sec_levels: '',
    open_map_select_btn: '🗺️ Chọn map',
    map_select_modal_title: 'CHỌN BẢN ĐỒ',
    variant_base_title: 'Bobi',
    variant_base_desc: '',
    variant_base_perk: '+12% Tốc & Ném',
    variant_builder_title: 'Công Nhân',
    variant_builder_desc: '',
    variant_builder_perk: 'Vác khỏe • -50% Choáng',
    variant_chef_title: 'Đầu Bếp',
    variant_chef_desc: '',
    variant_chef_perk: 'Chống trơn • Đỡ vỡ',
    mode_solo: '1P',
    mode_local2p: '2P',
    mode_lan: 'LAN',
    time_label: '',
    time_standard: '⏳ 75s',
    time_unlimited: '♾️ Tự do',
    lan_header: 'LAN CO-OP',
    lan_ready: 'Sẵn sàng',
    lan_host_btn: 'Tạo phòng',
    lan_join_btn: 'Vào phòng',
    play_btn: 'CHƠI NGAY',
    link_2d: '2D',
    hud_truck: '🚚',
    hud_cash: '💰',
    hud_rage: '😡',
    hud_items_suffix: '',
    status_idle: 'Rảnh',
    status_stun: '💫 Choáng',
    touch_dash: '💨 LƯỚT',
    touch_jump: '🦘 NHẢY',
    touch_grab: '📦 NHẶT',
    touch_throw: '🚀 NÉM',
    ctrl_single_hud: '<span class="kbd">WASD</span> Đi · <span class="kbd">Space</span> Nhảy · <span class="kbd">F</span> Lướt · <span class="kbd">J</span> Nhặt · <span class="kbd">K</span>/Chuột Ném · <span class="kbd">Q/R</span> Xoay',
    ctrl_p1_hud: '<b>P1:</b> <span class="kbd">WASD</span> <span class="kbd">Space</span> <span class="kbd">F</span> <span class="kbd">C</span> <span class="kbd">V</span>',
    ctrl_p2_hud: '<b>P2:</b> <span class="kbd">Mũi tên</span> <span class="kbd">Enter</span> <span class="kbd">/</span> <span class="kbd">K</span> <span class="kbd">L</span>',
    inst_solo: '',
    inst_local2p: '',
    inst_lan: '',
    total_stars_fmt: '★ {stars}/{max}',
    par_label: 'Par {sec}s',
    best_record_fmt: '{score}đ · {time}s',
    no_record: 'Chưa chơi',
    menu_settings_btn: '⚙️',
    gamepad_none: '',
    gamepad_ready: '🎮 {count}',
    gamepad_connected_toast: '<span>🎮 Tay cầm P{idx}</span><b>OK</b>',
    gamepad_disconnected_toast: '<span>🎮 Ngắt tay cầm P{idx}</span>',
    pause_title: 'TẠM DỪNG',
    settings_title: 'CÀI ĐẶT',
    pause_lan_note: 'LAN đang bật — trận đấu vẫn chạy đồng bộ.',
    set_language: 'Ngôn ngữ',
    set_bgm_vol: 'Nhạc nền',
    set_sfx_vol: 'Âm thanh',
    set_graphics: 'Đồ họa',
    set_gfx_high: 'Cao (Bóng đổ)',
    set_gfx_smooth: 'Mượt 60FPS',
    set_rumble: 'Rung tay cầm',
    set_on: 'BẬT',
    set_off: 'TẮT',
    set_fullscreen: 'Màn hình',
    set_fs_toggle: 'Toàn màn hình',
    btn_resume: 'TIẾP TỤC',
    btn_close: 'ĐÓNG',
    btn_restart_match: 'CHƠI LẠI',
    btn_exit_menu: 'VỀ MENU',
    bonus_hud_title: '🎯',
    end_earnings_label: 'THÀNH TÍCH',
    end_replay_btn: 'CHƠI LẠI',
    end_menu_btn: 'CHỌN MAP',
    end_anger_title: 'CHỦ NHÀ NỔI GIẬN!',
    end_anger_sub: 'Vỡ quá nhiều đồ quý giá!',
    end_win_title: 'HOÀN THÀNH!',
    end_win_sub: 'Toàn bộ đồ đã lên xe an toàn!',
    end_timeout_title: 'HẾT GIỜ!',
    end_timeout_sub: 'Xe tải đã lăn bánh!',
    end_stats_loaded: 'Lên xe',
    end_stats_rage: 'Tức giận',
    end_stats_time: 'Thời gian',
    end_star_clear: 'Giao đủ đồ',
    end_star_par: 'Nhanh hơn {par}s',
    end_star_bonus: '{bonus}',
    end_new_record: '🏆 KỶ LỤC MỚI!',
    rank_disaster: 'THẢM HỌA DỌN NHÀ',
    quote_disaster: 'Chủ nhà đã tịch thu xe tải!',
    rank_royal: 'ĐỘI TRƯỞNG HOÀNG GIA',
    quote_royal: 'Nhanh, gọn, không một vết xước!',
    rank_pro: 'THỢ CHUYÊN NGHIỆP',
    quote_pro: 'Chuyến xe lăn bánh đúng hẹn!',
    rank_rookie: 'THỢ TẬP SỰ',
    quote_rookie: 'Thử ném qua bạt lò xo hoặc cửa kính nhé!',
    mech_switch_on: 'BẬT CÔNG TẮC!',
    mech_switch_off: 'TẮT CÔNG TẮC!',
    mech_traffic_red: 'ĐÈN ĐỎ!',
    mech_traffic_green: 'ĐÈN XANH!',
    mech_pit_fall: 'LỌT HỐ!',
    mech_hazard_hit: 'VA CHẠM!',
    mech_item_respawn: 'RỚT ĐỒ!',
    controls_btn: '📖',
    controls_modal_title: 'HƯỚNG DẪN CHƠI',
    controls_quick_hint: '',
    guide_full_html: `
      <p>🎯 <b>Mục tiêu &amp; Combo:</b> Đưa toàn bộ đồ lên <b>thùng xe tải</b> trước khi hết giờ. Giao liên tiếp nhiều món trong 5,5 giây để kích hoạt <b>🔥 Combo x2–x4</b> thưởng thêm tiền!</p>
      <p>⚡ <b>Nhân vật:</b> <b>Bobi</b> (+12% chạy, ném &amp; tầm nhặt) · <b>Công Nhân</b> (vác nặng khỏe, -50% choáng) · <b>Đầu Bếp</b> (bám sàn dầu, giữ đồ dễ vỡ tốt hơn).</p>
      <p>💨 <b>Lướt &amp; Bắt trên không:</b> Nhấn <span class="kbd">F</span> (<span class="kbd">/</span> cho P2, nút <span class="kbd">B</span> tay cầm khi tay không) để lướt né xe, húc choáng Ma/Robot 2 giây hoặc trêu đồng đội. Nhặt đồ đang bay để kích <b>Siêu Ném</b>!</p>
      <p>🐾 <b>Mẹo map:</b> Thú cưng biết nhảy quanh nhà, Gấu bông nảy cao. Ném mạnh vỡ kính mở đường tắt, hoặc bật đồ qua bạt lò xo vào thẳng xe!</p>
      <hr style="border:none;border-top:1px solid rgba(30,36,44,0.12);margin:10px 0;">
      <p>👤 <b>1 Người:</b> <span class="kbd">WASD</span> đi · <span class="kbd">Space</span> nhảy · <span class="kbd">F</span> lướt · <span class="kbd">J</span> nhặt · <span class="kbd">K</span> / Chuột ném · <span class="kbd">Q/R</span> xoay camera</p>
      <p>🎮 <b>Tay cầm:</b> Stick trái đi · <span class="kbd">A</span> nhảy · <span class="kbd">X</span> nhặt · <span class="kbd">B/RT</span> ném (hoặc Lướt khi tay không) · Stick phải xoay</p>
      <p>👥 <b>2 Người:</b> <b>P1:</b> <span class="kbd">WASD</span> <span class="kbd">Space</span> <span class="kbd">F</span> <span class="kbd">C</span> <span class="kbd">V</span> · <b>P2:</b> <span class="kbd">Mũi tên</span> <span class="kbd">Enter</span> <span class="kbd">/</span> <span class="kbd">K</span> <span class="kbd">L</span></p>
    `,
    spotlight_tag: 'MÀN {id}',
    spotlight_items: '{count} món',
    spotlight_time: '{sec}s',
    spotlight_unlimited: 'Tự do',
    spotlight_bonus_prefix: '🎯',
    stage_cam_hint: ''
  },
  en: {
    page_title: 'Moving Chaos 3D',
    logo_title: 'MOVING CHAOS',
    logo_sub: '',
    sec_character_mode: '',
    sec_levels: '',
    open_map_select_btn: '🗺️ Maps',
    map_select_modal_title: 'SELECT MAP',
    variant_base_title: 'Bobi',
    variant_base_desc: '',
    variant_base_perk: '+12% Speed & Throw',
    variant_builder_title: 'Builder',
    variant_builder_desc: '',
    variant_builder_perk: 'Heavy Lift • -50% Stun',
    variant_chef_title: 'Chef',
    variant_chef_desc: '',
    variant_chef_perk: 'Anti-Slip • Safe Fragile',
    mode_solo: '1P',
    mode_local2p: '2P',
    mode_lan: 'LAN',
    time_label: '',
    time_standard: '⏳ Timed',
    time_unlimited: '♾️ Chill',
    lan_header: 'LAN CO-OP',
    lan_ready: 'Ready',
    lan_host_btn: 'Host',
    lan_join_btn: 'Join',
    play_btn: 'PLAY NOW',
    link_2d: '2D',
    hud_truck: '🚚',
    hud_cash: '💰',
    hud_rage: '😡',
    hud_items_suffix: '',
    status_idle: 'Idle',
    status_stun: '💫 Stun',
    touch_dash: '💨 DASH',
    touch_jump: '🦘 JUMP',
    touch_grab: '📦 GRAB',
    touch_throw: '🚀 THROW',
    ctrl_single_hud: '<span class="kbd">WASD</span> Move · <span class="kbd">Space</span> Jump · <span class="kbd">F</span> Dash · <span class="kbd">J</span> Grab · <span class="kbd">K</span>/Mouse Throw · <span class="kbd">Q/R</span> Orbit',
    ctrl_p1_hud: '<b>P1:</b> <span class="kbd">WASD</span> <span class="kbd">Space</span> <span class="kbd">F</span> <span class="kbd">C</span> <span class="kbd">V</span>',
    ctrl_p2_hud: '<b>P2:</b> <span class="kbd">Arrows</span> <span class="kbd">Enter</span> <span class="kbd">/</span> <span class="kbd">K</span> <span class="kbd">L</span>',
    inst_solo: '',
    inst_local2p: '',
    inst_lan: '',
    total_stars_fmt: '★ {stars}/{max}',
    par_label: 'Par {sec}s',
    best_record_fmt: '{score}đ · {time}s',
    no_record: 'Unplayed',
    menu_settings_btn: '⚙️',
    gamepad_none: '',
    gamepad_ready: '🎮 {count}',
    gamepad_connected_toast: '<span>🎮 Pad P{idx}</span><b>OK</b>',
    gamepad_disconnected_toast: '<span>🎮 Pad P{idx} off</span>',
    pause_title: 'PAUSED',
    settings_title: 'SETTINGS',
    pause_lan_note: 'LAN Co-op active — match stays live.',
    set_language: 'Language',
    set_bgm_vol: 'Music',
    set_sfx_vol: 'SFX',
    set_graphics: 'Graphics',
    set_gfx_high: 'High (Shadows)',
    set_gfx_smooth: 'Smooth 60FPS',
    set_rumble: 'Vibration',
    set_on: 'ON',
    set_off: 'OFF',
    set_fullscreen: 'Display',
    set_fs_toggle: 'Fullscreen',
    btn_resume: 'RESUME',
    btn_close: 'CLOSE',
    btn_restart_match: 'RESTART',
    btn_exit_menu: 'MAIN MENU',
    bonus_hud_title: '🎯',
    end_earnings_label: 'TOTAL PAYOUT',
    end_replay_btn: 'REPLAY',
    end_menu_btn: 'MAPS',
    end_anger_title: 'CONTRACT TERMINATED!',
    end_anger_sub: 'Too many broken valuables!',
    end_win_title: 'JOB COMPLETE!',
    end_win_sub: 'Everything loaded safely!',
    end_timeout_title: 'TIME UP!',
    end_timeout_sub: 'The truck has departed!',
    end_stats_loaded: 'Loaded',
    end_stats_rage: 'Rage',
    end_stats_time: 'Time',
    end_star_clear: 'Deliver all items',
    end_star_par: 'Under {par}s',
    end_star_bonus: '{bonus}',
    end_new_record: '🏆 NEW BEST!',
    rank_disaster: 'MOVING DISASTER',
    quote_disaster: 'The landlord impounded your truck!',
    rank_royal: 'ROYAL MOVERS',
    quote_royal: 'Lightning fast, zero scratches!',
    rank_pro: 'PRO CREW',
    quote_pro: 'Right on schedule!',
    rank_rookie: 'ROOKIE HAULERS',
    quote_rookie: 'Try bouncing cargo off trampolines!',
    mech_switch_on: 'SWITCH ON!',
    mech_switch_off: 'SWITCH OFF!',
    mech_traffic_red: 'RED LIGHT!',
    mech_traffic_green: 'GREEN LIGHT!',
    mech_pit_fall: 'PIT FALL!',
    mech_hazard_hit: 'BONK!',
    mech_item_respawn: 'DROPPED!',
    controls_btn: '📖',
    controls_modal_title: 'HOW TO PLAY',
    controls_quick_hint: '',
    guide_full_html: `
      <p>🎯 <b>Goal &amp; Combos:</b> Load all items onto the <b>truck bed</b> before time runs out. Chain deliveries within 5.5s for <b>🔥 Combos x2–x4</b>!</p>
      <p>⚡ <b>Characters:</b> <b>Bobi</b> (+12% speed, throw &amp; reach) · <b>Builder</b> (stronger heavy carry, -50% stun) · <b>Chef</b> (grippy on oil, safer fragile throws).</p>
      <p>💨 <b>Dash &amp; Air Catch:</b> Press <span class="kbd">F</span> (<span class="kbd">/</span> for P2, <span class="kbd">B</span> empty-handed on pad) to dash, stun Ghosts/Bots for 2s, or slap teammates. Grab flying items to charge a <b>Power Throw</b>!</p>
      <p>🐾 <b>Tips:</b> Pets hop playfully &amp; plushies bounce. Smash glass shortcuts or bounce items via trampolines!</p>
      <hr style="border:none;border-top:1px solid rgba(30,36,44,0.12);margin:10px 0;">
      <p>👤 <b>Solo:</b> <span class="kbd">WASD</span> move · <span class="kbd">Space</span> jump · <span class="kbd">F</span> dash · <span class="kbd">J</span> grab · <span class="kbd">K</span> / Mouse throw · <span class="kbd">Q/R</span> orbit</p>
      <p>🎮 <b>Gamepad:</b> Left Stick move · <span class="kbd">A</span> jump · <span class="kbd">X</span> grab · <span class="kbd">B/RT</span> throw (or Dash empty-handed) · Right Stick orbit</p>
      <p>👥 <b>2P:</b> <b>P1:</b> <span class="kbd">WASD</span> <span class="kbd">Space</span> <span class="kbd">F</span> <span class="kbd">C</span> <span class="kbd">V</span> · <b>P2:</b> <span class="kbd">Arrows</span> <span class="kbd">Enter</span> <span class="kbd">/</span> <span class="kbd">K</span> <span class="kbd">L</span></p>
    `,
    spotlight_tag: 'MAP {id}',
    spotlight_items: '{count} items',
    spotlight_time: '{sec}s',
    spotlight_unlimited: 'Chill',
    spotlight_bonus_prefix: '🎯',
    stage_cam_hint: ''
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
