import { fail } from '@sveltejs/kit';
import { supabase } from "$lib/supabaseClient";
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const { data: users, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        return {
            users: []
        };
    }

    return {
        users: users || []
    };
};

export const actions: Actions = {
    updateUser: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const email = formData.get('email') as string;
        const first_name = formData.get('first_name') as string;
        const last_name = formData.get('last_name') as string;
        const phone = formData.get('phone') as string;
        const role = formData.get('role') as string;

        if (!id || !email || !role) {
            return fail(400, {
                error: 'ID, email, and role are required'
            });
        }

        const { error } = await supabase
            .from('user_profiles')
            .update({
                email,
                first_name: first_name || null,
                last_name: last_name || null,
                phone: phone || null,
                role,
                updated_at: new Date()
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating user:', error);
            return fail(500, {
                error: 'Failed to update user'
            });
        }

        return {
            success: true
        };
    },

    deleteUser: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, {
                error: 'User ID is required'
            });
        }

        const { error } = await supabase
            .from('user_profiles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting user:', error);
            return fail(500, {
                error: 'Failed to delete user'
            });
        }

        return {
            success: true
        };
    }
};