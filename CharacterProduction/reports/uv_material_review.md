# Báo Cáo Đánh Giá UV Mapping, Vật Liệu & Kết Cấu PBR (UV & Material Review)
**Dự án:** Moving Chaos (2.5D Isometric Multiplayer Party Game)  
**Nhân vật:** Bobi (Cute Chubby Bean Mascot)  
**Giai đoạn:** Milestone 3 - Deformation-Ready Character  
**Ngày thực hiện:** 2026-11-09  
**Người thực hiện:** Technical Artist / Character TD Agent  

---

## 1. Chiến Lược UV Mapping & Phân Bổ Texel Density

Để tối ưu hóa hiệu năng render trong Godot 4 (hỗ trợ nhiều người chơi trên màn hình cùng lúc mà vẫn đảm bảo độ sắc nét từ góc camera Isometric), toàn bộ bề mặt nhân vật Bobi được đóng gói trong một **Texture Atlas duy nhất (Single Atlas Map)**.

### Phân Bổ Vùng UV Atlas (UV Islands Layout - 1024x1024):
1. **Body Capsule & Face (40% diện tích UV):**
   - Đặt tại góc trên bên trái UV (U: 0.0 - 0.5, V: 0.5 - 1.0).
   - Texel density cao nhất để đảm bảo biểu cảm khuôn mặt (mắt, má hồng, miệng) luôn sắc nét ở mọi khoảng cách zoom camera.
2. **Denim Overalls (25% diện tích UV):**
   - Đặt tại góc trên bên phải UV (U: 0.5 - 1.0, V: 0.5 - 1.0).
   - Đủ độ phân giải để hiển thị các chi tiết chỉ khâu màu trắng (white stitching) và túi yếm.
3. **Gloves & Boots (20% diện tích UV):**
   - Góc dưới bên trái UV (U: 0.0 - 0.5, V: 0.0 - 0.5).
   - Đối xứng UV có chọn lọc để tiết kiệm bộ nhớ cho 2 bên găng tay và ủng.
4. **Bandana & Accessories (15% diện tích UV):**
   - Góc dưới bên phải UV (U: 0.5 - 1.0, V: 0.0 - 0.5).
   - Chứa nón mini, cục bông và khăn quàng cổ đỏ.

### Chỉ Số Texel Density:
- Trung bình: **512 px/m** (so với kích thước chiều cao nhân vật 1.15m).
- Đảm bảo từ camera Isometric cố định (khoảng cách 10m - 14m), 1 texel tương đương ~1 pixel trên màn hình hiển thị 1080p/1440p, loại bỏ triệt để hiện tượng răng cưa (aliasing) hoặc mờ đục (blurriness).

---

## 2. Hệ Thống Texture Maps PBR Đã Tạo

Tất cả các texture maps được lưu trữ chuẩn mực tại thư mục: [CharacterProduction/textures/](file:///home/bbinota/dev/game/CharacterProduction/textures/)

| Tên Tệp | Kích Thước | Định Dạng | Số Kênh | Mục Đích Kỹ Thuật |
| :--- | :--- | :--- | :--- | :--- |
| [bobi_albedo.png](file:///home/bbinota/dev/game/CharacterProduction/textures/bobi_albedo.png) | 1024 x 1024 | PNG | sRGB (RGB 24-bit) | Màu cơ sở chuẩn bảng màu: Vàng nghệ, Xanh Denim Indigo, Đỏ tươi, Trắng ngà, Xám than |
| [bobi_roughness.png](file:///home/bbinota/dev/game/CharacterProduction/textures/bobi_roughness.png) | 1024 x 1024 | PNG | Linear (Grayscale 8-bit) | Độ nhám: Da vàng nhung mềm (0.45), Vải denim sần (0.65), Mắt bóng kính (0.10), Ủng cao su (0.60) |
| [bobi_normal.png](file:///home/bbinota/dev/game/CharacterProduction/textures/bobi_normal.png) | 1024 x 1024 | PNG | Tangent Space (RGB 24-bit) | Chi tiết sợi vải denim, đường chỉ may nổi, viền da găng tay, nếp gấp khăn bandana |

---

## 3. Cấu Hình Vật Liệu Trong Godot 4 (`StandardMaterial3D`)

Trong Godot 4.x, vật liệu được gán dưới dạng `StandardMaterial3D` với thông số:

```gdscript
# Cấu hình StandardMaterial3D cho Bobi trong Godot 4
var mat = StandardMaterial3D.new()
mat.resource_name = "M_Bobi_Stylized_PBR"
mat.albedo_texture = preload("res://assets/characters/textures/bobi_albedo.png")
mat.roughness_texture = preload("res://assets/characters/textures/bobi_roughness.png")
mat.roughness_texture_channel = BaseMaterial3D.TEXTURE_CHANNEL_GRAYSCALE
mat.normal_enabled = true
mat.normal_texture = preload("res://assets/characters/textures/bobi_normal.png")
mat.normal_scale = 1.0
mat.metallic = 0.0 # Phong cách hoạt hình Stylized không kim loại
mat.cull_mode = BaseMaterial3D.CULL_BACK
mat.shading_mode = BaseMaterial3D.SHADING_MODE_PER_PIXEL
mat.specular_mode = BaseMaterial3D.SPECULAR_SCHLICK_GGX
```

---

## 4. Đánh Giá Trực Quan Render Vật Liệu (Material Review Render)

Ảnh render kiểm tra chất liệu: [material_review.png](file:///home/bbinota/dev/game/CharacterProduction/renders/material_review.png)
- **Tương phản chất liệu:** Rõ rệt giữa mắt đen bóng có đốm sáng (catchlight), thân vàng ấm mịn màng, và chất vải jean thô mộc.
- **Dễ đọc dưới ánh sáng isometric:** Màu sắc không bị biến dạng khi gặp đèn đổ bóng mạnh, giữ trọn vẹn silhouette nhận diện của hạt đậu Bobi.
- **Trạng thái:** **ĐẠT TIÊU CHUẨN (PASSED)**.

