"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useFirestore } from "@/firebase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditEmployeePage() {
  const db = useFirestore()
  const router = useRouter()
  const searchParams = useSearchParams()

  const id = searchParams.get("id")

  const [loading, setLoading] = useState(true)

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    department: "",
    status: "",
    joinDate: "",
  })

  useEffect(() => {
    const loadEmployee = async () => {
      if (!db || !id) return

      try {
        const snap = await getDoc(doc(db, "employees", id))

        if (snap.exists()) {
          setEmployee(snap.data() as any)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadEmployee()
  }, [db, id])

  const handleSave = async () => {
    if (!db || !id) return

    try {
      await updateDoc(doc(db, "employees", id), employee)

      alert("Employee updated!")

      router.push("/dashboard/employees")
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Employee</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-bold">First Name</Label>
              <Input
                id="firstName"
                placeholder="First Name"
                value={employee.firstName}
                onChange={(e) => setEmployee({ ...employee, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-bold">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Last Name"
                value={employee.lastName}
                onChange={(e) => setEmployee({ ...employee, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">Email</Label>
            <Input
              id="email"
              placeholder="Email"
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position" className="font-bold">Position</Label>
              <Input
                id="position"
                placeholder="Position"
                value={employee.position}
                onChange={(e) => setEmployee({ ...employee, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="font-bold">Department</Label>
              <Input
                id="department"
                placeholder="Department"
                value={employee.department}
                onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="font-bold">Employment Status</Label>
            <Select value={employee.status} onValueChange={(v) => setEmployee({ ...employee, status: v })}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="On Leave">Probationary</SelectItem>
                <SelectItem value="Resigned">Resigned</SelectItem>
                <SelectItem value="End of Contract">End of Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}