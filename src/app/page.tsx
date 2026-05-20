
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle,
  ArrowRight
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFD]">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center text-primary-foreground font-headline font-bold text-xl">
            D
          </div>
          <span className="font-headline font-bold text-lg">DokuFlow</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
            About
          </Link>
          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard">Access Platform</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 animate-in fade-in slide-in-from-bottom-2">
                  Modern HR Document Automation
                </div>
                <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-3xl">
                  Centralize Your HR Data <span className="text-primary">Encoding Platform</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                  DokuFlow enables HR staff to generate COEs, clearances, and professional certifications 
                  instantly using AI-assisted composition and secure cloud storage.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="h-12 px-8 rounded-full">
                  <Link href="/dashboard">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 rounded-full">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Built for Modern HR Teams</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Every tool you need to manage employment data and document workflows in one place.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-4 p-6 rounded-3xl bg-[#FAFAFD] border border-transparent hover:border-primary/20 transition-all">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-bold">AI Composer</h3>
                <p className="text-muted-foreground text-sm">
                  Leverage GenAI to draft professional narratives for certificates based on employee history automatically.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 p-6 rounded-3xl bg-[#FAFAFD] border border-transparent hover:border-primary/20 transition-all">
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-headline font-bold">Secure PDF Vault</h3>
                <p className="text-muted-foreground text-sm">
                  Generate authenticated PDFs with QR verification and store them securely in the cloud for audit trails.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 p-6 rounded-3xl bg-[#FAFAFD] border border-transparent hover:border-primary/20 transition-all">
                <div className="bg-emerald-100 p-3 rounded-2xl">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-headline font-bold">Self-Service Hub</h3>
                <p className="text-muted-foreground text-sm">
                  Allow employees to request documents and track approval status through a dedicated dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Automated Signature Workflow</h2>
                <p className="text-muted-foreground md:text-lg">
                  Reduce turnaround time from days to minutes. Our automated pipeline handles data retrieval, drafting, approval, and delivery.
                </p>
                <ul className="grid gap-4 mt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Multi-stage approval tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Digital signatures and seals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Automatic email dispatch</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/dashboard">Try Dashboard</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-3xl border shadow-2xl bg-white p-4">
                <div className="flex items-center gap-2 mb-4">
                   <div className="h-3 w-3 rounded-full bg-red-400" />
                   <div className="h-3 w-3 rounded-full bg-yellow-400" />
                   <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                  <div className="h-32 w-full bg-slate-50 rounded animate-pulse" />
                  <div className="grid grid-cols-3 gap-4">
                     <div className="h-10 bg-slate-100 rounded animate-pulse" />
                     <div className="h-10 bg-slate-100 rounded animate-pulse" />
                     <div className="h-10 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 md:py-0 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between h-auto md:h-24">
          <p className="text-sm text-muted-foreground">
            © 2024 DokuFlow. Modern HR Data Solutions.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
