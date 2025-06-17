import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";

// READ - Load all animals with proper typing
// PageServerLoad is a svelte kit type that mates the function run when page first loads
export const load: PageServerLoad = async () => {
  console.log("🚀 Load function started - about to query database");
  
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
  console.log(data);

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
  const data = await request.formData();

  // Get the animal ID to update
  const id = data.get('id') as string;

  // Create object with updated animal data from form fields
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

  // Update the animal in the database
  const { error } = await supabase
  .from('animal')
  .update(animalData)
  .eq('animal_id', id);

  // If there is an error, log it and return a fail response
  if ( error ) {
    console.error('Supabase error:', error);
    return fail(400, { error: error.message });
  } 

  // If no errors, return a success response
  return { success: true };
},

// DELETE - Delete an existing animal
delete: async ( { request }) => {
  const data = await request.formData();

  // Get the animal ID to delete
  const id = data.get('id') as string;

  // Delete the animal from the database
  const { error } = await supabase
  .from('animal')
  .delete()
  .eq('animal_id', id);

  // If there is an error, log it and return a fail response
  if ( error ) {
    console.error('Supabase error:', error);
    return fail(400, { error: error.message });
  } 

  // If no errors, return a success response
  return { success: true };
}
}