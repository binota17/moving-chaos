# Báo Cáo Đánh Giá Rigging, Skinning & Gameplay Sockets (Rig & Skinning Review)
**Dự án:** Moving Chaos (2.5D Isometric Multiplayer Party Game)  
**Nhân vật:** Bobi (Cute Chubby Bean Mascot)  
**Giai đoạn:** Milestone 3 - Deformation-Ready Character  
**Ngày thực hiện:** 2026-11-09  
**Người thực hiện:** Technical Artist / Character TD Agent  

---

## 1. Cấu Trúc Khung Xương (Bone Hierarchy & Joint Transforms)

Bộ xương biến dạng (Deform Skeleton) được xây dựng tuân thủ nghiêm ngặt mục tiêu engine **Godot 4.x** (glTF 2.0, Forward = -Z, Up = +Y, Unit = 1m).

### Sơ Đồ Cây Khung Xương:
```text
Root (0.0, 0.0, 0.0) [Gốc sàn]
└── Hips (0.0, 0.45, 0.0)
    ├── Spine (0.0, 0.60, 0.0)
    │   └── Chest (0.0, 0.75, 0.0)
    │       ├── Head (0.0, 0.88, 0.0)
    │       │   └── [Socket_Hat] (0.04, 1.15, -0.02)
    │       ├── LeftShoulder (-0.16, 0.70, 0.0)
    │       │   └── LeftUpperArm (-0.26, 0.58, 0.0)
    │       │       └── LeftForearm (-0.36, 0.50, 0.0)
    │       │           └── LeftHand (-0.46, 0.42, -0.02)
    │       │               └── [Socket_LeftHand] (-0.46, 0.42, -0.07)
    │       ├── RightShoulder (0.16, 0.70, 0.0)
    │       │   └── RightUpperArm (0.26, 0.58, 0.0)
    │       │       └── RightForearm (0.36, 0.50, 0.0)
    │       │           └── RightHand (0.46, 0.42, -0.02)
    │       │               └── [Socket_RightHand] (0.46, 0.42, -0.07)
    │       ├── [Socket_OverheadCarry] (0.0, 1.25, 0.0)
    │       ├── [Socket_ChestCarry] (0.0, 0.65, -0.38)
    │       └── [Socket_Backpack] (0.0, 0.62, 0.34)
    ├── LeftUpperLeg (-0.16, 0.35, 0.0)
    │   └── LeftLowerLeg (-0.16, 0.20, 0.0)
    │       └── LeftFoot (-0.16, 0.08, -0.04)
    └── RightUpperLeg (0.16, 0.35, 0.0)
        └── RightLowerLeg (0.16, 0.20, 0.0)
            └── RightFoot (0.16, 0.08, -0.04)
```

**Tổng số Joint Biến Dạng:** 19 xương  
**Tổng số Socket Gameplay:** 6 điểm gắn vật phẩm chuyên dụng  

---

## 2. Danh Sách & Chức Năng Của Gameplay Sockets

Trong một tựa game Party Game hỗn loạn như Moving Chaos, việc cầm nắm đồ đạc (thùng hàng, tảng băng, bom nổ chậm, đồng đội) đòi hỏi các điểm neo (Sockets) chuẩn xác:

| Tên Socket | Node Cha (Parent Bone) | Tọa Độ Gốc (Offset) | Ứng Dụng Gameplay |
| :--- | :--- | :--- | :--- |
| `Socket_OverheadCarry` | `Chest` | `(0.0, 1.25, 0.0)` | Điểm gắn các kiện hàng cồng kềnh bê trên đầu (thùng gỗ, tủ lạnh, đàn piano). Giúp vật phẩm không rung lắc khi chạy. |
| `Socket_ChestCarry` | `Chest` | `(0.0, 0.65, -0.38)` | Điểm ôm vật phẩm vừa và nhỏ trước ngực (bình cứu hỏa, gói quà, hộp dụng cụ). |
| `Socket_LeftHand` | `LeftHand` | `(-0.46, 0.42, -0.07)` | Điểm cầm dụng cụ một tay (búa, chìa khóa, súng bắn dây móc). |
| `Socket_RightHand` | `RightHand` | `(0.46, 0.42, -0.07)` | Điểm cầm dụng cụ chính tay phải hoặc kéo tay đồng đội. |
| `Socket_Backpack` | `Chest` | `(0.0, 0.62, 0.34)` | Điểm đeo ba lô phản lực (Jetpack) hoặc bình oxy cho các màn chơi không trọng lực. |
| `Socket_Hat` | `Head` | `(0.04, 1.15, -0.02)` | Điểm gắn mũ trang trí modular (mũ bảo hiểm, nón đầu bếp, vương miện). |

---

## 3. Phân Phối Trọng Số Skinning (Skin Weights Distribution)

1. **Giới hạn số ảnh hưởng (Influence limit):** Tối đa **4 xương trên mỗi đỉnh (Max 4 influences per vertex)**. Đây là giới hạn tiêu chuẩn vàng của phần cứng đồ họa và Godot 4 shader pipeline.
2. **Chuẩn hóa (Normalization):** 100% trọng số của mỗi đỉnh được chuẩn hóa về tổng bằng `1.0`.
3. **Phân vùng chuyển tiếp (Smooth Weight Blending):**
   - Vùng đỉnh đầu và mũ: 100% thuộc xương `Head`.
   - Vùng thân hạt đậu: Chuyển tiếp mượt mà theo hàm tuyến tính từ `Hips` -> `Spine` -> `Chest` -> `Head`.
   - Vùng bàn tay: Găng tay trắng cứng cáp 100% theo `LeftHand`/`RightHand` để giữ nguyên hình dáng hoạt hình khi va chạm.
   - Vùng chân: Ứng dụng trọng số bậc thang phân chia rõ rệt giữa đùi, bắp chân và đế ủng cao su.

---

## 4. Tệp Xuất Bản & Tích Hợp Engine

Các tệp mô hình đã được xuất khẩu sẵn sàng trong dự án:
- [CHR_Bobi_Rigged.gltf](file:///home/bbinota/dev/game/CharacterProduction/exports/skeletons/CHR_Bobi_Rigged.gltf) (glTF 2.0 chứa Mesh, Skeleton 19 joints, 6 Sockets, PBR Material linkage).
- [CHR_Bobi_Rigged.bin](file:///home/bbinota/dev/game/CharacterProduction/exports/skeletons/CHR_Bobi_Rigged.bin) (152 KB, chứa toàn bộ Vertex Buffers, Normals, UVs, Joint Indices, Skin Weights và Inverse Bind Matrices).
- [build_character_rig.py](file:///home/bbinota/dev/game/CharacterProduction/scripts/blender/build_character_rig.py) (Script Blender tự động hóa rigging dành cho bất kỳ máy trạm Blender ngoài nào).
- [build_rigged_character.py](file:///home/bbinota/dev/game/CharacterProduction/scripts/build_rigged_character.py) (Bộ tạo dựng độc lập chạy trực tiếp trong Linux container).

---

## 5. Kết Luận
Bộ khung xương, trọng số da (skin weights) và các sockets attachment points đã hoàn tất, vượt qua mọi bài kiểm tra biến dạng khắt khe. Mô hình nhân vật Bobi đã sẵn sàng 100% để bước vào **Milestone 4 (Thư Viện Hoạt Hình Gameplay P0)**.

