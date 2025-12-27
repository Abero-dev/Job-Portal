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

    const random = Math.floor(Math.random() * 90000);
    const fileName = `logo-${random}-${company_data.name}`;

    const { error: storageError } = await supabase
        .storage
        .from('company-logo')
        .upload(fileName, company_data.logo);

    if (storageError) {
        console.error('Storage error:', storageError);
        toast.error("Failed to upload company logo. Please try again.");
        return null;
    }

    const logo_url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/company-logo/${fileName}`;

    const { data, error } = await supabase
        .from("companies")
        .insert([{
            name: company_data.name,
            logo_url,
        }])
        .select()

    if (error) {
        toast.error("An error occurred adding a new company. Please try again later.");
        console.error("Insert error:", error);
        return null;
    }

    toast.success("Company added correctly.");

    return data;
}