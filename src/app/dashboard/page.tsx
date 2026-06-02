"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Zap, 
  Users, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Loader2,
  Eye,
  FileText,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, limit, orderBy, where } from "firebase/firestore"
import { useMemoFirebase } from "@/firebase/firestore/use-memo-firebase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function DashboardPage() {
  const db = useFirestore()
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  const certificatesQuery = useMemoFirebase(() => {
    if (!db) return null
    return collection(db, "certificates")
  }, [db])

  const employeesQuery = useMemoFirebase(() => {
    if (!db) return null
    return collection(db, "employees")
  }, [db])

  const waitingQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "certificates"), where("status", "==", "Pending"))
  }, [db])

  const recentActivitiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "certificates"), orderBy("createdAt", "desc"), limit(5))
  }, [db])

  const { data: certificates, loading: loadingCerts } = useCollection(certificatesQuery)
  const { data: employees, loading: loadingEmps } = useCollection(employeesQuery)
  const { data: waiting, loading: loadingWaiting } = useCollection(waitingQuery)
  const { data: recentCerts, loading: loadingRecent } = useCollection(recentActivitiesQuery)

  const stats = [
    {
      title: "Drafts Ready",
      value: certificates?.length ?? 0,
      loading: loadingCerts,
      change: "Total documents in vault",
      icon: Zap,
      href: "/dashboard/certificates"
    },
    {
      title: "Team Size",
      value: employees?.length ?? 0,
      loading: loadingEmps,
      change: "Registered team members",
      icon: Users,
      href: "/dashboard/employees"
    },
    {
      title: "Waiting",
      value: waiting?.length ?? 0,
      loading: loadingWaiting,
      change: "Pending HR approval",
      icon: Clock,
      href: "/dashboard/approvals"
    },
    {
      title: "Efficiency",
      value: "100%",
      loading: false,
      change: "Instant generation speed",
      icon: TrendingUp,
      href: "/dashboard/logs"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-headline font-bold text-foreground tracking-tight">
            Performance <span className="text-primary">Hub</span>
          </h2>
          <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Real-time HR Operations Overview</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="h-12 font-bold px-6 bg-primary text-primary-foreground transition-all shadow-none">
            <Link href="/dashboard/certificates/new">
              <Zap className="mr-2 h-4 w-4 fill-current" />
              Quick Draft
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="group">
            <Card className="bg-card hover:bg-primary transition-all duration-300 cursor-pointer h-full border-border hover:border-primary shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 group-hover:text-primary-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary group-hover:text-white transition-colors duration-300" />
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <div className="h-9 w-12 bg-foreground/10 animate-pulse rounded" />
                ) : (
                  <div className="text-4xl font-bold font-headline group-hover:text-primary-foreground transition-colors duration-300">
                    {stat.value}
                  </div>
                )}
                <p className="text-[10px] font-bold uppercase mt-2 opacity-50 group-hover:opacity-80 group-hover:text-primary-foreground transition-colors duration-300">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="shadow-none">
        <CardHeader className="border-b bg-muted/30 pb-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="font-headline font-bold text-2xl">Activity Stream</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {loadingRecent ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            ) : recentCerts && recentCerts.length > 0 ? (
              recentCerts.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between bg-muted/50 p-4 border border-transparent rounded-lg hover:border-primary/20 hover:bg-muted transition-all">
                  <div>
                    <p className="text-sm font-bold uppercase">{activity.certificateType}</p>
                    <p className="text-[10px] font-bold opacity-60 uppercase">{activity.employeeName} • {activity.status || "Pending"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="hover:bg-primary hover:text-primary-foreground shadow-none"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/dashboard/certificates`}><ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-40 italic">
                No recent activity to show.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto shadow-none">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" />
              <DialogTitle className="font-headline font-bold text-2xl uppercase">Document Context</DialogTitle>
            </div>
            <DialogDescription className="font-bold opacity-60 uppercase text-[10px] tracking-widest">
              Reviewing {selectedActivity?.certificateType} for {selectedActivity?.employeeName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="bg-muted p-8 rounded-lg min-h-[200px] whitespace-pre-wrap font-medium leading-relaxed">
              {selectedActivity?.narrative || "No narrative text available for this activity."}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => setSelectedActivity(null)}
              className="font-bold shadow-none"
            >
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}