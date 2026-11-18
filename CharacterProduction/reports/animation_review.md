# Báo Cáo Đánh Giá Thư Viện Hoạt Hình Gameplay (Gameplay Animation Review)
**Dự án:** Moving Chaos (2.5D Isometric Multiplayer Party Game)  
**Nhân vật:** Bobi (Cute Chubby Bean Mascot)  
**Giai đoạn:** Milestone 4 — Gameplay Animation Library  
**Ngày thực hiện:** 2026-11-09  
**Người thực hiện:** Lead Animator / Technical Artist Agent  

---

## 1. Bảng Danh Mục Hoạt Hình P0 (P0 Animation Clips Inventory)

Toàn bộ 13 animation clips cốt lõi (P0) đã được xây dựng tại chuẩn tốc độ **30 FPS**, tương thích trực tiếp với hệ thống `AnimationPlayer` và `AnimationTree` của **Godot 4.x**.

| Tên Animation Clip | Số Frame | Thời Lượng | Chế Độ Lặp (Loop) | Chính Sách Root Motion | Mô Tả & Cảm Xúc Chuyển Động |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `CHR_Base_Idle` | 30 frames | 1.00s | Loop | In-place | Nhịp thở nhún nhảy dễ thương của hạt đậu, tay đung đưa nhẹ nhàng. |
| `CHR_Base_Walk` | 24 frames | 0.80s | Loop | In-place | Dáng đi lạch bạch lắc lư như chim cánh cụt (penguin waddle), hông nhấp nhô vui nhộn. |
| `CHR_Base_Run` | 16 frames | 0.53s | Loop | In-place | Lao nhanh về phía trước với góc nghiêng người 18°, chân guồng nhanh tếu táo. |
| `CHR_Base_PickUp` | 20 frames | 0.67s | One-shot | In-place | Cúi người hạ thấp trọng tâm, hai tay áp vào vật thể và nhấc bổng lên cao. |
| `CHR_Base_Drop` | 15 frames | 0.50s | One-shot | In-place | Hạ thấp cánh tay đặt nhẹ kiện hàng xuống sàn an toàn. |
| `CHR_Base_CarryIdle` | 30 frames | 1.00s | Loop | In-place | Đứng thở giữ thăng bằng khi đang đội một kiện hàng nặng trên đầu. |
| `CHR_Base_CarryWalk` | 24 frames | 0.80s | Loop | In-place | Bước đi có độ ì và sức nặng rõ rệt, thân hạt đậu hơi ngửa ra sau giữ trọng tâm. |
| `CHR_Base_Push` | 24 frames | 0.80s | Loop | In-place | Dồn toàn bộ trọng lượng cơ thể đẩy tủ sắt / vật thể nặng về phía trước. |
| `CHR_Base_Pull` | 24 frames | 0.80s | Loop | In-place | Ngả người về phía sau 20°, bám chặt tay kéo lùi vật thể. |
| `CHR_Base_Fall` | 20 frames | 0.67s | One-shot | In-place | Trượt vỏ chuối hoặc bị húc ngã sấp mặt hài hước xuống sàn (slapstick fall). |
| `CHR_Base_GetUp` | 30 frames | 1.00s | One-shot | In-place | Lồm cồm bò dậy, lắc đầu rũ bụi và đứng bật dậy sẵn sàng chơi tiếp. |
| `CHR_Base_Throw` | 18 frames | 0.60s | One-shot | In-place | Lấy đà ngả người ra sau rồi bung lực ném kiện hàng bay vút đi (Super Yeet). |
| `CHR_Base_Celebrate` | 36 frames | 1.20s | Loop | In-place | Nhảy cẫng lên ăn mừng, xoay 360 độ và giơ 2 tay chữ V chiến thắng. |

---

## 2. Hệ Thống Sự Kiện Hoạt Hình Gameplay (Animation Events / Notifies)

Các mốc sự kiện (Animation Markers) được tích hợp chính xác vào dòng thời gian để điều khiển logic vật lý và gameplay engine mà không phụ thuộc vào chu kỳ cập nhật hình ảnh:

```text
CHR_Base_PickUp:
  f0 ──────── f4(GripStart) ─────── f10(GripContact) ─────── f20

CHR_Base_Drop:
  f0 ──────── f5(ObjectRelease) ──────────────────────────── f15

CHR_Base_Throw:
  f0 ──────── f7(ObjectRelease) ──────────────────────────── f18

CHR_Base_Fall:
  f0 ──────── f8(Impact) ─────────────────────────────────── f20

CHR_Base_GetUp:
  f0 ────────────────────────────── f25(RecoveryComplete) ── f30
```

