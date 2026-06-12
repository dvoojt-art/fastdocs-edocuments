import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="font-bold opacity-60 uppercase text-[10px] tracking-widest mt-1">Data Privacy Act Compliance</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary shrink-0" />
              <div>
                  <h2 className="text-lg font-bold uppercase tracking-tight mb-2 text-[#0f326e]">Data Privacy Commitment</h2>
                  <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                      Callbox Inc. is committed to protecting the privacy of its employees and administrators in accordance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> of the Philippines.
                  </p>
              </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0f326e]">1. Collection of Information</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                We collect personal information necessary for HR document generation, including full names, positions, salary details, and employment history. This data is provided by authorized administrators or imported from secure company records.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0f326e]">2. Use of Information</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Personal data is used solely for the purpose of generating employment certificates, termination letters, and other official HR narratives. It is also used to maintain an audit trail of system activities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0f326e]">3. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                We implement industry-standard security measures, including encryption and strict access control, to protect data from unauthorized access, disclosure, or alteration.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0f326e]">4. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Personal information is retained only for as long as necessary to fulfill HR requirements and legal obligations. Once no longer needed, data is disposed of securely.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0f326e]">5. Rights of Data Subjects</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Employees have the right to access, correct, or request the deletion of their personal data stored within the Portal. Requests should be directed to the People Operations Department.
              </p>
            </section>
          </div>
        </div>
      </div>

      <footer className="w-full bg-[#0f326e] text-white py-12 px-6 border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center">
            <p className="text-xs font-bold opacity-60 uppercase tracking-[0.3em]">© 2024 Callbox Inc. Davao • Data Privacy Office</p>
        </div>
      </footer>
    </div>
  )
}
