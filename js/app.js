// Genius Scientific ERP
// Supabase Connection

const SUPABASE_URL = "https://cxssryhesrgomcdxddwn.supabase.co";
const SUPABASE_KEY = "sb_publishable_QiNQzM7U5l6mJpbHIN4UJQ_nv_90lED";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function testConnection() {

    try {

        const { data, error } =
            await supabaseClient
            .from("products")
            .select("*")
            .limit(1);

        if (error) {

            console.error(error);

            alert("Supabase Connected, but table not found.");

            return;

        }

        alert("Supabase Connected Successfully");

    }

    catch (err) {

        console.error(err);

        alert("Connection Failed");

    }

}
