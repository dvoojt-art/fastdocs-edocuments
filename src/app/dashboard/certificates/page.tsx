"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-500 text-white"
      case "Rejected": return "bg-destructive text-destructive-foreground"
      case "Pending": return "bg-primary text-primary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-headline font-bold tracking-tight">Document Vault</h2>
          <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Manage generated HR documents</p>
        </div>
      </div>

      <Card className="shadow-sm overflow-hidden border">
        <CardHeader className="border-b pb-6 bg-muted/20">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by employee name..." 
              className="pl-10 h-12" 
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
              ) : filteredCerts?.map((cert) => (
                <TableRow key={cert.id} className="hover:bg-muted/30">
                  <TableCell className="font-bold">{cert.employeeName}</TableCell>
                  <TableCell className="font-medium">{cert.certificateType}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cert.createdAt?.toDate().toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={`font-bold ${getStatusColor(cert.status)}`}>
                      {cert.status || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}