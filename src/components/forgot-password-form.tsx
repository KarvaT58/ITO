"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    try {
      // Enviar email de recuperação de senha
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      setEmailSent(true)
    } catch (err) {
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
          <Input id="email" type="email" placeholder="seu@email.com" required />
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
