document.addEventListener("mousemove", (e) => {

    document.body.style.setProperty(
        "--mouseX",
        e.clientX + "px"
    );

    document.body.style.setProperty(
        "--mouseY",
        e.clientY + "px"
    );

});
const navbar = document.querySelector(".custom-navbar");

window.addEventListener("scroll",()=>{

    if(window.scrollY>80){

        navbar.classList.add("scrolled");

    }else{

        navbar.classList.remove("scrolled");

    }

});
import "./settings.js";