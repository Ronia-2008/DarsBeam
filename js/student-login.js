// ============================================
// student-login.js
// مدیریت فرم ورود دانش‌آموز و چشمک
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== چشمک (نمایش/مخفی کردن رمز) =====
    const toggleBtn = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('studentPassword');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'bi bi-eye-slash';
            } else {
                passwordInput.type = 'password';
                icon.className = 'bi bi-eye';
            }
        });
    }
});


/* ===========================
   Student Login
=========================== */

const loginForm =
    document.querySelector(".student-login-box form");

const emailInput =
    document.getElementById("studentEmail");

const loginButton =
    document.querySelector(".student-login-btn");


if (loginForm && emailInput && passwordInput && loginButton) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();


        /* ===========================
           Get Values
        =========================== */

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value.trim();


        /* ===========================
           Validation
        =========================== */

        if (email === "" || password === "") {

            showMessage(
                "لطفاً همه فیلدها را کامل کنید.",
                "error"
            );

            return;

        }


        /* ===========================
           Loading
        =========================== */

        loginButton.disabled = true;

        loginButton.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            در حال ورود...
        `;


        /* ===========================
           Fake Login
        =========================== */

        setTimeout(function() {

            showMessage(
                "ورود با موفقیت انجام شد! 🎉",
                "success"
            );


            loginButton.disabled = false;

            loginButton.innerHTML = `
                ورود به حساب
                <i class="bi bi-arrow-left"></i>
            `;

        }, 1500);

    });

}


/* ===========================
   Message
=========================== */

function showMessage(text, type) {

    let message =
        document.querySelector(".login-message");


    if (!message) {

        message =
            document.createElement("div");

        message.className =
            "login-message";

        loginForm.appendChild(message);

    }


    message.textContent = text;

    message.className =
        "login-message " + type;

}