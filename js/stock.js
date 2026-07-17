// Genius Scientific ERP v5.5
// Stock Module

let editProductId = null;
let productCache = [];

async function loadProducts() {

    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("product");

    if (error) {
        console.error(error);
        return;
    }

    productCache = data;
    renderProducts(data);

}

function renderProducts(products){

    const body = document.getElementById("stockBody");

    body.innerHTML = "";

    products.forEach(item=>{

        body.innerHTML += `

<tr>

<td>${item.product}</td>
<td>${item.quantity}</td>
<td>${item.mrp}</td>
<td>${item.selling_rate}</td>

<td>${item.gst}</td>

<td>${item.batch}</td>

<td>${item.expiry ?? ""}</td>

<td>

<button onclick="editProduct(${item.id})">
✏️
</button>

<button onclick="deleteProduct(${item.id})">
🗑
</button>

</td>

</tr>

`;

    });

    document.getElementById("totalProducts").innerText =
        products.length;

}
async function saveProduct() {

    const product = {

        product: document.getElementById("productName").value.trim(),

        manufacturer: document.getElementById("manufacturer").value.trim(),

        category: document.getElementById("category").value.trim(),

        hsn: document.getElementById("hsn").value.trim(),

        purchase_rate: Number(document.getElementById("purchaseRate").value || 0),

        selling_rate: Number(document.getElementById("sellingRate").value || 0),

        mrp: Number(document.getElementById("productMRP").value || 0),

        gst: Number(document.getElementById("productGST").value || 0),

        quantity: Number(document.getElementById("quantity").value || 0),

        unit: document.getElementById("unit").value.trim(),

        batch: document.getElementById("productLot").value.trim(),

        expiry: document.getElementById("productExpiry").value || null

    };

    console.log("Saving product:", product);

    const { data, error } = await supabaseClient
        .from("products")
        .insert([product])
        .select();

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    console.log(data);

    alert("Product Saved Successfully");

    clearProductForm();

    loadProducts();

}

    

function clearProductForm() {

    [
        "productName",
        "manufacturer",
        "category",
        "hsn",
        "purchaseRate",
        "sellingRate",
        "productMRP",
        "productGST",
        "quantity",
        "unit",
        "productLot",
        "productExpiry"
    ].forEach(id => {

        const el = document.getElementById(id);

        if (el) el.value = "";

    });

}

function editProduct(id) {

    const item = productCache.find(x => x.id === id);

    if (!item) return;

    editProductId = id;

    document.getElementById("productName").value = item.product;
    document.getElementById("productMRP").value = item.mrp;
    document.getElementById("sellingRate").value = item.selling_rate;
document.getElementById("purchaseRate").value = item.purchase_rate;
document.getElementById("productLot").value = item.batch;

document.getElementById("manufacturer").value = item.manufacturer;
document.getElementById("category").value = item.category;
document.getElementById("hsn").value = item.hsn;
document.getElementById("quantity").value = item.quantity;
document.getElementById("unit").value = item.unit;

    document.getElementById("saveButton").innerText = "Update Product";

}
async function deleteProduct(id) {

    const ok = confirm("Delete this product?");

    if (!ok) return;

    const { error } = await supabaseClient
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadProducts();

}
function searchProduct() {

    const text = document
        .getElementById("searchProduct")
        .value
        .toLowerCase();

    const filtered = productCache.filter(item =>

        item.product.toLowerCase().includes(text)

    );

    renderProducts(filtered);

}
window.addEventListener("load",loadProducts);
