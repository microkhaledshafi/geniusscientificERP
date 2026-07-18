// ==========================================
// Genius Scientific ERP
// customer.js
// ==========================================

let customerList = [];
let selectedCustomerId = null;

// ==========================================
// Load Customers
// ==========================================

async function loadCustomers() {

    if (!isSupabaseReady()) return;

    try {

        const { data, error } = await supabaseClient
            .from("customers")
            .select("*")
            .order("name");

        if (error) throw error;

        customerList = data || [];

        renderCustomers(customerList);

        populateCustomerDropdown();

    }

    catch (err) {

        console.error(err);

        notify(err.message);

    }

}

// ==========================================
// Render Customer Table
// ==========================================

function renderCustomers(customers) {

    const body = document.getElementById("customerBody");

    if (!body) return;

    body.innerHTML = "";

    if (!customers.length) {

        body.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center">
                No Customers
            </td>
        </tr>`;

        return;

    }

    customers.forEach(customer => {

        body.innerHTML += `

        <tr>

            <td>${customer.name || ""}</td>

            <td>${customer.phone || ""}</td>

            <td>${customer.email || ""}</td>

            <td>${customer.gst || ""}</td>

            <td>${money(customer.opening_balance || 0)}</td>

            <td>

                <button onclick="editCustomer(${customer.id})">
                    Edit
                </button>

                <button onclick="deleteCustomer(${customer.id})">
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

// ==========================================
// Customer Dropdown
// ==========================================

function populateCustomerDropdown() {

    const invoice = document.getElementById("invoiceCustomer");
    const payment = document.getElementById("paymentCustomer");

    [invoice, payment].forEach(select => {

        if (!select) return;

        select.innerHTML = `<option value="">Select Customer</option>`;

        customerList.forEach(customer => {

            select.innerHTML += `

            <option value="${customer.id}">
                ${customer.name}
            </option>

            `;

        });

    });

}

// ==========================================
// Save Customer
// ==========================================

async function saveCustomer() {

    if (!isSupabaseReady()) return;

    const customer = {

        name: document.getElementById("customerName").value.trim(),

        phone: document.getElementById("customerPhone").value.trim(),

        email: document.getElementById("customerEmail").value.trim(),

        gst: document.getElementById("customerGST").value.trim(),

        address: document.getElementById("customerAddress").value.trim(),

        opening_balance: Number(
            document.getElementById("customerOpeningBalance").value || 0
        )

    };

    if (!customer.name) {

        notify("Customer name is required.");

        return;

    }

    try {

        if (selectedCustomerId) {

            await updateRecord(
                "customers",
                selectedCustomerId,
                customer
            );

            notify("Customer Updated");

        }

        else {

            await insertRecord(
                "customers",
                customer
            );

            notify("Customer Saved");

        }

        resetCustomerForm();

        loadCustomers();

        refreshDashboard();

        addActivity("Customer saved");

    }

    catch (err) {

        console.error(err);

        notify(err.message);

    }

}

// ==========================================
// Edit Customer
// ==========================================

function editCustomer(id) {

    const c = customerList.find(x => x.id == id);

    if (!c) return;

    selectedCustomerId = id;

    document.getElementById("customerName").value = c.name || "";

    document.getElementById("customerPhone").value = c.phone || "";

    document.getElementById("customerEmail").value = c.email || "";

    document.getElementById("customerGST").value = c.gst || "";

    document.getElementById("customerAddress").value = c.address || "";

    document.getElementById("customerOpeningBalance").value =
        c.opening_balance || 0;

}

// ==========================================
// Delete Customer
// ==========================================

async function deleteCustomer(id) {

    if (!confirm("Delete this customer?"))
        return;

    try {

        await deleteRecord(
            "customers",
            id
        );

        loadCustomers();

        refreshDashboard();

        addActivity("Customer deleted");

    }

    catch (err) {

        notify(err.message);

    }

}

// ==========================================
// Reset Form
// ==========================================

function resetCustomerForm() {

    selectedCustomerId = null;

    [

        "customerName",

        "customerPhone",

        "customerEmail",

        "customerGST",

        "customerAddress",

        "customerOpeningBalance"

    ].forEach(id => {

        const input = document.getElementById(id);

        if (input)
            input.value = "";

    });

}

// ==========================================
// Search Customer
// ==========================================

function searchCustomer() {

    const text = document
        .getElementById("customerSearch")
        .value
        .toLowerCase();

    const filtered = customerList.filter(customer =>

        (customer.name || "")
            .toLowerCase()
            .includes(text)

        ||

        (customer.phone || "")
            .toLowerCase()
            .includes(text)

        ||

        (customer.gst || "")
            .toLowerCase()
            .includes(text)

    );

    renderCustomers(filtered);

}

// ==========================================
// Customer Selection
// ==========================================

document.addEventListener("change", function (e) {

    if (e.target.id !== "invoiceCustomer")
        return;

    const customer = customerList.find(

        c => c.id == e.target.value

    );

    if (!customer)
        return;

    document.getElementById("customerGSTNo").value =
        customer.gst || "";

    document.getElementById("customerBillAddress").value =
        customer.address || "";

});
