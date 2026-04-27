import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HandHeart, Building2, Github } from "lucide-react";
import { toast } from "sonner";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["VOLUNTEER", "NGO_MANAGER"]),
});

type SignUpValues = z.infer<typeof signUpSchema>;

import { useAuth } from "@/hooks/useAuth";

export function SignUpPage() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"VOLUNTEER" | "NGO_MANAGER">("VOLUNTEER");

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "VOLUNTEER",
    },
  });

  async function onGoogleSignUp() {
    setIsLoading(true);
    try {
      await signInWithGoogle(role);
      toast.success("Welcome to ResourceMap!");
      navigate(role === "VOLUNTEER" ? "/dashboard/volunteer" : "/dashboard/ngo");
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Disable standard form for now to focus on Google Auth
  async function onSubmit(data: SignUpValues) {
    toast.info("Please use Google Sign-In for the beta.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0F172A] overflow-hidden relative">
      {/* Decorative glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#14B8A6]/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <Card className="w-full max-w-md relative z-10 bento-panel border-white/5 bg-slate-900/60 text-white shadow-2xl">
        <CardHeader className="text-center pb-8 pt-8">
          <div className="mx-auto w-14 h-14 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-2xl flex items-center justify-center mb-6 glow-teal">
            <HandHeart className="text-[#14B8A6] h-8 w-8" />
          </div>
          <CardTitle className="text-4xl font-display font-black tracking-tighter leading-none mb-2">Create <span className="text-[#14B8A6]">Account</span></CardTitle>
          <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Initializing community access protocol...</CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <div className="mb-8">
            <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1 mb-3 block">Access Tier Selection</Label>
            <Tabs defaultValue="VOLUNTEER" onValueChange={(v) => setRole(v as any)}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
                <TabsTrigger value="VOLUNTEER" className="data-[state=active]:bg-[#14B8A6] data-[state=active]:text-slate-900 data-[state=active]:font-black text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg transition-all">
                  Volunteer
                </TabsTrigger>
                <TabsTrigger value="NGO_MANAGER" className="data-[state=active]:bg-[#F59E0B] data-[state=active]:text-slate-900 data-[state=active]:font-black text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg transition-all">
                  NGO Manager
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Assigned Name</Label>
              <Input 
                id="name" 
                placeholder="Full Name" 
                {...form.register("name")}
                className="bg-slate-950/50 border-slate-800 focus:border-[#14B8A6]/50 text-white h-11 rounded-xl font-sans"
              />
              {form.formState.errors.name && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{form.formState.errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Identity Endpoint</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@domain.com" 
                {...form.register("email")}
                className="bg-slate-950/50 border-slate-800 focus:border-[#14B8A6]/50 text-white h-11 rounded-xl font-sans"
              />
              {form.formState.errors.email && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{form.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Security Phrase</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Min. 8 characters"
                {...form.register("password")}
                className="bg-slate-950/50 border-slate-800 focus:border-[#14B8A6]/50 text-white h-11 rounded-xl font-sans"
              />
              {form.formState.errors.password && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{form.formState.errors.password.message}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className={`w-full h-14 text-sm font-black transition-all shadow-xl active:scale-95 uppercase tracking-widest mt-4 rounded-xl ${role === "VOLUNTEER" ? "bg-[#14B8A6] hover:bg-teal-600 text-slate-900 shadow-teal-500/10" : "bg-[#F59E0B] hover:bg-amber-600 text-slate-900 shadow-amber-500/10"}`}>
              {isLoading ? "INITIALIZING..." : "CREATE ACCESS NODE →"}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800/50" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase">
              <span className="bg-slate-900 px-4 text-slate-600 font-black tracking-[0.3em]">External Protocols</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 pb-4">
            <Button 
                variant="outline" 
                className="bg-slate-950/50 border-slate-800 hover:border-[#14B8A6]/50 text-slate-200 h-11 rounded-xl transition-all"
                onClick={onGoogleSignUp}
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
            <Button variant="outline" className="bg-slate-950/50 border-slate-800 hover:border-white/20 text-slate-200 h-11 rounded-xl transition-all">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-white/5 py-8 bg-black/20">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Already registered?{" "}
            <Link to="/auth/signin" className="text-[#14B8A6] hover:text-white transition-colors ml-1">
              Sync Account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
