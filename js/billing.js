// ================================
// BILLING MODULE - PART 1
// Initialization & Add Invoice Row
// ================================

let invoiceItems = [];
let invoiceNumber = "";
let currentInvoiceId = null;

// -------------------------------
// Initialise Billing
// -------------------------------
async function initialiseBilling() {

    invoiceNumber = generateInvoiceNumber();

    const invoiceNo = document.getElementById("invoiceNumber");
    if (invoiceNo) {
        invoiceNo.value = invoiceNumber;
    }

    const invoiceDate = document.getElementById("invoiceDate");
    if (invoiceDate) {
        invoiceDate.value = new Date().toISOString().split("T")[0];
    }

    await loadInvoiceCustomers();
    await loadInvoiceProducts();

    const tbody = document.getElementById("invoiceItemsBody");
    if (tbody) {
        tbody.innerHTML = "";
    }

    addInvoiceRow();
}

// -------------------------------
// Load Customers
// -------------------------------
async function loadInvoiceCustomers() {

    const customerSelect = document.getElementById("invoiceCustomer");

    if (!customerSelect) return;

    customerSelect.innerHTML =
        `<option value="">Select Customer</option>`;

    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");

    if (error) {
        console.error(error);
        return;
    }

    data.forEach(customer => {

        customerSelect.innerHTML += `
            <option value="${customer.name}">
                ${customer.name}
            </option>
        `;

    });

}

// -------------------------------
// Load Products
// -------------------------------
let billingProducts = [];

async function loadInvoiceProducts() {

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("product");

    if (error) {
        console.error(error);
        return;
    }

    billingProducts = data;
}

// -------------------------------
// Add Invoice Row
// -------------------------------
function addInvoiceRow() {

    const tbody = document.getElementById("invoiceItemsBody");

    if (!tbody) return;

    const row = document.createElement("tr");

    row.innerHTML = `

<td class="serialNo"></td>

<td>
<select class="invoiceProduct"
onchange="productChanged(this)">
<option value="">Select</option>

${billingProducts.map(product => `
<option value="${product.product}">
${product.product}
</option>
`).join("")}

</select>
</td>

<td>
<input
class="invoiceHSN"
readonly>
</td>

<td>
<input
class="invoicePack"
readonly>
</td>

<td>
<input
class="invoiceBatch"
readonly>
</td>

<td>
<input
class="invoiceExpiry"
readonly>
</td>

<td>
<input
class="invoiceMRP"
readonly>
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
class="invoiceFreeQty"
value="0"
min="0">
</td>

<td>
<input
type="number"
class="invoiceRate"
step="0.01">
</td>

<td>
<input
type="number"
class="invoiceDiscount"
value="0"
min="0"
max="100">
</td>

<td>
<input
class="invoiceGST"
readonly>
</td>

<td>
<input
class="invoiceAmount"
readonly>
</td>

<td>
<button
type="button"
onclick="removeInvoiceRow(this)">
🗑
</button>
</td>

`;

    tbody.appendChild(row);

    updateSerialNumbers();
}

// -------------------------------
// Serial Numbers
// -------------------------------
function updateSerialNumbers() {

    document
        .querySelectorAll("#invoiceItemsBody tr")
        .forEach((row, index) => {

            row.querySelector(".serialNo").innerText =
                index + 1;

        });

}

// -------------------------------
// Remove Row
// -------------------------------
function removeInvoiceRow(button) {

    button.closest("tr").remove();

    updateSerialNumbers();

}

// -------------------------------
// Invoice Number
// -------------------------------
function generateInvoiceNumber() {

    const now = new Date();

    return "INV" +
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0");

}

// -------------------------------
// Start Billing
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {

    initialiseBilling();

});

// =====================================
// BILLING MODULE - PART 2
// Product Selection & Auto Fill
// =====================================

// -------------------------------
// Product Changed
// -------------------------------
function productChanged(select) {

    const row = select.closest("tr");

    const productName = select.value;

    if (!productName) {

        clearRow(row);

        return;

    }

    const product = billingProducts.find(p => p.product === productName);

    if (!product) {

        clearRow(row);

        return;

    }

    // Auto Fill

    row.querySelector(".invoiceHSN").value =
        product.hsn || "";

    row.querySelector(".invoicePack").value =
        product.unit || "";

    row.querySelector(".invoiceBatch").value =
        product.batch || "";

    row.querySelector(".invoiceExpiry").value =
        product.expiry || "";

    row.querySelector(".invoiceMRP").value =
        Number(product.mrp || 0).toFixed(2);

    row.querySelector(".invoiceGST").value =
        Number(product.gst || 0).toFixed(2);

    row.querySelector(".invoiceRate").value =
        Number(product.selling_rate || 0).toFixed(2);

    // Calculate row

    calculateRow(row);

}

