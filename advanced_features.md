# Hướng dẫn triển khai tính năng nâng cao cho trang web Bạch Khôi Mao Gia

Dựa trên yêu cầu bổ sung, dưới đây là hướng dẫn chi tiết để triển khai các tính năng nâng cao cho trang web Bạch Khôi Mao Gia.

## 1. Hệ thống quản trị nội dung với Netlify CMS

### Cài đặt Netlify CMS

1. Tạo thư mục `admin` trong thư mục gốc của dự án
2. Tạo file `admin/index.html` với nội dung sau:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quản trị nội dung - Bạch Khôi Mao Gia</title>
  <!-- Thêm CSS của Netlify CMS -->
  <link href="https://unpkg.com/netlify-cms@^2.0.0/dist/cms.css" rel="stylesheet" />
</head>
<body>
  <!-- Thêm script của Netlify CMS -->
  <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
</body>
</html>
```

3. Tạo file `admin/config.yml` với nội dung sau:

```yaml
backend:
  name: github
  repo: username/bachkhoimaogia # Thay username bằng tên người dùng GitHub của bạn
  branch: master # Branch để xuất bản

media_folder: "images/uploads" # Thư mục lưu trữ hình ảnh tải lên
public_folder: "/images/uploads" # Đường dẫn công khai đến hình ảnh

# Phân quyền người dùng
publish_mode: editorial_workflow

collections:
  - name: "stories" # Bộ sưu tập truyện
    label: "Truyện"
    folder: "_stories"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Tiêu đề", name: "title", widget: "string"}
      - {label: "Tác giả", name: "author", widget: "string"}
      - {label: "Hình ảnh", name: "thumbnail", widget: "image"}
      - {label: "Mô tả ngắn", name: "description", widget: "text"}
      - {label: "Thể loại", name: "categories", widget: "list"}
      - {label: "Trạng thái", name: "status", widget: "select", options: ["Đang cập nhật", "Hoàn thành"]}
      - {label: "Nổi bật", name: "featured", widget: "boolean", default: false}
      - {label: "Ngày đăng", name: "date", widget: "datetime"}
      - {label: "Nội dung giới thiệu", name: "body", widget: "markdown"}
      
  - name: "chapters" # Bộ sưu tập chương truyện
    label: "Chương truyện"
    folder: "_chapters"
    create: true
    slug: "{{story}}-{{chapter_number}}"
    fields:
      - {label: "Tiêu đề chương", name: "title", widget: "string"}
      - {label: "Truyện", name: "story", widget: "relation", collection: "stories", search_fields: ["title"], value_field: "{{slug}}", display_fields: ["title"]}
      - {label: "Số chương", name: "chapter_number", widget: "number"}
      - {label: "Nội dung", name: "body", widget: "markdown"}
      - {label: "Ngày đăng", name: "date", widget: "datetime"}
```

### Cấu hình xác thực GitHub OAuth

1. Đăng ký ứng dụng OAuth trên GitHub:
   - Truy cập https://github.com/settings/applications/new
   - Điền thông tin ứng dụng
   - Đặt Authorization callback URL là: https://api.netlify.com/auth/done

2. Lưu Client ID và Client Secret

3. Cấu hình Netlify:
   - Đăng ký tài khoản Netlify
   - Kết nối repository GitHub của bạn
   - Trong phần Settings > Access control > OAuth, thêm GitHub provider với Client ID và Client Secret đã lưu

## 2. Hệ thống đăng tải nội dung

### Tạo template hiển thị cho trang truyện

Tạo file `story.html` trong thư mục gốc:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{story.title}} - Bạch Khôi Mao Gia</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Header (giống index.html) -->
    
    <!-- Main Content -->
    <main>
        <div class="container">
            <div class="story-detail">
                <div class="story-header">
                    <div class="story-thumbnail">
                        <img src="{{story.thumbnail}}" alt="{{story.title}}">
                    </div>
                    <div class="story-info">
                        <h1>{{story.title}}</h1>
                        <div class="story-meta">
                            <span class="author"><i class="fas fa-user"></i> {{story.author}}</span>
                            <span class="status {{story.status}}"><i class="fas fa-bookmark"></i> {{story.status}}</span>
                            <span class="views"><i class="fas fa-eye"></i> {{story.views}}</span>
                        </div>
                        <div class="story-categories">
                            {{#each story.categories}}
                            <a href="#" class="category">{{this}}</a>
                            {{/each}}
                        </div>
                        <div class="story-description">
                            <p>{{story.description}}</p>
                        </div>
                        <div class="story-actions">
                            <button class="read-btn">Đọc từ đầu</button>
                            <button class="follow-btn"><i class="fas fa-heart"></i> Theo dõi</button>
                            <button class="share-btn"><i class="fas fa-share-alt"></i> Chia sẻ</button>
                        </div>
                    </div>
                </div>
                
                <div class="story-content">
                    <h2>Giới thiệu truyện</h2>
                    <div class="story-introduction">
                        {{story.body}}
                    </div>
                </div>
                
                <div class="chapter-list">
                    <h2>Danh sách chương</h2>
                    <ul>
                        {{#each chapters}}
                        <li>
                            <a href="chapter.html?story={{../story.slug}}&chapter={{chapter_number}}">
                                <span class="chapter-number">Chương {{chapter_number}}:</span>
                                <span class="chapter-title">{{title}}</span>
                                <span class="chapter-date">{{date}}</span>
                            </a>
                        </li>
                        {{/each}}
                    </ul>
                </div>
                
                <div class="story-comments">
                    <h2>Bình luận</h2>
                    <!-- Hệ thống bình luận sẽ được tích hợp ở đây -->
                </div>
            </div>
        </div>
    </main>
    
    <!-- Footer (giống index.html) -->
    
    <script src="script.js"></script>
</body>
</html>
```

### Tạo template hiển thị cho trang đọc chương

