"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  Trash2,
  RefreshCw,
  Power,
  PowerOff,
  QrCode,
  Download,
  Copy,
  MoreVertical
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
      console.log(`Executando ação ${action} para instância ${instanceId}`)
      const result = await zapiAction({ id: instanceId, action, payload })
      
      // Feedback específico para cada ação
      switch (action) {
        case 'status':
          toast.success('Status verificado com sucesso')
          setInstanceStatus(prev => ({ ...prev, [instanceId]: result }))
          break
        case 'restart':
          toast.success('Instância reiniciada com sucesso')
          // Recarregar status após reiniciar
          setTimeout(() => {
            handleZapiAction(instanceId, 'status')
          }, 2000)
          break
        case 'disconnect':
          toast.success('Instância desconectada com sucesso')
          setInstanceStatus(prev => ({ ...prev, [instanceId]: { connected: false } }))
          break
        default:
          toast.success('Ação executada com sucesso')
      }
      
      return result
    } catch (error) {
      console.error(`Erro ao executar ${action}:`, error)
      toast.error(`Erro ao executar ${action}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
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
    
    // Carregar configurações salvas do banco de dados
    setSettingsData({
      autoReadMessage: instance.auto_read_message ?? false,
      autoReadStatus: instance.auto_read_status ?? false,
      callRejectAuto: instance.call_reject_auto ?? false,
      callRejectMessage: instance.call_reject_message ?? '',
      profileName: instance.profile_name ?? '',
      profileDescription: instance.profile_description ?? '',
      profilePicture: instance.profile_picture ?? '',
      notifySentByMe: instance.notify_sent_by_me ?? false,
      webhookDelivery: instance.webhook_delivery ?? '',
      webhookReceived: instance.webhook_received ?? '',
      webhookReceivedDelivery: instance.webhook_received ?? '', // Usar o mesmo valor do webhook_received
      webhookDisconnected: instance.webhook_disconnected ?? '',
      webhookMessageStatus: instance.webhook_message_status ?? '',
      webhookChatPresence: instance.webhook_chat_presence ?? '',
      webhookConnected: instance.webhook_connected ?? ''
    })
    
    console.log('Configurações carregadas do banco:', {
      autoReadMessage: instance.auto_read_message,
      autoReadStatus: instance.auto_read_status,
      callRejectAuto: instance.call_reject_auto,
      webhookDelivery: instance.webhook_delivery
    })
  }

  const handleUpdateSettings = async () => {
    if (!selectedInstance) return
    
    try {
      console.log('Iniciando atualização de configurações para:', selectedInstance.alias)
      console.log('Dados de configuração:', settingsData)
      
      // Configurações gerais do WhatsApp - executar sequencialmente para evitar conflitos
      const generalSettings = [
        { action: 'autoReadMessage', payload: { enable: settingsData.autoReadMessage } },
        { action: 'autoReadStatus', payload: { enable: settingsData.autoReadStatus } },
        { action: 'callRejectAuto', payload: { enable: settingsData.callRejectAuto } },
        { action: 'callRejectMessage', payload: { message: settingsData.callRejectMessage } },
        { action: 'notifySentByMe', payload: { enable: settingsData.notifySentByMe } }
      ]

      for (const setting of generalSettings) {
        try {
          console.log(`Executando ${setting.action}:`, setting.payload)
          await zapiAction({ id: selectedInstance.id, action: setting.action, payload: setting.payload })
          console.log(`✅ ${setting.action} executado com sucesso`)
        } catch (error) {
          console.error(`❌ Erro em ${setting.action}:`, error)
          // Continuar com as outras configurações mesmo se uma falhar
        }
      }

      // Webhooks individuais - executar sequencialmente
      const webhookSettings = [
        { action: 'webhookDelivery', payload: { url: settingsData.webhookDelivery } },
        { action: 'webhookDisconnected', payload: { url: settingsData.webhookDisconnected } },
        { action: 'webhookReceived', payload: { url: settingsData.webhookReceived } },
        { action: 'webhookChatPresence', payload: { url: settingsData.webhookChatPresence } },
        { action: 'webhookMessageStatus', payload: { url: settingsData.webhookMessageStatus } },
        { action: 'webhookConnected', payload: { url: settingsData.webhookConnected } }
      ]

      for (const webhook of webhookSettings) {
        try {
          console.log(`Executando ${webhook.action}:`, webhook.payload)
          await zapiAction({ id: selectedInstance.id, action: webhook.action, payload: webhook.payload })
          console.log(`✅ ${webhook.action} executado com sucesso`)
        } catch (error) {
          console.error(`❌ Erro em ${webhook.action}:`, error)
          // Continuar com os outros webhooks mesmo se um falhar
        }
      }
      
      // Salvar configurações no banco de dados
      try {
        await updateZapiInstance(selectedInstance.id, {
          webhook_delivery: settingsData.webhookDelivery,
          webhook_disconnected: settingsData.webhookDisconnected,
          webhook_received: settingsData.webhookReceived,
          webhook_chat_presence: settingsData.webhookChatPresence,
          webhook_message_status: settingsData.webhookMessageStatus,
          webhook_connected: settingsData.webhookConnected,
          notify_sent_by_me: settingsData.notifySentByMe,
          call_reject_auto: settingsData.callRejectAuto,
          call_reject_message: settingsData.callRejectMessage,
          auto_read_message: settingsData.autoReadMessage,
          auto_read_status: settingsData.autoReadStatus,
          // profile_name: settingsData.profileName,
          // profile_description: settingsData.profileDescription,
          // profile_picture: settingsData.profilePicture,
        })
        console.log('✅ Configurações salvas no banco de dados')
      } catch (error) {
        console.error('❌ Erro ao salvar configurações no banco:', error)
        // Continuar mesmo se falhar ao salvar no banco
      }

      toast.success('Configurações atualizadas com sucesso!')
      setIsSettingsDialogOpen(false)
      loadInstances()
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      toast.error(`Erro ao atualizar configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {/* QR Code - só aparece quando desconectado */}
                          {!isConnected && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShowQrCode(instance)}
                            >
                              <QrCode className="h-4 w-4 mr-2" />
                              QR Code
                            </Button>
                          )}
                        </div>
                        
                        {/* Menu de ações */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleZapiAction(instance.id, 'status')}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Verificar Status
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleZapiAction(instance.id, 'restart')}>
                              <Power className="h-4 w-4 mr-2" />
                              Reiniciar Instância
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleZapiAction(instance.id, 'disconnect')}>
                              <PowerOff className="h-4 w-4 mr-2" />
                              Desconectar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openSettingsDialog(instance)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Configurações
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Sistema de horário */}
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>
                              <strong>Criada:</strong> {new Date(instance.created_at).toLocaleString('pt-BR')}
                            </span>
                            <span>
                              <strong>Atualizada:</strong> {new Date(instance.updated_at).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div className="text-xs">
                            {isConnected ? (
                              <span className="text-green-600">🟢 Conectado</span>
                            ) : (
                              <span className="text-red-600">🔴 Desconectado</span>
                            )}
                          </div>
                        </div>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold">Webhooks e configurações gerais</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Configure webhooks para sua instância permite que você receba eventos dela.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Webhooks */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground border-b pb-2">Configurar webhooks</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookDelivery" className="text-sm font-medium text-foreground">
                    No envio
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
                  <Label htmlFor="webhookDisconnected" className="text-sm font-medium text-foreground">
                    Ao desconectar
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
                  <Label htmlFor="webhookReceived" className="text-sm font-medium text-foreground">
                    Ao receber
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
                  <Label htmlFor="webhookChatPresence" className="text-sm font-medium text-foreground">
                    Presença no chat
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
                  <Label htmlFor="webhookMessageStatus" className="text-sm font-medium text-foreground">
                    Status da mensagem recebida
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
                  <Label htmlFor="webhookConnected" className="text-sm font-medium text-foreground">
                    Ao conectar
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
            </div>

            {/* Notificar todas as mensagens enviadas por mim */}
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

            {/* Configurações do WhatsApp */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground border-b pb-2">Configurações do WhatsApp</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="callRejectAuto" className="text-sm font-medium text-foreground">
                      Rejeitar chamadas automaticamente
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
                    Mensagem de rejeição
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
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoReadMessage" className="text-sm font-medium text-foreground">
                      Ler mensagens automaticamente
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
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoReadStatus" className="text-sm font-medium text-foreground">
                      Ler status automaticamente
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
