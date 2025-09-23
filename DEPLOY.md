# Deploy no Vercel

Este projeto está configurado e pronto para deploy no Vercel.

## Funcionalidades Implementadas

✅ **Tela de Login** (`/login`)
- Formulário de login com validação
- Redirecionamento automático para dashboard após login
- Estado de carregamento durante autenticação

✅ **Dashboard** (`/dashboard`)
- Interface completa de dashboard com sidebar
- Gráficos interativos
- Tabelas de dados
- Design responsivo

✅ **Roteamento**
- Redirecionamento automático da página inicial para login
- Navegação entre login e dashboard

## Como fazer Deploy no Vercel

### Opção 1: Deploy via GitHub (Recomendado)

1. **Faça push do código para o GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/seu-repositorio.git
   git push -u origin main
   ```

2. **Conecte ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte sua conta do GitHub
   - Selecione o repositório
   - O Vercel detectará automaticamente que é um projeto Next.js
   - Clique em "Deploy"

### Opção 2: Deploy via Vercel CLI

1. **Instale o Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Faça login no Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy do projeto:**
   ```bash
   vercel
   ```

4. **Para deploy em produção:**
   ```bash
   vercel --prod
   ```

## Configurações do Projeto

- **Framework:** Next.js 15.5.3
- **TypeScript:** ✅
- **Tailwind CSS:** ✅
- **shadcn/ui:** ✅
- **Build otimizado:** ✅

## Estrutura do Projeto

```
app/
├── src/
│   ├── app/
│   │   ├── login/page.tsx      # Página de login
│   │   ├── dashboard/page.tsx   # Dashboard principal
│   │   └── page.tsx             # Redirecionamento para login
│   ├── components/
│   │   ├── login-form.tsx       # Formulário de login
│   │   └── ui/                 # Componentes shadcn/ui
│   └── lib/
│       └── utils.ts            # Utilitários
├── vercel.json                 # Configuração do Vercel
└── package.json
```

## URLs do Projeto

- **Login:** `https://seu-dominio.vercel.app/login`
- **Dashboard:** `https://seu-dominio.vercel.app/dashboard`
- **Página inicial:** Redireciona automaticamente para `/login`

## Próximos Passos

1. **Autenticação Real:** Substitua a simulação de autenticação por um sistema real (Auth0, NextAuth.js, etc.)
2. **Proteção de Rotas:** Implemente middleware para proteger rotas autenticadas
3. **Persistência de Dados:** Conecte com um banco de dados real
4. **Customização:** Personalize o design e funcionalidades conforme necessário

## Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint
```

O projeto está pronto para deploy! 🚀
