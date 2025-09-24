// Tipos para operações de grupos da Z-API baseados na documentação

export interface CreateGroupRequest {
  autoInvite: boolean
  groupName: string
  phones: string[]
}

export interface CreateGroupResponse {
  phone: string
  invitationLink: string
}

export interface UpdateGroupNameRequest {
  groupId: string
  groupName: string
}

export interface UpdateGroupNameResponse {
  value: boolean
}

export interface UpdateGroupPhotoRequest {
  groupId: string
  groupPhoto: string // URL ou Base64
}

export interface UpdateGroupPhotoResponse {
  value: boolean
}

export interface AddParticipantRequest {
  autoInvite: boolean
  groupId: string
  phones: string[]
}

export interface AddParticipantResponse {
  value: boolean
}

export interface RemoveParticipantRequest {
  groupId: string
  phones: string[]
}

export interface RemoveParticipantResponse {
  value: boolean
}

export interface ApproveParticipantRequest {
  groupId: string
  phones: string[]
}

export interface ApproveParticipantResponse {
  value: boolean
}

export interface RejectParticipantRequest {
  groupId: string
  phones: string[]
}

export interface RejectParticipantResponse {
  value: boolean
}

export interface MentionMemberRequest {
  phone: string
  message: string
  mentioned: string[]
  delayMessage?: number
}

export interface MentionMemberResponse {
  zaapId: string
  messageId: string
  id: string
}

export interface MentionGroupRequest {
  phone: string
  message: string
  groupMentioned: {
    phone: string
    subject: string
  }[]
  delayMessage?: number
}

export interface MentionGroupResponse {
  zaapId: string
  messageId: string
  id: string
}

export interface AddAdminRequest {
  groupId: string
  phones: string[]
}

export interface AddAdminResponse {
  value: boolean
}

export interface RemoveAdminRequest {
  groupId: string
  phones: string[]
}

export interface RemoveAdminResponse {
  value: boolean
}

export interface LeaveGroupRequest {
  groupId: string
}

export interface LeaveGroupResponse {
  value: boolean
}

export interface UpdateGroupSettingsRequest {
  phone: string
  adminOnlyMessage: boolean
  adminOnlySettings: boolean
  requireAdminApproval: boolean
  adminOnlyAddMember: boolean
}

export interface UpdateGroupSettingsResponse {
  value: boolean
}

export interface UpdateGroupDescriptionRequest {
  groupId: string
  groupDescription: string
}

export interface UpdateGroupDescriptionResponse {
  value: boolean
}

export interface RedefineInvitationLinkRequest {
  groupId: string
}

export interface RedefineInvitationLinkResponse {
  invitationLink: string
}

export interface GetGroupInvitationLinkRequest {
  groupId: string
}

export interface GetGroupInvitationLinkResponse {
  phone: string
  invitationLink: string
}

export interface AcceptInviteGroupRequest {
  url: string
}

export interface AcceptInviteGroupResponse {
  success: boolean
}

// Funções para chamadas da API
export class ZApiGroupsService {
  constructor(
    private instanceId: string,
    private instanceToken: string,
    private clientSecurityToken: string
  ) {}

  async createGroup(request: CreateGroupRequest): Promise<CreateGroupResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/create-group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao criar grupo: ${response.status}`)
    }

    return response.json()
  }

  async updateGroupName(request: UpdateGroupNameRequest): Promise<UpdateGroupNameResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/update-group-name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao atualizar nome do grupo: ${response.status}`)
    }

    return response.json()
  }

  async updateGroupPhoto(request: UpdateGroupPhotoRequest): Promise<UpdateGroupPhotoResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/update-group-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao atualizar foto do grupo: ${response.status}`)
    }

    return response.json()
  }

  async addParticipant(request: AddParticipantRequest): Promise<AddParticipantResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/add-participant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao adicionar participante: ${response.status}`)
    }

    return response.json()
  }

  async removeParticipant(request: RemoveParticipantRequest): Promise<RemoveParticipantResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/remove-participant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao remover participante: ${response.status}`)
    }

    return response.json()
  }

  async approveParticipant(request: ApproveParticipantRequest): Promise<ApproveParticipantResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/approve-participant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao aprovar participante: ${response.status}`)
    }

    return response.json()
  }

  async rejectParticipant(request: RejectParticipantRequest): Promise<RejectParticipantResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/reject-participant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao rejeitar participante: ${response.status}`)
    }

    return response.json()
  }

  async mentionMember(request: MentionMemberRequest): Promise<MentionMemberResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/send-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao mencionar membro: ${response.status}`)
    }

    return response.json()
  }

  async mentionGroup(request: MentionGroupRequest): Promise<MentionGroupResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/send-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao mencionar grupo: ${response.status}`)
    }

    return response.json()
  }

  async addAdmin(request: AddAdminRequest): Promise<AddAdminResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/add-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao adicionar administrador: ${response.status}`)
    }

    return response.json()
  }

  async removeAdmin(request: RemoveAdminRequest): Promise<RemoveAdminResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/remove-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao remover administrador: ${response.status}`)
    }

    return response.json()
  }

  async leaveGroup(request: LeaveGroupRequest): Promise<LeaveGroupResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/leave-group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao sair do grupo: ${response.status}`)
    }

    return response.json()
  }

  async updateGroupSettings(request: UpdateGroupSettingsRequest): Promise<UpdateGroupSettingsResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/update-group-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao atualizar configurações do grupo: ${response.status}`)
    }

    return response.json()
  }

  async updateGroupDescription(request: UpdateGroupDescriptionRequest): Promise<UpdateGroupDescriptionResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/update-group-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Erro ao atualizar descrição do grupo: ${response.status}`)
    }

    return response.json()
  }

  async redefineInvitationLink(request: RedefineInvitationLinkRequest): Promise<RedefineInvitationLinkResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/redefine-invitation-link/${request.groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      }
    })

    if (!response.ok) {
      throw new Error(`Erro ao redefinir link de convite: ${response.status}`)
    }

    return response.json()
  }

  async getGroupInvitationLink(request: GetGroupInvitationLinkRequest): Promise<GetGroupInvitationLinkResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/group-invitation-link/${request.groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      }
    })

    if (!response.ok) {
      throw new Error(`Erro ao obter link de convite: ${response.status}`)
    }

    return response.json()
  }

  async acceptInviteGroup(request: AcceptInviteGroupRequest): Promise<AcceptInviteGroupResponse> {
    const response = await fetch(`https://api.z-api.io/instances/${this.instanceId}/token/${this.instanceToken}/accept-invite-group?url=${encodeURIComponent(request.url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': this.clientSecurityToken
      }
    })

    if (!response.ok) {
      throw new Error(`Erro ao aceitar convite: ${response.status}`)
    }

    return response.json()
  }
}