// -------------------------------
// Clear Row
// -------------------------------
function clearRow(row) {

    row.querySelector(".invoiceHSN").value = "";

    row.querySelector(".invoicePack").value = "";

    row.querySelector(".invoiceBatch").value = "";

    row.querySelector(".invoiceExpiry").value = "";

    row.querySelector(".invoiceMRP").value = "";

    row.querySelector(".invoiceGST").value = "";

    row.querySelector(".invoiceRate").value = "";

    row.querySelector(".invoiceAmount").value = "";

}

// -------------------------------
// Attach Events
// -------------------------------
document.addEventListener("input", function (e) {

    if (

        e.target.classList.contains("invoiceQty") ||

        e.target.classList.contains("invoiceFreeQty") ||

        e.target.classList.contains("invoiceRate") ||

        e.target.classList.contains("invoiceDiscount")

    ) {

        const row = e.target.closest("tr");

        calculateRow(row);

    }

});

// -------------------------------
// Placeholder
// (Implemented in Part 3)
// -------------------------------
function calculateRow(row) {

    // Will be written in Part 3

}

// =====================================
// BILLING MODULE - PART 3
// Calculations
// =====================================

// -------------------------------
// Calculate One Row
// -------------------------------
function calculateRow(row) {

    const qty =
        parseFloat(row.querySelector(".invoiceQty").value) || 0;

    const rate =
        parseFloat(row.querySelector(".invoiceRate").value) || 0;

    const discountPercent =
        parseFloat(row.querySelector(".invoiceDiscount").value) || 0;

    const gstPercent =
        parseFloat(row.querySelector(".invoiceGST").value) || 0;

    // Gross

    const gross = qty * rate;

    // Discount

    const discountAmount =
        gross * discountPercent / 100;

    // Taxable

    const taxable =
        gross - discountAmount;

    // GST

    const cgst =
        taxable * (gstPercent / 2) / 100;

    const sgst =
        taxable * (gstPercent / 2) / 100;

    const total =
        taxable + cgst + sgst;

    row.querySelector(".invoiceAmount").value =
        total.toFixed(2);

    calculateInvoiceTotals();

}

// -------------------------------
// Invoice Totals
// -------------------------------
function calculateInvoiceTotals() {

    let subTotal = 0;

    let totalDiscount = 0;

    let totalCGST = 0;

    let totalSGST = 0;

    let grandTotal = 0;

    document
        .querySelectorAll("#invoiceItemsBody tr")
        .forEach(row => {

            const qty =
                parseFloat(row.querySelector(".invoiceQty").value) || 0;

            const rate =
                parseFloat(row.querySelector(".invoiceRate").value) || 0;

            const discountPercent =
                parseFloat(row.querySelector(".invoiceDiscount").value) || 0;

            const gstPercent =
                parseFloat(row.querySelector(".invoiceGST").value) || 0;

            const gross =
                qty * rate;

            const discount =
                gross * discountPercent / 100;

            const taxable =
                gross - discount;

            const cgst =
                taxable * (gstPercent / 2) / 100;

            const sgst =
                taxable * (gstPercent / 2) / 100;

            const total =
                taxable + cgst + sgst;

            subTotal += gross;

            totalDiscount += discount;

            totalCGST += cgst;

            totalSGST += sgst;

            grandTotal += total;

        });

    setValue("subTotal", subTotal);

    setValue("discountTotal", totalDiscount);

    setValue("cgstTotal", totalCGST);

    setValue("sgstTotal", totalSGST);

    setValue("grandTotal", grandTotal);

}

// -------------------------------
// Helper
// -------------------------------
function setValue(id, value) {

    const element = document.getElementById(id);

    if (!element) return;

    if (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA"
    ) {

        element.value =
            Number(value).toFixed(2);

    } else {

        element.innerText =
            Number(value).toFixed(2);

    }

}

// =====================================
// BILLING MODULE - PART 4
// Save Invoice & Deduct Stock
// =====================================

