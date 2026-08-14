// ============================================
// role-manager.js
// مدیریت نقش کاربر در کل سایت
// ============================================

const RoleManager = {
    // ===== ذخیره نقش =====
    setRole(role) {
        localStorage.setItem('user_role', role);
        console.log(`👤 نقش کاربر به "${role}" تغییر کرد`);
    },

    // ===== دریافت نقش =====
    getRole() {
        return localStorage.getItem('user_role') || 'student';
    },

    // ===== تغییر نقش =====
    toggleRole() {
        const current = this.getRole();
        const newRole = current === 'student' ? 'teacher' : 'student';
        this.setRole(newRole);
        return newRole;
    },

    // ===== بررسی نقش =====
    isStudent() {
        return this.getRole() === 'student';
    },

    isTeacher() {
        return this.getRole() === 'teacher';
    }
};

// ===== ذخیره در گلوبال =====
window.RoleManager = RoleManager;

console.log('👤 سیستم مدیریت نقش با موفقیت بارگذاری شد!');