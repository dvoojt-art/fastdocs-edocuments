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
  Zap,
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
      title: "Navigation",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Employees",
          url: "/dashboard/employees",
          icon: Users,
        },
        {
          title: "Documents",
          url: "/dashboard/certificates",
          icon: FileText,
        },
      ],
    },
    {
      title: "Shortcuts",
      items: [
        {
          title: "Quick Draft",
          url: "/dashboard/certificates/new",
          icon: Zap,
        },
        {
          title: "Approvals",
          url: "/dashboard/approvals",
          icon: CheckSquare,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Activity",
          url: "/dashboard/logs",
          icon: Activity,
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
    <Sidebar collapsible="icon" className="border-r border-foreground/10">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-foreground/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center text-primary-foreground font-headline font-bold text-xl">
            F
          </div>
          <span className="font-headline font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
            FastDocs
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="font-bold uppercase tracking-widest text-[10px] opacity-50">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className="font-bold"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
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
      <SidebarFooter className="border-t border-foreground/10 p-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Jane Doe</span>
            <span className="text-[10px] font-bold uppercase opacity-50">HR Administrator</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
