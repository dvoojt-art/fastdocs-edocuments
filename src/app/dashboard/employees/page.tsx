
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Filter, MoreHorizontal, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { useState } from "react"

export default function EmployeesPage() {
  const db = useFirestore()
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-headline font-bold tracking-tight">Employee Insight Hub</h2>
          <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Manage your centralized employee database</p>
        </div>
        <Button asChild className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all h-12 font-bold">
          <Link href="/dashboard/employees/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>

      <Card className="border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card overflow-hidden">
        <CardHeader className="border-b border-foreground/10 pb-6 bg-black/5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search employees by name, position or department..." 
                className="pl-10 border-2 border-foreground/20 focus:border-foreground rounded-none h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-2 border-foreground font-bold h-12 rounded-none">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black text-background">
              <TableRow className="hover:bg-transparent">
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
                        className={`rounded-none border-2 border-foreground font-bold ${
                          emp.status === 'Active' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {emp.joinDate || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:bg-black hover:text-background border border-transparent hover:border-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
