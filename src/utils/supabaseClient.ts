import { useSession } from '@clerk/clerk-react'
import { createClient } from '@supabase/supabase-js'

export function useSupabaseClient() {
    const { session } = useSession();
    const supabaseClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
            accessToken: async () => session?.getToken() ?? null,
        }
    )
    return supabaseClient;
}