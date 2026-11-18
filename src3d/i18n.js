// =========================================================================
// BILINGUAL LOCALIZATION (VIETNAMESE / ENGLISH) FOR MOVING CHAOS 3D DEMO
// =========================================================================

let currentLang = 'vi';

const LEVEL_I18N = {
  1: {
    vi: { chapter: 'Chương 1 • Khu Phố Nắng', name: '🏠 1. Nhà Phố Khởi Động', shortDesc: '8 món • Hàng rào ném qua, 1 cửa kính & bạt lò xo.', bonusLabel: 'Không làm vỡ cửa kính' },
    en: { chapter: 'Ch.1 • Sunny Suburbs', name: '🏠 1. Starter Home', shortDesc: '8 items • Toss over fence, 1 glass panel & trampoline.', bonusLabel: 'Keep all glass intact' }
  },
  2: {
    vi: { chapter: 'Chương 1 • Khu Phố Nắng', name: '👻 2. Biệt Thự Ma Ám', shortDesc: '11 món • 3 phòng lớn, Ma tuần tra & Công tắc mở cửa.', bonusLabel: 'Không vỡ món đồ dễ vỡ nào' },
    en: { chapter: 'Ch.1 • Sunny Suburbs', name: '👻 2. Haunted Manor', shortDesc: '11 items • 3-room manor, Ghosts & Rolling shutter.', bonusLabel: 'Break zero fragile items' }
  },
  3: {
    vi: { chapter: 'Chương 1 • Khu Phố Nắng', name: '🚗 3. Đại Lộ Giờ Cao Điểm', shortDesc: '13 món • 2 cửa hàng đối diện phố, Xe chạy & Đèn đỏ.', bonusLabel: 'Không để xe tông người hay đồ' },
    en: { chapter: 'Ch.1 • Sunny Suburbs', name: '🚗 3. Rush Hour Avenue', shortDesc: '13 items • Two showrooms, Live traffic & Crosswalk light.', bonusLabel: 'Zero traffic collisions' }
  },
  4: {
    vi: { chapter: 'Chương 1 • Khu Phố Nắng', name: '🍳 4. Nhà Hàng Bếp Lửa', shortDesc: '13 món • Sàn dầu trơn, Quầy bar ném qua & Đầu bếp.', bonusLabel: 'Giữ nguyên vẹn cả 2 cửa kính' },
    en: { chapter: 'Ch.1 • Sunny Suburbs', name: '🍳 4. 5-Star Kitchen', shortDesc: '13 items • Greasy floors, Bar toss & Patrolling Chef.', bonusLabel: 'Keep both glass windows intact' }
  },
  5: {
    vi: { chapter: 'Chương 2 • Công Trường & Phố', name: '🏗️ 5. Công Trường Thang Nâng', shortDesc: '14 món • Thang nâng 3 tầng, Hố sâu, Cầu rút & Quạt gió.', bonusLabel: 'Bảo vệ nguyên toàn bộ đồ dễ vỡ' },
    en: { chapter: 'Ch.2 • Works & Downtown', name: '🏗️ 5. Sky Crane Site', shortDesc: '14 items • Elevators, Pits, Retractable bridge & Wind.', bonusLabel: 'Protect all fragile equipment' }
  },
  6: {
    vi: { chapter: 'Chương 2 • Công Trường & Phố', name: '🌀 6. Đại Kho Băng Chuyền', shortDesc: '16 món • Băng chuyền đảo chiều, Cửa kho, Cầu rút & Robot.', bonusLabel: 'Hoàn hảo: Không vỡ đồ & kính' },
    en: { chapter: 'Ch.2 • Works & Downtown', name: '🌀 6. Conveyor Mega-Hub', shortDesc: '16 items • Reversible belts, Gate plate, Bridge & Bot.', bonusLabel: 'Flawless: 0 broken items & glass' }
  },
  7: {
    vi: { chapter: 'Chương 2 • Công Trường & Phố', name: '🛒 7. Siêu Thị Cuối Tuần', shortDesc: '14 món • Tủ kem trơn, Băng chuyền thu ngân & Xe đẩy.', bonusLabel: 'Không làm vỡ cửa kính siêu thị' },
    en: { chapter: 'Ch.2 • Works & Downtown', name: '🛒 7. Weekend Mart', shortDesc: '14 items • Icy freezer aisle, Checkout belt & Carts.', bonusLabel: 'Keep storefront glass intact' }
  },
  8: {
    vi: { chapter: 'Chương 2 • Công Trường & Phố', name: '🏢 8. Chung Cư Hai Tầng', shortDesc: '14 món • Penthouse 2 cánh, 2 Thang nâng & Dốc trung tâm.', bonusLabel: 'Không vỡ món đồ dễ vỡ nào' },
    en: { chapter: 'Ch.2 • Works & Downtown', name: '🏢 8. Twin Penthouse', shortDesc: '14 items • Dual lofts, 2 Elevators & Grand central ramp.', bonusLabel: 'Break zero fragile items' }
  },
  9: {
    vi: { chapter: 'Chương 3 • Chuyến Hàng VIP', name: '🏛️ 9. Bảo Tàng Cổ Vật', shortDesc: '13 món • Hầm báu cổ vật, Công tắc cửa hầm & Bảo vệ.', bonusLabel: 'Không vỡ cổ vật quý giá nào' },
    en: { chapter: 'Ch.3 • VIP Contracts', name: '🏛️ 9. Relic Museum', shortDesc: '13 items • Security vault gate, Relics & Patrol guards.', bonusLabel: 'Break zero precious relics' }
  },
  10: {
    vi: { chapter: 'Chương 3 • Chuyến Hàng VIP', name: '🚢 10. Sảnh Tiệc Du Thuyền', shortDesc: '14 món • Boong tàu trơn trượt, Gió biển & Hố nước.', bonusLabel: 'Không va chạm đầu bếp tuần tra' },
    en: { chapter: 'Ch.3 • VIP Contracts', name: '🚢 10. Yacht Party Deck', shortDesc: '14 items • Slick deck, Ocean crosswind & Water pits.', bonusLabel: 'Zero patrol collisions' }
  },
  11: {
    vi: { chapter: 'Chương 3 • Chuyến Hàng VIP', name: '⚓ 11. Cảng Container Bão Tố', shortDesc: '15 món • Kênh đào kép, 2 Cầu nâng, Băng chuyền & Bão.', bonusLabel: 'Hoàn hảo: Không hư hại hàng hóa' },
    en: { chapter: 'Ch.3 • VIP Contracts', name: '⚓ 11. Stormy Container Port', shortDesc: '15 items • Twin canal bridges, Cranes & Storm wind.', bonusLabel: 'Flawless: Zero cargo damage' }
  },
  12: {
    vi: { chapter: 'Chương 3 • Chuyến Hàng VIP', name: '💎 12. Biệt Thự Tỷ Phú', shortDesc: '16 món • Chặng cuối: Giao thông, Robot, Sàn trơn & Hầm vàng.', bonusLabel: 'Hoàn hảo tuyệt đối chặng cuối' },
    en: { chapter: 'Ch.3 • VIP Contracts', name: '💎 12. Billionaire Estate', shortDesc: '16 items • Grand finale: Traffic, Bots, Ice & Vault.', bonusLabel: 'Flawless finale delivery' }
  },
  13: {
    vi: { chapter: 'Chương 4 • Phòng Lab & Không Gian', name: '🧪 13. Phòng Thí Nghiệm Đổi Trọng', shortDesc: '13 món • Vùng trọng lực thấp bay bổng, Tia Laser & Bảo vệ đuổi bắt.', bonusLabel: 'Không vỡ món đồ thí nghiệm nào' },
    en: { chapter: 'Ch.4 • Sci-Fi Lab & Space', name: '🧪 13. Zero-G Bio-Lab', shortDesc: '13 items • Low-gravity float zone, Laser gate & Chasing Guard.', bonusLabel: 'Keep all fragile lab gear safe' }
  },
  14: {
    vi: { chapter: 'Chương 4 • Phòng Lab & Không Gian', name: '🖥️ 14. Trạm Server Lượng Tử', shortDesc: '14 món • Tầng lửng Server, 2 Hàng Laser đảo pha & Drone tuần tra.', bonusLabel: 'Không va chạm Drone hay Laser' },
    en: { chapter: 'Ch.4 • Sci-Fi Lab & Space', name: '🖥️ 14. Quantum Data Center', shortDesc: '14 items • Twin Laser grid, Server lift, Bridge & Hover Drone.', bonusLabel: 'Zero Drone or Laser hits' }
  },
  15: {
    vi: { chapter: 'Chương 4 • Phòng Lab & Không Gian', name: '🎬 15. Phim Trường Sci-Fi Hollywood', shortDesc: '15 món • Sân khấu Mặt Trăng nhẹ bẫng, Xe đóng thế, Laser & Đạo cụ.', bonusLabel: 'Không làm vỡ cửa kính trường quay' },
    en: { chapter: 'Ch.4 • Sci-Fi Lab & Space', name: '🎬 15. Sci-Fi Film Studio', shortDesc: '15 items • Lunar Low-G stage, Stunt traffic, Laser & Props.', bonusLabel: 'Keep studio glass intact' }
  },
  16: {
    vi: { chapter: 'Chương 4 • Phòng Lab & Không Gian', name: '🚀 16. Trạm Không Gian Apex', shortDesc: '16 món • Đại kết cục: Không trọng lực, 2 Laser, Drone & Bảo vệ đuổi!', bonusLabel: 'Hoàn hảo tuyệt đối ngoài quỹ đạo' },
    en: { chapter: 'Ch.4 • Sci-Fi Lab & Space', name: '🚀 16. Apex Orbital Station', shortDesc: '16 items • Grand orbital finale: Zero-G, Dual Lasers, Drone & Guard.', bonusLabel: 'Flawless orbital contract' }
  }
};

