"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, MoreHorizontal, Loader2, Mail, Copy, Edit, Trash2 } from "lucide-react"
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
          <h2 className="text-4xl font-headline font-bold tracking-tight">Employee Insight Hub</h2>
          <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Manage your centralized employee database</p>
        </div>
        <Button asChild className="rounded-none border-2 border-foreground active:translate-x-1 active:translate-y-1 transition-all h-12 font-bold shadow-none">
          <Link href="/dashboard/employees/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>

      <Card className="border-2 border-foreground bg-card overflow-hidden shadow-none">
        <CardHeader className="border-b border-foreground/10 pb-6 bg-black/5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search employees by name, position or department..." 
                className="pl-10 border-2 border-foreground/20 focus:border-foreground rounded-none h-12 shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black text-background">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-bold text-background uppercase text-xs">Full Name</TableHead>
                <TableHead className="font-bold text-background uppercase text-xs">Position</TableHead>
                <TableHead className="font-bold text-background uppercase text-xs">Department</TableHead>
                <TableHead className="font-bold text-background uppercase text-xs">Status</TableHead>
                <TableHead className="font-bold text-background uppercase text-xs">Join Date</TableHead>
                <TableHead className="text-right font-bold text-background uppercase text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto opacity-20" />
                    <p className="mt-4 font-bold opacity-30 uppercase text-xs">Syncing team records...</p>
                  </TableCell>
                </TableRow>
              ) : filteredEmployees && filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-primary/5 border-b border-foreground/5">
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
                      <Badge variant="outline" className="rounded-none border-foreground/20 font-bold uppercase text-[10px]">
                        {emp.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`rounded-none border-2 border-foreground font-bold shadow-none ${
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
                          <Button variant="ghost" size="icon" className="hover:bg-black hover:text-background border border-transparent hover:border-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-none border-2 border-foreground shadow-none">
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
