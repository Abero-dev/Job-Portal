import { getAllCompanies } from "@/api/apiCompanies";
import { useSupabaseClient } from "@/utils/supabaseClient";
import { useState } from "react";
import { toast } from "react-toastify";

export function useCompanies() {
    const [companies, setCompanies] = useState<any[] | null>(null);
    const [loadingCompany, setLoadingCompany] = useState<boolean>(false);
    const [errorCompany, setErrorCompany] = useState<any>(null);
    const supabase = useSupabaseClient();

    const fetchCompanies = async () => {
        setLoadingCompany(true);
        setErrorCompany(null);
        try {
            const data = await getAllCompanies(supabase);
            setCompanies(data);
            if (data === null) {
                setErrorCompany(new Error("Failed to fetch Companies"));
            }
        } catch (err) {
            setErrorCompany(err);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoadingCompany(false);
        }
    };

    return { companies, loadingCompany, errorCompany, fetchCompanies };
}