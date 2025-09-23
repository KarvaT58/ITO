"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"

export function N8nTab() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Construction className="h-6 w-6" />
          </div>
          <CardTitle>N8n</CardTitle>
          <CardDescription>
            Em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
