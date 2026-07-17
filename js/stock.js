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

    if (!supabaseClient) return;

    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("product");

    if (error) {

        console.error(error);
        alert(error.message);
        return;

    }

    productCache = data || [];

    renderProducts();

    updateProductCount();

    if (typeof refreshBillingProducts === "function") {
        refreshBillingProducts();
    } else if (typeof loadInvoiceProducts === "function") {
        loadInvoiceProducts();
    }

}
function loadInvoiceProducts() {

    const selects = document.querySelectorAll(".productSelect");

    selects.forEach(select => {

        const current = select.value;

        select.innerHTML =
            '<option value="">Select Product</option>';

        productCache.forEach(product => {

            select.innerHTML += `
                <option value="${product.id}">
                    ${product.product}
                </option>
            `;

        });

        select.value = current;

    });

}

//==========================================
// Render Product Table
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
class="actionBtn"
onclick="deleteProduct(${product.id})">

Delete

</button>

</td>

</tr>

`;

    });

}

//==========================================
// Dashboard Product Count
//==========================================

function updateProductCount() {

    const total = document.getElementById("totalProducts");

    if (total) {

        total.innerHTML = productCache.length;

    }
}
    //==========================================
// Save Product
//==========================================

async function saveProduct() {

    if (!supabaseClient) {
        alert("Supabase not connected.");
        return;
    }

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

        alert("Product Name is required");

        return;

    }

    let result;

    if (editingProductId === null) {

        result = await supabaseClient
            .from("products")
            .insert([product]);

    } else {

        result = await supabaseClient
            .from("products")
            .update(product)
            .eq("id", editingProductId);

    }

    if (result.error) {

        console.error(result.error);

        alert(result.error.message);

        return;

    }

    clearProductForm();

    editingProductId = null;

    document.getElementById("saveButtonProduct").innerHTML =
        "Save Product";

    await loadProducts();

}

//==========================================
// Edit Product
//==========================================

function editProduct(id) {

    const product = productCache.find(
    p => Number(p.id) === Number(id)
);

    if (!product) return;

    editingProductId = id;

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

    document.getElementById("saveButtonProduct").innerHTML =
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

        alert(error.message);

        return;

    }

    await loadProducts();

}

//==========================================
// Search Products
//==========================================

function searchProduct() {

    const keyword = document
        .getElementById("productSearch")
        .value
        .toLowerCase()
        .trim();

    if (keyword === "") {

        renderProducts();

        return;

    }

    const filtered = productCache.filter(product =>

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

    renderProducts(filtered);

}

//==========================================
// Reset Product Form
//==========================================

function resetProductForm() {

    editingProductId = null;

    clearProductForm();

    const btn = document.getElementById("saveButtonProduct");

    if (btn) {

        btn.innerHTML = "Save Product";

    }

}

//==========================================
// Refresh Billing Products
//==========================================

function refreshBillingProducts() {

    if (typeof loadInvoiceProducts === "function") {

        loadInvoiceProducts();

    }

}

//==========================================
// Get Product by ID
//==========================================

function getProductById(id) {

    return productCache.find(
        product => Number(product.id) === Number(id)
    );

}

//==========================================
// Get Product by Name
//==========================================

function getProductByName(name) {

    return productCache.find(
        product =>
            (product.product || "").toLowerCase() ===
            (name || "").toLowerCase()
    );

}

