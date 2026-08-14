// ============================================
// create-exam.js
// مدیریت ساخت آزمون
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // المان‌ها
    // ============================================
    const sections = {
        info: document.getElementById('examInfoSection'),
        questions: document.getElementById('questionsSection'),
        review: document.getElementById('reviewSection')
    };

    const btns = {
        nextToQuestions: document.getElementById('nextToQuestions'),
        backToInfo: document.getElementById('backToInfo'),
        reviewExam: document.getElementById('reviewExamBtn'),
        editQuestions: document.getElementById('editQuestionsBtn'),
        saveExam: document.getElementById('saveExamBtn'),
        addQuestion: document.getElementById('addQuestionBtn')
    };

    const questionsContainer = document.getElementById('questionsContainer');
    const reviewQuestionsContainer = document.getElementById('reviewQuestions');

    // ============================================
    // داده‌های آزمون
    // ============================================
    const examData = {
        title: '',
        subject: '',
        grade: '',
        duration: '',
        difficulty: '',
        description: '',
        questions: []
    };

    let questionCounter = 0;

    // ============================================
    // توابع کمکی
    // ============================================
    function showSection(sectionId) {
        Object.keys(sections).forEach(key => {
            sections[key].classList.remove('active');
        });
        if (sections[sectionId]) {
            sections[sectionId].classList.add('active');
        }
        updateProgress(sectionId);
    }

    function updateProgress(sectionId) {
        const steps = document.querySelectorAll('.progress-step');
        const lines = document.querySelectorAll('.progress-line');
        const stepMap = { info: 0, questions: 1, review: 2 };
        const activeIndex = stepMap[sectionId] || 0;

        steps.forEach((step, index) => {
            step.classList.toggle('active', index <= activeIndex);
            step.classList.toggle('completed', index < activeIndex);
        });

        lines.forEach((line, index) => {
            line.classList.toggle('completed', index < activeIndex);
        });
    }

    // ============================================
    // مدیریت سؤال‌ها
    // ============================================
    function createQuestionHTML(index) {
        return `
            <div class="question-card" data-index="${index}">
                <div class="question-header">
                    <span class="question-number">سؤال ${index + 1}</span>
                    <button type="button" class="remove-question-btn" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="question-body">
                    <div class="form-group full-width">
                        <label>متن سؤال</label>
                        <textarea class="question-text" rows="2" placeholder="متن سؤال را وارد کنید..."></textarea>
                    </div>
                    <div class="form-group full-width">
                        <label>نوع سؤال</label>
                        <div class="input-box">
                            <i class="bi bi-list-ul"></i>
                            <select class="question-type">
                                <option value="multiple">تستی (چهار گزینه‌ای)</option>
                                <option value="descriptive">تشریحی</option>
                                <option value="truefalse">صحیح/غلط</option>
                            </select>
                        </div>
                    </div>
                    <div class="options-container">
                        <div class="form-group">
                            <label>گزینه ۱</label>
                            <div class="input-box">
                                <i class="bi bi-1-circle"></i>
                                <input type="text" class="option-input" placeholder="گزینه ۱">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>گزینه ۲</label>
                            <div class="input-box">
                                <i class="bi bi-2-circle"></i>
                                <input type="text" class="option-input" placeholder="گزینه ۲">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>گزینه ۳</label>
                            <div class="input-box">
                                <i class="bi bi-3-circle"></i>
                                <input type="text" class="option-input" placeholder="گزینه ۳">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>گزینه ۴</label>
                            <div class="input-box">
                                <i class="bi bi-4-circle"></i>
                                <input type="text" class="option-input" placeholder="گزینه ۴">
                            </div>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <label>پاسخ صحیح</label>
                        <div class="input-box">
                            <i class="bi bi-check-circle"></i>
                            <select class="correct-answer">
                                <option value="0">گزینه ۱</option>
                                <option value="1">گزینه ۲</option>
                                <option value="2">گزینه ۳</option>
                                <option value="3">گزینه ۴</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function addQuestion() {
        const index = questionCounter;
        const html = createQuestionHTML(index);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const questionElement = tempDiv.firstElementChild;

        const removeBtn = questionElement.querySelector('.remove-question-btn');
        removeBtn.addEventListener('click', function() {
            if (document.querySelectorAll('.question-card').length <= 1) {
                showError('حداقل یک سؤال باید باشد!');
                return;
            }
            this.closest('.question-card').remove();
            renumberQuestions();
        });

        const typeSelect = questionElement.querySelector('.question-type');
        const optionsContainer = questionElement.querySelector('.options-container');
        const correctAnswer = questionElement.querySelector('.correct-answer').closest('.form-group');

        typeSelect.addEventListener('change', function() {
            const isMultiple = this.value === 'multiple';
            optionsContainer.style.display = isMultiple ? 'grid' : 'none';
            correctAnswer.style.display = isMultiple ? 'block' : 'none';
        });

        questionsContainer.appendChild(questionElement);
        questionCounter++;
    }

    function renumberQuestions() {
        const cards = document.querySelectorAll('.question-card');
        cards.forEach((card, index) => {
            const numberSpan = card.querySelector('.question-number');
            numberSpan.textContent = `سؤال ${index + 1}`;
            card.dataset.index = index;
        });
    }

    function collectQuestions() {
        const cards = document.querySelectorAll('.question-card');
        const questions = [];

        for (const card of cards) {
            const text = card.querySelector('.question-text').value.trim();
            const type = card.querySelector('.question-type').value;
            const options = card.querySelectorAll('.option-input');
            const correct = card.querySelector('.correct-answer');

            if (!text) {
                showError('لطفاً متن همه‌ی سؤال‌ها را وارد کنید.');
                throw new Error('متن سؤال خالی');
            }

            const questionData = {
                text: text,
                type: type,
                options: Array.from(options).map(opt => opt.value.trim()),
                correctAnswer: parseInt(correct.value)
            };

            if (type === 'multiple') {
                const emptyOptions = questionData.options.some(opt => opt === '');
                if (emptyOptions) {
                    showError('لطفاً همه‌ی گزینه‌های سؤال "' + text.substring(0, 20) + '..." را پر کنید.');
                    throw new Error('گزینه خالی');
                }
            }

            questions.push(questionData);
        }

        return questions;
    }

    // ============================================
    // اطلاعات فرم
    // ============================================
    function collectExamInfo() {
        const title = document.getElementById('examTitle').value.trim();
        const subject = document.getElementById('examSubject').value;
        const grade = document.getElementById('examGrade').value;
        const duration = document.getElementById('examDuration').value;
        const difficulty = document.getElementById('examDifficulty').value;
        const description = document.getElementById('examDescription').value.trim();

        if (!title || !subject || !grade || !duration || !difficulty) {
            showError('لطفاً همه‌ی فیلدهای اجباری را پر کنید.');
            return null;
        }

        return { title, subject, grade, duration, difficulty, description };
    }

    // ============================================
    // بررسی
    // ============================================
    function populateReview() {
        document.getElementById('reviewTitle').textContent = examData.title;
        document.getElementById('reviewSubject').textContent = examData.subject;
        document.getElementById('reviewGrade').textContent = examData.grade;
        document.getElementById('reviewDuration').textContent = examData.duration;
        document.getElementById('reviewDifficulty').textContent = examData.difficulty;
        document.getElementById('reviewQuestionCount').textContent = examData.questions.length;

        reviewQuestionsContainer.innerHTML = '';
        examData.questions.forEach((q, index) => {
            const div = document.createElement('div');
            div.className = 'review-question-item';
            div.style.cssText = 'padding: 12px 0; border-bottom: 1px solid var(--border-color);';
            
            const typeLabel = q.type === 'multiple' ? 'تستی' : q.type === 'descriptive' ? 'تشریحی' : 'صحیح/غلط';
            
            let optionsHTML = '';
            if (q.type === 'multiple') {
                optionsHTML = `
                    <div class="review-q-options" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
                        ${q.options.map((opt, i) => `
                            <span style="background:var(--bg-body);padding:4px 12px;border-radius:6px;font-size:14px;color:var(--text-secondary);${i === q.correctAnswer ? 'border:2px solid #10b981;color:#10b981;' : ''}">
                                ${i + 1}. ${opt}
                            </span>
                        `).join('')}
                    </div>
                `;
            }

            div.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <strong style="color:var(--text-primary);">سؤال ${index + 1}</strong>
                    <span style="background:var(--bg-body);padding:2px 12px;border-radius:12px;font-size:12px;color:var(--text-secondary);">${typeLabel}</span>
                </div>
                <p style="color:var(--text-primary);margin:0 0 4px;">${q.text}</p>
                ${optionsHTML}
            `;
            reviewQuestionsContainer.appendChild(div);
        });
    }

    // ============================================
    // پیام‌ها
    // ============================================
    async function showError(message) {
        await darsbeamConfirm({
            title: '❌ خطا',
            text: message,
            icon: 'x-circle',
            confirmText: 'باشه',
            cancelText: '',
            type: 'danger'
        });
    }

    async function showSuccess(message, title = '✅ موفقیت') {
        await darsbeamConfirm({
            title: title,
            text: message,
            icon: 'check-circle',
            confirmText: 'باشه',
            cancelText: '',
            type: 'success'
        });
    }

    // ============================================
    // ذخیره‌سازی آزمون (با اتصال به سیستم جایزه)
    // ============================================
    async function saveExam() {
        try {
            const questions = collectQuestions();
            examData.questions = questions;

            const exams = JSON.parse(localStorage.getItem('darsbeam_exams')) || [];
            const newExam = {
                id: Date.now(),
                ...examData,
                createdAt: new Date().toISOString(),
                students: 0
            };
            exams.push(newExam);
            localStorage.setItem('darsbeam_exams', JSON.stringify(exams));

            // ============================================
            // ===== ثبت در سیستم جایزه برای معلم =====
            // ============================================
            try {
                const userRole = localStorage.getItem('user_role') || 'teacher';
                const userId = userRole === 'teacher' ? 'teacher_1' : 'student_1';
                
                if (typeof darsbeamRewards === 'undefined' || !darsbeamRewards) {
                    if (typeof initRewards === 'function') {
                        darsbeamRewards = initRewards(userId);
                    }
                }

                if (darsbeamRewards) {
                    console.log('🎖️ ثبت ساخت آزمون در سیستم جایزه...');
                    // ثبت ساخت آزمون در سیستم جایزه
                    if (typeof darsbeamRewards.logExamCreated === 'function') {
                        darsbeamRewards.logExamCreated();
                    } else {
                        // اگر تابع خاصی نداره، امتیاز مستقیم بده
                        darsbeamRewards.addPoints(15, 'ساخت آزمون جدید');
                    }
                    notifySuccess('🎖️ امتیاز ساخت آزمون!', '+۱۵ امتیاز برای ساخت آزمون جدید');
                }
            } catch (rewardError) {
                console.warn('⚠️ خطا در ثبت در سیستم جایزه:', rewardError);
            }

            await showSuccess(`"${examData.title}" با موفقیت ذخیره شد.`, '✅ آزمون ذخیره شد!');
            window.location.href = 'teacher-dashboard.html';
        } catch (error) {
            console.error('خطا در ذخیره‌سازی:', error);
        }
    }

    // ============================================
    // رویدادها
    // ============================================
    btns.nextToQuestions.addEventListener('click', function() {
        const info = collectExamInfo();
        if (info) {
            Object.assign(examData, info);
            showSection('questions');
            if (document.querySelectorAll('.question-card').length === 0) {
                addQuestion();
            }
        }
    });

    btns.backToInfo.addEventListener('click', function() {
        showSection('info');
    });

    btns.reviewExam.addEventListener('click', function() {
        try {
            const questions = collectQuestions();
            examData.questions = questions;
            populateReview();
            showSection('review');
        } catch (error) {
            // خطا قبلاً نمایش داده شده
        }
    });

    btns.editQuestions.addEventListener('click', function() {
        showSection('questions');
    });

    btns.saveExam.addEventListener('click', async function() {
        const confirmResult = await darsbeamConfirm({
            title: '💾 ذخیره آزمون',
            text: `آیا از ذخیره‌ی این آزمون مطمئنی؟\nعنوان: "${examData.title}"\nتعداد سؤال: ${document.querySelectorAll('.question-card').length}`,
            icon: 'save',
            confirmText: 'بله، ذخیره کن',
            cancelText: 'انصراف',
            type: 'info'
        });

        if (confirmResult) {
            await saveExam();
        }
    });

    btns.addQuestion.addEventListener('click', function() {
        addQuestion();
    });

    // ============================================
    // مقداردهی اولیه
    // ============================================
    showSection('info');

    setTimeout(() => {
        if (document.querySelectorAll('.question-card').length === 0) {
            addQuestion();
        }
    }, 100);

    console.log('🚀 ایجاد آزمون با موفقیت بارگذاری شد!');
});