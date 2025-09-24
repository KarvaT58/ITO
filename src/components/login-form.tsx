"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useSupabase } from "@/hooks/use-supabase"

interface LoginFormProps {
  className?: string;
}

// Função para traduzir erros do Supabase
const translateSupabaseError = (errorMessage: string): string => {
  const errorTranslations: { [key: string]: string } = {
    // Erros de autenticação
    'Invalid login credentials': 'Credenciais de login inválidas',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
    'User not found': 'Usuário não encontrado',
    'Invalid email': 'Email inválido',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'User already registered': 'Usuário já cadastrado',
    'Email address is already in use': 'Este email já está em uso',
    'Password is too weak': 'A senha é muito fraca',
    'Invalid password': 'Senha inválida',
    'Too many requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
    'Network error': 'Erro de rede. Verifique sua conexão.',
    'Server error': 'Erro do servidor. Tente novamente.',
    'Database error saving new user': 'Erro ao salvar usuário no banco de dados',
    'missing email or phone': 'Email ou telefone obrigatório',
    'Email link is invalid or has expired': 'Link de email inválido ou expirado',
    'One-time token not found': 'Token de acesso não encontrado',
    'Session not found': 'Sessão não encontrada',
    'Invalid token': 'Token inválido',
    'Token expired': 'Token expirado',
    'Account not found': 'Conta não encontrada',
    'Account disabled': 'Conta desabilitada',
    'Account locked': 'Conta bloqueada',
    'Invalid verification code': 'Código de verificação inválido',
    'Verification code expired': 'Código de verificação expirado',
    'Phone number already in use': 'Número de telefone já está em uso',
    'Invalid phone number': 'Número de telefone inválido',
    'SMS sending failed': 'Falha ao enviar SMS',
    'Email sending failed': 'Falha ao enviar email',
    'Rate limit exceeded': 'Limite de tentativas excedido',
    'Service temporarily unavailable': 'Serviço temporariamente indisponível',
    'Invalid request': 'Solicitação inválida',
    'Unauthorized': 'Não autorizado',
    'Forbidden': 'Acesso negado',
    'Not found': 'Não encontrado',
    'Internal server error': 'Erro interno do servidor',
    'Bad request': 'Solicitação inválida',
    'Conflict': 'Conflito de dados',
    'Precondition failed': 'Pré-condição falhou',
    'Payload too large': 'Dados muito grandes',
    'Unsupported media type': 'Tipo de mídia não suportado',
    'Unprocessable entity': 'Entidade não processável',
    'Locked': 'Recurso bloqueado',
    'Failed dependency': 'Dependência falhou',
    'Too early': 'Muito cedo para processar',
    'Upgrade required': 'Atualização necessária',
    'Precondition required': 'Pré-condição necessária',
    'Request header fields too large': 'Campos de cabeçalho muito grandes',
    'Unavailable for legal reasons': 'Indisponível por razões legais',
    'Client closed request': 'Cliente fechou a solicitação',
    'Request timeout': 'Tempo limite da solicitação',
    'Length required': 'Comprimento necessário',
    'Requested range not satisfiable': 'Intervalo solicitado não satisfatório',
    'Expectation failed': 'Expectativa falhou',
    'I\'m a teapot': 'Sou um bule de chá',
    'Misdirected request': 'Solicitação mal direcionada',
    'Unprocessable content': 'Conteúdo não processável',
    'Variant also negotiates': 'Variante também negocia',
    'Not implemented': 'Não implementado',
    'Bad gateway': 'Gateway inválido',
    'Service unavailable': 'Serviço indisponível',
    'Gateway timeout': 'Tempo limite do gateway',
    'HTTP version not supported': 'Versão HTTP não suportada',
    'Insufficient storage': 'Armazenamento insuficiente',
    'Loop detected': 'Loop detectado',
    'Not extended': 'Não estendido',
    'Network authentication required': 'Autenticação de rede necessária'
  }

  // Buscar tradução específica (busca exata primeiro)
  for (const [englishError, portugueseError] of Object.entries(errorTranslations)) {
    if (errorMessage.toLowerCase() === englishError.toLowerCase()) {
      return portugueseError
    }
  }

  // Buscar tradução por substring
  for (const [englishError, portugueseError] of Object.entries(errorTranslations)) {
    if (errorMessage.toLowerCase().includes(englishError.toLowerCase())) {
      return portugueseError
    }
  }

  // Se não encontrar tradução específica, retornar mensagem genérica
  console.log('Erro não traduzido:', errorMessage)
  return `Erro: ${errorMessage}`
}

export function LoginForm({
  className,
  ...props
}: LoginFormProps) {
  const router = useRouter()
  const { supabase, isClient } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!isClient || !supabase) {
      setError('Aguarde o carregamento...')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('Dados do login:', { email, password: password ? '***' : 'vazio' })

    // Validar se os campos estão preenchidos
    if (!email || !password) {
      setError('Email e senha são obrigatórios')
      setIsLoading(false)
      return
    }

    try {
      console.log('Tentando fazer login com:', { email })
      
      // Fazer login com Supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any).auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      console.log('Resposta do login:', { data, error })

      if (error) {
        console.log('Erro original do Supabase:', error.message)
        const translatedError = translateSupabaseError(error.message)
        console.log('Erro traduzido:', translatedError)
        setError(translatedError)
        setIsLoading(false)
        return
      }

      if (data.user) {
        console.log('Login bem-sucedido, redirecionando para dashboard...')
        console.log('Dados do usuário:', data.user)
        
        // Aguardar um pouco para garantir que a sessão seja persistida
        setTimeout(async () => {
          try {
            console.log('Tentando redirecionamento...')
            
            // Tentar router.push primeiro
            await router.push("/dashboard")
            console.log('Redirecionamento via router.push executado')
            
            // Verificar se realmente redirecionou após um tempo
            setTimeout(() => {
              if (window.location.pathname !== '/dashboard') {
                console.log('Router.push não funcionou, usando fallback')
                window.location.href = "/dashboard"
              }
            }, 500)
            
          } catch (routerError) {
            console.error('Erro no router.push:', routerError)
            // Fallback: redirecionamento direto
            console.log('Usando fallback window.location.href')
            window.location.href = "/dashboard"
          }
        }, 100)
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Faça login em sua conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Digite seu email abaixo para fazer login em sua conta
        </p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              name="password"
              type={showPassword ? "text" : "password"} 
              required 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Ou continue com
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Entrar com Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Não tem uma conta?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Cadastre-se
        </a>
      </div>
    </form>
  )
}
