//======================================
// Genius Scientific ERP
// Billing Module
//======================================

let invoiceItems = [];

function initialiseBilling() {

    loadInvoiceCustomers();

    document.getElementById("invoiceDate").value =
        new Date().toISOString().substring(0,10);

}

function loadInvoiceCustomers() {

    const ddl = document.getElementById("invoiceCustomer");

    if (!ddl) return;

    ddl.innerHTML = '<option value="">Select Customer</option>';

    if (!Array.isArray(customerCache)) return;

    customerCache.forEach(customer => {

        ddl.innerHTML += `
            <option value="${customer.id}">
                ${customer.name}
            </option>
        `;

    });

}
function addInvoiceRow(){

    const body =
        document.getElementById("invoiceBody");

    if(!body) return;

    let options =
    '<option value="">Select Product</option>';

    if(typeof productCache!=="undefined"){

        productCache.forEach(p=>{

            options += `
            <option value="${p.id}">
                ${p.product}
            </option>`;

        });

    }

    const row = body.insertRow();

    row.innerHTML = `

<td>

<select onchange="productChanged(this)">

${options}

</select>

</td>

<td>

<input
type="number"
value="1"
min="1"
oninput="calculateInvoice()">

</td>

<td>

<input
type="number"
class="rate"
readonly>

</td>

<td>

<input
type="number"
class="gst"
readonly>

</td>

<td>

<input
type="number"
class="lineTotal"
readonly>

</td>

<td>

<button
type="button"
onclick="removeInvoiceRow(this)">

Delete

</button>

</td>

`;

}
//======================================
// Product Selection
//======================================

function productChanged(select){

    const row = select.closest("tr");

    const id = Number(select.value);

    if(typeof productCache==="undefined") return;

    const product = productCache.find(p=>Number(p.id)===id);

    if(!product) return;

    row.querySelector(".rate").value =
        Number(product.selling_rate || 0);

    row.querySelector(".gst").value =
        Number(product.gst || 0);

    calculateInvoice();

}

//======================================
// Remove Row
//======================================

function removeInvoiceRow(button){

    button.closest("tr").remove();

    calculateInvoice();

}

//======================================
// Invoice Calculation
//======================================

function calculateInvoice(){

    let subTotal = 0;

    let gstTotal = 0;

    document.querySelectorAll("#invoiceBody tr")
    .forEach(row=>{

        const qty = Number(
            row.cells[1].querySelector("input").value || 0
        );

        const rate = Number(
            row.querySelector(".rate").value || 0
        );

        const gst = Number(
            row.querySelector(".gst").value || 0
        );

        const amount = qty * rate;

        const gstAmount = amount * gst / 100;

        row.querySelector(".lineTotal").value =
            (amount + gstAmount).toFixed(2);

        subTotal += amount;

        gstTotal += gstAmount;

    });

    const discount = Number(
        document.getElementById("invoiceDiscount").value || 0
    );

    document.getElementById("subTotal").innerText =
        subTotal.toFixed(2);

    document.getElementById("gstTotal").innerText =
        gstTotal.toFixed(2);

    document.getElementById("grandTotal").innerText =
        (subTotal + gstTotal - discount).toFixed(2);

}
//======================================
// Save Invoice (Placeholder)
//======================================

async function saveInvoice() {

    if (!supabaseClient) {
        alert("Supabase not connected.");
        return;
    }

    const customerId = document.getElementById("invoiceCustomer").value;

    if (customerId === "") {
        alert("Select Customer");
        return;
    }

    if (document.querySelectorAll("#invoiceBody tr").length === 0) {
        alert("Add at least one product");
        return;
    }

    alert("Invoice module is ready.\nNext step is connecting the invoices table in Supabase.");

}

//======================================
// Print Invoice
//======================================

function printInvoice() {

    window.print();

}

//======================================
// Auto Initialize Billing
//======================================

document.addEventListener("DOMContentLoaded", async () => {

    if (document.getElementById("invoiceDate")) {
        document.getElementById("invoiceDate").value =
            new Date().toISOString().split("T")[0];
    }

    if (typeof loadInvoiceCustomers === "function") {
        loadInvoiceCustomers();
    }

});

    if (typeof loadProducts === "function") {

        loadProducts();

    }

});

//======================================
// Refresh Customer Dropdown
//======================================

function refreshInvoiceCustomers() {

    if (typeof loadInvoiceCustomers === "function") {

        loadInvoiceCustomers();

    }

}
