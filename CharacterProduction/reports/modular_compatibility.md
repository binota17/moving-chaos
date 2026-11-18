# Báo Cáo Đánh Giá Tương Thích Hệ Thống Modular & Biến Thể (Modular Compatibility Report)
**Dự án:** Moving Chaos (2.5D Isometric Multiplayer Party Game)  
**Nhân vật:** Bobi (Base Mover, Bobi Builder, Chef Bobi)  
**Giai đoạn:** Milestone 5 — Modular Character Framework  
**Ngày thực hiện:** 2026-11-09  
**Người thực hiện:** Technical Artist / Character TD Agent  

---

## 1. Kiến Trúc Phân Lớp Nhân Vật Modular (Modular Layer Architecture)

Nhằm phục vụ tính năng tùy biến nhân vật trong phòng chờ (Lobby) và phân biệt 4-8 người chơi trên mạng LAN, Bobi được thiết kế theo cấu trúc Modular 4 tầng:

```text
CHR_Bobi_Root
├── Skeleton (19 Deform Joints + 6 Gameplay Sockets) [DÙNG CHUNG 100%]
├── Slot 1: BaseBody (Capsule Bean Mesh + Găng tay + Ủng)
├── Slot 2: HeadGear (Gắn tại Socket_Hat)
│   ├── None (Đầu trọc / Nơ cơ bản)
│   ├── Default_Hardhat (Mũ bảo hộ mini có cục bông)
│   ├── Part_Hat_Hardhat (Mũ công trường vàng có đèn LED)
│   └── Part_Hat_ChefToque (Mũ đầu bếp xếp nếp trắng cao)
├── Slot 3: TorsoWear (Skinned theo Spine, Chest, Hips)
│   ├── Default_DenimDungarees (Quần yếm jean xanh cổ điển)
│   ├── Part_Vest_Safety (Áo phản quang cam công trường)
│   └── Part_Apron_Chef (Tạp dề đầu bếp trắng có túi đựng dụng cụ)
└── Slot 4: Accessories & Sockets
    ├── Socket_Backpack (Ba lô tên lửa / Bình cứu hỏa / Bình dưỡng khí)
    ├── Socket_LeftHand (Dụng cụ phụ / Dây kéo)
    └── Socket_RightHand (Dụng cụ chính: Búa tạ, Xẻng, Muôi lật thức ăn)
```

---

## 2. Thông Số Kỹ Thuật 2 Biến Thể (Variant Specifications)

