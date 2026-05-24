'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Registered:", userCredential.user);
        alert("Registration Success");
        router.push("/dashboard");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in:", userCredential.user);
        alert("Login Success");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      alert(error.code + " : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Background decorations matching the landing page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0 opacity-20">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-[#0f326e]/10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary h-12 w-12 rounded-full flex items-center justify-center text-primary-foreground font-headline font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
              F
            </div>
            <span className="font-headline font-bold text-3xl tracking-tight text-[#0f326e]">FastDocs</span>
          </Link>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-3xl font-headline font-bold uppercase tracking-tight">
              {isRegistering ? 'Create Account' : 'Portal Access'}
            </CardTitle>
            <CardDescription className="font-bold opacity-60 uppercase text-[10px] tracking-widest">
              {isRegistering ? 'Register your HR administrator profile' : 'Sign in to the HR management console'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-[10px] uppercase">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@callbox.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 shadow-none"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold text-[10px] uppercase">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 shadow-none"
                  required 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 font-bold text-lg shadow-none mt-4 transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isRegistering ? (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Register Account
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In to Console
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t bg-muted/30 p-6">
            <Button 
              variant="ghost" 
              className="w-full font-bold opacity-60 hover:opacity-100 h-10 shadow-none"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register here'}
            </Button>
            <Link href="/" className="text-[10px] font-bold uppercase opacity-40 hover:opacity-100 transition-opacity text-center w-full">
              Back to landing page
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}