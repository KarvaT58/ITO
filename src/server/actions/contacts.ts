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

// Função para normalizar números de telefone brasileiros
function normalizePhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '')
  
  console.log('Normalizando número:', phone, '→', cleanPhone)
  
  // Se não começa com 55, adiciona
  let processedPhone = cleanPhone
  if (!cleanPhone.startsWith('55') && cleanPhone.length >= 10) {
    processedPhone = '55' + cleanPhone
  }
  
  // Se começa com 55 (Brasil), processa
  if (processedPhone.startsWith('55') && processedPhone.length >= 12) {
    const ddd = processedPhone.substring(2, 4)
    const number = processedPhone.substring(4)
    
    console.log('DDD:', ddd, 'Número:', number, 'Tamanho:', number.length)
    
    // Se tem 9 dígitos no número (13 total), remove o 9 extra
    if (number.length === 9 && number.startsWith('9')) {
      const normalized = `55${ddd}${number.substring(1)}`
      console.log('Normalizado (removendo 9):', normalized)
      return normalized
    }
    // Se tem 8 dígitos no número (12 total), adiciona o 9
    else if (number.length === 8) {
      const normalized = `55${ddd}9${number}`
      console.log('Normalizado (adicionando 9):', normalized)
      return normalized
    }
  }
  
  console.log('Número final:', processedPhone)
  return processedPhone
}

// Função para gerar variações de um número para verificação
function getPhoneVariations(phone: string): string[] {
  const cleanPhone = phone.replace(/\D/g, '')
  const variations = []
  
  console.log('Gerando variações para:', phone, '→', cleanPhone)
  
  // Se não começa com 55, adiciona
  let processedPhone = cleanPhone
  if (!cleanPhone.startsWith('55') && cleanPhone.length >= 10) {
    processedPhone = '55' + cleanPhone
  }
  
  // Se começa com 55, processa
  if (processedPhone.startsWith('55') && processedPhone.length >= 12) {
    const ddd = processedPhone.substring(2, 4)
    const number = processedPhone.substring(4)
    
    console.log('DDD:', ddd, 'Número original:', number, 'Tamanho:', number.length)
    
    // Adiciona a versão original
    variations.push(processedPhone)
    
    // Se tem 8 dígitos (sem 9), cria versão com 9
    if (number.length === 8) {
      const with9 = `55${ddd}9${number}`
      variations.push(with9)
      console.log('Adicionando versão com 9:', with9)
    }
    
    // Se tem 9 dígitos (com 9), cria versão sem 9
    if (number.length === 9 && number.startsWith('9')) {
      const without9 = `55${ddd}${number.substring(1)}`
      variations.push(without9)
      console.log('Adicionando versão sem 9:', without9)
    }
  } else {
    // Se não tem 55, adiciona como está
    variations.push(processedPhone)
  }
  
  console.log('Variações finais:', variations)
  return variations
}

