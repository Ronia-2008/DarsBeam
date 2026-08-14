// ============================================
// rewards-system.js - نسخه ساده و مستقل
// ============================================

// ===== کلاس سیستم جایزه =====
class RewardsSystem {
    constructor(userId = 'student_1') {
        this.userId = userId;
        this.storageKey = `darsbeam_rewards_${userId}`;
        this.data = this.loadData();
        this.levels = [
            { level: 1, xpRequired: 0, title: '🌱 تازه‌کار' },
            { level: 2, xpRequired: 100, title: '📖 دانش‌آموز' },
            { level: 3, xpRequired: 300, title: '🎓 محصل' },
            { level: 4, xpRequired: 600, title: '🧠 باهوش' },
            { level: 5, xpRequired: 1000, title: '⭐ ستاره' },
        ];
    }

    loadData() {
        const defaultData = {
            userName: 'خورشید سوری',
            totalPoints: 0,
            level: 1,
            xp: 0,
            badges: [],
            examHistory: [],
            dailyStreak: 0,
            lastActivity: null
        };
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // اگه اسم قدیمی بود اصلاح کن
                if (parsed.userName === 'علی رضایی' || parsed.userName === 'خانم محمدی') {
                    parsed.userName = 'خورشید سوری';
                }
                return parsed;
            } catch (e) {
                return defaultData;
            }
        }
        return defaultData;
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        console.log('💾 داده‌های جایزه ذخیره شد:', this.data);
    }

    // ===== افزودن امتیاز =====
    addPoints(points, reason = 'فعالیت') {
        this.data.totalPoints += points;
        this.data.xp += points;
        
        // بررسی ارتقاء سطح
        let newLevel = this.data.level;
        for (const level of this.levels) {
            if (this.data.xp >= level.xpRequired) {
                newLevel = level.level;
            }
        }
        if (newLevel > this.data.level) {
            this.data.level = newLevel;
            const levelInfo = this.levels.find(l => l.level === newLevel);
            this.showNotification(`🎉 ارتقاء سطح!`, `به سطح ${newLevel} رسیدی! ${levelInfo?.title || ''}`);
        }
        
        this.saveData();
        this.showNotification(`+${points} امتیاز`, reason);
        return this.data.totalPoints;
    }

    // ===== ثبت آزمون =====
    logExam(examData) {
        const { examTitle, score, totalQuestions, correctAnswers } = examData;
        
        // ذخیره در تاریخچه
        this.data.examHistory.push({
            examTitle,
            score,
            totalQuestions,
            correctAnswers,
            date: new Date().toISOString(),
            points: Math.round(score / 10)
        });
        
        // محاسبه امتیاز
        let points = Math.round(score / 10);
        if (score === 100) points += 10;
        if (correctAnswers === totalQuestions) points += 5;
        
        this.addPoints(points, `آزمون: ${examTitle}`);
        
        // بج‌ها
        if (this.data.examHistory.length === 1) {
            this.unlockBadge('first_exam');
        }
        if (score === 100) {
            this.unlockBadge('perfect_score');
        }
        
        this.saveData();
        console.log('✅ آزمون در سیستم جایزه ثبت شد:', examTitle, 'امتیاز:', points);
    }

    // ===== بج‌ها =====
    unlockBadge(badgeId) {
        const badges = {
            'first_exam': { name: '📝 اولین آزمون', desc: 'اولین آزمونت رو دادی!' },
            'perfect_score': { name: '💯 نمره کامل', desc: 'نمره ۱۰۰ گرفتی!' }
        };
        if (!this.data.badges.includes(badgeId)) {
            this.data.badges.push(badgeId);
            const badge = badges[badgeId];
            if (badge) {
                this.showNotification('🏅 بج جدید!', `${badge.name}`);
            }
            this.saveData();
        }
    }

    // ===== گرفتن گزارش =====
    getReports() {
        const history = this.data.examHistory;
        const totalExams = history.length;
        if (totalExams === 0) {
            return {
                totalExams: 0,
                avgScore: 0,
                bestScore: 0,
                worstScore: 0,
                totalPoints: this.data.totalPoints,
                level: this.data.level,
                badges: this.data.badges.length,
                scores: [],
                recentExams: [],
                progress: 0,
                userName: this.data.userName
            };
        }
        const scores = history.map(h => h.score);
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalExams);
        const bestScore = Math.max(...scores);
        const worstScore = Math.min(...scores);
        const progress = Math.min((this.data.totalPoints / 500) * 100, 100);

        return {
            totalExams,
            avgScore,
            bestScore,
            worstScore,
            totalPoints: this.data.totalPoints,
            level: this.data.level,
            badges: this.data.badges.length,
            scores,
            recentExams: history.slice(-5).reverse(),
            progress,
            userName: this.data.userName
        };
    }

    // ===== اعلان =====
    showNotification(title, message) {
        console.log(`🔔 ${title}: ${message}`);
        // اگه notifySuccess وجود داشت استفاده کن
        if (window.notifySuccess) {
            notifySuccess(title, message);
        }
    }
}

// ============================================
// ایجاد نمونه گلوبال
// ============================================
let darsbeamRewards = null;

function initRewards(userId = 'student_1') {
    darsbeamRewards = new RewardsSystem(userId);
    console.log('🎖️ سیستم جایزه برای کاربر "' + userId + '" مقداردهی شد!');
    return darsbeamRewards;
}

// اگر صفحه قبلاً بارگذاری شده بود، یک نمونه پیش‌فرض بساز
if (typeof darsbeamRewards === 'undefined' || darsbeamRewards === null) {
    const role = localStorage.getItem('user_role') || 'student';
    const userId = role === 'teacher' ? 'teacher_1' : 'student_1';
    initRewards(userId);
}

console.log('🎖️ سیستم جایزه با موفقیت بارگذاری شد!');