const DICT = {
  vi: {
    page_title: 'Moving Chaos 3D',
    logo_title: 'MOVING CHAOS',
    logo_sub: '',
    sec_character_mode: '',
    sec_levels: '',
    open_map_select_btn: '🗺️ Danh sách 16 Map',
    overworld_btn: '🚐 Lái xe chọn Map',
    overworld_launch_btn: '🚚 NHẬN HỢP ĐỒNG',
    overworld_back_btn: '🏠 Menu',
    overworld_roam_hint: 'Lái xe [WASD / Mũi tên] tới ô số 1–16 trên bản đồ!',
    overworld_park_hint: 'Nhấn [Space / J / Enter] để nhận hợp đồng ngay!',
    map_select_modal_title: 'CHỌN BẢN ĐỒ (16 MÀN • 4 CHƯƠNG)',
    variant_base_title: 'Bobi',
    variant_base_desc: '',
    variant_base_perk: '+12% Tốc & Ném',
    variant_builder_title: 'Công Nhân',
    variant_builder_desc: '',
    variant_builder_perk: 'Vác nặng • -50% Choáng',
    variant_chef_title: 'Đầu Bếp',
    variant_chef_desc: '',
    variant_chef_perk: 'Chống trơn • Đỡ vỡ',
    mode_solo: '1P',
    mode_local2p: '2P',
    mode_local3p: '3P',
    mode_local4p: '4P',
    mode_lan: 'LAN',
    skin_label: '🎨 Màu Bobi',
    skin_locked_toast: 'Cần {stars}★ để mở khóa màu này!',
    mod_label: '⚡ Chế độ',
    mod_normal: 'Chuẩn',
    mod_turbo: 'Turbo +25%',
    mod_bouncy: 'Siêu Nảy',
    mod_chill: 'Trợ Lực',
    time_label: '',
    time_standard: '⏳ Tính giờ',
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
    touch_slap: '👋 TÁT',
    touch_ping: '📍 PING',
    ctrl_single_hud: '<span class="kbd">WASD</span> Đi · <span class="kbd">Space</span> Nhảy · <span class="kbd">F</span> Lướt · <span class="kbd">J</span> Nhặt · <span class="kbd">K</span>/Chuột Ném · <span class="kbd">E</span> Tát · <span class="kbd">T</span> Ping · <span class="kbd">Q/R</span> Xoay',
    ctrl_p1_hud: '<b>P1:</b> <span class="kbd">WASD</span> <span class="kbd">Space</span> <span class="kbd">F</span> <span class="kbd">C</span> <span class="kbd">V</span> <span class="kbd">E</span> <span class="kbd">T</span>',
    ctrl_p2_hud: '<b>P2:</b> <span class="kbd">Mũi tên</span> <span class="kbd">Enter</span> <span class="kbd">/</span> <span class="kbd">K</span> <span class="kbd">L</span> <span class="kbd">.</span> <span class="kbd">\'</span> · <b>P3/P4:</b> 🎮',
    carry_only_hint: '🏋️ Đồ nặng — Phải khiêng bộ qua cửa!',
    carry_only_badge: '🏋️ Khiêng bộ',
    throwable_badge: '🚀 Ném được',
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
    set_master_vol: 'Âm lượng tổng',
    set_bgm_vol: 'Nhạc nền',
    set_sfx_vol: 'Âm thanh',
    audio_mixer_title: 'ÂM THANH',
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
    end_menu_btn: 'VỀ BẢN ĐỒ',
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
    quote_rookie: 'Thử ném đồ nhẹ qua bạt lò xo hoặc khiêng đồ nặng đúng hướng cửa nhé!',
    mech_switch_on: 'BẬT CÔNG TẮC!',
    mech_switch_off: 'TẮT CÔNG TẮC!',
    mech_traffic_red: 'ĐÈN ĐỎ!',
    mech_traffic_green: 'ĐÈN XANH!',
    mech_pit_fall: 'LỌT HỐ!',
    mech_hazard_hit: 'VA CHẠM!',
    mech_laser_zap: '⚡ DÍNH LASER!',
    mech_guard_alert: '❗ BỊ PHÁT HIỆN!',
    mech_pack_neat: '✨ XẾP GỌN!',
    mech_pack_crowded: '📦 ĐẦY GÓC! NÉM CHỖ TRỐNG!',
    mech_slap_mate: '👋 BẠP!',
    mech_slap_guard: '💫 CHOÁNG LUÔN!',
    ping_help_carry: '🆘 Phụ khiêng!',
    ping_switch: '🕹️ Gạt công tắc!',
    ping_truck: '🚚 Vứt vô đây!',
    ping_gather: '📍 Tập trung!',
    mech_item_respawn: 'RỚT ĐỒ!',
    controls_btn: '📖',
    controls_modal_title: 'HƯỚNG DẪN CHƠI',
    controls_quick_hint: '',
    guide_full_html: `
      <p>🎯 <b>Mục tiêu &amp; Phân loại đồ:</b> Đồ <b>vòng đơn</b> <b>ném xa</b> qua hàng rào/bạt lò xo có <b>đường ngắm parabol</b>. Đồ <b>vòng cam kép 🏋️</b> (Sofa, Giường, Két, Khoang đông...) <b>không thể ném</b> — phải <b>khiêng bộ qua cửa</b>!</p>
      <p>👋 <b>Tát nhẹ &amp; Ping nhanh:</b> Nhấn <span class="kbd">E</span> để <b>tát đẩy đồng đội</b> hoặc <b>choáng Bảo vệ / Drone</b>! Nhấn <span class="kbd">T</span> / Chuột giữa để bắn <b>tín hiệu Ping 3D</b> kêu gọi bạn phụ khiêng hoặc gạt công tắc!</p>
      <p>📦 <b>Xếp thùng xe &amp; 16 Hợp đồng:</b> Căn đồ gọn gàng vào ô trống trong thùng xe để ăn thưởng <b>✨ Xếp gọn</b>! Khám phá <b>16 màn qua 4 chương</b> gồm cả <b>Phòng Thí Nghiệm &amp; Trạm Không Gian</b> với vùng trọng lực thấp &amp; tia laser!</p>
      <hr style="border:none;border-top:1px solid rgba(30,36,44,0.12);margin:10px 0;">
      <p>👤 <b>1 Người:</b> <span class="kbd">WASD</span> đi · <span class="kbd">Space</span> nhảy · <span class="kbd">F</span> lướt · <span class="kbd">J</span> nhặt · <span class="kbd">K</span>/Chuột ném · <span class="kbd">E</span> tát · <span class="kbd">T</span>/Chuột giữa ping · <span class="kbd">G</span> cảm xúc · <span class="kbd">Q/R</span> xoay</p>
      <p>🎮 <b>Tay cầm (tối đa 4 tay):</b> Stick trái đi · <span class="kbd">A</span> nhảy · <span class="kbd">X</span> nhặt · <span class="kbd">Y</span> tát · <span class="kbd">B/RT</span> ném / lướt · <span class="kbd">Select</span> ping · Stick phải xoay</p>
      <p>👥 <b>2–4 Người:</b> <b>P1:</b> <span class="kbd">WASD</span> <span class="kbd">Space</span> <span class="kbd">F</span> <span class="kbd">C</span> <span class="kbd">V</span> <span class="kbd">E</span> <span class="kbd">T</span> · <b>P2:</b> <span class="kbd">Mũi tên</span> <span class="kbd">Enter</span> <span class="kbd">/</span> <span class="kbd">K</span> <span class="kbd">L</span> <span class="kbd">.</span> <span class="kbd">'</span> · <b>P3/P4:</b> Tay cầm 3 &amp; 4</p>
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
    open_map_select_btn: '🗺️ All 16 Maps',
    overworld_btn: '🚐 Drive Town Map',
    overworld_launch_btn: '🚚 ACCEPT CONTRACT',
    overworld_back_btn: '🏠 Menu',
    overworld_roam_hint: 'Drive [WASD / Arrows] onto pads 1–16 across the town!',
    overworld_park_hint: 'Press [Space / J / Enter] to start this contract!',
    map_select_modal_title: 'SELECT MAP (16 CONTRACTS • 4 CHAPTERS)',
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
    mode_local3p: '3P',
    mode_local4p: '4P',
    mode_lan: 'LAN',
    skin_label: '🎨 Bobi Tint',
    skin_locked_toast: 'Collect {stars}★ to unlock this tint!',
    mod_label: '⚡ Modifier',
    mod_normal: 'Classic',
    mod_turbo: 'Turbo +25%',
    mod_bouncy: 'Super Bouncy',
    mod_chill: 'Assist',
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
    touch_slap: '👋 SLAP',
    touch_ping: '📍 PING',
    ctrl_single_hud: '<span class="kbd">WASD</span> Move · <span class="kbd">Space</span> Jump · <span class="kbd">F</span> Dash · <span class="kbd">J</span> Grab · <span class="kbd">K</span>/Mouse Throw · <span class="kbd">E</span> Slap · <span class="kbd">T</span> Ping · <span class="kbd">Q/R</span> Orbit',
    ctrl_p1_hud: '<b>P1:</b> <span class="kbd">WASD</span> <span class="kbd">Space</span> <span class="kbd">F</span> <span class="kbd">C</span> <span class="kbd">V</span> <span class="kbd">E</span> <span class="kbd">T</span>',
    ctrl_p2_hud: '<b>P2:</b> <span class="kbd">Arrows</span> <span class="kbd">Enter</span> <span class="kbd">/</span> <span class="kbd">K</span> <span class="kbd">L</span> <span class="kbd">.</span> <span class="kbd">\'</span> · <b>P3/P4:</b> 🎮',
    carry_only_hint: '🏋️ Heavy Cargo — Carry through doorways!',
    carry_only_badge: '🏋️ Carry Only',
    throwable_badge: '🚀 Throwable',
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
    set_master_vol: 'Master',
    set_bgm_vol: 'Music',
    set_sfx_vol: 'SFX',
    audio_mixer_title: 'AUDIO',
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
    end_menu_btn: 'TOWN / MAPS',
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
    quote_rookie: 'Carry oversized furniture straight through doorways!',
    mech_switch_on: 'SWITCH ON!',
    mech_switch_off: 'SWITCH OFF!',
    mech_traffic_red: 'RED LIGHT!',
    mech_traffic_green: 'GREEN LIGHT!',
    mech_pit_fall: 'PIT FALL!',
    mech_hazard_hit: 'BONK!',
    mech_laser_zap: '⚡ LASER ZAP!',
    mech_guard_alert: '❗ SPOTTED!',
    mech_pack_neat: '✨ NEAT PACK!',
    mech_pack_crowded: '📦 FULL CORNER! AIM OPEN BAY!',
    mech_slap_mate: '👋 SLAP!',
    mech_slap_guard: '💫 STUNNED!',
    ping_help_carry: '🆘 Help carry!',
    ping_switch: '🕹️ Hit switch!',
    ping_truck: '🚚 Load here!',
    ping_gather: '📍 Over here!',
    mech_item_respawn: 'DROPPED!',
    controls_btn: '📖',
    controls_modal_title: 'HOW TO PLAY',
    controls_quick_hint: '',
    guide_full_html: `
      <p>🎯 <b>Throwable vs Carry-Only:</b> Regular items show a live <b>parabolic aim arc</b> and can be <b>hurled</b> over fences &amp; trampolines. Heavy cargo with <b>double orange rings 🏋️</b> (Sofas, Beds, Safes, Cryo Pods) are <b>Carry-Only</b> — guide them cleanly through doorways!</p>
      <p>👋 <b>Playful Slap &amp; Quick Ping:</b> Press <span class="kbd">E</span> to <b>slap/nudge</b> teammates or stun chasing <b>Guards &amp; Drones</b>! Press <span class="kbd">T</span> / Middle Click to drop a <b>3D Ping Beacon</b> for co-op callouts!</p>
      <p>📦 <b>Spatial Truck Packing &amp; 16 Contracts:</b> Aim throws into open truck bays to earn <b>✨ Neat Pack</b> bonuses! Conquer <b>16 maps across 4 chapters</b>, including <b>Zero-G Labs &amp; Orbital Stations</b>!</p>
      <hr style="border:none;border-top:1px solid rgba(30,36,44,0.12);margin:10px 0;">
      <p>👤 <b>Solo:</b> <span class="kbd">WASD</span> move · <span class="kbd">Space</span> jump · <span class="kbd">F</span> dash · <span class="kbd">J</span> grab · <span class="kbd">K</span>/Mouse throw · <span class="kbd">E</span> slap · <span class="kbd">T</span>/Mid-Click ping · <span class="kbd">G</span> emote · <span class="kbd">Q/R</span> orbit</p>
      <p>🎮 <b>Gamepads (up to 4):</b> Left Stick move · <span class="kbd">A</span> jump · <span class="kbd">X</span> grab · <span class="kbd">Y</span> slap · <span class="kbd">B/RT</span> throw/dash · <span class="kbd">Select</span> ping · Right Stick orbit</p>
      <p>👥 <b>2–4P:</b> <b>P1:</b> <span class="kbd">WASD</span> <span class="kbd">Space</span> <span class="kbd">F</span> <span class="kbd">C</span> <span class="kbd">V</span> <span class="kbd">E</span> <span class="kbd">T</span> · <b>P2:</b> <span class="kbd">Arrows</span> <span class="kbd">Enter</span> <span class="kbd">/</span> <span class="kbd">K</span> <span class="kbd">L</span> <span class="kbd">.</span> <span class="kbd">'</span> · <b>P3/P4:</b> Gamepads 3 &amp; 4</p>
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
