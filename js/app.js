// Genius Scientific ERP v5.0

function showPage(pageId) {

    // Hide all pages
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    // Show selected page
    document.getElementById(pageId).style.display = "block";

}

// Default page
window.onload = function () {

    showPage("dashboard");

};
