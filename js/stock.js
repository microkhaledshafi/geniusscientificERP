//==========================================
// Genius Scientific ERP
// stock.js
// Part 1
//==========================================

let productCache = [];
let editingProductId = null;

//==========================================
// Load Products
//==========================================

async function loadProducts() {

    if (!isSupabaseReady()) return;

    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("product", { ascending: true });

    if (error) {

        console.error(error);

        toast(error.message, "#dc3545");

        return;

    }

    productCache = data || [];

    renderProducts();

    updateProductCount();

    refreshBillingProducts();

}

//==========================================
// Render Products
//==========================================

function renderProducts(list = productCache) {

    const tbody = document.getElementById("productBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    list.forEach(product => {

        tbody.innerHTML += `

<tr>

<td>${product.product ?? ""}</td>

<td>${product.manufacturer ?? ""}</td>

<td>${product.category ?? ""}</td>

<td>${product.batch ?? ""}</td>

<td>${product.lot ?? ""}</td>

<td>${product.hsn ?? ""}</td>

<td>${Number(product.purchase_rate || 0).toFixed(2)}</td>

<td>${Number(product.selling_rate || 0).toFixed(2)}</td>

<td>${Number(product.mrp || 0).toFixed(2)}</td>

<td>${Number(product.gst || 0)}%</td>

<td>${product.quantity ?? 0}</td>

<td>${product.unit ?? ""}</td>

<td>${product.expiry ?? ""}</td>

<td>

<button
class="actionBtn"
onclick="editProduct(${product.id})">

Edit

</button>

<button
class="actionBtn deleteBtn"
onclick="deleteProduct(${product.id})">

Delete

</button>

</td>

</tr>

`;

    });

}

//==========================================
// Dashboard Counter
//==========================================

function updateProductCount() {

    const total = document.getElementById("totalProducts");

    if (total) {

        total.textContent = productCache.length;

    }

}

//==========================================
// Billing Product Dropdown
//==========================================

function refreshBillingProducts() {

    if (typeof loadInvoiceProducts === "function") {

        loadInvoiceProducts();

    }

}

//==========================================
// Get Product By ID
//==========================================

function getProductById(id) {

    return productCache.find(

        product => Number(product.id) === Number(id)

    );

}

//==========================================
// Get Product By Name
//==========================================

function getProductByName(name) {

    return productCache.find(

        product =>

            (product.product || "").toLowerCase() ===
            (name || "").toLowerCase()

    );

}

//==========================================
// Save Product
//==========================================

async function saveProduct() {

    if (!isSupabaseReady()) return;

    const product = {

        product: document.getElementById("productName").value.trim(),

        manufacturer: document.getElementById("manufacturer").value.trim(),

        category: document.getElementById("category").value.trim(),

        lot: document.getElementById("lot").value.trim(),

        batch: document.getElementById("batch").value.trim(),

        hsn: document.getElementById("hsn").value.trim(),

        purchase_rate: Number(
            document.getElementById("purchaseRate").value || 0
        ),

        selling_rate: Number(
            document.getElementById("sellingRate").value || 0
        ),

        mrp: Number(
            document.getElementById("mrp").value || 0
        ),

        gst: Number(
            document.getElementById("gst").value || 0
        ),

        quantity: Number(
            document.getElementById("quantity").value || 0
        ),

        unit: document.getElementById("unit").value.trim(),

        expiry: document.getElementById("expiry").value || null

    };

    if (product.product === "") {

        toast("Product Name is required", "#dc3545");

        return;

    }

    let error;

    if (editingProductId === null) {

        ({ error } = await supabaseClient

            .from("products")

            .insert([product]));

    } else {

        ({ error } = await supabaseClient

            .from("products")

            .update(product)

            .eq("id", editingProductId));

    }

    if (error) {

        console.error(error);

        toast(error.message, "#dc3545");

        return;

    }

    toast(

        editingProductId === null

            ? "Product Saved"

            : "Product Updated"

    );

    resetProductForm();

    await loadProducts();

}

//==========================================
// Edit Product
//==========================================

