"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, Eye, Loader2, Filter } from "lucide-react"
import Link from "next/link"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { useState } from "react"

export default function CertificatesPage() {
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = useState("")

  const certsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "certificates"), orderBy("createdAt", "desc"))
  }, [db])

  const { data: certificates, loading } = useCollection(certsQuery)

  const filteredCerts = certificates?.filter(cert => 
    cert.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateType?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-headline font-bold tracking-tight text-foreground">Document Vault</h2>
          <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Manage and access generated HR certificates</p>
        </div>
        <Button asChild className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all h-12 font-bold">
          <Link href="/dashboard/certificates/new">
            <FileText className="mr-2 h-4 w-4" />
            New Certificate
          </Link>
        </Button>
      </div>

      <Card className="border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card overflow-hidden">
        <CardHeader className="border-b border-foreground/10 pb-6 bg-black/5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by employee name or document type..." 
                className="pl-10 border-2 border-foreground/20 focus:border-foreground rounded-none h-12" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-2 border-foreground font-bold h-12 rounded-none">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black text-background">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold text-background uppercase text-xs">Employee Name</TableHead>
                <TableHead className="font-bold text-background uppercase text-xs">Document Type</TableHead>
                <TableHead className="font-bold text-background uppercase text-xs">Generated Date</TableHead>
                <TableHead className="font-bold text-background uppercase text-xs">Status</TableHead>
                <TableHead className="text-right font-bold text-background uppercase text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto opacity-20" />
                    <p className="mt-4 font-bold opacity-30 uppercase text-xs">Loading vault...</p>
                  </TableCell>
                </TableRow>
              ) : filteredCerts && filteredCerts.length > 0 ? (
                filteredCerts.map((cert) => (
                  <TableRow key={cert.id} className="hover:bg-primary/5 border-b border-foreground/5">
                    <TableCell className="font-bold">{cert.employeeName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 opacity-40" />
                        <span className="font-medium">{cert.certificateType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {cert.createdAt?.toDate().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className="rounded-none border-2 border-foreground font-bold bg-primary text-primary-foreground">
                        Issued
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-black hover:text-background border border-transparent hover:border-foreground">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-black hover:text-background border border-transparent hover:border-foreground">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 opacity-40 italic">
                    {searchTerm ? "No documents match your search." : "No documents have been generated yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
