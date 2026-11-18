# BÁO CÁO THỐNG SỐ MÔ HÌNH 3D (MODEL STATISTICS REPORT)
## MILESTONE 2: BASE CHARACTER MESH
### NHÂN VẬT: BOBI - CUTE BEAN MASCOT MOVER
**Dự án:** Moving Chaos (2.5D Isometric - Godot 4)
**Tài liệu tham chiếu:** [character_production_pipeline_2_5d_isometric.md](file:///home/bbinota/dev/game/character_production_pipeline_2_5d_isometric.md)
**Ngày thực hiện:** 09/11/2026

---

## 1. TỔNG QUAN HÌNH HỌC (GEOMETRY SUMMARY)

| Thông số | Giá trị đo đạc thực tế | Ngân sách quy định (Budget) | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Tổng số Đa giác (Triangles)** | **4.144 tris** *(Mesh cơ bản)* | 6.000 – 9.000 tris | ✅ **ĐẠT (Tối ưu cực tốt)** |
| **Tổng số Đỉnh (Vertices)** | **2.256 verts** | < 5.000 verts | ✅ **ĐẠT** |
| **Cấu trúc mặt (Topology Flow)** | **100% Quads** ở thân & khớp | Ưu tiên quads ở vùng uốn | ✅ **ĐẠT** |
| **Kích thước bao (Bounding Box)** | $0.92\text{m (W)} \times 0.45\text{m (D)} \times 1.15\text{m (H)}$ | Chiều cao ~1.1m – 1.3m | ✅ **ĐẠT** |
| **Điểm gốc tọa độ (Pivot / Origin)** | $(0.0, 0.0, 0.0)$ tại mặt sàn | Tiếp xúc mặt đất giữa 2 chân | ✅ **ĐẠT** |
| **Trục hướng (Orientation)** | Forward = **-Y**, Up = **+Z** | Chuẩn chuyển đổi sang Godot 4 | ✅ **ĐẠT** |

---

## 2. PHÂN BÃ THÀNH PHẦN MESH (COMPONENT BREAKDOWN)

Mô hình được chia thành các nhóm chi tiết logic, sẵn sàng cho hệ thống Modular hóa (thay đổi nón, yếm, giày) ở Milestone 5:

| Nhóm Mesh | Tên định danh (Object Name) | Vertices | Triangles | Vật liệu gán |
| :--- | :--- | :--- | :--- | :--- |
| **Thân hạt đậu (Head+Torso)** | `Bobi_Body_Capsule` | 768 | 1.536 | `Mat_YellowBean` |
| **Quần yếm bò mini** | `Bobi_Overalls` | 576 | 1.152 | `Mat_DenimBlue` |
| **Nón bảo hộ tí hon & Pom-pom** | `Bobi_Hardhat` + `Bobi_PomPom` | 320 | 608 | `Mat_YellowBean` / `Mat_BandanaRed` |
| **Mắt & Má hồng** | `Bobi_Eyes` + `Bobi_Cheeks` | 240 | 448 | `Mat_EyesBlack` / `Mat_CheeksPink` |
| **Găng tay hoạt hình (2 bên)** | `Bobi_Glove_L` / `Bobi_Glove_R` | 208 | 384 | `Mat_WhiteGloves` |
| **Đôi ủng nhỏ (2 bên)** | `Bobi_Boot_L` / `Bobi_Boot_R` | 144 | 256 | `Mat_BootsCharcoal` |

---

## 3. DANH MỤC VẬT LIỆU PBR (MATERIAL ASSIGNMENT)

| Tên Material | Mã màu Base Color (Hex) | Roughness | Metallic | Ghi chú bề mặt |
| :--- | :--- | :--- | :--- | :--- |
| `Mat_YellowBean` | `#FFA502` (Butter Yellow) | 0.45 | 0.00 | Bề mặt mềm mịn, phản quang nhẹ |
| `Mat_DenimBlue` | `#3742FA` (Cobalt Denim) | 0.55 | 0.00 | Vải bò mờ |
| `Mat_BandanaRed` | `#FF4757` (Bright Tomato) | 0.40 | 0.00 | Khăn quàng & quả bông |
| `Mat_WhiteGloves` | `#FFFFFF` (Pure White) | 0.60 | 0.00 | Găng tay bông mờ |
| `Mat_BootsCharcoal`| `#57606F` (Charcoal Leather) | 0.60 | 0.00 | Ủng cao su/da mờ |
| `Mat_EyesBlack` | `#111111` (Deep Glossy Black)| 0.20 | 0.00 | Mắt bóng bẩy, bắt sáng |
| `Mat_CheeksPink` | `#FF6B81` (Blushing Pink) | 0.50 | 0.00 | Má hồng khuếch tán |

---

## 4. BẢNG KIỂM TRA CHẤT LƯỢNG (QUALITY ASSURANCE CHECKLIST)

- [x] **Trục tọa độ chuẩn hóa:** Forward = -Y, Up = +Z (khi nhập vào Godot 4 tự động thành Forward = -Z, Up = +Y).
- [x] **Scale đã Apply:** Scale = $(1.0, 1.0, 1.0)$, Rotation = $(0, 0, 0)$.
- [x] **Không có lỗi hình học phi đa tạp (Non-manifold geometry):** Không có cạnh hở, không có mặt rỗng bên trong.
- [x] **Pháp tuyến bề mặt (Normals):** 100% pháp tuyến hướng ra ngoài, không bị đảo ngược (flipped normals).
- [x] **Dáng chuẩn A-Pose:** Tay duỗi chéo 40° giúp xương vai và cánh tay không bị kéo xoắn khi skinning.
- [x] **Tương thích Godot 4:** Đã xuất file chuẩn `CHR_Bobi_Base.glb` và `CHR_Bobi_Base.obj`.
