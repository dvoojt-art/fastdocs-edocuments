"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function NewEmployeePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    department: "",
    status: "Active",
    joinDate: "",
    email: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.position) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    // Simulate API call/Firestore write
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Employee Added",
        description: `${formData.firstName} ${formData.lastName} has been registered successfully.`,
      })
      router.push("/dashboard/employees")
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="border-2 border-foreground hover:bg-black hover:text-background rounded-none">
          <Link href="/dashboard/employees">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-headline font-bold tracking-tight">Add New Employee</h2>
          <p className="font-bold opacity-60 uppercase text-[10px] tracking-widest">Register a new team member to the hub</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card">
          <CardHeader className="bg-primary border-b border-foreground p-6">
            <CardTitle className="font-headline font-bold text-xl uppercase">Employee Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-bold text-xs uppercase">First Name*</Label>
                <Input 
                  id="firstName" 
                  placeholder="e.g. Juan" 
                  className="border-2 border-foreground h-12 rounded-none focus:ring-0"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-bold text-xs uppercase">Last Name*</Label>
                <Input 
                  id="lastName" 
                  placeholder="e.g. Dela Cruz" 
                  className="border-2 border-foreground h-12 rounded-none focus:ring-0"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-xs uppercase">Work Email*</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="juan@callbox.com" 
                className="border-2 border-foreground h-12 rounded-none focus:ring-0"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="position" className="font-bold text-xs uppercase">Position*</Label>
                <Input 
                  id="position" 
                  placeholder="e.g. Sales Specialist" 
                  className="border-2 border-foreground h-12 rounded-none focus:ring-0"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dept" className="font-bold text-xs uppercase">Department</Label>
                <Select 
                  value={formData.department}
                  onValueChange={(v) => setFormData({...formData, department: v})}
                >
                  <SelectTrigger className="border-2 border-foreground h-12 rounded-none">
                    <SelectValue placeholder="Select dept" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-foreground rounded-none">
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="joinDate" className="font-bold text-xs uppercase">Join Date</Label>
                <Input 
                  id="joinDate" 
                  type="date"
                  className="border-2 border-foreground h-12 rounded-none focus:ring-0"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="font-bold text-xs uppercase">Employment Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(v) => setFormData({...formData, status: v})}
                >
                  <SelectTrigger className="border-2 border-foreground h-12 rounded-none">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-foreground rounded-none">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Probationary">Probationary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-black/5 p-8 border-t border-foreground/10">
            <Button 
              type="submit"
              className="w-full h-14 font-bold text-lg rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all" 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
              Save Employee Record
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}