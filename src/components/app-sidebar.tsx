"use client"

import * as React from "react"
import {
  LayoutDashboard,
  MessageCircle,
  Users,
  Megaphone,
  MegaphoneIcon,
  User,
  MessageSquare,
  Users2,
  Workflow,
  BarChart3,
  BarChart,
  Settings,
  HelpCircle,
  Layers,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Usuário",
    email: "usuario@ito.com",
    avatar: "/placeholder.svg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Chat WhatsApp",
      url: "/chat",
      icon: MessageCircle,
    },
    {
      title: "Grupos WhatsApp",
      url: "/groups",
      icon: Users,
    },
    {
      title: "Campanhas Contatos",
      url: "/campaigns/contacts",
      icon: Megaphone,
    },
    {
      title: "Campanhas Grupos",
      url: "/campaigns/groups",
      icon: MegaphoneIcon,
    },
    {
      title: "Contatos",
      url: "/contacts",
      icon: User,
    },
  ],
  navSecondary: [
    {
      title: "Chat Interno",
      url: "/internal-chat",
      icon: MessageSquare,
    },
    {
      title: "Equipe",
      url: "/team",
      icon: Users2,
    },
    {
      title: "N8N",
      url: "/n8n",
      icon: Workflow,
    },
    {
      title: "Relatórios",
      url: "/reports",
      icon: BarChart3,
    },
    {
      title: "Relatórios Campanhas",
      url: "/reports/campaigns",
      icon: BarChart,
    },
  ],
  navFooter: [
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Ajuda",
      url: "/help",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Layers className="!size-5" />
                <span className="text-base font-semibold">ITO Sistemas</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
        <NavSecondary items={data.navFooter} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