async function saveInvoice() {

    try {

        const customer =
            document.getElementById("invoiceCustomer").value;

        if (!customer) {
            alert("Please select customer.");
            return;
        }

        const invoiceNo =
            document.getElementById("invoiceNumber").value;

        const invoiceDate =
            document.getElementById("invoiceDate").value;

        const subTotal =
            parseFloat(document.getElementById("subTotal").value) || 0;

        const discount =
            parseFloat(document.getElementById("discountTotal").value) || 0;

        const cgst =
            parseFloat(document.getElementById("cgstTotal").value) || 0;

        const sgst =
            parseFloat(document.getElementById("sgstTotal").value) || 0;

        const grandTotal =
            parseFloat(document.getElementById("grandTotal").value) || 0;

        // ======================
        // Save Invoice Header
        // ======================

        const { error: invoiceError } = await supabase

            .from("Invoice")

            .insert([{

                invoice_number: invoiceNo,

                customer: customer,

                date: invoiceDate,

                discount: discount,

                gst: cgst + sgst,

                grand_total: grandTotal,

                paid_amount: 0,

                balance: grandTotal,

                status: "Pending",

                remarks: "",

                created_at: new Date()

            }]);

        if (invoiceError)
            throw invoiceError;

        // ======================
        // Save Invoice Items
        // ======================

        const itemRows =
            document.querySelectorAll("#invoiceItemsBody tr");

        for (const row of itemRows) {

            const productName =
                row.querySelector(".invoiceProduct").value;

            const product =
                billingProducts.find(
                    p => p.product === productName
                );

            if (!product) continue;

            const qty =
                parseFloat(row.querySelector(".invoiceQty").value) || 0;

            const freeQty =
                parseFloat(row.querySelector(".invoiceFreeQty").value) || 0;

            const rate =
                parseFloat(row.querySelector(".invoiceRate").value) || 0;

            const disc =
                parseFloat(row.querySelector(".invoiceDiscount").value) || 0;

            const gst =
                parseFloat(row.querySelector(".invoiceGST").value) || 0;

            const amount =
                parseFloat(row.querySelector(".invoiceAmount").value) || 0;

            const { error: itemError } = await supabase

                .from("Invoice items")

                .insert([{

                    invoice_number: invoiceNo,

                    product: product.product,

                    hsn: product.hsn,

                    batch: product.batch,

                    expiry: product.expiry,

                    mrp: product.mrp,

                    quantity: qty,

                    free_qty: freeQty,

                    rate: rate,

                    discount_percent: disc,

                    gst: gst,

                    amount: amount

                }]);

            if (itemError)
                throw itemError;

            // ======================
            // Stock Deduction
            // ======================

            const newQty =
                Number(product.quantity) - qty - freeQty;

            const { error: stockError } = await supabase

                .from("products")

                .update({

                    quantity: newQty

                })

                .eq("id", product.id);

            if (stockError)
                throw stockError;

        }

        alert("Invoice Saved Successfully.");

        await loadProducts();

        initialiseBilling();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

// =====================================
// BILLING MODULE - PART 5A
// Invoice History
// =====================================

async function loadInvoiceHistory() {

    const { data, error } = await supabase
        .from("Invoice")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    renderInvoiceHistory(data);

}

function renderInvoiceHistory(data) {

    const tbody =
        document.getElementById("invoiceHistoryBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(invoice => {

        tbody.innerHTML += `

<tr>

<td>${invoice.invoice_number}</td>

<td>${invoice.customer}</td>

<td>${invoice.date}</td>

<td>${Number(invoice.grand_total).toFixed(2)}</td>

<td>${invoice.status}</td>

<td>

<button onclick="printInvoice('${invoice.invoice_number}')">

🖨 Print

</button>

<button onclick="deleteInvoice('${invoice.invoice_number}')">

🗑 Delete

</button>

</td>

</tr>

`;

    });

}

function searchInvoice() {

    const search =
        document.getElementById("invoiceSearch")
        .value
        .toLowerCase();

    document
        .querySelectorAll("#invoiceHistoryBody tr")
        .forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(search)
                ? ""
                : "none";

        });

}

async function deleteInvoice(invoiceNo) {

    if (!confirm("Delete this invoice?"))
        return;

    await supabase

        .from("Invoice items")

        .delete()

        .eq("invoice_number", invoiceNo);

    await supabase

        .from("Invoice")

        .delete()

        .eq("invoice_number", invoiceNo);

    loadInvoiceHistory();

}

async function printInvoice(invoiceNo){

    // This function will be replaced
    // with the professional A4 invoice
    // matching your Genius Scientific format.

}
