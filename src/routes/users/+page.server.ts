import { supabase } from "$lib/supabaseClient";

export async function load() {
    const { data, error } = await supabase.from("user_profiles").select();
    
    if (error) {
        console.error('Error fetching users:', error);
        return {
            users: [] as User[],
        };
    }
    
    console.log('Fetched users:', data);
    
    // Ensure data is of type User[]
    return {
        users: (data as User[]) ?? [],
    };
}