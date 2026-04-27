import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HandHeart, Github, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInValues = z.infer<typeof signInSchema>;

import { useAuth } from "@/hooks/useAuth";

export function SignInPage() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function onGoogleSignIn() {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome back!");
      // Logic handled by auth state observer in useAuth
    } catch (error) {
      toast.error("Sign in failed.");
    } finally {
      setIsLoading(false);
    }
  }

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInValues) {
    toast.info("Please use Google Sign-In for the beta.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0F172A] overflow-hidden relative">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14B8A6]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <Card className="w-full max-w-md relative z-10 bento-panel border-white/5 bg-slate-900/60 text-white shadow-2xl">
        <CardHeader className="text-center pb-10 pt-8">
          <div className="mx-auto w-14 h-14 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-2xl flex items-center justify-center mb-6 glow-teal">
            <HandHeart className="text-[#14B8A6] h-8 w-8" />
          </div>
          <CardTitle className="text-4xl font-display font-black tracking-tighter leading-none mb-2">Welcome <span className="text-[#14B8A6]">Back</span></CardTitle>
          <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Authenticating identity node...</CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Identity Endpoint</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-[#14B8A6] transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@domain.com" 
                  {...form.register("email")}
                  className="bg-slate-950/50 border-slate-800 focus:border-[#14B8A6]/50 text-white pl-12 h-12 rounded-xl transition-all font-sans"
                />
              </div>
              {form.formState.errors.email && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{form.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest text-slate-500">Security Phrase</Label>
                <Link to="/auth/forgot-password" className="text-[10px] text-[#14B8A6] hover:text-white transition-colors font-black uppercase tracking-widest">
                  Override Key?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-[#14B8A6] transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="bg-slate-950/50 border-slate-800 focus:border-[#14B8A6]/50 text-white pl-12 h-12 rounded-xl transition-all font-sans"
                />
              </div>
              {form.formState.errors.password && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{form.formState.errors.password.message}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 text-sm font-black bg-[#14B8A6] hover:bg-teal-600 text-slate-900 rounded-xl transition-all shadow-xl shadow-teal-500/10 active:scale-95 uppercase tracking-widest mt-4">
              {isLoading ? "SYNCING..." : "ENTER NETWORK →"}
            </Button>
          </form>

          <div className="mt-10 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800/50" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase">
              <span className="bg-slate-900 px-4 text-slate-600 font-black tracking-[0.3em]">External Protocols</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 pb-8">
            <Button 
                variant="outline" 
                className="bg-slate-950/50 border-slate-800 hover:border-[#14B8A6]/50 text-slate-200 h-12 rounded-xl transition-all"
                onClick={onGoogleSignIn}
                disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="bg-slate-950/50 border-slate-800 hover:border-white/20 text-slate-200 h-12 rounded-xl transition-all">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-white/5 py-8 bg-black/20">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            New to the grid?{" "}
            <Link to="/auth/signup" className="text-[#14B8A6] hover:text-white transition-colors ml-1">
              Initialize Access
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
