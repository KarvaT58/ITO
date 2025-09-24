"use server"

import { ZApiGroupsService } from "@/lib/zapi/groups"
import { zapiFetch } from "@/lib/zapi/client"

// Tipos para as ações do servidor
export interface GroupActionContext {
  instanceId: string
  instanceToken: string
  clientSecurityToken: string
}

// Função auxiliar para obter contexto da Z-API
async function getZApiContext(): Promise<GroupActionContext> {
  // Importar a função getInstanceTokens do arquivo de contatos
  const { getInstanceTokens } = await import('./contacts')
  
  // Buscar a primeira instância ativa
  const tokens = await getInstanceTokens("")
  
  if (!tokens) {
    throw new Error('Nenhuma instância Z-API ativa encontrada')
  }
  
  return {
    instanceId: tokens.instanceId,
    instanceToken: tokens.instanceToken,
    clientSecurityToken: tokens.clientSecurityToken
  }
}

// Criar grupo
export async function createGroup(data: {
  groupName: string
  phones: string[]
  autoInvite: boolean
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/create-group",
      method: "POST",
      body: {
        autoInvite: data.autoInvite,
        groupName: data.groupName,
        phones: data.phones
      }
    })

    return {
      success: true,
      data: response,
      message: "Grupo criado com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao criar grupo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao criar grupo"
    }
  }
}

// Atualizar nome do grupo
export async function updateGroupName(data: {
  groupId: string
  groupName: string
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/update-group-name",
      method: "POST",
      body: {
        groupId: data.groupId,
        groupName: data.groupName
      }
    })

    return {
      success: true,
      data: response,
      message: "Nome do grupo atualizado com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao atualizar nome do grupo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao atualizar nome do grupo"
    }
  }
}

// Atualizar foto do grupo
export async function updateGroupPhoto(data: {
  groupId: string
  groupPhoto: string
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/update-group-photo",
      method: "POST",
      body: {
        groupId: data.groupId,
        groupPhoto: data.groupPhoto
      }
    })

    return {
      success: true,
      data: response,
      message: "Foto do grupo atualizada com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao atualizar foto do grupo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao atualizar foto do grupo"
    }
  }
}

// Adicionar participantes
export async function addParticipants(data: {
  groupId: string
  phones: string[]
  autoInvite: boolean
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/add-participant",
      method: "POST",
      body: {
        groupId: data.groupId,
        phones: data.phones,
        autoInvite: data.autoInvite
      }
    })

    return {
      success: true,
      data: response,
      message: "Participantes adicionados com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao adicionar participantes:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao adicionar participantes"
    }
  }
}

// Remover participantes
export async function removeParticipants(data: {
  groupId: string
  phones: string[]
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/remove-participant",
      method: "POST",
      body: {
        groupId: data.groupId,
        phones: data.phones
      }
    })

    return {
      success: true,
      data: response,
      message: "Participantes removidos com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao remover participantes:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao remover participantes"
    }
  }
}

// Aprovar participantes
export async function approveParticipants(data: {
  groupId: string
  phones: string[]
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/approve-participant",
      method: "POST",
      body: {
        groupId: data.groupId,
        phones: data.phones
      }
    })

    return {
      success: true,
      data: response,
      message: "Participantes aprovados com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao aprovar participantes:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao aprovar participantes"
    }
  }
}

// Rejeitar participantes
export async function rejectParticipants(data: {
  groupId: string
  phones: string[]
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/reject-participant",
      method: "POST",
      body: {
        groupId: data.groupId,
        phones: data.phones
      }
    })

    return {
      success: true,
      data: response,
      message: "Participantes rejeitados com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao rejeitar participantes:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao rejeitar participantes"
    }
  }
}

// Mencionar membros
export async function mentionMembers(data: {
  phone: string
  message: string
  mentioned: string[]
  delayMessage?: number
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/send-text",
      method: "POST",
      body: {
        phone: data.phone,
        message: data.message,
        mentioned: data.mentioned,
        ...(data.delayMessage && { delayMessage: data.delayMessage })
      }
    })

    return {
      success: true,
      data: response,
      message: "Mensagem enviada com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao mencionar membros:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao mencionar membros"
    }
  }
}

// Promover administradores
export async function promoteAdmins(data: {
  groupId: string
  phones: string[]
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/add-admin",
      method: "POST",
      body: {
        groupId: data.groupId,
        phones: data.phones
      }
    })

    return {
      success: true,
      data: response,
      message: "Administradores promovidos com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao promover administradores:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao promover administradores"
    }
  }
}

// Remover administradores
export async function demoteAdmins(data: {
  groupId: string
  phones: string[]
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/remove-admin",
      method: "POST",
      body: {
        groupId: data.groupId,
        phones: data.phones
      }
    })

    return {
      success: true,
      data: response,
      message: "Administradores removidos com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao remover administradores:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao remover administradores"
    }
  }
}

// Sair do grupo
export async function leaveGroup(data: {
  groupId: string
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/leave-group",
      method: "POST",
      body: {
        groupId: data.groupId
      }
    })

    return {
      success: true,
      data: response,
      message: "Você saiu do grupo com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao sair do grupo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao sair do grupo"
    }
  }
}

// Atualizar configurações do grupo
export async function updateGroupSettings(data: {
  phone: string
  adminOnlyMessage: boolean
  adminOnlySettings: boolean
  requireAdminApproval: boolean
  adminOnlyAddMember: boolean
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/update-group-settings",
      method: "POST",
      body: {
        phone: data.phone,
        adminOnlyMessage: data.adminOnlyMessage,
        adminOnlySettings: data.adminOnlySettings,
        requireAdminApproval: data.requireAdminApproval,
        adminOnlyAddMember: data.adminOnlyAddMember
      }
    })

    return {
      success: true,
      data: response,
      message: "Configurações do grupo atualizadas com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao atualizar configurações do grupo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao atualizar configurações do grupo"
    }
  }
}

// Atualizar descrição do grupo
export async function updateGroupDescription(data: {
  groupId: string
  groupDescription: string
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: "/update-group-description",
      method: "POST",
      body: {
        groupId: data.groupId,
        groupDescription: data.groupDescription
      }
    })

    return {
      success: true,
      data: response,
      message: "Descrição do grupo atualizada com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao atualizar descrição do grupo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao atualizar descrição do grupo"
    }
  }
}

// Redefinir link de convite
export async function redefineInvitationLink(data: {
  groupId: string
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: `/redefine-invitation-link/${data.groupId}`,
      method: "POST"
    })

    return {
      success: true,
      data: response,
      message: "Link de convite redefinido com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao redefinir link de convite:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao redefinir link de convite"
    }
  }
}

// Obter link de convite
export async function getGroupInvitationLink(data: {
  groupId: string
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: `/group-invitation-link/${data.groupId}`,
      method: "POST"
    })

    return {
      success: true,
      data: response,
      message: "Link de convite obtido com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao obter link de convite:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao obter link de convite"
    }
  }
}

// Aceitar convite do grupo
export async function acceptInviteGroup(data: {
  url: string
}) {
  try {
    const context = await getZApiContext()
    
    const response = await zapiFetch({
      instanceId: context.instanceId,
      instanceToken: context.instanceToken,
      clientSecurityToken: context.clientSecurityToken,
      path: `/accept-invite-group?url=${encodeURIComponent(data.url)}`,
      method: "GET"
    })

    return {
      success: true,
      data: response,
      message: "Convite aceito com sucesso!"
    }
  } catch (error) {
    console.error("Erro ao aceitar convite:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      message: "Erro ao aceitar convite"
    }
  }
}
