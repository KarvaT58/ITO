import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { GroupsTab } from "./_components/GroupsTab"

export const dynamic = 'force-dynamic'

export default function GroupsPage() {
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
              <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
                <div className="flex items-center justify-between space-y-2">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Grupos WhatsApp</h2>
                    <p className="text-muted-foreground">
                      Gerencie grupos do WhatsApp, crie novos grupos, adicione participantes e configure permissões.
                    </p>
                  </div>
                </div>
                <GroupsTab />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
