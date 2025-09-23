import { useEffect, useState } from 'react'

export const useSupabase = () => {
  const [supabase, setSupabase] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Lazy load do Supabase apenas no cliente
    const loadSupabase = async () => {
      try {
        const { getSupabaseClient } = await import('@/lib/supabase')
        setSupabase(getSupabaseClient())
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
