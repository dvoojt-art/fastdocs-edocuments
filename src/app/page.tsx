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
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Floating Circles layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
        <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-[#0f326e]/5 blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[50%] left-[5%] w-5 h-5 rounded-full bg-black animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[30%] left-[20%] w-6 h-6 rounded-full bg-primary animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Navigation */}
      <header className="px-6 h-20 flex items-center border-b border-white/10 relative z-10 bg-[#0f326e] text-white">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground font-headline font-bold text-2xl">
              F
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight">FastDocs</span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-60 ml-12 -mt-1">Callbox Inc. Davao</span>
        </div>
        <nav className="ml-auto flex gap-6 items-center">
          <Button asChild variant="ghost" className="rounded-full font-bold text-white hover:bg-white/10">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="lg" className="rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 border-none shadow-none">
            <Link href="#benefits">Learn More</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 relative z-10">
        <section className="w-full py-20 md:py-32 lg:py-40 px-6 text-center">
          <div className="container mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0f326e] px-4 py-1 text-sm font-bold uppercase tracking-widest bg-background/50 backdrop-blur-sm text-[#0f326e] mb-8">
              <Zap className="h-4 w-4 fill-current" />
              INSTANT GENERATION
            </div>
            <h1 className="text-5xl font-headline font-bold tracking-tighter sm:text-7xl md:text-8xl leading-none mb-6">
              Callb
              <span className="relative inline-block">
                o
                <span className="absolute -top-[0.3em] sm:-top-[0.35em] left-1/2 -translate-x-1/2 text-primary text-4xl sm:text-6xl md:text-7xl pointer-events-none">
                  ^
                </span>
              </span>
              x Davao <br />
              e-Documents Portal
            </h1>
            <p className="mx-auto max-w-[600px] text-lg md:text-xl font-medium leading-relaxed opacity-80 mb-10">
              The centralized hub to request and access official HR documents and certificates instantly without manual typing!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="h-16 px-10 rounded-full text-lg font-bold group shadow-none">
                <Link href="/login">
                  Access Portal
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="benefits" className="w-full py-20 border-t border-foreground/10 bg-background/80 backdrop-blur-sm">
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

      <footer className="w-full border-t border-foreground/10 py-10 px-6 relative z-10 bg-background">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-6 w-6 rounded-full flex items-center justify-center text-primary-foreground font-headline font-bold text-xs">
              F
            </div>
            <span className="font-headline font-bold text-lg text-[#0f326e]">FastDocs</span>
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
