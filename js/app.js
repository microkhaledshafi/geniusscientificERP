// ==========================================
// Genius Scientific ERP
// app.js
// ==========================================

// Current active page
let currentPage = "dashboard";

// ==========================================
// Navigation
// ==========================================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page)
        page.classList.add("active");

    currentPage = pageId;

}

// ==========================================
// Dashboard
// ==========================================

async function loadDashboard() {

    if (!isSupabaseReady()) return;

    try {

        await loadDashboardProducts();
        await loadDashboardCustomers();
        await loadDashboardInvoices();

    }

    catch (err) {

        console.error(err);

    }

}

// ==========================================
// Product Count
// ==========================================

async function loadDashboardProducts() {

    const { count, error } = await supabaseClient

        .from("products")

        .select("*", {
            count: "exact",
            head: true
        });

    if (!error)

        document.getElementById("totalProducts").innerText = count || 0;

}

// ==========================================
// Customer Count
// ==========================================

async function loadDashboardCustomers() {

    const { count, error } = await supabaseClient

        .from("customers")

        .select("*", {
            count: "exact",
            head: true
        });

    if (!error)

        document.getElementById("totalCustomers").innerText = count || 0;

}

// ==========================================
// Invoice Statistics
// ==========================================

async function loadDashboardInvoices() {

    const todayDate = today();

    const { data, error } = await supabaseClient

        .from("invoice")

        .select("*");

    if (error) return;

    let todaySales = 0;
    let todayInvoices = 0;
    let outstanding = 0;
    let monthlySales = 0;

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    data.forEach(inv => {

        const invoiceDate = new Date(inv.date);

        if (inv.date === todayDate) {

            todayInvoices++;

            todaySales += Number(inv.grand_total || 0);

        }

        if (

            invoiceDate.getMonth() + 1 === month &&
            invoiceDate.getFullYear() === year

        ) {

            monthlySales += Number(inv.grand_total || 0);

        }

        outstanding += Number(inv.balance || 0);

    });

    document.getElementById("todaySales").innerText =
        money(todaySales);

    document.getElementById("todayInvoices").innerText =
        todayInvoices;

    document.getElementById("monthlySales").innerText =
        money(monthlySales);

    document.getElementById("outstanding").innerText =
        money(outstanding);

}

// ==========================================
// Recent Activity
// ==========================================

function addActivity(activity) {

    const body = document.getElementById("activityBody");

    if (!body) return;

    if (body.innerText.includes("No recent")) {

        body.innerHTML = "";

    }

    const row = document.createElement("tr");

    row.innerHTML = `

        <td>${today()}</td>

        <td>${activity}</td>

        <td>Admin</td>

    `;

    body.prepend(row);

}

// ==========================================
// Toast Notification
// ==========================================

function notify(message) {

    alert(message);

}

// ==========================================
// Loading
// ==========================================

function showLoader() {

    console.log("Loading...");

}

function hideLoader() {

    console.log("Done");

}

// ==========================================
// Refresh Dashboard
// ==========================================

async function refreshDashboard() {

    await loadDashboard();

}

// ==========================================
// Set Today's Date
// ==========================================

function initialiseDates() {

    const todayValue = today();

    if (document.getElementById("invoiceDate"))

        document.getElementById("invoiceDate").value = todayValue;

    if (document.getElementById("purchaseDate"))

        document.getElementById("purchaseDate").value = todayValue;

    if (document.getElementById("paymentDate"))

        document.getElementById("paymentDate").value = todayValue;

}

// ==========================================
// Start
// ==========================================

window.addEventListener("load", () => {

    initialiseDates();

    showPage("dashboard");

});
