import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export async function load() {
  try {
    // Replicate the exact curl command: only apikey header
    const response = await fetch(`${PUBLIC_SUPABASE_URL}/rest/v1/animal`, {
      method: 'GET',
      headers: {
        'apikey': PUBLIC_SUPABASE_ANON_KEY
        // No Authorization header - just like your working curl
      }
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const animals = await response.json();
    console.log("Success! Animals:", animals);
    
    return {
      animals: animals
    };
    
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      animals: [],
      error: error.message
    };
  }
}