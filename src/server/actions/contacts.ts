'use server'

import { createServerClient } from '@/lib/supabase-server'
import { Zapi } from '@/lib/zapi/endpoints'

// Função auxiliar para verificar autenticação
async function checkAuth(supabase: ReturnType<typeof createServerClient>) {
  const { data: { user } } = await supabase.auth.getUser()
  const isVercel = process.env.VERCEL === '1'
  
  if (!user && !isVercel) {
    throw new Error('Usuário não autenticado')
  }
  
  return { user, isVercel }
}

// Tipos
interface Contact {
  id: string
  name: string
  short?: string
  phone: string
  email?: string
  tags: string[]
  notify?: string
  vname?: string
  imgUrl?: string
  isBlocked?: boolean
  hasWhatsApp?: boolean
  created_at: string
  updated_at: string
}

interface Tag {
  id: string
  name: string
  color: string
  contacts_count: number
  created_at: string
}

// Adicionar contatos à ZAPI
export async function addContactsToZApi(instanceId: string, contacts: Array<{firstName: string, lastName?: string, phone: string}>) {
  try {
    const tokens = await getInstanceTokens(instanceId)
    const result = await Zapi.addContacts(tokens, contacts)
    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao adicionar contatos à ZAPI:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// Remover contatos da ZAPI
export async function removeContactsFromZApi(instanceId: string, phones: string[]) {
  try {
    const tokens = await getInstanceTokens(instanceId)
    const result = await Zapi.removeContacts(tokens, phones)
    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao remover contatos da ZAPI:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// Verificar se número tem WhatsApp
export async function checkPhoneExists(instanceId: string, phone: string) {
  try {
    const tokens = await getInstanceTokens(instanceId)
    const result = await Zapi.checkPhoneExists(tokens, phone)
    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao verificar número:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// Verificar números em lote
export async function checkPhoneExistsBatch(instanceId: string, phones: string[]) {
  try {
    const tokens = await getInstanceTokens(instanceId)
    const result = await Zapi.checkPhoneExistsBatch(tokens, phones)
    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao verificar números em lote:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// Bloquear/desbloquear contato
export async function modifyContactBlocked(instanceId: string, phone: string, action: 'block' | 'unblock') {
  try {
    const tokens = await getInstanceTokens(instanceId)
    const result = await Zapi.modifyContactBlocked(tokens, phone, action)
    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao modificar bloqueio do contato:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// Denunciar contato
export async function reportContact(instanceId: string, phone: string) {
  try {
    const tokens = await getInstanceTokens(instanceId)
    const result = await Zapi.reportContact(tokens, phone)
    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao denunciar contato:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// Pegar metadata do contato
export async function getContactMetadata(instanceId: string, phone: string) {
  try {
    const tokens = await getInstanceTokens(instanceId)
    const result = await Zapi.getContactMetadata(tokens, phone)
    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao pegar metadata do contato:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// Pegar imagem do contato
export async function getContactImage(instanceId: string, phone: string) {
  try {
    const tokens = await getInstanceTokens(instanceId)
    const result = await Zapi.getContactImage(tokens, phone)
    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao pegar imagem do contato:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// Listar contatos da ZAPI
export async function getContactsFromZApi(instanceId: string, page?: number, pageSize?: number) {
  try {
    const result = await Zapi.getContacts(
      { 
          instanceId: instanceId,
          instanceToken: 'token',
          clientSecurityToken: 'security_token'
        },
      page,
      pageSize
    )
    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao listar contatos da ZAPI:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// CRUD de contatos no banco
export async function createContact(contact: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  try {
    const supabase = createServerClient()
    
    // Verificar autenticação
    const { user, isVercel } = await checkAuth(supabase)
    
    // Se estamos no Vercel, usar um UUID mock válido
    const userId = isVercel ? '00000000-0000-0000-0000-000000000000' : user?.id || '00000000-0000-0000-0000-000000000000'
    
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ ...contact, user_id: userId }])
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar contato:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

export async function getContacts(searchTerm?: string, tagFilter?: string) {
  try {
    const supabase = createServerClient()
    
    // Verificar autenticação
    const { user, isVercel } = await checkAuth(supabase)
    
    // Se estamos no Vercel, usar um UUID mock válido
    const userId = isVercel ? '00000000-0000-0000-0000-000000000000' : user?.id || '00000000-0000-0000-0000-000000000000'
    
    let query = supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    }

    if (tagFilter && tagFilter !== 'all') {
      query = query.contains('tags', [tagFilter])
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Erro ao buscar contatos:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

export async function updateContact(id: string, updates: Partial<Contact>) {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('contacts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar contato:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

export async function deleteContact(id: string) {
  try {
    const supabase = createServerClient()
    
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar contato:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// CRUD de etiquetas
export async function createTag(tag: Omit<Tag, 'id' | 'created_at'>) {
  try {
    const supabase = createServerClient()
    
    // Verificar autenticação
    await checkAuth(supabase)
    
    const { data, error } = await supabase
      .from('tags')
      .insert([tag])
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar etiqueta:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

export async function getTags() {
  try {
    const supabase = createServerClient()
    
    // Verificar autenticação
    const { user, isVercel } = await checkAuth(supabase)
    
    // Se estamos no Vercel, usar um UUID mock válido
    const userId = isVercel ? '00000000-0000-0000-0000-000000000000' : user?.id || '00000000-0000-0000-0000-000000000000'
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Erro ao buscar etiquetas:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

export async function updateTag(id: string, updates: Partial<Tag>) {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar etiqueta:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

export async function deleteTag(id: string) {
  try {
    const supabase = createServerClient()
    
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar etiqueta:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// Função para sincronizar contatos da ZAPI
export async function syncContactsFromZApi(instanceId: string) {
  try {
    const tokens = await getInstanceTokens(instanceId)
    const result = await Zapi.getContacts(tokens)

    if (!result || !Array.isArray(result)) {
      return { success: false, error: 'Nenhum contato encontrado na ZAPI' }
    }

    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    const syncedContacts = []

    // Processar cada contato da ZAPI
    for (const zapiContact of result) {
      try {
        // Verificar se contato já existe
        const { data: existingContact } = await supabase
          .from('contacts')
          .select('id')
          .eq('user_id', user?.id || 'default-user')
          .eq('phone', zapiContact.telefone)
          .single()

        if (existingContact) {
          // Atualizar contato existente
          await supabase
            .from('contacts')
            .update({
              name: zapiContact.name || zapiContact.short || 'Contato',
              short: zapiContact.short,
              notify: zapiContact.notify,
              vname: zapiContact.vname,
              img_url: zapiContact.imgUrl,
              has_whatsapp: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingContact.id)
        } else {
          // Criar novo contato
          const { data: newContact } = await supabase
            .from('contacts')
            .insert({
              user_id: user.id,
              name: zapiContact.name || zapiContact.short || 'Contato',
              short: zapiContact.short,
              phone: zapiContact.telefone,
              notify: zapiContact.notify,
              vname: zapiContact.vname,
              img_url: zapiContact.imgUrl,
              has_whatsapp: true,
              tags: []
            })
            .select()
            .single()

          if (newContact) {
            syncedContacts.push(newContact)
          }
        }
      } catch (contactError) {
        console.error('Erro ao processar contato:', contactError)
        // Continuar com os outros contatos
      }
    }

    return { success: true, data: syncedContacts }
  } catch (error) {
    console.error('Erro ao sincronizar contatos da ZAPI:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

// Função auxiliar para buscar tokens da instância
async function getInstanceTokens(instanceId: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Verificar se estamos no Vercel
  const isVercel = process.env.VERCEL === '1'
  
  if (!user && !isVercel) {
    throw new Error('Usuário não autenticado')
  }
  
  // Se estamos no Vercel, pular verificação de usuário
  if (isVercel) {
    console.log('Vercel: Pulando verificação de usuário para Server Actions')
    
    // Se temos um instanceId específico, tentar buscar por ele primeiro
    if (instanceId && instanceId !== 'undefined') {
      const { data: instance, error: instanceError } = await supabase
        .from('zapi_instances')
        .select('instance_id, instance_token, client_security_token')
        .eq('id', instanceId)
        .eq('is_active', true)
        .single()

      if (instance && !instanceError) {
        return {
          instanceId: instance.instance_id,
          instanceToken: instance.instance_token,
          clientSecurityToken: instance.client_security_token
        }
      }
    }
    
    // Se não encontrou por ID específico, buscar primeira instância ativa
    const { data: instances, error: instanceError } = await supabase
      .from('zapi_instances')
      .select('instance_id, instance_token, client_security_token')
      .eq('is_active', true)
      .limit(1)

    if (instanceError || !instances || instances.length === 0) {
      throw new Error('Nenhuma instância ZAPI ativa encontrada')
    }

    const instance = instances[0]
    return {
      instanceId: instance.instance_id,
      instanceToken: instance.instance_token,
      clientSecurityToken: instance.client_security_token
    }
  }

  const { data: instance, error: instanceError } = await supabase
    .from('zapi_instances')
    .select('instance_id, instance_token, client_security_token')
    .eq('id', instanceId)
    .eq('user_id', user?.id || 'default-user')
    .single()

  if (instanceError || !instance) {
    throw new Error('Instância não encontrada')
  }

  return {
    instanceId: instance.instance_id,
    instanceToken: instance.instance_token,
    clientSecurityToken: instance.client_security_token
  }
}
