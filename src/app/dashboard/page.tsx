
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Zap, 
  Users, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, limit, orderBy, where } from "firebase/firestore"
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
    },
    {
      title: "Team Size",
      value: employees?.length ?? 0,
      loading: loadingEmps,
      change: "Registered team members",
      icon: Users,
    },
    {
      title: "Waiting",
      value: waiting?.length ?? 0,
      loading: loadingWaiting,
      change: "Pending HR approval",
      icon: Clock,
    },
    {
      title: "Efficiency",
      value: "100%",
      loading: false,
      change: "Instant generation speed",
      icon: TrendingUp,
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
          <Card key={i} className="border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <div className="h-9 w-12 bg-foreground/10 animate-pulse" />
              ) : (
                <div className="text-4xl font-bold font-headline">{stat.value}</div>
              )}
              <p className="text-[10px] font-bold uppercase mt-2 opacity-50">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card">
        <CardHeader className="border-b border-foreground/10 pb-6 bg-black/5">
          <CardTitle className="font-headline font-bold text-2xl">Activity Stream</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {loadingRecent ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
            ) : recentCerts?.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between bg-black/5 p-4 border-2 border-transparent hover:border-foreground transition-all">
                <div>
                  <p className="text-sm font-bold uppercase">{activity.certificateType}</p>
                  <p className="text-[10px] font-bold opacity-60 uppercase">{activity.employeeName} • {activity.status || "Pending"}</p>
                </div>
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/certificates`}><ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
