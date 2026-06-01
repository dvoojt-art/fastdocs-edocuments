"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Check, X, Loader2, Clock, Trash2, Pencil, FileCheck2, FileX2, UserCheck } from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, where, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { generateStaticNarrative } from "../certificates/new/narrative-generator"

export default function ApprovalsPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<any>(null)

  const pendingQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "certificates"),
      where("status", "==", "Pending"),
      orderBy("createdAt", "desc")
    )
  }, [db])

  const approvedQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "certificates"),
      where("status", "==", "Approved")
    )
  }, [db])

  const rejectedQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "certificates"),
      where("status", "==", "Rejected")
    )
  }, [db])

  const activeEmployeeDocsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "certificates"),
      where("employmentStatus", "==", "Active")
    )
  }, [db])

  const { data: pendingCerts, loading } = useCollection(pendingQuery)
  const { data: approvedCerts } = useCollection(approvedQuery)
  const { data: rejectedCerts } = useCollection(rejectedQuery)
  const { data: activeEmployeeDocs } = useCollection(activeEmployeeDocsQuery)

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

  const handleDelete = (id: string) => {
    if (!db) return;

    const docRef = doc(db, "certificates", id);
    deleteDoc(docRef)
      .then(() => {
        toast({
          title: "Document Deleted",
          description: "The request has been deleted successfully.",
        });
      })
      .catch(() => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: "delete",
        });
        errorEmitter.emit("permission-error", permissionError);
      });
  };

  const handleEdit = (cert: any) => {
    setEditingCert(cert);
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!db || !editingCert) return;

    const docRef = doc(db, "certificates", editingCert.id);
    const updatedNarrative = generateStaticNarrative(editingCert);

    try {
      await updateDoc(docRef, {
        // Update all editable fields
        employeeName: editingCert.employeeName,
        certificateType: editingCert.certificateType,
        position: editingCert.position,
        department: editingCert.department,
        employeeAddress: editingCert.employeeAddress,
        startDate: editingCert.startDate,
        endDate: editingCert.endDate,
        employmentStatus: editingCert.employmentStatus,
        purposeOfCertificate: editingCert.purposeOfCertificate,
        narrative: updatedNarrative, // Regenerate and save the narrative
      });
      toast({
        title: "Request Updated",
        description: "The document request has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      // No need to setEditingCert(null) here, it will be reset when the dialog closes
      // and we might want to keep the data if the user reopens it quickly.
      // The collection listener will update the table automatically.
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: "update",
        requestResourceData: { ...editingCert, narrative: updatedNarrative }
      });
      errorEmitter.emit("permission-error", permissionError);
      toast({
        title: "Update Failed",
        description: "Could not save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatLongDate = (date: any) => {
    if (!date || typeof date.toDate !== 'function') {
      return "N/A";
    }
    return date.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  return (
    <>
      <div>
        <h2 className="text-4xl font-headline font-bold tracking-tight">
          Approval <span className="text-primary">Queue</span>
        </h2>
        <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Review and authorize HR document requests</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCerts?.length ?? <Loader2 className="h-6 w-6 animate-spin opacity-50" />}</div>
            <p className="text-xs text-muted-foreground">Awaiting review and action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Documents</CardTitle>
            <FileCheck2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCerts?.length ?? <Loader2 className="h-6 w-6 animate-spin opacity-50" />}</div>
            <p className="text-xs text-muted-foreground">Total authorized requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Documents</CardTitle>
            <FileX2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCerts?.length ?? <Loader2 className="h-6 w-6 animate-spin opacity-50" />}</div>
            <p className="text-xs text-muted-foreground">Total declined requests</p>
          </CardContent>
        </Card>
        {/* This card shows the count of documents where employee status is 'Active' */}
      </div>

      <Card className="shadow-sm border overflow-hidden mt-8">
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
                      {formatLongDate(cert.createdAt)}
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-bold hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
                          onClick={() => handleEdit(cert)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-destructive hover:text-white" onClick={() => handleDelete(cert.id)}>
                          <Trash2 className="h-4 w-4" />
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

      {editingCert && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Request</DialogTitle>
              <DialogDescription>
                Make changes to the document request here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeName" className="text-right">
                  Name
                </Label>
                <Input
                  id="employeeName"
                  value={editingCert.employeeName}
                  onChange={(e) => setEditingCert({ ...editingCert, employeeName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="certificateType" className="text-right">
                  Doc Type
                </Label>
                <Select
                  value={editingCert.certificateType}
                  onValueChange={(v) => setEditingCert({ ...editingCert, certificateType: v })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Position
                </Label>
                <Select
                  value={editingCert.position}
                  onValueChange={(v) => setEditingCert({ ...editingCert, position: v })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales Development Representative">Sales Development Representative</SelectItem>
                    <SelectItem value="Client Service Manager">Client Service Manager</SelectItem>
                    <SelectItem value="IT Tech Support">IT Tech Support</SelectItem>
                    <SelectItem value="OJT">OJT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                 <Select
                  value={editingCert.department}
                  onValueChange={(v) => setEditingCert({ ...editingCert, department: v })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North America (NAM)">North America (NAM)</SelectItem>
                    <SelectItem value="Asia Pacific (APAC)">Asia Pacific (APAC)</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="General Services (GenServ)">General Services (GenServ)</SelectItem>
                    <SelectItem value="IT Dept.">IT Dept.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeAddress" className="text-right">
                  Address
                </Label>
                <Input
                  id="employeeAddress"
                  value={editingCert.employeeAddress}
                  onChange={(e) => setEditingCert({ ...editingCert, employeeAddress: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-2 items-center gap-2 col-span-1">
                  <Label htmlFor="startDate" className="text-right">Start</Label>
                  <Input id="startDate" type="date" value={editingCert.startDate} onChange={(e) => setEditingCert({ ...editingCert, startDate: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 items-center gap-2 col-span-1">
                  <Label htmlFor="endDate" className="text-right">End</Label>
                  <Input id="endDate" type="date" value={editingCert.endDate} onChange={(e) => setEditingCert({ ...editingCert, endDate: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employmentStatus" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingCert.employmentStatus}
                  onValueChange={(v) => setEditingCert({ ...editingCert, employmentStatus: v })}
                >
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purposeOfCertificate" className="text-right">
                  Purpose
                </Label>
                <Input
                  id="purposeOfCertificate"
                  value={editingCert.purposeOfCertificate}
                  onChange={(e) => setEditingCert({ ...editingCert, purposeOfCertificate: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
