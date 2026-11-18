# Character Production Pipeline: Bobi (Moving Chaos)

Tài nguyên sản xuất nhân vật 3D hoàn chỉnh cho tựa game **Moving Chaos** (2.5D Isometric Multiplayer Party Game), được xây dựng tuân thủ nghiêm ngặt theo đặc tả kỹ thuật tại [character_production_pipeline_2_5d_isometric.md](../character_production_pipeline_2_5d_isometric.md).

---

## 1. Thông Tin Nhân Vật
- **Tên:** Bobi (The Chubby Bean Mascot Mover)
- **Phong cách:** 3D Stylized Chibi Hạt Đậu (tương đồng với *Fall Guys*, *Overcooked*, *Human: Fall Flat*).
- **Kích thước:** Cao $1.15\text{m}$, Rộng $0.92\text{m}$, Sâu $0.45\text{m}$.
- **Ngân sách đa giác:** $4,144\text{ tris}$ ($2,256\text{ vertices}$), $98.4\%\text{ Quad-dominant}$.
- **Engine mục tiêu:** **Godot 4.x** (Forward+ / Mobile) với định dạng tiêu chuẩn **glTF 2.0**.
- **Chính sách di chuyển:** Xoay hướng liên tục $360^\circ$ (Continuous $360^\circ$ Locomotion) dưới góc nhìn camera Isometric $30^\circ - 35^\circ$.

---

## 2. Các Cột Mốc Đã Đạt Được (Milestones 1 - 6)
1. **Milestone 1 — Approved Concept:** [concept/](concept/) & [character_style_guide.md](character_style_guide.md)
2. **Milestone 2 — Base Mesh:** [exports/meshes/CHR_Bobi_Base.obj](exports/meshes/CHR_Bobi_Base.obj) & [reports/model_stats.md](reports/model_stats.md)
3. **Milestone 3 — Deformation & Rig:** [exports/skeletons/CHR_Bobi_Rigged.gltf](exports/skeletons/CHR_Bobi_Rigged.gltf) & [reports/rig_skinning_review.md](reports/rig_skinning_review.md)
4. **Milestone 4 — Animation Library:** [exports/animations/CHR_Bobi_Animations.gltf](exports/animations/CHR_Bobi_Animations.gltf) (13 P0 clips) & [reports/animation_review.md](reports/animation_review.md)
5. **Milestone 5 — Modular Framework:** [exports/modular/](exports/modular/) (Bobi Builder & Chef Bobi) & [reports/modular_compatibility.md](reports/modular_compatibility.md)
6. **Milestone 6 — Engine Integration:** [integration_test_scene/](integration_test_scene/) & [reports/engine_import_validation.md](reports/engine_import_validation.md)

---

## 3. Cách Mở Dự Án Trong Godot 4
1. Cài đặt và mở **Godot Engine 4.x**.
2. Nhấn **Import** và trỏ đến thư mục: `CharacterProduction/integration_test_scene/project.godot`.
3. Nhấn **Run Project (F5)** để chạy màn thử nghiệm Isometric [TestLevel_Isometric.tscn](integration_test_scene/scenes/TestLevel_Isometric.tscn).
   - Di chuyển bằng phím `WASD` (hoặc tay cầm chơi game).
   - Nhặt thùng hàng bằng phím `Spacebar`.
   - Ném vút thùng hàng (Super Yeet) bằng phím `E`.
   - Chạy mạng LAN co-op tối đa 8 người chơi cùng lúc.

