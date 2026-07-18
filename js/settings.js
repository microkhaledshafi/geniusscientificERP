//=========================================
// Genius Scientific ERP
// Settings
//=========================================

async function saveSettings(){

    if(!isSupabaseReady()) return;

    const settings = {

    company_name: document.getElementById("companyName").value,

    address: document.getElementById("companyAddress").value,

    city: "",

    state: "",

    pincode: "",

    phone1: document.getElementById("companyPhone1").value,

    phone2: document.getElementById("companyPhone2").value,

    email: document.getElementById("companyEmail").value,

    website: document.getElementById("companyWebsite").value,

    gstin: document.getElementById("companyGST").value,

    dl_no: document.getElementById("companyDL").value,

    bank_name: document.getElementById("companyBank").value,

    account_name: "",

    account_number: document.getElementById("companyAccount").value,

    ifsc: document.getElementById("companyIFSC").value,

    upi: document.getElementById("companyUPI").value,

    terms: document.getElementById("invoiceTerms").value,

    logo: ""

};
async function loadSettings(){

    if(!isSupabaseReady()) return;

    const {data,error}=await supabaseClient

        .from("settings")

        .select("*")

        .limit(1);

    if(error){

        console.log(error);

        return;

    }

    if(!data.length) return;

    const s=data[0];

   document.getElementById("companyName").value = s.company_name || "";

document.getElementById("companyAddress").value = s.address || "";

document.getElementById("companyPhone1").value = s.phone1 || "";

document.getElementById("companyPhone2").value = s.phone2 || "";

document.getElementById("companyEmail").value = s.email || "";

document.getElementById("companyWebsite").value = s.website || "";

document.getElementById("companyGST").value = s.gstin || "";

document.getElementById("companyDL").value = s.dl_no || "";

document.getElementById("companyBank").value = s.bank_name || "";

document.getElementById("companyAccount").value = s.account_number || "";

document.getElementById("companyIFSC").value = s.ifsc || "";

document.getElementById("companyUPI").value = s.upi || "";

document.getElementById("invoiceTerms").value = s.terms || "";

}
