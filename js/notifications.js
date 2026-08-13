// ============================================
// notifications.js
// سیستم اعلان‌های درس‌بیم
// ============================================

class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.createContainer();
    }

    createContainer() {
        // حذف کانتینر قبلی اگر وجود داره
        const existing = document.querySelector('.notification-container');
        if (existing) existing.remove();

        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    // ===== نمایش اعلان =====
    show({
        title = '',
        message = '',
        type = 'info', // 'success' | 'error' | 'warning' | 'info'
        duration = 4000, // میلی‌ثانیه
        icon = '',
        closable = true
    } = {}) {

        // انتخاب آیکون پیش‌فرض بر اساس نوع
        const iconMap = {
            success: 'bi-check-circle-fill',
            error: 'bi-x-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };

        const finalIcon = icon || iconMap[type] || iconMap.info;

        // ساخت المان اعلان
        const item = document.createElement('div');
        item.className = `notification-item ${type}`;
        
        item.innerHTML = `
            <span class="notification-icon">
                <i class="bi ${finalIcon}"></i>
            </span>
            <div class="notification-content">
                ${title ? `<h4 class="notification-title">${title}</h4>` : ''}
                <p class="notification-message">${message}</p>
            </div>
            ${closable ? `
                <button class="notification-close" onclick="this.closest('.notification-item').remove()">
                    <i class="bi bi-x-lg"></i>
                </button>
            ` : ''}
        `;

        // اضافه کردن به کانتینر
        this.container.appendChild(item);

        // حذف خودکار بعد از مدت زمان
        if (duration > 0) {
            setTimeout(() => {
                this.remove(item);
            }, duration);
        }

        // برگردوندن آیتم برای استفاده‌های بعدی
        return item;
    }

    // ===== حذف اعلان =====
    remove(item) {
        if (!item || !item.parentNode) return;
        
        // اضافه کردن کلاس انیمیشن خروج
        item.classList.add('hiding');
        
        // حذف از DOM بعد از انیمیشن
        setTimeout(() => {
            if (item.parentNode) {
                item.remove();
            }
        }, 300);
    }

    // ===== حذف همه اعلان‌ها =====
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    // ===== متدهای سریع =====
    success(title, message, duration = 4000) {
        return this.show({ title, message, type: 'success', duration });
    }

    error(title, message, duration = 5000) {
        return this.show({ title, message, type: 'error', duration });
    }

    warning(title, message, duration = 4000) {
        return this.show({ title, message, type: 'warning', duration });
    }

    info(title, message, duration = 3000) {
        return this.show({ title, message, type: 'info', duration });
    }
}

// ============================================
// نمونه‌ی گلوبال برای استفاده در همه جای سایت
// ============================================
let darsbeamNotify;

// ===== مقداردهی اولیه =====
document.addEventListener('DOMContentLoaded', function() {
    darsbeamNotify = new NotificationSystem();
    console.log('🔔 سیستم اعلان‌ها با موفقیت بارگذاری شد!');
});

// ===== تابع کمکی برای استفاده راحت =====
window.showNotification = function(options) {
    if (!darsbeamNotify) {
        darsbeamNotify = new NotificationSystem();
    }
    return darsbeamNotify.show(options);
};

// ===== توابع سریع =====
window.notifySuccess = function(title, message, duration) {
    return showNotification({ title, message, type: 'success', duration });
};

window.notifyError = function(title, message, duration) {
    return showNotification({ title, message, type: 'error', duration });
};

window.notifyWarning = function(title, message, duration) {
    return showNotification({ title, message, type: 'warning', duration });
};

window.notifyInfo = function(title, message, duration) {
    return showNotification({ title, message, type: 'info', duration });
};