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

<td>${item.mrp}</td>

<td>${item.rate}</td>

<td>${item.gst}</td>

<td>${item.lot}</td>

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
        mrp: Number(document.getElementById("productMRP").value),
        rate: Number(document.getElementById("productRate").value),
        gst: Number(document.getElementById("productGST").value),
        lot: document.getElementById("productLot").value,
        expiry: document.getElementById("productExpiry").value

    };

    if (product.product === "") {

        alert("Please enter Product Name");
        return;

    }

    let result;

    if (editProductId === null) {

        result = await supabaseClient
            .from("products")
            .insert([product]);

    } else {

        result = await supabaseClient
            .from("products")
            .update(product)
            .eq("id", editProductId);

    }

    if (result.error) {

        alert(result.error.message);
        return;

    }

    clearProductForm();

    editProductId = null;

    document.getElementById("saveButton").innerText = "Save Product";

    loadProducts();

}

function clearProductForm() {

    document.getElementById("productName").value = "";
    document.getElementById("productMRP").value = "";
    document.getElementById("productRate").value = "";
    document.getElementById("productGST").value = "";
    document.getElementById("productLot").value = "";
    document.getElementById("productExpiry").value = "";

}

function editProduct(id) {

    const item = productCache.find(x => x.id === id);

    if (!item) return;

    editProductId = id;

    document.getElementById("productName").value = item.product;
    document.getElementById("productMRP").value = item.mrp;
    document.getElementById("productRate").value = item.rate;
    document.getElementById("productGST").value = item.gst;
    document.getElementById("productLot").value = item.lot;
    document.getElementById("productExpiry").value = item.expiry;

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
