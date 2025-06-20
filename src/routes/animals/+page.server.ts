import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { randomUUID } from 'crypto';

// READ - Load all animals with authentication check
export const load: PageServerLoad = async ({ locals: { session, supabase } }) => {
  // Check if user is authenticated
  if (!session) {
    console.log("❌ No session found, redirecting to auth");
    redirect(303, '/auth');
  }

  console.log("🚀 Load function started - user authenticated, querying database");
  
  // Fetch all animals from the database using the authenticated supabase client
  const { data, error } = await supabase.from("animal").select();
  
  // Handle errors gracefully
  if (error) {
    console.error("Supabase error:", error);
    return {
      animals: [],
      error: error.message
    };
  }
  
  console.log("✅ Animal data from database:", data);

  return {
    animals: data ?? []
  };
};

// Actions with authentication checks
export const actions: Actions = {
  // CREATE - Add a new animal
  create: async ({ request, locals: { session, supabase } }) => {
    // Check authentication
    if (!session) {
      return fail(401, { error: 'Unauthorized' });
    }

    console.log("🚀🚀🚀 CREATE ACTION CALLED! 🚀🚀🚀");
    
    try {
      const data = await request.formData();
      
      console.log("📝 Form data received:");
      for (let [key, value] of data.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      const animalData = {
        animal_id: randomUUID(),
        name: data.get('name') as string,
        species: data.get('species') as string,
        breed: data.get('breed') as string || null,
        dob: data.get('dob') as string || null,
        fur_colour: data.get('fur_colour') as string || null,
        weight_kg: data.get('weight_kg') ? parseFloat(data.get('weight_kg') as string) : null,
        arrival_date: data.get('arrival_date') as string || new Date().toISOString().split('T')[0],
        neutered: data.get('neutered') === 'on',
        adoption_status: data.get('adoption_status') as string || 'No',
        bonded_with: data.get('bonded_with') as string || null
      };

      console.log("💾 Animal data to insert:", animalData);

      const { data: insertedData, error } = await supabase
        .from('animal')
        .insert([animalData])
        .select();

      if (error) {
        console.error('❌ Create error:', error);
        return fail(400, { error: error.message });
      } 

      console.log("✅ Animal created successfully:", insertedData);
      return { success: true };
      
    } catch (err) {
      console.error('❌ Unexpected error in create action:', err);
      return fail(500, { error: 'Unexpected error occurred' });
    }
  },

  // UPDATE - Update an existing animal
  update: async ({ request, locals: { session, supabase } }) => {
    if (!session) {
      return fail(401, { error: 'Unauthorized' });
    }

    console.log("🔄 UPDATE ACTION CALLED");
    const data = await request.formData();
    const id = data.get('animal_id') as string;

    const animalData = {
      name: data.get('name') as string,
      species: data.get('species') as string,
      breed: data.get('breed') as string || null,
      dob: data.get('dob') as string || null,
      fur_colour: data.get('fur_colour') as string || null,
      weight_kg: data.get('weight_kg') ? parseFloat(data.get('weight_kg') as string) : null,
      arrival_date: data.get('arrival_date') as string,
      neutered: data.get('neutered') === 'on',
      adoption_status: data.get('adoption_status') as string,
      bonded_with: data.get('bonded_with') as string || null
    };

    const { error } = await supabase
      .from('animal')
      .update(animalData)
      .eq('animal_id', id);

    if (error) {
      console.error('Update error:', error);
      return fail(400, { error: error.message });
    } 

    return { success: true };
  },

  // DELETE - Delete an existing animal
  delete: async ({ request, locals: { session, supabase } }) => {
    if (!session) {
      return fail(401, { error: 'Unauthorized' });
    }

    console.log("🗑️ DELETE ACTION CALLED");
    const data = await request.formData();
    const id = data.get('animal_id') as string;

    const { error } = await supabase
      .from('animal')
      .delete()
      .eq('animal_id', id);

    if (error) {
      console.error('Delete error:', error);
      return fail(400, { error: error.message });
    } 

    return { success: true };
  }
}