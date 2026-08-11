// ============================================
// teacher-dashboard.js - با مودال جدید
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    function loadExams() {
        const exams = JSON.parse(localStorage.getItem('darsbeam_exams')) || [];
        const examList = document.querySelector('.exam-list');

        if (!examList) return;

        examList.innerHTML = '';

        if (exams.length === 0) {
            examList.innerHTML = `
                <div class="empty-exams" style="text-align:center;padding:60px 20px;color:var(--text-muted);">
                    <i class="bi bi-inbox" style="font-size:48px;display:block;margin-bottom:12px;"></i>
                    <p style="font-size:18px;font-weight:500;color:var(--text-secondary);">هنوز آزمونی نساختی!</p>
                    <p>برای شروع، روی دکمه‌ی "ساخت آزمون جدید" کلیک کن.</p>
                </div>
            `;
            return;
        }

        exams.forEach((exam) => {
            const card = document.createElement('div');
            card.className = 'exam-card';
            card.innerHTML = `
                <div class="exam-icon"><i class="bi bi-file-earmark-check"></i></div>
                <div class="exam-info">
                    <h3>${exam.title}</h3>
                    <p>${exam.questions?.length || 0} سؤال • ${exam.students || 0} دانش‌آموز</p>
                    <small style="color:var(--text-muted);">${exam.subject} - پایه ${exam.grade}</small>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button class="exam-action view-exam" data-id="${exam.id}">مشاهده <i class="bi bi-arrow-left"></i></button>
                    <button class="exam-action delete-exam" data-id="${exam.id}" style="background:#ef4444;"><i class="bi bi-trash"></i></button>
                </div>
            `;
            examList.appendChild(card);

            // ===== حذف =====
            const deleteBtn = card.querySelector('.delete-exam');
            deleteBtn.addEventListener('click', async function(e) {
                e.stopPropagation();
                const id = parseInt(this.dataset.id);
                const examTitle = exam.title;

                const result = await darsbeamConfirm({
                    title: '🗑️ حذف آزمون',
                    text: `آیا از حذف "${examTitle}" مطمئنی؟`,
                    icon: 'trash3',
                    confirmText: 'بله، حذف کن',
                    cancelText: 'انصراف',
                    type: 'danger'
                });

                if (result) {
                    let examsList = JSON.parse(localStorage.getItem('darsbeam_exams')) || [];
                    examsList = examsList.filter(ex => ex.id !== id);
                    localStorage.setItem('darsbeam_exams', JSON.stringify(examsList));

                    await darsbeamConfirm({
                        title: '✅ حذف شد!',
                        text: `"${examTitle}" با موفقیت حذف شد.`,
                        icon: 'check-circle',
                        confirmText: 'باشه',
                        cancelText: '',
                        type: 'success'
                    });

                    loadExams();
                    updateStats();
                }
            });

            // ===== مشاهده =====
            const viewBtn = card.querySelector('.view-exam');
            viewBtn.addEventListener('click', async function() {
                const id = parseInt(this.dataset.id);
                const examData = exams.find(ex => ex.id === id);
                if (examData) {
                    await darsbeamConfirm({
                        title: `📝 ${examData.title}`,
                        text: `📚 درس: ${examData.subject}\n🎯 پایه: ${examData.grade}\n⏱ مدت: ${examData.duration}\n📊 سطح: ${examData.difficulty}\n📝 تعداد سؤال: ${examData.questions?.length || 0}`,
                        icon: 'file-earmark-text',
                        confirmText: 'باشه',
                        cancelText: '',
                        type: 'info'
                    });
                }
            });
        });
    }

    function updateStats() {
        const exams = JSON.parse(localStorage.getItem('darsbeam_exams')) || [];
        const totalStudents = exams.reduce((sum, exam) => sum + (exam.students || 0), 0);
        const statCards = document.querySelectorAll('.stat-card strong');
        if (statCards.length >= 3) {
            statCards[0].textContent = exams.length;
            statCards[1].textContent = totalStudents || 0;
            statCards[2].textContent = exams.length > 0 ? '۷۴%' : '--';
        }
    }

    loadExams();
    updateStats();
    console.log('📊 پنل معلم با موفقیت بارگذاری شد!');
});