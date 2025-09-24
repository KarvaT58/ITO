'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  MoreVertical, 
  Phone, 
  Mail, 
  Tag, 
  Upload, 
  Search,
  User,
  UserPlus,
  UserMinus,
  Shield,
  Flag,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react"
import { toast } from "sonner"
import { 
  addContactsToZApi, 
  createContact,
  getContacts,
  getTags
} from '@/server/actions/contacts'

// Tipos
interface Contact {
  id: string
  name: string
  short?: string
  phone: string
  email?: string
  tags: string[]
  notify?: string
  vname?: string
  imgUrl?: string
  isBlocked?: boolean
  hasWhatsApp?: boolean
  createdAt: Date
  updatedAt: Date
}

interface Tag {
  id: string
  name: string
  color: string
  contactsCount: number
}

interface ZApiInstance {
  id: string
  alias: string
  instance_id: string
  instance_token: string
  client_security_token: string
  connected: boolean
}

export function ContactsTab() {
  // Estados
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedInstance, setSelectedInstance] = useState<ZApiInstance | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  // Estados para modais
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  // Estados para formulários
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    tags: [] as string[]
  })

  const [csvData, setCsvData] = useState('')
  const [newTag, setNewTag] = useState({
    name: '',
    color: '#3b82f6'
  })

  // Carregar dados iniciais
  useEffect(() => {
    loadContacts()
    loadTags()
  }, [])

  // Simular instância selecionada
  useEffect(() => {
    setSelectedInstance({
      id: '1',
      alias: 'Zapi',
      instance_id: '3E6044FF2AD36009F1136EDA9E2AF219',
      instance_token: '3A73D8E67AA46D688B442AD5',
      client_security_token: 'Fd01b0f4c925f4b0394de144dd5d42c23S',
      connected: true
    })
  }, [])

  const loadContacts = async () => {
    try {
      const result = await getContacts(searchTerm, selectedTag)
      
      if (result.success && result.data) {
        setContacts(result.data.map(contact => ({
          ...contact,
          createdAt: new Date(contact.created_at),
          updatedAt: new Date(contact.updated_at)
        })))
      } else {
        toast.error(result.error || 'Erro ao carregar contatos')
      }
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
      toast.error('Erro ao carregar contatos')
    }
  }

  const loadTags = async () => {
    try {
      const result = await getTags()
      
      if (result.success && result.data) {
        setTags(result.data.map(tag => ({
          ...tag,
          contactsCount: tag.contacts_count
        })))
      } else {
        toast.error(result.error || 'Erro ao carregar etiquetas')
      }
    } catch (error) {
      console.error('Erro ao carregar etiquetas:', error)
    }
  }

  // Funções da ZAPI
  const handleAddContactsToZApi = async (contacts: Contact[]) => {
    if (!selectedInstance) {
      toast.error('Nenhuma instância selecionada')
      return
    }

    try {
      const contactsData = contacts.map(contact => ({
        firstName: contact.name.split(' ')[0],
        lastName: contact.name.split(' ').slice(1).join(' '),
        phone: contact.phone
      }))

      const result = await addContactsToZApi(selectedInstance.id, contactsData)
      
      if (result.success) {
        toast.success(`${contacts.length} contato(s) adicionado(s) à ZAPI`)
      } else {
        toast.error(result.error || 'Erro ao adicionar contatos à ZAPI')
      }
    } catch (error) {
      console.error('Erro ao adicionar contatos à ZAPI:', error)
      toast.error('Erro ao adicionar contatos à ZAPI')
    }
  }

  // Funções de gerenciamento
  const handleAddContact = async () => {
    if (!newContact.firstName || !newContact.phone) {
      toast.error('Nome e telefone são obrigatórios')
      return
    }

    try {
      const result = await createContact({
        name: `${newContact.firstName} ${newContact.lastName}`.trim(),
        phone: newContact.phone,
        email: newContact.email,
        tags: newContact.tags,
        hasWhatsApp: false,
        isBlocked: false
      })

      if (result.success) {
        setNewContact({ firstName: '', lastName: '', phone: '', email: '', tags: [] })
        setIsAddContactOpen(false)
        loadContacts() // Recarregar lista
        toast.success('Contato adicionado com sucesso')
      } else {
        toast.error(result.error || 'Erro ao adicionar contato')
      }
    } catch (error) {
      console.error('Erro ao adicionar contato:', error)
      toast.error('Erro ao adicionar contato')
    }
  }

  const handleImportCSV = async () => {
    if (!csvData.trim()) {
      toast.error('Dados CSV são obrigatórios')
      return
    }

    try {
      const lines = csvData.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      if (!headers.includes('Nome') || !headers.includes('Numero')) {
        toast.error('CSV deve conter colunas "Nome" e "Numero"')
        return
      }

      const importedContacts: Contact[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const nameIndex = headers.indexOf('Nome')
        const phoneIndex = headers.indexOf('Numero')
        const emailIndex = headers.indexOf('Email')
        const tagIndex = headers.indexOf('Etiqueta')

        if (values[nameIndex] && values[phoneIndex]) {
          const contact: Contact = {
            id: Date.now().toString() + i,
            name: values[nameIndex],
            phone: values[phoneIndex],
            email: emailIndex >= 0 ? values[emailIndex] : undefined,
            tags: tagIndex >= 0 && values[tagIndex] ? [values[tagIndex]] : [],
            hasWhatsApp: false,
            isBlocked: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
          importedContacts.push(contact)
        }
      }

      setContacts(prev => [...prev, ...importedContacts])
      setCsvData('')
      setIsImportOpen(false)
      toast.success(`${importedContacts.length} contato(s) importado(s)`)
    } catch (error) {
      console.error('Erro ao importar CSV:', error)
      toast.error('Erro ao importar CSV')
    }
  }

  const handleAddTag = async () => {
    if (!newTag.name.trim()) {
      toast.error('Nome da etiqueta é obrigatório')
      return
    }

    try {
      const tag: Tag = {
        id: Date.now().toString(),
        name: newTag.name,
        color: newTag.color,
        contactsCount: 0
      }

      setTags(prev => [...prev, tag])
      setNewTag({ name: '', color: '#3b82f6' })
      toast.success('Etiqueta criada com sucesso')
    } catch (error) {
      console.error('Erro ao criar etiqueta:', error)
      toast.error('Erro ao criar etiqueta')
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    try {
      setTags(prev => prev.filter(tag => tag.id !== tagId))
      setContacts(prev => prev.map(contact => ({
        ...contact,
        tags: contact.tags.filter(tagName => 
          tags.find(tag => tag.id === tagId)?.name !== tagName
        )
      })))
      toast.success('Etiqueta removida')
    } catch (error) {
      console.error('Erro ao remover etiqueta:', error)
      toast.error('Erro ao remover etiqueta')
    }
  }

  // Filtros
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTag = selectedTag === 'all' || contact.tags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contatos</h1>
            <p className="text-muted-foreground">
              Gerencie seus contatos do WhatsApp
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsAddContactOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Contato
            </Button>
            
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importar CSV
            </Button>
            
            <Button variant="outline" onClick={() => setIsTagManagerOpen(true)}>
              <Tag className="h-4 w-4 mr-2" />
              Gerenciar Etiquetas
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar contatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Label>Etiqueta:</Label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">Todas</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.name}>{tag.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contacts">Contatos ({filteredContacts.length})</TabsTrigger>
            <TabsTrigger value="tags">Etiquetas ({tags.length})</TabsTrigger>
            <TabsTrigger value="zapi">ZAPI</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Contatos</CardTitle>
                <CardDescription>
                  {filteredContacts.length} contato(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Etiquetas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {contact.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {contact.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {contact.email}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {contact.tags.map((tagName, index) => {
                              const tag = tags.find(t => t.name === tagName)
                              return (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  style={{ backgroundColor: tag?.color + '20', color: tag?.color }}
                                >
                                  {tagName}
                                </Badge>
                              )
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {contact.hasWhatsApp ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            {contact.isBlocked && (
                              <Shield className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedContact(contact)
                                setIsContactDetailsOpen(true)
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
                                <Phone className="h-4 w-4 mr-2" />      
                                Verificar WhatsApp
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
                                <Shield className="h-4 w-4 mr-2" />
                                {contact.isBlocked ? 'Desbloquear' : 'Bloquear'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
                                <Flag className="h-4 w-4 mr-2" />
                                Denunciar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Etiquetas</CardTitle>
                <CardDescription>
                  Organize seus contatos com etiquetas personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tags.map((tag) => (
                    <Card key={tag.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="font-medium">{tag.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {tag.contactsCount} contatos
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTag(tag.id)}
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zapi" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Integração ZAPI</CardTitle>
                <CardDescription>
                  Sincronize seus contatos com a ZAPI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button onClick={() => handleAddContactsToZApi(contacts)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Adicionar Todos à ZAPI
                    </Button>
                    <Button variant="outline" onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Remover Todos da ZAPI
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>• Adicionar contatos: Salva contatos na agenda do WhatsApp</p>
                    <p>• Remover contatos: Remove contatos da agenda do WhatsApp</p>
                    <p>• Verificar WhatsApp: Confirma se número tem WhatsApp</p>
                    <p>• Bloquear/Desbloquear: Controla bloqueio de contatos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Adicionar Contato */}
      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Contato</DialogTitle>
            <DialogDescription>
              Adicione um novo contato manualmente
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  value={newContact.firstName}
                  onChange={(e) => setNewContact(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Nome"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={newContact.lastName}
                  onChange={(e) => setNewContact(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Sobrenome"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="5511999999999"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div>
              <Label>Etiquetas</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={newContact.tags.includes(tag.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setNewContact(prev => ({
                        ...prev,
                        tags: prev.tags.includes(tag.name)
                          ? prev.tags.filter(t => t !== tag.name)
                          : [...prev.tags, tag.name]
                      }))
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddContact}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Importar CSV */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Importar Contatos via CSV</DialogTitle>
            <DialogDescription>
              Cole os dados CSV no formato: Nome,Numero,Email,Etiqueta
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="csvData">Dados CSV</Label>
              <textarea
                id="csvData"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="Nome,Numero,Email,Etiqueta&#10;João Silva,5511999999999,joao@email.com,Cliente&#10;Maria Santos,5511888888888,maria@email.com,VIP"
                className="w-full h-32 p-3 border rounded-md resize-none"
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p><strong>Formato esperado:</strong></p>
              <p>• Primeira linha: cabeçalhos (Nome, Numero, Email, Etiqueta)</p>
              <p>• Colunas obrigatórias: Nome, Numero</p>
              <p>• Colunas opcionais: Email, Etiqueta</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImportCSV}>
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Gerenciar Etiquetas */}
      <Dialog open={isTagManagerOpen} onOpenChange={setIsTagManagerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Etiquetas</DialogTitle>
            <DialogDescription>
              Crie e gerencie etiquetas para organizar seus contatos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nome da etiqueta"
                value={newTag.name}
                onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                className="w-16"
              />
              <Button onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{tag.name}</span>
                    <Badge variant="secondary">{tag.contactsCount}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsTagManagerOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes do Contato */}
      <Dialog open={isContactDetailsOpen} onOpenChange={setIsContactDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
            <DialogDescription>
              Informações completas do contato
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <p className="text-sm font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <p className="text-sm font-medium">{selectedContact.phone}</p>
                </div>
              </div>
              
              {selectedContact.email && (
                <div>
                  <Label>Email</Label>
                  <p className="text-sm font-medium">{selectedContact.email}</p>
                </div>
              )}
              
              <div>
                <Label>Etiquetas</Label>
                <div className="flex gap-2 mt-1">
                  {selectedContact.tags.map((tagName, index) => {
                    const tag = tags.find(t => t.name === tagName)
                    return (
                      <Badge
                        key={index}
                        variant="secondary"
                        style={{ backgroundColor: tag?.color + '20', color: tag?.color }}
                      >
                        {tagName}
                      </Badge>
                    )
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>WhatsApp</Label>
                  <div className="flex items-center gap-2">
                    {selectedContact.hasWhatsApp ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {selectedContact.hasWhatsApp ? 'Tem WhatsApp' : 'Sem WhatsApp'}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    {selectedContact.isBlocked ? (
                      <Shield className="h-4 w-4 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm">
                      {selectedContact.isBlocked ? 'Bloqueado' : 'Ativo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsContactDetailsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
