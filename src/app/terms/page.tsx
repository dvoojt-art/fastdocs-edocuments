import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-[#0f326e] text-white py-12 px-6 border-b-4 border-primary">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white shrink-0">
            <Link href="/">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-tight">
              Terms of Service
            </h1>
            <p className="font-bold opacity-60 uppercase text-[10px] tracking-widest mt-1">Usage guidelines for FastDocs</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0f326e]">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                By accessing the FastDocs e-Documents Portal ("the Portal"), you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the Portal.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0f326e]">2. Authorized Use</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                The Portal is exclusively for the use of authorized Callbox Inc. personnel and designated administrators. Unauthorized access, tampering, or misuse of the data within the Portal is strictly prohibited and may result in disciplinary action or legal proceedings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0f326e]">3. Document Validity</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                All documents generated through the Portal are official HR narratives of Callbox Inc. Administrators are responsible for verifying the accuracy of all employee data before generating and approving any certificates.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0f326e]">4. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                The design, software, and narrative templates used in the Portal are the intellectual property of Callbox Inc. and its developers. Reproduction or redistribution of these assets without prior consent is forbidden.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0f326e]">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Callbox Inc. shall not be liable for any errors in documents resulting from incorrect manual input or data synchronization issues beyond reasonable control.
              </p>
            </section>
          </div>
        </div>
      </div>

      <footer className="w-full bg-[#0f326e] text-white py-12 px-6 border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center">
            <p className="text-xs font-bold opacity-60 uppercase tracking-[0.3em]">© 2024 Callbox Inc. Davao • FastDocs Project</p>
        </div>
      </footer>
    </div>
  )
}
