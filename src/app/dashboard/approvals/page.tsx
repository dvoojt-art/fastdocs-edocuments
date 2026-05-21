"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Eye, Loader2, Clock } from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, where, orderBy, doc, updateDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function ApprovalsPage() {
  const db = useFirestore()
  const { toast } = useToast()

  const pendingQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "certificates"),
      where("status", "==", "Pending"),
      orderBy("createdAt", "desc")
    )
  }, [db])

  const { data: pendingCerts, loading } = useCollection(pendingQuery)

  const handleAction = (id: string, newStatus: "Approved" | "Rejected") => {
    if (!db) return

    const docRef = doc(db, "certificates", id)
    updateDoc(docRef, { status: newStatus })
      .then(() => {
        toast({
          title: `Document ${newStatus}`,
          description: `The request has been updated successfully.`,
        })
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: "update",
          requestResourceData: { status: newStatus }
        })
        errorEmitter.emit("permission-error", permissionError)
      })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-headline font-bold tracking-tight">
          Approval <span className="text-primary">Queue</span>
        </h2>
        <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Review and authorize HR document requests</p>
      </div>

      <Card className="shadow-sm border overflow-hidden">
        <CardHeader className="bg-muted/50 border-b p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline font-bold text-2xl uppercase">Pending Requests</CardTitle>
          </div>
          <CardDescription className="opacity-60 font-medium">Items requiring your immediate attention</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="font-bold uppercase text-xs">NAME</TableHead>
                <TableHead className="font-bold uppercase text-xs">Document Type</TableHead>
                <TableHead className="font-bold uppercase text-xs">Request Date</TableHead>
                <TableHead className="text-right font-bold uppercase text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto opacity-20" />
                  </TableCell>
                </TableRow>
              ) : pendingCerts && pendingCerts.length > 0 ? (
                pendingCerts.map((cert) => (
                  <TableRow key={cert.id} className="hover:bg-muted/30">
                    <TableCell className="font-bold">{cert.employeeName}</TableCell>
                    <TableCell className="font-medium">{cert.certificateType}</TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {cert.createdAt?.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="font-bold hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
                          onClick={() => handleAction(cert.id, "Approved")}
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="font-bold hover:bg-destructive hover:text-white hover:border-destructive transition-colors"
                          onClick={() => handleAction(cert.id, "Rejected")}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20 opacity-40 italic">
                    All clear! No pending approvals.
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
