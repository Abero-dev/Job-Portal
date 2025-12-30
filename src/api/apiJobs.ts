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
    if (company_id) query = query.eq("company_id", parseInt(company_id))
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

export async function getSingleJob(
    supabase: SupabaseClient,
    job_id: number
) {
    const { data, error } = await supabase
        .from("jobs")
        .select("*, company:companies(name,logo_url), applications:applications(*)")
        .eq("id", job_id)
        .single()

    if (error) {
        toast.error("An error occurred getting the job. Please try again later.");
        console.error(error);
        return null;
    }

    return data;
}

export async function updateHiringStatus(
    supabase: SupabaseClient,
    params: { job_id: number; isOpen: boolean }
) {
    const { job_id, isOpen } = params;

    const { data, error } = await supabase
        .from("jobs")
        .update({ isOpen })
        .eq("id", job_id)
        .select()

    if (error) {
        toast.error("An error occurred updating the job. Please try again later.");
        console.error("Update error:", error);
        return null;
    }

    toast.success("Job hiring status updated correctly.");

    return data;
}

export async function addNewJob(
    supabase: SupabaseClient,
    params: { job_data: any }
) {
    const { job_data } = params;

    const { data, error } = await supabase
        .from("jobs")
        .insert([job_data])
        .select()

    if (error) {
        toast.error("An error occurred adding a new job. Please try again later.");
        console.error("Insert error:", error);
        return null;
    }

    toast.success("Job added correctly.");

    return data;
}

export async function getSavedJobs(
    supabase: SupabaseClient,
) {

    const { data, error } = await supabase
        .from("saved_jobs")
        .select("*, job:jobs(*, company:companies(name,logo_url))")

    if (error) {
        toast.error("An error occurred getting saved jobs. Please try again later.");
        console.error("Get error:", error);
        return null;
    }

    return data;
}