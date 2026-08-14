// ============================================
// exam-detail.js - نسخه ساده و مطمئن
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // داده‌های نمونه
    // ============================================
    const examData = {
        id: 1,
        title: 'آزمون ریاضی فصل اول',
        subject: 'ریاضی',
        difficulty: 'متوسط',
        timeLimit: 15,
        questions: [
            { id: 1, text: '۵ × (۳ + ۲) چند است؟', options: ['۱۰', '۱۵', '۲۰', '۲۵'], correct: 3 },
            { id: 2, text: 'مساحت مربع به ضلع ۴؟', options: ['۸', '۱۲', '۱۶', '۲۰'], correct: 2 },
            { id: 3, text: 'کدام عدد بزرگ‌تر است؟', options: ['۰.۵', '۰.۰۵', '۰.۵۵', '۰.۵۰۵'], correct: 2 },
            { id: 4, text: '۱۲ ÷ ۴ چند است؟', options: ['۲', '۳', '۴', '۶'], correct: 1 },
            { id: 5, text: 'محیط مستطیل ۸ و ۵؟', options: ['۱۳', '۲۶', '۴۰', '۲۰'], correct: 1 }
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
    let timeLeft = examData.timeLimit * 60;
    let isSubmitted = false;

    // ============================================
    // 1. مقداردهی
    // ============================================
    function init() {
        // تنظیم عنوان و اطلاعات
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

        console.log('📝 صفحه آزمون مقداردهی شد!');
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
                optionsHTML += `
                    <label class="option-item">
                        <input type="radio" name="question_${index}" value="${optIndex}">
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
                    div.classList.add('answered');
                    updateStats();
                    updateProgress();
                });
            });
        });

        console.log('✅ سوالات رندر شدند! تعداد:', examData.questions.length);
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

        prevBtn.disabled = index === 0;
        
        if (index === examData.questions.length - 1) {
            nextBtn.textContent = 'پایان';
            nextBtn.innerHTML = 'پایان <i class="bi bi-check-lg"></i>';
        } else {
            nextBtn.textContent = 'بعدی';
            nextBtn.innerHTML = 'بعدی <i class="bi bi-arrow-left"></i>';
        }
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
    // 5. آمار
    // ============================================
    function updateStats() {
        const answered = Object.keys(answers).length;
        answeredEl.textContent = answered + ' پاسخ داده شده';
        updateProgress();
    }

    function updateProgress() {
        const total = examData.questions.length;
        const answered = Object.keys(answers).length;
        const percent = Math.round((answered / total) * 100);
        progressFill.style.width = percent + '%';
        progressText.textContent = percent + '%';
    }

    // ============================================
    // 6. ثبت آزمون
    // ============================================
    async function submitExam(auto = false) {
        if (isSubmitted) return;

        const total = examData.questions.length;
        const answered = Object.keys(answers).length;

        if (!auto && answered < total) {
            const confirm = await darsbeamConfirm({
                title: '⚠️ هنوز کامل نکردی!',
                text: `از ${total} سؤال، فقط ${answered} تا رو پاسخ دادی.`,
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
                text: 'آزمون به صورت خودکار ثبت شد.',
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

        // ذخیره نتیجه
        const examResult = {
            examId: examData.id,
            examTitle: examData.title,
            score: score,
            correct: correct,
            total: total,
            passed: passed,
            date: new Date().toISOString()
        };

        const results = JSON.parse(localStorage.getItem('darsbeam_exam_results')) || [];
        results.push(examResult);
        localStorage.setItem('darsbeam_exam_results', JSON.stringify(results));

        // ===== ثبت در سیستم جایزه =====
        try {
            if (typeof darsbeamRewards !== 'undefined' && darsbeamRewards) {
                darsbeamRewards.logExam({
                    examTitle: examData.title,
                    score: score,
                    totalQuestions: total,
                    correctAnswers: correct
                });
                console.log('✅ ثبت در سیستم جایزه انجام شد!');
            } else {
                console.warn('⚠️ سیستم جایزه در دسترس نیست');
            }
        } catch (e) {
            console.error('❌ خطا در ثبت جایزه:', e);
        }

        // نمایش نتیجه
        showResult(correct, total, score, passed);
        clearInterval(timerInterval);
        isSubmitted = true;
    }

    // ============================================
    // 7. نمایش نتیجه
    // ============================================
    function showResult(correct, total, score, passed) {
        document.getElementById('resultIcon').textContent = passed ? '🏆' : '💪';
        document.getElementById('resultTitle').textContent = passed ? '🎉 تبریک!' : '💪 تلاش خوبی بود!';
        document.getElementById('resultSubtitle').textContent = passed ? 'آزمون رو قبول شدی!' : 'دفعه بعد بهتر میشه!';
        document.getElementById('resultScore').textContent = score + '%';
        document.getElementById('resultCorrect').textContent = correct;
        document.getElementById('resultWrong').textContent = total - correct;

        // مخفی کردن سوالات
        document.querySelector('.questions-container').style.display = 'none';
        document.querySelector('.exam-info-bar').style.display = 'none';
        document.querySelector('.exam-progress-bar').style.display = 'none';
        document.querySelector('.exam-actions').style.display = 'none';
        document.querySelector('.exam-timer').style.display = 'none';

        // نمایش نتیجه
        document.getElementById('resultContainer').classList.add('active');
    }

    // ============================================
    // 8. رویدادها
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
    // 9. اجرا
    // ============================================
    init();

    console.log('📝 صفحه آزمون با موفقیت بارگذاری شد!');
});