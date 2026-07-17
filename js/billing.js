//==========================================
// Genius Scientific ERP
// billing.js
// Part 1
//==========================================

let invoiceItems = [];

//==========================================
// Billing Initialization
//==========================================

function initialiseBilling() {

    const dateBox = document.getElementById("invoiceDate");

    if (dateBox) {

        dateBox.value = new Date()
            .toISOString()
            .split("T")[0];

    }

    invoiceItems = [];

    const tbody = document.getElementById("invoiceBody");

    if (tbody) {

        tbody.innerHTML = "";

    }

    addInvoiceRow();

    calculateInvoice();

}

//==========================================
// Load Customer Dropdown
//==========================================

function loadInvoiceCustomers() {

    const customerSelect =
        document.getElementById("invoiceCustomer");

    if (!customerSelect) return;

    customerSelect.innerHTML =
        `<option value="">Select Customer</option>`;

    customerCache.forEach(customer => {

        customerSelect.innerHTML += `

<option value="${customer.name}">

${customer.name}

</option>

`;

    });

}

//==========================================
// Load Products into Invoice Row
//==========================================

function loadInvoiceProducts(select) {

    if (!select) return;

    const current = select.value;

    select.innerHTML =
        `<option value="">Select Product</option>`;

    productCache.forEach(product => {

        select.innerHTML += `

<option value="${product.product}">

${product.product}

</option>

`;

    });

    select.value = current;

}

//==========================================
// Add Invoice Row
//==========================================

function addInvoiceRow() {

    const tbody = document.getElementById("invoiceBody");

    if (!tbody) return;

    const row = document.createElement("tr");

    row.innerHTML = `

<td>

<select class="invoiceProduct">

<option value="">Select Product</option>

</select>

</td>

<td>

<input
type="number"
class="invoiceQty"
value="1"
min="1">

</td>

<td>

<input
type="number"
class="invoiceRate"
readonly>

</td>

<td>

<input
type="number"
class="invoiceGST"
readonly>

</td>

<td>

<input
type="number"
class="invoiceTotal"
readonly>

</td>

<td>

<button
type="button"
onclick="removeInvoiceRow(this)">

Remove

</button>

</td>

`;

    tbody.appendChild(row);

    const productSelect =
        row.querySelector(".invoiceProduct");

    loadInvoiceProducts(productSelect);

    productSelect.addEventListener(
        "change",
        () => productChanged(productSelect)
    );

    row.querySelector(".invoiceQty")
        .addEventListener(
            "input",
            () => calculateInvoice()
        );

}

//==========================================
// Product Changed
//==========================================

function productChanged(select) {

    const row = select.closest("tr");

    const product = getProductByName(select.value);

    if (!product) {

        row.querySelector(".invoiceRate").value = "";

        row.querySelector(".invoiceGST").value = "";

        row.querySelector(".invoiceTotal").value = "";

        calculateInvoice();

        return;

    }

    row.querySelector(".invoiceRate").value =
        Number(product.selling_rate || 0).toFixed(2);

    row.querySelector(".invoiceGST").value =
        Number(product.gst || 0).toFixed(2);

    calculateInvoice();

}

//==========================================
// Remove Invoice Row
//==========================================

function removeInvoiceRow(button) {

    const tbody = document.getElementById("invoiceBody");

    if (!tbody) return;

    if (tbody.rows.length === 1) {

        alert("At least one product is required.");

        return;

    }

    button.closest("tr").remove();

    calculateInvoice();

}

//==========================================
// Calculate Invoice
//==========================================

function calculateInvoice() {

    let subtotal = 0;

    let gstTotal = 0;

    document
        .querySelectorAll("#invoiceBody tr")
        .forEach(row => {

            const qty = Number(
                row.querySelector(".invoiceQty").value || 0
            );

            const rate = Number(
                row.querySelector(".invoiceRate").value || 0
            );

            const gst = Number(
                row.querySelector(".invoiceGST").value || 0
            );

            const amount = qty * rate;

            const gstAmount = amount * gst / 100;

            row.querySelector(".invoiceTotal").value =
                (amount + gstAmount).toFixed(2);

            subtotal += amount;

            gstTotal += gstAmount;

        });

    const discount = Number(

        document.getElementById("invoiceDiscount")?.value || 0

    );

    const grandTotal = subtotal + gstTotal - discount;

    document.getElementById("subTotal").textContent =
        subtotal.toFixed(2);

    document.getElementById("gstTotal").textContent =
        gstTotal.toFixed(2);

    document.getElementById("grandTotal").textContent =
        grandTotal.toFixed(2);

}

