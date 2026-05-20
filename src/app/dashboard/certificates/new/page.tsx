
"use client"

import { useState } from "react"
import { draftCertificateNarrative } from "@/ai/flows/ai-assisted-certificate-drafting"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Loader2, Download, Send, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewCertificatePage() {
  const [loading, setLoading] = useState(false)
  const [draftedNarrative, setDraftedNarrative] = useState("")
  const [formData, setFormData] = useState({
    employeeName: "",
    certificateType: "Certificate of Employment",
    employmentDetails: "",
    achievementsOrContributions: "",
    purposeOfCertificate: ""
  })
  const { toast } = useToast()

  const handleDraft = async () => {
    if (!formData.employeeName || !formData.employmentDetails || !formData.purposeOfCertificate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required information.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const result = await draftCertificateNarrative(formData)
      setDraftedNarrative(result.narrative)
      toast({
        title: "Draft Generated",
        description: "AI has drafted a professional narrative for you."
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to generate narrative. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-bold">AI Document Composer</h2>
        <p className="text-muted-foreground">Draft professional wording based on employee history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Document Metadata</CardTitle>
              <CardDescription>Fill in the basic employee details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Full Name</Label>
                <Input 
                  id="employeeName" 
                  placeholder="e.g. Johnathan Smith" 
                  value={formData.employeeName}
                  onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Certificate Type</Label>
                <Select 
                  value={formData.certificateType}
                  onValueChange={(v) => setFormData({...formData, certificateType: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certificate of Employment">Certificate of Employment</SelectItem>
                    <SelectItem value="Certificate of Recognition">Certificate of Recognition</SelectItem>
                    <SelectItem value="Clearance Certificate">Clearance Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Employment History Summary</Label>
                <Textarea 
                  id="details" 
                  className="min-h-[100px]"
                  placeholder="Position, Department, Dates..." 
                  value={formData.employmentDetails}
                  onChange={(e) => setFormData({...formData, employmentDetails: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Issuance</Label>
                <Input 
                  id="purpose" 
                  placeholder="e.g. For bank loan application" 
                  value={formData.purposeOfCertificate}
                  onChange={(e) => setFormData({...formData, purposeOfCertificate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">Key Achievements (Optional)</Label>
                <Textarea 
                  id="achievements" 
                  placeholder="Special projects or awards..." 
                  value={formData.achievementsOrContributions}
                  onChange={(e) => setFormData({...formData, achievementsOrContributions: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleDraft} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Compose Narrative with AI
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline text-xl">Preview Narrative</CardTitle>
                <CardDescription>Generated content ready for document</CardDescription>
              </div>
              {draftedNarrative && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            </CardHeader>
            <CardContent className="flex-1">
              {draftedNarrative ? (
                <div className="bg-muted/30 p-6 rounded-xl border border-dashed border-muted-foreground/20 min-h-[300px]">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                    {draftedNarrative}
                  </p>
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20">
                  <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-sm">
                    Fill in metadata and click "Compose Narrative" to see AI-generated wording here.
                  </p>
                </div>
              )}
            </CardContent>
            {draftedNarrative && (
              <CardFooter className="grid grid-cols-2 gap-3 border-t pt-6">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send to Email
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
