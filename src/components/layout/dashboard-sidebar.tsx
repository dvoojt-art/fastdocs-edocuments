"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  CheckSquare, 
  Zap,
  Activity,
  LogOut,
  ChevronUp,
  Users
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/firebase"
import { signOut } from "firebase/auth"

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
  const router = useRouter()
  const auth = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-foreground/10">
      <SidebarHeader className="h-20 flex flex-col justify-center px-4 border-b border-foreground/10">
        <Link href="/dashboard" className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center text-primary-foreground font-headline font-bold text-xl">
              F
            </div>
            <span className="font-headline font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
              FastDocs
            </span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-60 ml-10 -mt-0.5 group-data-[collapsible=icon]:hidden">
            Callbox Inc. Davao
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
      <SidebarFooter className="border-t border-foreground/10 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                    OL
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Orwill Jane Linaza</span>
                    <span className="truncate text-xs">HR Administrator</span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer font-bold focus:bg-destructive focus:text-destructive-foreground"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
