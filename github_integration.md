# Hướng dẫn tích hợp trang web Bạch Khôi Mao Gia vào GitHub

## 1. Chuẩn bị

### Yêu cầu
- Tài khoản GitHub
- Git được cài đặt trên máy tính của bạn
- Kiến thức cơ bản về Git và GitHub

### Cấu trúc thư mục hiện tại
```
bachkhoimaogia/
├── index.html
├── style.css
├── script.js
├── images/
│   ├── logo.png
│   └── [các hình ảnh khác]
```

## 2. Tạo repository trên GitHub

1. Đăng nhập vào tài khoản GitHub của bạn
2. Nhấp vào nút "+" ở góc trên bên phải và chọn "New repository"
3. Đặt tên repository là "bachkhoimaogia"
4. Thêm mô tả (tùy chọn): "Trang web Bạch Khôi Mao Gia - Truyện tiểu thuyết, ngôn tình"
5. Chọn "Public" hoặc "Private" tùy theo nhu cầu của bạn
6. Không cần khởi tạo repository với README, .gitignore, hoặc license
7. Nhấp vào "Create repository"

## 3. Đẩy code lên GitHub

Mở terminal hoặc command prompt và thực hiện các lệnh sau:

```bash
# Di chuyển đến thư mục dự án
cd đường_dẫn_đến_thư_mục/bachkhoimaogia

# Khởi tạo Git repository
git init

# Thêm tất cả các file vào staging area
git add .

# Commit các thay đổi
git commit -m "Initial commit - Bạch Khôi Mao Gia website"

# Thêm remote repository
git remote add origin https://github.com/username/bachkhoimaogia.git

# Đẩy code lên GitHub
git push -u origin master
```

Lưu ý: Thay `username` bằng tên người dùng GitHub của bạn.

## 4. Triển khai trang web với GitHub Pages

1. Trên GitHub, điều hướng đến repository của bạn
2. Nhấp vào tab "Settings"
3. Cuộn xuống đến phần "GitHub Pages"
4. Trong phần "Source", chọn nhánh "master" và thư mục "/ (root)"
5. Nhấp vào "Save"
6. Sau khi trang được tải lại, cuộn xuống lại phần "GitHub Pages" để xem URL của trang web đã được triển khai

## 5. Thêm các hình ảnh và tính năng bổ sung

### Thêm favicon
1. Tạo favicon (có thể sử dụng công cụ trực tuyến như favicon.io)
2. Thêm file favicon.ico vào thư mục gốc của dự án
3. Thêm dòng sau vào phần `<head>` của file index.html:
   ```html
   <link rel="icon" href="favicon.ico" type="image/x-icon">
   ```

### Thêm hình ảnh cho các truyện
1. Chuẩn bị hình ảnh poster/thumbnail cho các truyện
2. Đặt các hình ảnh vào thư mục `images/`
3. Cập nhật đường dẫn trong file HTML để trỏ đến các hình ảnh mới

### Thêm hình nền (background)
1. Chuẩn bị hình nền phù hợp
2. Đặt hình nền vào thư mục `images/`
3. Thêm CSS sau vào file style.css:
   ```css
   body {
       background-image: url('images/background.jpg');
       background-repeat: repeat;
       background-attachment: fixed;
       /* Hoặc sử dụng background-size: cover; nếu muốn hình nền phủ toàn bộ */
   }
   ```

## 6. Triển khai các tính năng nâng cao

Dựa trên yêu cầu bổ sung, bạn có thể triển khai các tính năng sau:

### Hệ thống quản trị nội dung với Netlify CMS
1. Tạo file `admin/config.yml` với nội dung cấu hình Netlify CMS
2. Tạo file `admin/index.html` để truy cập giao diện quản trị
3. Cấu hình xác thực qua GitHub OAuth

### Hệ thống đăng tải nội dung
1. Thiết lập cấu trúc dữ liệu cho truyện và chương truyện trong Netlify CMS
2. Tạo template hiển thị cho trang truyện và trang đọc chương

### Tài khoản người dùng
1. Tích hợp dịch vụ xác thực như Firebase Authentication hoặc Auth0
2. Tạo giao diện đăng ký/đăng nhập
3. Thiết lập cơ sở dữ liệu để lưu trữ thông tin người dùng

### Tính năng bổ sung
1. Tích hợp hệ thống bình luận (có thể sử dụng Disqus hoặc tự xây dựng)
2. Thiết lập hệ thống donate (có thể sử dụng PayPal, Ko-fi, hoặc các dịch vụ khác)
3. Tạo chức năng lưu truyện yêu thích và theo dõi truyện
4. Tích hợp Google Analytics để theo dõi lượt truy cập
5. Tối ưu hóa SEO
6. Thêm chức năng chia sẻ lên mạng xã hội
7. Phát triển chế độ đọc ban đêm

## 7. Lưu ý quan trọng

- Đảm bảo cập nhật thường xuyên repository GitHub của bạn khi có thay đổi
- Sao lưu dữ liệu thường xuyên
- Kiểm tra tính tương thích trên các trình duyệt và thiết bị khác nhau
- Tuân thủ các quy định về bản quyền khi sử dụng hình ảnh và nội dung

## 8. Tài nguyên hữu ích

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Netlify CMS Documentation](https://www.netlifycms.org/docs/intro/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Analytics](https://analytics.google.com/)
