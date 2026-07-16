// Genius Scientific ERP v5.2
// Stock Module

async function saveProduct() {

    const product = {
        product: document.getElementById("productName").value,
        mrp: Number(document.getElementById("productMRP").value),
        rate: Number(document.getElementById("productRate").value),
        gst: Number(document.getElementById("productGST").value),
        lot: document.getElementById("productLot").value,
        expiry: document.getElementById("productExpiry").value
    };

    if (!product.product) {
        alert("Enter Product Name");
        return;
    }

    const { error } = await supabaseClient
        .from("products")
        .insert([product]);

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    alert("Product Saved");

    clearProductForm();

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

async function loadProducts() {

    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .order("product");

    if (error) {

        console.error(error);

        return;

    }

    const body = document.getElementById("stockBody");

    body.innerHTML = "";

    data.forEach(item => {

        body.innerHTML += `

<tr>

<td>${item.product}</td>

<td>${item.mrp}</td>

<td>${item.rate}</td>

<td>${item.gst}</td>

<td>${item.lot}</td>

<td>${item.expiry}</td>

<td>-</td>

</tr>

`;

    });

    document.getElementById("totalProducts").innerText = data.length;

}

window.addEventListener("load", loadProducts);
