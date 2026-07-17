// ==========================================
// invoicePrint.js
// PART 1
// Load Invoice Data
// ==========================================

async function printInvoice(invoiceNumber) {

    try {

        // -----------------------------
        // Company Details
        // -----------------------------

        const { data: company, error: companyError } =
            await supabase
                .from("settings")
                .select("*")
                .single();

        if (companyError) throw companyError;

        // -----------------------------
        // Invoice Header
        // -----------------------------

        const { data: invoice, error: invoiceError } =
            await supabase
                .from("Invoice")
                .select("*")
                .eq("invoice_number", invoiceNumber)
                .single();

        if (invoiceError) throw invoiceError;

        // -----------------------------
        // Invoice Items
        // -----------------------------

        const { data: items, error: itemError } =
            await supabase
                .from("Invoice items")
                .select("*")
                .eq("invoice_number", invoiceNumber)
                .order("id");

        if (itemError) throw itemError;

        buildInvoice(company, invoice, items);

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

  function buildInvoice(company, invoice, items){

    // Part 2 starts here.

}

  // ==========================================
// invoicePrint.js
// PART 2
// Build Header
// ==========================================

function buildInvoice(company, invoice, items) {

    let html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>GST Invoice</title>

<style>

body{

font-family:Arial,Helvetica,sans-serif;

font-size:12px;

margin:20px;

color:#000;

}

table{

width:100%;

border-collapse:collapse;

}

th,td{

padding:4px;

vertical-align:top;

}

.border{

border:1px solid black;

}

.center{

text-align:center;

}

.right{

text-align:right;

}

.bold{

font-weight:bold;

}

.small{

font-size:11px;

}

.title{

font-size:20px;

font-weight:bold;

text-align:center;

margin-bottom:8px;

}

.company{

font-size:18px;

font-weight:bold;

text-align:center;

}

</style>

</head>

<body>

<div class="title">

GST INVOICE

</div>

<div class="company">

${company.company_name}

</div>

<div class="center">

${company.address}<br>

${company.city}, ${company.state} - ${company.pincode}<br>

Phone : ${company.phone1}
${company.phone2 ? ", " + company.phone2 : ""}

<br>

GSTIN : ${company.gstin}

</div>

<br>

<table class="border">

<tr>

<td width="65%">

<b>Customer Name :</b><br>

${invoice.customer}

</td>

<td width="35%">

<b>Invoice No :</b>

${invoice.invoice_number}

<br><br>

<b>Invoice Date :</b>

${invoice.date}

</td>

</tr>

</table>

<br>

<table class="border">

<thead>

<tr>

<th width="4%">Sr</th>

<th width="8%">HSN</th>

<th width="26%">Product</th>

<th width="7%">Pack</th>

<th width="8%">Batch</th>

<th width="8%">Exp</th>

<th width="8%">MRP</th>

<th width="6%">Qty</th>

<th width="6%">Free</th>

<th width="8%">Rate</th>

<th width="6%">Disc%</th>

<th width="6%">CGST</th>

<th width="6%">SGST</th>

<th width="10%">Amount</th>

</tr>

</thead>

<tbody>

`;

    // Part 3 will append all invoice rows here

}
  // ==========================================
// invoicePrint.js
// PART 3
// Invoice Item Rows
// ==========================================

let subTotal = 0;
let totalDiscount = 0;
let totalCGST = 0;
let totalSGST = 0;

items.forEach((item, index) => {

    const qty = Number(item.quantity || 0);
    const rate = Number(item.rate || 0);
    const disc = Number(item.discount_percent || 0);
    const gst = Number(item.gst || 0);

    const gross = qty * rate;

    const discount = gross * disc / 100;

    const taxable = gross - discount;

    const cgst = taxable * (gst / 2) / 100;

    const sgst = taxable * (gst / 2) / 100;

    const amount = taxable + cgst + sgst;

    subTotal += gross;
    totalDiscount += discount;
    totalCGST += cgst;
    totalSGST += sgst;

    html += `

<tr>

<td class="border center">

${index + 1}

</td>

<td class="border center">

${item.hsn || ""}

</td>

<td class="border">

${item.product || ""}

</td>

<td class="border center">

${item.pack || "-"}

</td>

<td class="border center">

${item.batch || ""}

</td>

<td class="border center">

${item.expiry || ""}

</td>

<td class="border right">

${Number(item.mrp || 0).toFixed(2)}

</td>

<td class="border center">

${qty}

</td>

<td class="border center">

${Number(item.free_qty || 0)}

</td>

<td class="border right">

${rate.toFixed(2)}

</td>

<td class="border center">

${disc.toFixed(2)}

</td>

<td class="border right">

${cgst.toFixed(2)}

</td>

<td class="border right">

${sgst.toFixed(2)}

</td>

<td class="border right">

${amount.toFixed(2)}

</td>

</tr>

`;

});

// Fill blank rows so every invoice
// has the same professional height

const minimumRows = 15;

for (let i = items.length; i < minimumRows; i++) {

    html += `

<tr>

<td class="border">&nbsp;</td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

<td class="border"></td>

</tr>

`;

}

  // ==========================================
// invoicePrint.js
// PART 4
// Totals
// ==========================================

const grandTotal =
subTotal
-totalDiscount
+totalCGST
+totalSGST;

html += `

</tbody>

</table>

<br>

<table style="width:40%;float:right;">

<tr>

<td><b>Sub Total</b></td>

<td style="text-align:right;">

${subTotal.toFixed(2)}

</td>

</tr>

<tr>

<td><b>Discount</b></td>

<td style="text-align:right;">

${totalDiscount.toFixed(2)}

</td>

</tr>

<tr>

<td><b>Add CGST</b></td>

<td style="text-align:right;">

${totalCGST.toFixed(2)}

</td>

</tr>

<tr>

<td><b>Add SGST</b></td>

<td style="text-align:right;">

${totalSGST.toFixed(2)}

</td>

</tr>

<tr>

<td style="font-size:16px">

<b>Amount Payable</b>

</td>

<td style="font-size:16px;text-align:right;">

<b>

₹ ${grandTotal.toFixed(2)}

</b>

</td>

</tr>

</table>

<div style="clear:both"></div>

<br><br>

<b>

Rupees

${numberToWords(Math.round(grandTotal))}

Only

</b>

<br><br>

<table style="width:100%;">

<tr>

<td width="70%">

<b>Terms & Conditions</b>

<br>

${company.terms}

</td>

<td
style="text-align:center;vertical-align:bottom;">

_____________________

<br>

Authorized Signatory

</td>

</tr>

</table>

`;

  // ==========================================
// invoicePrint.js
// PART 5
// Number To Words
// ==========================================

function numberToWords(num){

    if(num===0) return "Zero";

    const a=[
        "",
        "One","Two","Three","Four","Five",
        "Six","Seven","Eight","Nine","Ten",
        "Eleven","Twelve","Thirteen","Fourteen",
        "Fifteen","Sixteen","Seventeen",
        "Eighteen","Nineteen"
    ];

    const b=[
        "",
        "",
        "Twenty","Thirty","Forty",
        "Fifty","Sixty","Seventy",
        "Eighty","Ninety"
    ];

    function convert(n){

        if(n<20) return a[n];

        if(n<100)
            return b[Math.floor(n/10)]+" "+a[n%10];

        if(n<1000)
            return a[Math.floor(n/100)]+" Hundred "+convert(n%100);

        if(n<100000)
            return convert(Math.floor(n/1000))+
            " Thousand "+
            convert(n%1000);

        if(n<10000000)
            return convert(Math.floor(n/100000))+
            " Lakh "+
            convert(n%100000);

        return convert(Math.floor(n/10000000))+
            " Crore "+
            convert(n%10000000);

    }

    return convert(num).replace(/\s+/g," ").trim();

}

  

}
