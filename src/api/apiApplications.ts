import { toast } from 'react-toastify';
import { SupabaseClient } from '@supabase/supabase-js';

export async function applyToJob(
    supabase: SupabaseClient,
    jobData: any
) {
    try {
        const random = Math.floor(Math.random() * 90000);
        const fileName = `resume-${random}-${jobData.candidate_id}`;

        const { error: storageError } = await supabase
            .storage
            .from('resumes')
            .upload(fileName, jobData.resume);

        if (storageError) {
            console.error('Storage error:', storageError);
            toast.error("Failed to upload resume. Please try again.");
            return null;
        }

        const resumeUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/resumes/${fileName}`;

        const { data, error } = await supabase
            .from("applications")
            .insert([
                {
                    job_id: jobData.job_id,
                    candidate_id: jobData.candidate_id,
                    name: jobData.name,
                    status: jobData.status,
                    experience: jobData.experience,
                    skills: jobData.skills,
                    education: jobData.education,
                    resume: resumeUrl
                }
            ])
            .select();

        if (error) {
            console.error('Database error:', error);
            toast.error("Failed to submit application. Please try again.");
            return null;
        }

        toast.success("Application submitted successfully!");
        return data;

    } catch (error) {
        console.error('Unexpected error:', error);
        toast.error("An unexpected error occurred. Please try again.");
        return null;
    }
}