"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  UserPlus, 
  UserMinus, 
  Crown, 
  Shield, 
  Users, 
  Trash2, 
  LogOut,
  MoreHorizontal,
  Check,
  X
} from "lucide-react"
import { Group, GroupParticipant } from "./types"

interface GroupManagementProps {
  group: Group
  onParticipantAdd: (phones: string[]) => void
  onParticipantRemove: (phones: string[]) => void
  onAdminPromote: (phones: string[]) => void
  onAdminDemote: (phones: string[]) => void
  onGroupLeave: () => void
  onGroupDelete: () => void
}

export function GroupManagement({ 
  group, 
  onParticipantAdd, 
  onParticipantRemove, 
  onAdminPromote, 
  onAdminDemote,
  onGroupLeave,
  onGroupDelete
}: GroupManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [newPhones, setNewPhones] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleParticipantSelect = (phone: string) => {
    setSelectedParticipants(prev => 
      prev.includes(phone) 
        ? prev.filter(p => p !== phone)
        : [...prev, phone]
    )
  }

  const handleAddParticipants = async () => {
    if (!newPhones.trim()) return

    const phones = newPhones.split(",").map(phone => phone.trim()).filter(Boolean)
    setIsLoading(true)
    
    try {
      await onParticipantAdd(phones)
      setNewPhones("")
      setIsAddDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveParticipants = async () => {
    if (selectedParticipants.length === 0) return

    setIsLoading(true)
    
    try {
      await onParticipantRemove(selectedParticipants)
      setSelectedParticipants([])
      setIsRemoveDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromoteAdmins = async () => {
    if (selectedParticipants.length === 0) return

    setIsLoading(true)
    
    try {
      await onAdminPromote(selectedParticipants)
      setSelectedParticipants([])
      setIsAdminDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoteAdmins = async () => {
    if (selectedParticipants.length === 0) return

    setIsLoading(true)
    
    try {
      await onAdminDemote(selectedParticipants)
      setSelectedParticipants([])
      setIsAdminDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getParticipantName = (phone: string) => {
    const participant = group.participants.find(p => p.phone === phone)
    return participant?.name || phone
  }

  const getParticipantInitials = (phone: string) => {
    const name = getParticipantName(phone)
    if (name === phone) {
      return phone.slice(-2)
    }
    return name.split(" ").map(n => n[0]).join("").slice(0, 2)
  }

  const admins = group.participants.filter(p => p.isAdmin)
  const regularMembers = group.participants.filter(p => !p.isAdmin)

  return (
    <div className="space-y-6">
      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Gerenciar Participantes
          </CardTitle>
          <CardDescription>
            Adicione, remova ou promova participantes do grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <UserPlus className="w-6 h-6" />
                  <span>Adicionar Participantes</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Participantes</DialogTitle>
                  <DialogDescription>
                    Digite os telefones dos participantes que deseja adicionar ao grupo.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="newPhones">Telefones dos Participantes</Label>
                    <Textarea
                      id="newPhones"
                      value={newPhones}
                      onChange={(e) => setNewPhones(e.target.value)}
                      placeholder="Digite os telefones separados por vírgula (ex: 5511999999999, 5511888888888)"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separe os telefones por vírgula. Use o formato internacional (ex: 5511999999999).
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddParticipants} disabled={!newPhones.trim() || isLoading}>
                    {isLoading ? "Adicionando..." : "Adicionar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <UserMinus className="w-6 h-6" />
                  <span>Remover Participantes</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Remover Participantes</DialogTitle>
                  <DialogDescription>
                    Selecione os participantes que deseja remover do grupo.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Participantes do Grupo</Label>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {group.participants.map((participant) => (
                        <div
                          key={participant.phone}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedParticipants.includes(participant.phone)
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleParticipantSelect(participant.phone)}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {getParticipantInitials(participant.phone)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {getParticipantName(participant.phone)}
                              </span>
                              {participant.isAdmin && (
                                <Badge variant="secondary" className="text-xs">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {participant.phone}
                            </p>
                          </div>
                          {selectedParticipants.includes(participant.phone) && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedParticipants.length} participante(s) selecionado(s)
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleRemoveParticipants} 
                    disabled={selectedParticipants.length === 0 || isLoading}
                    variant="destructive"
                  >
                    {isLoading ? "Removendo..." : "Remover"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Crown className="w-6 h-6" />
                  <span>Gerenciar Admins</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Gerenciar Administradores</DialogTitle>
                  <DialogDescription>
                    Promova ou remova administradores do grupo.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Promover a Administrador</Label>
                      <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
                        {regularMembers.map((participant) => (
                          <div
                            key={participant.phone}
                            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedParticipants.includes(participant.phone)
                                ? "bg-primary/10 border-primary"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => handleParticipantSelect(participant.phone)}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {getParticipantInitials(participant.phone)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <span className="font-medium">
                                {getParticipantName(participant.phone)}
                              </span>
                              <p className="text-sm text-muted-foreground">
                                {participant.phone}
                              </p>
                            </div>
                            {selectedParticipants.includes(participant.phone) && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsAdminDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handlePromoteAdmins} 
                    disabled={selectedParticipants.length === 0 || isLoading}
                  >
                    {isLoading ? "Promovendo..." : "Promover"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Administradores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="w-5 h-5 mr-2" />
            Administradores ({admins.length})
          </CardTitle>
          <CardDescription>
            Membros com permissões administrativas no grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.phone} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {getParticipantInitials(admin.phone)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {getParticipantName(admin.phone)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {admin.phone}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedParticipants([admin.phone])
                    handleDemoteAdmins()
                  }}
                  disabled={isLoading}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Remover Admin
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Membros Regulares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Membros ({regularMembers.length})
          </CardTitle>
          <CardDescription>
            Membros regulares do grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {regularMembers.map((member) => (
              <div key={member.phone} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {getParticipantInitials(member.phone)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {getParticipantName(member.phone)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.phone}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedParticipants([member.phone])
                      handlePromoteAdmins()
                    }}
                    disabled={isLoading}
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    Promover
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedParticipants([member.phone])
                      handleRemoveParticipants()
                    }}
                    disabled={isLoading}
                  >
                    <UserMinus className="w-4 h-4 mr-1" />
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Perigosas */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <Trash2 className="w-5 h-5 mr-2" />
            Ações Perigosas
          </CardTitle>
          <CardDescription>
            Estas ações não podem ser desfeitas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onGroupLeave}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do Grupo</span>
            </Button>
            <Button
              variant="destructive"
              onClick={onGroupDelete}
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir Grupo</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
