# Tài liệu Kiến trúc Hệ thống Legal Graph

Dựa trên yêu cầu xây dựng Web App hỗ trợ tạo "graph luật" (hệ thống hóa và tra cứu văn bản pháp luật), dưới đây là tài liệu mô tả chi tiết:

## 1. Mô tả ý tưởng sản phẩm
Legal Graph là một công cụ trực quan hóa (Visual Tool) cho phép chuyên gia pháp lý hoặc người dùng phổ thông hệ thống hóa các văn bản luật, điều khoản, nghị định thành một mạng lưới (graph) dễ nhìn và dễ hiểu. 
Thay vì phải đọc một danh sách dài các văn bản khô khan, người dùng có thể nhìn thấy sự liên kết giữa luật này sửa đổi luật nào, nghị định này hướng dẫn điều khoản nào.

## 2. Kiến trúc hệ thống đề xuất (tham khảo legalgraph_architecture)
Kiến trúc hệ thống hướng đến **Client-Server (Monolithic linh hoạt)** ở giai đoạn đầu để dễ quản lý, nhưng Frontend và Backend được tách biệt hoàn toàn qua API (REST + WebSocket):
- **Frontend (Client)**: Quản lý Canvas, UI, State của Graph (nodes, edges), thao tác kéo thả và undo/redo.
- **Backend (Server)**: Quản lý API CRUD, Business Logic (tìm kiếm, export/import), và Authentication.
- **Database**: 
  - **Relational DB** (PostgreSQL): Để lưu trữ cấu trúc graph (Node table, Edge table), Metadata, User.
  - Hoặc **Graph DB** (Neo4j - *Option*): Phù hợp nếu số lượng node quá lớn và cần query sâu (tìm mối liên hệ bậc n). Ở quy mô MVP, PostgreSQL là đủ.

## 3. Danh sách tính năng MVP
- **Canvas Editor**: Tạo Node (chuột phải), di chuyển, đổi tên, sửa nội dung.
- **Edge Connector**: Kéo thả để nối 2 node. Hỗ trợ chọn label (viện dẫn, sửa đổi, thay thế, căn cứ vào, hướng dẫn, liên quan đến).
- **Graph Control**: Zoom in/out, pan, center view.
- **Node Management**: Xóa node (tự động xóa dây nối liên quan).
- **History Management**: Undo / Redo cho mọi thao tác.
- **Search & Highlight**: Tìm kiếm tên node và highlight nó trên canvas.
- **Persistence & Export**: Lưu graph vào backend, tải lại. Xuất JSON, PNG.

## 4. Data model cho node/edge/graph
**Graph Table/Model:**
- `id` (UUID)
- `name` (String)
- `description` (Text)
- `created_at` / `updated_at` (Timestamp)

**Node Table/Model:**
- `id` (UUID)
- `graph_id` (UUID - Foreign Key)
- `type` (String) - VD: 'law', 'decree', 'circular', 'article'
- `label` (String) - Tên hiển thị
- `content` (Text) - Nội dung chi tiết
- `x`, `y` (Float) - Tọa độ trên Canvas
- `created_at` / `updated_at`

**Edge (Connection) Table/Model:**
- `id` (UUID)
- `graph_id` (UUID - Foreign Key)
- `source_node_id` (UUID - Foreign Key)
- `target_node_id` (UUID - Foreign Key)
- `relation_type` (String) - Enum: `reference`, `amend`, `replace`, `base_on`, `guide`, `related`
- `created_at` / `updated_at`

## 5. Flow người dùng
1. **Khởi tạo**: Người dùng vào app -> Bấm "Tạo Graph mới" -> Nhập tên.
2. **Thêm văn bản gốc**: Chuột phải vào vùng trống -> Chọn "Tạo Node" -> Nhập "Luật X" -> Node xuất hiện.
3. **Thêm văn bản liên quan**: Chuột phải -> Tạo "Nghị định Y".
4. **Tạo liên kết**: Kéo chuột từ "Nghị định Y" sang "Luật X" -> Chọn quan hệ "Hướng dẫn" trên popup hiện ra.
5. **Tra cứu/Sửa**: Click đúp vào Node/Edge để sửa.
6. **Lưu trữ/Xuất**: Bấm nút "Save" để lưu lên server, hoặc "Export" để tải về file PNG/JSON.

## 6. Gợi ý tech stack
- **Frontend**: React.js hoặc Next.js, Typescript.
- **Rendering Engine (Graph)**: **React Flow** (Rất mạnh cho thao tác kéo thả, zoom pan, custom node/edge, undo/redo).
- **State Management**: Zustand (Gọn nhẹ, kết hợp cực tốt với React Flow).
- **UI Component**: TailwindCSS + Shadcn/UI (Cho form, panel, toolbar).
- **Backend**: FastAPI (Python) - hiệu năng tốt, dễ kết hợp với AI/RAG sau này (vì đây nằm trong thư mục RAG).
- **Database**: PostgreSQL (qua SQLAlchemy).

## 7. Gợi ý cách triển khai UI/UX
- **Bố cục chính (Layout)**:
  - Header: Tên graph, nút Save, Export, Undo/Redo.
  - Left Sidebar: Tool/Library (có thể kéo thả node loại "Luật", "Khoản" vào canvas).
  - Main Area: 100% Canvas Editor.
  - Right Panel (Offcanvas/Drawer): Khi click vào node hoặc edge, mở panel bên phải để sửa chi tiết nội dung (title, text, metadata) nhằm giữ canvas gọn gàng.
- **Tương tác**: Cung cấp phím tắt (Ctrl+Z để undo, Del để xóa node). Dùng context menu khi right-click.

## 8. Skeleton code và Cấu trúc thư mục (Đã có một phần ở util_)
Đã phản ánh qua các folder `FE` và `BE`. Các bước tiếp theo sẽ fill skeleton code trực tiếp vào code base.
