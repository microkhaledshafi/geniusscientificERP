// ========================================
// Genius Scientific ERP
// Billing Module - Part 1
// ========================================

let invoiceProducts = [];

window.addEventListener("load", initialiseBilling);

async function initialiseBilling() {

    generateInvoiceNumber();

    document.getElementById("invoiceDate").value =
        new Date().toISOString().split("T")[0];

    loadInvoiceCustomers();

    await loadProducts();

}

function generateInvoiceNumber() {

    document.getElementById("invoiceNumber").value =
        "INV-" + Date.now().toString().slice(-6);

}

function loadInvoiceCustomers() {

    const select =
        document.getElementById("invoiceCustomer");

    select.innerHTML =
        '<option value="">Select Customer</option>';

    customerCache.forEach(c => {

        select.innerHTML +=
            `<option value="${c.id}">
                ${c.name}
            </option>`;

    });

}

async function loadProducts() {

    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .order("product");

    if (error) {

        console.error(error);

        return;

    }

    invoiceProducts = data;

}

function addInvoiceRow() {

    let options = "";

    invoiceProducts.forEach(p => {

        options += `
            <option value="${p.id}">
                ${p.product}
            </option>
        `;

    });

    document.getElementById("invoiceBody").innerHTML += `

<tr>

<td>

<select onchange="productChanged(this)">

<option value="">Select Product</option>

${options}

</select>

</td>

<td>

<input
type="number"
value="1"
min="1"
style="width:70px">

</td>

<td>

<input
type="number"
readonly>

</td>

<td>

<input
type="number"
readonly>

</td>

<td>

<input
type="number"
readonly>

</td>

<td>

<button onclick="this.parentNode.parentNode.remove()">

❌

</button>

</td>

</tr>

`;

}

function productChanged(select) {

    const product =
        invoiceProducts.find(p => p.id == select.value);

    if (!product) return;

    const row = select.parentNode.parentNode;

    row.cells[2].children[0].value =
        product.selling_rate;

    row.cells[3].children[0].value =
        product.gst;

    row.cells[4].children[0].value =
        product.selling_rate;

}
