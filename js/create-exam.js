/* ===========================
   Create Exam
=========================== */

const nextToQuestions =
    document.getElementById("nextToQuestions");

const examFormCard =
    document.querySelector(".exam-form-card");

const questionsSection =
    document.getElementById("questionsSection");

const questionsContainer =
    document.getElementById("questionsContainer");

const addQuestionBtn =
    document.getElementById("addQuestionBtn");

const backToInfo =
    document.getElementById("backToInfo");
    
    const reviewExamBtn =
    document.getElementById("reviewExamBtn");

const reviewSection =
    document.getElementById("reviewSection");

const reviewQuestions =
    document.getElementById("reviewQuestions");

const editQuestionsBtn =
    document.getElementById("editQuestionsBtn");

const saveExamBtn =
    document.getElementById("saveExamBtn");

/* ===========================
   Exam Information
=========================== */

nextToQuestions.addEventListener("click", () => {

    const title =
        document.getElementById("examTitle").value.trim();

    const subject =
        document.getElementById("examSubject").value;

    const grade =
        document.getElementById("examGrade").value;

    const duration =
        document.getElementById("examDuration").value;

    const difficulty =
        document.getElementById("examDifficulty").value;


    if (
        !title ||
        !subject ||
        !grade ||
        !duration ||
        !difficulty
    ) {

        alert(
            "لطفاً تمام اطلاعات اصلی آزمون را وارد کن."
        );

        return;

    }


    examFormCard.style.display = "none";

    questionsSection.classList.add("active");


    if (
        questionsContainer.children.length === 0
    ) {

        addQuestion();

    }

});


/* ===========================
   Back To Information
=========================== */

backToInfo.addEventListener("click", () => {

    questionsSection.classList.remove("active");

    examFormCard.style.display = "block";

});


/* ===========================
   Add Question
=========================== */

addQuestionBtn.addEventListener("click", () => {

    addQuestion();

});


function addQuestion() {

    const questionNumber =
        questionsContainer.children.length + 1;


    const questionHTML = `

        <div class="question-card">

            <div class="question-card-header">

                <h3>

                    <span class="question-number">

                        ${questionNumber}

                    </span>

                    سؤال ${questionNumber}

                </h3>


                <button
                    type="button"
                    class="delete-question">

                    <i class="bi bi-trash"></i>

                </button>

            </div>


            <!-- Question -->

            <div class="question-field">

                <label>

                    متن سؤال

                </label>


                <textarea
                    class="question-text"
                    rows="4"
                    placeholder="سؤال خود را اینجا بنویس..."></textarea>

            </div>


            <!-- Options -->

            <div class="options-title">

                گزینه‌ها

            </div>


            <div class="options-grid">


                <label class="option-item">

                    <input
                        type="radio"
                        name="correct-${questionNumber}">

                    <span class="option-letter">

                        الف

                    </span>


                    <input
                        type="text"
                        placeholder="گزینه اول">

                </label>


                <label class="option-item">

                    <input
                        type="radio"
                        name="correct-${questionNumber}">

                    <span class="option-letter">

                        ب

                    </span>


                    <input
                        type="text"
                        placeholder="گزینه دوم">

                </label>


                <label class="option-item">

                    <input
                        type="radio"
                        name="correct-${questionNumber}">

                    <span class="option-letter">

                        ج

                    </span>


                    <input
                        type="text"
                        placeholder="گزینه سوم">

                </label>


                <label class="option-item">

                    <input
                        type="radio"
                        name="correct-${questionNumber}">

                    <span class="option-letter">

                        د

                    </span>


                    <input
                        type="text"
                        placeholder="گزینه چهارم">

                </label>


            </div>


            <p class="correct-answer-text">

                <i class="bi bi-check-circle"></i>

                پاسخ صحیح را با انتخاب دایره کنار گزینه مشخص کن.

            </p>


        </div>

    `;


    questionsContainer.insertAdjacentHTML(
        "beforeend",
        questionHTML
    );

/* ===========================
   Review Exam
=========================== */

reviewExamBtn.addEventListener("click", () => {

    const questionCards =
        document.querySelectorAll(".question-card");


    if (questionCards.length === 0) {

        alert(
            "حداقل یک سؤال اضافه کن."
        );

        return;

    }


    for (const question of questionCards) {

        const questionText =
            question.querySelector(".question-text")
            .value
            .trim();


        const options =
            question.querySelectorAll(
                '.option-item input[type="text"]'
            );


        const correctAnswer =
            question.querySelector(
                'input[type="radio"]:checked'
            );


        if (!questionText) {

            alert(
                "لطفاً متن همه سؤال‌ها را وارد کن."
            );

            return;

        }


        for (const option of options) {

            if (!option.value.trim()) {

                alert(
                    "لطفاً همه گزینه‌ها را کامل کن."
                );

                return;

            }

        }


        if (!correctAnswer) {

            alert(
                "برای هر سؤال پاسخ صحیح را انتخاب کن."
            );

            return;

        }

    }


    showExamReview();

});
    updateQuestionNumbers();

}


