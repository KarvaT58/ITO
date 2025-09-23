"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  MoreVertical
} from "lucide-react"
import { ZApiInstance } from "@/lib/zapi/types"
import { 
  createZapiInstance, 
  listZapiInstances, 
  deleteZapiInstance, 
  updateZapiInstance,
  zapiAction
} from "@/server/actions/zapi"
import { toast } from "sonner"

export function ZapiTab() {
  const [instances, setInstances] = useState<ZApiInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false)
  const [selectedInstance, setSelectedInstance] = useState<ZApiInstance | null>(null)
  const [instanceStatus, setInstanceStatus] = useState<Record<string, unknown>>({})
  const [qrCodeData, setQrCodeData] = useState<{ bytes?: string; image?: string } | null>(null)
  const [qrPollingInterval, setQrPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [instanceToDelete, setInstanceToDelete] = useState<ZApiInstance | null>(null)
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false)
  const [instanceToDisconnect, setInstanceToDisconnect] = useState<ZApiInstance | null>(null)

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
      toast.error('Erro ao carregar instâncias', { position: 'bottom-right' })
    } finally {
      setLoading(false)
    }
  }



  const handleAddInstance = async () => {
    try {
      await createZapiInstance(formData)
      toast.success('Instância criada com sucesso', { position: 'bottom-right' })
      setIsAddDialogOpen(false)
      setFormData({ alias: '', instance_id: '', instance_token: '', client_security_token: '' })
      loadInstances()
    } catch {
      toast.error('Erro ao criar instância', { position: 'bottom-right' })
    }
  }

  const handleDeleteInstance = async (instance: ZApiInstance) => {
    setInstanceToDelete(instance)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteInstance = async () => {
    if (!instanceToDelete) return
    
    try {
      // Primeiro, tentar desconectar da Z-API
      try {
        await zapiAction({ id: instanceToDelete.id, action: 'disconnect' })
        toast.success('Instância desconectada da Z-API', { position: 'bottom-right' })
      } catch (disconnectError) {
        console.warn('Erro ao desconectar da Z-API (continuando com exclusão):', disconnectError)
        // Continuar com a exclusão mesmo se a desconexão falhar
      }
      
      // Depois, deletar do banco de dados
      await deleteZapiInstance(instanceToDelete.id)
      toast.success('Instância deletada com sucesso', { position: 'bottom-right' })
      loadInstances()
      setIsDeleteDialogOpen(false)
      setInstanceToDelete(null)
    } catch (error) {
      console.error('Erro ao deletar instância:', error)
      toast.error('Erro ao deletar instância', { position: 'bottom-right' })
    }
  }

  const handleDisconnectInstance = (instance: ZApiInstance) => {
    setInstanceToDisconnect(instance)
    setIsDisconnectDialogOpen(true)
  }

  const confirmDisconnectInstance = async () => {
    if (!instanceToDisconnect) return
    
    try {
      await zapiAction({ id: instanceToDisconnect.id, action: 'disconnect' })
      toast.success('Instância desconectada com sucesso', { position: 'bottom-right' })
      loadInstances()
      setIsDisconnectDialogOpen(false)
      setInstanceToDisconnect(null)
    } catch (error) {
      console.error('Erro ao desconectar instância:', error)
      toast.error('Erro ao desconectar instância', { position: 'bottom-right' })
    }
  }

  const testZapiConfigurations = async (instanceId: string) => {
    try {
      console.log('🧪 [TESTE] ===== TESTANDO CONFIGURAÇÕES DA ZAPI =====')
      
      // Testar cada configuração individualmente
      const tests = [
        { name: 'autoReadMessage', action: 'autoReadMessage', payload: { valor: true } },
        { name: 'autoReadStatus', action: 'autoReadStatus', payload: { valor: true } },
        { name: 'callRejectAuto', action: 'callRejectAuto', payload: { valor: true } },
        { name: 'notifySentByMe', action: 'notifySentByMe', payload: { notifySentByMe: true } }
      ]
      
      for (const test of tests) {
        console.log(`🧪 [TESTE] Testando ${test.name}...`)
        try {
          const result = await zapiAction({ id: instanceId, action: test.action, payload: test.payload })
          console.log(`✅ [TESTE] ${test.name} - Resposta:`, result)
        } catch (error) {
          console.error(`❌ [TESTE] ${test.name} - Erro:`, error)
        }
      }
      
      console.log('🧪 [TESTE] ===== FIM TESTE CONFIGURAÇÕES =====')
      toast.success('Teste de configurações executado - veja o console', { position: 'bottom-right' })
    } catch (error) {
      console.error('Erro ao testar configurações:', error)
      toast.error('Erro ao testar configurações', { position: 'bottom-right' })
    }
  }

  const handleZapiAction = async (instanceId: string, action: string, payload?: unknown) => {
    try {
      console.log(`Executando ação ${action} para instância ${instanceId}`)
      const result = await zapiAction({ id: instanceId, action, payload })
      
      // Feedback específico para cada ação
      switch (action) {
        case 'status':
          console.log('🔍 [DEBUG] ===== STATUS DETALHADO DA INSTÂNCIA =====')
          console.log('🔍 [DEBUG] Resposta completa da ZAPI:', result)
          console.log('🔍 [DEBUG] Status da conexão:', result)
          toast.success('Status verificado - veja o console para detalhes', { position: 'bottom-right' })
          setInstanceStatus(prev => ({ ...prev, [instanceId]: result }))
          break
        case 'restart':
          toast.success('Instância reiniciada com sucesso', { position: 'bottom-right' })
          // Recarregar status após reiniciar
          setTimeout(() => {
            handleZapiAction(instanceId, 'status')
          }, 2000)
          break
        case 'disconnect':
          toast.success('Instância desconectada com sucesso', { position: 'bottom-right' })
          setInstanceStatus(prev => ({ ...prev, [instanceId]: { connected: false } }))
          break
        default:
          toast.success('Ação executada com sucesso', { position: 'bottom-right' })
      }
      
      return result
    } catch (error) {
      console.error(`Erro ao executar ${action}:`, error)
      toast.error(`Erro ao executar ${action}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, { position: 'bottom-right' })
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
        toast.success('QR Code gerado com sucesso', { position: 'bottom-right' })
        
        // Iniciar polling para verificar conexão
        startQrPolling(instance.id)
      } else {
        console.error('Dados inválidos extraídos:', { qrBytes, qrImage })
        throw new Error('Resposta inválida da API - dados vazios')
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      toast.error(`Erro ao gerar QR Code: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, { position: 'bottom-right' })
      setQrCodeData({ bytes: '', image: '' }) // Set empty to show error state
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
        
        toast.success('WhatsApp conectado com sucesso!', { position: 'bottom-right' })
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
    console.log('🔍 [DEBUG] ===== CARREGANDO CONFIGURAÇÕES DO BANCO =====')
    console.log('🔍 [DEBUG] Dados brutos da instância:', instance)
    console.log('🔍 [DEBUG] Valores específicos das 4 configurações:')
    console.log('🔍 [DEBUG] - auto_read_message:', instance.auto_read_message, '(tipo:', typeof instance.auto_read_message, ')')
    console.log('🔍 [DEBUG] - auto_read_status:', instance.auto_read_status, '(tipo:', typeof instance.auto_read_status, ')')
    console.log('🔍 [DEBUG] - call_reject_auto:', instance.call_reject_auto, '(tipo:', typeof instance.call_reject_auto, ')')
    console.log('🔍 [DEBUG] - notify_sent_by_me:', instance.notify_sent_by_me, '(tipo:', typeof instance.notify_sent_by_me, ')')
    
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
    
    console.log('✅ [DEBUG] Configurações carregadas e definidas no state:')
    console.log('✅ [DEBUG] - autoReadMessage:', instance.auto_read_message ?? false)
    console.log('✅ [DEBUG] - autoReadStatus:', instance.auto_read_status ?? false)
    console.log('✅ [DEBUG] - callRejectAuto:', instance.call_reject_auto ?? false)
    console.log('✅ [DEBUG] - notifySentByMe:', instance.notify_sent_by_me ?? false)
    console.log('✅ [DEBUG] ===== FIM CARREGAMENTO CONFIGURAÇÕES =====')
  }

  const handleUpdateSettings = async () => {
    if (!selectedInstance) return
    
    setIsSavingSettings(true)
    
    // Fechar o formulário imediatamente
    setIsSettingsDialogOpen(false)
    
    try {
      console.log('🔍 [DEBUG] ===== INICIANDO DEBUG DAS CONFIGURAÇÕES =====')
      console.log('🔍 [DEBUG] Instância selecionada:', selectedInstance.alias)
      console.log('🔍 [DEBUG] ID da instância:', selectedInstance.id)
      console.log('🔍 [DEBUG] Dados de configuração atuais:', {
        autoReadMessage: settingsData.autoReadMessage,
        autoReadStatus: settingsData.autoReadStatus,
        callRejectAuto: settingsData.callRejectAuto,
        callRejectMessage: settingsData.callRejectMessage,
        notifySentByMe: settingsData.notifySentByMe
      })
      
      toast.loading('Conectando Webhooks e Configurações!', {
        id: 'saving-settings',
        position: 'bottom-right',
        duration: 0 // Não desaparece automaticamente
      })
      
      // Configurações gerais do WhatsApp - executar sequencialmente para evitar conflitos
      const generalSettings = [
        { action: 'autoReadMessage', payload: { valor: settingsData.autoReadMessage } },
        { action: 'autoReadStatus', payload: { valor: settingsData.autoReadStatus } },
        { action: 'callRejectAuto', payload: { valor: settingsData.callRejectAuto } },
        { action: 'callRejectMessage', payload: { value: settingsData.callRejectMessage } },
        { action: 'notifySentByMe', payload: { notifySentByMe: settingsData.notifySentByMe } }
      ]

      for (const setting of generalSettings) {
        try {
          console.log(`🔍 [DEBUG] ===== EXECUTANDO ${setting.action.toUpperCase()} =====`)
          console.log(`🔍 [DEBUG] Payload enviado:`, setting.payload)
          console.log(`🔍 [DEBUG] Tipo do valor:`, typeof Object.values(setting.payload)[0])
          console.log(`🔍 [DEBUG] Valor booleano:`, Object.values(setting.payload)[0])
          
          const result = await zapiAction({ id: selectedInstance.id, action: setting.action, payload: setting.payload })
          
          console.log(`✅ [DEBUG] ${setting.action} executado com sucesso!`)
          console.log(`✅ [DEBUG] Resposta da ZAPI:`, result)
          console.log(`✅ [DEBUG] ===== FIM ${setting.action.toUpperCase()} =====`)
        } catch (error) {
          console.error(`❌ [DEBUG] ===== ERRO EM ${setting.action.toUpperCase()} =====`)
          console.error(`❌ [DEBUG] Erro completo:`, error)
          console.error(`❌ [DEBUG] Mensagem do erro:`, error instanceof Error ? error.message : 'Erro desconhecido')
          console.error(`❌ [DEBUG] Stack trace:`, error instanceof Error ? error.stack : 'N/A')
          console.error(`❌ [DEBUG] ===== FIM ERRO ${setting.action.toUpperCase()} =====`)
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
      console.log('🔍 [DEBUG] ===== SALVANDO NO BANCO DE DADOS =====')
      console.log('🔍 [DEBUG] Dados que serão salvos no banco:', {
        notify_sent_by_me: settingsData.notifySentByMe,
        call_reject_auto: settingsData.callRejectAuto,
        call_reject_message: settingsData.callRejectMessage,
        auto_read_message: settingsData.autoReadMessage,
        auto_read_status: settingsData.autoReadStatus
      })
      
      try {
        const updateResult = await updateZapiInstance(selectedInstance.id, {
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
        console.log('✅ [DEBUG] Configurações salvas no banco com sucesso!')
        console.log('✅ [DEBUG] Resultado da atualização:', updateResult)
        console.log('✅ [DEBUG] ===== FIM SALVAMENTO BANCO =====')
      } catch (error) {
        console.error('❌ [DEBUG] ===== ERRO AO SALVAR NO BANCO =====')
        console.error('❌ [DEBUG] Erro completo:', error)
        console.error('❌ [DEBUG] Mensagem do erro:', error instanceof Error ? error.message : 'Erro desconhecido')
        console.error('❌ [DEBUG] ===== FIM ERRO BANCO =====')
        // Continuar mesmo se falhar ao salvar no banco
      }

      toast.dismiss('saving-settings')
      toast.success('Configurações atualizadas com sucesso!', {
        position: 'bottom-right'
      })
      setIsSettingsDialogOpen(false)
      loadInstances()
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      toast.dismiss('saving-settings')
      toast.error(`Erro ao atualizar configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, {
        position: 'bottom-right'
      })
    } finally {
      setIsSavingSettings(false)
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
                        <div className="flex items-center space-x-4">
                          {/* Data à esquerda */}
                          <div className="text-sm text-muted-foreground">
                            <strong>Criada:</strong> {new Date(instance.created_at).toLocaleString('pt-BR')}
                          </div>
                          
                          {/* Botões à direita */}
                          <div className="flex items-center space-x-2">
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
                                <DropdownMenuItem onClick={() => handleZapiAction(instance.id, 'status')}>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Verificar Status Detalhado
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => testZapiConfigurations(instance.id)}>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Testar Configurações
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleZapiAction(instance.id, 'restart')}>
                                  <Power className="h-4 w-4 mr-2" />
                                  Reiniciar Instância
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDisconnectInstance(instance)}>
                                  <PowerOff className="h-4 w-4 mr-2" />
                                  Desconectar
                                </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openSettingsDialog(instance)}>
                                <Settings className="h-4 w-4 mr-2" />
                                Configurações
                              </DropdownMenuItem>
                              {!isConnected && (
                                <DropdownMenuItem onClick={() => handleShowQrCode(instance)}>
                                  <QrCode className="h-4 w-4 mr-2" />
                                  QR Code
                                </DropdownMenuItem>
                              )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteInstance(instance)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CardDescription>
                        {instance.phone || 'Telefone não informado'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Card vazio - data movida para o header */}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
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
              disabled={isSavingSettings}
              className="h-11 px-6"
            >
              {isSavingSettings ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Conectando Webhooks e Configurações!
                </>
              ) : (
                'Salvar Configurações'
              )}
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
              <div className="mt-6 flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent"></div>
                  <p className="text-lg font-medium text-foreground">
                    Aguardando conexão do WhatsApp...
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Escaneie o QR Code com seu WhatsApp
                  </p>
                  <p className="text-xs text-muted-foreground">
                    A tela fechará automaticamente quando conectar
                  </p>
                </div>
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

      {/* Dialog de confirmação de desconexão */}
      <Dialog open={isDisconnectDialogOpen} onOpenChange={setIsDisconnectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Desconexão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja desconectar a instância <strong>&ldquo;{instanceToDisconnect?.alias}&rdquo;</strong>?
              <br />
              <span className="text-orange-600 font-medium">A instância será desconectada da Z-API.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDisconnectDialogOpen(false)
                setInstanceToDisconnect(null)
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDisconnectInstance}
            >
              <PowerOff className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
