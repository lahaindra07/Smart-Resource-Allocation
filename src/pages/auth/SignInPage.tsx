import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HandHeart, Mail, Lock, Shield, Sparkles, Building2, UserCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInPage() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, signInAsDemo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "volunteer@resourcemap.org",
      password: "password123",
    },
  });

  const redirectByRole = (userRole: Role) => {
    switch (userRole) {
      case "NGO_MANAGER":
        navigate("/dashboard/ngo");
        break;
      case "ADMIN":
        navigate("/dashboard/admin");
        break;
      case "VOLUNTEER":
      default:
        navigate("/dashboard/volunteer");
        break;
    }
  };

  async function onSubmit(data: SignInValues) {
    setIsLoading(true);
    try {
      const user = await signInWithEmail(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      redirectByRole(user.role);
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onGoogleSignIn() {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      toast.success(`Signed in with Google as ${user.name}!`);
      redirectByRole(user.role);
    } catch (error: any) {
      console.error(error);
      toast.error("Google sign-in was cancelled or encountered an error.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDemoSignIn = (role: Role) => {
    signInAsDemo(role);
    toast.success(`Active persona: ${role === "NGO_MANAGER" ? "NGO Manager" : role}`);
    redirectByRole(role);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Soft decorative background gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 rounded-2xl my-8">
        <CardHeader className="text-center pb-5 pt-8">
          <div className="mx-auto w-12 h-12 bg-teal-50 border border-teal-200/70 rounded-2xl flex items-center justify-center mb-4 text-teal-600 shadow-xs">
            <HandHeart className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Sign in to <span className="text-teal-600">ResourceMap</span>
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs mt-1">
            Access your coordination dashboard and community tickets
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 space-y-5">
          {/* 1-Click Fast Evaluation Personas */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-700">
              <Sparkles className="h-3 w-3" />
              <span>Instant Evaluator Mode (1-Click Login)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn("VOLUNTEER")}
                className="py-2 px-2 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 rounded-lg text-[10px] font-semibold flex flex-col items-center gap-1 transition-all shadow-xs"
              >
                <UserCheck className="h-3.5 w-3.5 text-teal-600" />
                <span>Volunteer</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("NGO_MANAGER")}
                className="py-2 px-2 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 rounded-lg text-[10px] font-semibold flex flex-col items-center gap-1 transition-all shadow-xs"
              >
                <Building2 className="h-3.5 w-3.5 text-amber-600" />
                <span>NGO Manager</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("ADMIN")}
                className="py-2 px-2 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 rounded-lg text-[10px] font-semibold flex flex-col items-center gap-1 transition-all shadow-xs"
              >
                <Shield className="h-3.5 w-3.5 text-blue-600" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="volunteer@resourcemap.org"
                  {...form.register("email")}
                  className="bg-white border-slate-200 focus:border-teal-500 pl-10 h-10 rounded-xl text-xs text-slate-900 shadow-xs"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-rose-600 text-[11px] font-medium mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Password
                </Label>
                <Link to="/auth/forgot-password" className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="bg-white border-slate-200 focus:border-teal-500 pl-10 h-10 rounded-xl text-xs text-slate-900 shadow-xs"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-rose-600 text-[11px] font-medium mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              {isLoading ? "Signing in..." : (
                <>
                  <span>Sign In with Credentials</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full bg-white hover:bg-slate-50 border-slate-200 text-slate-700 h-10 rounded-xl transition-all font-semibold text-xs shadow-xs"
            onClick={onGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign In with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 py-4 bg-slate-50/60 rounded-b-2xl">
          <p className="text-xs text-slate-500 font-medium">
            New to ResourceMap?{" "}
            <Link to="/auth/signup" className="text-teal-600 hover:text-teal-700 font-semibold ml-1">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
