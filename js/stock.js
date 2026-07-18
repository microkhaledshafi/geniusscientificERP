// ==========================================
// Genius Scientific ERP
// stock.js
// ==========================================

let selectedProductId = null;
let productList = [];

// ==========================================
// Load Products
// ==========================================

async function loadProducts() {

    if (!isSupabaseReady()) return;

    try {

        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("product");

        if (error) throw error;

        productList = data || [];

        renderProducts(productList);

        if (typeof loadInvoiceProducts === "function")
            loadInvoiceProducts(productList);

    }

    catch (err) {

        console.error(err);
        notify(err.message);

    }

}

// ==========================================
// Render Product Table
// ==========================================

function renderProducts(products) {

    const body = document.getElementById("productBody");

    if (!body) return;

    body.innerHTML = "";

    if (!products.length) {

        body.innerHTML = `
        <tr>
            <td colspan="14" style="text-align:center">
                No Products Available
            </td>
        </tr>`;

        return;

    }

    products.forEach(product => {

        body.innerHTML += `

        <tr>

            <td>${product.product ?? ""}</td>

            <td>${product.manufacturer ?? ""}</td>

            <td>${product.category ?? ""}</td>

            <td>${product.hsn ?? ""}</td>

            <td>${product.lot ?? ""}</td>

            <td>${product.batch ?? ""}</td>

            <td>${product.expiry ?? ""}</td>

            <td>${money(product.mrp)}</td>

            <td>${money(product.purchase_rate)}</td>

            <td>${money(product.selling_rate)}</td>

            <td>${product.gst}%</td>

            <td>${product.quantity}</td>

            <td>${product.unit ?? ""}</td>

            <td>

                <button onclick="editProduct(${product.id})">

                    Edit

                </button>

                <button onclick="deleteProduct(${product.id})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// ==========================================
// Save Product
// ==========================================

async function saveProduct() {

    if (!isSupabaseReady()) return;

    const record = {

        product: document.getElementById("productName").value.trim(),

        manufacturer: document.getElementById("manufacturer").value.trim(),

        category: document.getElementById("category").value.trim(),

        hsn: document.getElementById("hsn").value.trim(),

        lot: document.getElementById("lot").value.trim(),

        batch: document.getElementById("batch").value.trim(),

        expiry: document.getElementById("expiry").value,

        purchase_rate: Number(document.getElementById("purchaseRate").value || 0),

        selling_rate: Number(document.getElementById("sellingRate").value || 0),

        mrp: Number(document.getElementById("mrp").value || 0),

        gst: Number(document.getElementById("gst").value || 0),

        quantity: Number(document.getElementById("quantity").value || 0),

        unit: document.getElementById("unit").value.trim()

    };

    if (!record.product) {

        notify("Product name is required.");

        return;

    }

    try {

        if (selectedProductId) {

            await updateRecord(
                "products",
                selectedProductId,
                record
            );

            notify("Product Updated");

        } else {

            await insertRecord(
                "products",
                record
            );

            notify("Product Saved");

        }

        resetProductForm();

        loadProducts();

        addActivity("Product saved");

        refreshDashboard();

    }

    catch (err) {

        console.error(err);

        notify(err.message);

    }

}

// ==========================================
// Edit Product
// ==========================================

function editProduct(id) {

    const p = productList.find(x => x.id == id);

    if (!p) return;

    selectedProductId = id;

    document.getElementById("productName").value = p.product || "";

    document.getElementById("manufacturer").value = p.manufacturer || "";

    document.getElementById("category").value = p.category || "";

    document.getElementById("hsn").value = p.hsn || "";

    document.getElementById("lot").value = p.lot || "";

    document.getElementById("batch").value = p.batch || "";

    document.getElementById("expiry").value = p.expiry || "";

    document.getElementById("purchaseRate").value = p.purchase_rate || 0;

    document.getElementById("sellingRate").value = p.selling_rate || 0;

    document.getElementById("mrp").value = p.mrp || 0;

    document.getElementById("gst").value = p.gst || 0;

    document.getElementById("quantity").value = p.quantity || 0;

    document.getElementById("unit").value = p.unit || "";

}

// ==========================================
// Delete Product
// ==========================================

async function deleteProduct(id) {

    if (!confirm("Delete this product?"))

        return;

    try {

        await deleteRecord(
            "products",
            id
        );

        loadProducts();

        refreshDashboard();

        addActivity("Product deleted");

    }

    catch (err) {

        notify(err.message);

    }

}

// ==========================================
// Reset Form
// ==========================================

function resetProductForm() {

    selectedProductId = null;

    [
        "productName",
        "manufacturer",
        "category",
        "hsn",
        "lot",
        "batch",
        "expiry",
        "purchaseRate",
        "sellingRate",
        "mrp",
        "gst",
        "quantity",
        "unit"
    ].forEach(id => {

        const el = document.getElementById(id);

        if (el)
            el.value = "";

    });

}

// ==========================================
// Search
// ==========================================

function searchProduct() {

    const text = document
        .getElementById("productSearch")
        .value
        .toLowerCase();

    const filtered = productList.filter(p =>

        (p.product || "").toLowerCase().includes(text) ||

        (p.manufacturer || "").toLowerCase().includes(text) ||

        (p.batch || "").toLowerCase().includes(text)

    );

    renderProducts(filtered);

}
