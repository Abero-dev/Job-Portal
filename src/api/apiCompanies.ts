import { toast } from 'react-toastify';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getAllCompanies(
    supabase: SupabaseClient,
) {
    const { data, error } = await supabase.from("companies").select("*");;

    if (error) {
        toast.error("An error occurred getting all companies. Please try again later.");
        console.error(error);
        return null;
    }

    return data;
}

export async function addNewCompany(
    supabase: SupabaseClient,
    params: { company_data: any }
) {
    const { company_data } = params;

    const { data, error } = await supabase
        .from("companies")
        .insert([company_data])
        .select()

    if (error) {
        toast.error("An error occurred adding a new company. Please try again later.");
        console.error("Insert error:", error);
        return null;
    }

    toast.success("Company added correctly.");

    return data;
}