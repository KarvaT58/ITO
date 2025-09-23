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
        
        // Usar valores hardcoded para garantir funcionamento
        const supabaseUrl = 'https://umdzvfpnsfkmswaejavr.supabase.co'
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZHp2ZnBuc2ZrbXN3YWVqYXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5ODY1OTgsImV4cCI6MjA3MzU2MjU5OH0.4jJ2RHRaC32ewUdfCFlUkm0NHLsOFNcLzgkwHikPQUo'
        
        console.log('Carregando Supabase com URL:', supabaseUrl)
        
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
