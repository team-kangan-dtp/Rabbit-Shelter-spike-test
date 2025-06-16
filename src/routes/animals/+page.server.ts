import { supabase } from "$lib/supabaseClient";
import { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";

// READ - Load all animals with proper typing
// PageServerLoad is a svelte kit type that mates the function run when page first loads
export const load: PageServerLoad = async () => {
  // Fetch all animal table from the database. Use select() to specify which columns to fetch
  const { data, error } = await supabase.from("animal").select();
  
  // Handle errors gracefully
  if (error) {
    console.error("Supabase error:", error);
    // Return an empty array and the error message
    return {
      animals: [],
      error: error.message
    };
  }
  
  // If no errors return the data
  return {
    animals: data ?? []
  };
};

// Actions are used to handle form submissions
export const actions = {
// CREATE - Add a new animal
// This action action runs when a form is submitted with action="?/create"
create: async ({ request }) => {
  const data = await request.formData();

  // New object withe data from the form fields 
  const animalData = {
    name: data.get('name') as string,
    species: data.get('species') as string,
    breed: data.get('breed') as string,
    dob: data.get('dob') as string || null,
    fur_color: data.get('fur_color') as string || null,
    weight_kg: data.get('weight_kg') as string || null,
    arrival_date: data.get('arrival_date') as string,
    neutered: data.get('neutered') === 'on',
    adoption_status: data.get('adoption_status') as string,
    bonded_with: data.get('bonded_with') as string || null
  };

  // Insert the new animal into the database
  const { error } = await supabase
  .from('animal')
  .insert([animalData]);

  // If there is an error, log it and return a fail response
  if ( error ) {
    console.error('Supabase error:', error);
    return fail(400, { error: error.message });
  } 

  // If no errors, return a success response
  return { success: true };
},

// UPDATE - Update an existing animal
update: async ( { request }) => {
  
}

}