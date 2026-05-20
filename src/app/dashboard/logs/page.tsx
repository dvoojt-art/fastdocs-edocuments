"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Zap, Activity, Clock, User } from "lucide-react"

const logs = [
  { id: 1, action: "Certificate Drafted", user: "Jane Doe (Admin)", time: "2m ago", status: "Success", details: "COE for Alice Johnson" },
  { id: 2, action: "Employee Added", user: "Jane Doe (Admin)", time: "45m ago", status: "Success", details: "Added Charlie Brown" },
  { id: 3, action: "Signature Requested", user: "Robert Fox", time: "1h ago", status: "Pending", details: "Clearance for Diana Prince" },
  { id: 4, action: "Login Attempt", user: "System", time: "2h ago", status: "Success", details: "Admin login successful" },
  { id: 5, action: "Certificate Export", user: "Jane Doe (Admin)", time: "3h ago", status: "Success", details: "PDF Export: EMP001" },
  { id: 6, action: "Profile Updated", user: "Bob Smith", time: "5h ago", status: "Success", details: "Changed contact information" },
  { id: 7, action: "Database Backup", user: "System", time: "12h ago", status: "Success", details: "Daily automated backup" },
]

export default function LogsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-headline font-bold tracking-tight">System Activity</h2>
        <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Audit trail and system logs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60">Total Events</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,429</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60">Active Users</CardTitle>
            <User className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60">Uptime</CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">99.9%</div>
          </CardContent>
        </Card>
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
                <TableHead className="font-bold text-foreground">User</TableHead>
                <TableHead className="font-bold text-foreground">Time</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-primary/5 border-b border-foreground/5">
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 fill-primary" />
                      {log.action}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell className="text-muted-foreground">{log.time}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'Success' ? 'default' : 'secondary'} className="rounded-none border-2 border-foreground font-bold">
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm italic">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}