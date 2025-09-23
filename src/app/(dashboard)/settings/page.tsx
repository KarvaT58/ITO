import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ZapiTab } from "./_components/ZapiTab"
import { N8nTab } from "./_components/N8nTab"

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
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
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
