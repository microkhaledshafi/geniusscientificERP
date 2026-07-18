//=========================================
// Genius Scientific ERP
// Settings
//=========================================

async function saveSettings(){

    if(!isSupabaseReady()) return;

    const settings={

        company:document.getElementById("companyName").value,

        gst:document.getElementById("companyGST").value,

        dl:document.getElementById("companyDL").value,

        phone1:document.getElementById("companyPhone1").value,

        phone2:document.getElementById("companyPhone2").value,

        email:document.getElementById("companyEmail").value,

        website:document.getElementById("companyWebsite").value,

        upi:document.getElementById("companyUPI").value,

        bank:document.getElementById("companyBank").value,

        account:document.getElementById("companyAccount").value,

        ifsc:document.getElementById("companyIFSC").value,

        address:document.getElementById("companyAddress").value,

        terms:document.getElementById("invoiceTerms").value

    };

    const {error}=await supabaseClient

        .from("settings")

        .upsert(settings);

    if(error){

        alert(error.message);

        return;

    }

    alert("Settings Saved");

}

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

    document.getElementById("companyName").value=s.company||"";

    document.getElementById("companyGST").value=s.gst||"";

    document.getElementById("companyDL").value=s.dl||"";

    document.getElementById("companyPhone1").value=s.phone1||"";

    document.getElementById("companyPhone2").value=s.phone2||"";

    document.getElementById("companyEmail").value=s.email||"";

    document.getElementById("companyWebsite").value=s.website||"";

    document.getElementById("companyUPI").value=s.upi||"";

    document.getElementById("companyBank").value=s.bank||"";

    document.getElementById("companyAccount").value=s.account||"";

    document.getElementById("companyIFSC").value=s.ifsc||"";

    document.getElementById("companyAddress").value=s.address||"";

    document.getElementById("invoiceTerms").value=s.terms||"";

}
