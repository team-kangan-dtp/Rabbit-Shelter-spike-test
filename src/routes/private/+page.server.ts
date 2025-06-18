import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
  depends('supabase:db:notes')
  const { data: notes } = await supabase.from('notes').select('id,note').order('id')
  return { notes: notes ?? [] }
}

export const actions: Actions = {
  logout: async ({ locals: { supabase } }) => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Server logout error:', error)
      return { error: error.message }
    }
    
    redirect(303, '/auth')
  }
}