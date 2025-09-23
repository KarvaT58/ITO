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
  updateZapiInstance,
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
  const [qrPollingInterval, setQrPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [instanceToDelete, setInstanceToDelete] = useState<ZApiInstance | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    alias: '',
    instance_id: '',
    instance_token: '',
    client_security_token: ''
  })

  const [settingsData, setSettingsData] = useState({
    autoReadMessage: false,
    autoReadStatus: false,
    callRejectAuto: false,
    callRejectMessage: '',
    profileName: '',
    profileDescription: '',
    profilePicture: '',
    notifySentByMe: false,
    // Webhooks
    webhookDelivery: '',
    webhookReceived: '',
    webhookReceivedDelivery: '',
    webhookDisconnected: '',
    webhookMessageStatus: '',
    webhookChatPresence: '',
    webhookConnected: ''
  })

  useEffect(() => {
    loadInstances()
    loadWebhookEvents()
  }, [])

  // Limpar polling quando o diálogo for fechado
  useEffect(() => {
    if (!isQrDialogOpen) {
      if (qrPollingInterval) {
        clearInterval(qrPollingInterval)
        setQrPollingInterval(null)
      }
    }
  }, [isQrDialogOpen, qrPollingInterval])

  // Limpar polling quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (qrPollingInterval) {
        clearInterval(qrPollingInterval)
      }
    }
  }, [qrPollingInterval])

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
      setFormData({ alias: '', instance_id: '', instance_token: '', client_security_token: '' })
      loadInstances()
    } catch {
      toast.error('Erro ao criar instância')
    }
  }

  const handleDeleteInstance = async (instance: ZApiInstance) => {
    setInstanceToDelete(instance)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteInstance = async () => {
    if (!instanceToDelete) return
    
    try {
      await deleteZapiInstance(instanceToDelete.id)
      toast.success('Instância deletada com sucesso')
      loadInstances()
      setIsDeleteDialogOpen(false)
      setInstanceToDelete(null)
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
    setQrCodeData(null) // Reset previous data
    
    try {
      const qrBytesResponse = await zapiAction({ id: instance.id, action: 'qrBytes' })
      const qrImageResponse = await zapiAction({ id: instance.id, action: 'qrImage' })
      
      console.log('QR Bytes Response:', qrBytesResponse)
      console.log('QR Image Response:', qrImageResponse)
      
      // Extract data from different possible response structures
      const extractQrData = (response: unknown): string => {
        if (typeof response === 'string') return response
        if (response && typeof response === 'object') {
          const obj = response as Record<string, unknown>
          return (obj.qrCode || obj.base64 || obj.value || obj.valor || '') as string
        }
        return ''
      }
      
      const qrBytes = extractQrData(qrBytesResponse)
      const qrImage = extractQrData(qrImageResponse)
      
      // Validate the extracted data
      if (qrBytes && qrImage && qrBytes.trim() !== '' && qrImage.trim() !== '') {
        setQrCodeData({ bytes: qrBytes, image: qrImage })
        toast.success('QR Code gerado com sucesso')
        
        // Iniciar polling para verificar conexão
        startQrPolling(instance.id)
      } else {
        console.error('Dados inválidos extraídos:', { qrBytes, qrImage })
        throw new Error('Resposta inválida da API - dados vazios')
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      toast.error(`Erro ao gerar QR Code: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      setQrCodeData({ bytes: '', image: '' }) // Set empty to show error state
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

  const checkConnectionStatus = async (instanceId: string) => {
    try {
      const status = await zapiAction({ id: instanceId, action: 'status' })
      const statusData = status as { connected?: boolean } | undefined
      
      if (statusData?.connected) {
        // WhatsApp conectado! Obter informações do dispositivo
        try {
          const deviceInfo = await zapiAction({ id: instanceId, action: 'device' })
          const deviceData = deviceInfo as { phone?: string } | undefined
          
          // Atualizar instância com o número de telefone
          if (deviceData?.phone) {
            await updateZapiInstance(instanceId, { phone: deviceData.phone })
            console.log('Número de telefone atualizado:', deviceData.phone)
          }
        } catch (deviceError) {
          console.error('Erro ao obter informações do dispositivo:', deviceError)
        }
        
        // Fechar diálogo e atualizar status
        setIsQrDialogOpen(false)
        setQrCodeData(null)
        setSelectedInstance(null)
        
        // Limpar polling
        if (qrPollingInterval) {
          clearInterval(qrPollingInterval)
          setQrPollingInterval(null)
        }
        
        // Atualizar status da instância
        setInstanceStatus(prev => ({
          ...prev,
          [instanceId]: statusData
        }))
        
        // Recarregar lista de instâncias para atualizar UI
        loadInstances()
        
        toast.success('WhatsApp conectado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao verificar status da conexão:', error)
    }
  }

  const startQrPolling = (instanceId: string) => {
    // Limpar polling anterior se existir
    if (qrPollingInterval) {
      clearInterval(qrPollingInterval)
    }
    
    // Verificar status a cada 3 segundos
    const interval = setInterval(() => {
      checkConnectionStatus(instanceId)
    }, 3000)
    
    setQrPollingInterval(interval)
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
        zapiAction({ id: selectedInstance.id, action: 'profilePicture', payload: { url: settingsData.profilePicture } }),
        zapiAction({ id: selectedInstance.id, action: 'notifySentByMe', payload: { enable: settingsData.notifySentByMe } })
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
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold">Nova Instância Z-API</DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                Configure uma nova instância do WhatsApp para começar a usar o sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="alias" className="text-sm font-medium text-foreground">
                  Nome da Instância
                </Label>
                <Input
                  id="alias"
                  value={formData.alias}
                  onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
                  placeholder="Ex: WhatsApp Principal, Loja Online, Suporte..."
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instance_id" className="text-sm font-medium text-foreground">
                  ID da Instância
                </Label>
                <Input
                  id="instance_id"
                  value={formData.instance_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, instance_id: e.target.value }))}
                  placeholder="Ex: 3C7F4A2B1D8E9F0A"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instance_token" className="text-sm font-medium text-foreground">
                  Token da Instância
                </Label>
                <Input
                  id="instance_token"
                  value={formData.instance_token}
                  onChange={(e) => setFormData(prev => ({ ...prev, instance_token: e.target.value }))}
                  placeholder="Ex: 1A2B3C4D5E6F7G8H9I0J"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_security_token" className="text-sm font-medium text-foreground">
                  Token de Segurança
                </Label>
                <Input
                  id="client_security_token"
                  value={formData.client_security_token}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_security_token: e.target.value }))}
                  placeholder="Ex: 9Z8Y7X6W5V4U3T2S1R0Q"
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-3 pt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                className="h-11 px-6"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddInstance}
                className="h-11 px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
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
                            onClick={() => handleDeleteInstance(instance)}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold">Configurações da Instância</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Configure as opções da instância <strong>&ldquo;{selectedInstance?.alias}&rdquo;</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Leitura Automática */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground border-b pb-2">Leitura Automática</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoReadMessage" className="text-sm font-medium text-foreground">
                        Leitura Automática de Mensagens
                      </Label>
                    </div>
                    <Switch
                      id="autoReadMessage"
                      checked={settingsData.autoReadMessage}
                      onCheckedChange={(checked) => 
                        setSettingsData(prev => ({ ...prev, autoReadMessage: checked }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoReadStatus" className="text-sm font-medium text-foreground">
                        Leitura Automática de Status
                      </Label>
                    </div>
                    <Switch
                      id="autoReadStatus"
                      checked={settingsData.autoReadStatus}
                      onCheckedChange={(checked) => 
                        setSettingsData(prev => ({ ...prev, autoReadStatus: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rejeição de Chamadas */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground border-b pb-2">Rejeição de Chamadas</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="callRejectAuto" className="text-sm font-medium text-foreground">
                      Rejeitar Chamadas Automaticamente
                    </Label>
                  </div>
                  <Switch
                    id="callRejectAuto"
                    checked={settingsData.callRejectAuto}
                    onCheckedChange={(checked) => 
                      setSettingsData(prev => ({ ...prev, callRejectAuto: checked }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="callRejectMessage" className="text-sm font-medium text-foreground">
                    Mensagem de Rejeição
                  </Label>
                  <Input
                    id="callRejectMessage"
                    value={settingsData.callRejectMessage}
                    onChange={(e) => 
                      setSettingsData(prev => ({ ...prev, callRejectMessage: e.target.value }))
                    }
                    placeholder="Ex: Desculpe, não posso atender no momento. Envie uma mensagem!"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Perfil */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground border-b pb-2">Perfil do WhatsApp</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profileName" className="text-sm font-medium text-foreground">
                    Nome do Perfil
                  </Label>
                  <Input
                    id="profileName"
                    value={settingsData.profileName}
                    onChange={(e) => 
                      setSettingsData(prev => ({ ...prev, profileName: e.target.value }))
                    }
                    placeholder="Ex: Suporte Técnico, Loja Online..."
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileDescription" className="text-sm font-medium text-foreground">
                    Descrição do Perfil
                  </Label>
                  <Input
                    id="profileDescription"
                    value={settingsData.profileDescription}
                    onChange={(e) => 
                      setSettingsData(prev => ({ ...prev, profileDescription: e.target.value }))
                    }
                    placeholder="Ex: Atendimento 24h, Suporte técnico..."
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profilePicture" className="text-sm font-medium text-foreground">
                  URL da Foto do Perfil
                </Label>
                <Input
                  id="profilePicture"
                  value={settingsData.profilePicture}
                  onChange={(e) => 
                    setSettingsData(prev => ({ ...prev, profilePicture: e.target.value }))
                  }
                  placeholder="https://exemplo.com/foto-perfil.jpg"
                  className="h-11"
                />
              </div>
            </div>

            {/* Notificações */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground border-b pb-2">Notificações</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifySentByMe" className="text-sm font-medium text-foreground">
                      Notificar todas as mensagens enviadas por mim
                    </Label>
                  </div>
                  <Switch
                    id="notifySentByMe"
                    checked={settingsData.notifySentByMe}
                    onCheckedChange={(checked) => 
                      setSettingsData(prev => ({ ...prev, notifySentByMe: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Webhooks */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground border-b pb-2">Configuração de Webhooks</h4>
              <p className="text-sm text-muted-foreground">Configure os webhooks para receber eventos em tempo real</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="webhookDelivery" className="text-sm font-medium text-foreground">
                    📤 Entrega de Mensagens
                  </Label>
                  <Input
                    id="webhookDelivery"
                    value={settingsData.webhookDelivery}
                    onChange={(e) => 
                      setSettingsData(prev => ({ ...prev, webhookDelivery: e.target.value }))
                    }
                    placeholder="https://ito-two.vercel.app/api/zapi/webhooks/delivery"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookReceived" className="text-sm font-medium text-foreground">
                    📥 Mensagens Recebidas
                  </Label>
                  <Input
                    id="webhookReceived"
                    value={settingsData.webhookReceived}
                    onChange={(e) => 
                      setSettingsData(prev => ({ ...prev, webhookReceived: e.target.value }))
                    }
                    placeholder="https://ito-two.vercel.app/api/zapi/webhooks/received"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookReceivedDelivery" className="text-sm font-medium text-foreground">
                    📨 Entrega de Mensagens Recebidas
                  </Label>
                  <Input
                    id="webhookReceivedDelivery"
                    value={settingsData.webhookReceivedDelivery}
                    onChange={(e) => 
                      setSettingsData(prev => ({ ...prev, webhookReceivedDelivery: e.target.value }))
                    }
                    placeholder="https://ito-two.vercel.app/api/zapi/webhooks/received"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookDisconnected" className="text-sm font-medium text-foreground">
                    🔌 Desconexão
                  </Label>
                  <Input
                    id="webhookDisconnected"
                    value={settingsData.webhookDisconnected}
                    onChange={(e) => 
                      setSettingsData(prev => ({ ...prev, webhookDisconnected: e.target.value }))
                    }
                    placeholder="https://ito-two.vercel.app/api/zapi/webhooks/disconnected"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookMessageStatus" className="text-sm font-medium text-foreground">
                    ⚡ Status das Mensagens
                  </Label>
                  <Input
                    id="webhookMessageStatus"
                    value={settingsData.webhookMessageStatus}
                    onChange={(e) => 
                      setSettingsData(prev => ({ ...prev, webhookMessageStatus: e.target.value }))
                    }
                    placeholder="https://ito-two.vercel.app/api/zapi/webhooks/status"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookChatPresence" className="text-sm font-medium text-foreground">
                    📍 Presença no Chat
                  </Label>
                  <Input
                    id="webhookChatPresence"
                    value={settingsData.webhookChatPresence}
                    onChange={(e) => 
                      setSettingsData(prev => ({ ...prev, webhookChatPresence: e.target.value }))
                    }
                    placeholder="https://ito-two.vercel.app/api/zapi/webhooks/chat-presence"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookConnected" className="text-sm font-medium text-foreground">
                    ✅ Conexão
                  </Label>
                  <Input
                    id="webhookConnected"
                    value={settingsData.webhookConnected}
                    onChange={(e) => 
                      setSettingsData(prev => ({ ...prev, webhookConnected: e.target.value }))
                    }
                    placeholder="https://ito-two.vercel.app/api/zapi/webhooks/connected"
                    className="h-11"
                  />
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-muted border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>💡 Dica:</strong> Use o botão &ldquo;Webhooks Vercel&rdquo; para configurar todos os webhooks automaticamente com as URLs corretas.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3 pt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsSettingsDialogOpen(false)}
              className="h-11 px-6"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateSettings}
              className="h-11 px-6"
            >
              <Settings className="h-4 w-4 mr-2" />
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
            {qrCodeData?.image && qrCodeData.image.trim() !== '' ? (
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
                  <p className="text-muted-foreground">
                    {qrCodeData ? 'Erro ao gerar QR Code' : 'Gerando QR Code...'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Indicador de aguardando conexão */}
            {qrCodeData?.image && qrCodeData.image.trim() !== '' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-blue-700">
                    Aguardando conexão do WhatsApp...
                  </p>
                </div>
                <p className="text-xs text-blue-600 mt-1 text-center">
                  Escaneie o QR Code com seu WhatsApp. A tela fechará automaticamente quando conectar.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar a instância <strong>&ldquo;{instanceToDelete?.alias}&rdquo;</strong>?
              <br />
              <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setInstanceToDelete(null)
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteInstance}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Deletar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