Tạo file `chapter.html` trong thư mục gốc:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{chapter.title}} - {{story.title}} - Bạch Khôi Mao Gia</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Header (giống index.html) -->
    
    <!-- Main Content -->
    <main>
        <div class="container">
            <div class="chapter-detail">
                <div class="chapter-header">
                    <h1>{{story.title}}</h1>
                    <h2>Chương {{chapter.chapter_number}}: {{chapter.title}}</h2>
                    <div class="chapter-meta">
                        <span class="author"><i class="fas fa-user"></i> {{story.author}}</span>
                        <span class="date"><i class="fas fa-calendar"></i> {{chapter.date}}</span>
                    </div>
                </div>
                
                <div class="chapter-navigation">
                    <a href="#" class="prev-chapter" {{#unless prev_chapter}}style="visibility: hidden;"{{/unless}}>
                        <i class="fas fa-chevron-left"></i> Chương trước
                    </a>
                    <a href="story.html?story={{story.slug}}" class="chapter-list">
                        <i class="fas fa-list"></i> Danh sách chương
                    </a>
                    <a href="#" class="next-chapter" {{#unless next_chapter}}style="visibility: hidden;"{{/unless}}>
                        Chương sau <i class="fas fa-chevron-right"></i>
                    </a>
                </div>
                
                <div class="chapter-content">
                    {{chapter.body}}
                </div>
                
                <div class="chapter-navigation">
                    <a href="#" class="prev-chapter" {{#unless prev_chapter}}style="visibility: hidden;"{{/unless}}>
                        <i class="fas fa-chevron-left"></i> Chương trước
                    </a>
                    <a href="story.html?story={{story.slug}}" class="chapter-list">
                        <i class="fas fa-list"></i> Danh sách chương
                    </a>
                    <a href="#" class="next-chapter" {{#unless next_chapter}}style="visibility: hidden;"{{/unless}}>
                        Chương sau <i class="fas fa-chevron-right"></i>
                    </a>
                </div>
                
                <div class="reading-settings">
                    <button class="font-size-btn"><i class="fas fa-font"></i></button>
                    <button class="night-mode-btn"><i class="fas fa-moon"></i></button>
                </div>
                
                <div class="chapter-comments">
                    <h2>Bình luận</h2>
                    <!-- Hệ thống bình luận sẽ được tích hợp ở đây -->
                </div>
            </div>
        </div>
    </main>
    
    <!-- Footer (giống index.html) -->
    
    <script src="script.js"></script>
</body>
</html>
```

## 3. Tài khoản người dùng với Firebase Authentication

### Cài đặt Firebase

1. Tạo tài khoản Firebase và tạo dự án mới
2. Thêm ứng dụng web vào dự án Firebase
3. Lấy thông tin cấu hình Firebase
4. Thêm Firebase SDK vào trang web:

```html
<!-- Thêm vào phần cuối của thẻ body trong index.html, story.html, và chapter.html -->
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"></script>
<script>
  // Cấu hình Firebase
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Khởi tạo Firebase
  firebase.initializeApp(firebaseConfig);
</script>
<script src="firebase-auth.js"></script>
```

### Tạo giao diện đăng ký/đăng nhập

Tạo file `login.html` trong thư mục gốc:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập - Bạch Khôi Mao Gia</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Header (giống index.html) -->
    
    <!-- Main Content -->
    <main>
        <div class="container">
            <div class="auth-container">
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Đăng nhập</button>
                    <button class="auth-tab" data-tab="register">Đăng ký</button>
                </div>
                
                <div class="auth-content">
                    <div class="auth-form login-form active">
                        <h2>Đăng nhập</h2>
                        <form id="login-form">
                            <div class="form-group">
                                <label for="login-email">Email</label>
                                <input type="email" id="login-email" required>
                            </div>
                            <div class="form-group">
                                <label for="login-password">Mật khẩu</label>
                                <input type="password" id="login-password" required>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="auth-btn">Đăng nhập</button>
                            </div>
                            <div class="form-group">
                                <a href="#" class="forgot-password">Quên mật khẩu?</a>
                            </div>
                        </form>
                        <div class="social-auth">
                            <p>Hoặc đăng nhập với</p>
                            <div class="social-buttons">
                                <button class="google-btn"><i class="fab fa-google"></i> Google</button>
                                <button class="facebook-btn"><i class="fab fa-facebook-f"></i> Facebook</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="auth-form register-form">
                        <h2>Đăng ký</h2>
                        <form id="register-form">
                            <div class="form-group">
                                <label for="register-name">Họ tên</label>
                                <input type="text" id="register-name" required>
                            </div>
                            <div class="form-group">
                                <label for="register-email">Email</label>
                                <input type="email" id="register-email" required>
                            </div>
                            <div class="form-group">
                                <label for="register-password">Mật khẩu</label>
                                <input type="password" id="register-password" required>
                            </div>
                            <div class="form-group">
                                <label for="register-confirm-password">Xác nhận mật khẩu</label>
                                <input type="password" id="register-confirm-password" required>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="auth-btn">Đăng ký</button>
                            </div>
                        </form>
                        <div class="social-auth">
                            <p>Hoặc đăng ký với</p>
                            <div class="social-buttons">
                                <button class="google-btn"><i class="fab fa-google"></i> Google</button>
                                <button class="facebook-btn"><i class="fab fa-facebook-f"></i> Facebook</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    
    <!-- Footer (giống index.html) -->
    
    <script src="script.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"></script>
    <script>
      // Cấu hình Firebase (giống như trên)
    </script>
    <script src="firebase-auth.js"></script>
</body>
</html>
```

### Tạo file JavaScript cho xác thực

Tạo file `firebase-auth.js` trong thư mục gốc:

```javascript
// Lấy các phần tử DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

// Chuyển đổi giữa các tab đăng nhập/đăng ký
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        
        // Xóa lớp active từ tất cả các tab và form
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        // Thêm lớp active cho tab và form được chọn
        tab.classList.add('active');
        document.querySelector(`.${tabName}-form`).classList.add('active');
    });
});

// Xử lý đăng nhập
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Đăng nhập thành công
                const user = userCredential.user;
                window.location.href = 'index.html';
            })
            .catch((error) => {
                // Xử lý lỗi
                alert(`Lỗi đăng nhập: ${error.message}`);
            });
    });
}

// Xử lý đăng ký
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Đăng ký thành công
                const user = userCredential.user;
                
                // Cập nhật tên hiển thị
                return user.updateProfile({
                    displayName: name
                }).then(() => {
                    window.location.href = 'index.html';
                });
            })
            .catch((error) => {
                // Xử lý lỗi
                alert(`Lỗi đăng ký: ${error.message}`);
            });
    });
}

// Xử lý đăng nhập bằng Google
const googleBtn = document.querySelector('.google-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                window.location.href = 'index.html';
            })
            .catch((error) => {
                alert(`Lỗi đăng nhập Google: ${error.message}`);
            });
    });
}

// Xử lý đăng nhập bằng Facebook
const facebookBtn = document.querySelector('.facebook-btn');
if (facebookBtn) {
    facebookBtn.addEventListener('click', () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                window.location.href = 'index.html';
            })
            .catch((error) => {
                alert(`Lỗi đăng nhập Facebook: ${error.message}`);
            });
    });
}

// Kiểm tra trạng thái đăng nhập
firebase.auth().onAuthStateChanged((user) => {
    const userActions = document.querySelector('.user-actions');
    
    if (user) {
        // Người dùng đã đăng nhập
        if (userActions) {
            userActions.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-btn">
                        <img src="${user.photoURL || 'images/avatar-default.png'}" alt="${user.displayName}">
                        <span>${user.displayName || 'Người dùng'}</span>
                    </button>
                    <div class="dropdown-content">
                        <a href="profile.html">Trang cá nhân</a>
                        <a href="favorites.html">Truyện yêu thích</a>
                        <a href="#" id="logout-btn">Đăng xuất</a>
                    </div>
                </div>
            `;
            
            // Xử lý đăng xuất
            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                firebase.auth().signOut()
                    .then(() => {
                        window.location.reload();
                    })
                    .catch((error) => {
                        alert(`Lỗi đăng xuất: ${error.message}`);
                    });
            });
        }
    } else {
        // Người dùng chưa đăng nhập
        if (userActions) {
            userActions.innerHTML = `
                <a href="login.html" class="login-btn">Đăng nhập</a>
                <a href="login.html#register" class="register-btn">Đăng ký</a>
            `;
        }
    }
});
```

## 4. Tích hợp hệ thống bình luận với Disqus

1. Đăng ký tài khoản Disqus và tạo site mới
2. Lấy shortname của site
3. Thêm mã Disqus vào trang story.html và chapter.html:

```html
<!-- Thay thế phần "Hệ thống bình luận sẽ được tích hợp ở đây" -->
<div id="disqus_thread"></div>
<script>
    var disqus_config = function () {
        this.page.url = window.location.href;
        this.page.identifier = window.location.pathname;
    };
    (function() {
        var d = document, s = d.createElement('script');
        s.src = 'https://YOUR_SHORTNAME.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Vui lòng bật JavaScript để xem <a href="https://disqus.com/?ref_noscript">bình luận từ Disqus.</a></noscript>
```

## 5. Tích hợp Google Analytics

1. Tạo tài khoản Google Analytics và tạo property mới
2. Lấy Measurement ID
3. Thêm mã Google Analytics vào tất cả các trang:

```html
<!-- Thêm vào phần head của tất cả các trang -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 6. Tối ưu hóa SEO

1. Thêm thẻ meta vào tất cả các trang:

```html
<!-- Thêm vào phần head của tất cả các trang -->
<meta name="description" content="Bạch Khôi Mao Gia - Trang web đọc truyện tiểu thuyết, ngôn tình, truyện ngắn hot nhất 2024">
<meta name="keywords" content="truyện, tiểu thuyết, ngôn tình, truyện ngắn, đọc truyện online">
<meta name="author" content="Bạch Khôi Mao Gia">
<meta property="og:title" content="Bạch Khôi Mao Gia - Truyện tiểu thuyết, ngôn tình, truyện ngắn hot nhất 2024">
<meta property="og:description" content="Trang web đọc truyện tiểu thuyết, ngôn tình, truyện ngắn hot nhất 2024">
<meta property="og:image" content="https://yourdomain.com/images/logo.png">
<meta property="og:url" content="https://yourdomain.com">
<meta name="twitter:card" content="summary_large_image">
```

2. Tạo file sitemap.xml trong thư mục gốc:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2024-04-13</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Thêm các URL khác của trang web -->
</urlset>
```

3. Tạo file robots.txt trong thư mục gốc:

```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

## 7. Chế độ đọc ban đêm

Thêm CSS cho chế độ đọc ban đêm vào file style.css:

```css
/* Chế độ đọc ban đêm */
body.night-mode {
    background-color: #1a1a1a;
    color: #f0f0f0;
}

body.night-mode header,
body.night-mode .story-card,
body.night-mode .story-item,
body.night-mode .ranking-list,
body.night-mode .ranking-item {
    background-color: #2a2a2a;
    color: #f0f0f0;
}

body.night-mode a {
    color: #f0f0f0;
}

body.night-mode .story-info h3 a:hover,
body.night-mode .main-nav a:hover,
body.night-mode .main-nav a.active {
    color: #FFB5A7;
}

body.night-mode .story-desc,
body.night-mode .story-author {
    color: #ccc;
}

body.night-mode .footer-links a,
body.night-mode .category-grid a {
    color: #ccc;
}

body.night-mode .footer-links a:hover,
body.night-mode .category-grid a:hover {
    color: #FFB5A7;
}

body.night-mode .section-title {
    border-bottom-color: #FFB5A7;
}
```

Thêm JavaScript cho chế độ đọc ban đêm vào file script.js:

```javascript
// Chế độ đọc ban đêm
const nightModeBtn = document.querySelector('.night-mode-btn');
if (nightModeBtn) {
    // Kiểm tra trạng thái chế độ đọc ban đêm từ localStorage
    const nightMode = localStorage.getItem('nightMode') === 'true';
    
    // Áp dụng chế độ đọc ban đêm nếu đã được bật trước đó
    if (nightMode) {
        document.body.classList.add('night-mode');
        nightModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Xử lý sự kiện khi nhấp vào nút chế độ đọc ban đêm
    nightModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        
        if (document.body.classList.contains('night-mode')) {
            localStorage.setItem('nightMode', 'true');
            nightModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('nightMode', 'false');
            nightModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}
```

## 8. Hệ thống donate

### Tích hợp PayPal

1. Tạo tài khoản PayPal Business
2. Tạo nút donate và thêm vào trang web:

```html
<!-- Thêm vào phần footer hoặc trang profile -->
<div class="donate-section">
    <h3>Ủng hộ tác giả</h3>
    <p>Nếu bạn thích nội dung của chúng tôi, hãy ủng hộ để chúng tôi có thể tiếp tục cung cấp những truyện hay!</p>
    <form action="https://www.paypal.com/donate" method="post" target="_blank">
        <input type="hidden" name="business" value="YOUR_PAYPAL_EMAIL">
        <input type="hidden" name="currency_code" value="USD">
        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button">
    </form>
</div>
```

### Tích hợp Momo (cho người dùng Việt Nam)

```html
<!-- Thêm vào phần footer hoặc trang profile -->
<div class="donate-section">
    <h3>Ủng hộ qua Momo</h3>
    <p>Quét mã QR bên dưới để ủng hộ qua ví Momo:</p>
    <img src="images/momo-qr.png" alt="Momo QR Code" class="donate-qr">
</div>
```

## 9. Tính năng chia sẻ lên mạng xã hội

Thêm nút chia sẻ vào trang story.html và chapter.html:

```html
<!-- Thêm vào phần story-actions hoặc chapter-navigation -->
<div class="share-buttons">
    <button class="share-facebook" onclick="shareOnFacebook()"><i class="fab fa-facebook-f"></i></button>
    <button class="share-twitter" onclick="shareOnTwitter()"><i class="fab fa-twitter"></i></button>
    <button class="share-pinterest" onclick="shareOnPinterest()"><i class="fab fa-pinterest-p"></i></button>
    <button class="share-email" onclick="shareViaEmail()"><i class="fas fa-envelope"></i></button>
</div>
```

Thêm JavaScript cho chức năng chia sẻ vào file script.js:

```javascript
// Chia sẻ lên mạng xã hội
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
}

function shareOnPinterest() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const image = encodeURIComponent(document.querySelector('meta[property="og:image"]').getAttribute('content'));
    window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`, '_blank');
}

function shareViaEmail() {
    const url = window.location.href;
    const title = document.title;
    const subject = encodeURIComponent(`Chia sẻ: ${title}`);
    const body = encodeURIComponent(`Tôi nghĩ bạn sẽ thích đọc truyện này: ${title}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
```

## 10. Favicon và hình nền

### Thêm favicon

1. Tạo favicon từ logo (có thể sử dụng công cụ trực tuyến như favicon.io)
2. Lưu các phiên bản favicon vào thư mục gốc
3. Thêm các thẻ link vào phần head của tất cả các trang:

```html
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
```

### Thêm hình nền

1. Chuẩn bị hình nền phù hợp
2. Lưu hình nền vào thư mục images
3. Thêm CSS sau vào file style.css:

```css
body {
    background-image: url('images/background.jpg');
    background-repeat: repeat;
    background-attachment: fixed;
    /* Hoặc sử dụng background-size: cover; nếu muốn hình nền phủ toàn bộ */
}

/* Đảm bảo nội dung vẫn dễ đọc trên hình nền */
main .container {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Phiên bản cho chế độ đọc ban đêm */
body.night-mode main .container {
    background-color: rgba(42, 42, 42, 0.9);
}
```

## 11. Tích hợp link affiliate

Thêm các link affiliate vào các vị trí phù hợp trong trang web:

```html
<!-- Ví dụ: Thêm vào phần footer -->
<div class="affiliate-section">
    <h3>Đối tác của chúng tôi</h3>
    <div class="affiliate-links">
        <a href="https://example.com/affiliate-link-1?ref=your-id" target="_blank">
            <img src="images/affiliate1.jpg" alt="Đối tác 1">
        </a>
        <a href="https://example.com/affiliate-link-2?ref=your-id" target="_blank">
            <img src="images/affiliate2.jpg" alt="Đối tác 2">
        </a>
        <!-- Thêm các link affiliate khác -->
    </div>
</div>
```

## 12. Thống kê lượt xem, lượt đọc

### Sử dụng Firebase Firestore để lưu trữ thống kê

1. Bật Firestore trong dự án Firebase
2. Tạo cấu trúc dữ liệu cho thống kê
3. Thêm mã JavaScript để cập nhật và hiển thị thống kê:

```javascript
// Thêm vào file script.js
// Cập nhật lượt xem cho truyện
function updateStoryViews(storyId) {
    const db = firebase.firestore();
    const storyRef = db.collection('stories').doc(storyId);
    
    // Cập nhật lượt xem trong Firestore
    storyRef.update({
        views: firebase.firestore.FieldValue.increment(1)
    });
    
    // Cập nhật lượt xem trong localStorage để tránh đếm trùng
    const viewedStories = JSON.parse(localStorage.getItem('viewedStories') || '{}');
    viewedStories[storyId] = Date.now();
    localStorage.setItem('viewedStories', JSON.stringify(viewedStories));
}

// Cập nhật lượt đọc cho chương
function updateChapterViews(storyId, chapterId) {
    const db = firebase.firestore();
    const chapterRef = db.collection('stories').doc(storyId).collection('chapters').doc(chapterId);
    
    // Cập nhật lượt đọc trong Firestore
    chapterRef.update({
        views: firebase.firestore.FieldValue.increment(1)
    });
    
    // Cập nhật lượt đọc trong localStorage để tránh đếm trùng
    const viewedChapters = JSON.parse(localStorage.getItem('viewedChapters') || '{}');
    viewedChapters[chapterId] = Date.now();
    localStorage.setItem('viewedChapters', JSON.stringify(viewedChapters));
}

// Gọi hàm cập nhật lượt xem/đọc khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    // Lấy thông tin truyện và chương từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('story');
    const chapterId = urlParams.get('chapter');
    
    if (storyId) {
        // Kiểm tra xem người dùng đã xem truyện này gần đây chưa
        const viewedStories = JSON.parse(localStorage.getItem('viewedStories') || '{}');
        const lastViewed = viewedStories[storyId] || 0;
        const now = Date.now();
        
        // Chỉ cập nhật lượt xem nếu đã qua 1 giờ kể từ lần xem cuối
        if (now - lastViewed > 3600000) {
            updateStoryViews(storyId);
        }
        
        if (chapterId) {
            // Kiểm tra xem người dùng đã đọc chương này gần đây chưa
            const viewedChapters = JSON.parse(localStorage.getItem('viewedChapters') || '{}');
            const lastRead = viewedChapters[chapterId] || 0;
            
            // Chỉ cập nhật lượt đọc nếu đã qua 1 giờ kể từ lần đọc cuối
            if (now - lastRead > 3600000) {
                updateChapterViews(storyId, chapterId);
            }
        }
    }
});
```

## 13. Tìm kiếm truyện theo nhiều tiêu chí

Tạo file `search.html` trong thư mục gốc:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tìm kiếm - Bạch Khôi Mao Gia</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Header (giống index.html) -->
    
    <!-- Main Content -->
    <main>
        <div class="container">
            <div class="search-page">
                <h1>Tìm kiếm truyện</h1>
                
                <div class="search-filters">
                    <div class="search-input">
                        <input type="text" id="search-keyword" placeholder="Nhập từ khóa tìm kiếm">
                        <button id="search-btn"><i class="fas fa-search"></i> Tìm kiếm</button>
                    </div>
                    
                    <div class="filter-section">
                        <h3>Lọc theo thể loại</h3>
                        <div class="category-filters">
                            <label><input type="checkbox" value="ngon-tinh"> Ngôn Tình</label>
                            <label><input type="checkbox" value="truyen-teen"> Truyện Teen</label>
                            <label><input type="checkbox" value="tieu-thuyet"> Tiểu Thuyết</label>
                            <label><input type="checkbox" value="kiem-hiep"> Kiếm Hiệp</label>
                            <label><input type="checkbox" value="xuyen-khong"> Xuyên Không</label>
                            <label><input type="checkbox" value="trong-sinh"> Trọng Sinh</label>
                            <label><input type="checkbox" value="co-dai"> Cổ Đại</label>
                            <label><input type="checkbox" value="huyen-huyen"> Huyền Huyễn</label>
                            <!-- Thêm các thể loại khác -->
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <h3>Lọc theo trạng thái</h3>
                        <div class="status-filters">
                            <label><input type="radio" name="status" value="all" checked> Tất cả</label>
                            <label><input type="radio" name="status" value="ongoing"> Đang cập nhật</label>
                            <label><input type="radio" name="status" value="completed"> Hoàn thành</label>
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <h3>Sắp xếp theo</h3>
                        <div class="sort-filters">
                            <label><input type="radio" name="sort" value="latest" checked> Mới nhất</label>
                            <label><input type="radio" name="sort" value="popular"> Phổ biến nhất</label>
                            <label><input type="radio" name="sort" value="name"> Tên A-Z</label>
                        </div>
                    </div>
                </div>
                
                <div class="search-results">
                    <h2>Kết quả tìm kiếm</h2>
                    <div id="results-count">Tìm thấy 0 truyện</div>
                    
                    <div class="story-grid" id="search-results-grid">
                        <!-- Kết quả tìm kiếm sẽ được hiển thị ở đây -->
                    </div>
                </div>
            </div>
        </div>
    </main>
    
    <!-- Footer (giống index.html) -->
    
    <script src="script.js"></script>
    <script src="search.js"></script>
</body>
</html>
```

Tạo file `search.js` trong thư mục gốc:

```javascript
// Xử lý tìm kiếm
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchKeyword = document.getElementById('search-keyword');
    const categoryFilters = document.querySelectorAll('.category-filters input');
    const statusFilters = document.querySelectorAll('.status-filters input');
    const sortFilters = document.querySelectorAll('.sort-filters input');
    const resultsGrid = document.getElementById('search-results-grid');
    const resultsCount = document.getElementById('results-count');
    
    // Lấy tham số tìm kiếm từ URL (nếu có)
    const urlParams = new URLSearchParams(window.location.search);
    const keywordParam = urlParams.get('keyword');
    
    if (keywordParam) {
        searchKeyword.value = keywordParam;
        performSearch();
    }
    
    // Xử lý sự kiện khi nhấp vào nút tìm kiếm
    searchBtn.addEventListener('click', performSearch);
    
    // Xử lý sự kiện khi nhấn Enter trong ô tìm kiếm
    searchKeyword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Xử lý sự kiện khi thay đổi bộ lọc
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', performSearch);
    });
    
    statusFilters.forEach(filter => {
        filter.addEventListener('change', performSearch);
    });
    
    sortFilters.forEach(filter => {
        filter.addEventListener('change', performSearch);
    });
    
    // Hàm thực hiện tìm kiếm
    function performSearch() {
        const keyword = searchKeyword.value.trim().toLowerCase();
        const selectedCategories = Array.from(categoryFilters)
            .filter(filter => filter.checked)
            .map(filter => filter.value);
        
        const selectedStatus = Array.from(statusFilters)
            .find(filter => filter.checked)?.value || 'all';
        
        const selectedSort = Array.from(sortFilters)
            .find(filter => filter.checked)?.value || 'latest';
        
        // Trong một ứng dụng thực tế, bạn sẽ gọi API hoặc truy vấn Firestore ở đây
        // Đối với mục đích demo, chúng ta sẽ sử dụng dữ liệu mẫu
        fetchSearchResults(keyword, selectedCategories, selectedStatus, selectedSort)
            .then(results => {
                displaySearchResults(results);
            })
            .catch(error => {
                console.error('Lỗi tìm kiếm:', error);
                resultsGrid.innerHTML = '<p class="error-message">Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.</p>';
            });
    }
    
    // Hàm lấy kết quả tìm kiếm (mô phỏng)
    function fetchSearchResults(keyword, categories, status, sort) {
        // Trong ứng dụng thực tế, đây sẽ là một API call hoặc truy vấn Firestore
        return new Promise((resolve) => {
            // Mô phỏng độ trễ mạng
            setTimeout(() => {
                // Dữ liệu mẫu
                const sampleData = [
                    {
                        id: 'story1',
                        title: 'Một Ván Mạt Chược Thắng Được Chồng Tương Lai',
                        author: 'Tên tác giả 1',
                        thumbnail: 'images/story1.jpg',
                        categories: ['ngon-tinh', 'co-dai'],
                        status: 'ongoing',
                        views: 107564,
                        date: '2024-04-01'
                    },
                    // Thêm các truyện mẫu khác
                ];
                
                // Lọc kết quả
                let results = sampleData;
                
                if (keyword) {
                    results = results.filter(story => 
                        story.title.toLowerCase().includes(keyword) || 
                        story.author.toLowerCase().includes(keyword)
                    );
                }
                
                if (categories.length > 0) {
                    results = results.filter(story => 
                        categories.some(category => story.categories.includes(category))
                    );
                }
                
                if (status !== 'all') {
                    results = results.filter(story => story.status === status);
                }
                
                // Sắp xếp kết quả
                switch (sort) {
                    case 'latest':
                        results.sort((a, b) => new Date(b.date) - new Date(a.date));
                        break;
                    case 'popular':
                        results.sort((a, b) => b.views - a.views);
                        break;
                    case 'name':
                        results.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                }
                
                resolve(results);
            }, 500);
        });
    }
    
    // Hàm hiển thị kết quả tìm kiếm
    function displaySearchResults(results) {
        resultsCount.textContent = `Tìm thấy ${results.length} truyện`;
        
        if (results.length === 0) {
            resultsGrid.innerHTML = '<p class="no-results">Không tìm thấy truyện phù hợp với tiêu chí tìm kiếm.</p>';
            return;
        }
        
        resultsGrid.innerHTML = '';
        
        results.forEach(story => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';
            
            storyCard.innerHTML = `
                <div class="story-image">
                    <a href="story.html?story=${story.id}">
                        <img src="${story.thumbnail}" alt="${story.title}">
                    </a>
                </div>
                <div class="story-info">
                    <h3><a href="story.html?story=${story.id}">${story.title}</a></h3>
                    <div class="story-author">
                        <a href="#">${story.author}</a>
                    </div>
                    <div class="story-stats">
                        <span class="views"><i class="fas fa-eye"></i> ${story.views.toLocaleString()}</span>
                        <span class="status ${story.status}">${story.status === 'ongoing' ? 'Đang cập nhật' : 'Hoàn thành'}</span>
                    </div>
                </div>
            `;
            
            resultsGrid.appendChild(storyCard);
        });
    }
});
```

## 14. Thông báo qua email khi có chương mới

### Sử dụng Firebase Cloud Functions và Nodemailer

1. Cài đặt Firebase CLI và khởi tạo Cloud Functions
2. Tạo file `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Cấu hình email
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Hàm gửi email thông báo
exports.sendNewChapterNotification = functions.firestore
    .document('stories/{storyId}/chapters/{chapterId}')
    .onCreate(async (snapshot, context) => {
        const chapterData = snapshot.data();
        const storyId = context.params.storyId;
        
        // Lấy thông tin truyện
        const storyDoc = await admin.firestore().collection('stories').doc(storyId).get();
        const storyData = storyDoc.data();
        
        // Lấy danh sách người dùng theo dõi truyện này
        const followersSnapshot = await admin.firestore()
            .collection('story_followers')
            .where('storyId', '==', storyId)
            .get();
        
        const followers = followersSnapshot.docs.map(doc => doc.data());
        
        // Gửi email cho từng người theo dõi
        const emailPromises = followers.map(async (follower) => {
            // Lấy thông tin người dùng
            const userDoc = await admin.firestore().collection('users').doc(follower.userId).get();
            const userData = userDoc.data();
            
            // Chuẩn bị nội dung email
            const mailOptions = {
                from: '"Bạch Khôi Mao Gia" <your-email@gmail.com>',
                to: userData.email,
                subject: `Chương mới: ${chapterData.title} - ${storyData.title}`,
                html: `
                    <h1>Chương mới đã được cập nhật!</h1>
                    <p>Xin chào ${userData.displayName},</p>
                    <p>Truyện <strong>${storyData.title}</strong> mà bạn đang theo dõi vừa được cập nhật chương mới:</p>
                    <p><strong>Chương ${chapterData.chapter_number}: ${chapterData.title}</strong></p>
                    <p>Nhấp vào liên kết dưới đây để đọc ngay:</p>
                    <p><a href="https://yourdomain.com/chapter.html?story=${storyId}&chapter=${context.params.chapterId}">Đọc chương mới</a></p>
                    <p>Trân trọng,<br>Đội ngũ Bạch Khôi Mao Gia</p>
                    <p><small>Nếu bạn không muốn nhận thông báo này nữa, vui lòng <a href="https://yourdomain.com/profile.html">hủy theo dõi</a> truyện.</small></p>
                `
            };
            
            try {
                await mailTransport.sendMail(mailOptions);
                console.log(`Email sent to ${userData.email}`);
                return true;
            } catch (error) {
                console.error(`Error sending email to ${userData.email}:`, error);
                return false;
            }
        });
        
        return Promise.all(emailPromises);
    });
