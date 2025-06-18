import { error } from '@sveltejs/kit';
import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
    const userId = params.slug;
    
    const { data, error: supabaseError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (supabaseError) {
        console.error('Error fetching user:', supabaseError);
        throw error(404, 'User not found');
    }

    return {
        user: data as User[],
    };
}