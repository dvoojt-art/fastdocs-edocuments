
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
import { cn } from "@/lib/utils"

const FOOTER_DATA = [
  {
    city: "California",
    address: "4249 Balboa Blvd, #353, Encino CA 91316 USA",
    phone: "+1 (888) 810-7464"
  },
  {
    city: "Singapore",
    address: "1 Scotts Road #24-10, Shaw Centre Singapore 228208",
    phone: "+1 (888) 810-7464"
  },
  {
    city: "Australia",
    address: "Suite 33, 89-97 Jones St, Ultimo, NSW 2007 Australia",
    phone: "+61 (02) 9037 2248"
  },
  {
    city: "Iloilo",
    address: "2nd and 3rd Flr, Avancena Bldg, M.H. Del Pilar St, Molo, 5000 Iloilo City, Philippines",
    phone: "+63 33 337 6833"
  },
  {
    city: "Davao",
    address: "9th and 10th Flr, Landco Corp, Center, J.P. Laurel Ave, Bajada, 8000 Davao City, Philippines",
    phone: "+63 82 224 2035"
  },
  {
    city: "Siargao",
    address: "Tourism Rd, Brgy. Catangnan, Gen. Luna, 8419, Surigao Del Norte, Philippines",
    phone: ""
  }
]

export default function NewCertificatePage() {
  const db = useFirestore()
  const [draftedNarrative, setDraftedNarrative] = useState("")
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    salutation: "Mr.",
    employeeName: "",
    position: "",
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

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

  const getIssuedDateString = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    const year = today.getFullYear();
    return `Issued this ${day}${getOrdinalSuffix(day)} day of ${month} ${year}, at Davao City, Philippines.`;
  }

  const generateStaticNarrative = (data: typeof formData) => {
    const { salutation, employeeName, position, certificateType, startDate, endDate, employmentStatus, purposeOfCertificate, terminationReason } = data;
    
    const formattedStart = formatDateString(startDate);
    const formattedEnd = formatDateString(endDate);
    const fullNameWithSalutation = `${salutation} ${employeeName}`;
    const pronoun = salutation === "Mr." ? "he" : "she";
    
    const period = endDate.toLowerCase() === 'present' ? `since ${formattedStart}` : `from ${formattedStart} to ${formattedEnd}`;
    const purpose = purposeOfCertificate || 'employment purposes only';
    
    const issuedLine = getIssuedDateString();

    switch (certificateType) {
      case "Certificate of Employment":
        return `CERTIFICATION\n\nThis is to certify that ${fullNameWithSalutation} was an employee of Contact DB Inc. (Callbox Inc.) ${period} as a ${position}.\n\nThis is to further certify that ${pronoun} is cleared from all money and property accountabilities with the company.\n\nThis also serves notice that employee is bound by surviving confidentiality and non-competition provisions in his contract with Contact DB Incorporated, quoted as follows:\n\n"Confidentiality. During the Employment Period and for an indefinite period thereafter, an employee shall not use, divulge, communicate or disclose any protected intellectual property, confidential information, trade secrets, records relating to the business, affairs, products or services of Contact DB Incorporated or its affiliates, or any Person having dealings therewith, or permit or encourage the use of such confidential information by another."\n\n"Non-Competition. During the Employment Period and within One year from the termination thereof:\n\nEmployee shall not promote, participate, engage or have any other interest directly or indirectly, in any other business, undertaking or activity similar or substantially similar to the business operations or activities of Contact DB Incorporated or any of its affiliates, in any jurisdiction where the company is holding office. For this purpose, "directly or indirectly engage in any business similar to or substantially similar to that of Contact DB Incorporated" shall include, but is not limited to, engaging in the same business as owner, partner, agent, representative, consultant, officer, director or as an employee of any person, firm, or corporation or other entity;\n\nNeither shall employee directly or indirectly solicit, obtain, secure or render services to any prospective or present client which has been solicited or serviced by Contact DB Incorporated. Or any of its affiliates; nor shall an employee recruits any of the employees of the Company including those of its affiliates to engage in a business similar or the same to that of Contact DB Incorporated."\n\nThis certification is issued as requested by the above-named employee for ${purpose}.\n\n${issuedLine}`;
      case "Certificate of Termination":
        return `CERTIFICATE OF TERMINATION\n\nThis is to certify that ${fullNameWithSalutation}, holding the position of ${position}, was employed with ContactDB Inc., located on the 9th floor, Landco Bldg. JP Laurel Ave., Bajada, Davao City, ${period}.\n\nAs of ${formattedEnd}, the employment of the above-named employee has been officially terminated due to ${terminationReason || 'company-wide retrenchment'}. The termination was carried out in accordance with company policies and applicable labor laws. All company property has been returned, and any final pay and benefits due have been or will be processed accordingly.\n\nThis certification is being issued upon the request of the employee for whatever legal purpose it may serve.\n\n${issuedLine}`;
      case "Certificate of Recognition":
        return `CERTIFICATE OF RECOGNITION\n\nThis certificate is proudly presented to\n\n${fullNameWithSalutation.toUpperCase()}\n\n${position.toUpperCase()}\n\nIn recognition of their dedicated service and exemplary performance during their tenure ${period}.\n\n${issuedLine}`;
      case "Certificate of Completion":
        return `CERTIFICATE OF COMPLETION\n\nThis is to certify that ${fullNameWithSalutation} has successfully completed the required duties and responsibilities as ${position} at ContactDB Inc. (Callbox Inc.) ${period}.\n\nThis certificate is awarded in recognition of their commitment, professional conduct, and the successful attainment of all objectives set forth during their tenure.\n\nIssued upon request for whatever legal purpose it may serve.\n\n${issuedLine}`;
      case "Clearance Certificate":
        return `CLEARANCE CERTIFICATE\n\nThis is to certify that ${fullNameWithSalutation}, holding the position of ${position}, has been officially cleared of all accountabilities with Callbox Davao as of ${formattedEnd}.\n\nIssued for: ${purpose || 'whatever legal purpose it may serve'}\n\n${issuedLine}`;
      case "Recommendation Letter":
        return `LETTER OF RECOMMENDATION\n\nTo Whom It May Concern,\n\nIt is my pleasure to recommend ${fullNameWithSalutation} for any professional opportunity. During their tenure as ${position} at Callbox Davao ${period}, ${fullNameWithSalutation} served as a valued member of our organization.\n\n${issuedLine}`;
      default:
        return `Document for ${fullNameWithSalutation}\nPosition: ${position}\nStatus: ${employmentStatus}\nPurpose: ${purpose}\n\n${issuedLine}`;
    }
  }

  const handleDraft = () => {
    if (!formData.employeeName || !formData.position || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all mandatory fields including Position.",
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
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    const contentWidth = pageWidth - (margin * 2)
    
    // Header - Top yellow decorative bars (Matches Image)
    doc.setFillColor(255, 210, 100) // Lighter yellow
    doc.rect(margin, 5, contentWidth, 1, 'F')
    doc.setFillColor(255, 180, 50) // Darker yellow
    doc.rect(margin, 6.2, contentWidth * 0.45, 0.8, 'F')
    
    // Header Bar - Gray Angled Background
    doc.setFillColor(240, 242, 245)
    doc.rect(margin, 8, contentWidth, 18, 'F')
    
    // Blue Angled Section
    doc.setFillColor(15, 50, 110)
    const splitX = margin + contentWidth * 0.62
    doc.triangle(splitX, 8, margin + contentWidth, 8, margin + contentWidth, 26, 'F')
    doc.rect(splitX, 8, margin + contentWidth - splitX, 18, 'F')
    
    // Logo Text (Blue on Gray)
    doc.setTextColor(15, 50, 110)
    doc.setFont("helvetica", "bolditalic")
    doc.setFontSize(20)
    doc.text("callbox", margin + 6, 18)
    
    doc.setTextColor(120, 130, 140)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.text("ContactDB, Inc.", margin + 6, 22)
    
    // Right Header Text (White on Blue)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7.5)
    doc.setFont("helvetica", "bold")
    doc.text("LEAD MANAGEMENT AND", margin + contentWidth - 6, 16, { align: "right" })
    doc.text("SALES SUPPORT", margin + contentWidth - 6, 20, { align: "right" })
    
    // Content Styling
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9) 
    
    const lines = draftedNarrative.split('\n')
    let currentY = 38

    lines.forEach((line) => {
      if (line.trim() === "") {
        currentY += 4
        return
      }

      const titles = ["CERTIFICATION", "CERTIFICATE OF EMPLOYMENT", "CERTIFICATE OF TERMINATION", "CERTIFICATE OF RECOGNITION", "CERTIFICATE OF COMPLETION", "CLEARANCE CERTIFICATE", "LETTER OF RECOMMENDATION"]
      const isTitle = titles.includes(line.trim());
      const isIssuedLine = line.includes("Issued this");
      
      if (isTitle) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(14)
        doc.text(line, pageWidth / 2, currentY, { align: "center" })
        currentY += 10
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
      } else if (isIssuedLine) {
        currentY += 6
        doc.text(line, margin, currentY)
        currentY += 15
      } else {
        const splitText = doc.splitTextToSize(line, contentWidth)
        doc.text(splitText, margin, currentY, { align: "justify", maxWidth: contentWidth })
        currentY += (splitText.length * 4.5) + 1.5
      }
    })

    // Signature Block (Matches Image)
    const signatureY = currentY + 10
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text("Orwill Jane M. Linaza", margin, signatureY)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.text("People Operations Support", margin, signatureY + 5)
    
    // Footer Section (Matches Image columns and layout)
    const footerY = pageHeight - 18
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    doc.line(margin, footerY, pageWidth - margin, footerY)
    
    const colWidth = contentWidth / 6
    doc.setFontSize(5.5)
    doc.setTextColor(140, 140, 140)
    
    FOOTER_DATA.forEach((item, i) => {
      const x = margin + (i * colWidth)
      doc.setFont("helvetica", "bold")
      doc.text(item.city, x, footerY + 4)
      doc.setFont("helvetica", "normal")
      const addrLines = doc.splitTextToSize(item.address, colWidth - 4)
      doc.text(addrLines, x, footerY + 6.5)
      if (item.phone) {
        doc.text(item.phone, x, footerY + 6.5 + (addrLines.length * 2.5))
      }
    })

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
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1 space-y-2">
                  <Label htmlFor="salutation" className="font-bold">Title</Label>
                  <Select 
                    value={formData.salutation}
                    onValueChange={(v) => setFormData({...formData, salutation: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Mr." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="employeeName" className="font-bold">Full Name</Label>
                  <Input 
                    id="employeeName" 
                    placeholder="e.g. Juan Dela Cruz" 
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="font-bold">Position</Label>
                <Input 
                  id="position" 
                  placeholder="e.g. Sales Specialist" 
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
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
                    <SelectItem value="Certificate of Completion">Certificate of Completion</SelectItem>
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
                        endDate: prev.endDate === "Present" ? "Present" : (prev.endDate || newStart)
                      }))
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="font-bold uppercase text-[10px]">End Date</Label>
                  <div className="space-y-2">
                    <Input 
                      id="endDate" 
                      type={formData.endDate === "Present" ? "text" : "date"}
                      placeholder="or 'Present'"
                      disabled={formData.endDate === "Present"}
                      value={formData.endDate === "Present" ? "Currently Employed" : formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="present" 
                        checked={formData.endDate === "Present"}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData, 
                            endDate: checked ? "Present" : (formData.startDate || "")
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
                    <SelectItem value="End of Contract">End of Contract</SelectItem>
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
                </div>
              )}

              {formData.certificateType !== "Certificate of Termination" && (
                <div className="space-y-2">
                  <Label htmlFor="purpose" className="font-bold">Purpose of Issuance</Label>
                  <Input 
                    id="purpose" 
                    placeholder={formData.certificateType === "Certificate of Employment" ? "e.g. employment purposes only" : "e.g. Bank loan application"} 
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
          <Card className="shadow-sm border min-h-[800px] flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-6 bg-muted/5">
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
            <CardContent className="flex-1 p-0 bg-white flex flex-col">
              {draftedNarrative ? (
                <div className="flex-1 flex flex-col">
                  <div className="p-8 space-y-4 flex-1">
                    <div className="max-w-2xl mx-auto space-y-4">
                      {/* Header Simulation */}
                      <div className="border-b-2 border-[#0f326e] pb-3 mb-4 flex justify-between items-end">
                        <div>
                          <h3 className="text-xl font-bold text-[#0f326e] italic">callbox</h3>
                          <p className="text-[8px] font-bold opacity-50 uppercase">ContactDB, Inc.</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-[#0f326e]">Lead Management & Sales Support</p>
                        </div>
                      </div>

                      {draftedNarrative.split('\n').map((line, i) => {
                        if (line.trim() === "") return <div key={i} className="h-2" />;
                        
                        const titles = ["CERTIFICATION", "CERTIFICATE OF EMPLOYMENT", "CERTIFICATE OF TERMINATION", "CERTIFICATE OF RECOGNITION", "CERTIFICATE OF COMPLETION", "CLEARANCE CERTIFICATE", "LETTER OF RECOMMENDATION"]
                        const isTitle = titles.includes(line.trim());
                        const isIssuedLine = line.includes("Issued this");
                        
                        return (
                          <p 
                            key={i} 
                            className={cn(
                              "text-[10px] leading-[1.4] font-medium font-body text-foreground",
                              isTitle ? "text-center font-bold uppercase tracking-wider mb-4 text-lg" : "text-justify",
                              isIssuedLine ? "mt-6 font-semibold italic" : ""
                            )}
                          >
                            {line}
                          </p>
                        );
                      })}

                      {/* Signature Simulation */}
                      <div className="mt-8 pt-4">
                        <div className="w-56 border-t border-muted-foreground/30 pt-1">
                          <p className="font-bold text-base">Orwill Jane M. Linaza</p>
                          <p className="text-[9px] opacity-60">People Operations Support</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Simulation */}
                  <div className="border-t border-muted-foreground/10 p-4 bg-muted/5">
                    <div className="grid grid-cols-6 gap-1">
                      {FOOTER_DATA.map((item, i) => (
                        <div key={i} className="space-y-0.5">
                          <p className="text-[7px] font-bold uppercase text-muted-foreground">{item.city}</p>
                          <p className="text-[6px] leading-tight text-muted-foreground/70">{item.address}</p>
                          {item.phone && <p className="text-[6px] font-medium text-muted-foreground/70">{item.phone}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[450px] flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
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
