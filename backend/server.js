
const express = require("express");

const app = express();
const PORT = 3000;

// ===========================
// تنظیمات اولیه سرور
// ===========================

app.use(express.json({ limit: "100kb" }));

// ===========================
// ذخیره موقت آزمون‌ها
// ===========================

let exams = [];
let nextExamId = 1;

// ===========================
// صفحه اصلی API
// ===========================

app.get("/", (req, res) => {
    res.json({
        message: "به بک‌اند DarsBeam خوش آمدی! 🚀",
        status: "running",
        version: "1.0.0"
    });
});

// ===========================
// بررسی سلامت سرور
// ===========================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "سرور DarsBeam سالم است."
    });
});

// ===========================
// دریافت فهرست آزمون‌ها
// ===========================

app.get("/api/exams", (req, res) => {
    res.json({
        success: true,
        count: exams.length,
        data: exams
    });
});

// ===========================
// دریافت یک آزمون
// ===========================

app.get("/api/exams/:id", (req, res) => {
    const id = Number(req.params.id);

    const exam = exams.find(item => item.id === id);

    if (!exam) {
        return res.status(404).json({
            success: false,
            message: "آزمون موردنظر پیدا نشد."
        });
    }

    res.json({
        success: true,
        data: exam
    });
});

// ===========================
// ساخت آزمون جدید
// ===========================

app.post("/api/exams", (req, res) => {
    const {
        title,
        subject,
        grade,
        duration,
        difficulty,
        description,
        questions
    } = req.body;

    if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof subject !== "string" ||
        !subject.trim() ||
        !Array.isArray(questions)
    ) {
        return res.status(400).json({
            success: false,
            message: "عنوان، درس و فهرست سؤال‌ها الزامی هستند."
        });
    }

    const exam = {
        id: nextExamId++,
        title: title.trim(),
        subject: subject.trim(),
        grade: grade ?? null,
        duration: duration ?? null,
        difficulty: difficulty ?? "متوسط",
        description: description ?? "",
        questions,
        createdAt: new Date().toISOString()
    };

    exams.push(exam);

    res.status(201).json({
        success: true,
        message: "آزمون با موفقیت ایجاد شد.",
        data: exam
    });
});

// ===========================
// حذف آزمون
// ===========================

app.delete("/api/exams/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = exams.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "آزمون موردنظر پیدا نشد."
        });
    }

    exams.splice(index, 1);

    res.json({
        success: true,
        message: "آزمون با موفقیت حذف شد."
    });
});

// ===========================
// مدیریت مسیرهای ناموجود
// ===========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "مسیر موردنظر پیدا نشد."
    });
});

// ===========================
// اجرای سرور
// ===========================

app.listen(PORT, () => {
    console.log(
        `DarsBeam Backend running at http://localhost:${PORT}`
    );
});
