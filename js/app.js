//==========================================
// Genius Scientific ERP
// app.js
//==========================================

let currentPage = "dashboard";

//==========================================
// Show Pages
//==========================================

function showPage(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.style.display = "none";
    });

    const target = document.getElementById(page);

    if (!target) return;

    target.style.display = "block";

    currentPage = page;

    switch (page) {

        case "stock":

            if (typeof loadProducts === "function") {
                loadProducts();
            }

            break;

        case "customers":

            if (typeof loadCustomers === "function") {
                loadCustomers();
            }

            break;

        case "billing":

            if (typeof loadCustomers === "function") {
                loadCustomers();
            }

            if (typeof loadProducts === "function") {
                loadProducts();
            }

            if (typeof loadInvoiceCustomers === "function") {
                loadInvoiceCustomers();
            }

            if (typeof loadInvoiceProducts === "function") {
                loadInvoiceProducts();
            }

            break;

        case "payments":

            if (typeof loadCustomers === "function") {
                loadCustomers();
            }

            if (typeof loadPayments === "function") {
                loadPayments();
            }

            break;

        case "reports":

            if (typeof loadReports === "function") {
                loadReports();
            }

            break;

    }

}

//==========================================
// Toast Notification
//==========================================

function toast(message, color = "#198754") {

    let toastBox = document.getElementById("toast");

    if (!toastBox) {

        toastBox = document.createElement("div");

        toastBox.id = "toast";

        toastBox.style.position = "fixed";
        toastBox.style.right = "20px";
        toastBox.style.bottom = "20px";
        toastBox.style.padding = "12px 20px";
        toastBox.style.borderRadius = "8px";
        toastBox.style.color = "#fff";
        toastBox.style.fontWeight = "bold";
        toastBox.style.zIndex = "99999";
        toastBox.style.display = "none";

        document.body.appendChild(toastBox);

    }

    toastBox.style.background = color;
    toastBox.innerHTML = message;
    toastBox.style.display = "block";

    setTimeout(() => {

        toastBox.style.display = "none";

    }, 2500);

}

//==========================================
// Dashboard Refresh
//==========================================

async function refreshDashboard() {

    if (typeof loadProducts === "function") {

        await loadProducts();

    }

    if (typeof loadCustomers === "function") {

        await loadCustomers();

    }

}

//==========================================
// Application Start
//==========================================

document.addEventListener("DOMContentLoaded", async () => {

    showPage("dashboard");

    if (typeof testConnection === "function") {

        await testConnection();

    }

    await refreshDashboard();

});
