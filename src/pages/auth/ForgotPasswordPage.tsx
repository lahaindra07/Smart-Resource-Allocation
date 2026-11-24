import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HandHeart, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success("Password reset instructions dispatched!");
    } catch (err: any) {
      setSent(true);
      toast.success("Password recovery link sent to your email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 rounded-2xl">
        <CardHeader className="text-center pb-5 pt-8">
          <div className="mx-auto w-12 h-12 bg-teal-50 border border-teal-200/70 rounded-2xl flex items-center justify-center mb-4 text-teal-600 shadow-xs">
            <HandHeart className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Reset <span className="text-teal-600">Password</span>
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs mt-1">
            Enter your email to receive recovery instructions
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8">
          {sent ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="h-10 w-10 text-teal-600 mx-auto animate-bounce" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Instructions have been dispatched to <span className="text-slate-900 font-semibold">{email}</span>. Please check your inbox and spam folder.
              </p>
              <Link to="/auth/signin" className="inline-block pt-2 text-xs text-teal-600 font-semibold hover:underline">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reset-email" className="text-xs font-semibold text-slate-700">
                  Registered Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-slate-200 focus:border-teal-500 pl-10 h-10 rounded-xl text-xs text-slate-900 shadow-xs"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition-all uppercase tracking-wider"
              >
                {isLoading ? "Dispatching..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 py-4 bg-slate-50/60 rounded-b-2xl">
          <Link to="/auth/signin" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-medium transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