/* ===========================
   Delete Question
=========================== */

questionsContainer.addEventListener(
    "click",
    (event) => {

        const deleteButton =
            event.target.closest(".delete-question");


        if (!deleteButton) {

            return;

        }


        const questionCard =
            deleteButton.closest(".question-card");


        questionCard.remove();


        updateQuestionNumbers();

    }
);


/* ===========================
   Update Question Numbers
=========================== */

function updateQuestionNumbers() {

    const questions =
        document.querySelectorAll(".question-card");


    questions.forEach(
        (question, index) => {

            const number =
                index + 1;


            question.querySelector(
                ".question-number"
            ).textContent = number;


            question.querySelector(
                "h3"
            ).lastChild.textContent =
                ` سؤال ${number}`;


            question.querySelectorAll(
                'input[type="radio"]'
            ).forEach(radio => {

                radio.name =
                    `correct-${number}`;

            });

        }
    );

}
function showExamReview() {

    const title =
        document.getElementById("examTitle").value;

    const subject =
        document.getElementById("examSubject").value;

    const grade =
        document.getElementById("examGrade").value;

    const duration =
        document.getElementById("examDuration").value;

    const difficulty =
        document.getElementById("examDifficulty").value;


    document.getElementById(
        "reviewTitle"
    ).textContent = title;


    document.getElementById(
        "reviewSubject"
    ).textContent = subject;


    document.getElementById(
        "reviewGrade"
    ).textContent = grade;


    document.getElementById(
        "reviewDuration"
    ).textContent = duration;


    document.getElementById(
        "reviewDifficulty"
    ).textContent = difficulty;


    document.getElementById(
        "reviewQuestionCount"
    ).textContent =
        `${questionsContainer.children.length} سؤال`;


    reviewQuestions.innerHTML = "";


    const questionCards =
        document.querySelectorAll(".question-card");


    questionCards.forEach(
        (question, index) => {

            const questionText =
                question.querySelector(".question-text")
                .value;


            const options =
                question.querySelectorAll(
                    '.option-item input[type="text"]'
                );


            const correctIndex =
                Array.from(
                    question.querySelectorAll(
                        'input[type="radio"]'
                    )
                ).findIndex(
                    radio => radio.checked
                );


            const letters =
                ["الف", "ب", "ج", "د"];


            let optionsHTML = "";


            options.forEach(
                (option, optionIndex) => {

                    const correctClass =
                        optionIndex === correctIndex
                            ? "correct"
                            : "";


                    optionsHTML += `

                        <div
                            class="review-option ${correctClass}">

                            ${letters[optionIndex]}.
                            ${option.value}

                        </div>

                    `;

                }
            );


            reviewQuestions.innerHTML += `

                <div class="review-question">

                    <div class="review-question-title">

                        <span
                            class="review-question-number">

                            سؤال ${index + 1}

                        </span>

                        <span>

                            ${questionText}

                        </span>

                    </div>


                    <div class="review-options">

                        ${optionsHTML}

                    </div>

                </div>

            `;

        }
    );


    questionsSection.classList.remove("active");

    reviewSection.classList.add("active");

}
/* ===========================
   Edit Questions
=========================== */

editQuestionsBtn.addEventListener("click", () => {

    reviewSection.classList.remove("active");

    questionsSection.classList.add("active");

});
/* ===========================
   Save Exam
=========================== */

saveExamBtn.addEventListener("click", () => {

    const questions = [];


    document
        .querySelectorAll(".question-card")
        .forEach(question => {

            const questionText =
                question.querySelector(".question-text")
                .value
                .trim();


            const options = Array.from(
                question.querySelectorAll(
                    '.option-item input[type="text"]'
                )
            ).map(option => option.value.trim());


            const correctIndex = Array.from(
                question.querySelectorAll(
                    'input[type="radio"]'
                )
            ).findIndex(
                radio => radio.checked
            );


            questions.push({

                question:questionText,

                options:options,

                correctAnswer:correctIndex

            });

        });


    const exam = {

        id:Date.now(),

        title:
            document.getElementById("examTitle")
            .value
            .trim(),

        subject:
            document.getElementById("examSubject")
            .value,

        grade:
            document.getElementById("examGrade")
            .value,

        duration:
            document.getElementById("examDuration")
            .value,

        difficulty:
            document.getElementById("examDifficulty")
            .value,

        description:
            document.getElementById("examDescription")
            .value
            .trim(),

        questions:questions

    };


    const savedExams =
        JSON.parse(
            localStorage.getItem("teacherExams")
        ) || [];


    savedExams.push(exam);


    localStorage.setItem(
        "teacherExams",
        JSON.stringify(savedExams)
    );


    saveExamBtn.disabled = true;

    saveExamBtn.innerHTML = `
        <span
            class="spinner-border spinner-border-sm">
        </span>

        در حال ذخیره...
    `;


    setTimeout(() => {

        window.location.href =
            "teacher-dashboard.html";

    }, 700);

});
