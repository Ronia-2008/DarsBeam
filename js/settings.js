/* ===========================
   Settings Panel
=========================== */

const panel = document.getElementById("settingsPanel");

const gear = document.querySelector(".bi-gear-fill");

const close = document.getElementById("closeSettings");


if (gear && panel) {

    gear.closest("button").addEventListener("click", () => {

        panel.classList.add("active");

    });

}


if (close && panel) {

    close.addEventListener("click", () => {

        panel.classList.remove("active");

    });

}


/* ===========================
   Dark / Light Mode
=========================== */

const darkMode = document.getElementById("darkMode");

if (darkMode) {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {

        document.body.classList.add("light");

        darkMode.checked = true;

    } else {

        document.body.classList.remove("light");

        darkMode.checked = false;

    }


    darkMode.addEventListener("change", () => {

        document.body.classList.toggle(
            "light",
            darkMode.checked
        );

        localStorage.setItem(
            "theme",
            darkMode.checked ? "light" : "dark"
        );

    });

}


/* ===========================
   Theme Color
=========================== */

const colors = document.querySelectorAll(".theme-color");

const savedColor = localStorage.getItem("primaryColor");


if (savedColor) {

    document.documentElement.style.setProperty(
        "--primary",
        savedColor
    );

}


colors.forEach(color => {

    color.addEventListener("click", () => {

        const selected = color.dataset.color;

        document.documentElement.style.setProperty(
            "--primary",
            selected
        );

        localStorage.setItem(
            "primaryColor",
            selected
        );

    });

});