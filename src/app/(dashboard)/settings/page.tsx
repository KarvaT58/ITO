"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZapiTab } from "./_components/ZapiTab"
import { N8nTab } from "./_components/N8nTab"

export default function SettingsPage() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie suas integrações e configurações do sistema.
          </p>
        </div>
      </div>
      <Tabs defaultValue="zapi" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zapi">Z-API</TabsTrigger>
          <TabsTrigger value="n8n">N8n</TabsTrigger>
        </TabsList>
        <TabsContent value="zapi" className="space-y-4">
          <ZapiTab />
        </TabsContent>
        <TabsContent value="n8n" className="space-y-4">
          <N8nTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
