import { useEffect, useState } from 'react'

export const useSupabase = () => {
  const [supabase, setSupabase] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Lazy load do Supabase apenas no cliente
    const loadSupabase = async () => {
      try {
        // Verificar se estamos no cliente
        if (typeof window === 'undefined') {
          setSupabase({
            auth: {
              signUp: () => Promise.resolve({ data: null, error: { message: 'Server-side rendering not supported' } }),
              signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Server-side rendering not supported' } }),
              resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Server-side rendering not supported' } }),
              updateUser: () => Promise.resolve({ error: { message: 'Server-side rendering not supported' } }),
              getSession: () => Promise.resolve({ data: { session: null } })
            }
          })
          return
        }

        // Carregar Supabase apenas no cliente
        const { createClient } = await import('@supabase/supabase-js')
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase credentials not found')
        }
        
        if (!supabaseUrl.startsWith('http')) {
          throw new Error('Invalid Supabase URL')
        }
        
        const client = createClient(supabaseUrl, supabaseAnonKey)
        setSupabase(client)
      } catch (error) {
        console.warn('Erro ao carregar Supabase:', error)
        // Retorna mock em caso de erro
        setSupabase({
          auth: {
            signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase não disponível' } }),
            signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase não disponível' } }),
            resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Supabase não disponível' } }),
            updateUser: () => Promise.resolve({ error: { message: 'Supabase não disponível' } }),
            getSession: () => Promise.resolve({ data: { session: null } })
          }
        })
      }
    }
    
    loadSupabase()
  }, [])

  return { supabase, isClient }
}
