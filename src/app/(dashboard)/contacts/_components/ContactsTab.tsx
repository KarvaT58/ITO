"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  MoreVertical, 
  Phone, 
  Tag, 
  Upload, 
  Search,
  User,
  UserPlus,
  Shield,
  Flag,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { 
  addContactsToZApi, 
  createContact,
  getContacts,
  getTags,
  createTag,
  syncContactsFromZApi,
  importContactsFromCSV,
  deleteContacts
} from '@/server/actions/contacts'

// Tipos
interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  tags: string[]
  isBlocked: boolean
  hasWhatsapp: boolean
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
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalContacts, setTotalContacts] = useState(0)
  const contactsPerPage = 40

  // Estados para seleção múltipla
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isSelecting, setIsSelecting] = useState(false)


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

  const [newTag, setNewTag] = useState({
    name: '',
    color: '#3b82f6'
  })

  // Carregar dados iniciais
  useEffect(() => {
    loadContacts()
    loadTags()
  }, [])

  // Recarregar contatos quando a página mudar
  useEffect(() => {
    loadContacts(currentPage)
  }, [currentPage])

  // Recarregar contatos quando busca ou filtro mudar (com debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1) // Reset para primeira página
      loadContacts(1)
    }, searchTerm === '' ? 0 : 300) // Sem debounce quando busca está vazia

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedTag])

  // Simular instância selecionada
  useEffect(() => {
    setSelectedInstance({
      id: 'b439e7c9-0819-4fbd-9fc6-7701f4027a5e',
      alias: 'Zapi',
      instance_id: '3E6044FF2AD36009F1136EDA9E2AF219',
      instance_token: '3A73D8E67AA46D688B442AD5',
      client_security_token: 'Fd01b0f4c925f4b0394de144dd5d42c23S',
      connected: true
    })
  }, [])

  const loadContacts = async (page: number = currentPage) => {
    try {
      const result = await getContacts(searchTerm, selectedTag, page, contactsPerPage)
      
      if (result.success && result.data) {
        setContacts(result.data.map(contact => ({
          ...contact,
          createdAt: new Date(contact.created_at),
          updatedAt: new Date(contact.updated_at)
        })))
        
        // Atualizar informações de paginação
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages)
          setTotalContacts(result.pagination.total)
        }
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

  // Funções de paginação
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
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

  const handleSyncFromZApi = async () => {
    if (!selectedInstance) {
      toast.error('Nenhuma instância selecionada')
      return
    }

    try {
      toast.loading('Sincronizando contatos da ZAPI...', { id: 'sync-contacts' })
      const result = await syncContactsFromZApi(selectedInstance.id)
      
      if (result.success) {
        toast.dismiss('sync-contacts')
        toast.success(`${result.data?.length || 0} contato(s) sincronizado(s)`)
        loadContacts()
      } else {
        toast.dismiss('sync-contacts')
        toast.error(result.error || 'Erro ao sincronizar contatos')
      }
    } catch (error) {
      console.error('Erro ao sincronizar contatos:', error)
      toast.dismiss('sync-contacts')
      toast.error('Erro ao sincronizar contatos')
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
        email: newContact.email || undefined,
        tags: newContact.tags
      })

      if (result.success) {
        toast.success('Contato adicionado com sucesso!')
        setNewContact({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          tags: []
        })
        setIsAddContactOpen(false)
        loadContacts()
      } else {
        if (result.duplicate) {
          const existing = result.existingContact as { name?: string; phone?: string }
          toast.error(`Contato já existe: ${existing?.name || 'Nome não disponível'} (${existing?.phone || 'Telefone não disponível'})`)
        } else {
          toast.error(result.error || 'Erro ao adicionar contato')
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar contato:', error)
      toast.error('Erro ao adicionar contato')
    }
  }

  const handleCreateTag = async () => {
    if (!newTag.name) {
      toast.error('Nome da etiqueta é obrigatório')
      return
    }

    try {
      const result = await createTag({
        name: newTag.name,
        color: newTag.color,
        contacts_count: 0
      })

      if (result.success) {
        toast.success('Etiqueta criada com sucesso!')
        setNewTag({ name: '', color: '#3b82f6' })
        loadTags()
      } else {
        toast.error(result.error || 'Erro ao criar etiqueta')
      }
    } catch (error) {
      console.error('Erro ao criar etiqueta:', error)
      toast.error('Erro ao criar etiqueta')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV')
      return
    }

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        toast.error('Arquivo CSV deve ter pelo menos um cabeçalho e uma linha de dados')
        return
      }

      // Parse CSV mais robusto
      const contacts = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Parse CSV considerando aspas e vírgulas dentro dos campos
        const values = []
        let current = ''
        let inQuotes = false
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j]
          
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        values.push(current.trim())
        
        if (values.length >= 2) { // Nome e telefone são obrigatórios
          const contact = {
            name: values[0]?.replace(/"/g, '') || '',
            phone: values[1]?.replace(/"/g, '') || '',
            email: values[2]?.replace(/"/g, '') || undefined,
            tag: values[3]?.replace(/"/g, '') || undefined
          }
          
          if (contact.name && contact.phone) {
            contacts.push(contact)
          }
        }
      }

      if (contacts.length === 0) {
        toast.error('Nenhum contato válido encontrado no arquivo')
        return
      }

      console.log('Contatos processados do CSV:', contacts)
      toast.info(`Processando ${contacts.length} contatos...`)

      // Importar contatos com verificação de duplicatas
      const result = await importContactsFromCSV(contacts)

      if (result.success && result.data) {
        const { imported, duplicates, errors } = result.data
        
        toast.success(
          `Importação concluída! ${imported} contatos importados, ${duplicates} duplicados removidos, ${errors} erros`
        )
        
        // Mostrar detalhes se houver duplicatas ou erros
        if (duplicates > 0 || errors > 0) {
          console.log('Detalhes da importação:', result.data.details)
        }
        
        setIsImportOpen(false)
        loadContacts()
      } else {
        toast.error(result.error || 'Erro ao importar contatos')
      }
    } catch (error) {
      console.error('Erro ao processar arquivo CSV:', error)
      toast.error('Erro ao processar arquivo CSV')
    }
  }

  // Funções para seleção múltipla
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const selectAllContacts = () => {
    setSelectedContacts(contacts.map(contact => contact.id))
  }

  const clearSelection = () => {
    setSelectedContacts([])
  }

  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0) {
      toast.error('Nenhum contato selecionado')
      return
    }

    try {
      const result = await deleteContacts(selectedContacts)
      
      if (result.success) {
        toast.success(`${result.deletedCount} contato(s) deletado(s) com sucesso`)
        clearSelection()
        setIsSelecting(false)
        loadContacts(currentPage) // Recarregar a página atual
      } else {
        toast.error(result.error || 'Erro ao deletar contatos')
      }
    } catch (error) {
      console.error('Erro ao deletar contatos:', error)
      toast.error('Erro ao deletar contatos')
    }
  }

  // Função para deletar contato individual
  const handleDeleteContact = async (contactIds: string[]) => {
    try {
      const result = await deleteContacts(contactIds)
      
      if (result.success) {
        toast.success(`${result.deletedCount} contato(s) deletado(s) com sucesso`)
        loadContacts(currentPage) // Recarregar a página atual
      } else {
        toast.error(result.error || 'Erro ao deletar contatos')
      }
    } catch (error) {
      console.error('Erro ao deletar contatos:', error)
      toast.error('Erro ao deletar contatos')
    }
  }


  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsAddContactOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
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
        
        <div className="flex items-center gap-2">
          {!isSelecting ? (
            <>
              <Button variant="outline" onClick={handleSyncFromZApi}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar ZAPI
              </Button>
              <Button variant="outline" onClick={() => handleAddContactsToZApi(contacts)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Todos à ZAPI
              </Button>
              <Button variant="outline" onClick={() => setIsSelecting(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Selecionar Contatos
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={selectAllContacts}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Selecionar Todos
              </Button>
              <Button variant="outline" onClick={clearSelection}>
                <XCircle className="h-4 w-4 mr-2" />
                Limpar Seleção
              </Button>
              <Button variant="destructive" onClick={handleDeleteSelected} disabled={selectedContacts.length === 0}>
                <XCircle className="h-4 w-4 mr-2" />
                Apagar Selecionados ({selectedContacts.length})
              </Button>
              <Button variant="outline" onClick={() => {
                setIsSelecting(false)
                clearSelection()
              }}>
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Busca e filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar contatos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="tag-filter">Etiqueta:</Label>
          <select
            id="tag-filter"
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

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com WhatsApp</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.hasWhatsapp).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.isBlocked).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Etiquetas</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de contatos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contatos</CardTitle>
          <CardDescription>
            {contacts.length} contato(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isSelecting && (
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === contacts.length && contacts.length > 0}
                      onChange={selectAllContacts}
                      className="rounded"
                    />
                  </TableHead>
                )}
                <TableHead className="w-48">Nome</TableHead>
                <TableHead className="w-32">Telefone</TableHead>
                <TableHead className="w-32">Email</TableHead>
                <TableHead className="w-32">Etiquetas</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-20 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  {isSelecting && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContactSelection(contact.id)}
                        className="rounded"
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium w-48">{contact.name}</TableCell>
                  <TableCell className="w-32">{contact.phone}</TableCell>
                  <TableCell className="w-32">{contact.email || '-'}</TableCell>
                  <TableCell className="w-32">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="w-32">
                    <div className="flex items-center gap-2">
                      {contact.hasWhatsapp ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          WhatsApp
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          Sem WhatsApp
                        </Badge>
                      )}
                      {contact.isBlocked && (
                        <Badge variant="destructive">
                          <Shield className="h-3 w-3 mr-1" />
                          Bloqueado
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right w-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
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
                        <DropdownMenuItem 
                          onClick={() => handleDeleteContact([contact.id])}
                          className="text-red-600 focus:text-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Apagar Contato
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

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {((currentPage - 1) * contactsPerPage) + 1} a {Math.min(currentPage * contactsPerPage, totalContacts)} de {totalContacts} contatos
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal Adicionar Contato */}
      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Contato</DialogTitle>
            <DialogDescription>
              Adicione um novo contato ao seu sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  value={newContact.firstName}
                  onChange={(e) => setNewContact(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="João"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={newContact.lastName}
                  onChange={(e) => setNewContact(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Silva"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="5511999999999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                placeholder="joao@exemplo.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddContact}>
              Adicionar Contato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Importar CSV */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar Contatos via CSV</DialogTitle>
            <DialogDescription>
              Faça upload de um arquivo CSV com seus contatos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Arraste e solte seu arquivo CSV aqui
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <Button variant="outline" onClick={() => document.getElementById('csv-upload')?.click()}>
                Selecionar Arquivo
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p><strong>Formato esperado:</strong></p>
              <p>Nome, Telefone, Email, Etiqueta</p>
              <p className="text-xs mt-1">Exemplo: João Silva, 5511999999999, joao@email.com, Cliente</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  const csvContent = "Nome,Telefone,Email,Etiqueta\nJoão Silva,5511999999999,joao@email.com,Cliente\nMaria Santos,5511888888888,maria@email.com,Fornecedor\nPedro Costa,5511777777777,pedro@email.com,Amigo"
                  const blob = new Blob([csvContent], { type: 'text/csv' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'template-contatos.csv'
                  a.click()
                  window.URL.revokeObjectURL(url)
                }}
              >
                Baixar Template CSV
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Gerenciar Etiquetas */}
      <Dialog open={isTagManagerOpen} onOpenChange={setIsTagManagerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Gerenciar Etiquetas</DialogTitle>
            <DialogDescription>
              Crie e gerencie etiquetas para organizar seus contatos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tagName">Nome da Etiqueta</Label>
              <Input
                id="tagName"
                value={newTag.name}
                onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Cliente VIP"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagColor">Cor</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="tagColor"
                  type="color"
                  value={newTag.color}
                  onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                  className="w-12 h-10"
                />
                <Input
                  value={newTag.color}
                  onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Etiquetas Existentes</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {tags.map(tag => (
                  <div key={tag.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="text-sm">{tag.name}</span>
                    </div>
                    <Badge variant="secondary">{tag.contactsCount}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTagManagerOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTag}>
              Criar Etiqueta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes do Contato */}
      <Dialog open={isContactDetailsOpen} onOpenChange={setIsContactDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
            <DialogDescription>
              Informações completas do contato selecionado.
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-sm text-muted-foreground">{selectedContact.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{selectedContact.email || 'Não informado'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Etiquetas</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedContact.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status WhatsApp</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {selectedContact.hasWhatsapp ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Tem WhatsApp
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="h-3 w-3 mr-1" />
                        Sem WhatsApp
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status Bloqueio</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {selectedContact.isBlocked ? (
                      <Badge variant="destructive">
                        <Shield className="h-3 w-3 mr-1" />
                        Bloqueado
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ativo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactDetailsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}