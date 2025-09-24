# Documentação - Grupos WhatsApp

## Visão Geral

A funcionalidade de Grupos WhatsApp permite gerenciar grupos do WhatsApp através da integração com a Z-API. Esta funcionalidade inclui criação de grupos, gerenciamento de participantes, chat em tempo real e configurações avançadas.

## Funcionalidades Implementadas

### 1. Criação de Grupos
- **Endpoint**: `POST /create-group`
- **Funcionalidade**: Criar novos grupos no WhatsApp
- **Parâmetros**:
  - `groupName`: Nome do grupo
  - `phones`: Array de telefones dos participantes
  - `autoInvite`: Enviar convite automático (boolean)
- **Resposta**: Retorna ID do grupo e link de convite

### 2. Gerenciamento de Participantes
- **Adicionar Participantes**: `POST /add-participant`
- **Remover Participantes**: `POST /remove-participant`
- **Aprovar Participantes**: `POST /approve-participant`
- **Rejeitar Participantes**: `POST /reject-participant`

### 3. Gerenciamento de Administradores
- **Promover Administradores**: `POST /add-admin`
- **Remover Administradores**: `POST /remove-admin`

### 4. Chat em Tempo Real
- **Mensagens Simples**: Envio de mensagens de texto
- **Menções**: Mencionar participantes específicos
- **Menções em Grupo**: Mencionar grupos relacionados
- **Status de Conexão**: Indicador visual de conexão em tempo real

### 5. Configurações do Grupo
- **Atualizar Nome**: `POST /update-group-name`
- **Atualizar Descrição**: `POST /update-group-description`
- **Atualizar Foto**: `POST /update-group-photo`
- **Configurações de Permissões**: `POST /update-group-settings`

### 6. Links de Convite
- **Obter Link**: `POST /group-invitation-link/{groupId}`
- **Redefinir Link**: `POST /redefine-invitation-link/{groupId}`
- **Aceitar Convite**: `GET /accept-invite-group`

## Estrutura de Arquivos

```
src/app/(dashboard)/groups/
├── page.tsx                    # Página principal
├── _components/
│   ├── GroupsTab.tsx          # Componente principal com tabs
│   ├── RealtimeChat.tsx       # Chat em tempo real
│   ├── GroupManagement.tsx    # Gerenciamento de participantes
│   └── GroupSettings.tsx     # Configurações do grupo
└── DOCS.md                    # Esta documentação

src/lib/zapi/
└── groups.ts                  # Tipos e serviços da Z-API

src/server/actions/
└── groups.ts                  # Server actions para grupos
```

## Componentes Principais

### GroupsTab
Componente principal que gerencia todas as funcionalidades de grupos:
- Lista de grupos
- Criação de novos grupos
- Navegação entre tabs (Chat, Gerenciar, Configurações)

### RealtimeChat
Chat em tempo real com as seguintes funcionalidades:
- Envio e recebimento de mensagens
- Indicador de status de conexão
- Menções de participantes
- Interface responsiva

### GroupManagement
Gerenciamento de participantes e administradores:
- Adicionar/remover participantes
- Promover/rebaixar administradores
- Ações perigosas (sair do grupo, excluir grupo)

### GroupSettings
Configurações avançadas do grupo:
- Informações básicas (nome, descrição)
- Configurações de permissões
- Gerenciamento de links de convite

## Integração com Z-API

### Autenticação
Todas as chamadas para a Z-API requerem:
- `instanceId`: ID da instância
- `instanceToken`: Token da instância
- `clientSecurityToken`: Token de segurança do cliente

### Tratamento de Erros
- Erro 405: Método incorreto
- Erro 415: Content-Type ausente/incorreto
- Tratamento de erros personalizados com mensagens em português

### Formato de Resposta
Todas as respostas seguem o padrão:
```typescript
{
  success: boolean
  data?: any
  message: string
  error?: string
}
```

## Funcionalidades de Tempo Real

### Simulação de Conexão
O chat em tempo real simula:
- Conexão Server-Sent Events (SSE)
- Mensagens automáticas periódicas
- Indicadores de status de conexão
- Animações de digitação

### Menções
- **Menções Simples**: Mencionar participantes específicos
- **Menções em Grupo**: Mencionar grupos relacionados
- **Menções para Todos**: Mencionar todos os participantes

## Configurações de Permissões

### adminOnlyMessage
- **Descrição**: Apenas administradores podem enviar mensagens
- **Padrão**: false

### adminOnlySettings
- **Descrição**: Apenas administradores podem alterar configurações
- **Padrão**: false

### requireAdminApproval
- **Descrição**: Requer aprovação do administrador para novos membros
- **Padrão**: false

### adminOnlyAddMember
- **Descrição**: Apenas administradores podem adicionar membros
- **Padrão**: false

## Exemplos de Uso

### Criar um Grupo
```typescript
const result = await createGroup({
  groupName: "Meu Grupo",
  phones: ["5511999999999", "5511888888888"],
  autoInvite: true
})
```

### Adicionar Participantes
```typescript
const result = await addParticipants({
  groupId: "120363019502650977-grupo",
  phones: ["5511777777777"],
  autoInvite: true
})
```

### Enviar Mensagem com Menção
```typescript
const result = await mentionMembers({
  phone: "120363019502650977-grupo",
  message: "Olá @5511999999999!",
  mentioned: ["5511999999999"]
})
```

## Considerações de Segurança

1. **Validação de Entrada**: Todos os inputs são validados
2. **Sanitização**: Telefones são sanitizados antes do envio
3. **Permissões**: Verificação de permissões de administrador
4. **Rate Limiting**: Implementar rate limiting para evitar spam

## Melhorias Futuras

1. **WebSockets Reais**: Implementar WebSockets para tempo real
2. **Notificações Push**: Notificações em tempo real
3. **Histórico de Mensagens**: Persistência de mensagens
4. **Mídia**: Suporte a imagens, vídeos e documentos
5. **Bots**: Integração com bots automatizados
6. **Analytics**: Métricas de uso e engajamento

## Troubleshooting

### Problemas Comuns

1. **Erro 405**: Verificar se o método HTTP está correto
2. **Erro 415**: Adicionar Content-Type: application/json
3. **Conexão Perdida**: Verificar status da instância Z-API
4. **Mensagens Não Enviadas**: Verificar permissões do grupo

### Logs de Debug
Todos os erros são logados no console com prefixo "Z-API Error:"

## Suporte

Para suporte técnico ou dúvidas sobre a implementação, consulte:
- Documentação oficial da Z-API
- Logs do console do navegador
- Logs do servidor Next.js
