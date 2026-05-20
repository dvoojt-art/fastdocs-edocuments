
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileCheck, 
  Users, 
  Clock, 
  TrendingUp, 
  MoreHorizontal,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
  {
    title: "Documents Generated",
    value: "1,250",
    change: "+12% from last month",
    icon: FileCheck,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Active Employees",
    value: "432",
    change: "3 new this week",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    title: "Pending Approvals",
    value: "18",
    change: "Requires action",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    title: "Efficiency Rate",
    value: "95%",
    change: "+4% vs manual",
    icon: TrendingUp,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100"
  }
]

const recentActivities = [
  {
    id: 1,
    action: "COE Generated",
    user: "Robert Fox",
    time: "2 minutes ago",
    status: "Completed"
  },
  {
    id: 2,
    action: "Profile Updated",
    user: "Esther Howard",
    time: "45 minutes ago",
    status: "Completed"
  },
  {
    id: 3,
    action: "Clearance Requested",
    user: "Cody Fisher",
    time: "1 hour ago",
    status: "Pending Approval"
  },
  {
    id: 4,
    action: "Bulk Document Batch",
    user: "HR System",
    time: "3 hours ago",
    status: "Processing"
  }
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-bold text-foreground">Welcome back, HR Team</h2>
        <p className="text-muted-foreground mt-1">Here's a summary of document generation activity today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Recent Activity</CardTitle>
              <CardDescription>Live log of system interactions</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All Logs</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <FileCheck className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      activity.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                      activity.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.status}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription className="text-primary-foreground/70">Common workflows for HR admins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full bg-white text-primary hover:bg-white/90">
              <Link href="/dashboard/certificates/new">
                <FilePlus className="mr-2 h-4 w-4" />
                Generate New Certificate
              </Link>
            </Button>
            <Button variant="secondary" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Add New Employee
            </Button>
            <Button variant="secondary" className="w-full">
              <Clock className="mr-2 h-4 w-4" />
              Review Approvals
            </Button>
          </CardContent>
          <div className="px-6 pb-6 pt-2">
            <div className="rounded-xl bg-white/10 p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">STORAGE USAGE</span>
                <span className="text-xs">74%</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/4"></div>
              </div>
              <p className="text-[10px] mt-2 text-white/60">Cloud vault encrypted and secure.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
