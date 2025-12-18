import { toast } from 'react-toastify';
import { SupabaseClient } from '@supabase/supabase-js';
import type { SearchJobsParams } from '@/hooks/types/jobs/types';

export async function getAllJobs(
    supabase: SupabaseClient,
    {
        location,
        company_id,
        searchQuery
    }: SearchJobsParams
) {
    let query = supabase.from("jobs").select("*, company:companies(name,logo_url)");

    if (location) query = query.eq("location", location)
    if (company_id) query = query.eq("company_id", company_id)
    if (searchQuery) query = query.ilike("title", `%${searchQuery}%`)

    const { data, error } = await query;

    if (error) {
        toast.error("An error occurred. Please try again later.");
        console.error(error);
        return null;
    }

    return data;
}