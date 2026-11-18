# TÀI LIỆU HƯỚNG DẪN THIẾT KẾ NHÂN VẬT (CHARACTER STYLE GUIDE)
## DỰ ÁN: MOVING CHAOS (2.5D ISOMETRIC CO-OP - GODOT 4)
### PHIÊN BẢN CONCEPT CHÍNH THỨC: MASCOT CHIBI BOBI

---

## 1. THỐNG SỐ VÀ ĐỊNH HƯỚNG ĐÃ XÁC NHẬN (CONFIRMED PROJECT SPECIFICATIONS)

| Tiêu chí | Quyết định đã chốt | Tác động kỹ thuật & mỹ thuật |
| :--- | :--- | :--- |
| **Game Engine** | **Godot 4.x** | Định dạng xuất `glTF 2.0 (.glb)`, sử dụng `CharacterBody3D`, `AnimationTree` (BlendSpace2D + StateMachine), hỗ trợ ShapeKeys/MorphTargets cho Squash & Stretch. |
| **Camera** | **Fixed Isometric (Cố định)** | Góc xiên ~30°–35° cố định nhìn từ trên xuống. Thân hình khối tròn trịa giúp giữ nguyên hình dạng rõ nét ở mọi góc quay 360 độ. |
| **Di chuyển** | **360 độ tự do (Continuous 360°)** | Di chuyển mượt mà, dáng chạy lon ton lắc lư (waddle run) cực kỳ đáng yêu và tự nhiên. |
| **Phong cách hình tượng** | **Mascot Chibi Hạt Đậu (Cute Mascot Bean)** | Lấy cảm hứng từ các game party kinh điển (*Fall Guys, Overcooked, Party Animals*): Thân hình tròn trịa mềm mại, mắt to ngây thơ, biểu cảm cực cưng khi bị đồ đè bẹp dí. |

---

## 2. THIẾT KẾ HÌNH TƯỢNG: "BOBI - CHÚ BÉ HẠT ĐẬU DỌN NHÀ"

### 2.1. Hình Thể Cốt Lõi (Shape Language & Proportions)
- **Thân hạt đậu / Capsule:** Đầu và thân hòa quyện thành một khối hình bầu dục mềm mại (chubby pill body). Thiết kế này triệt tiêu hoàn toàn lỗi gãy cổ, nhăn nách khi giơ tay vác đồ nặng.
- **Tỉ lệ chiều cao chuẩn hóa (Normalized Height = 1.0, thực tế ~1.15m trong Godot):**
  - **Phần trên (Mặt & Nón):** Chiếm ~45% chiều cao, tâm điểm thị giác.
  - **Phần giữa (Bụng tròn & Yếm):** Chiếm ~35%, tạo cảm giác núng nính, dễ thương.
  - **Phần dưới (Chân ngắn & Ủng):** Chiếm ~20%, sải bước ngắn, chạy lon ton.
- **Bàn tay phóng đại (Oversized Cartoon Gloves):** Găng tay bông trắng 4 ngón hoạt hình phóng to (130%), giúp người chơi nhận biết ngay lập tức trạng thái: cầm đồ, chuẩn bị ném, hay buông tay từ khoảng cách camera xa.
- **Phụ kiện điểm nhấn:**
  - Chiếc mũ bảo hộ công nhân màu vàng tí hon đội lệch trên đỉnh đầu, đính kèm quả bông nhỏ (circus pom-pom) tạo nét tinh nghịch.
  - Chiếc quần yếm mini bằng vải denim xanh bò ôm lấy chiếc bụng tròn, có khuy cài màu sắc và khăn quàng cổ đỏ thắm.

---

## 3. BẢNG MÀU CHUẨN HOÁ (VIBRANT CHIBI PALETTE)

Thiết kế màu sắc rực rỡ, tươi sáng, tạo độ tương phản nổi bật trên mọi nền gạch sàn và đồ nội thất:

