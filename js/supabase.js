// ==========================================
// Genius Scientific ERP
// Supabase Configuration
// ==========================================

// Replace with your own values
const SUPABASE_URL = "https://cxssryhesrgomcdxddwn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_QiNQzM7U5l6mJpbHIN4UJQ_nv_90lED";

// Create client
const { createClient } = window.supabase;

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Backward compatibility
const supabase = supabaseClient;

// ==========================================
// Helpers
// ==========================================

function isSupabaseReady() {

    if (!supabaseClient) {

        alert("Supabase is not initialized.");

        return false;

    }

    return true;

}

// ==========================================
// Connection Test
// ==========================================

async function testConnection() {

    try {

        const { error } = await supabaseClient
            .from("products")
            .select("id")
            .limit(1);

        if (error) {

            console.error("Supabase Error:", error);

            alert(error.message);

            return false;

        }

        console.log("✓ Connected to Supabase");

        return true;

    }

    catch (err) {

        console.error(err);

        alert("Unable to connect to Supabase.");

        return false;

    }

}

// ==========================================
// Generic Helpers
// ==========================================

async function getAll(table) {

    const { data, error } = await supabaseClient
        .from(table)
        .select("*");

    if (error) throw error;

    return data;

}

async function getById(table, id) {

    const { data, error } = await supabaseClient
        .from(table)
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;

}

async function insertRecord(table, record) {

    const { data, error } = await supabaseClient
        .from(table)
        .insert(record)
        .select();

    if (error) throw error;

    return data;

}

async function updateRecord(table, id, record) {

    const { data, error } = await supabaseClient
        .from(table)
        .update(record)
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;

}

async function deleteRecord(table, id) {

    const { error } = await supabaseClient
        .from(table)
        .delete()
        .eq("id", id);

    if (error) throw error;

}

// ==========================================
// Invoice Number Generator
// ==========================================

async function getNextInvoiceNumber() {

    const year = new Date().getFullYear();

    const prefix = "INV-" + year + "-";

    const { data, error } = await supabaseClient

        .from("Invoice")

        .select("invoice_number")

        .order("invoice_number", { ascending: false })

        .limit(1);

    if (error || !data.length) {

        return prefix + "0001";

    }

    const last = data[0].invoice_number;

    const number = parseInt(last.split("-").pop()) + 1;

    return prefix + String(number).padStart(4, "0");

}

// ==========================================
// Current Date
// ==========================================

function today() {

    return new Date().toISOString().substring(0, 10);

}


function enableResponsiveERP(){document.documentElement.classList.add("erp-mobile-ready");}
document.addEventListener("DOMContentLoaded", enableResponsiveERP);
