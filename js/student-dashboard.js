// ============================================
// student-dashboard.js
// پنل دانش‌آموز - نمایش درس‌ها و آزمون‌ها
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // داده‌های نمونه (بعداً از API میاد)
    // ============================================
    const studentData = {
        name: 'علی رضایی',
        grade: 'هشتم',
        courses: [
            { id: 1, name: 'ریاضی', icon: '📐', teacher: 'خانم محمدی', progress: 75 },
            { id: 2, name: 'علوم', icon: '🔬', teacher: 'آقای کریمی', progress: 60 },
            { id: 3, name: 'فارسی', icon: '📖', teacher: 'خانم احمدی', progress: 90 },
            { id: 4, name: 'زبان انگلیسی', icon: '🇬🇧', teacher: 'آقای حسینی', progress: 45 },
            { id: 5, name: 'مطالعات اجتماعی', icon: '🌍', teacher: 'خانم رضایی', progress: 80 },
            { id: 6, name: 'آموزش قرآن', icon: '🕌', teacher: 'آقای طاهری', progress: 70 }
        ],
        exams: [
            { id: 1, title: 'آزمون ریاضی فصل اول', subject: 'ریاضی', status: 'pending', questions: 12, deadline: '۲ روز دیگر' },
            { id: 2, title: 'آزمون علوم فصل دوم', subject: 'علوم', status: 'done', questions: 10, deadline: 'انجام شده' },
            { id: 3, title: 'آزمون فارسی نوبت اول', subject: 'فارسی', status: 'overdue', questions: 15, deadline: '۳ روز گذشته' },
            { id: 4, title: 'آزمون زبان واحد ۳', subject: 'زبان انگلیسی', status: 'pending', questions: 8, deadline: '۵ روز دیگر' }
        ],
        stats: {
            courseCount: 6,
            examDone: 3,
            avgScore: 78,
            studyTime: 24
        }
    };

    // ============================================
    // 1. نمایش آمار
    // ============================================
    function updateStats() {
        document.getElementById('courseCount').textContent = studentData.stats.courseCount;
        document.getElementById('examDone').textContent = studentData.stats.examDone;
        document.getElementById('avgScore').textContent = studentData.stats.avgScore + '%';
        document.getElementById('studyTime').textContent = studentData.stats.studyTime;
    }

    // ============================================
    // 2. نمایش درس‌ها
    // ============================================
    function renderCourses() {
        const container = document.getElementById('coursesContainer');
        if (!container) return;

        container.innerHTML = '';

        studentData.courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <span class="course-icon">${course.icon}</span>
                <h3>${course.name}</h3>
                <span class="course-teacher">👨‍🏫 ${course.teacher}</span>
                <div class="course-progress">
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" style="width: ${course.progress}%;"></div>
                    </div>
                    <span class="progress-text">${course.progress}% پیشرفت</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // ============================================
    // 3. نمایش آزمون‌ها
    // ============================================
    function renderExams() {
        const container = document.getElementById('examList');
        if (!container) return;

        container.innerHTML = '';

        // فقط آزمون‌های انجام نشده رو نشون بده
        const pendingExams = studentData.exams.filter(ex => ex.status !== 'done');

        if (pendingExams.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:40px 20px;color:var(--text-muted);">
                    <i class="bi bi-check-all" style="font-size:48px;display:block;margin-bottom:12px;color:var(--success);"></i>
                    <p style="font-size:18px;font-weight:500;color:var(--text-secondary);">همه‌ی آزمون‌ها رو انجام دادی! 🎉</p>
                    <p>برای ادامه، منتظر آزمون‌های جدید باش.</p>
                </div>
            `;
            return;
        }

        pendingExams.forEach(exam => {
            const card = document.createElement('div');
            card.className = 'exam-card';

            const statusMap = {
                pending: { label: 'در انتظار', class: 'pending' },
                overdue: { label: 'تأخیر', class: 'overdue' },
                done: { label: 'انجام شده', class: 'done' }
            };

            const status = statusMap[exam.status] || statusMap.pending;

            card.innerHTML = `
                <div class="exam-icon">
                    <i class="bi bi-file-earmark-text"></i>
                </div>
                <div class="exam-info">
                    <h3>${exam.title}</h3>
                    <p>📚 ${exam.subject} • ${exam.questions} سؤال • ⏱ ${exam.deadline}</p>
                </div>
                <span class="exam-status ${status.class}">${status.label}</span>
                <button class="exam-action start-exam" data-id="${exam.id}">
                    شروع آزمون
                    <i class="bi bi-arrow-left"></i>
                </button>
            `;

            container.appendChild(card);

            // رویداد شروع آزمون
            const startBtn = card.querySelector('.start-exam');
            startBtn.addEventListener('click', async function(e) {
                e.stopPropagation();
                await darsbeamConfirm({
                    title: '📝 شروع آزمون',
                    text: `آماده‌ای برای شروع "${exam.title}"؟\n⏱ ${exam.deadline}\n📝 ${exam.questions} سؤال`,
                    icon: 'play-circle',
                    confirmText: 'بله، شروع کن',
                    cancelText: 'انصراف',
                    type: 'info'
                });
                // بعداً به صفحه‌ی آزمون هدایت میشه
            });
        });
    }

    // ============================================
    // 4. بارگذاری اولیه
    // ============================================
    updateStats();
    renderCourses();
    renderExams();

    console.log('🎓 پنل دانش‌آموز با موفقیت بارگذاری شد!');
});