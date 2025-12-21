import { toast } from 'react-toastify';
import { SupabaseClient } from '@supabase/supabase-js';

export async function applyToJob(
    supabase: SupabaseClient,
    _: any,
    jobData: any
) {
    const random = Math.floor(Math.random() * 90000);
    const fileName = `resume-${random}-${jobData.candidate_id}`;

    const { error: storageError } = await supabase.storage.from('resumes').upload(fileName, jobData.resume);

    const resume = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/resumes/${fileName}`;

    const { data, error } = await supabase.from("applications").insert([
        {
            ...jobData,
            resume
        }
    ]).select();

    if (storageError) {
        toast.error("An error occurred submitting application. Please try again later.");
        console.error(error);
        return null;
    }

    return data;
}