function editProduct(id) {

    const product = getProductById(id);

    if (!product) return;

    editingProductId = Number(id);

    document.getElementById("productName").value =
        product.product || "";

    document.getElementById("manufacturer").value =
        product.manufacturer || "";

    document.getElementById("category").value =
        product.category || "";

    document.getElementById("lot").value =
        product.lot || "";

    document.getElementById("batch").value =
        product.batch || "";

    document.getElementById("hsn").value =
        product.hsn || "";

    document.getElementById("purchaseRate").value =
        product.purchase_rate || 0;

    document.getElementById("sellingRate").value =
        product.selling_rate || 0;

    document.getElementById("mrp").value =
        product.mrp || 0;

    document.getElementById("gst").value =
        product.gst || 0;

    document.getElementById("quantity").value =
        product.quantity || 0;

    document.getElementById("unit").value =
        product.unit || "";

    document.getElementById("expiry").value =
        product.expiry || "";

    document.getElementById("saveButtonProduct").textContent =
        "Update Product";

}

//==========================================
// Clear Product Form
//==========================================

function clearProductForm() {

    document.getElementById("productName").value = "";

    document.getElementById("manufacturer").value = "";

    document.getElementById("category").value = "";

    document.getElementById("lot").value = "";

    document.getElementById("batch").value = "";

    document.getElementById("hsn").value = "";

    document.getElementById("purchaseRate").value = "";

    document.getElementById("sellingRate").value = "";

    document.getElementById("mrp").value = "";

    document.getElementById("gst").value = "";

    document.getElementById("quantity").value = "";

    document.getElementById("unit").value = "";

    document.getElementById("expiry").value = "";

}

//==========================================
// Reset Product Form
//==========================================

function resetProductForm() {

    editingProductId = null;

    clearProductForm();

    document.getElementById("saveButtonProduct").textContent =
        "Save Product";

}

//==========================================
// Delete Product
//==========================================

async function deleteProduct(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    const { error } = await supabaseClient
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {

        console.error(error);

        toast(error.message, "#dc3545");

        return;

    }

    toast("Product deleted successfully");

    await loadProducts();

}

//==========================================
// Search Product
//==========================================

function searchProduct() {

    const keyword = document
        .getElementById("productSearch")
        .value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        renderProducts(productCache);

        return;

    }

    const filtered = productCache.filter(product => {

        return (

            (product.product || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (product.manufacturer || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (product.category || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (product.batch || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (product.lot || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (product.hsn || "")
                .toLowerCase()
                .includes(keyword)

        );

    });

    renderProducts(filtered);

}

//==========================================
// Product Exists
//==========================================

function productExists(productName) {

    return productCache.some(product =>

        (product.product || "")
            .toLowerCase()
            ===
        (productName || "")
            .toLowerCase()

    );

}

//==========================================
// Get Product List
//==========================================

function getProductList() {

    return productCache;

}

//==========================================
// Refresh Product Module
//==========================================

async function refreshProductModule() {

    await loadProducts();

}

//==========================================
// Auto Initialization
//==========================================

document.addEventListener("DOMContentLoaded", () => {

    // Save Product Button
    const saveBtn = document.getElementById("saveButtonProduct");

    if (saveBtn) {

        saveBtn.addEventListener("click", saveProduct);

    }

    // Product Search
    const searchBox = document.getElementById("productSearch");

    if (searchBox) {

        searchBox.addEventListener("keyup", searchProduct);

    }

    // Press Enter to Save Product
    [
        "productName",
        "manufacturer",
        "category",
        "lot",
        "batch",
        "hsn",
        "purchaseRate",
        "sellingRate",
        "mrp",
        "gst",
        "quantity",
        "unit",
        "expiry"
    ].forEach(id => {

        const element = document.getElementById(id);

        if (!element) return;

        element.addEventListener("keypress", function (e) {

            if (e.key === "Enter") {

                e.preventDefault();

                saveProduct();

            }

        });

    });

    // Initial Product Load
    if (typeof loadProducts === "function") {

        loadProducts();

    }

});

//==========================================
// Billing Integration
//==========================================

function loadInvoiceProducts() {

    const selects = document.querySelectorAll(".invoiceProduct");

    selects.forEach(select => {

        const currentValue = select.value;

        select.innerHTML = `<option value="">Select Product</option>`;

        productCache.forEach(product => {

            select.innerHTML += `
                <option value="${product.product}">
                    ${product.product}
                </option>
            `;

        });

        select.value = currentValue;

    });

}

//==========================================
// End of stock.js
//==========================================
