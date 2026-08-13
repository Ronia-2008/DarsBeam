// ============================================
// theme-manager.js
// مدیریت تم و رنگ‌ها در کل سایت - نسخه نهایی
// ============================================

(function() {
    'use strict';

    console.log('🎨 theme-manager.js در حال بارگذاری...');

    // ============================================
    // 1. بارگذاری تم ذخیره‌شده
    // ============================================
    function loadTheme() {
        const savedTheme = localStorage.getItem('darsbeam-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        console.log('🌙 تم بارگذاری شد:', savedTheme || 'light');
        return savedTheme === 'dark';
    }

    // ============================================
    // 2. بارگذاری رنگ ذخیره‌شده
    // ============================================
    function loadColor() {
        const savedColor = localStorage.getItem('darsbeam-color');
        if (savedColor) {
            document.documentElement.style.setProperty('--primary-color', savedColor);
            console.log('🎨 رنگ بارگذاری شد:', savedColor);
        } else {
            // رنگ پیش‌فرض
            document.documentElement.style.setProperty('--primary-color', '#2563eb');
        }
        return savedColor || '#2563eb';
    }

    // ============================================
    // 3. هماهنگ‌سازی چک‌باکس‌های دارک مود
    // ============================================
    function syncDarkModeCheckboxes() {
        const isDark = document.body.classList.contains('dark-theme');
        document.querySelectorAll('#darkMode, #darkModeAdvanced').forEach(cb => {
            if (cb) {
                cb.checked = isDark;
                console.log('🔘 چک‌باکس هماهنگ شد:', cb.id, isDark);
            }
        });
    }

    // ============================================
    // 4. تابع تغییر تم (برای استفاده در onclick)
    // ============================================
    window.toggleDarkMode = function(isDark) {
        console.log('🌙 تغییر تم به:', isDark ? 'dark' : 'light');
        
        if (isDark) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('darsbeam-theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('darsbeam-theme', 'light');
        }
        
        // هماهنگ‌سازی چک‌باکس‌ها
        syncDarkModeCheckboxes();
        
        // اعلان (اگه سیستم اعلان وجود داره)
        if (window.notifyInfo) {
            notifyInfo('🔄 تغییر تم', isDark ? 'حالت تیره فعال شد' : 'حالت روشن فعال شد');
        }
        
        console.log('✅ تم تغییر کرد:', isDark ? 'dark' : 'light');
    };

    // ============================================
    // 5. تابع تغییر رنگ (برای استفاده در onclick)
    // ============================================
    window.changeThemeColor = function(color) {
        console.log('🎨 تغییر رنگ به:', color);
        
        document.documentElement.style.setProperty('--primary-color', color);
        localStorage.setItem('darsbeam-color', color);

        // به‌روزرسانی دکمه‌های رنگ در صفحه
        document.querySelectorAll('.color-dot, .theme-color').forEach(el => {
            el.classList.remove('active');
            if (el.dataset.color === color) {
                el.classList.add('active');
            }
        });

        if (window.notifySuccess) {
            notifySuccess('🎨 تغییر رنگ', 'رنگ اصلی سایت با موفقیت تغییر کرد');
        }
        console.log('✅ رنگ تغییر کرد:', color);
    };

    // ============================================
    // 6. مقداردهی اولیه
    // ============================================
    function init() {
        const isDark = loadTheme();
        const color = loadColor();
        syncDarkModeCheckboxes();
        
        console.log('⚙️ مدیریت تم با موفقیت بارگذاری شد!');
        console.log('📊 وضعیت فعلی - تم:', isDark ? 'dark' : 'light', '| رنگ:', color);
    }

    // اجرا وقتی DOM آماده شد
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();