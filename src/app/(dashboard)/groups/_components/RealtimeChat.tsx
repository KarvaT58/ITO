"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  Users, 
  Wifi, 
  WifiOff, 
  Clock,
  Crown,
  MessageSquare
} from "lucide-react"
import { Group, GroupParticipant } from "./types"
import { mentionMembers } from "@/server/actions/groups"

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  isFromMe: boolean
  isAdmin?: boolean
  mentioned?: string[]
}

interface RealtimeChatProps {
  group: Group
  onGroupUpdate: (group: Group) => void
}

export function RealtimeChat({ group, onGroupUpdate }: RealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Simular carregamento de mensagens
  useEffect(() => {
    loadMessages()
  }, [group.id])

  // Configurar conexão em tempo real
  useEffect(() => {
    setupRealtimeConnection()
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [group.id])

  // Auto-scroll para última mensagem
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    // Simular carregamento de mensagens - em produção, fazer chamada para API
    const mockMessages: ChatMessage[] = [
      {
        id: "1",
        sender: "5511999999999",
        message: "Olá pessoal! Bem-vindos ao grupo!",
        timestamp: "2024-01-15T10:30:00Z",
        isFromMe: false,
        isAdmin: true
      },
      {
        id: "2",
        sender: "5511888888888",
        message: "Obrigado pela criação do grupo!",
        timestamp: "2024-01-15T10:32:00Z",
        isFromMe: false,
        isAdmin: false
      },
      {
        id: "3",
        sender: "me",
        message: "Vamos começar as discussões!",
        timestamp: "2024-01-15T10:35:00Z",
        isFromMe: true,
        isAdmin: true
      }
    ]
    
    setMessages(mockMessages)
  }

  const setupRealtimeConnection = () => {
    try {
      // Simular conexão Server-Sent Events
      // Em produção, usar WebSocket ou SSE real
      setConnectionStatus("connecting")
      
      // Simular conexão bem-sucedida
      setTimeout(() => {
        setIsConnected(true)
        setConnectionStatus("connected")
      }, 1000)

      // Simular mensagens em tempo real
      const interval = setInterval(() => {
        if (Math.random() > 0.8) { // 20% de chance a cada 5 segundos
          const randomParticipant = group.participants[Math.floor(Math.random() * group.participants.length)]
          const randomMessages = [
            "Nova mensagem automática!",
            "Teste de tempo real",
            "Mensagem simulada",
            "Funcionando perfeitamente!"
          ]
          
          const newMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: randomParticipant.phone,
            message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
            timestamp: new Date().toISOString(),
            isFromMe: false,
            isAdmin: randomParticipant.isAdmin
          }
          
          setMessages(prev => [...prev, newMessage])
        }
      }, 5000)

      return () => clearInterval(interval)
    } catch (error) {
      console.error("Erro ao conectar:", error)
      setConnectionStatus("disconnected")
      setIsConnected(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: "me",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isFromMe: true,
      isAdmin: group.isAdmin
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
    setIsTyping(true)

    // Simular envio de mensagem - em produção, fazer chamada para Z-API
    try {
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular resposta automática ocasional
      if (Math.random() > 0.7) {
        setTimeout(() => {
          const randomParticipant = group.participants[Math.floor(Math.random() * group.participants.length)]
          const autoReply: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: randomParticipant.phone,
            message: "Mensagem recebida!",
            timestamp: new Date().toISOString(),
            isFromMe: false,
            isAdmin: randomParticipant.isAdmin
          }
          setMessages(prev => [...prev, autoReply])
        }, 2000)
      }
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
    } finally {
      setIsTyping(false)
    }
  }

  const sendMentionMessage = async (message: string, mentioned: string[]) => {
    if (!message.trim() || !isConnected) return

    try {
      const result = await mentionMembers({
        phone: group.phone,
        message: message.trim(),
        mentioned
      })

      if (result.success) {
        const mentionMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: "me",
          message: message.trim(),
          timestamp: new Date().toISOString(),
          isFromMe: true,
          isAdmin: group.isAdmin,
          mentioned
        }

        setMessages(prev => [...prev, mentionMessage])
        alert("Mensagem com menção enviada com sucesso!")
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem com menção:", error)
      alert("Erro ao enviar mensagem com menção")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })
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

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-500"
      case "connecting":
        return "text-yellow-500"
      case "disconnected":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Conectado"
      case "connecting":
        return "Conectando..."
      case "disconnected":
        return "Desconectado"
      default:
        return "Desconhecido"
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header do Chat */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {group.participants.length} participante(s) • {messages.length} mensagem(ns)
                  </span>
                  <div className={`flex items-center space-x-1 ${getConnectionStatusColor()}`}>
                    {isConnected ? (
                      <Wifi className="w-4 h-4" />
                    ) : (
                      <WifiOff className="w-4 h-4" />
                    )}
                    <span className="text-xs">{getConnectionStatusText()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Tempo Real" : "Offline"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Área de Mensagens */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat em Tempo Real
            {typingUsers.length > 0 && (
              <span className="text-sm text-muted-foreground ml-2">
                {typingUsers.join(", ")} está digitando...
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isFromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.isFromMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {!message.isFromMe && (
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="text-xs font-medium">
                          {getParticipantName(message.sender)}
                        </span>
                        {message.isAdmin && (
                          <Crown className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                    )}
                    <p className="text-sm">{message.message}</p>
                    {message.mentioned && message.mentioned.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs opacity-70">
                          Mencionou: {message.mentioned.join(", ")}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <Clock className="w-3 h-3 opacity-70" />
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        Enviando...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <Separator />
          
          {/* Input de Mensagem */}
          <div className="p-4">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Digite sua mensagem..." : "Conectando..."}
                disabled={!isConnected}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Pressione Enter para enviar, Shift+Enter para nova linha
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const mentioned = group.participants.slice(0, 2).map(p => p.phone)
                    sendMentionMessage("Mensagem com menção para alguns participantes!", mentioned)
                  }}
                  disabled={!isConnected}
                >
                  Mencionar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allPhones = group.participants.map(p => p.phone)
                    sendMentionMessage("Mensagem para todos os participantes!", allPhones)
                  }}
                  disabled={!isConnected}
                >
                  Mencionar Todos
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
