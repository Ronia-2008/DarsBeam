// ============================================
// splash.js
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    function createSplashScreen() {
        if (document.querySelector('.splash-screen')) return;

        const splash = document.createElement('div');
        splash.className = 'splash-screen';
        splash.id = 'splashScreen';

        splash.innerHTML = `
            <!-- ===== ستاره‌ها ===== -->
            <div class="stars" id="stars"></div>
            
            <!-- ===== امواج ===== -->
            <div class="wave-container">
                <div class="wave wave-1"></div>
                <div class="wave wave-2"></div>
                <div class="wave wave-3"></div>
            </div>
            
            <!-- ===== محتوای اصلی ===== -->
            <div class="splash-content">
                <div class="splash-icon">
                    <i class="bi bi-book-half"></i>
                </div>
                <h1 class="splash-title">درس‌بیم</h1>
                <p class="splash-subtitle">DarsBeam</p>
            </div>
            
            <!-- ===== اسکلتون‌ها ===== -->
            <div class="skeleton-wrapper">
                <div class="skeleton-row">
                    <div class="skeleton-circle"></div>
                    <div class="skeleton-text-group">
                        <div class="skeleton-line long"></div>
                        <div class="skeleton-line medium"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                </div>
                
                <div class="skeleton-cards">
                    <div class="skeleton-card"></div>
                    <div class="skeleton-card"></div>
                    <div class="skeleton-card"></div>
                </div>
                
                <div class="skeleton-bottom"></div>
            </div>
            
            <!-- ===== سه نقطه ===== -->
            <div class="splash-loader">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;

        document.body.prepend(splash);

        // ساخت ستاره‌ها
        createStars();
        
        // بعد از ۳.۵ ثانیه مخفی کن
        setTimeout(() => {
            splash.classList.add('hidden');
            setTimeout(() => {
                if (splash.parentNode) {
                    splash.parentNode.removeChild(splash);
                }
            }, 800);
        }, 3500);
    }

    // ============================================
    // ساخت ستاره‌ها
    // ============================================
    function createStars() {
        const container = document.getElementById('stars');
        if (!container) return;

        const count = 80;

        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const size = 1 + Math.random() * 2.5;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = 2 + Math.random() * 4;
            const delay = Math.random() * 3;
            
            star.style.cssText = `
                left: ${left}%;
                top: ${top}%;
                width: ${size}px;
                height: ${size}px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${0.3 + Math.random() * 0.7};
            `;
            
            container.appendChild(star);
        }
    }

    // ============================================
    // اجرا
    // ============================================
    if (document.readyState === 'complete') {
        createSplashScreen();
    } else {
        window.addEventListener('load', createSplashScreen);
    }

    console.log('✨ اسپلش‌اسکرین با ستاره و امواج بارگذاری شد!');
});