"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Zap, Activity, Clock, User, Loader2 } from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"

export default function LogsPage() {
  const db = useFirestore()

  const certificatesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "certificates"), orderBy("createdAt", "desc"), limit(50))
  }, [db])

  const employeesQuery = useMemoFirebase(() => {
    if (!db) return null
    return collection(db, "employees")
  }, [db])

  const { data: certificates, loading: loadingCerts } = useCollection(certificatesQuery)
  const { data: employees, loading: loadingEmps } = useCollection(employeesQuery)

  const stats = [
    { 
      id: "events", 
      title: "Total Events", 
      value: loadingCerts ? "..." : (certificates?.length || 0), 
      icon: Activity 
    },
    { 
      id: "users", 
      title: "Active Employees", 
      value: loadingEmps ? "..." : (employees?.length || 0), 
      icon: User 
    },
    { 
      id: "uptime", 
      title: "System Health", 
      value: "99.9%", 
      icon: Clock 
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-headline font-bold tracking-tight">System Activity</h2>
        <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Audit trail and system logs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.id} className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card overflow-hidden">
        <CardHeader className="border-b border-foreground/10 bg-black text-background">
          <CardTitle className="font-headline font-bold text-2xl">Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/5">
              <TableRow className="hover:bg-transparent border-b-2 border-foreground/10">
                <TableHead className="font-bold text-foreground">Action</TableHead>
                <TableHead className="font-bold text-foreground">Target Employee</TableHead>
                <TableHead className="font-bold text-foreground">Date</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground">Document Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingCerts ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto opacity-20" />
                    <p className="mt-2 font-bold opacity-20 uppercase text-xs">Streaming logs...</p>
                  </TableCell>
                </TableRow>
              ) : (
                certificates?.map((log) => (
                  <TableRow key={log.id} className="hover:bg-primary/5 border-b border-foreground/5">
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 fill-primary" />
                        Draft Generated
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.employeeName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.createdAt?.toDate().toLocaleString() || "Just now"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="rounded-none border-2 border-foreground font-bold">
                        Success
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm italic font-medium">{log.certificateType}</TableCell>
                  </TableRow>
                ))
              )}
              {!loadingCerts && certificates?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 opacity-40 italic">
                    No activity recorded yet.
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
