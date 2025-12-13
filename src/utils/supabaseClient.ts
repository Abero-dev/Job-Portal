// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/clerk-react'; // Usa el SDK de React

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Función para crear un cliente en componentes React
export const useSupabaseClient = () => {
    const { session } = useSession();

    const client = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            // Intercepta cada petición para añadir el token de Clerk
            fetch: async (url, options = {}) => {
                const clerkToken = await session?.getToken();
                const headers = new Headers(options?.headers);

                if (clerkToken) {
                    headers.set('Authorization', `Bearer ${clerkToken}`);
                }

                return fetch(url, {
                    ...options,
                    headers,
                });
            },
        },
    });

    return client;
};

// Cliente para uso fuera de componentes React (ej: en utilidades)
export const getSupabaseClient = (token?: string) => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
            },
        },
    });
};