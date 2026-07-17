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

    if (!isSupabaseReady()) return;

    const { data, error } = await supabaseClient
        .from("customers")
        .select("*")
        .order("name", { ascending: true });

    if (error) {

        console.error(error);

        toast(error.message, "#dc3545");

        return;

    }

    customerCache = data || [];

    renderCustomers();

    updateCustomerCount();

    refreshBillingCustomers();

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

<td>${customer.email ?? ""}</td>

<td>${customer.gst ?? ""}</td>

<td>${customer.address ?? ""}</td>

<td>${Number(customer.opening_balance || 0).toFixed(2)}</td>

<td>

<button
class="actionBtn"
onclick="editCustomer(${customer.id})">

Edit

</button>

<button
class="actionBtn deleteBtn"
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

        total.textContent = customerCache.length;

    }

}

//==========================================
// Refresh Billing Customer Dropdown
//==========================================

function refreshBillingCustomers() {

    if (typeof loadInvoiceCustomers === "function") {

        loadInvoiceCustomers();

    }

}

//==========================================
// Helper Functions
//==========================================

function getCustomerById(id) {

    return customerCache.find(

        customer => Number(customer.id) === Number(id)

    );

}

function getCustomerByName(name) {

    return customerCache.find(

        customer =>

            (customer.name || "")
                .toLowerCase()
                ===
            (name || "")
                .toLowerCase()

    );

}

function customerExists(name) {

    return customerCache.some(

        customer =>

            (customer.name || "")
                .toLowerCase()
                ===
            (name || "")
                .toLowerCase()

    );

}

//==========================================
// Save Customer
//==========================================

async function saveCustomer() {

    if (!isSupabaseReady()) return;

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

        toast("Customer Name is required", "#dc3545");

        return;

    }

    let error;

    if (editingCustomerId === null) {

        ({ error } = await supabaseClient
            .from("customers")
            .insert([customer]));

    } else {

        ({ error } = await supabaseClient
            .from("customers")
            .update(customer)
            .eq("id", editingCustomerId));

    }

    if (error) {

        console.error(error);

        toast(error.message, "#dc3545");

        return;

    }

    toast(
        editingCustomerId === null
            ? "Customer Saved Successfully"
            : "Customer Updated Successfully"
    );

    resetCustomerForm();

    await loadCustomers();

}

//==========================================
// Edit Customer
//==========================================

function editCustomer(id) {

    const customer = getCustomerById(id);

    if (!customer) return;

    editingCustomerId = Number(id);

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

    document.getElementById("saveButtonCustomer").textContent =
        "Update Customer";

}

//==========================================
// Clear Customer Form
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
// Reset Customer Form
//==========================================

function resetCustomerForm() {

    editingCustomerId = null;

    clearCustomerForm();

    document.getElementById("saveButtonCustomer").textContent =
        "Save Customer";

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

        toast(error.message, "#dc3545");

        return;

    }

    toast("Customer deleted successfully");

    await loadCustomers();

}

//==========================================
// Search Customer
//==========================================

function searchCustomer() {

    const keyword = document
        .getElementById("customerSearch")
        .value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        renderCustomers(customerCache);

        return;

    }

    const filtered = customerCache.filter(customer => {

        return (

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

    });

    renderCustomers(filtered);

}

//==========================================
// Get Customer List
//==========================================

function getCustomerList() {

    return customerCache;

}

//==========================================
// Refresh Customer Module
//==========================================

async function refreshCustomerModule() {

    await loadCustomers();

}

//==========================================
// Refresh Billing Customers
//==========================================

function refreshBillingCustomers() {

    if (typeof loadInvoiceCustomers === "function") {

        loadInvoiceCustomers();

    }

}

//==========================================
// Auto Initialization
//==========================================

document.addEventListener("DOMContentLoaded", () => {

    // Save Customer Button
    const saveBtn = document.getElementById("saveButtonCustomer");

    if (saveBtn) {

        saveBtn.addEventListener("click", saveCustomer);

    }

    // Customer Search
    const searchBox = document.getElementById("customerSearch");

    if (searchBox) {

        searchBox.addEventListener("keyup", searchCustomer);

    }

    // Press Enter to Save Customer
    [
        "customerName",
        "customerPhone",
        "customerEmail",
        "customerGST",
        "customerAddress",
        "customerOpening"
    ].forEach(id => {

        const element = document.getElementById(id);

        if (!element) return;

        element.addEventListener("keypress", function (e) {

            if (e.key === "Enter") {

                e.preventDefault();

                saveCustomer();

            }

        });

    });

});

//==========================================
// Billing Integration
//==========================================

function loadInvoiceCustomers() {

    const selects = document.querySelectorAll(".invoiceCustomer");

    selects.forEach(select => {

        const currentValue = select.value;

        select.innerHTML = `<option value="">Select Customer</option>`;

        customerCache.forEach(customer => {

            select.innerHTML += `
                <option value="${customer.name}">
                    ${customer.name}
                </option>
            `;

        });

        select.value = currentValue;

    });

}

//==========================================
// End of customer.js
//==========================================
