"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useSupabase } from "@/hooks/use-supabase"

interface SignupFormProps {
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
    'Too many requests': 'Muitas solicitações',
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
    'Variant also negotiates': 'Variante também negocia',
    'Insufficient storage': 'Armazenamento insuficiente',
    'Loop detected': 'Loop detectado',
    'Not extended': 'Não estendido',
    'Network authentication required': 'Autenticação de rede necessária'
  }

  // Buscar tradução específica
  for (const [englishError, portugueseError] of Object.entries(errorTranslations)) {
    if (errorMessage.toLowerCase().includes(englishError.toLowerCase())) {
      return portugueseError
    }
  }

  // Se não encontrar tradução específica, retornar mensagem genérica
  return `Erro: ${errorMessage}`
}

export function SignupForm({
  className,
  ...props
}: SignupFormProps) {
  const router = useRouter()
  const { supabase, isClient } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
    const confirmPassword = formData.get('confirmPassword') as string
    const name = formData.get('name') as string

    console.log('Valores dos campos:', { email, password, confirmPassword, name })

    // Validações mais robustas
    if (!email || !password || !name) {
      console.log('Campos vazios:', { email: !!email, password: !!password, name: !!name })
      setError('Todos os campos são obrigatórios')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Digite um email válido')
      setIsLoading(false)
      return
    }

    try {
      console.log('Tentando criar conta com:', { email, name })
      
      // Criar conta no Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: name.trim(),
          }
        }
      })

      console.log('Resposta do Supabase:', { data, error })

      if (error) {
        console.error('Erro do Supabase:', error)
        const translatedError = translateSupabaseError(error.message)
        setError(translatedError)
        setIsLoading(false)
        return
      }

      if (data.user) {
        console.log('Usuário criado:', data.user)
        setSuccess(true)
      }
    } catch (err) {
      console.error('Erro geral:', err)
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Conta criada com sucesso!</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enviamos um link de confirmação para seu email. Verifique sua caixa de entrada e clique no link para ativar sua conta.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/login")} 
          className="w-full"
        >
          Ir para o login
        </Button>
      </div>
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Criar sua conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Preencha os dados abaixo para criar sua conta
        </p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" name="name" type="text" placeholder="Seu nome completo" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input 
              id="password" 
              name="password"
              type={showPassword ? "text" : "password"} 
              placeholder="Mínimo 6 caracteres"
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
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <div className="relative">
            <Input 
              id="confirmPassword" 
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Digite a senha novamente"
              required 
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Criando conta..." : "Criar conta"}
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
          Cadastrar com Google
        </Button>
        <div className="text-center text-sm">
          Já tem uma conta?{" "}
          <a href="/login" className="underline underline-offset-4">
            Faça login
          </a>
        </div>
      </div>
    </form>
  )
}
