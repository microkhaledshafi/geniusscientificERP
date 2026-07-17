<!-- ========================= -->
<!-- Billing -->
<!-- ========================= -->

<section id="billing" class="page" style="display:none;">

<h1>Create Invoice</h1>

<div class="tableCard">

<div class="formGrid">

<input id="invoiceNumber" placeholder="Invoice Number">

<input id="invoiceDate" type="date">

<select id="invoiceCustomer">
    <option value="">Select Customer</option>
</select>

</div>

</div>

<div class="tableCard">

<h2>Invoice Items</h2>

<table>

<thead>

<tr>

<th>Product</th>
<th>Qty</th>
<th>Rate</th>
<th>GST</th>
<th>Total</th>
<th>Action</th>

</tr>

</thead>

<tbody id="invoiceBody">

</tbody>

</table>

<br>

<button type="button" onclick="addInvoiceRow()">
➕ Add Item
</button>

</div>

<div class="tableCard">

<h2>Invoice Summary</h2>

<p>
Sub Total :
₹ <span id="subTotal">0.00</span>
</p>

<p>
Discount :
<input
id="invoiceDiscount"
type="number"
value="0"
oninput="calculateInvoice()">
</p>

<p>
GST :
₹ <span id="gstTotal">0.00</span>
</p>

<h2>
Grand Total :
₹ <span id="grandTotal">0.00</span>
</h2>

<br>

<button onclick="saveInvoice()">
Save Invoice
</button>

<button onclick="printInvoice()">
Print Invoice
</button>

</div>

</section>