```

3. Triển khai Cloud Functions:

```bash
firebase deploy --only functions
```

## 15. Tạo trang profile.html

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trang cá nhân - Bạch Khôi Mao Gia</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Header (giống index.html) -->
    
    <!-- Main Content -->
    <main>
        <div class="container">
            <div class="profile-page">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <img src="images/avatar-default.png" alt="Avatar" id="profile-avatar-img">
                        <button class="change-avatar-btn"><i class="fas fa-camera"></i></button>
                    </div>
                    <div class="profile-info">
                        <h1 id="profile-name">Tên người dùng</h1>
                        <p id="profile-email">email@example.com</p>
                        <p id="profile-joined">Tham gia: 01/01/2024</p>
                    </div>
                </div>
                
                <div class="profile-tabs">
                    <button class="profile-tab active" data-tab="favorites">Truyện yêu thích</button>
                    <button class="profile-tab" data-tab="following">Đang theo dõi</button>
                    <button class="profile-tab" data-tab="history">Lịch sử đọc</button>
                    <button class="profile-tab" data-tab="settings">Cài đặt</button>
                </div>
                
                <div class="profile-content">
                    <div class="profile-section favorites-section active">
                        <h2>Truyện yêu thích</h2>
                        <div class="story-grid" id="favorites-grid">
                            <!-- Danh sách truyện yêu thích sẽ được hiển thị ở đây -->
                        </div>
                    </div>
                    
                    <div class="profile-section following-section">
                        <h2>Đang theo dõi</h2>
                        <div class="story-grid" id="following-grid">
                            <!-- Danh sách truyện đang theo dõi sẽ được hiển thị ở đây -->
                        </div>
                    </div>
                    
                    <div class="profile-section history-section">
                        <h2>Lịch sử đọc</h2>
                        <div class="reading-history" id="history-list">
                            <!-- Lịch sử đọc sẽ được hiển thị ở đây -->
                        </div>
                    </div>
                    
                    <div class="profile-section settings-section">
                        <h2>Cài đặt tài khoản</h2>
                        <form id="profile-settings-form">
                            <div class="form-group">
                                <label for="settings-name">Họ tên</label>
                                <input type="text" id="settings-name">
                            </div>
                            <div class="form-group">
                                <label for="settings-email">Email</label>
                                <input type="email" id="settings-email" disabled>
                            </div>
                            <div class="form-group">
                                <label for="settings-password">Mật khẩu mới</label>
                                <input type="password" id="settings-password">
                            </div>
                            <div class="form-group">
                                <label for="settings-confirm-password">Xác nhận mật khẩu mới</label>
                                <input type="password" id="settings-confirm-password">
                            </div>
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="settings-email-notifications">
                                    Nhận thông báo qua email khi có chương mới
                                </label>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="save-settings-btn">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
    
    <!-- Footer (giống index.html) -->
    
    <script src="script.js"></script>
    <script src="profile.js"></script>
</body>
</html>
```

