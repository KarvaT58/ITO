"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSupabase } from "@/hooks/use-supabase"

interface ForgotPasswordFormProps {
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

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const router = useRouter()
  const { supabase, isClient } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
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

    try {
      console.log('Tentando enviar email de recuperação para:', email)
      
      // Enviar email de recuperação de senha
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `http://localhost:3000/reset-password`,
      })

      console.log('Resposta do resetPasswordForEmail:', { error })

      if (error) {
        const translatedError = translateSupabaseError(error.message)
        setError(translatedError)
        setIsLoading(false)
        return
      }

      setEmailSent(true)
    } catch {
      setError('Erro ao enviar email de recuperação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Email enviado!</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada e clique no link para redefinir sua senha.
        </p>
        </div>
        <Button 
          onClick={() => router.push("/login")} 
          className="w-full"
        >
          Voltar ao login
        </Button>
      </div>
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Esqueceu sua senha?</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Digite seu email e enviaremos um link para redefinir sua senha
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar link de recuperação"}
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
