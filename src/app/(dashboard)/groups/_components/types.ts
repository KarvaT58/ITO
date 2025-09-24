export interface Group {
  id: string
  name: string
  phone: string
  invitationLink?: string
  description?: string
  participants: GroupParticipant[]
  settings: GroupSettingsType
  isAdmin: boolean
  createdAt: string
}

export interface GroupParticipant {
  phone: string
  name?: string
  isAdmin: boolean
  joinedAt: string
}

export interface GroupSettingsType {
  adminOnlyMessage: boolean
  adminOnlySettings: boolean
  requireAdminApproval: boolean
  adminOnlyAddMember: boolean
}
