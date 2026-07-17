//==========================================
// Genius Scientific ERP
// Supabase Configuration
//==========================================

// Replace with your own values
const SUPABASE_URL = "https://cxssryhesrgomcdxddwn.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

//==========================================
// Create Supabase Client
//==========================================

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

//==========================================
// Test Connection
//==========================================

async function testConnection() {

    try {

        const { error } = await supabaseClient
            .from("products")
            .select("id")
            .limit(1);

        if (error) {
            console.error(error);
            alert("Supabase Error:\n" + error.message);
            return false;
        }

        console.log("Supabase Connected Successfully");
        return true;

    } catch (err) {

        console.error(err);
        alert("Unable to connect to Supabase.");
        return false;

    }

}

//==========================================
// Helper
//==========================================

function isSupabaseReady() {

    if (!supabaseClient) {

        alert("Supabase Client Not Initialised");

        return false;

    }

    return true;

}

//==========================================
// Auto Connection Test
//==========================================

document.addEventListener("DOMContentLoaded", async () => {

    await testConnection();

});
