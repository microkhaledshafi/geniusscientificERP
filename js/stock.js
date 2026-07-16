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

window.addEventListener("load",loadProducts);
