import { useEffect, useState } from 'react'

// Singleton para evitar múltiplas instâncias
let supabaseInstance: unknown = null

export const useSupabase = () => {
  const [supabase, setSupabase] = useState<unknown>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Se já temos uma instância, usar ela
    if (supabaseInstance) {
      setSupabase(supabaseInstance)
      return
    }
    
    // Lazy load do Supabase apenas no cliente
    const loadSupabase = async () => {
      try {
        // Verificar se estamos no cliente
        if (typeof window === 'undefined') {
          const mockClient = {
            auth: {
              signUp: () => Promise.resolve({ data: null, error: { message: 'Server-side rendering not supported' } }),
              signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Server-side rendering not supported' } }),
              resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Server-side rendering not supported' } }),
              updateUser: () => Promise.resolve({ error: { message: 'Server-side rendering not supported' } }),
              getSession: () => Promise.resolve({ data: { session: null } })
            }
          }
          setSupabase(mockClient)
          return
        }

        // Carregar Supabase apenas no cliente
        const { createClient } = await import('@supabase/supabase-js')
        
        // Usar variáveis de ambiente ou valores hardcoded como fallback
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://umdzvfpnsfkmswaejavr.supabase.co'
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZHp2ZnBuc2ZrbXN3YWVqYXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5ODY1OTgsImV4cCI6MjA3MzU2MjU5OH0.4jJ2RHRaC32ewUdfCFlUkm0NHLsOFNcLzgkwHikPQUo'
        
        console.log('Carregando Supabase com URL:', supabaseUrl)
        console.log('Chave anônima:', supabaseAnonKey.substring(0, 20) + '...')
        
        const client = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        })
        
        console.log('Cliente Supabase criado:', client)
        supabaseInstance = client
        setSupabase(client)
      } catch (error) {
        console.warn('Erro ao carregar Supabase:', error)
        // Retorna mock em caso de erro
        const mockClient = {
          auth: {
            signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase não disponível' } }),
            signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase não disponível' } }),
            resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Supabase não disponível' } }),
            updateUser: () => Promise.resolve({ error: { message: 'Supabase não disponível' } }),
            getSession: () => Promise.resolve({ data: { session: null } })
          }
        }
        setSupabase(mockClient)
      }
    }
    
    loadSupabase()
  }, [])

  return { supabase, isClient }
}
