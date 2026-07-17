// ========================================
// Genius Scientific ERP v7
// supabase.js
// ========================================

const SUPABASE_URL =
    localStorage.getItem("SUPABASE_URL") || "";

const SUPABASE_KEY =
    localStorage.getItem("SUPABASE_KEY") || "";

let supabaseClient = null;

function initialiseSupabase() {

    if (!SUPABASE_URL || !SUPABASE_KEY) {

        console.warn("Supabase not configured");

        return false;

    }

    try {

        supabaseClient = supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        console.log("Supabase Connected");

        return true;

    }

    catch (err) {

        console.error(err);

        return false;

    }

}

async function testConnection() {

    if (!supabaseClient) {

        initialiseSupabase();

    }

    if (!supabaseClient) {

        toast("Configure Supabase First", "#dc3545");

        return;

    }

    const { error } = await supabaseClient
        .from("products")
        .select("id")
        .limit(1);

    if (error) {

        toast(error.message, "#dc3545");

        console.error(error);

        return;

    }

    toast("Supabase Connected");

}

window.addEventListener("load", initialiseSupabase);
