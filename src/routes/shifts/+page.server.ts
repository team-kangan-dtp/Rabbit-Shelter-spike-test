// src/routes/shifts/+page.server.ts
import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";

// Load all shifts
export const load: PageServerLoad = async () => {
    console.log("🚀 Loading shifts...");
    
    const { data, error } = await supabase.from("shift").select();
    
    if (error) {
        console.error("Supabase error:", error);
        return {
            shifts: [],
            error: error.message
        };
    }
    
    console.log("✅ Shifts loaded:", data);
    return {
        shifts: data ?? []
    };
};

// Form actions
export const actions: Actions = {
    create: async ({ request }) => {
        console.log("🚀 Creating shift...");
        
        try {
            const formData = await request.formData();
            
            // Log form data
            console.log("📝 Form data:");
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}: ${value}`);
            }

            // Generate new shift ID
            const { data: maxShift } = await supabase
                .from('shift')
                .select('shift_id')
                .order('shift_id', { ascending: false })
                .limit(1);
            
            const newShiftId = maxShift?.length ? maxShift[0].shift_id + 1 : 1;

            const shiftData = {
                shift_id: newShiftId,
                shift_name: formData.get('shift_name') as string,
                start_time: formData.get('start_time') as string,
                end_time: formData.get('end_time') as string
            };

            console.log("💾 Shift data:", shiftData);

            const { data: insertedData, error } = await supabase
                .from('shift')
                .insert([shiftData])
                .select();

            if (error) {
                console.error('❌ Create error:', error);
                return fail(400, { error: error.message });
            } 

            console.log("✅ Shift created:", insertedData);
            return { success: true };
            
        } catch (err) {
            console.error('❌ Unexpected error:', err);
            return fail(500, { error: 'Unexpected error occurred' });
        }
    },

    update: async ({ request }) => {
        console.log("🔄 Updating shift...");
        const formData = await request.formData();
        const id = parseInt(formData.get('shift_id') as string);

        const shiftData = {
            shift_name: formData.get('shift_name') as string,
            start_time: formData.get('start_time') as string,
            end_time: formData.get('end_time') as string
        };

        const { error } = await supabase
            .from('shift')
            .update(shiftData)
            .eq('shift_id', id);

        if (error) {
            console.error('❌ Update error:', error);
            return fail(400, { error: error.message });
        } 

        return { success: true };
    },

    delete: async ({ request }) => {
        console.log("🗑️ Deleting shift...");
        const formData = await request.formData();
        const id = parseInt(formData.get('shift_id') as string);

        const { error } = await supabase
            .from('shift')
            .delete()
            .eq('shift_id', id);

        if (error) {
            console.error('❌ Delete error:', error);
            return fail(400, { error: error.message });
        } 

        return { success: true };
    }
};