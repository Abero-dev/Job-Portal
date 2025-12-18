import { toast } from 'react-toastify';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getAllCompanies(
    supabase: SupabaseClient,
) {
    const { data, error } = await supabase.from("companies").select("*");;

    if (error) {
        toast.error("An error occurred. Please try again later.");
        console.error(error);
        return null;
    }

    return data;
}