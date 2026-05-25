"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Loader2, FileText, Download } from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { jsPDF } from "jspdf"
import { useToast } from "@/hooks/use-toast"

const FOOTER_DATA = [
  { city: "California", address: "4249 Balboa Blvd, #353, Encino CA 91316 USA", phone: "+1 (888) 810-7464" },
  { city: "Singapore", address: "1 Scotts Road #24-10, Shaw Centre Singapore 228208", phone: "+1 (888) 810-7464" },
  { city: "Australia", address: "Suite 33, 89-97 Jones St, Ultimo, NSW 2007 Australia", phone: "+61 (02) 9037 2248" },
  { city: "Iloilo", address: "2nd and 3rd Flr, Avancena Bldg, M.H. Del Pilar St, Molo, 5000 Iloilo City, Philippines", phone: "+63 33 337 6833" },
  { city: "Davao", address: "9th and 10th Flr, Landco Corp, Center, J.P. Laurel Ave, Bajada, 8000 Davao City, Philippines", phone: "+63 82 224 2035" },
  { city: "Siargao", address: "Tourism Rd, Brgy. Catangnan, Gen. Luna, 8419, Surigao Del Norte, Philippines", phone: "" }
]

export default function CertificatesPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCert, setSelectedCert] = useState<any>(null)

  const certsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "certificates"), orderBy("createdAt", "desc"))
  }, [db])

  const { data: certificates, loading } = useCollection(certsQuery)

  const filteredCerts = certificates?.filter(cert => 
    cert.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateType?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-500 text-white"
      case "Rejected": return "bg-destructive text-destructive-foreground"
      case "Pending": return "bg-primary text-primary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const formatLongDate = (date: any) => {
    if (!date) return "N/A";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  const handleDownloadPDF = (cert: any) => {
    if (!cert?.narrative) return
    
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    const contentWidth = pageWidth - (margin * 2)
    
    // Exact Header Colors from Image
    const colorYellowLighter = [255, 212, 0]
    const colorYellowDarker = [255, 171, 0]
    const colorBlue = [15, 50, 110]
    const colorGray = [240, 242, 245]
    
    // 1. Top Yellow Decorative Bars
    doc.setFillColor(colorYellowLighter[0], colorYellowLighter[1], colorYellowLighter[2])
    doc.rect(margin, 5, contentWidth, 0.8, 'F')
    doc.setFillColor(colorYellowDarker[0], colorYellowDarker[1], colorYellowDarker[2])
    doc.rect(margin, 5.8, contentWidth * 0.4, 0.6, 'F')
    
    // 2. Main Header Bar Background
    doc.setFillColor(colorGray[0], colorGray[1], colorGray[2])
    doc.rect(margin, 7.5, contentWidth, 18, 'F')
    
    // 3. Angled Blue Branding (Exact Match)
    doc.setFillColor(colorBlue[0], colorBlue[1], colorBlue[2])
    const splitStart = margin + (contentWidth * 0.58)
    const splitEnd = margin + (contentWidth * 0.68)
    doc.triangle(splitStart, 7.5, splitEnd, 7.5, splitEnd, 25.5, 'F')
    doc.rect(splitEnd, 7.5, margin + contentWidth - splitEnd, 18, 'F')
    
    // 4. Logo & Header Text
    doc.setTextColor(colorBlue[0], colorBlue[1], colorBlue[2])
    doc.setFont("helvetica", "bolditalic")
    doc.setFontSize(22)
    doc.text("callbox", margin + 6, 17)
    
    // Caret Symbol ^ above 'o'
    doc.setLineWidth(0.4)
    const oX = margin + 6 + 18.5
    doc.line(oX - 1.5, 10, oX, 8.5)
    doc.line(oX, 8.5, oX + 1.5, 10)
    
    doc.setTextColor(120, 130, 140)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.text("ContactDB, Inc.", margin + 6, 21)
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7.5)
    doc.setFont("helvetica", "bold")
    doc.text("LEAD MANAGEMENT AND", margin + contentWidth - 6, 16, { align: "right" })
    doc.text("SALES SUPPORT", margin + contentWidth - 6, 20, { align: "right" })
    
    // Content Styling
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10) 
    
    const lines = cert.narrative.split('\n')
    let currentY = 40

    lines.forEach((line: string) => {
      if (line.trim() === "") {
        currentY += 4
        return
      }

      const titles = ["CERTIFICATION", "CERTIFICATE OF EMPLOYMENT", "CERTIFICATE OF TERMINATION", "CERTIFICATE OF RECOGNITION", "CERTIFICATE OF COMPLETION", "CLEARANCE CERTIFICATE", "LETTER OF RECOMMENDATION"]
      const isTitle = titles.includes(line.trim().toUpperCase()) || titles.includes(line.trim());
      const isIssuedLine = line.includes("Issued this");
      
      if (isTitle) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(14)
        doc.text(line, pageWidth / 2, currentY, { align: "center" })
        currentY += 12
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
      } else if (isIssuedLine) {
        currentY += 8
        doc.text(line, margin, currentY)
        currentY += 20
      } else {
        const splitText = doc.splitTextToSize(line, contentWidth)
        doc.text(splitText, margin, currentY, { align: "justify", maxWidth: contentWidth })
        currentY += (splitText.length * 5) + 2
      }
    })

    // Signature Block (Exact Match)
    const signatureY = currentY + 15
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.text("Orwill Jane M. Linaza", margin, signatureY)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text("People Operations Officer | HR & Administrator", margin, signatureY + 6)
    
    // Footer Section (Exact Match)
    const footerY = pageHeight - 25
    doc.setDrawColor(230, 230, 230)
    doc.setLineWidth(0.4)
    doc.line(margin, footerY, pageWidth - margin, footerY)
    
    const colWidth = contentWidth / 6
    doc.setFontSize(6)
    doc.setTextColor(150, 150, 150)
    
    FOOTER_DATA.forEach((item, i) => {
      const x = margin + (i * colWidth)
      doc.setFont("helvetica", "bold")
      doc.text(item.city, x, footerY + 5)
      doc.setFont("helvetica", "normal")
      const addrLines = doc.splitTextToSize(item.address, colWidth - 4)
      doc.text(addrLines, x, footerY + 8)
      if (item.phone) {
        doc.text(item.phone, x, footerY + 8 + (addrLines.length * 3))
      }
    })

    const filename = `${cert.employeeName.replace(/\s+/g, '_')}_${cert.certificateType.replace(/\s+/g, '_')}.pdf`
    doc.save(filename)

    toast({
      title: "PDF Exported",
      description: "Your document is ready for download.",
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-headline font-bold tracking-tight">
            Document <span className="text-primary">Vault</span>
          </h2>
          <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Manage generated HR documents</p>
        </div>
      </div>

      <Card className="shadow-none overflow-hidden border">
        <CardHeader className="border-b pb-6 bg-muted/20">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by employee name..." 
              className="pl-10 h-12 shadow-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold uppercase text-xs">NAME</TableHead>
                <TableHead className="font-bold uppercase text-xs">Type</TableHead>
                <TableHead className="font-bold uppercase text-xs">Generated Date</TableHead>
                <TableHead className="font-bold uppercase text-xs">Status</TableHead>
                <TableHead className="text-right font-bold uppercase text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto opacity-20" />
                  </TableCell>
                </TableRow>
              ) : filteredCerts && filteredCerts.length > 0 ? (
                filteredCerts.map((cert) => (
                  <TableRow key={cert.id} className="hover:bg-muted/30">
                    <TableCell className="font-bold">{cert.employeeName}</TableCell>
                    <TableCell className="font-medium">{cert.certificateType}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatLongDate(cert.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`font-bold shadow-none ${getStatusColor(cert.status)}`}>
                        {cert.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-primary/10"
                        onClick={() => setSelectedCert(cert)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 opacity-40 italic">
                    {searchTerm ? "No documents match your search criteria." : "No documents found in the vault."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border shadow-none sm:rounded-lg">
          <DialogHeader className="p-6 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <DialogTitle className="font-headline font-bold text-2xl uppercase">Document Preview</DialogTitle>
                  <DialogDescription className="font-bold opacity-60 uppercase text-[10px] tracking-widest">
                    Reviewing {selectedCert?.certificateType} for {selectedCert?.employeeName}
                  </DialogDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDownloadPDF(selectedCert)}
                className="font-bold h-10 shadow-none"
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-8 bg-white">
            <div className="max-w-2xl mx-auto border p-8 shadow-sm">
              {/* Header Simulation */}
              <div className="border-b-2 border-[#0f326e] pb-3 mb-6 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-[#0f326e] italic">callbox</h3>
                  <p className="text-[10px] font-bold opacity-50 uppercase">ContactDB, Inc.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#0f326e]">Lead Management & Sales Support</p>
                </div>
              </div>

              <div className="space-y-4">
                {selectedCert?.narrative?.split('\n').map((line: string, i: number) => {
                  if (line.trim() === "") return <div key={i} className="h-2" />;
                  
                  const titles = ["CERTIFICATION", "CERTIFICATE OF EMPLOYMENT", "CERTIFICATE OF TERMINATION", "CERTIFICATE OF RECOGNITION", "CERTIFICATE OF COMPLETION", "CLEARANCE CERTIFICATE", "LETTER OF RECOMMENDATION"]
                  const isTitle = titles.includes(line.trim().toUpperCase()) || titles.includes(line.trim());
                  const isIssuedLine = line.includes("Issued this");
                  
                  return (
                    <p 
                      key={i} 
                      className={cn(
                        "text-[12px] leading-[1.6] font-medium font-body text-foreground",
                        isTitle ? "text-center font-bold uppercase tracking-wider my-6 text-xl" : "text-justify",
                        isIssuedLine ? "mt-8 font-semibold italic" : ""
                      )}
                    >
                      {line}
                    </p>
                  );
                })}

                {/* Signature Simulation */}
                <div className="mt-12 pt-6">
                  <div className="w-64 border-t border-muted-foreground/30 pt-2">
                    <p className="font-bold text-lg">Orwill Jane M. Linaza</p>
                    <p className="text-[10px] opacity-60">People Operations Officer | HR & Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t bg-muted/10 flex justify-end">
            <Button 
              onClick={() => setSelectedCert(null)}
              className="font-bold px-8 shadow-none"
            >
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
