import { useSupabaseClient } from "@/utils/supabaseClient";
import { useState } from "react";
import { toast } from "react-toastify";
import type { SearchJobsParams } from "./types/jobs/types";

export function useJobs(cb: any, options: SearchJobsParams) {
    const [jobs, setJobs] = useState<any[] | null>(null);
    const [loadingJobs, setLoadingJobs] = useState<boolean>(false);
    const [errorJobs, setErrorJobs] = useState<any>(null);
    const supabase = useSupabaseClient();

    const fetchJobs = async () => {
        setLoadingJobs(true);
        setErrorJobs(null);
        try {
            const data = await cb(supabase, options);
            setJobs(data);
            if (data === null) {
                setErrorJobs(new Error("Failed to fetch jobs"));
            }
        } catch (err) {
            setErrorJobs(err);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoadingJobs(false);
        }
    };

    return { jobs, loadingJobs, errorJobs, fetchJobs };
}