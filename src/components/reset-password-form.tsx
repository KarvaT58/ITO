"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useSupabase } from "@/hooks/use-supabase"

interface ResetPasswordFormProps {
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

export function ResetPasswordForm({
  className,
  ...props
}: ResetPasswordFormProps) {
  const router = useRouter()
  const { supabase, isClient } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)

  useEffect(() => {
    // Verificar se há uma sessão válida para redefinir senha
    const checkSession = async () => {
      if (!isClient || !supabase) return
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsValidSession(true)
      } else {
        setError('Link inválido ou expirado. Solicite um novo link de recuperação.')
      }
    }
    checkSession()
  }, [isClient, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!isClient || !supabase) {
      setError('Aguarde o carregamento...')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validar se as senhas coincidem
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      // Atualizar senha no Supabase
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        const translatedError = translateSupabaseError(error.message)
        setError(translatedError)
        setIsLoading(false)
        return
      }

      setSuccess(true)
    } catch {
      setError('Erro ao redefinir senha. Tente novamente.')
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
          <h1 className="text-2xl font-bold">Senha redefinida!</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
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

  if (!isValidSession) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="bg-red-100 text-red-600 p-3 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Link inválido</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Este link de recuperação é inválido ou expirou. Solicite um novo link.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/forgot-password")} 
          className="w-full"
        >
          Solicitar novo link
        </Button>
      </div>
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Redefinir senha</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Digite sua nova senha abaixo
        </p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="password">Nova senha</Label>
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
          <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
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
          {isLoading ? "Redefinindo..." : "Redefinir senha"}
        </Button>
        <div className="text-center text-sm">
          Lembrou da senha?{" "}
          <a href="/login" className="underline underline-offset-4">
            Voltar ao login
          </a>
        </div>
      </div>
    </form>
  )
}
