"use client"

import { useState } from "react"
import { draftCertificateNarrative } from "@/ai/flows/ai-assisted-certificate-drafting"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Loader2, Download, Send, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewCertificatePage() {
  const [loading, setLoading] = useState(false)
  const [draftedNarrative, setDraftedNarrative] = useState("")
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
        title: "Required Fields",
        description: "Please fill in all mandatory fields.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const result = await draftCertificateNarrative(formData)
      setDraftedNarrative(result.narrative)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to draft narrative.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-4xl font-headline font-bold tracking-tight">AI Document Composer</h2>
        <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Draft professional text in seconds</p>
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
                  placeholder="Johnathan Smith" 
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
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="font-bold">START DATE</Label>
                  <Input 
                    id="startDate" 
                    type="date"
                    className="border-foreground/20"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="font-bold">END DATE</Label>
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
                <Label htmlFor="status" className="font-bold">EMPLOYMENT STATUS</Label>
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
                <Label htmlFor="purpose" className="font-bold">Purpose</Label>
                <Input 
                  id="purpose" 
                  placeholder="Bank loan, application, etc." 
                  className="border-foreground/20"
                  value={formData.purposeOfCertificate}
                  onChange={(e) => setFormData({...formData, purposeOfCertificate: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                onClick={handleDraft} 
                className="w-full h-12 font-bold text-lg rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all" 
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
                <CardDescription className="font-medium opacity-70">Ready to use text</CardDescription>
              </div>
              {draftedNarrative && <CheckCircle2 className="h-6 w-6 text-black" />}
            </CardHeader>
            <CardContent className="flex-1 p-0">
              {draftedNarrative ? (
                <div className="p-8 h-full bg-white/40">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {draftedNarrative}
                  </p>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 opacity-30">
                  <Zap className="h-16 w-16 mb-4" />
                  <p className="font-bold text-lg uppercase tracking-widest">
                    Fill the form and generate
                  </p>
                </div>
              )}
            </CardContent>
            {draftedNarrative && (
              <CardFooter className="grid grid-cols-2 gap-4 border-t border-foreground/10 p-6 bg-black/5">
                <Button variant="outline" className="w-full font-bold border-2 border-foreground h-12 hover:bg-black hover:text-background">
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button className="w-full font-bold h-12">
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