//==========================================
// Generate Invoice Number
//==========================================

function generateInvoiceNumber() {

    const now = new Date();

    return "INV-" +
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        "-" +
        Date.now();

}

//==========================================
// Save Invoice
//==========================================

async function saveInvoice() {

    if (!isSupabaseReady()) return;

    const customer =
        document.getElementById("invoiceCustomer").value;

    if (customer === "") {

        toast("Select Customer", "#dc3545");

        return;

    }

    const rows =
        document.querySelectorAll("#invoiceBody tr");

    if (rows.length === 0) {

        toast("Add at least one product", "#dc3545");

        return;

    }

    const invoiceNumber = generateInvoiceNumber();

    const invoiceDate =
        document.getElementById("invoiceDate").value;

    const discount =
        Number(document.getElementById("invoiceDiscount").value || 0);

    const gst =
        Number(document.getElementById("gstTotal").textContent || 0);

    const grandTotal =
        Number(document.getElementById("grandTotal").textContent || 0);

    //----------------------------------
    // Save Invoice Header
    //----------------------------------

    const { error: invoiceError } = await supabaseClient

        .from("Invoice")

        .insert([{

            invoice_number: invoiceNumber,

            customer: customer,

            date: invoiceDate,

            discount: discount,

            gst: gst,

            grand_total: grandTotal,

            paid_amount: 0,

            balance: grandTotal,

            status: "Pending",

            remarks: "",

            created_at: new Date().toISOString()

        }]);

    if (invoiceError) {

        console.error(invoiceError);

        toast(invoiceError.message, "#dc3545");

        return;

    }

    //----------------------------------
    // Save Invoice Items
    //----------------------------------

    const items = [];

    rows.forEach(row => {

        items.push({

            invoice_number: invoiceNumber,

            product:
                row.querySelector(".invoiceProduct").value,

            quantity:
                Number(row.querySelector(".invoiceQty").value),

            rate:
                Number(row.querySelector(".invoiceRate").value),

            gst:
                Number(row.querySelector(".invoiceGST").value),

            amount:
                Number(row.querySelector(".invoiceTotal").value),

            mrp: 0,

            lot: "",

            expiry: null

        });

    });

    const { error: itemError } = await supabaseClient

        .from("Invoice items")

        .insert(items);

    if (itemError) {

        console.error(itemError);

        toast(itemError.message, "#dc3545");

        return;

    }

    toast("Invoice Saved Successfully");

    initialiseBilling();

}

//==========================================
// Print Invoice
//==========================================

