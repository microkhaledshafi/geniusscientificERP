// ===============================
// Genius Scientific ERP
// billing.js
// ===============================

let invoiceItems = [];

document.addEventListener("DOMContentLoaded", () => {
    loadInvoiceCustomers();
});

function loadInvoiceCustomers() {

    const customerSelect = document.getElementById("invoiceCustomer");

    if (!customerSelect) return;

    customerSelect.innerHTML =
        '<option value="">Select Customer</option>';

    if (!window.customerCache) return;

    customerCache.forEach(c => {

        customerSelect.innerHTML += `
        <option value="${c.id}">
            ${c.name}
        </option>`;

    });

}

function addInvoiceRow() {

    const tbody = document.getElementById("invoiceBody");

    if (!tbody) return;

    let options = '<option value="">Select Product</option>';

    if (window.productCache) {

        productCache.forEach(p => {

            options += `
            <option value="${p.id}">
                ${p.product}
            </option>`;

        });

    }

    const row = tbody.insertRow();

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
class="total"
readonly>
</td>

<td>
<button onclick="removeInvoiceRow(this)">
Delete
</button>
</td>

`;

}

function removeInvoiceRow(btn){

    btn.parentElement.parentElement.remove();

    calculateInvoice();

}

function productChanged(select){

    const row = select.parentElement.parentElement;

    const product = productCache.find(
        p => Number(p.id) === Number(select.value)
    );

    if(!product) return;

    row.querySelector(".rate").value =
        Number(product.selling_rate || 0);

    row.querySelector(".gst").value =
        Number(product.gst || 0);

    calculateInvoice();

}

function calculateInvoice(){

    let subtotal = 0;

    let gstTotal = 0;

    document
        .querySelectorAll("#invoiceBody tr")
        .forEach(row=>{

            const qty =
                Number(row.cells[1].querySelector("input").value);

            const rate =
                Number(row.querySelector(".rate").value);

            const gst =
                Number(row.querySelector(".gst").value);

            const line =
                qty*rate;

            row.querySelector(".total").value =
                line.toFixed(2);

            subtotal += line;

            gstTotal +=
                line*gst/100;

        });

    const discount =
        Number(document.getElementById("invoiceDiscount").value||0);

    document.getElementById("subTotal").innerHTML =
        subtotal.toFixed(2);

    document.getElementById("gstTotal").innerHTML =
        gstTotal.toFixed(2);

    document.getElementById("grandTotal").innerHTML =
        (subtotal+gstTotal-discount).toFixed(2);

}

async function saveInvoice(){

    alert("Invoice Save will be connected after invoice table is created in Supabase.");

}

function printInvoice(){

    window.print();

}
