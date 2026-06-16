
"use client"

import { useState, useEffect } from "react"
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Header, Footer, PageSize, PageOrientation } from "docx"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, Copy, Check, Zap, File, FileSpreadsheet, Database, FileSignature, Sheet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { jsPDF } from "jspdf" 
import { generateStaticNarrative } from "./narrative-generator"
import { cn } from "@/lib/utils"
import { createNotification } from "@/lib/notifications"

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
  const [isDrafted, setIsDrafted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    salutation: "Mr.",
    employeeName: "",
    position: "",
    department: "",
    employeeAddress: "",
    certificateType: "",
    startDate: "",
    endDate: "",
    employmentStatus: "",
    purposeOfCertificate: "",
    terminationReason: "company-wide retrenchment",
    basicRate: "",
    allowance: ""
  })
  const { toast } = useToast()

  const handleDraft = async () => {
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
    setIsDrafted(true)
    
    if (!db) return

    try {
      await addDoc(collection(db, "certificates"), {
        ...formData,
        narrative: result,
        headerImageUrl: "/header.jpg",
        footerImageUrl: "/footer.jpg",
        status: "Pending",
        createdAt: serverTimestamp()
      });

      // Trigger Notification
      await createNotification(db, {
        title: "New Document Drafted",
        message: `${formData.certificateType} for ${formData.employeeName} is awaiting approval.`,
        type: "Info",
        priority: "HR",
        link: "/dashboard/approvals"
      });

      toast({
        title: "Draft Created",
        description: "Document saved and sent for approval.",
      });

    } catch (err: any) {
      console.error("Firestore error:", err);
      errorEmitter.emit("permission-error", {
        message: err.message,
        code: err.code,
        full: err
      });
    }
  }

  const handleCopy = () => {
    if (!draftedNarrative) return
    navigator.clipboard.writeText(draftedNarrative)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleDownloadPDF = async () => {
    if (!draftedNarrative) return

    try {
      const doc = new jsPDF("p", "mm", "a4")
  
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
  
      const margin = 25
      const contentWidth = pageWidth - margin * 2
  
      // =========================
      // CONVERT IMAGE TO BASE64
      // =========================
  
      const getBase64Image = async (url: string) => {
        const response = await fetch(url)
        const blob = await response.blob()
  
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
  
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
  
          reader.readAsDataURL(blob)
        })
      }
  
      // =========================
      // LOAD IMAGES
      // =========================
  
      const headerBase64 = await getBase64Image("/header.jpg")
      const footerBase64 = await getBase64Image("/footer.jpg")
      const signBase64 = await getBase64Image("/sign.png")
  
      // =========================
      // ADD HEADER
      // =========================
  
      doc.addImage(
        headerBase64,
        "JPEG",
        0,
        0,
        pageWidth,
        35
      )
  
      // =========================
      // CONTENT
      // =========================
  
      const lines = draftedNarrative.split("\n")
      let currentY = 50;

      lines.forEach((line: string) => {
        if (line.trim() === "") {
          currentY += 5
          return;
        }
  
        const titles = [
          "CERTIFICATION",
          "CERTIFICATE OF EMPLOYMENT",
          "CERTIFICATE OF EMPLOYMENT (COE WITH COMPENSATION)",
          "CERTIFICATE OF TERMINATION",
          "CERTIFICATE OF RECOGNITION",
          "CERTIFICATE OF COMPLETION",
          "CLEARANCE CERTIFICATE",
          "LETTER OF RECOMMENDATION"
        ]
  
        const isTitle =
          titles.includes(line.trim().toUpperCase()) ||
          titles.includes(line.trim())

        const isIssuedLine = line.includes("Issued this");

        const isIndentedParagraph =
          line.startsWith('"Confidentiality.') ||
          line.startsWith('"Non-Competition.') ||
          line.startsWith("Employee shall not") ||
          line.startsWith("Neither shall employee")

        const isRecognitionNameLine = formData.certificateType === "Certificate of Recognition" && line.trim() === `${formData.salutation} ${formData.employeeName}`.toUpperCase();
        const isRecognitionPositionLine = formData.certificateType === "Certificate of Recognition" && line.trim() === formData.position.toUpperCase();
        
        const possessivePronoun = formData.salutation === "Mr." ? "his" : "her";
        const compensationIntroLine = `${possessivePronoun.charAt(0).toUpperCase() + possessivePronoun.slice(1)} monthly compensation is as follows:`;
        const isCompensationIntro = line.trim() === compensationIntroLine;
        const currentMargin = isIndentedParagraph ? margin + 9 : margin;
        const currentContentWidth = isIndentedParagraph ? contentWidth - 18 : contentWidth;
  
        // NORMAL FIXED FONT SIZE
        if (isTitle) {
          doc.setFontSize(18);
        } else if (isIndentedParagraph) {
          doc.setFontSize(9);
        } else if (formData.certificateType === "Certificate of Employment (COE with Compensation)") {
          doc.setFontSize(12);
        } else if (isRecognitionNameLine || isRecognitionPositionLine) {
          doc.setFontSize(9);
        } else {
          doc.setFontSize(10);
        }
  
        const splitText = doc.splitTextToSize(line, currentContentWidth)
  
        // AUTO PAGE BREAK
        if (currentY + splitText.length * 5 > pageHeight - 45) {
          doc.addPage()
  
          doc.addImage(
            headerBase64,
            "JPEG",
            0,
            0,
            pageWidth,
            35
          )
  
          currentY = 50
        }
  
        if (isTitle) {
          doc.setFont("times", "bold")
  
          const textToRender = line.trim().toUpperCase() === "CERTIFICATION"
            ? "C E R T I F I C A T I O N"
            : line;

          doc.text(textToRender, pageWidth / 2, currentY, {
            align: "center",
          })

          currentY += 14
        } else if (isRecognitionNameLine) {
          doc.setFont("times", "bold");
          doc.setFontSize(22);
          doc.text(line, pageWidth / 2, currentY, { align: "center" });
          currentY += 10;
        } else if (isRecognitionPositionLine) {
          doc.setFont("times", "normal");
          doc.setFontSize(14);
          doc.text(line, pageWidth / 2, currentY, { align: "center" });
          currentY += 10;
        } else if (isCompensationIntro) {
          doc.setFont("times", "bolditalic");
          doc.text(line, currentMargin, currentY);
          currentY += 7;
          currentY += 10;
        } else {
          doc.setFont("times", "normal")

          const { salutation, employeeName } = formData;
          const fullNameWithSalutation = `${salutation} ${employeeName}`;
          const companyNames = [
            "Contact DB Incorporated",
            "Confidentiality.",
            "Non-Competition."
          ];
          const legalTerms = ['"Confidentiality."', '"Non-Competition."'];
          const highlights = [fullNameWithSalutation, ...companyNames, ...legalTerms];

          const renderJustifiedLineWithHighlights = (text: string, y: number) => {
            const textLines = doc.splitTextToSize(text, currentContentWidth);

            textLines.forEach((lineText: string, lineIndex: number) => {
              const isLastLine = lineIndex === textLines.length - 1;
              let currentX = currentMargin;
              const words = lineText.split(' ');
              const totalWordsWidth = doc.getTextWidth(lineText.replace(/\s/g, ''));
              const spaceWidth = (words.length > 1 && !isLastLine)
                ? (currentContentWidth - totalWordsWidth) / (words.length - 1)
                : doc.getTextWidth(' ');

              // Create a regex that finds any of the highlight terms
              const highlightRegex = new RegExp(`(${highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
              const parts = lineText.split(highlightRegex).filter(Boolean);

              parts.forEach(part => {
                const isHighlight = highlights.includes(part);
                doc.setFont("times", isHighlight ? "bold" : "normal");

                const wordsInPart = part.split(' ');
                wordsInPart.forEach((word, wordIndex) => {
                  doc.text(word, currentX, y);
                  currentX += doc.getTextWidth(word);
                  if (wordIndex < wordsInPart.length - 1) {
                    currentX += doc.getTextWidth(' ');
                  }
                });

                // This logic is tricky with mixed highlights and justification.
                // The original justification logic assumed uniform spacing, which is broken by bold text.
                // A simple space is added here as a compromise to maintain readability without complex calculations.
                if (parts.length > 1) {
                   currentX += doc.getTextWidth(' ');
                }
              });

              // Fallback for justification spacing if not the last line
              if (!isLastLine && parts.length === 1) {
                 // This part is complex. For now, we'll use standard text rendering which will be left-aligned.
                 // True justification with mixed styles requires word-by-word position calculation.
              }

              y += 5; // Move to the next line
            });
            return y;
          };

          currentY = renderJustifiedLineWithHighlights(line, currentY);
        }
  
        if (isIssuedLine) {
          currentY += 10
        }
      })
  
      // =========================
      // SIGNATURE
      // =========================
  
      let signatureY = currentY + 5;
      if (signatureY > pageHeight - 65) { // If signature would overlap footer
        doc.addPage();
        doc.addImage(headerBase64, "JPEG", 0, 0, pageWidth, 35);
        signatureY = 50;
      }
  
      // --- E-Signature (Image) ---
      const signatureWidth = 50;
      const signatureHeight = 15; // Adjust as needed for aspect ratio
      doc.addImage(signBase64, "PNG", margin - 5, signatureY, signatureWidth, signatureHeight);
      
      // Printed name and title below the signature
      const textY = signatureY + signatureHeight;
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.text("Orwill Jane M. Linaza", margin, textY);
      doc.text("People Operations Officer", margin, textY + 5);
      // =========================
      // ADD FOOTER
      // =========================
  
      doc.addImage(footerBase64, "JPEG", 0, pageHeight - 30, pageWidth, 23);
  
      // =========================
      // SAVE
      // =========================
  
      const filename = `${formData.employeeName.replace(/\s+/g, "_")}_${formData.certificateType.replace(/\s+/g, "_")}.pdf`
  
      doc.save(filename)
  
      toast({
        title: "PDF Exported",
        description: "Your document is ready for download.",
      })
    } catch (error) {
      console.error(error)
  
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadWord = async () => {
    if (!draftedNarrative) return;

    const getImageBuffer = async (url: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
    };

    try {
      // 1. Fetch all images
      const headerBuffer = await getImageBuffer("/header.jpg");
      const footerBuffer = await getImageBuffer("/footer.jpg");
      const signBuffer = await getImageBuffer("/sign.png");

      // 2. Parse the narrative and create styled paragraphs
      const contentParagraphs = draftedNarrative.split('\n').flatMap(line => {
        if (line.trim() === "") {
          return new Paragraph({ children: [new TextRun("")] });
        }

        const titles = ["CERTIFICATION", "CERTIFICATE OF EMPLOYMENT", "CERTIFICATE OF TERMINATION", "CERTIFICATE OF RECOGNITION", "CERTIFICATE OF COMPLETION", "CLEARANCE CERTIFICATE", "LETTER OF RECOMMENDATION", "CERTIFICATE OF EMPLOYMENT (STANDARD COE)", "CERTIFICATE OF EMPLOYMENT (COE WITH COMPENSATION)"];
        const isTitle = titles.includes(line.trim().toUpperCase());
        const isIndentedParagraph = line.startsWith('"Confidentiality.') || line.startsWith('"Non-Competition.') || line.startsWith("Employee shall not") || line.startsWith("Neither shall employee");
        const isRecognitionNameLine = formData.certificateType === "Certificate of Recognition" && line.trim() === `${formData.salutation} ${formData.employeeName}`.toUpperCase();
        const isRecognitionPositionLine = formData.certificateType === "Certificate of Recognition" && line.trim() === formData.position.toUpperCase();

        const possessivePronoun = formData.salutation === "Mr." ? "his" : "her";
        const compensationIntroLine = `${possessivePronoun.charAt(0).toUpperCase() + possessivePronoun.slice(1)} monthly compensation is as follows:`;
        const isCompensationIntro = line.trim() === compensationIntroLine;
        if (isTitle) {
          return new Paragraph({
            children: [new TextRun({ 
              text: line.trim().toUpperCase() === "CERTIFICATION" ? "C E R T I F I C A T I O N" : line, 
              bold: true, 
              size: 32 
            })], // 16pt
            alignment: AlignmentType.CENTER,
            spacing: { after: 280 }, // 14pt
          });
        }

        if (isRecognitionNameLine) {
          return new Paragraph({
            children: [new TextRun({ text: line, bold: true, size: 44 })], // 22pt
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          });
        }

        if (isRecognitionPositionLine) {
          return new Paragraph({
            children: [new TextRun({ text: line, size: 28 })], // 14pt
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          });
        }

        if (isCompensationIntro) {
          return new Paragraph({
            children: [new TextRun({ text: line, bold: true, italics: true, size: 24 })], // 12pt
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
          });
        }

        const { salutation, employeeName } = formData;
        const fullNameWithSalutation = `${salutation} ${employeeName}`;
        const companyNames = ["Contact DB Incorporated", "Confidentiality.", "Non-Competition."];
        const legalTerms = ['"Confidentiality."', '"Non-Competition."'];
        const highlights = [fullNameWithSalutation, ...companyNames, ...legalTerms];
        const highlightRegex = new RegExp(`(${highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
        const parts = line.split(highlightRegex).filter(Boolean);

        return new Paragraph({
          children: parts.map(part => new TextRun({
            text: part,
            bold: highlights.includes(part),
            size:
              formData.certificateType === "Certificate of Employment (COE with Compensation)" ||
              formData.certificateType === "Certificate of Termination"
                ? 24 // 12pt
                : isIndentedParagraph
                ? 18
                : 22, // 9pt or 11pt
          })),
          alignment: AlignmentType.JUSTIFIED,
          indent: isIndentedParagraph ? { left: 720 } : undefined, // 0.5 inch indent
          spacing: { after: formData.certificateType === "Certificate of Termination" ? 140 : 100 },
        });
      });

      // 3. Add signature and name below it
      const signatureParagraphs = [
        new Paragraph({
          children: [
            new ImageRun({
              data: signBuffer,
              transformation: {
                width: 190,
                height: 55,
              },
            }),
          ],
          indent: { left: -288 }, // Approx -0.2 inches to match PDF's margin - 5
          spacing: { before: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Orwill Jane M. Linaza", bold: true, size: 24 })], // 12pt
        }),
        new Paragraph({
          children: [new TextRun({ text: "People Operations Officer", bold: true, size: 24 })], // 12pt
        }),
      ];

      // 4. Create the document with headers and footers
      const doc = new Document({
        sections: [
          {
            properties: {
              page: { // Corresponds to page margins
                margin: {
                  top: 2880, // 1 inch
                  right: 1440, // 1 inch
                  bottom: 0,
                  left: 1440, // 1 inch
                },
              },
            },
            headers: {
              default: new Header({
                children: [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: headerBuffer,
                        transformation: {
                          width: 835, // A4 width in pixels at ~96 DPI
                          height: 135,
                        },
                        floating: {
                          verticalPosition: {
                            offset: 0, // Position from the top of the page
                          },
                          horizontalPosition: {
                            offset: 0, // Position from the left of the page
                          },
                        },
                      }),
                    ],
                  }),
                ],
              }),
            },
            footers: {
              default: new Footer({
                children: [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: footerBuffer,
                        transformation: {
                          width: 800,
                          height: 85,
                        },
                        floating: {
                          verticalPosition: {
                            // A large value to push it to the bottom of the page
                            offset: 9705525, 
                          },
                          horizontalPosition: {
                            offset: 0, // Position from the left of the page
                          },
                        },
                      }),
                    ],
                  }),
                ],
              }),
            },
            children: [...contentParagraphs, ...signatureParagraphs],
          },
        ],
      });

      // 5. Generate and save the file
      const blob = await Packer.toBlob(doc);
      const filename = `${formData.employeeName.replace(/\s+/g, "_")}_${formData.certificateType.replace(/\s+/g, "_")}.docx`;
      saveAs(blob, filename);

      toast({
        title: "Word Document Exported",
        description: "The .docx file has been generated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Export Failed",
        description: "Failed to generate .docx file.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadExcel = () => {
    try {
      const data = [
        ["Title", "Full Name", "Position", "Department", "Address", "Document Type", "Start Date", "End Date", "Employment Status", "Purpose", "Basic Rate", "Allowance"],
        [formData.salutation, formData.employeeName, formData.position, formData.department, formData.employeeAddress, formData.certificateType, formData.startDate, formData.endDate, formData.employmentStatus, formData.purposeOfCertificate, formData.basicRate, formData.allowance]
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Data");

      const filename = `${formData.employeeName.replace(/\s+/g, "_")}_data.xlsx`;
      XLSX.writeFile(workbook, filename);

      toast({
        title: "Excel Sheet Exported",
        description: "Employee data sheet is ready for download.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Export Failed",
        description: "Failed to generate .xlsx file.",
        variant: "destructive",
      });
    }
  };

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
                    placeholder="e.g., Daryl Cortes" 
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                  />
                </div>
              </div>
                  <div className="space-y-2">
                <Label htmlFor="employeeAddress" className="font-bold">Address</Label>
                <Input 
                  id="employeeAddress" 
                  placeholder="e.g., JP Laurel Ave., Bajada, Davao City" 
                  value={formData.employeeAddress}
                  onChange={(e) => setFormData({
                    ...formData, 
                    employeeAddress: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position" className="font-bold">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(v) => setFormData({ ...formData, position: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales Development Representative">Sales Development Representative</SelectItem>
                    <SelectItem value="Client Service Manager">Client Service Manager</SelectItem>
                    <SelectItem value="IT Tech Support">IT Tech Support</SelectItem>
                    <SelectItem value="OJT">On-the-Job-Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="font-bold">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(v) => setFormData({ ...formData, department: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North America (NAM)">North America (NAM)</SelectItem>
                    <SelectItem value="Asia Pacific (APAC)">Asia Pacific (APAC)</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">Human Resources (HR)</SelectItem>
                    <SelectItem value="General Services (GenServ)">General Services (GenServ)</SelectItem>
                    <SelectItem value="IT Dept.">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              
              
              <div className="space-y-2">
                <Label htmlFor="type" className="font-bold">Document Type</Label>
                <Select 
                  value={formData.certificateType}
                  onValueChange={(v) => setFormData({...formData, certificateType: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certificate of Employment (Standard COE)">Certificate of Employment (Standard COE)</SelectItem>
                    <SelectItem value="Certificate of Employment (COE with Compensation)">Certificate of Employment (COE with Compensation)</SelectItem>
                    <SelectItem value="Certificate of Termination">Certificate of Termination</SelectItem>
                    <SelectItem value="Certificate of Recognition">Certificate of Recognition</SelectItem>
                    <SelectItem value="Certificate of Completion">Certificate of Completion</SelectItem>
                    <SelectItem value="Clearance Certificate">Clearance Certificate</SelectItem>
                    <SelectItem value="Recommendation Letter">Recommendation Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.certificateType === "Certificate of Employment (COE with Compensation)" && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="basicRate" className="font-bold">Basic Rate</Label>
                    <Input 
                      id="basicRate" 
                      type="number"
                      placeholder="e.g., 20,000"
                      value={formData.basicRate}
                      onChange={(e) => setFormData({...formData, basicRate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowance" className="font-bold">Allowance</Label>
                    <Input id="allowance" type="number" placeholder="e.g., 5,000" value={formData.allowance} onChange={(e) => setFormData({...formData, allowance: e.target.value})} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="font-bold">Start Date</Label>
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
                  <Label htmlFor="endDate" className="font-bold">End Date</Label>
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
                <Label htmlFor="status" className="font-bold">Employment Status</Label>
                <Select 
                  value={formData.employmentStatus}
                  onValueChange={(v) => setFormData({...formData, employmentStatus: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
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
                    placeholder="e.g., company-wide retrenchment" 
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
                    placeholder={"e.g., Bank loan application"} 
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
              {isDrafted && (
                <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                  
                </div>
              )}{draftedNarrative && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadWord} className="font-bold">
                    <Download className="h-4 w-4 mr-2" />
                    DOCX
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadExcel} className="font-bold">
                    <Download className="h-4 w-4 mr-2" />
                    XLSX
                  </Button>
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
                  <div className="p-4 space-y-4 flex-1">
                    <div className="max-w-2xl mx-auto">
                      <img src="/header.jpg" alt="Document Header" className="w-full mb-8" />

                      {draftedNarrative.split('\n').map((line, i) => {
                        if (line.trim() === "") return <div key={i} className="h-2" />;
                        
                        // NOTE: The logic for titles and special lines remains for text formatting within the narrative.
                        const titles = ["CERTIFICATION", "CERTIFICATE OF EMPLOYMENT", "CERTIFICATE OF TERMINATION", "CERTIFICATE OF RECOGNITION", "CERTIFICATE OF COMPLETION", "CLEARANCE CERTIFICATE", "LETTER OF RECOMMENDATION", "CERTIFICATE OF EMPLOYMENT (STANDARD COE)", "CERTIFICATE OF EMPLOYMENT (COE WITH COMPENSATION)"]
                        const isTitle = titles.includes(line.trim().toUpperCase()) || titles.includes(line.trim());
                        const isIssuedLine = line.includes("Issued this");
                        const isFirstParagraph = line.startsWith("This is to certify that");
                        const possessivePronoun = formData.salutation === "Mr." ? "his" : "her";
                        const compensationIntroLine = `${possessivePronoun.charAt(0).toUpperCase() + possessivePronoun.slice(1)} monthly compensation is as follows:`;
                        const isCompensationIntro = line.trim() === compensationIntroLine;
                        
                        return (
                          <p 
                            key={i} 
                            className={cn(
                              "text-[11px] leading-[1.4] font-medium font-body text-foreground",
                              isTitle ? "text-center font-bold uppercase tracking-wider mb-6 text-lg" : (isFirstParagraph ? "" : "text-justify"),
                              isIssuedLine ? "mt-3 font-semibold" : "",
                              isCompensationIntro ? "font-bold italic" : ""
                            )}
                          > 
                            {line.trim().toUpperCase() === "CERTIFICATION" ? "C E R T I F I C A T I O N" : line}
                          </p>
                        );
                      })}

                      {/* Signature Simulation */}
                      <div className="mt-12 pt-10">
                        <img src="/sign.png" alt="Signature" className="h-10"/>
                        <div className="w-56 pt-1">
                          <p className="font-bold text-sm">Orwill Jane M. Linaza</p>
                          <p className="text-[12px] font-bold">People Operations Officer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Simulation */}
                  <img src="/footer.jpg" alt="Document Footer" className="w-full mt-auto" />
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