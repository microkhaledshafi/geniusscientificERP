// ========================================
// Genius Scientific ERP v7
// Supabase Configuration
// ========================================

// Paste your values here
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

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
