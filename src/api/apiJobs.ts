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
        toast.error("An error occurred fetching all jobs. Please try again later.");
        console.error(error);
        return null;
    }

    return data;
}

export async function saveJob(
    supabase: SupabaseClient,
    params: { alreadySaved: boolean; saveData: any }
) {
    const { alreadySaved, saveData } = params;

    if (alreadySaved) {
        const { data, error } = await supabase
            .from("saved_jobs")
            .delete()
            .eq("job_id", saveData.job_id)
            .eq("user_id", saveData.user_id)

        if (error) {
            toast.error("An error occurred removing from saved jobs. Please try again later.");
            console.error(error);
            return null;
        }
        return data;
    }
    else {
        const { data, error } = await supabase
            .from("saved_jobs")
            .insert([saveData])
            .select()

        if (error) {
            toast.error("An error occurred adding to saved jobs. Please try again later.");
            console.error(error);
            return null;
        }
        return data;
    }
}