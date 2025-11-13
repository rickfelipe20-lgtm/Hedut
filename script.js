// Header transparente ao rolar
window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    if (window.scrollY > 20) header.style.background = "#ffffffee";
    else header.style.background = "#ffffffcc";
});