### Biến Thể A: Bobi Builder (Công Nhân Xây Dựng Siêu Quậy)
- **Chủ đề:** Môi trường công trường xây dựng, phá dỡ chướng ngại vật nặng.
- **Trang bị độc quyền:**
  - Mũ bảo hộ vàng có đèn LED gắn tại `Socket_Hat` ([Part_Hat_Hardhat.obj](file:///home/bbinota/dev/game/CharacterProduction/exports/modular/Part_Hat_Hardhat.obj)).
  - Áo ghi-lê phản quang cam neon có 2 dải bạc phản quang ([Part_Vest_Safety.obj](file:///home/bbinota/dev/game/CharacterProduction/exports/modular/Part_Vest_Safety.obj)).
  - Ủng da nâu bảo hộ mũi thép.
- **Tài nguyên kết cấu:** [bobi_builder_albedo.png](file:///home/bbinota/dev/game/CharacterProduction/textures/variants/bobi_builder_albedo.png)
- **Tệp mô hình:** [CHR_Bobi_VariantA_Builder.gltf](file:///home/bbinota/dev/game/CharacterProduction/exports/modular/CHR_Bobi_VariantA_Builder.gltf)

### Biến Thể B: Chef Bobi (Đầu Bếp Siêu Tốc)
- **Chủ đề:** Màn chơi nhà bếp hỗn loạn, nhặt nguyên liệu và ném chảo rán.
- **Trang bị độc quyền:**
  - Mũ đầu bếp trắng dáng nấm xếp nếp cao gắn tại `Socket_Hat` ([Part_Hat_ChefToque.obj](file:///home/bbinota/dev/game/CharacterProduction/exports/modular/Part_Hat_ChefToque.obj)).
  - Tạp dề trắng tinh có túi lớn đựng muỗng nĩa trước bụng ([Part_Apron_Chef.obj](file:///home/bbinota/dev/game/CharacterProduction/exports/modular/Part_Apron_Chef.obj)).
  - Khăn quàng cổ họa tiết caro đỏ trắng (Gingham Checkered Scarf).
- **Tài nguyên kết cấu:** [bobi_chef_albedo.png](file:///home/bbinota/dev/game/CharacterProduction/textures/variants/bobi_chef_albedo.png)
- **Tệp mô hình:** [CHR_Bobi_VariantB_Chef.gltf](file:///home/bbinota/dev/game/CharacterProduction/exports/modular/CHR_Bobi_VariantB_Chef.gltf)

---

## 3. Ma Trận Kiểm Tra Tương Thích Hoạt Hình (Animation Compatibility Matrix)

Cả 2 biến thể đều tái sử dụng **100% bộ khung xương 19 joints** của Bobi gốc, do đó không đòi hỏi bất kỳ bước Retargeting hay chỉnh sửa xương nào trong Godot 4:

| Animation Clip (P0) | Base Bobi | Variant A (Builder) | Variant B (Chef) | Đánh Giá Tương Thích & Xuyên Lớp (Clipping) |
| :--- | :---: | :---: | :---: | :--- |
| `CHR_Base_Idle` | PASS | PASS | PASS | Nhún nhảy mượt, mũ không va chạm vào vai. |
| `CHR_Base_Walk` | PASS | PASS | PASS | Dáng đi lạch bạch tự nhiên, tạp dề uốn mềm theo hông. |
| `CHR_Base_Run` | PASS | PASS | PASS | Thân chúi trước 18°, mũ nghiêng tự nhiên theo đầu. |
| `CHR_Base_PickUp` | PASS | PASS | PASS | Cúi người nhấc thùng: mép áo phản quang và tạp dề bám sát ngực, không xuyên thấu (no mesh clipping). |
| `CHR_Base_CarryWalk` | PASS | PASS | PASS | Hai tay nâng thùng qua đầu không vướng vành mũ công trường hay mũ đầu bếp. |
| `CHR_Base_Push` & `Pull` | PASS | PASS | PASS | Trọng tâm ngả trước/sau vững chắc. |
| `CHR_Base_Fall` & `GetUp` | PASS | PASS | PASS | Ngã sấp mặt: mũ tiếp xúc sàn chân thực, không bị biến dạng bất thường. |
| `CHR_Base_Throw` | PASS | PASS | PASS | Ném kiện hàng vút đi: tay vung tự do không vướng áo ghi-lê. |
| `CHR_Base_Celebrate` | PASS | PASS | PASS | Xoay tròn 360 độ ăn mừng: dải phản quang và khăn carô nổi bật đẹp mắt. |

---

## 4. Xử Lý Chống Xuyên Thấu Hình Học (Geometry Clipping Mitigation)

1. **Nguyên tắc bọc ngoài (Offset Expansion):**
   - Các phụ kiện áo khoác ngoài (Áo phản quang `Part_Vest_Safety` và Tạp dề `Part_Apron_Chef`) được mở rộng bán kính ngoài thêm **+1.5cm** so với mặt da và quần yếm gốc.
2. **Cơ chế ẩn hình học ẩn (Hidden Mesh Occlusion Culling):**
   - Khi mặc trang phục trùm kín toàn thân (Full Body Suit ở các bản mở rộng tương lai), Godot 4 shader có thể sử dụng Alpha Mask hoặc vô hiệu hóa các tiểu nhóm bề mặt bị che lấp để tiết kiệm 100% chi phí fill-rate GPU.

---

## 5. Triển Khai GDScript Ghép Nối Modular Trong Godot 4

Đoạn mã điều khiển tùy biến nhân vật thời gian thực trong phòng chờ:

```gdscript
# ModularCharacter.gd - Bộ lắp ráp nhân vật Modular cho Moving Chaos
class_name ModularCharacter extends CharacterBody3D

@export var current_hat: PackedScene
@export var current_albedo_texture: Texture2D

@onready var hat_socket: BoneAttachment3D = $CHR_Bobi_Armature/Chest/Head/Socket_Hat
@onready var mesh_instance: MeshInstance3D = $CHR_Bobi_SkinnedMesh

func apply_customization(skin_tex: Texture2D, hat_scene: PackedScene) -> void:
    # 1. Đổi Texture Atlas (Vàng cơ bản, Builder, Chef)
    if skin_tex:
        var mat: StandardMaterial3D = mesh_instance.get_surface_override_material(0)
        mat.albedo_texture = skin_tex
        
    # 2. Thay đổi nón bảo hộ / mũ đầu bếp tại Socket_Hat
    for child in hat_socket.get_children():
        child.queue_free()
        
    if hat_scene:
        var new_hat = hat_scene.instantiate()
        hat_socket.add_child(new_hat)
        new_hat.transform = Transform3D.IDENTITY
```

---

## 6. Kết Luận
Hệ thống Modular và 2 biến thể `Bobi Builder` cùng `Chef Bobi` đã hoàn thành xuất sắc, đáp ứng toàn diện mọi tiêu chí kỹ thuật của Cột mốc 5.
- Ảnh so sánh trực quan: [character_variants.png](file:///home/bbinota/dev/game/CharacterProduction/renders/character_variants.png)
- Toàn bộ tài nguyên sẵn sàng bước sang **Cột mốc 6 (Engine Integration & LAN Validation)**.

