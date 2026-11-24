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
import { HandHeart, Building2, UserCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types";

const signUpSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["VOLUNTEER", "NGO_MANAGER"]),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
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

  const redirectByRole = (userRole: Role) => {
    if (userRole === "NGO_MANAGER") {
      navigate("/dashboard/ngo");
    } else {
      navigate("/dashboard/volunteer");
    }
  };

  async function onSubmit(data: SignUpValues) {
    setIsLoading(true);
    try {
      const user = await signUpWithEmail(data.name, data.email, data.password, data.role);
      toast.success(`Account created successfully! Welcome, ${user.name}`);
      redirectByRole(user.role);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onGoogleSignUp() {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle(role);
      toast.success(`Welcome to ResourceMap, ${user.name}!`);
      redirectByRole(user.role);
    } catch (error: any) {
      console.error(error);
      toast.error("Google registration was cancelled or encountered an error.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Soft background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 rounded-2xl my-8">
        <CardHeader className="text-center pb-5 pt-8">
          <div className="mx-auto w-12 h-12 bg-teal-50 border border-teal-200/70 rounded-2xl flex items-center justify-center mb-4 text-teal-600 shadow-xs">
            <HandHeart className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Create an <span className="text-teal-600">Account</span>
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs mt-1">
            Join the smart resource allocation and volunteer network
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 space-y-5">
          {/* Role selector tab */}
          <div>
            <Label className="text-xs font-semibold text-slate-700 mb-2 block">
              I am participating as:
            </Label>
            <Tabs
              defaultValue="VOLUNTEER"
              value={role}
              onValueChange={(v) => {
                const selected = v as "VOLUNTEER" | "NGO_MANAGER";
                setRole(selected);
                form.setValue("role", selected);
              }}
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <TabsTrigger
                  value="VOLUNTEER"
                  className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-xs text-xs font-semibold py-2 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Volunteer</span>
                </TabsTrigger>
                <TabsTrigger
                  value="NGO_MANAGER"
                  className="data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-xs text-xs font-semibold py-2 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>NGO Manager</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                {...form.register("name")}
                className="bg-white border-slate-200 focus:border-teal-500 h-10 rounded-xl text-xs text-slate-900 shadow-xs"
              />
              {form.formState.errors.name && (
                <p className="text-rose-600 text-[11px] font-medium mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@domain.org"
                {...form.register("email")}
                className="bg-white border-slate-200 focus:border-teal-500 h-10 rounded-xl text-xs text-slate-900 shadow-xs"
              />
              {form.formState.errors.email && (
                <p className="text-rose-600 text-[11px] font-medium mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                {...form.register("password")}
                className="bg-white border-slate-200 focus:border-teal-500 h-10 rounded-xl text-xs text-slate-900 shadow-xs"
              />
              {form.formState.errors.password && (
                <p className="text-rose-600 text-[11px] font-medium mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98 mt-2"
            >
              {isLoading ? "Creating Account..." : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-2.5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">or sign up with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-white hover:bg-slate-50 border-slate-200 text-slate-700 h-10 rounded-xl transition-all font-semibold text-xs shadow-xs"
            onClick={onGoogleSignUp}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign Up with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 py-4 bg-slate-50/60 rounded-b-2xl">
          <p className="text-xs text-slate-500 font-medium">
            Already have an account?{" "}
            <Link to="/auth/signin" className="text-teal-600 hover:text-teal-700 font-semibold ml-1">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
