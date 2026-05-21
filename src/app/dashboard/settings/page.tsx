"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Building2, Bell, Shield, UserCog, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useDoc } from "@/firebase"
import { doc, setDoc } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function SettingsPage() {
  const { toast } = useToast()
  const db = useFirestore()
  
  const settingsRef = doc(db, "settings", "org-config")
  const { data: settings, loading: loadingSettings } = useDoc(settingsRef)

  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    hrLead: "",
    supportEmail: "",
    autoSaveDrafts: true,
    emailNotifications: false,
    auditTrail: true,
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || "Callbox Davao",
        address: settings.address || "SM Lanang Premier, Davao City, Philippines",
        hrLead: settings.hrLead || "Jane Doe",
        supportEmail: settings.supportEmail || "hr@callbox.com",
        autoSaveDrafts: settings.autoSaveDrafts ?? true,
        emailNotifications: settings.emailNotifications ?? false,
        auditTrail: settings.auditTrail ?? true,
      })
    }
  }, [settings])

  const handleSave = () => {
    if (!db) return
    
    setSaving(true)
    
    setDoc(settingsRef, formData, { merge: true })
      .then(() => {
        toast({
          title: "Settings Saved",
          description: "Your system configurations have been updated successfully.",
        })
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: settingsRef.path,
          operation: "write",
          requestResourceData: formData,
        })
        errorEmitter.emit("permission-error", permissionError)
      })
      .finally(() => {
        setSaving(false)
      })
  }

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin opacity-20" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-4xl font-headline font-bold tracking-tight">System Settings</h2>
        <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Configure FastDocs for your organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <nav className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start font-bold bg-primary text-primary-foreground border-transparent shadow-sm">
              <Building2 className="mr-2 h-4 w-4" />
              Organization
            </Button>
            <Button variant="ghost" className="justify-start font-bold">
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </Button>
            <Button variant="ghost" className="justify-start font-bold">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button variant="ghost" className="justify-start font-bold">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </Button>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border">
            <CardHeader className="bg-primary/10 border-b p-6">
              <CardTitle className="font-headline font-bold text-xl uppercase">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="font-bold text-xs uppercase">Organization Name</Label>
                <Input 
                  id="companyName" 
                  value={formData.companyName} 
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="h-12" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="font-bold text-xs uppercase">Office Address</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="h-12" 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hrLead" className="font-bold text-xs uppercase">HR Lead Name</Label>
                  <Input 
                    id="hrLead" 
                    value={formData.hrLead} 
                    onChange={(e) => setFormData({...formData, hrLead: e.target.value})}
                    className="h-12" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-xs uppercase">Support Email</Label>
                  <Input 
                    id="email" 
                    value={formData.supportEmail} 
                    onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                    className="h-12" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border">
            <CardHeader className="p-6">
              <CardTitle className="font-headline font-bold text-xl uppercase">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-bold text-sm">Auto-Save Drafts</Label>
                  <p className="text-xs opacity-60 font-medium">Automatically save generated narratives to your vault.</p>
                </div>
                <Switch 
                  checked={formData.autoSaveDrafts} 
                  onCheckedChange={(checked) => setFormData({...formData, autoSaveDrafts: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-bold text-sm">Email Notifications</Label>
                  <p className="text-xs opacity-60 font-medium">Send an email alert whenever a document is generated.</p>
                </div>
                <Switch 
                  checked={formData.emailNotifications} 
                  onCheckedChange={(checked) => setFormData({...formData, emailNotifications: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-bold text-sm">Audit Trail</Label>
                  <p className="text-xs opacity-60 font-medium">Keep a detailed record of all document activities for compliance.</p>
                </div>
                <Switch 
                  checked={formData.auditTrail} 
                  onCheckedChange={(checked) => setFormData({...formData, auditTrail: checked})}
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-8 border-t">
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="w-full h-14 font-bold text-lg shadow-sm hover:shadow-md transition-all"
              >
                {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}