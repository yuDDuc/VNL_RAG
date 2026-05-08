# Hướng dẫn triển khai trên VPS Ubuntu

Tài liệu này hướng dẫn cách cài đặt và chạy ứng dụng Legal Graph trên máy chủ Ubuntu (VPS).

## 1. Yêu cầu hệ thống
- Ubuntu 20.04 hoặc 22.04 LTS
- Quyền root hoặc sudo
- RAM tối thiểu 1GB (Khuyên dùng 2GB)

---

## 2. Chuẩn bị môi trường

Cập nhật hệ thống:
```bash
sudo apt update && sudo apt upgrade -y
```

Cài đặt Node.js (v24+) và npm thông qua NVM:
```bash
# Tải và cài đặt nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash

# Kích hoạt nvm ngay lập tức
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Cài đặt Node.js bản 24
nvm install 24

# Kiểm tra phiên bản
node -v
npm -v
```

Cài đặt Python và Pip:
```bash
sudo apt install -y python3 python3-pip python3-venv
```

Cài đặt PM2 (Để quản lý quy trình chạy nền):
```bash
sudo npm install -g pm2
```

---

## 3. Tải mã nguồn

```bash
git clone https://github.com/yuDDuc/VNL_RAG.git legal-graph
cd legal-graph
```

---

## 4. Cài đặt Backend (FastAPI)

```bash
cd BE
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
```

Tạo file chạy backend bằng PM2 (Lưu ý: Gọi trực tiếp python trong venv để tránh lỗi khi VPS khởi động lại):
```bash
pm2 start venv/bin/python --name legal-graph-be -- main.py
```
*Mặc định backend sẽ chạy trên cổng 8000.*

---

## 5. Cài đặt Frontend (Next.js)

Quay lại thư mục chính:
```bash
cd ../FE
```

Cấu hình API URL (Tạo file `.env.local` nếu chưa có):
```bash
echo "NEXT_PUBLIC_API_URL=http://<IP_CUA_VPS>:8000/api" > .env.local
```

Cài đặt và Build:
```bash
npm install
npm run build
```

Chạy frontend bằng PM2 (Chuẩn cách chạy npm qua PM2):
```bash
pm2 start npm --name "legal-graph-fe" -- start
```
*Mặc định frontend sẽ chạy trên cổng 3000.*

---

## 6. Cấu hình Cổng (Firewall)

Mở các cổng cần thiết để truy cập từ trình duyệt:
```bash
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 8000/tcp  # Backend
sudo ufw allow 22/tcp    # SSH
sudo ufw enable
```

---

## 7. Quản lý trạng thái

Xem các ứng dụng đang chạy:
```bash
pm2 list
```

Xem log (Nếu có lỗi):
```bash
pm2 logs legal-graph-be
pm2 logs legal-graph-fe
```

Tự động chạy lại khi VPS khởi động:
```bash
pm2 save
pm2 startup
```

---

## 8. Truy cập
- Giao diện người dùng: `http://<IP_CUA_VPS>:3000`
- API Documentation: `http://<IP_CUA_VPS>:8000/docs`

---

## Lưu ý cho Production
Để bảo mật và hiệu năng tốt hơn, bạn nên cài đặt **Nginx** làm Reverse Proxy thay vì truy cập trực tiếp qua cổng 3000/8000.

Ví dụ cấu hình Nginx đơn giản:
```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }
}
```
