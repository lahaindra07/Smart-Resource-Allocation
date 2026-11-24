import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      toast.error("Please fill in both email and message.");
      return;
    }
    setSubmitted(true);
    toast.success("Thank you! Your dispatch query has been received.");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display">
            Contact <span className="text-teal-600">Operations</span>
          </h1>
          <p className="text-slate-600 text-xs max-w-md mx-auto">
            Reach out to our operations team for NGO verification, partnership inquiries, or platform technical support.
          </p>
        </div>

        <div className="p-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-teal-600 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900 font-display">Message Transmitted</h3>
              <p className="text-slate-600 text-xs max-w-sm mx-auto leading-relaxed">
                Our operations coordinators will review your query and respond to <span className="text-teal-700 font-bold">{email}</span> within 24 hours.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="border-slate-200 text-slate-700 text-xs mt-2">
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="contact-email" className="text-xs font-semibold text-slate-700">Email Address</Label>
                <Input 
                  id="contact-email"
                  type="email" 
                  placeholder="coordinator@domain.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-white border-slate-200 text-slate-900 text-xs h-10 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-message" className="text-xs font-semibold text-slate-700">Message / Inquiry</Label>
                <textarea 
                  id="contact-message"
                  rows={4}
                  placeholder="Describe your initiative or request..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-200 text-slate-900 text-xs p-3 focus:outline-none focus:border-teal-500 transition-colors shadow-xs"
                />
              </div>

              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs h-10 gap-2 shadow-xs cursor-pointer">
                <Send className="h-3.5 w-3.5" /> Submit Query
              </Button>
            </form>
          )}
        </div>

        {/* National Emergency Helplines (India) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <p className="font-bold text-slate-900">National Emergency</p>
            <p className="text-teal-700 font-extrabold text-sm mt-0.5">112</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Pan-India 24x7 Dispatch</p>
          </div>
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <p className="font-bold text-slate-900">NDMA Helpline</p>
            <p className="text-teal-700 font-extrabold text-sm mt-0.5">1078</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Disaster Response Authority</p>
          </div>
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <p className="font-bold text-slate-900">Medical / Ambulance</p>
            <p className="text-teal-700 font-extrabold text-sm mt-0.5">108 / 102</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Emergency Triage Units</p>
          </div>
        </div>
      </div>
    </div>
  );
}
