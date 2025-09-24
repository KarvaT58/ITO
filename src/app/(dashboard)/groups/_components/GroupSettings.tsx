"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Users, 
  MessageSquare, 
  Shield, 
  Link, 
  Edit,
  Save,
  RefreshCw,
  Copy,
  Check
} from "lucide-react"
import { Group, GroupSettingsType } from "./types"
import { 
  updateGroupName,
  updateGroupDescription,
  updateGroupSettings,
  redefineInvitationLink
} from "@/server/actions/groups"

interface GroupSettingsProps {
  group: Group
  onSettingsUpdate: (settings: GroupSettingsType) => void
}

export function GroupSettings({ group, onSettingsUpdate }: GroupSettingsProps) {
  const [settings, setSettings] = useState<GroupSettingsType>(group.settings)
  const [groupName, setGroupName] = useState(group.name)
  const [groupDescription, setGroupDescription] = useState(group.description || "")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleSettingChange = (key: keyof GroupSettingsType, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    
    try {
      const result = await updateGroupSettings({
        phone: group.phone,
        adminOnlyMessage: settings.adminOnlyMessage,
        adminOnlySettings: settings.adminOnlySettings,
        requireAdminApproval: settings.requireAdminApproval,
        adminOnlyAddMember: settings.adminOnlyAddMember
      })

      if (result.success) {
        onSettingsUpdate(settings)
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      alert("Erro ao salvar configurações")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateGroupName = async () => {
    if (!groupName.trim()) {
      alert("Nome do grupo é obrigatório")
      return
    }

    setIsLoading(true)
    
    try {
      const result = await updateGroupName({
        groupId: group.phone,
        groupName: groupName.trim()
      })

      if (result.success) {
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Erro ao atualizar nome:", error)
      alert("Erro ao atualizar nome do grupo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateDescription = async () => {
    setIsLoading(true)
    
    try {
      const result = await updateGroupDescription({
        groupId: group.phone,
        groupDescription: groupDescription.trim()
      })

      if (result.success) {
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Erro ao atualizar descrição:", error)
      alert("Erro ao atualizar descrição")
    } finally {
      setIsLoading(false)
    }
  }

  const copyInvitationLink = async () => {
    if (group.invitationLink) {
      try {
        await navigator.clipboard.writeText(group.invitationLink)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      } catch (error) {
        console.error("Erro ao copiar link:", error)
      }
    }
  }

  const regenerateInvitationLink = async () => {
    if (confirm("Tem certeza que deseja gerar um novo link de convite? O link atual será invalidado.")) {
      setIsLoading(true)
      
      try {
        const result = await redefineInvitationLink({
          groupId: group.phone
        })

        if (result.success) {
          alert(result.message)
        } else {
          alert(result.message)
        }
      } catch (error) {
        console.error("Erro ao gerar novo link:", error)
        alert("Erro ao gerar novo link")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Informações Básicas
          </CardTitle>
          <CardDescription>
            Configure as informações básicas do grupo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="groupName">Nome do Grupo</Label>
              <div className="flex space-x-2">
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Digite o nome do grupo"
                />
                <Button
                  onClick={handleUpdateGroupName}
                  disabled={!groupName.trim() || isLoading}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="groupDescription">Descrição do Grupo</Label>
              <div className="flex space-x-2">
                <Textarea
                  id="groupDescription"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Digite a descrição do grupo"
                  rows={3}
                />
                <Button
                  onClick={handleUpdateDescription}
                  disabled={isLoading}
                  size="sm"
                  className="self-start"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Link de Convite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="w-5 h-5 mr-2" />
            Link de Convite
          </CardTitle>
          <CardDescription>
            Gerencie o link de convite do grupo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {group.invitationLink ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  value={group.invitationLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyInvitationLink}
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={regenerateInvitationLink}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {copiedLink ? "Link copiado para a área de transferência!" : "Clique no botão de copiar para compartilhar o link"}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Nenhum link de convite disponível
              </p>
              <Button onClick={regenerateInvitationLink} disabled={isLoading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar Link de Convite
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações de Permissões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Configurações de Permissões
          </CardTitle>
          <CardDescription>
            Configure quem pode fazer o quê no grupo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="adminOnlyMessage">Apenas administradores podem enviar mensagens</Label>
                <p className="text-sm text-muted-foreground">
                  Quando ativado, apenas administradores podem enviar mensagens no grupo
                </p>
              </div>
              <Switch
                id="adminOnlyMessage"
                checked={settings.adminOnlyMessage}
                onCheckedChange={(checked) => handleSettingChange("adminOnlyMessage", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="adminOnlySettings">Apenas administradores podem alterar configurações</Label>
                <p className="text-sm text-muted-foreground">
                  Quando ativado, apenas administradores podem alterar as configurações do grupo
                </p>
              </div>
              <Switch
                id="adminOnlySettings"
                checked={settings.adminOnlySettings}
                onCheckedChange={(checked) => handleSettingChange("adminOnlySettings", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requireAdminApproval">Requer aprovação do administrador</Label>
                <p className="text-sm text-muted-foreground">
                  Quando ativado, novos membros precisam ser aprovados por um administrador
                </p>
              </div>
              <Switch
                id="requireAdminApproval"
                checked={settings.requireAdminApproval}
                onCheckedChange={(checked) => handleSettingChange("requireAdminApproval", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="adminOnlyAddMember">Apenas administradores podem adicionar membros</Label>
                <p className="text-sm text-muted-foreground">
                  Quando ativado, apenas administradores podem adicionar novos membros ao grupo
                </p>
              </div>
              <Switch
                id="adminOnlyAddMember"
                checked={settings.adminOnlyAddMember}
                onCheckedChange={(checked) => handleSettingChange("adminOnlyAddMember", checked)}
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo das Configurações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Resumo das Configurações
          </CardTitle>
          <CardDescription>
            Visão geral das configurações atuais do grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Permissões de Mensagem</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Apenas admins podem enviar</span>
                  <Badge variant={settings.adminOnlyMessage ? "default" : "secondary"}>
                    {settings.adminOnlyMessage ? "Ativado" : "Desativado"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Permissões de Configuração</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Apenas admins podem configurar</span>
                  <Badge variant={settings.adminOnlySettings ? "default" : "secondary"}>
                    {settings.adminOnlySettings ? "Ativado" : "Desativado"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Controle de Entrada</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Aprovação necessária</span>
                  <Badge variant={settings.requireAdminApproval ? "default" : "secondary"}>
                    {settings.requireAdminApproval ? "Ativado" : "Desativado"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Controle de Membros</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Apenas admins podem adicionar</span>
                  <Badge variant={settings.adminOnlyAddMember ? "default" : "secondary"}>
                    {settings.adminOnlyAddMember ? "Ativado" : "Desativado"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
