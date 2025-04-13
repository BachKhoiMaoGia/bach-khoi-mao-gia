document.addEventListener('DOMContentLoaded', function() {
    // Tab switching for rankings
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would typically load different ranking data
            // For demo purposes, we'll just show a console message
            console.log('Switched to tab: ' + this.textContent);
        });
    });
    
    // Mobile menu toggle (if needed)
    const createMobileMenu = () => {
        const header = document.querySelector('header');
        const mainNav = document.querySelector('.main-nav');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insert button before main nav
        header.insertBefore(mobileMenuBtn, mainNav);
        
        // Add toggle functionality
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.innerHTML = mainNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    };
    
    // Only create mobile menu for smaller screens
    if (window.innerWidth < 768) {
        createMobileMenu();
    }
    
    // Window resize handler
    window.addEventListener('resize', function() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (window.innerWidth < 768 && !mobileMenuBtn) {
            createMobileMenu();
        } else if (window.innerWidth >= 768 && mobileMenuBtn) {
            mobileMenuBtn.remove();
            document.querySelector('.main-nav').classList.remove('active');
        }
    });
    
    // Search functionality
    const searchForm = document.querySelector('.search-bar');
    const searchInput = searchForm.querySelector('input');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            // In a real implementation, this would redirect to search results
            console.log('Searching for: ' + searchTerm);
            alert('Đang tìm kiếm: ' + searchTerm);
        }
    });
    
    // Lazy loading images (simple implementation)
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            if (img.getBoundingClientRect().top <= window.innerHeight) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    };
    
    // Initial check for lazy images
    lazyLoadImages();
    
    // Check for lazy images on scroll
    window.addEventListener('scroll', lazyLoadImages);
});
