/* ===========================
   Teacher Login
=========================== */

const teacherForm = document.querySelector("form");

const teacherEmail = document.getElementById("teacherEmail");

const teacherPassword = document.getElementById("teacherPassword");

const passwordToggle = document.querySelector(".password-toggle");

const loginButton = document.querySelector(".teacher-login-btn");


/* ===========================
   Show / Hide Password
=========================== */

passwordToggle.addEventListener("click", () => {

    if (teacherPassword.type === "password") {

        teacherPassword.type = "text";

        passwordToggle.innerHTML =
            '<i class="bi bi-eye-slash"></i>';

    } else {

        teacherPassword.type = "password";

        passwordToggle.innerHTML =
            '<i class="bi bi-eye"></i>';

    }

});


/* ===========================
   Teacher Login
=========================== */

teacherForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const email = teacherEmail.value.trim();

    const password = teacherPassword.value.trim();


    /* Validation */

    if (!email || !password) {

        showMessage(
            "لطفاً شماره موبایل یا ایمیل و رمز عبور را وارد کنید.",
            "error"
        );

        return;

    }


    /* Loading */

    loginButton.disabled = true;

    loginButton.innerHTML = `
        <span class="spinner-border spinner-border-sm"></span>
        در حال ورود...
    `;


    /* Temporary Login */

    setTimeout(() => {

        window.location.href =
            "teacher-dashboard.html";

    }, 800);

});


/* ===========================
   Message
=========================== */

function showMessage(message, type) {

    let messageBox =
        document.querySelector(".login-message");


    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.className =
            "login-message";

        teacherForm.appendChild(messageBox);

    }


    messageBox.textContent = message;

    messageBox.className =
        `login-message ${type}`;

}