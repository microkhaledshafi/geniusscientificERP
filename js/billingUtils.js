//=========================================
// Genius Scientific ERP
// Billing Utility Functions
//=========================================

// Format number
function formatMoney(value) {

    value = Number(value) || 0;

    return value.toFixed(2);

}

// Calculate one invoice row
function calculateLine(qty, rate, discount, gst) {

    qty = Number(qty) || 0;
    rate = Number(rate) || 0;
    discount = Number(discount) || 0;
    gst = Number(gst) || 0;

    const gross = qty * rate;

    const discountAmount = gross * discount / 100;

    const taxable = gross - discountAmount;

    const gstAmount = taxable * gst / 100;

    return {

        gross,

        discountAmount,

        taxable,

        gstAmount,

        total: taxable + gstAmount

    };

}

// Currency
function money(value){

    return "₹ " + formatMoney(value);

}

//=========================================
// Number to Words
//=========================================

function numberToWords(num){

    if(num===0) return "Zero";

    const a=[
        "",
        "One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
        "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen",
        "Sixteen","Seventeen","Eighteen","Nineteen"
    ];

    const b=[
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety"
    ];

    function convert(n){

        if(n<20) return a[n];

        if(n<100)
            return b[Math.floor(n/10)]+" "+a[n%10];

        if(n<1000)
            return a[Math.floor(n/100)]+" Hundred "+convert(n%100);

        if(n<100000)
            return convert(Math.floor(n/1000))+" Thousand "+convert(n%1000);

        if(n<10000000)
            return convert(Math.floor(n/100000))+" Lakh "+convert(n%100000);

        return convert(Math.floor(n/10000000))+" Crore "+convert(n%10000000);

    }

    return convert(Math.floor(num))+" Only";

}
