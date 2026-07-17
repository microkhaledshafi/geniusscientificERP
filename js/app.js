// ========================================
// Genius Scientific ERP v7
// app.js
// ========================================

let currentPage = "dashboard";

function showPage(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.style.display = "none";
    });

    const target = document.getElementById(page);

    if (target) {
        target.style.display = "block";
        currentPage = page;
    }

}

function toast(message, color = "#198754") {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        toast.style.position = "fixed";
        toast.style.right = "20px";
        toast.style.bottom = "20px";
        toast.style.padding = "12px 20px";
        toast.style.borderRadius = "8px";
        toast.style.color = "#fff";
        toast.style.fontWeight = "bold";
        toast.style.zIndex = "9999";

        document.body.appendChild(toast);

    }

    toast.style.background = color;
    toast.innerText = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);

}

window.addEventListener("load", () => {

    showPage("dashboard");

});
