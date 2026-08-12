// ============================================
// settings.js - نسخه نهایی
// ============================================

console.log('🔥 settings.js در حال بارگذاری...');

// ===== تابع گلوبال برای onclick =====
window.toggleSettingsPanel = function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsPanel) {
        settingsPanel.classList.toggle('open');
        console.log('🔘 پنل با onclick باز/بسته شد');
    }
};

(function() {
    'use strict';

    // ============================================
    // 1. باز و بسته کردن پنل تنظیمات
    // ============================================
    function initSettings() {
        const settingsBtn = document.getElementById('settingsToggleBtn');
        const settingsPanel = document.getElementById('settingsPanel');
        const closeSettingsBtn = document.getElementById('closeSettings');

        console.log('🔍 دکمه تنظیمات:', settingsBtn);
        console.log('🔍 پنل تنظیمات:', settingsPanel);

        if (!settingsBtn) {
            console.log('❌ دکمه تنظیمات پیدا نشد!');
            return;
        }

        if (!settingsPanel) {
            console.log('❌ پنل تنظیمات پیدا نشد!');
            return;
        }

        function closeSettings() {
            settingsPanel.classList.remove('open');
            console.log('🔘 پنل بسته شد');
        }

        // دکمه بستن
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                closeSettings();
            });
        }

        // بستن با کلیک خارج از پنل
        document.addEventListener('click', function(e) {
            if (settingsPanel.classList.contains('open')) {
                const isClickInside = settingsPanel.contains(e.target);
                const isClickOnBtn = settingsBtn.contains(e.target);
                if (!isClickInside && !isClickOnBtn) {
                    closeSettings();
                }
            }
        });

        // بستن با کلید ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeSettings();
            }
        });

        console.log('✅ رویدادهای تنظیمات متصل شدند!');
    }

    // ============================================
    // 2. تم دارک/لایت
    // ============================================
    function initTheme() {
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

        loadTheme();
    }

    // ============================================
    // 3. تغییر رنگ اصلی
    // ============================================
    function initColors() {
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

        loadColor();
    }

    // ============================================
    // 4. اجرا
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initSettings();
            initTheme();
            initColors();
            console.log('⚙️ تنظیمات با موفقیت بارگذاری شد!');
        });
    } else {
        initSettings();
        initTheme();
        initColors();
        console.log('⚙️ تنظیمات با موفقیت بارگذاری شد!');
    }

})();