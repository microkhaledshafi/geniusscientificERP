// ========================================
// Genius Scientific ERP v7
// Supabase Configuration
// ========================================

// Paste your values here
const SUPABASE_URL = "https://cxssryhesrgomcdxddwn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_QiNQzM7U5l6mJpbHIN4UJQ_nv_90lED";

// Create client
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Test connection
async function testConnection() {

    try {

        const { error } = await supabaseClient
            .from("products")
            .select("id")
            .limit(1);

        if (error) {
            alert(error.message);
            return;
        }

        alert("Supabase Connected Successfully");

    } catch (err) {

        console.error(err);
        alert("Connection Failed");

    }

}