Tạo file `profile.js` trong thư mục gốc:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra trạng thái đăng nhập
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
            window.location.href = 'login.html';
            return;
        }
        
        // Hiển thị thông tin người dùng
        displayUserInfo(user);
        
        // Tải dữ liệu người dùng
        loadUserData(user.uid);
    });
    
    // Xử lý chuyển đổi tab
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileSections = document.querySelectorAll('.profile-section');
    
    profileTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Xóa lớp active từ tất cả các tab và section
            profileTabs.forEach(t => t.classList.remove('active'));
            profileSections.forEach(s => s.classList.remove('active'));
            
            // Thêm lớp active cho tab và section được chọn
            tab.classList.add('active');
            document.querySelector(`.${tabName}-section`).classList.add('active');
        });
    });
    
    // Xử lý thay đổi avatar
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', () => {
            // Tạo input file ẩn
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            
            // Xử lý khi chọn file
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    
                    // Tải file lên Firebase Storage
                    uploadAvatar(file);
                }
            });
            
            // Mở hộp thoại chọn file
            fileInput.click();
        });
    }
    
    // Xử lý lưu cài đặt
    const settingsForm = document.getElementById('profile-settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('settings-name').value;
            const password = document.getElementById('settings-password').value;
            const confirmPassword = document.getElementById('settings-confirm-password').value;
            const emailNotifications = document.getElementById('settings-email-notifications').checked;
            
            // Cập nhật thông tin người dùng
            updateUserSettings(name, password, confirmPassword, emailNotifications);
        });
    }
});

