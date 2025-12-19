import { useSupabaseClient } from "@/utils/supabaseClient";
import { useState } from "react";
import { toast } from "react-toastify";
import type { SearchJobsParams } from "./types/jobs/types";

export function useJobs(cb: any, initialOptions: SearchJobsParams | null = null) {
    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const supabase = useSupabaseClient();

    const fn = async (...args: any) => {
        setLoading(true);
        setError(null);
        try {
            const params = args.length > 0 ? args[0] : initialOptions;
            const res = await cb(supabase, params);
            setData(res);
            if (res === null) {
                setError(new Error("Failed to fetch jobs"));
            }
        } catch (err) {
            setError(err);
            console.error(err)
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn };
}