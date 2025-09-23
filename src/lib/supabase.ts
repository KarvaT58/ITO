import { createClient } from '@supabase/supabase-js'

// Função para obter o cliente Supabase apenas no cliente
export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // Server-side: retorna um mock
    return {
      auth: {
        signUp: () => Promise.resolve({ data: null, error: { message: 'Server-side rendering not supported' } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Server-side rendering not supported' } }),
        resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Server-side rendering not supported' } }),
        updateUser: () => Promise.resolve({ error: { message: 'Server-side rendering not supported' } }),
        getSession: () => Promise.resolve({ data: { session: null } })
      }
    }
  }

  // Client-side: cria o cliente real
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Exporta uma instância que só funciona no cliente
export const supabase = getSupabaseClient()