// Hàm hiển thị thông tin người dùng
function displayUserInfo(user) {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileAvatar = document.getElementById('profile-avatar-img');
    const settingsName = document.getElementById('settings-name');
    const settingsEmail = document.getElementById('settings-email');
    
    if (profileName) profileName.textContent = user.displayName || 'Người dùng';
    if (profileEmail) profileEmail.textContent = user.email;
    if (profileAvatar && user.photoURL) profileAvatar.src = user.photoURL;
    if (settingsName) settingsName.value = user.displayName || '';
    if (settingsEmail) settingsEmail.value = user.email;
    
    // Hiển thị ngày tham gia
    const profileJoined = document.getElementById('profile-joined');
    if (profileJoined && user.metadata) {
        const joinDate = new Date(user.metadata.creationTime);
        profileJoined.textContent = `Tham gia: ${joinDate.toLocaleDateString('vi-VN')}`;
    }
}

// Hàm tải dữ liệu người dùng
function loadUserData(userId) {
    const db = firebase.firestore();
    
    // Tải truyện yêu thích
    db.collection('user_favorites')
        .where('userId', '==', userId)
        .get()
        .then((snapshot) => {
            const favoritesGrid = document.getElementById('favorites-grid');
            if (!favoritesGrid) return;
            
            if (snapshot.empty) {
                favoritesGrid.innerHTML = '<p class="no-data">Bạn chưa có truyện yêu thích nào.</p>';
                return;
            }
            
            // Lấy thông tin chi tiết của từng truyện
            const storyPromises = snapshot.docs.map(doc => {
                return db.collection('stories').doc(doc.data().storyId).get();
            });
            
            Promise.all(storyPromises)
                .then((storyDocs) => {
                    favoritesGrid.innerHTML = '';
                    
                    storyDocs.forEach((storyDoc) => {
                        if (!storyDoc.exists) return;
                        
                        const storyData = storyDoc.data();
                        const storyCard = createStoryCard(storyDoc.id, storyData);
                        favoritesGrid.appendChild(storyCard);
                    });
                });
        })
        .catch((error) => {
            console.error('Error loading favorites:', error);
        });
    
    // Tải truyện đang theo dõi
    db.collection('story_followers')
        .where('userId', '==', userId)
        .get()
        .then((snapshot) => {
            const followingGrid = document.getElementById('following-grid');
            if (!followingGrid) return;
            
            if (snapshot.empty) {
                followingGrid.innerHTML = '<p class="no-data">Bạn chưa theo dõi truyện nào.</p>';
                return;
            }
            
            // Lấy thông tin chi tiết của từng truyện
            const storyPromises = snapshot.docs.map(doc => {
                return db.collection('stories').doc(doc.data().storyId).get();
            });
            
            Promise.all(storyPromises)
                .then((storyDocs) => {
                    followingGrid.innerHTML = '';
                    
                    storyDocs.forEach((storyDoc) => {
                        if (!storyDoc.exists) return;
                        
                        const storyData = storyDoc.data();
                        const storyCard = createStoryCard(storyDoc.id, storyData);
                        followingGrid.appendChild(storyCard);
                    });
                });
        })
        .catch((error) => {
            console.error('Error loading following:', error);
        });
    
    // Tải lịch sử đọc
    db.collection('reading_history')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get()
        .then((snapshot) => {
            const historyList = document.getElementById('history-list');
            if (!historyList) return;
            
            if (snapshot.empty) {
                historyList.innerHTML = '<p class="no-data">Bạn chưa có lịch sử đọc nào.</p>';
                return;
            }
            
            historyList.innerHTML = '';
            
            // Lấy thông tin chi tiết của từng truyện và chương
            snapshot.docs.forEach((doc) => {
                const historyData = doc.data();
                
                // Lấy thông tin truyện
                db.collection('stories').doc(historyData.storyId).get()
                    .then((storyDoc) => {
                        if (!storyDoc.exists) return;
                        
                        const storyData = storyDoc.data();
                        
                        // Lấy thông tin chương
                        db.collection('stories').doc(historyData.storyId)
                            .collection('chapters').doc(historyData.chapterId).get()
                            .then((chapterDoc) => {
                                if (!chapterDoc.exists) return;
                                
                                const chapterData = chapterDoc.data();
                                
                                // Tạo phần tử lịch sử đọc
                                const historyItem = document.createElement('div');
                                historyItem.className = 'history-item';
                                
                                const date = new Date(historyData.timestamp.toDate());
                                
                                historyItem.innerHTML = `
                                    <div class="history-story">
                                        <img src="${storyData.thumbnail}" alt="${storyData.title}">
                                        <div class="history-info">
                                            <h3><a href="story.html?story=${historyData.storyId}">${storyData.title}</a></h3>
                                            <p>
                                                <a href="chapter.html?story=${historyData.storyId}&chapter=${historyData.chapterId}">
                                                    Chương ${chapterData.chapter_number}: ${chapterData.title}
                                                </a>
                                            </p>
                                            <p class="history-date">${date.toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div class="history-actions">
                                        <a href="chapter.html?story=${historyData.storyId}&chapter=${historyData.chapterId}" class="continue-reading-btn">
                                            Tiếp tục đọc
                                        </a>
                                    </div>
                                `;
                                
                                historyList.appendChild(historyItem);
                            });
                    });
            });
        })
        .catch((error) => {
            console.error('Error loading reading history:', error);
        });
    
    // Tải cài đặt thông báo
    db.collection('user_settings').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const settings = doc.data();
                const emailNotifications = document.getElementById('settings-email-notifications');
                if (emailNotifications) {
                    emailNotifications.checked = settings.emailNotifications || false;
                }
            }
        })
        .catch((error) => {
            console.error('Error loading user settings:', error);
        });
}