| Tên Clip | Frame Kích Hoạt | Tên Event / Marker | Ý Nghĩa Trong Logic Game & Mạng LAN |
| :--- | :--- | :--- | :--- |
| `CHR_Base_Walk` | Frame 6 & Frame 18 | `Footstep_L`, `Footstep_R` | Phát âm thanh tiếng bước chân cao su lẹp bẹp và spawn hạt bụi nhỏ. |
| `CHR_Base_Run` | Frame 4 & Frame 12 | `Footstep_L`, `Footstep_R` | Phát tiếng chạy dồn dập và hiệu ứng vệt gió cartoon. |
| `CHR_Base_CarryWalk` | Frame 6 & Frame 18 | `Footstep_L`, `Footstep_R` | Tiếng bước chân nặng hơn với độ rung nhẹ màn hình (camera shake nhỏ). |
| `CHR_Base_PickUp` | Frame 4 | `GripStart` | Bắt đầu khóa vị trí tương tác của người chơi, ngăn di chuyển đổi hướng. |
| `CHR_Base_PickUp` | Frame 10 | `GripContact` | **Điểm mấu chốt:** Engine chính thức chuyển quyền sở hữu (repairs/parents) vật thể sang `Socket_OverheadCarry` hoặc `Socket_ChestCarry`. Đồng bộ trạng thái qua mạng LAN. |
| `CHR_Base_Drop` | Frame 5 | `ObjectRelease` | Gỡ vật thể khỏi socket, kích hoạt lại va chạm vật lý `RigidBody3D` của vật thể rơi xuống mặt sàn. |
| `CHR_Base_Throw` | Frame 7 | `ObjectRelease` | Gỡ vật thể và truyền vector vận tốc ném $V = \vec{dir} \times force$ cho vật thể bay trong không gian. |
| `CHR_Base_Fall` | Frame 8 | `Impact` | Đầu và ngực chạm sàn: Phát âm thanh bẹp "Splat!", làm rơi bất kỳ vật phẩm nào đang cầm, kích hoạt hiệu ứng sao quay quanh đầu. |
| `CHR_Base_GetUp` | Frame 25 | `RecoveryComplete` | Nhân vật hoàn tất đứng thẳng, mở lại quyền điều khiển di chuyển (unfreeze input) cho người chơi. |

---

## 3. Khả Năng Đọc Từ Camera Isometric 2.5D Cố Định (Camera Readability)

Dưới góc nhìn Camera Isometric cố định (góc chúi xuống 30° - 35°):
1. **Xoay hướng 360 độ liên tục (Continuous 360° Rotation):**
   - Áp dụng nguyên tắc xoay node nhân vật (`CharacterBody3D.rotation.y`) theo hướng vector di chuyển của analog stick / phím bấm.
   - Nhờ vậy, 13 clip hoạt hình in-place được tái sử dụng mượt mà cho mọi hướng di chuyển mà không cần phải nhân đôi số lượng tài nguyên cho 8 hướng cố định.
2. **Độ tương phản chuyển động:**
   - Khi đứng yên: Nhịp thở nhấp nhô 2cm theo trục Y giúp nhân vật luôn "sống động" trên nền bản đồ màn chơi đông đúc.
   - Khi bê hàng: Cánh tay giơ thẳng qua đầu làm tăng chiều cao silhouette thêm 30%, giúp người chơi lập tức nhận diện đồng đội đang mang vác đồ vật từ xa.

---

## 4. Tích Hợp Godot 4 (`AnimationTree` & GDScript Controller)

### Kiến Trúc State Machine Trong `AnimationTree`:
```text
                  ┌──────────────┐
                  │     Idle     │
                  └──────┬───────┘
                         │ (speed > 0.1)
                         ▼
                  ┌──────────────┐
                  │  Locomotion  │ (BlendSpace1D: Walk <-> Run)
                  └──────┬───────┘
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
┌───────────┐      ┌───────────┐      ┌───────────┐
│  PickUp   │      │   Carry   │      │   Fall    │
└─────┬─────┘      └─────┬─────┘      └─────┬─────┘
      │                  │                  │
      └──────────────────┴──────────────────┘
```

### Mẫu Tích Hợp GDScript Cho Socket Tương Tác:
```gdscript
extends CharacterBody3D

@onready var anim_tree: AnimationTree = $AnimationTree
@onready var overhead_socket: Marker3D = $CHR_Bobi_Armature/Chest/Socket_OverheadCarry
var held_object: RigidBody3D = null

func _on_animation_event(event_name: String) -> void:
    match event_name:
        "GripContact":
            if target_pickup_object:
                held_object = target_pickup_object
                held_object.freeze = true # Tạm khóa physics engine
                held_object.reparent(overhead_socket)
                held_object.transform = Transform3D.IDENTITY
                rpc("sync_pickup_lan", held_object.get_path())
        "ObjectRelease":
            if held_object:
                held_object.reparent(get_parent())
                held_object.freeze = false
                held_object.apply_central_impulse(transform.basis.z * -12.0) # Ném đồ
                held_object = null
```

---

## 5. Kết Luận & Tệp Xuất Bản
- [CHR_Bobi_Animations.gltf](file:///home/bbinota/dev/game/CharacterProduction/exports/animations/CHR_Bobi_Animations.gltf) (glTF 2.0 chứa toàn bộ 13 animation tracks, samplers và TRS channels).
- [CHR_Bobi_Animations.bin](file:///home/bbinota/dev/game/CharacterProduction/exports/animations/CHR_Bobi_Animations.bin) (23 KB dữ liệu spline keyframes).
- [locomotion_preview.png](file:///home/bbinota/dev/game/CharacterProduction/renders/animation_preview/locomotion_preview.png) (Ảnh render preview 3D trạng thái Idle, Walk waddle, Run sprint).
- [build_animation_library.py](file:///home/bbinota/dev/game/CharacterProduction/scripts/blender/build_animation_library.py) & [build_standalone_animations.py](file:///home/bbinota/dev/game/CharacterProduction/scripts/build_standalone_animations.py).

Thư viện hoạt hình Gameplay P0 đã hoàn tất xuất sắc và sẵn sàng cho việc nghiệm thu Cột mốc 4!

