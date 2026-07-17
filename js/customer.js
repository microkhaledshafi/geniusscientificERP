// ===============================
// Genius Scientific ERP
// Customer Module
// ===============================

let editCustomerId = null;
let customerCache = [];

async function loadCustomers() {

    const { data, error } = await supabaseClient
        .from("customers")
        .select("*")
        .order("name");

    if (error) {
        console.error(error);
        return;
    }

    customerCache = data;
    renderCustomers(data);

}

function renderCustomers(customers) {

    const body = document.getElementById("customerBody");

    body.innerHTML = "";

    customers.forEach(c => {

        body.innerHTML += `
        <tr>
            <td>${c.name || ""}</td>
            <td>${c.phone || ""}</td>
            <td>${c.address || ""}</td>
            <td>${c.gst || ""}</td>
            <td>₹ ${Number(c.opening_balance || 0).toFixed(2)}</td>
            <td>
                <button onclick="editCustomer(${c.id})">✏️</button>
                <button onclick="deleteCustomer(${c.id})">🗑️</button>
            </td>
        </tr>
        `;

    });

    document.getElementById("totalCustomers").innerText = customers.length;

}

async function saveCustomer() {

    const customer = {

        name: document.getElementById("customerName").value.trim(),

        phone: document.getElementById("customerPhone").value.trim(),

        email: document.getElementById("customerEmail").value.trim(),

        gst: document.getElementById("customerGST").value.trim(),

        address: document.getElementById("customerAddress").value.trim(),

        opening_balance: Number(document.getElementById("customerOpening").value || 0)

    };

    if (customer.name === "") {

        alert("Enter Customer Name");

        return;

    }

    let data, error;

    if (editCustomerId === null) {

        ({ data, error } = await supabaseClient
            .from("customers")
            .insert([customer])
            .select());

    } else {

        ({ data, error } = await supabaseClient
            .from("customers")
            .update(customer)
            .eq("id", editCustomerId)
            .select());

        editCustomerId = null;

        document.getElementById("saveButtonCustomer").innerText = "Save Customer";

    }

    if (error) {

        alert(error.message);

        return;

    }

    clearCustomerForm();

    loadCustomers();

}

function editCustomer(id) {

    const c = customerCache.find(x => x.id === id);

    if (!c) return;

    editCustomerId = id;

    document.getElementById("customerName").value = c.name;
    document.getElementById("customerPhone").value = c.phone;
    document.getElementById("customerEmail").value = c.email;
    document.getElementById("customerGST").value = c.gst;
    document.getElementById("customerAddress").value = c.address;
    document.getElementById("customerOpening").value = c.opening_balance;

    document.getElementById("saveButtonCustomer").innerText = "Update Customer";

}

async function deleteCustomer(id) {

    if (!confirm("Delete Customer?")) return;

    const { error } = await supabaseClient
        .from("customers")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadCustomers();

}

function searchCustomer() {

    const text = document
        .getElementById("searchCustomer")
        .value
        .toLowerCase();

    renderCustomers(

        customerCache.filter(c =>

            c.name.toLowerCase().includes(text)

        )

    );

}

function clearCustomerForm() {

    [

        "customerName",

        "customerPhone",

        "customerEmail",

        "customerGST",

        "customerAddress",

        "customerOpening"

    ].forEach(id => {

        document.getElementById(id).value = "";

    });

}

window.addEventListener("load", loadCustomers);