// Hàm tạo card truyện
function createStoryCard(storyId, storyData) {
    const storyCard = document.createElement('div');
    storyCard.className = 'story-card';
    
    storyCard.innerHTML = `
        <div class="story-image">
            <a href="story.html?story=${storyId}">
                <img src="${storyData.thumbnail}" alt="${storyData.title}">
            </a>
        </div>
        <div class="story-info">
            <h3><a href="story.html?story=${storyId}">${storyData.title}</a></h3>
            <div class="story-author">
                <a href="#">${storyData.author}</a>
            </div>
            <div class="story-actions">
                <button class="remove-btn" data-story-id="${storyId}">
                    <i class="fas fa-times"></i> Xóa
                </button>
            </div>
        </div>
    `;
    
    return storyCard;
}

// Hàm tải avatar lên Firebase Storage
function uploadAvatar(file) {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    const storageRef = firebase.storage().ref();
    const avatarRef = storageRef.child(`avatars/${user.uid}/${file.name}`);
    
    // Hiển thị thông báo đang tải lên
    alert('Đang tải avatar lên...');
    
    // Tải file lên
    avatarRef.put(file)
        .then((snapshot) => {
            // Lấy URL của file đã tải lên
            return snapshot.ref.getDownloadURL();
        })
        .then((downloadURL) => {
            // Cập nhật URL avatar trong profile người dùng
            return user.updateProfile({
                photoURL: downloadURL
            });
        })
        .then(() => {
            // Cập nhật avatar hiển thị
            const profileAvatar = document.getElementById('profile-avatar-img');
            if (profileAvatar) {
                profileAvatar.src = user.photoURL;
            }
            
            alert('Avatar đã được cập nhật!');
        })
        .catch((error) => {
            console.error('Error uploading avatar:', error);
            alert(`Lỗi khi tải avatar: ${error.message}`);
        });
}

