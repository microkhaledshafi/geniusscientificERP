//==========================================
// Genius Scientific ERP
// customer.js
// Part 1
//==========================================

let customerCache = [];
let editingCustomerId = null;

//==========================================
// Load Customers
//==========================================

async function loadCustomers() {

    if (!supabaseClient) return;

    const { data, error } = await supabaseClient
        .from("customers")
        .select("*")
        .order("name");

    if (error) {

        console.error(error);
        return;

    }

    customerCache = data || [];

    renderCustomers();

    if (typeof loadInvoiceCustomers === "function") {
        loadInvoiceCustomers();
    }

    updateCustomerCount();

}

//==========================================
// Render Customer Table
//==========================================

function renderCustomers(list = customerCache) {

    const tbody = document.getElementById("customerBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    list.forEach(customer => {

        tbody.innerHTML += `

<tr>

<td>${customer.name ?? ""}</td>

<td>${customer.phone ?? ""}</td>

<td>${customer.address ?? ""}</td>

<td>${customer.gst ?? ""}</td>

<td>₹ ${Number(customer.opening_balance || 0).toFixed(2)}</td>

<td>

<button
class="actionBtn"
onclick="editCustomer(${customer.id})">

Edit

</button>

<button
class="actionBtn"
onclick="deleteCustomer(${customer.id})">

Delete

</button>

</td>

</tr>

`;

    });

}

//==========================================
// Dashboard Customer Count
//==========================================

function updateCustomerCount() {

    const total = document.getElementById("totalCustomers");

    if (total) {

        total.innerHTML = customerCache.length;

    }
//==========================================
// Save Customer
//==========================================

async function saveCustomer() {

    if (!supabaseClient) {
        alert("Supabase not connected.");
        return;
    }

    const customer = {

        name: document.getElementById("customerName").value.trim(),

        phone: document.getElementById("customerPhone").value.trim(),

        email: document.getElementById("customerEmail").value.trim(),

        gst: document.getElementById("customerGST").value.trim(),

        address: document.getElementById("customerAddress").value.trim(),

        opening_balance: Number(
            document.getElementById("customerOpening").value || 0
        )

    };

    if (customer.name === "") {

        alert("Customer Name is required");

        return;

    }

    let result;

    if (editingCustomerId === null) {

        result = await supabaseClient
            .from("customers")
            .insert([customer]);

    } else {

        result = await supabaseClient
            .from("customers")
            .update(customer)
            .eq("id", editingCustomerId);

    }

    if (result.error) {

        console.error(result.error);

        alert(result.error.message);

        return;

    }

    clearCustomerForm();

    editingCustomerId = null;

    document.getElementById("saveButtonCustomer").innerHTML =
        "Save Customer";

    await loadCustomers();

}

//==========================================
// Edit Customer
//==========================================

function editCustomer(id) {

    const customer = customerCache.find(c => c.id == id);

    if (!customer) return;

    editingCustomerId = id;

    document.getElementById("customerName").value =
        customer.name || "";

    document.getElementById("customerPhone").value =
        customer.phone || "";

    document.getElementById("customerEmail").value =
        customer.email || "";

    document.getElementById("customerGST").value =
        customer.gst || "";

    document.getElementById("customerAddress").value =
        customer.address || "";

    document.getElementById("customerOpening").value =
        customer.opening_balance || 0;

    document.getElementById("saveButtonCustomer").innerHTML =
        "Update Customer";

}

//==========================================
// Clear Form
//==========================================

function clearCustomerForm() {

    document.getElementById("customerName").value = "";

    document.getElementById("customerPhone").value = "";

    document.getElementById("customerEmail").value = "";

    document.getElementById("customerGST").value = "";

    document.getElementById("customerAddress").value = "";

    document.getElementById("customerOpening").value = "";

}
//==========================================
// Delete Customer
//==========================================

async function deleteCustomer(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    const { error } = await supabaseClient
        .from("customers")
        .delete()
        .eq("id", id);

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    await loadCustomers();

}

//==========================================
// Search Customer
//==========================================

function searchCustomer() {

    const keyword = document
        .getElementById("customerSearch")
        .value
        .toLowerCase()
        .trim();

    if (keyword === "") {

        renderCustomers();

        return;

    }

    const filtered = customerCache.filter(customer =>

        (customer.name || "")
            .toLowerCase()
            .includes(keyword)

        ||

        (customer.phone || "")
            .toLowerCase()
            .includes(keyword)

        ||

        (customer.email || "")
            .toLowerCase()
            .includes(keyword)

        ||

        (customer.gst || "")
            .toLowerCase()
            .includes(keyword)

        ||

        (customer.address || "")
            .toLowerCase()
            .includes(keyword)

    );

    renderCustomers(filtered);

}

//==========================================
// Reset Customer Form
//==========================================

function resetCustomerForm() {

    editingCustomerId = null;

    clearCustomerForm();

    const btn = document.getElementById("saveButtonCustomer");

    if (btn) {

        btn.innerHTML = "Save Customer";

    }

}

//==========================================
// Refresh Customer Dropdown (Billing)
//==========================================

function refreshCustomerModule() {

    loadCustomers();

    if (typeof loadInvoiceCustomers === "function") {

        loadInvoiceCustomers();

    }

}

//==========================================
// Auto Load Customers
//==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (typeof loadCustomers === "function") {

        loadCustomers();

    }

});
}