```
+------------------------------------------------------------------------+
| 🟡 PRIMARY 1: #FFA502 (Warm Butter Yellow)  - Thân hạt đậu & Mũ bảo hộ |
| 🔵 PRIMARY 2: #3742FA (Vibrant Cobalt Blue) - Quần yếm bò denim        |
| 🔴 ACCENT:    #FF4757 (Bright Tomato Red)   - Khăn quàng cổ & Nơ nón   |
| ⚪ CONTRAST:  #FFFFFF (Pure Soft White)     - Găng tay bông & Tròng mắt|
| 🟤 LEATHER:   #57606F (Deep Charcoal Boot)  - Đôi ủng nhỏ xíu          |
| 🌸 BLUSH:     #FF6B81 (Soft Rosy Pink)      - Má hồng phúng phính      |
+------------------------------------------------------------------------+
```

---

## 4. QUY CHUẨN KỸ THUẬT MESH & TOPOLOGY (BLENDER -> GODOT 4)

### 4.1. Ngân Sách Đa Giác (Triangle Budget)
Nhờ hình thể hạt đậu liền mạch tinh giản, ngân sách đa giác giảm đáng kể nhưng độ mượt lại cao hơn:
- **Thân capsule liền khối:** 3.000 – 4.500 tris.
- **Tay, chân, găng, ủng:** 2.000 – 3.000 tris.
- **Mũ bảo hộ & Quần yếm:** 1.000 – 1.500 tris.
- **Tổng ngân sách:** **6.000 – 9.000 triangles** (Cực kỳ nhẹ, tối ưu tuyệt đối cho 4–8 người chơi cùng lúc trên mobile và web).

### 4.2. Dáng Chuẩn (Neutral A-Pose)
- Hai tay duỗi chéo 40 độ ra ngoài, bàn tay hơi úp về phía trước.
- Hai chân ngắn dang rộng ngang vai, trọng tâm đặt vững chãi.

### 4.3. Cơ Chế "Squash & Stretch" (Bẹp Dí & Nảy Bật)
- Thiết lập 2 Shape Keys / Blendshapes cơ bản trên thân:
  1. `Squash_Pancake`: Bẹp dẹt theo trục Z xuống 35%, phình rộng trục X/Y ra 145% (khi bị tivi rơi trúng đầu hoặc ngã bẹp sàn).
  2. `Stretch_Balloon`: Kéo dài trục Z lên 135%, thon lại trục X/Y (khi gồng lực ném hoặc nảy tưng tưng từ bạt lò xo).

---

## 5. HỆ THỐNG XƯƠNG & SOCKETS (RIGGING FOR GODOT 4)

```text
Root (Floor)
└── Pelvis_Root
    ├── Belly_Spine (Xương bụng tròn - uốn lượn nhịp nhàng)
    │   ├── Head_Look (Xương đầu & mặt)
    │   │   └── Socket_Head (Nón bảo hộ)
    │   ├── Arm_L -> Forearm_L -> Hand_L -> Socket_LeftHand
    │   ├── Arm_R -> Forearm_R -> Hand_R -> Socket_RightHand
    │   └── Socket_OverheadCarry (Tọa độ ôm đồ trên đỉnh đầu tròn)
    │   └── Socket_ChestCarry (Tọa độ ôm đồ trước bụng phúng phính)
    ├── Leg_L -> Foot_L
    └── Leg_R -> Foot_R
```

---

## 6. DANH MỤC ANIMATION CỐT LÕI (ANIMATION LIBRARY)

1. `Bobi_Idle`: Đứng lắc lư thân hạt đậu, nhịp chân bịch bịch, chớp chớp mắt.
2. `Bobi_WaddleWalk`: Chạy bước ngắn lon ton, hai tay vung vẩy, người nghiêng qua nghiêng lại 15 độ.
3. `Bobi_CarryHeavy`: Hai tay giơ cao đỡ đồ trên đầu, má phồng căng phúng phính, chân bước dạng rộng giữ thăng bằng.
4. `Bobi_PushHeavy`: Tì hai tay bẹp vào đồ vật, người nghiêng dồn sức đẩy về trước.
5. `Bobi_SuperYeet`: Ngả người tròn ra sau lấy đà, sau đó bung toàn thân bắn đồ bay vút đi.
6. `Bobi_PancakeSquash`: Bị đồ rơi đè bẹp dí như chiếc bánh kếp, tay chân xòe ra sàn, mắt hiện xoắn ốc `@ @`.
7. `Bobi_PopRecovery`: Nảy bật như quả bóng cao su trở lại hình tròn, tiếp đất bằng hai chân kèm nụ cười rạng rỡ.
