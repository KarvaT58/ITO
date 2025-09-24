"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Plus, 
  Users, 
  Settings, 
  MessageSquare, 
  UserPlus, 
  UserMinus, 
  Crown, 
  Shield, 
  Link, 
  Edit,
  Trash2,
  Send,
  MoreHorizontal
} from "lucide-react"
import { RealtimeChat } from "./RealtimeChat"
import { GroupManagement } from "./GroupManagement"
import { GroupSettings } from "./GroupSettings"
import { Group, GroupParticipant, GroupSettingsType } from "./types"
import { 
  createGroup,
  updateGroupName,
  addParticipants,
  removeParticipants,
  promoteAdmins,
  demoteAdmins,
  leaveGroup,
  updateGroupSettings,
  updateGroupDescription,
  redefineInvitationLink
} from "@/server/actions/groups"

export function GroupsTab() {
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [activeTab, setActiveTab] = useState("list")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Estados para criação de grupo
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupPhones, setNewGroupPhones] = useState("")
  const [autoInvite, setAutoInvite] = useState(true)

  // Estados para configurações
  const [groupSettings, setGroupSettings] = useState<GroupSettingsType>({
    adminOnlyMessage: false,
    adminOnlySettings: false,
    requireAdminApproval: false,
    adminOnlyAddMember: false
  })

  // Carregar grupos
  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    setIsLoading(true)
    try {
      // Simular carregamento de grupos - em produção, fazer chamada para API
      const mockGroups: Group[] = [
        {
          id: "1",
          name: "Grupo de Vendas",
          phone: "120363019502650977-grupo",
          invitationLink: "https://chat.whatsapp.com/DCaqftVlS6dHWtlvfd3hUa",
          description: "Grupo para discussões de vendas",
          participants: [
            { phone: "5511999999999", name: "João Silva", isAdmin: true, joinedAt: "2024-01-01" },
            { phone: "5511888888888", name: "Maria Santos", isAdmin: false, joinedAt: "2024-01-02" }
          ],
          settings: {
            adminOnlyMessage: false,
            adminOnlySettings: true,
            requireAdminApproval: true,
            adminOnlyAddMember: true
          },
          isAdmin: true,
          createdAt: "2024-01-01"
        },
        {
          id: "2",
          name: "Suporte Técnico",
          phone: "120363019502650978-grupo",
          invitationLink: "https://chat.whatsapp.com/ABC123def456ghi789",
          description: "Grupo para suporte técnico",
          participants: [
            { phone: "5511777777777", name: "Carlos Tech", isAdmin: true, joinedAt: "2024-01-01" },
            { phone: "5511666666666", name: "Ana Support", isAdmin: false, joinedAt: "2024-01-02" },
            { phone: "5511555555555", name: "Pedro Help", isAdmin: false, joinedAt: "2024-01-03" }
          ],
          settings: {
            adminOnlyMessage: true,
            adminOnlySettings: true,
            requireAdminApproval: false,
            adminOnlyAddMember: true
          },
          isAdmin: true,
          createdAt: "2024-01-01"
        }
      ]
      
      setGroups(mockGroups)
    } catch (error) {
      console.error("Erro ao carregar grupos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !newGroupPhones.trim()) {
      alert("Nome do grupo e pelo menos um telefone são obrigatórios")
      return
    }

    setIsLoading(true)
    try {
      const phones = newGroupPhones.split(",").map(phone => phone.trim()).filter(Boolean)
      
      const result = await createGroup({
        groupName: newGroupName,
        phones,
        autoInvite
      })

      if (result.success) {
        const newGroup: Group = {
          id: Date.now().toString(),
          name: newGroupName,
          phone: (result.data as { phone: string; invitationLink: string }).phone,
          invitationLink: (result.data as { phone: string; invitationLink: string }).invitationLink,
          participants: phones.map(phone => ({
            phone,
            isAdmin: false,
            joinedAt: new Date().toISOString()
          })),
          settings: {
            adminOnlyMessage: false,
            adminOnlySettings: false,
            requireAdminApproval: false,
            adminOnlyAddMember: false
          },
          isAdmin: true,
          createdAt: new Date().toISOString()
        }

        setGroups(prev => [newGroup, ...prev])
        setNewGroupName("")
        setNewGroupPhones("")
        setIsCreateDialogOpen(false)
        
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Erro ao criar grupo:", error)
      alert("Erro ao criar grupo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group)
    setActiveTab("chat")
  }

  const handleSettingsUpdate = (updatedSettings: GroupSettingsType) => {
    if (selectedGroup) {
      const updatedGroup = { ...selectedGroup, settings: updatedSettings }
      setSelectedGroup(updatedGroup)
      setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updatedGroup : g))
    }
  }

  const handleParticipantAdd = async (phones: string[]) => {
    if (!selectedGroup) return
    
    try {
      const result = await addParticipants({
        groupId: selectedGroup.phone,
        phones,
        autoInvite: true
      })

      if (result.success) {
        const newParticipants = phones.map(phone => ({
          phone,
          isAdmin: false,
          joinedAt: new Date().toISOString()
        }))
        
        const updatedGroup = {
          ...selectedGroup,
          participants: [...selectedGroup.participants, ...newParticipants]
        }
        
        setSelectedGroup(updatedGroup)
        setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updatedGroup : g))
        
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Erro ao adicionar participantes:", error)
      alert("Erro ao adicionar participantes")
    }
  }

  const handleParticipantRemove = async (phones: string[]) => {
    if (!selectedGroup) return
    
    try {
      const result = await removeParticipants({
        groupId: selectedGroup.phone,
        phones
      })

      if (result.success) {
        const updatedGroup = {
          ...selectedGroup,
          participants: selectedGroup.participants.filter(p => !phones.includes(p.phone))
        }
        
        setSelectedGroup(updatedGroup)
        setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updatedGroup : g))
        
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Erro ao remover participantes:", error)
      alert("Erro ao remover participantes")
    }
  }

  const handleAdminPromote = async (phones: string[]) => {
    if (!selectedGroup) return
    
    try {
      const result = await promoteAdmins({
        groupId: selectedGroup.phone,
        phones
      })

      if (result.success) {
        const updatedGroup = {
          ...selectedGroup,
          participants: selectedGroup.participants.map(p => 
            phones.includes(p.phone) ? { ...p, isAdmin: true } : p
          )
        }
        
        setSelectedGroup(updatedGroup)
        setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updatedGroup : g))
        
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Erro ao promover administradores:", error)
      alert("Erro ao promover administradores")
    }
  }

  const handleAdminDemote = async (phones: string[]) => {
    if (!selectedGroup) return
    
    try {
      const result = await demoteAdmins({
        groupId: selectedGroup.phone,
        phones
      })

      if (result.success) {
        const updatedGroup = {
          ...selectedGroup,
          participants: selectedGroup.participants.map(p => 
            phones.includes(p.phone) ? { ...p, isAdmin: false } : p
          )
        }
        
        setSelectedGroup(updatedGroup)
        setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updatedGroup : g))
        
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Erro ao remover administradores:", error)
      alert("Erro ao remover administradores")
    }
  }

  const handleGroupLeave = async () => {
    if (!selectedGroup) return
    
    if (confirm("Tem certeza que deseja sair do grupo?")) {
      try {
        const result = await leaveGroup({
          groupId: selectedGroup.phone
        })

        if (result.success) {
          setGroups(prev => prev.filter(g => g.id !== selectedGroup.id))
          setSelectedGroup(null)
          setActiveTab("list")
          
          alert(result.message)
        } else {
          alert(result.message)
        }
      } catch (error) {
        console.error("Erro ao sair do grupo:", error)
        alert("Erro ao sair do grupo")
      }
    }
  }

  const handleGroupDelete = async () => {
    if (!selectedGroup) return
    
    if (confirm("Tem certeza que deseja excluir o grupo? Esta ação não pode ser desfeita.")) {
      try {
        // Simular exclusão do grupo - em produção, fazer chamada para Z-API
        setGroups(prev => prev.filter(g => g.id !== selectedGroup.id))
        setSelectedGroup(null)
        setActiveTab("list")
        
        alert("Grupo excluído com sucesso!")
      } catch (error) {
        console.error("Erro ao excluir grupo:", error)
        alert("Erro ao excluir grupo")
      }
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Lista de Grupos</TabsTrigger>
          <TabsTrigger value="chat" disabled={!selectedGroup}>Chat</TabsTrigger>
          <TabsTrigger value="management" disabled={!selectedGroup}>Gerenciar</TabsTrigger>
          <TabsTrigger value="settings" disabled={!selectedGroup}>Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Meus Grupos</h3>
              <p className="text-sm text-muted-foreground">
                {groups.length} grupo(s) encontrado(s)
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Grupo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Grupo</DialogTitle>
                  <DialogDescription>
                    Crie um novo grupo no WhatsApp com os participantes desejados.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="groupName">Nome do Grupo</Label>
                    <Input
                      id="groupName"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Digite o nome do grupo"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="groupPhones">Telefones dos Participantes</Label>
                    <Textarea
                      id="groupPhones"
                      value={newGroupPhones}
                      onChange={(e) => setNewGroupPhones(e.target.value)}
                      placeholder="Digite os telefones separados por vírgula (ex: 5511999999999, 5511888888888)"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separe os telefones por vírgula. Pelo menos um participante é obrigatório.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoInvite"
                      checked={autoInvite}
                      onCheckedChange={setAutoInvite}
                    />
                    <Label htmlFor="autoInvite">Enviar convite automático</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateGroup} disabled={isLoading}>
                    {isLoading ? "Criando..." : "Criar Grupo"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{group.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {group.participants.length} participante(s)
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      {group.isAdmin && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      {group.participants.length} membro(s)
                    </div>
                    {group.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {group.description}
                      </p>
                    )}
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGroupSelect(group)}
                        className="flex-1"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedGroup(group)
                          setActiveTab("management")
                        }}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {groups.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum grupo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Crie seu primeiro grupo para começar a gerenciar conversas.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Grupo
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="chat">
          {selectedGroup && (
            <RealtimeChat 
              group={selectedGroup}
              onGroupUpdate={(updatedGroup) => {
                setSelectedGroup(updatedGroup)
                setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g))
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="management">
          {selectedGroup && (
            <GroupManagement
              group={selectedGroup}
              onParticipantAdd={handleParticipantAdd}
              onParticipantRemove={handleParticipantRemove}
              onAdminPromote={handleAdminPromote}
              onAdminDemote={handleAdminDemote}
              onGroupLeave={handleGroupLeave}
              onGroupDelete={handleGroupDelete}
            />
          )}
        </TabsContent>

        <TabsContent value="settings">
          {selectedGroup && (
            <GroupSettings
              group={selectedGroup}
              onSettingsUpdate={handleSettingsUpdate}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
