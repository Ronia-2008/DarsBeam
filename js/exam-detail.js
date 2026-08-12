// ============================================
// exam-detail.js
// مدیریت صفحه‌ی شروع آزمون
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // داده‌های نمونه (بعداً از API میاد)
    // ============================================
    const examData = {
        id: 1,
        title: 'آزمون ریاضی فصل اول',
        subject: 'ریاضی',
        difficulty: 'متوسط',
        timeLimit: 15, // دقیقه
        questions: [
            {
                id: 1,
                text: 'حاصل عبارت ۵ × (۳ + ۲) چند است؟',
                options: ['۱۰', '۱۵', '۲۰', '۲۵'],
                correct: 3 // ایندکس پاسخ صحیح
            },
            {
                id: 2,
                text: 'مساحت یک مربع به ضلع ۴ سانتی‌متر چند است؟',
                options: ['۸ سانتی‌متر مربع', '۱۲ سانتی‌متر مربع', '۱۶ سانتی‌متر مربع', '۲۰ سانتی‌متر مربع'],
                correct: 2
            },
            {
                id: 3,
                text: 'کدام عدد بزرگ‌تر است؟',
                options: ['۰.۵', '۰.۰۵', '۰.۵۵', '۰.۵۰۵'],
                correct: 2
            },
            {
                id: 4,
                text: 'حاصل ۱۲ ÷ ۴ چند است؟',
                options: ['۲', '۳', '۴', '۶'],
                correct: 1
            },
            {
                id: 5,
                text: 'یک مستطیل به طول ۸ و عرض ۵، محیط آن چند است؟',
                options: ['۱۳', '۲۶', '۴۰', '۲۰'],
                correct: 1
            }
        ]
    };

    // ============================================
    // المان‌ها
    // ============================================
    const container = document.getElementById('questionsContainer');
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const submitBtn = document.getElementById('submitExam');
    const counter = document.getElementById('questionCounter');
    const progressFill = document.getElementById('examProgressFill');
    const progressText = document.getElementById('examProgressText');
    const timerDisplay = document.getElementById('timerDisplay');
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const answeredEl = document.getElementById('answeredQuestions');

    let currentQuestion = 0;
    let answers = {};
    let timerInterval = null;
    let timeLeft = examData.timeLimit * 60; // ثانیه
    let isSubmitted = false;

    // ============================================
    // 1. مقداردهی اولیه
    // ============================================
    function init() {
        // تنظیم عنوان
        document.getElementById('examTitle').textContent = examData.title;
        document.getElementById('examSubject').textContent = '📚 ' + examData.subject;
        document.getElementById('examDifficulty').textContent = 'سطح: ' + examData.difficulty;
        totalQuestionsEl.textContent = examData.questions.length + ' سؤال';

        // رندر سوالات
        renderQuestions();

        // نمایش سوال اول
        showQuestion(0);

        // شروع تایمر
        startTimer();

        // به‌روزرسانی آمار
        updateStats();
    }

    // ============================================
    // 2. رندر سوالات
    // ============================================
    function renderQuestions() {
        container.innerHTML = '';

        examData.questions.forEach((q, index) => {
            const div = document.createElement('div');
            div.className = 'question-card';
            div.dataset.index = index;

            const letters = ['الف', 'ب', 'پ', 'ت'];

            let optionsHTML = '';
            q.options.forEach((opt, optIndex) => {
                const isChecked = answers[index] === optIndex;
                optionsHTML += `
                    <label class="option-item" data-option="${optIndex}">
                        <input type="radio" name="question_${index}" value="${optIndex}" ${isChecked ? 'checked' : ''}>
                        <span class="option-letter">${letters[optIndex]})</span>
                        <span class="option-label">${opt}</span>
                    </label>
                `;
            });

            div.innerHTML = `
                <div class="question-number">سؤال ${index + 1} از ${examData.questions.length}</div>
                <div class="question-text">${q.text}</div>
                <div class="options-group">${optionsHTML}</div>
            `;

            container.appendChild(div);

            // رویداد انتخاب گزینه
            const options = div.querySelectorAll('.option-item input[type="radio"]');
            options.forEach(input => {
                input.addEventListener('change', function() {
                    const value = parseInt(this.value);
                    answers[index] = value;
                    
                    // نمایش پاسخ داده شده
                    div.classList.add('answered');
                    
                    // به‌روزرسانی آمار
                    updateStats();
                    updateProgress();
                    
                    // ذخیره در localStorage (برای ادامه بعداً)
                    saveProgress();
                });
            });
        });
    }

    // ============================================
    // 3. نمایش سوال
    // ============================================
    function showQuestion(index) {
        const cards = container.querySelectorAll('.question-card');
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        currentQuestion = index;
        counter.textContent = `${index + 1} از ${examData.questions.length}`;

        // وضعیت دکمه‌ها
        prevBtn.disabled = index === 0;
        nextBtn.textContent = index === examData.questions.length - 1 ? 'پایان' : 'بعدی';
        nextBtn.innerHTML = index === examData.questions.length - 1 ? 
            'پایان <i class="bi bi-check-lg"></i>' : 
            'بعدی <i class="bi bi-arrow-left"></i>';
    }

    // ============================================
    // 4. تایمر
    // ============================================
    function startTimer() {
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 60) {
                document.querySelector('.exam-timer').classList.add('warning');
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitExam(true);
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // ============================================
    // 5. آمار و پیشرفت
    // ============================================
    function updateStats() {
        const answered = Object.keys(answers).length;
        answeredEl.textContent = answered + ' پاسخ داده شده';
    }

    function updateProgress() {
        const total = examData.questions.length;
        const answered = Object.keys(answers).length;
        const percent = Math.round((answered / total) * 100);
        progressFill.style.width = percent + '%';
        progressText.textContent = percent + '%';
    }

    // ============================================
    // 6. ذخیره پیشرفت
    // ============================================
    function saveProgress() {
        const progress = {
            examId: examData.id,
            answers: answers,
            timeLeft: timeLeft,
            currentQuestion: currentQuestion
        };
        localStorage.setItem(`exam_progress_${examData.id}`, JSON.stringify(progress));
    }

    function loadProgress() {
        const saved = localStorage.getItem(`exam_progress_${examData.id}`);
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                answers = progress.answers || {};
                timeLeft = progress.timeLeft || timeLeft;
                currentQuestion = progress.currentQuestion || 0;
                
                // به‌روزرسانی UI
                updateStats();
                updateProgress();
                showQuestion(currentQuestion);
                
                // علامت‌گذاری سوالات پاسخ داده شده
                const cards = container.querySelectorAll('.question-card');
                cards.forEach((card, index) => {
                    if (answers[index] !== undefined) {
                        card.classList.add('answered');
                    }
                });
            } catch (e) {
                console.log('خطا در بارگذاری پیشرفت:', e);
            }
        }
    }

    // ============================================
    // 7. ثبت آزمون
    // ============================================
    async function submitExam(auto = false) {
        if (isSubmitted) return;

        // بررسی پاسخ‌ها
        const total = examData.questions.length;
        const answered = Object.keys(answers).length;

        if (!auto && answered < total) {
            const confirm = await darsbeamConfirm({
                title: '⚠️ هنوز کامل نکردی!',
                text: `از ${total} سؤال، فقط ${answered} تا رو پاسخ دادی. آیا مطمئنی می‌خوای ثبت کنی؟`,
                icon: 'exclamation-triangle',
                confirmText: 'بله، ثبت کن',
                cancelText: 'بازگشت',
                type: 'warning'
            });
            if (!confirm) return;
        }

        if (auto) {
            await darsbeamConfirm({
                title: '⏰ زمان تمام شد!',
                text: 'متأسفانه زمان آزمون به پایان رسید. آزمون به صورت خودکار ثبت شد.',
                icon: 'clock',
                confirmText: 'باشه',
                cancelText: '',
                type: 'danger'
            });
        }

        // محاسبه نمره
        let correct = 0;
        examData.questions.forEach((q, index) => {
            if (answers[index] === q.correct) {
                correct++;
            }
        });

        const score = Math.round((correct / total) * 100);
        const passed = score >= 60;

        // نمایش نتیجه
        showResult(correct, total, score, passed);

        // پاک کردن پیشرفت
        localStorage.removeItem(`exam_progress_${examData.id}`);

        // توقف تایمر
        clearInterval(timerInterval);
        isSubmitted = true;
    }

    // ============================================
    // 8. نمایش نتیجه
    // ============================================
    function showResult(correct, total, score, passed) {
        const container = document.querySelector('.exam-container');
        
        const resultHTML = `
            <div class="result-container active" id="resultContainer">
                <div class="result-icon ${passed ? 'pass' : 'fail'}">
                    <i class="bi ${passed ? 'bi-trophy' : 'bi-emoji-frown'}"></i>
                </div>
                <h2 class="result-title">${passed ? '🎉 تبریک!' : '💪 تلاش خوبی بود!'}</h2>
                <p class="result-subtitle">${passed ? 'آزمون رو با موفقیت قبول شدی!' : 'دفعه‌ی بعد حتماً بهتر میشه!'}</p>
                
                <div class="result-score">
                    <span class="score-number">${score}</span>
                    <span class="score-total">%</span>
                </div>
                
                <div class="result-details">
                    <div class="result-detail-item">
                        <div class="label">پاسخ صحیح</div>
                        <div class="value correct">${correct}</div>
                    </div>
                    <div class="result-detail-item">
                        <div class="label">پاسخ غلط</div>
                        <div class="value wrong">${total - correct}</div>
                    </div>
                    <div class="result-detail-item">
                        <div class="label">تعداد سوالات</div>
                        <div class="value">${total}</div>
                    </div>
                </div>
                
                <div class="result-actions">
                    <button class="btn-retry" onclick="location.reload()">
                        <i class="bi bi-arrow-counterclockwise"></i>
                        تلاش مجدد
                    </button>
                    <a href="student-dashboard.html" class="btn-back">
                        <i class="bi bi-house"></i>
                        بازگشت به داشبورد
                    </a>
                </div>
            </div>
        `;

        // مخفی کردن سوالات و نمایش نتیجه
        document.querySelector('.questions-container').style.display = 'none';
        document.querySelector('.exam-info-bar').style.display = 'none';
        document.querySelector('.exam-progress-bar').style.display = 'none';
        document.querySelector('.exam-actions').style.display = 'none';
        
        // اضافه کردن نتیجه
        container.insertAdjacentHTML('beforeend', resultHTML);
    }

    // ============================================
    // 9. رویدادها
    // ============================================
    prevBtn.addEventListener('click', function() {
        if (currentQuestion > 0) {
            showQuestion(currentQuestion - 1);
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentQuestion < examData.questions.length - 1) {
            showQuestion(currentQuestion + 1);
        } else {
            submitExam();
        }
    });

    submitBtn.addEventListener('click', function() {
        submitExam();
    });

    // ============================================
    // 10. اجرا
    // ============================================
    init();

    // بارگذاری پیشرفت قبلی (اگه وجود داشته باشه)
    setTimeout(() => {
        loadProgress();
    }, 100);

    console.log('📝 صفحه‌ی آزمون با موفقیت بارگذاری شد!');
});