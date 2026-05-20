import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  ArrowRight, 
  ShieldCheck,
  LayoutDashboard
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="px-6 h-20 flex items-center border-b border-foreground/10">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground font-headline font-bold text-2xl">
            F
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight">FastDocs</span>
        </div>
        <nav className="ml-auto flex gap-6 items-center">
          <Button asChild variant="ghost" className="hidden sm:inline-flex font-bold hover:bg-black hover:text-background">
            <Link href="/dashboard">Login</Link>
          </Button>
          <Button asChild size="lg" className="rounded-full font-bold">
            <Link href="/dashboard">Go to App</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-foreground px-4 py-1 text-sm font-bold uppercase tracking-widest">
                  <Zap className="h-4 w-4 fill-current" />
                  Official Portal
                </div>
                <h1 className="text-5xl font-headline font-bold tracking-tighter sm:text-7xl md:text-8xl leading-none">
                  Callbox Davao <br />
                  <span className="bg-background text-foreground border-4 border-foreground px-4 py-1 inline-block mt-4">Online Documents</span>
                </h1>
                <p className="mx-auto max-w-[600px] text-lg md:text-xl font-medium leading-relaxed opacity-80 mt-6">
                  The centralized hub for Callbox Davao employees to request and access official HR documents and certificates instantly.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="h-16 px-10 rounded-full text-lg font-bold group">
                  <Link href="/dashboard">
                    Access Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Simplified Benefits */}
        <section className="w-full py-20 border-t border-foreground/10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Fast Turnaround</h3>
                <p className="font-medium opacity-70">Generate employment certificates and clearance documents in minutes, not days.</p>
              </div>
              <div className="space-y-4">
                <div className="mx-auto bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Secure Access</h3>
                <p className="font-medium opacity-70">Authenticated and encrypted document storage ensures your data remains private.</p>
              </div>
              <div className="space-y-4">
                <div className="mx-auto bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center">
                  <LayoutDashboard className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Unified Hub</h3>
                <p className="font-medium opacity-70">Manage all your requests and digital copies from a single, intuitive interface.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-foreground/10 py-10 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-6 w-6 rounded-full flex items-center justify-center text-primary-foreground font-headline font-bold text-xs">
              F
            </div>
            <span className="font-headline font-bold text-lg">FastDocs</span>
          </div>
          <p className="text-sm font-medium opacity-60 italic">
            Empowering the Davao workforce through digital transformation.
          </p>
          <nav className="flex gap-8">
            <Link className="text-sm font-bold hover:underline underline-offset-4" href="#">Terms</Link>
            <Link className="text-sm font-bold hover:underline underline-offset-4" href="#">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