// Hàm cập nhật cài đặt người dùng
function updateUserSettings(name, password, confirmPassword, emailNotifications) {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    // Mảng các promise cần thực hiện
    const promises = [];
    
    // Cập nhật tên hiển thị
    if (name && name !== user.displayName) {
        promises.push(
            user.updateProfile({
                displayName: name
            })
        );
    }
    
    // Cập nhật mật khẩu
    if (password) {
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        
        promises.push(
            user.updatePassword(password)
        );
    }
    
    // Cập nhật cài đặt thông báo
    const db = firebase.firestore();
    promises.push(
        db.collection('user_settings').doc(user.uid).set({
            emailNotifications: emailNotifications
        }, { merge: true })
    );
    
    // Thực hiện tất cả các cập nhật
    Promise.all(promises)
        .then(() => {
            alert('Cài đặt đã được cập nhật!');
            
            // Cập nhật thông tin hiển thị
            const profileName = document.getElementById('profile-name');
            if (profileName) {
                profileName.textContent = user.displayName || 'Người dùng';
            }
        })
        .catch((error) => {
            console.error('Error updating settings:', error);
            alert(`Lỗi khi cập nhật cài đặt: ${error.message}`);
        });
}
```

Những hướng dẫn trên sẽ giúp bạn triển khai đầy đủ các tính năng nâng cao cho trang web Bạch Khôi Mao Gia. Bạn có thể triển khai từng phần một theo thứ tự ưu tiên của mình.
