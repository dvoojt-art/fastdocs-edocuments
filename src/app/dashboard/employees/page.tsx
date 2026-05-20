
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Filter, MoreHorizontal } from "lucide-react"

const employees = [
  { id: "EMP001", name: "Alice Johnson", position: "Software Engineer", dept: "Engineering", status: "Active", joinDate: "Jan 12, 2022" },
  { id: "EMP002", name: "Bob Smith", position: "Product Manager", dept: "Product", status: "Active", joinDate: "Mar 05, 2021" },
  { id: "EMP003", name: "Charlie Brown", position: "HR Specialist", dept: "Human Resources", status: "Active", joinDate: "Oct 22, 2023" },
  { id: "EMP004", name: "Diana Prince", position: "UX Designer", dept: "Product", status: "On Leave", joinDate: "Feb 15, 2022" },
  { id: "EMP005", name: "Edward Norton", position: "DevOps Engineer", dept: "Engineering", status: "Active", joinDate: "Jun 11, 2020" },
  { id: "EMP006", name: "Fiona Apple", position: "Marketing Director", dept: "Marketing", status: "Active", joinDate: "Aug 30, 2019" },
]

export default function EmployeesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold">Employee Insight Hub</h2>
          <p className="text-muted-foreground">Manage your centralized employee database.</p>
        </div>
        <Button className="rounded-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search employees by name, ID or department..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-mono text-xs font-semibold">{emp.id}</TableCell>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.dept}</TableCell>
                  <TableCell>
                    <Badge variant={emp.status === 'Active' ? 'default' : 'secondary'} className="rounded-full px-3">
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{emp.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
