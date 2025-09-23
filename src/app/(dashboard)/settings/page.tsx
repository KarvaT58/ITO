"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZapiTab } from "./_components/ZapiTab"
import { N8nTab } from "./_components/N8nTab"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas integrações e configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="zapi" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="zapi">Z-API</TabsTrigger>
          <TabsTrigger value="n8n">N8n</TabsTrigger>
        </TabsList>
        
        <TabsContent value="zapi" className="mt-6">
          <ZapiTab />
        </TabsContent>
        
        <TabsContent value="n8n" className="mt-6">
          <N8nTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
