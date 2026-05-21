
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, Copy, Check, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { jsPDF } from "jspdf"

export default function NewCertificatePage() {
  const db = useFirestore()
  const [draftedNarrative, setDraftedNarrative] = useState("")
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    employeeName: "",
    certificateType: "Certificate of Employment",
    startDate: "",
    endDate: "",
    employmentStatus: "Active",
    purposeOfCertificate: "",
    terminationReason: "company-wide retrenchment"
  })
  const { toast } = useToast()

  const formatDateString = (dateStr: string) => {
    if (!dateStr || dateStr.toLowerCase() === 'present') return dateStr;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  const generateStaticNarrative = (data: typeof formData) => {
    const { employeeName, certificateType, startDate, endDate, employmentStatus, purposeOfCertificate, terminationReason } = data;
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const formattedStart = formatDateString(startDate);
    const formattedEnd = formatDateString(endDate);
    
    const period = endDate.toLowerCase() === 'present' ? `since ${formattedStart}` : `from ${formattedStart} to ${formattedEnd}`;
    const purpose = purposeOfCertificate || 'whatever legal purpose it may serve';

    switch (certificateType) {
      case "Certificate of Termination":
        return `CERTIFICATE OF TERMINATION\n\nThis is to certify that ${employeeName}, was employed with ContactDB Inc., located on the 9th floor, Landco Bldg. JP Laurel Ave., Bajada, Davao City, from ${formattedStart} to ${formattedEnd}.\n\nAs of ${formattedEnd}, the employment of the above-named employee has been officially terminated due to ${terminationReason || 'company-wide retrenchment'}. The termination was carried out in accordance with company policies and applicable labor laws. All company property has been returned, and any final pay and benefits due have been or will be processed accordingly.\n\nIssued this ${today}, at Davao City, Philippines.\n\n\nOrwill Jane M. Linaza\nPeople Operations Support`;
      case "Certificate of Employment":
        return `TO WHOM IT MAY CONCERN:\n\nThis is to certify that ${employeeName} is an employee of Callbox Davao, holding the status of ${employmentStatus} ${period}.\n\nThis certification is being issued upon the request of ${employeeName} for the purpose of ${purpose}.\n\nIssued this ${today} at Davao City, Philippines.`;
      case "Certificate of Recognition":
        return `CERTIFICATE OF RECOGNITION\n\nThis certificate is proudly presented to\n\n${employeeName.toUpperCase()}\n\nIn recognition of their dedicated service and exemplary performance during their tenure ${period}.\n\nGiven this ${today}.`;
      case "Clearance Certificate":
        return `CLEARANCE CERTIFICATE\n\nThis is to certify that ${employeeName} has been officially cleared of all accountabilities with Callbox Davao as of ${formattedEnd}.\n\nIssued for: ${purpose}`;
      case "Recommendation Letter":
        return `LETTER OF RECOMMENDATION\n\nTo Whom It May Concern,\n\nIt is my pleasure to recommend ${employeeName} for any professional opportunity. During their tenure at Callbox Davao ${period}, ${employeeName} served as a valued member of our organization.\n\nDate: ${today}`;
      default:
        return `Document for ${employeeName}\nStatus: ${employmentStatus}\nPurpose: ${purpose}`;
    }
  }

  const handleDraft = () => {
    if (!formData.employeeName || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all mandatory fields.",
        variant: "destructive"
      })
      return
    }

    const result = generateStaticNarrative(formData)
    setDraftedNarrative(result)
    
    if (db) {
      addDoc(collection(db, "certificates"), {
        ...formData,
        narrative: result,
        status: "Pending",
        createdAt: serverTimestamp()
      }).catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: "certificates",
          operation: "create",
          requestResourceData: formData
        })
        errorEmitter.emit("permission-error", permissionError)
      })
    }

    toast({
      title: "Draft Created",
      description: "Document saved and sent for approval.",
    })
  }

  const handleCopy = () => {
    if (!draftedNarrative) return
    navigator.clipboard.writeText(draftedNarrative)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleDownloadPDF = () => {
    if (!draftedNarrative) return
    
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    doc.setFillColor(15, 50, 110)
    doc.rect(0, 0, pageWidth, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    
    doc.setFontSize(18)
    doc.text(formData.certificateType.toUpperCase(), 15, 15)
    
    doc.setFontSize(14)
    doc.text("Callbox", 15, 28)
    
    doc.setFontSize(10)
    doc.text("LEAD MANAGEMENT AND SALES SUPPORT", pageWidth - 15, 28, { align: "right" })
    
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    
    const splitText = doc.splitTextToSize(draftedNarrative, 180)
    doc.text(splitText, 15, 55)
    
    const filename = `${formData.employeeName.replace(/\s+/g, '_')}_${formData.certificateType.replace(/\s+/g, '_')}.pdf`
    doc.save(filename)

    toast({
      title: "PDF Exported",
      description: "Your document is ready for download.",
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-4xl font-headline font-bold tracking-tight">
          Create <span className="text-primary">Document</span>
        </h2>
        <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Generate professional HR narratives instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="font-headline text-2xl font-bold uppercase">Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="employeeName" className="font-bold">Full Name</Label>
                <Input 
                  id="employeeName" 
                  placeholder="e.g. Juan Dela Cruz" 
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certificate of Employment">Certificate of Employment</SelectItem>
                    <SelectItem value="Certificate of Termination">Certificate of Termination</SelectItem>
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
                    value={formData.startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        startDate: newStart,
                        endDate: prev.endDate === "Present" ? "Present" : newStart
                      }))
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="font-bold uppercase text-[10px]">End Date</Label>
                  <Input 
                    id="endDate" 
                    type={formData.endDate === "Present" ? "text" : "date"}
                    placeholder="or 'Present'"
                    disabled={formData.endDate === "Present"}
                    value={formData.endDate === "Present" ? "Currently Employed" : formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox 
                      id="present" 
                      checked={formData.endDate === "Present"}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData, 
                          endDate: checked ? "Present" : formData.startDate
                        })
                      }}
                    />
                    <label
                      htmlFor="present"
                      className="text-[10px] font-bold uppercase leading-none cursor-pointer"
                    >
                      Present (Current Employee)
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-bold uppercase text-[10px]">Employment Status</Label>
                <Select 
                  value={formData.employmentStatus}
                  onValueChange={(v) => setFormData({...formData, employmentStatus: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Resigned">Resigned</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.certificateType === "Certificate of Termination" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="terminationReason" className="font-bold">Reason for Termination</Label>
                  <Input 
                    id="terminationReason" 
                    placeholder="e.g. company-wide retrenchment" 
                    value={formData.terminationReason}
                    onChange={(e) => setFormData({...formData, terminationReason: e.target.value})}
                  />
                  <p className="text-[10px] opacity-60 font-medium italic">This reason will appear explicitly in the narrative.</p>
                </div>
              )}

              {formData.certificateType !== "Certificate of Termination" && (
                <div className="space-y-2">
                  <Label htmlFor="purpose" className="font-bold">Purpose of Issuance</Label>
                  <Input 
                    id="purpose" 
                    placeholder="e.g. Bank loan application" 
                    value={formData.purposeOfCertificate}
                    onChange={(e) => setFormData({...formData, purposeOfCertificate: e.target.value})}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                onClick={handleDraft} 
                className="w-full h-14 font-bold text-lg shadow-sm hover:shadow-md transition-all" 
              >
                <FileText className="mr-2 h-5 w-5" />
                Generate & Queue
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card className="shadow-sm border h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
              <CardTitle className="font-headline font-bold text-2xl">Output Preview</CardTitle>
              {draftedNarrative && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="font-bold">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="font-bold">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0">
              {draftedNarrative ? (
                <div className="p-10 h-full bg-white">
                  <p className="text-xl leading-relaxed whitespace-pre-wrap font-medium font-body text-foreground">
                    {draftedNarrative}
                  </p>
                </div>
              ) : (
                <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-12 opacity-30">
                  <Zap className="h-20 w-20 mb-4" />
                  <p className="font-bold text-xl uppercase tracking-widest">Enter details to generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
