"use client"

import { useState } from "react"
import { draftCertificateNarrative } from "@/ai/flows/ai-assisted-certificate-drafting"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Loader2, Download, Send, CheckCircle2, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewCertificatePage() {
  const [loading, setLoading] = useState(false)
  const [draftedNarrative, setDraftedNarrative] = useState("")
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    employeeName: "",
    certificateType: "Certificate of Employment",
    startDate: "",
    endDate: "",
    employmentStatus: "Active",
    achievementsOrContributions: "",
    purposeOfCertificate: ""
  })
  const { toast } = useToast()

  const handleDraft = async () => {
    if (!formData.employeeName || !formData.startDate || !formData.endDate || !formData.purposeOfCertificate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all mandatory fields before drafting.",
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
        description: "Your certificate narrative is ready for review.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "AI Generation Failed",
        description: "There was an error communicating with the AI service. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!draftedNarrative) return
    navigator.clipboard.writeText(draftedNarrative)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the narrative into your document editor.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-4xl font-headline font-bold tracking-tight">AI Document Composer</h2>
        <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Generate professional HR narratives instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl font-bold">Metadata</CardTitle>
              <CardDescription className="font-medium opacity-70">Core employee information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="employeeName" className="font-bold">Full Name</Label>
                <Input 
                  id="employeeName" 
                  placeholder="e.g. Juan Dela Cruz" 
                  className="border-foreground/20 focus:border-foreground"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type" className="font-bold">Certificate Type</Label>
                <Select 
                  value={formData.certificateType}
                  onValueChange={(v) => setFormData({...formData, certificateType: v})}
                >
                  <SelectTrigger className="border-foreground/20">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-2 border-foreground">
                    <SelectItem value="Certificate of Employment">Certificate of Employment</SelectItem>
                    <SelectItem value="Certificate of Recognition">Certificate of Recognition</SelectItem>
                    <SelectItem value="Clearance Certificate">Clearance Certificate</SelectItem>
                    <SelectItem value="Recommendation Letter">Recommendation Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="font-bold uppercase text-[10px]">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date"
                    className="border-foreground/20"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="font-bold uppercase text-[10px]">End Date</Label>
                  <Input 
                    id="endDate" 
                    placeholder="or 'Present'"
                    className="border-foreground/20"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-bold uppercase text-[10px]">Employment Status</Label>
                <Select 
                  value={formData.employmentStatus}
                  onValueChange={(v) => setFormData({...formData, employmentStatus: v})}
                >
                  <SelectTrigger className="border-foreground/20">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-2 border-foreground">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Resigned">Resigned</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose" className="font-bold">Purpose of Issuance</Label>
                <Input 
                  id="purpose" 
                  placeholder="e.g. Bank loan application, personal record" 
                  className="border-foreground/20"
                  value={formData.purposeOfCertificate}
                  onChange={(e) => setFormData({...formData, purposeOfCertificate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements" className="font-bold">Achievements (Optional)</Label>
                <Textarea 
                  id="achievements" 
                  placeholder="Key contributions or recognitions..." 
                  className="border-foreground/20 min-h-[80px]"
                  value={formData.achievementsOrContributions}
                  onChange={(e) => setFormData({...formData, achievementsOrContributions: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                onClick={handleDraft} 
                className="w-full h-14 font-bold text-lg rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all bg-primary hover:bg-primary/90 text-primary-foreground" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5 fill-current" />}
                Draft Narrative
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card className="border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-foreground/10 pb-6">
              <div>
                <CardTitle className="font-headline font-bold text-2xl">Output Preview</CardTitle>
                <CardDescription className="font-medium opacity-70">Review and refine the generated text</CardDescription>
              </div>
              {draftedNarrative && (
                <Button variant="outline" size="sm" onClick={handleCopy} className="border-2 border-foreground font-bold">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied" : "Copy Text"}
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              {draftedNarrative ? (
                <div className="p-10 h-full bg-white selection:bg-primary/30">
                  <p className="text-xl leading-relaxed whitespace-pre-wrap font-medium font-body text-foreground">
                    {draftedNarrative}
                  </p>
                </div>
              ) : (
                <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-12 opacity-30">
                  <div className="bg-black/5 rounded-full p-8 mb-6 border-2 border-dashed border-foreground/20">
                    <Zap className="h-20 w-20" />
                  </div>
                  <p className="font-bold text-xl uppercase tracking-widest">
                    Enter details to generate
                  </p>
                  <p className="text-sm mt-2 max-w-xs">
                    Our AI will craft a professional and legally sound narrative for your certificate.
                  </p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <Loader2 className="h-12 w-12 animate-spin mb-4" />
                  <p className="font-bold text-lg animate-pulse">Drafting with AI...</p>
                </div>
              )}
            </CardContent>
            {draftedNarrative && !loading && (
              <CardFooter className="grid grid-cols-2 gap-4 border-t border-foreground/10 p-6 bg-black/5">
                <Button variant="outline" className="w-full font-bold border-2 border-foreground h-12 hover:bg-black hover:text-background">
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button className="w-full font-bold h-12 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
