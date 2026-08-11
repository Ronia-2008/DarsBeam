// ============================================
// settings.js - مدیریت تنظیمات و پنل
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    console.log('🔥 settings.js اجرا شد!');

    // ============================================
    // 1. باز و بسته کردن پنل تنظیمات
    // ============================================
    const settingsBtn = document.getElementById('settingsToggleBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettingsBtn = document.getElementById('closeSettings');

    console.log('🔍 دکمه تنظیمات:', settingsBtn);
    console.log('🔍 پنل تنظیمات:', settingsPanel);

    if (settingsBtn) {
        settingsBtn.addEventListener('click', function(e) {
            e.preventDefault();  // جلوگیری از رفتن به # در لینک
            e.stopPropagation();
            settingsPanel.classList.toggle('open');
            console.log('🔘 پنل باز/بسته شد');
        });
    } else {
        console.log('❌ دکمه تنظیمات پیدا نشد!');
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', function() {
            settingsPanel.classList.remove('open');
        });
    }

    // بستن با کلیک خارج از پنل
    document.addEventListener('click', function(e) {
        if (settingsPanel && settingsPanel.classList.contains('open')) {
            if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
                settingsPanel.classList.remove('open');
            }
        }
    });

    // بستن با کلید ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            settingsPanel.classList.remove('open');
        }
    });

    // ============================================
    // 2. تم دارک/لایت
    // ============================================
    const darkModeToggle = document.getElementById('darkMode');

    function enableDarkMode() {
        console.log('🌙 دارک مود فعال شد');
        document.body.classList.add('dark-theme');
        localStorage.setItem('darsbeam-theme', 'dark');
        if (darkModeToggle) darkModeToggle.checked = true;
    }

    function disableDarkMode() {
        console.log('☀️ لایت مود فعال شد');
        document.body.classList.remove('dark-theme');
        localStorage.setItem('darsbeam-theme', 'light');
        if (darkModeToggle) darkModeToggle.checked = false;
    }

    function toggleDarkMode(isDark) {
        console.log('🔄 تغییر تم به:', isDark ? 'دارک' : 'لایت');
        if (isDark) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('darsbeam-theme');
        console.log('📂 تم ذخیره‌شده:', savedTheme);
        if (savedTheme === 'dark') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            toggleDarkMode(this.checked);
        });
    }

    // ============================================
    // 3. تغییر رنگ اصلی
    // ============================================
    const themeColors = document.querySelectorAll('.theme-color');

    function changePrimaryColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
        const r = parseInt(color.slice(1,3), 16);
        const g = parseInt(color.slice(3,5), 16);
        const b = parseInt(color.slice(5,7), 16);
        document.documentElement.style.setProperty('--primary-hover', `rgb(${Math.max(0, r-30)}, ${Math.max(0, g-30)}, ${Math.max(0, b-30)})`);
        localStorage.setItem('darsbeam-color', color);
        
        themeColors.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.color === color) {
                btn.classList.add('active');
            }
        });
    }

    function loadColor() {
        const savedColor = localStorage.getItem('darsbeam-color');
        if (savedColor) {
            changePrimaryColor(savedColor);
        }
    }

    if (themeColors.length > 0) {
        themeColors.forEach(btn => {
            btn.addEventListener('click', function() {
                changePrimaryColor(this.dataset.color);
            });
        });
    }

    // ============================================
    // 4. اجرا
    // ============================================
    loadTheme();
    loadColor();

    console.log('⚙️ تنظیمات با موفقیت بارگذاری شد!');
});