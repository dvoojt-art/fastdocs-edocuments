"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Zap, 
  Users, 
  Clock, 
  TrendingUp, 
  MoreHorizontal,
  FilePlus,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, limit, orderBy } from "firebase/firestore"
import { useMemoFirebase } from "@/firebase/firestore/use-memo-firebase"

export default function DashboardPage() {
  const db = useFirestore()

  const certificatesQuery = useMemoFirebase(() => {
    if (!db) return null
    return collection(db, "certificates")
  }, [db])

  const employeesQuery = useMemoFirebase(() => {
    if (!db) return null
    return collection(db, "employees")
  }, [db])

  const recentActivitiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "certificates"), orderBy("createdAt", "desc"), limit(5))
  }, [db])

  const { data: certificates } = useCollection(certificatesQuery)
  const { data: employees } = useCollection(employeesQuery)
  const { data: recentCerts } = useCollection(recentActivitiesQuery)

  const stats = [
    {
      title: "Drafts Ready",
      value: certificates?.length || 0,
      change: "Total certificates generated",
      icon: Zap,
      color: "text-foreground",
      bgColor: "bg-black/5"
    },
    {
      title: "Team Size",
      value: employees?.length || 0,
      change: "Active Employees",
      icon: Users,
      color: "text-foreground",
      bgColor: "bg-black/5"
    },
    {
      title: "Waiting",
      value: "0",
      change: "Pending Approvals",
      icon: Clock,
      color: "text-foreground",
      bgColor: "bg-black/5"
    },
    {
      title: "Speed",
      value: "100%",
      change: "Efficiency Score",
      icon: TrendingUp,
      color: "text-foreground",
      bgColor: "bg-black/5"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-headline font-bold text-foreground tracking-tight">Welcome, HR Lead</h2>
          <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">FastDocs Performance Overview</p>
        </div>
        <Button asChild className="rounded-full font-bold h-12 px-6">
          <Link href="/dashboard/certificates/new">
            <Zap className="mr-2 h-4 w-4 fill-current" />
            Quick Draft Document
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-headline">{stat.value}</div>
              <p className="text-[10px] font-bold uppercase mt-1 opacity-50">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-card">
          <CardHeader className="flex flex-row items-center justify-between border-b border-foreground/10 pb-6">
            <div>
              <CardTitle className="font-headline font-bold text-2xl">Recent Stream</CardTitle>
              <CardDescription className="font-bold opacity-60">Real-time system actions</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="font-bold border border-foreground hover:bg-black hover:text-background">
              <Link href="/dashboard/logs">View Logs</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentCerts?.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between bg-black/5 p-4 rounded-lg border border-transparent hover:border-foreground transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center border border-foreground">
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{activity.certificateType}</p>
                      <p className="text-xs font-medium opacity-60">{activity.employeeName} • {activity.createdAt?.toDate().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-foreground bg-primary text-primary-foreground">
                      Done
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black hover:text-background">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {recentCerts?.length === 0 && (
                <p className="text-center py-8 opacity-40 italic">No recent activity found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-2 border-foreground bg-black text-background shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]">
            <CardHeader>
              <CardTitle className="font-headline font-bold text-2xl">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-background text-foreground hover:bg-primary border-2 border-transparent font-bold h-12">
                <Link href="/dashboard/certificates/new">
                  <FilePlus className="mr-2 h-4 w-4" />
                  New Certificate
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-2 border-background bg-transparent text-background hover:bg-white hover:text-black font-bold h-12">
                <Link href="/dashboard/employees/new">
                  <Users className="mr-2 h-4 w-4" />
                  Add Employee
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="bg-primary p-6 rounded-xl border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="font-headline font-bold text-lg mb-2">Vault Usage</h4>
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-foreground">
              <div className="h-full bg-black w-[15%]"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-bold">
              <span>15% Capacity</span>
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