// Função para verificar se contato já existe
async function checkContactExists(phone: string, userId: string): Promise<{ exists: boolean; existingContact?: unknown }> {
  const supabase = createServerClient()
  const variations = getPhoneVariations(phone)
  
  console.log('Verificando duplicatas para:', phone)
  console.log('Variações geradas:', variations)
  console.log('User ID:', userId)
  
  for (const variation of variations) {
    console.log('Verificando variação:', variation)
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('phone', variation)
      .single()
    
    console.log('Resultado da busca:', { data, error })
    
    if (data && !error) {
      console.log('Contato duplicado encontrado:', data)
      return { exists: true, existingContact: data }
    }
  }
  
  console.log('Nenhum contato duplicado encontrado')
  return { exists: false }
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
  is_blocked?: boolean
  has_whatsapp?: boolean
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
    console.log(`🔍 Verificando WhatsApp para ${phone} com tokens:`, { 
      instanceId: tokens?.instanceId, 
      hasToken: !!tokens,
      phone 
    })
    
    if (!tokens) {
      throw new Error('Tokens não encontrados')
    }
    
    const result = await Zapi.checkPhoneExists(tokens, phone)
    console.log(`📱 Resposta Z-API para ${phone}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`❌ Erro ao verificar número ${phone}:`, error)
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
    
    // Verificar se contato já existe
    const { exists, existingContact } = await checkContactExists(contact.phone, userId)
    
    if (exists) {
      return { 
        success: false, 
        error: 'Contato já existe',
        duplicate: true,
        existingContact: existingContact
      }
    }
    
    // Normalizar número de telefone
    const normalizedPhone = normalizePhoneNumber(contact.phone)
    
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ ...contact, phone: normalizedPhone, user_id: userId }])
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar contato:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

export async function getContacts(searchTerm?: string, tagFilter?: string, page: number = 1, pageSize: number = 40) {
  try {
    const supabase = createServerClient()
    
    // Verificar autenticação
    const { user, isVercel } = await checkAuth(supabase)
    
    // Se estamos no Vercel, usar um UUID mock válido
    const userId = isVercel ? '00000000-0000-0000-0000-000000000000' : user?.id || '00000000-0000-0000-0000-000000000000'
    
    // Calcular offset para paginação
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    // Query para buscar contatos com paginação
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    }

    if (tagFilter && tagFilter !== 'all') {
      query = query.contains('tags', [tagFilter])
    }

    const { data, error, count } = await query

    if (error) throw error

    // Calcular informações de paginação
    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)

    return { 
      success: true, 
      data: data || [],
      pagination: {
        currentPage: page,
        totalPages,
        total,
        pageSize
      }
    }
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
    const { user, isVercel } = await checkAuth(supabase)
    
    // Se estamos no Vercel, usar um user_id mock (UUID válido)
    const userId = isVercel ? '00000000-0000-0000-0000-000000000000' : user?.id
    
    if (!userId) {
      throw new Error('Usuário não identificado')
    }
    
    const { data, error } = await supabase
      .from('tags')
      .insert([{ ...tag, user_id: userId }])
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

// Função para importar contatos CSV com verificação de duplicatas
// Função para processar importação em background
export async function processImportInBackground(contacts: Array<{
  name: string
  phone: string
  email?: string
  tag?: string
  has_whatsapp?: boolean
}>, instanceId: string) {
  try {
    const supabase = createServerClient()
    const { user, isVercel } = await checkAuth(supabase)
    const userId = isVercel ? '00000000-0000-0000-0000-000000000000' : user?.id
    
    if (!userId) {
      throw new Error('Usuário não identificado')
    }

    const verifiedContacts = []
    let verifiedCount = 0

    // Processar cada contato com delay para evitar sobrecarga
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i]
      
      try {
        // Buscar tokens da instância
        const tokens = await getInstanceTokens(instanceId)
        if (!tokens) {
          throw new Error('Instância Z-API não encontrada')
        }

        // Verificar WhatsApp com timeout
        const whatsappResult = await Promise.race([
          Zapi.checkPhoneExists({ 
            instanceId, 
            instanceToken: tokens.instanceToken, 
            clientSecurityToken: tokens.clientSecurityToken 
          }, contact.phone),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 8000)
          )
        ]) as { exists?: boolean; existe?: boolean }
        
        console.log(`🔍 Verificação WhatsApp para ${contact.phone}:`, whatsappResult)
        
        const hasWhatsApp = whatsappResult?.exists === true || whatsappResult?.existe === true
        
        verifiedContacts.push({
          ...contact,
          has_whatsapp: hasWhatsApp
        })
        
        if (hasWhatsApp) {
          verifiedCount++
        }
      } catch (error) {
        console.error(`Erro ao verificar WhatsApp para ${contact.phone}:`, error)
        verifiedContacts.push({
          ...contact,
          has_whatsapp: false
        })
      }
      
      // Delay entre verificações
      if (i < contacts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }

    // Importar contatos verificados
    const result = await importContactsFromCSV(verifiedContacts)
    
    return {
      success: true,
      data: {
        ...result.data,
        verifiedCount,
        totalContacts: contacts.length
      }
    }
  } catch (error) {
    console.error('Erro no processamento em background:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

export async function importContactsFromCSV(contacts: Array<{
  name: string
  phone: string
  email?: string
  tag?: string
  has_whatsapp?: boolean
}>) {
  try {
    const supabase = createServerClient()
    
    // Verificar autenticação
    const { user, isVercel } = await checkAuth(supabase)
    
    // Se estamos no Vercel, usar um UUID mock válido
    const userId = isVercel ? '00000000-0000-0000-0000-000000000000' : user?.id || '00000000-0000-0000-0000-000000000000'
    
    // Coletar todas as etiquetas únicas do CSV
    const uniqueTags = [...new Set(contacts.map(c => c.tag).filter(Boolean))]
    
    // Criar etiquetas que não existem
    const createdTags = []
    for (const tagName of uniqueTags) {
      if (tagName) {
        try {
          // Verificar se etiqueta já existe
          const { data: existingTag } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tagName)
            .eq('user_id', userId)
            .single()
          
          if (!existingTag) {
            // Criar nova etiqueta
            const { data: newTag, error: tagError } = await supabase
              .from('tags')
              .insert([{
                name: tagName,
                color: '#3b82f6', // Cor padrão azul
                user_id: userId
              }])
              .select()
              .single()
            
            if (!tagError && newTag) {
              createdTags.push(newTag)
              console.log(`Etiqueta criada: ${tagName}`)
            }
          }
        } catch (error) {
          console.error(`Erro ao criar etiqueta ${tagName}:`, error)
        }
      }
    }
    
    const validContacts = []
    const duplicates = []
    const errors = []
    
    // Processar cada contato
    for (const contact of contacts) {
      try {
        // Verificar se contato já existe
        const { exists, existingContact } = await checkContactExists(contact.phone, userId)
        
        if (exists) {
          duplicates.push({
            contact,
            existingContact,
            reason: 'Contato já existe'
          })
          continue
        }
        
        // Normalizar número de telefone
        const normalizedPhone = normalizePhoneNumber(contact.phone)
        
        // Preparar dados do contato
        const contactData = {
          name: contact.name,
          phone: normalizedPhone,
          email: contact.email || null,
          tags: contact.tag ? [contact.tag] : [],
          has_whatsapp: contact.has_whatsapp || false,
          user_id: userId
        }
        
        validContacts.push(contactData)
        
      } catch (error) {
        errors.push({
          contact,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }
    
    // Inserir contatos válidos em lote
    let insertedContacts = []
    if (validContacts.length > 0) {
      const { data, error } = await supabase
        .from('contacts')
        .insert(validContacts)
        .select()
      
      if (error) throw error
      insertedContacts = data || []
    }
    
    return { 
      success: true, 
      data: {
        imported: insertedContacts.length,
        duplicates: duplicates.length,
        errors: errors.length,
        total: contacts.length,
        tagsCreated: createdTags.length,
        createdTags: createdTags.map(tag => tag.name),
        details: {
          inserted: insertedContacts,
          duplicates,
          errors
        }
      }
    }
    
  } catch (error) {
    console.error('Erro ao importar contatos:', error)
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
// Função para sincronização em background
export async function syncContactsInBackground(instanceId: string) {
  try {
    const supabase = createServerClient()
    const { user, isVercel } = await checkAuth(supabase)
    const userId = isVercel ? '00000000-0000-0000-0000-000000000000' : user?.id
    
    if (!userId) {
      throw new Error('Usuário não identificado')
    }

    // Buscar tokens da instância
    const tokens = await getInstanceTokens(instanceId)
    if (!tokens) {
      throw new Error('Instância Z-API não encontrada')
    }

    // Buscar contatos da Z-API
    const zapiContacts = await Zapi.getContacts({ 
      instanceId, 
      instanceToken: tokens.instanceToken, 
      clientSecurityToken: tokens.clientSecurityToken 
    })
    
    if (!zapiContacts || !Array.isArray(zapiContacts)) {
      throw new Error('Erro ao buscar contatos da Z-API')
    }

    let syncedCount = 0
    let errorCount = 0

    // Processar cada contato com delay
    for (let i = 0; i < zapiContacts.length; i++) {
      const contact = zapiContacts[i]
      
      try {
        const normalizedPhone = normalizePhoneNumber(contact.phone)
        
        // Verificar se o contato já existe
        const { data: existingContact } = await supabase
          .from('contacts')
          .select('id')
          .eq('phone', normalizedPhone)
          .eq('user_id', userId)
          .single()

        if (!existingContact) {
          // Criar novo contato
          const { error } = await supabase
            .from('contacts')
            .insert([{
              name: contact.name || contact.short || 'Contato sem nome',
              phone: normalizedPhone,
              email: null,
              tags: [],
              has_whatsapp: true,
              is_blocked: false,
              user_id: userId
            }])

          if (!error) {
            syncedCount++
          } else {
            errorCount++
            console.error('Erro ao criar contato:', error)
          }
        }
      } catch (error) {
        console.error(`Erro ao processar contato ${contact.phone}:`, error)
        errorCount++
      }
      
      // Delay entre processamentos
      if (i < zapiContacts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    return {
      success: true,
      data: {
        synced: syncedCount,
        errors: errorCount,
        total: zapiContacts.length
      }
    }
  } catch (error) {
    console.error('Erro na sincronização em background:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

export async function syncContactsFromZApi(instanceId: string) {
  try {
    const tokens = await getInstanceTokens(instanceId)
    
    // Buscar todos os contatos usando paginação
    let allContacts: unknown[] = []
    let page = 1
    const pageSize = 100 // Buscar 100 contatos por vez
    
    while (true) {
      console.log(`Buscando contatos - página ${page}, tamanho ${pageSize}`)
      const result = await Zapi.getContacts(tokens, page, pageSize)
      
      if (!result || !Array.isArray(result) || result.length === 0) {
        console.log(`Nenhum contato encontrado na página ${page}`)
        break
      }
      
      allContacts = allContacts.concat(result)
      console.log(`Página ${page}: ${result.length} contatos encontrados. Total: ${allContacts.length}`)
      
      // Se retornou menos que o pageSize, é a última página
      if (result.length < pageSize) {
        console.log('Última página atingida')
        break
      }
      
      page++
    }

    if (allContacts.length === 0) {
      return { success: false, error: 'Nenhum contato encontrado na ZAPI' }
    }

    console.log(`Total de contatos encontrados: ${allContacts.length}`)
    const result = allContacts

    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Verificar se estamos no Vercel
    const isVercel = process.env.VERCEL === '1'
    
    if (!user && !isVercel) {
      return { success: false, error: 'Usuário não autenticado' }
    }
    
    // Se estamos no Vercel, usar um user_id mock
    const userId = isVercel ? '00000000-0000-0000-0000-000000000000' : user?.id || '00000000-0000-0000-0000-000000000000'

    const syncedContacts = []

    // Processar cada contato da ZAPI
    for (const zapiContact of result) {
      try {
        const contact = zapiContact as { name: string; phone: string; short?: string; vname?: string; notify?: string; imgUrl?: string }
        console.log('Processando contato:', contact.name, contact.phone)
        
        // Verificar se contato já existe
        const { data: existingContact, error: checkError } = await supabase
          .from('contacts')
          .select('id')
          .eq('user_id', userId)
          .eq('phone', contact.phone)
          .single()

        console.log('Verificação de contato existente:', { existingContact, checkError })

        if (existingContact) {
          console.log('Atualizando contato existente:', existingContact.id)
          // Atualizar contato existente
          const { data: updatedContact, error: updateError } = await supabase
            .from('contacts')
            .update({
              name: contact.name || contact.short || 'Contato',
              short: contact.short,
              notify: contact.notify,
              vname: contact.vname,
              img_url: contact.imgUrl,
              has_whatsapp: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingContact.id)
            .select()
            .single()

          console.log('Resultado da atualização:', { updatedContact, updateError })
          if (updatedContact) {
            syncedContacts.push(updatedContact)
          }
        } else {
          console.log('Criando novo contato para:', contact.name)
          // Criar novo contato
          const { data: newContact, error: insertError } = await supabase
            .from('contacts')
            .insert({
              user_id: userId,
              name: contact.name || contact.short || 'Contato',
              short: contact.short,
              phone: contact.phone,
              notify: contact.notify,
              vname: contact.vname,
              img_url: contact.imgUrl,
              has_whatsapp: true,
              tags: []
            })
            .select()
            .single()

          console.log('Resultado da inserção:', { newContact, insertError })
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
    console.log('Vercel: InstanceId recebido:', instanceId)
    
    // Se temos um instanceId específico, tentar buscar por ele primeiro
    if (instanceId && instanceId !== 'undefined') {
      console.log('Vercel: Buscando instância por ID específico:', instanceId)
      const { data: instance, error: instanceError } = await supabase
        .from('zapi_instances')
        .select('instance_id, instance_token, client_security_token')
        .eq('instance_id', instanceId)
        .eq('is_active', true)
        .single()

      console.log('Vercel: Resultado busca por ID:', { instance, instanceError })

      if (instance && !instanceError) {
        console.log('Vercel: Instância encontrada por ID específico')
        return {
          instanceId: instance.instance_id, // Este é o instance_id real da Z-API
          instanceToken: instance.instance_token,
          clientSecurityToken: instance.client_security_token
        }
      }
    }
    
    // Se não encontrou por ID específico, buscar primeira instância ativa
    console.log('Vercel: Buscando primeira instância ativa')
    const { data: instances, error: instanceError } = await supabase
      .from('zapi_instances')
      .select('instance_id, instance_token, client_security_token')
      .eq('is_active', true)
      .limit(1)

    console.log('Vercel: Resultado busca geral:', { instances, instanceError })

    if (instanceError || !instances || instances.length === 0) {
      console.log('Vercel: Nenhuma instância ativa encontrada')
      throw new Error('Nenhuma instância ZAPI ativa encontrada')
    }

    const instance = instances[0]
    console.log('Vercel: Usando primeira instância ativa:', instance)
    return {
      instanceId: instance.instance_id, // Sempre usar o instance_id real da Z-API
      instanceToken: instance.instance_token,
      clientSecurityToken: instance.client_security_token
    }
  }

  const { data: instance, error: instanceError } = await supabase
    .from('zapi_instances')
    .select('instance_id, instance_token, client_security_token')
    .eq('id', instanceId)
    .eq('user_id', user?.id || '00000000-0000-0000-0000-000000000000')
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

// Função para deletar contatos
export async function deleteContacts(contactIds: string[]): Promise<{ success: boolean; error?: string; deletedCount?: number }> {
  try {
    const supabase = createServerClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const isVercel = process.env.VERCEL === '1'
    const userId = isVercel ? '00000000-0000-0000-0000-000000000000' : user?.id || '00000000-0000-0000-0000-000000000000'
    
    if (!isVercel && (!user || authError)) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    if (!contactIds || contactIds.length === 0) {
      return { success: false, error: 'Nenhum contato selecionado' }
    }

    console.log('Deletando contatos:', contactIds, 'para usuário:', userId)

    // Deletar contatos
    const { data, error } = await supabase
      .from('contacts')
      .delete()
      .in('id', contactIds)
      .eq('user_id', userId)

    if (error) {
      console.error('Erro ao deletar contatos:', error)
      return { success: false, error: 'Erro ao deletar contatos' }
    }

    console.log('Contatos deletados com sucesso:', contactIds.length)
    return { success: true, deletedCount: contactIds.length }
  } catch (error) {
    console.error('Erro ao deletar contatos:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}
