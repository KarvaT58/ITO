import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

export const useSupabase = () => {
  const [supabase, setSupabase] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setSupabase(getSupabaseClient())
  }, [])

  return { supabase, isClient }
}
