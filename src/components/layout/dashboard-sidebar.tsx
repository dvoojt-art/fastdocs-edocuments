
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  CheckSquare, 
  FilePlus, 
  Database,
  ShieldCheck,
  Activity
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Platform",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Employees Hub",
          url: "/dashboard/employees",
          icon: Users,
        },
        {
          title: "Certificate Center",
          url: "/dashboard/certificates",
          icon: FileText,
        },
      ],
    },
    {
      title: "Workflow",
      items: [
        {
          title: "Approvals",
          url: "/dashboard/approvals",
          icon: CheckSquare,
        },
        {
          title: "Template Engine",
          url: "/dashboard/templates",
          icon: Database,
        },
      ],
    },
    {
      title: "Admin",
      items: [
        {
          title: "Audit Logs",
          url: "/dashboard/logs",
          icon: Activity,
        },
        {
          title: "Security",
          url: "/dashboard/security",
          icon: ShieldCheck,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
  ],
}

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center text-primary-foreground font-headline font-bold text-xl">
            D
          </div>
          <span className="font-headline font-bold text-lg group-data-[collapsible=icon]:hidden">
            DokuFlow
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="font-headline tracking-wider">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Jane Doe</span>
            <span className="text-xs text-muted-foreground">HR Admin</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
