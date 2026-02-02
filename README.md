# Lô Tô Year End Party 2026 🎊

Website trò chơi Lô Tô cho Year End Party - Tết Nguyên Đán 2026 Bính Ngọ

## Tính năng

- **Bảng số đã quay**: Hiển thị các số đã được quay ở phía trên
- **60 viên bi lô tô**: Bấm vào số để chọn, số sẽ bay lên bảng trúng
- **Nút Reset**: Xóa tất cả và bắt đầu lại
- **Giao diện Tết cổ xưa**: Thiết kế theo phong cách "Đêm Hội Phố Cổ" Hội An

## Hướng dẫn sử dụng

1. MC quay số lô tô
2. Người kỹ thuật bấm vào số tương ứng trên website
3. Số sẽ tự động bay lên bảng "Số đã quay"
4. Khán giả có thể theo dõi dễ dàng trên màn hình lớn
5. Bấm nút "Reset" để bắt đầu lại trò chơi mới

## Deploy lên GitHub Pages

### Cách 1: Sử dụng thư mục `docs` (Đã build sẵn)

1. Push code lên GitHub repository
2. Vào **Settings** → **Pages**
3. Chọn **Source**: Deploy from a branch
4. Chọn **Branch**: `main` (hoặc `master`)
5. Chọn **Folder**: `/docs`
6. Bấm **Save**
7. Đợi vài phút, website sẽ có tại: `https://<username>.github.io/<repo-name>/`

### Cách 2: Build lại từ source

```bash
# Cài dependencies
pnpm install

# Build cho GitHub Pages
pnpm exec vite build --config vite.config.github.ts

# Thư mục docs/ sẽ chứa file build
```

## Công nghệ sử dụng

- React 19
- Tailwind CSS 4
- Framer Motion (animations)
- shadcn/ui components
- Vite

## Thiết kế

Phong cách **"Đêm Hội Phố Cổ"** - Vintage Hội An Aesthetic:
- Màu chủ đạo: Amber Gold (#D4A574), Deep Crimson (#8B0000)
- Font: Playfair Display (tiêu đề), Crimson Text (nội dung)
- Hiệu ứng: Đèn lồng lắc nhẹ, bi số phát sáng khi hover

## Thương hiệu

- Hội An Hoa - Buffet BBQ Hotpot
- Organic Hải Sản Vĩ Diệu

---

**Year End Party 2026 - Tết Nguyên Đán Bính Ngọ** 🧧
