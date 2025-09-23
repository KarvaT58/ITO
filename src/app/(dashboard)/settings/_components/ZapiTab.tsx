"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Settings,
  Smartphone,
  MessageSquare,
  Webhook,
  Trash2,
  RefreshCw,
  Power,
  PowerOff,
  QrCode,
  Download,
  Copy
} from "lucide-react"
import { ZApiInstance } from "@/lib/zapi/types"
import { 
  createZapiInstance, 
  listZapiInstances, 
  deleteZapiInstance, 
  zapiAction, 
  getWebhookEvents 
} from "@/server/actions/zapi"
import { toast } from "sonner"

export function ZapiTab() {
  const [instances, setInstances] = useState<ZApiInstance[]>([])
  const [webhookEvents, setWebhookEvents] = useState<{ id: number; kind: string; created_at: string; payload: unknown }[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false)
  const [selectedInstance, setSelectedInstance] = useState<ZApiInstance | null>(null)
  const [instanceStatus, setInstanceStatus] = useState<Record<string, unknown>>({})
  const [qrCodeData, setQrCodeData] = useState<{ bytes?: string; image?: string } | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    alias: '',
    instance_id: '',
    instance_token: '',
    client_security_token: '',
    phone: ''
  })

  const [settingsData, setSettingsData] = useState({
    autoReadMessage: false,
    autoReadStatus: false,
    callRejectAuto: false,
    callRejectMessage: '',
    profileName: '',
    profileDescription: '',
    profilePicture: ''
  })

  useEffect(() => {
    loadInstances()
    loadWebhookEvents()
  }, [])

  const loadInstances = async () => {
    try {
      const data = await listZapiInstances()
      setInstances(data)
      
      // Load status for each instance
      for (const instance of data) {
        try {
          const status = await zapiAction({ id: instance.id, action: 'status' })
          setInstanceStatus(prev => ({ ...prev, [instance.id]: status }))
        } catch {
          // Ignore errors when loading status
        }
      }
    } catch {
      toast.error('Erro ao carregar instâncias')
    } finally {
      setLoading(false)
    }
  }

  const loadWebhookEvents = async () => {
    try {
      const events = await getWebhookEvents()
      setWebhookEvents(events)
    } catch {
      // Ignore errors when loading webhook events
    }
  }

  const handleAddInstance = async () => {
    try {
      await createZapiInstance(formData)
      toast.success('Instância criada com sucesso')
      setIsAddDialogOpen(false)
      setFormData({ alias: '', instance_id: '', instance_token: '', client_security_token: '', phone: '' })
      loadInstances()
    } catch {
      toast.error('Erro ao criar instância')
    }
  }

  const handleDeleteInstance = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta instância?')) return
    
    try {
      await deleteZapiInstance(id)
      toast.success('Instância deletada com sucesso')
      loadInstances()
    } catch {
      toast.error('Erro ao deletar instância')
    }
  }

  const handleZapiAction = async (instanceId: string, action: string, payload?: unknown) => {
    try {
      const result = await zapiAction({ id: instanceId, action, payload })
      toast.success('Ação executada com sucesso')
      
      if (action === 'status') {
        setInstanceStatus(prev => ({ ...prev, [instanceId]: result }))
      }
      
      return result
    } catch {
      toast.error('Erro ao executar ação')
    }
  }

  const handleConfigureWebhooks = async (instanceId: string) => {
    try {
      await zapiAction({ id: instanceId, action: 'webhooks:setAllVercel' })
      toast.success('Webhooks configurados para Vercel')
    } catch {
      toast.error('Erro ao configurar webhooks')
    }
  }

  const handleShowQrCode = async (instance: ZApiInstance) => {
    setSelectedInstance(instance)
    setIsQrDialogOpen(true)
    try {
      const qrBytes = await zapiAction({ id: instance.id, action: 'qrBytes' })
      const qrImage = await zapiAction({ id: instance.id, action: 'qrImage' })
      setQrCodeData({ bytes: qrBytes as string, image: qrImage as string })
    } catch {
      toast.error('Erro ao gerar QR Code')
    }
  }

  const handleCopyQrCode = () => {
    if (qrCodeData?.bytes) {
      navigator.clipboard.writeText(qrCodeData.bytes)
      toast.success('QR Code copiado para a área de transferência')
    }
  }

  const handleDownloadQrCode = () => {
    if (qrCodeData?.image) {
      const link = document.createElement('a')
      link.href = qrCodeData.image
      link.download = `qr-code-${selectedInstance?.alias || 'whatsapp'}.png`
      link.click()
    }
  }

  const openSettingsDialog = async (instance: ZApiInstance) => {
    setSelectedInstance(instance)
    setIsSettingsDialogOpen(true)
    
    // Load current settings
    try {
      const [autoReadMessage, autoReadStatus, callRejectAuto] = await Promise.all([
        zapiAction({ id: instance.id, action: 'autoReadMessage', payload: { enable: false } }).catch(() => false),
        zapiAction({ id: instance.id, action: 'autoReadStatus', payload: { enable: false } }).catch(() => false),
        zapiAction({ id: instance.id, action: 'callRejectAuto', payload: { enable: false } }).catch(() => false)
      ])
      
      setSettingsData(prev => ({
        ...prev,
        autoReadMessage: Boolean(autoReadMessage),
        autoReadStatus: Boolean(autoReadStatus),
        callRejectAuto: Boolean(callRejectAuto)
      }))
    } catch {
      // Ignore errors when loading settings
    }
  }

  const handleUpdateSettings = async () => {
    if (!selectedInstance) return
    
    try {
      await Promise.all([
        zapiAction({ id: selectedInstance.id, action: 'autoReadMessage', payload: { enable: settingsData.autoReadMessage } }),
        zapiAction({ id: selectedInstance.id, action: 'autoReadStatus', payload: { enable: settingsData.autoReadStatus } }),
        zapiAction({ id: selectedInstance.id, action: 'callRejectAuto', payload: { enable: settingsData.callRejectAuto } }),
        zapiAction({ id: selectedInstance.id, action: 'callRejectMessage', payload: { message: settingsData.callRejectMessage } }),
        zapiAction({ id: selectedInstance.id, action: 'profileName', payload: { name: settingsData.profileName } }),
        zapiAction({ id: selectedInstance.id, action: 'profileDescription', payload: { description: settingsData.profileDescription } }),
        zapiAction({ id: selectedInstance.id, action: 'profilePicture', payload: { url: settingsData.profilePicture } })
      ])
      
      toast.success('Configurações atualizadas')
      setIsSettingsDialogOpen(false)
    } catch {
      toast.error('Erro ao atualizar configurações')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Instâncias Z-API</h2>
          <p className="text-muted-foreground">Gerencie suas instâncias do WhatsApp</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Instância
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Instância Z-API</DialogTitle>
              <DialogDescription>
                Configure uma nova instância do WhatsApp
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="alias">Apelido</Label>
                <Input
                  id="alias"
                  value={formData.alias}
                  onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
                  placeholder="Ex: WhatsApp Principal"
                />
              </div>
              <div>
                <Label htmlFor="instance_id">Instance ID</Label>
                <Input
                  id="instance_id"
                  value={formData.instance_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, instance_id: e.target.value }))}
                  placeholder="SUA_INSTANCIA"
                />
              </div>
              <div>
                <Label htmlFor="instance_token">Instance Token</Label>
                <Input
                  id="instance_token"
                  value={formData.instance_token}
                  onChange={(e) => setFormData(prev => ({ ...prev, instance_token: e.target.value }))}
                  placeholder="SEU_TOKEN"
                />
              </div>
              <div>
                <Label htmlFor="client_security_token">Client Security Token</Label>
                <Input
                  id="client_security_token"
                  value={formData.client_security_token}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_security_token: e.target.value }))}
                  placeholder="TOKEN_DE_SEGURANCA"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+5511999999999"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddInstance}>
                Criar Instância
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="instances" className="w-full">
        <TabsList>
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
          <TabsTrigger value="events">Eventos Recentes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="instances" className="space-y-4">
          {instances.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Nenhuma instância encontrada</h3>
                <p className="text-muted-foreground">Adicione sua primeira instância do WhatsApp</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {instances.map((instance) => {
                const status = instanceStatus[instance.id] as { connected?: boolean } | undefined
                const isConnected = status?.connected || false
                
                return (
                  <Card key={instance.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-5 w-5" />
                            <CardTitle className="text-lg">{instance.alias}</CardTitle>
                          </div>
                          <Badge variant={isConnected ? "default" : "secondary"}>
                            {isConnected ? "Conectado" : "Desconectado"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openSettingsDialog(instance)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteInstance(instance.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        {instance.phone || 'Telefone não informado'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleZapiAction(instance.id, 'status')}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Status
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleZapiAction(instance.id, 'restart')}
                        >
                          <Power className="h-4 w-4 mr-2" />
                          Reiniciar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleZapiAction(instance.id, 'disconnect')}
                        >
                          <PowerOff className="h-4 w-4 mr-2" />
                          Desconectar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowQrCode(instance)}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          QR Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfigureWebhooks(instance.id)}
                        >
                          <Webhook className="h-4 w-4 mr-2" />
                          Webhooks Vercel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de Webhook</CardTitle>
              <CardDescription>
                Últimos eventos recebidos dos webhooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {webhookEvents.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Nenhum evento de webhook encontrado
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Payload</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhookEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Badge variant="outline">{event.kind}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(event.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {JSON.stringify(event.payload).substring(0, 100)}...
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configurações da Instância</DialogTitle>
            <DialogDescription>
              Configure as opções da instância {selectedInstance?.alias}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Leitura Automática</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoReadMessage">Auto-Read Message</Label>
                <Switch
                  id="autoReadMessage"
                  checked={settingsData.autoReadMessage}
                  onCheckedChange={(checked) => 
                    setSettingsData(prev => ({ ...prev, autoReadMessage: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoReadStatus">Auto-Read Status</Label>
                <Switch
                  id="autoReadStatus"
                  checked={settingsData.autoReadStatus}
                  onCheckedChange={(checked) => 
                    setSettingsData(prev => ({ ...prev, autoReadStatus: checked }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Rejeição de Chamadas</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="callRejectAuto">Rejeitar Chamadas Automaticamente</Label>
                <Switch
                  id="callRejectAuto"
                  checked={settingsData.callRejectAuto}
                  onCheckedChange={(checked) => 
                    setSettingsData(prev => ({ ...prev, callRejectAuto: checked }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="callRejectMessage">Mensagem de Rejeição</Label>
                <Input
                  id="callRejectMessage"
                  value={settingsData.callRejectMessage}
                  onChange={(e) => 
                    setSettingsData(prev => ({ ...prev, callRejectMessage: e.target.value }))
                  }
                  placeholder="Desculpe, não posso atender no momento"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Perfil</h4>
              <div>
                <Label htmlFor="profileName">Nome do Perfil</Label>
                <Input
                  id="profileName"
                  value={settingsData.profileName}
                  onChange={(e) => 
                    setSettingsData(prev => ({ ...prev, profileName: e.target.value }))
                  }
                  placeholder="Nome do WhatsApp"
                />
              </div>
              <div>
                <Label htmlFor="profileDescription">Descrição do Perfil</Label>
                <Input
                  id="profileDescription"
                  value={settingsData.profileDescription}
                  onChange={(e) => 
                    setSettingsData(prev => ({ ...prev, profileDescription: e.target.value }))
                  }
                  placeholder="Descrição do WhatsApp"
                />
              </div>
              <div>
                <Label htmlFor="profilePicture">URL da Foto do Perfil</Label>
                <Input
                  id="profilePicture"
                  value={settingsData.profilePicture}
                  onChange={(e) => 
                    setSettingsData(prev => ({ ...prev, profilePicture: e.target.value }))
                  }
                  placeholder="https://exemplo.com/foto.jpg"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateSettings}>
              Salvar Configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para QR Code */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>QR Code - {selectedInstance?.alias}</DialogTitle>
            <DialogDescription>
              Escaneie este QR Code com seu WhatsApp para conectar a instância
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {qrCodeData?.image ? (
              <div className="flex flex-col items-center space-y-4">
                <Image 
                  src={qrCodeData.image} 
                  alt="QR Code WhatsApp" 
                  width={300}
                  height={300}
                  className="max-w-[300px] max-h-[300px] border rounded"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleCopyQrCode} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Código
                  </Button>
                  <Button onClick={handleDownloadQrCode} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar QR
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Gerando QR Code...</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
