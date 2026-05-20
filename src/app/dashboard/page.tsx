
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Zap, 
  Users, 
  Clock, 
  TrendingUp, 
  MoreHorizontal,
  FilePlus,
  ArrowRight,
  Loader2
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

  const { data: certificates, loading: loadingCerts } = useCollection(certificatesQuery)
  const { data: employees, loading: loadingEmps } = useCollection(employeesQuery)
  const { data: recentCerts, loading: loadingRecent } = useCollection(recentActivitiesQuery)

  const stats = [
    {
      title: "Drafts Ready",
      value: certificates?.length ?? 0,
      loading: loadingCerts,
      change: "Total certificates generated",
      icon: Zap,
      color: "text-foreground",
    },
    {
      title: "Team Size",
      value: employees?.length ?? 0,
      loading: loadingEmps,
      change: "Active Records",
      icon: Users,
      color: "text-foreground",
    },
    {
      title: "Waiting",
      value: 0,
      loading: false,
      change: "Pending Approvals",
      icon: Clock,
      color: "text-foreground",
    },
    {
      title: "Efficiency",
      value: "100%",
      loading: false,
      change: "Speed Score",
      icon: TrendingUp,
      color: "text-foreground",
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-headline font-bold text-foreground tracking-tight">Performance Hub</h2>
          <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Real-time HR Operations Overview</p>
        </div>
        <div className="flex gap-3">
           <Button asChild variant="outline" className="rounded-none border-2 border-foreground h-12 font-bold px-6 hover:bg-black hover:text-white transition-colors">
            <Link href="/dashboard/employees">
              Browse Hub
            </Link>
          </Button>
          <Button asChild className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all h-12 font-bold px-6 bg-primary text-primary-foreground">
            <Link href="/dashboard/certificates/new">
              <Zap className="mr-2 h-4 w-4 fill-current" />
              Quick Draft
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <div className="h-9 w-20 bg-foreground/10 animate-pulse rounded-sm" />
              ) : (
                <div className="text-4xl font-bold font-headline leading-none">{stat.value}</div>
              )}
              <p className="text-[10px] font-bold uppercase mt-2 opacity-50 tracking-tighter">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card">
          <CardHeader className="flex flex-row items-center justify-between border-b border-foreground/10 pb-6 bg-black/5">
            <div>
              <CardTitle className="font-headline font-bold text-2xl">Activity Stream</CardTitle>
              <CardDescription className="font-bold opacity-60">Latest document generations</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="font-bold border-2 border-foreground hover:bg-black hover:text-background rounded-none">
              <Link href="/dashboard/logs">View All Logs</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {loadingRecent ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin opacity-20" />
                </div>
              ) : recentCerts?.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between bg-black/5 p-4 rounded-none border-2 border-transparent hover:border-foreground transition-all cursor-default group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-none bg-primary flex items-center justify-center border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all">
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight">{activity.certificateType}</p>
                      <p className="text-[10px] font-bold opacity-60 uppercase">{activity.employeeName} • {activity.createdAt?.toDate().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-none border-2 border-foreground bg-primary text-primary-foreground">
                      Stored
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black hover:text-background rounded-none border border-transparent hover:border-foreground">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!loadingRecent && recentCerts?.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-foreground/10">
                  <p className="text-sm font-bold opacity-40 uppercase tracking-widest">No Recent Activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-2 border-foreground bg-black text-background shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] rounded-none">
            <CardHeader>
              <CardTitle className="font-headline font-bold text-2xl uppercase tracking-tighter">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-background text-foreground hover:bg-primary border-2 border-foreground font-bold h-14 rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                <Link href="/dashboard/certificates/new">
                  <FilePlus className="mr-2 h-5 w-5" />
                  Draft New Document
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-2 border-background bg-transparent text-background hover:bg-white hover:text-black font-bold h-14 rounded-none transition-all">
                <Link href="/dashboard/employees/new">
                  <Users className="mr-2 h-5 w-5" />
                  Register Employee
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="bg-primary p-6 rounded-none border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="font-headline font-bold text-xl uppercase tracking-tighter mb-4">Vault Capacity</h4>
            <div className="h-4 w-full bg-black/20 rounded-none overflow-hidden border-2 border-foreground">
              <div 
                className="h-full bg-black transition-all duration-1000" 
                style={{ width: `${Math.min((certificates?.length || 0) * 2, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-widest">
              <span>{certificates?.length || 0} Documents Stored</span>
              <span>Secure Layer 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
