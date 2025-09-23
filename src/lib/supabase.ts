// Mock do Supabase para server-side
const mockSupabase = {
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: 'Server-side rendering not supported' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Server-side rendering not supported' } }),
    resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Server-side rendering not supported' } }),
    updateUser: () => Promise.resolve({ error: { message: 'Server-side rendering not supported' } }),
    getSession: () => Promise.resolve({ data: { session: null } })
  }
}

// Função para obter o cliente Supabase
export const getSupabaseClient = () => {
  // Sempre retorna mock durante build/SSR
  if (typeof window === 'undefined') {
    return mockSupabase
  }

  // Client-side: cria o cliente real
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found, using mock client')
    return mockSupabase
  }
  
  // Verificar se as variáveis são válidas
  if (!supabaseUrl.startsWith('http')) {
    console.warn('Invalid Supabase URL, using mock client')
    return mockSupabase
  }
  
  // Lazy import do Supabase apenas no cliente
  try {
    const { createClient } = require('@supabase/supabase-js')
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Erro ao carregar Supabase:', error)
    return mockSupabase
  }
}

// Exporta uma instância que só funciona no cliente
export const supabase = getSupabaseClient()
