'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  // REGISTER
  const handleRegister = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password to register.",
        variant: "destructive",
      });
      return;
    }

    if (!email.toLowerCase().endsWith('@callboxinc.com')) {
      toast({
        title: "Unauthorized Domain",
        description: "Registration is restricted to @callboxinc.com email addresses.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description: "Your account has been created. Redirecting to your dashboard...",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const handleLogin = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Credentials Required",
        description: "Please enter your email and password to sign in.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting...",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0 opacity-20">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-[#0f326e]/10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Upper Center Blue Logo Section */}
        <div className="bg-[#0f326e] py-10 rounded-t-3xl flex flex-col items-center justify-center shadow-xl border-b border-white/10">
          <Link href="/" className="flex flex-col items-center group">
            <div className="flex items-center gap-3">
              <div className="bg-primary h-12 w-12 rounded-full flex items-center justify-center text-primary-foreground font-headline font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                F
              </div>
              <span className="font-headline font-bold text-3xl tracking-tight text-white">FastDocs</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mt-2">Callbox Inc. Davao</span>
          </Link>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden rounded-t-none">
          <CardHeader className="space-y-1 pb-6 text-center bg-muted/20">
            <CardTitle className="text-3xl font-headline font-bold uppercase tracking-tight">Portal Access</CardTitle>
            <CardDescription className="font-bold opacity-60 uppercase text-[15px] tracking-widest">Sign in or register your account</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-[12px] uppercase">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@callboxinc.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 shadow-none border-2 focus-visible:ring-primary"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold text-[12px] uppercase">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 shadow-none border-2 focus-visible:ring-primary"
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-14 bg-primary text-primary-foreground font-bold text-lg rounded-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Login'}
                  </button>
                  <Button 
                    type="button" 
                    onClick={handleRegister}
                    variant="outline"
                    className="h-14 font-bold text-lg shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] border-2 border-primary text-primary hover:bg-primary/5" 
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                    Register
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t bg-muted/30 p-6">
            <Link href="/" className="text-[15px] font-bold uppercase opacity-40 hover:opacity-100 transition-opacity text-center w-full">
              Back to Home page
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
