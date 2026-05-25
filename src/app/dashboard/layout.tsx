import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-foreground/10 px-6 bg-[#0f326e] text-white">
          <SidebarTrigger className="-ml-1 hover:bg-white/10 hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-white/20" />
          <div className="flex-1">
             <h1 className="font-headline font-bold text-lg uppercase tracking-tight">
               FastDocs <span className="text-primary">Console</span>
             </h1>
          </div>
        </header>
        <main className="p-6 bg-background min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
