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

    if(!ddl) return;

    ddl.innerHTML =
    '<option value="">Select Customer</option>';

    if(typeof customerCache==="undefined") return;

    customerCache.forEach(c=>{

        ddl.innerHTML += `
        <option value="${c.id}">
            ${c.name}
        </option>`;

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
