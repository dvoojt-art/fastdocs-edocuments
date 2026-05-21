"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, MoreHorizontal, Loader2, Mail, Copy, Edit, Trash2, Users } from "lucide-react"
import Link from "next/link"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, doc, deleteDoc } from "firebase/firestore"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function EmployeesPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  const employeesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "employees"), orderBy("lastName", "asc"))
  }, [db])

  const { data: employees, loading } = useCollection(employeesQuery)

  const filteredEmployees = employees?.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatLongDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    toast({
      title: "Email Copied",
      description: "Work email copied to clipboard.",
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!db) return
    const docRef = doc(db, "employees", id)
    deleteDoc(docRef)
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: "delete"
        })
        errorEmitter.emit("permission-error", permissionError)
      })
    
    toast({
      title: "Record Deleted",
      description: `Employee ${name} has been removed from the hub.`,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-headline font-bold tracking-tight">
            Employee Insight <span className="text-primary">Hub</span>
          </h2>
          <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Manage your centralized employee database</p>
        </div>
        <Button asChild className="h-12 font-bold px-6 bg-primary text-primary-foreground transition-all shadow-none">
          <Link href="/dashboard/employees/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>

      <Card className="shadow-none border overflow-hidden">
        <CardHeader className="border-b bg-muted/30 pb-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div className="relative flex-1 max-w-md ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search team members..." 
                className="pl-10 h-10 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="font-bold uppercase text-[10px] tracking-wider">Full Name</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-wider">Position</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-wider">Department</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-wider">Status</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-wider">Join Date</TableHead>
                <TableHead className="text-right font-bold uppercase text-[10px] tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto opacity-20" />
                    <p className="mt-4 font-bold opacity-30 uppercase text-[10px] tracking-widest">Syncing team records...</p>
                  </TableCell>
                </TableRow>
              ) : filteredEmployees && filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold">{emp.firstName} {emp.lastName}</span>
                        <span className="text-[10px] opacity-50 font-medium flex items-center gap-1">
                          <Mail className="h-2 w-2" /> {emp.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{emp.position}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-bold text-[10px] uppercase">
                        {emp.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`font-bold ${
                          emp.status === 'Active' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {formatLongDate(emp.joinDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="font-bold cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyEmail(emp.email)} className="font-bold cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" /> Copy Email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)} className="font-bold cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 opacity-40 italic">
                    {searchTerm ? "No employees match your search criteria." : "No employees found in the database."}
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
