// ========================================
// Genius Scientific ERP
// billing.js
// ========================================

let invoiceItems = [];

window.addEventListener("load", () => {

    initialiseBilling();

});

async function initialiseBilling() {

    await loadInvoiceCustomers();

    generateInvoiceNumber();

    document.getElementById("invoiceDate").value =
        new Date().toISOString().split("T")[0];

}

async function loadInvoiceCustomers() {

    const { data, error } = await supabaseClient
        .from("Customers")
        .select("*")
        .order("customer_name");

    if (error) {

        console.error(error);

        return;

    }

    const select = document.getElementById("invoiceCustomer");

    select.innerHTML =
        '<option value="">Select Customer</option>';

    data.forEach(customer => {

        select.innerHTML += `
            <option value="${customer.id}">
                ${customer.customer_name}
            </option>
        `;

    });

}

function generateInvoiceNumber() {

    const invoiceNo =
        "INV-" + Date.now().toString().slice(-6);

    document.getElementById("invoiceNumber").value =
        invoiceNo;

}
