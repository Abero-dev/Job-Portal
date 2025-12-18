import { getAllJobs } from "@/api/apiJobs";
import { useSupabaseClient } from "@/utils/supabaseClient";
import { useState } from "react";
import { toast } from "react-toastify";

export function useJobs() {
    const [jobs, setJobs] = useState<any[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const supabase = useSupabaseClient();

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllJobs(supabase);
            setJobs(data);
            if (data === null) {
                setError(new Error("Failed to fetch jobs"));
            }
        } catch (err) {
            setError(err);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return { jobs, loading, error, fetchJobs };
}