function printInvoice() {

    const customer =
        document.getElementById("invoiceCustomer").value;

    const invoiceDate =
        document.getElementById("invoiceDate").value;

    const subtotal =
        document.getElementById("subTotal").textContent;

    const gst =
        document.getElementById("gstTotal").textContent;

    const discount =
        document.getElementById("invoiceDiscount").value || 0;

    const grandTotal =
        document.getElementById("grandTotal").textContent;

    let rows = "";

    document.querySelectorAll("#invoiceBody tr")
        .forEach((row, index) => {

            rows += `

<tr>

<td>${index + 1}</td>

<td>${row.querySelector(".invoiceProduct").value}</td>

<td>${row.querySelector(".invoiceQty").value}</td>

<td>${row.querySelector(".invoiceRate").value}</td>

<td>${row.querySelector(".invoiceGST").value}%</td>

<td>${row.querySelector(".invoiceTotal").value}</td>

</tr>

`;

        });

    const printWindow = window.open("", "", "width=900,height=700");

    printWindow.document.write(`

<html>

<head>

<title>Invoice</title>

<style>

body{
font-family:Arial,sans-serif;
padding:20px;
}

h1,h2,h3{
margin:0;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

table,th,td{
border:1px solid #000;
}

th,td{
padding:8px;
text-align:center;
}

.summary{
margin-top:20px;
width:300px;
float:right;
}

.summary td{
text-align:right;
}

</style>

</head>

<body>

<h2>GENIUS SCIENTIFIC</h2>

<p>

Diagnostic Equipment & Laboratory Solutions

</p>

<hr>

<h3>TAX INVOICE</h3>

<p>

<b>Date :</b> ${invoiceDate}

</p>

<p>

<b>Customer :</b> ${customer}

</p>

<table>

<thead>

<tr>

<th>#</th>

<th>Product</th>

<th>Qty</th>

<th>Rate</th>

<th>GST %</th>

<th>Total</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

<table class="summary">

<tr>

<td>Subtotal</td>

<td>${subtotal}</td>

</tr>

<tr>

<td>GST</td>

<td>${gst}</td>

</tr>

<tr>

<td>Discount</td>

<td>${discount}</td>

</tr>

<tr>

<td>

<b>Grand Total</b>

</td>

<td>

<b>${grandTotal}</b>

</td>

</tr>

</table>

<br><br><br><br>

<p>

Authorized Signature

</p>

<script>

window.onload=function(){

window.print();

}

</script>

</body>

</html>

`);

    printWindow.document.close();

}

//==========================================
// Load Invoice History
//==========================================

async function loadInvoiceHistory() {

    if (!isSupabaseReady()) return;

    const { data, error } = await supabaseClient
        .from("Invoice")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        toast(error.message, "#dc3545");

        return;

    }

    renderInvoiceHistory(data || []);

}

//==========================================
// Render Invoice History
//==========================================

function renderInvoiceHistory(invoices) {

    const tbody = document.getElementById("invoiceHistoryBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    invoices.forEach(invoice => {

        tbody.innerHTML += `

<tr>

<td>${invoice.invoice_number}</td>

<td>${invoice.customer}</td>

<td>${invoice.date ?? ""}</td>

<td>${Number(invoice.grand_total || 0).toFixed(2)}</td>

<td>${invoice.status ?? ""}</td>

<td>

<button
onclick="viewInvoice('${invoice.invoice_number}')">

View

</button>

<button
onclick="deleteInvoice('${invoice.invoice_number}')">

Delete

</button>

</td>

</tr>

`;

    });

}

//==========================================
// Search Invoice
//==========================================

async function searchInvoice() {

    const keyword = document
        .getElementById("invoiceSearch")
        ?.value
        .trim()
        .toLowerCase();

    if (!keyword) {

        loadInvoiceHistory();

        return;

    }

    const { data, error } = await supabaseClient
        .from("Invoice")
        .select("*");

    if (error) {

        console.error(error);

        return;

    }

    const filtered = (data || []).filter(invoice =>

        (invoice.invoice_number || "")
            .toLowerCase()
            .includes(keyword)

        ||

        (invoice.customer || "")
            .toLowerCase()
            .includes(keyword)

    );

    renderInvoiceHistory(filtered);

}

//==========================================
// Delete Invoice
//==========================================

async function deleteInvoice(invoiceNumber) {

    if (!confirm("Delete this invoice?")) return;

    // Delete items first

    await supabaseClient

        .from("Invoice items")

        .delete()

        .eq("invoice_number", invoiceNumber);

    // Delete invoice header

    const { error } = await supabaseClient

        .from("Invoice")

        .delete()

        .eq("invoice_number", invoiceNumber);

    if (error) {

        console.error(error);

        toast(error.message, "#dc3545");

        return;

    }

    toast("Invoice deleted");

    loadInvoiceHistory();

}

//==========================================
// View Invoice
//==========================================

async function viewInvoice(invoiceNumber) {

    alert(
        "Invoice " +
        invoiceNumber +
        " selected.\n\n" +
        "Edit/Reprint functionality can be added next."
    );

}

//==========================================
// Auto Initialization
//==========================================

document.addEventListener("DOMContentLoaded", () => {

    const discount =
        document.getElementById("invoiceDiscount");

    if (discount) {

        discount.addEventListener(
            "input",
            calculateInvoice
        );

    }

    loadInvoiceHistory();

});
