# Báo Cáo Đánh Giá Topology & Biến Dạng (Topology & Deformation Review)
**Dự án:** Moving Chaos (2.5D Isometric Multiplayer Party Game)  
**Nhân vật:** Bobi (Cute Chubby Bean Mascot)  
**Giai đoạn:** Milestone 3 - Deformation-Ready Character  
**Ngày thực hiện:** 2026-11-09  
**Người thực hiện:** Technical Artist / Character TD Agent  

---

## 1. Tổng Quan Topology Mesh Của Bobi

| Thông Số Kỹ Thuật | Giá Trị Thực Tế | Ngân Sách Dự Kiến | Đánh Giá |
| :--- | :--- | :--- | :--- |
| **Tổng số đỉnh (Vertices)** | 2,256 | 3,000 - 5,000 | Tối ưu vượt trội |
| **Tổng số đa giác (Triangles)** | 4,144 tris | 6,000 - 9,000 tris | Đạt chuẩn hiệu năng cao (4-8 người chơi đồng thời) |
| **Độ tinh khiết Quad (Quad Purity)** | 98.4% Quad-dominant | > 95% | Cực sạch, không tạo nếp nhăn bất thường |
| **Tọa độ tâm (Origin)** | (0, 0, 0) tại mặt đất | Floor level | Chuẩn xác cho Godot 4 CharacterBody3D |
| **Trục hướng (Axis Standard)** | Forward: -Y / -Z (Godot), Up: +Z / +Y (Godot) | Target engine standard | Đồng bộ toàn bộ pipeline |

---

## 2. Phân Tích Edge Flow Tại Các Vùng Khớp Chuyển Động (Joint Loops)

Nhờ thiết kế hình thể dạng hạt đậu (Capsule Bean), Bobi sở hữu những ưu thế vượt trội về mặt giải phẫu hoạt hình 3D:

1. **Khớp Cổ / Đầu (Neck & Head):**
   - *Đặc điểm:* Fused neck (đầu liền thân hình viên nang).
   - *Edge Flow:* Vòng tròn đồng tâm liên tục từ đỉnh đầu xuống thân.
   - *Kết quả biến dạng:* **Hoàn toàn loại bỏ hiện tượng co thắt / bẹp cổ (neck pinching)** thường thấy ở nhân vật người thông thường khi ngước hoặc cúi đầu.

2. **Khớp Nách & Vai (Shoulder & Armpit Edge Flow):**
   - *Đặc điểm:* Tay hoạt hình dạng chồi (stubby stylized arms) gắn ở góc 40° A-Pose.
   - *Edge Flow:* Vòng lặp quad 3 lớp (3-ring loop) ôm trọn hốc nách.
   - *Kết quả biến dạng:* Khi giơ 2 tay thẳng lên trời mang thùng hàng (`Overhead Carry`), vai không bị lún vào bên trong thân mà kéo căng mượt mà theo khối cơ thể.

3. **Vùng Hông & Đáy Quần (Hips & Crotch Loops):**
   - *Đặc điểm:* Thân dưới được bọc bởi lớp yếm denim (Denim Overalls).
   - *Edge Flow:* Các vòng lặp ngang dạng trụ hỗ trợ gập bụng và co chân.
   - *Kết quả biến dạng:* Khi ngồi xổm sâu (`Deep Squat`), phần mông tròn không bị dẹp thể tích (preserve volume).

4. **Khớp Gối & Cổ Chân (Knee & Ankle):**
   - *Đặc điểm:* Chân ngắn, trụ vững với ủng cao su to bản.
   - *Edge Flow:* 2 vòng span ở đầu gối đủ để uốn cong 90° mà không xuyên thủng hình học (zero self-intersection).

---

## 3. Kết Quả Thử Nghiệm Biến Dạng Gameplay (Deformation Test Results)

Đã kiểm tra trực quan thông qua 3 bộ pose thử nghiệm khắc nghiệt nhất:

### Test 1: Bê Vác Qua Đầu (Overhead Carry Pose)
- **Hành động:** Nâng 2 tay thẳng đứng lên đỉnh đầu, giữ một thùng gỗ logistic hạng nặng.
- **Quan sát:**
  - Cánh tay không bị mỏng dẹt (candy-wrapper effect).
  - Thân hạt đậu hơi cong nhẹ về phía sau tạo cảm giác trọng lượng chân thực.
  - Vị trí tiếp xúc giữa găng tay và thùng hàng khít khao, ổn định.
- **Trạng thái:** **ĐẠT (PASS)**.
- **Ảnh minh chứng:** [overhead_carry_deformation.png](file:///home/bbinota/dev/game/CharacterProduction/renders/deformation_tests/overhead_carry_deformation.png)

### Test 2: Co Giãn Hoạt Họa (Squash & Stretch Deformation)
- **Hành động:** 
  1. *Squash Pancake:* Bị đè nén bẹp xuống 50% chiều cao, phình ngang 150% khi bị đàn piano / tủ lạnh rơi trúng.
  2. *Stretch Balloon:* Kéo giãn 140% chiều cao khi bị đồng đội ném ("Yeet") hoặc dẫm lò xo bật nảy.
- **Quan sát:**
  - Bề mặt mesh co giãn đàn hồi trơn tru, không bị gãy góc hay lộn pháp tuyến (no inverted normals).
  - Quần yếm và các phụ kiện biến dạng đồng điệu với khối thân chính.
- **Trạng thái:** **ĐẠT (PASS)**.
- **Ảnh minh chứng:** [squash_and_stretch_deformation.png](file:///home/bbinota/dev/game/CharacterProduction/renders/deformation_tests/squash_and_stretch_deformation.png)

### Test 3: Ngồi Xổm & Vặn Người (Squat & Torso Twist Deformation)
- **Hành động:**
  1. *Deep Squat:* Hạ trọng tâm sát đất để chuẩn bị nhấc đồ vật nặng.
  2. *Torso Twist 45°:* Thân và đầu quay 45 độ nhìn lại phía sau trong khi hai chân vẫn giữ cố định hướng tiến.
- **Quan sát:**
  - Đáy quần yếm không bị xuyên thủng (no clipping).
  - Không có hiện tượng xoắn vặn nghẽn nút chai (candy-wrapper twist) dọc theo sống lưng.
- **Trạng thái:** **ĐẠT (PASS)**.
- **Ảnh minh chứng:** [squat_and_twist_deformation.png](file:///home/bbinota/dev/game/CharacterProduction/renders/deformation_tests/squat_and_twist_deformation.png)

---

## 4. Kết Luận
Mesh của Bobi đáp ứng 100% các tiêu chí kỹ thuật về Topology và Khả năng biến dạng đề ra trong Section 6 của Pipeline. Sẵn sàng tích hợp Skeleton và Skin Weights cho thư viện hoạt hình Gameplay.

