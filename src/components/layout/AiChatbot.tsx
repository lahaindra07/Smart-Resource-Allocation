import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  X, 
  Maximize2, 
  Minimize2, 
  MoreHorizontal, 
  Send, 
  Sparkles, 
  Trash2, 
  Compass, 
  Users, 
  FileText,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendChatMessage, ChatMessage } from "@/services/aiService";
import { useAuth } from "@/hooks/useAuth";

const getWelcomeMessage = (name?: string): ChatMessage => ({
  id: "welcome-bot",
  sender: "bot",
  text: `Hello${name ? `, ${name.split(" ")[0]}` : ""}! Welcome to ResourceMap India. I am your AI Assistant powered by NVIDIA Nemotron 3 Ultra. 

How may I assist you today? You can ask me about:
• Locating active Indian crisis relief needs on the live map (/needs)
• Volunteering in disaster corridors (Sundarbans, Wayanad, Assam, Odisha)
• Ingesting field survey notes for Indian NGOs & SDMA (/dashboard/ngo)
• Emergency contacts: 112 (National Emergency) | 1078 (NDMA Helpline)`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  model: "NVIDIA Nemotron 3 Ultra"
});

const SUGGESTIONS = [
  "Find crisis needs on India map",
  "How does volunteer matching work?",
  "How to submit an NGO crisis report",
  "National disaster emergency helplines"
];

export function AiChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [getWelcomeMessage(user?.name)]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.name && messages.length === 1 && messages[0].id === "welcome-bot") {
      setMessages([getWelcomeMessage(user.name)]);
    }
  }, [user?.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const replyText = await sendChatMessage(text, messages);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        model: "NVIDIA Nemotron 3 Ultra"
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: "I'm experiencing a momentary connection pause. You can still navigate directly to /needs for live crisis tickets or /dashboard/volunteer for open missions!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([getWelcomeMessage(user?.name)]);
    setShowMenu(false);
  };

  return (
    <>
      {/* Floating Trigger Button (when chat is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 p-3.5 bg-white text-slate-800 rounded-full shadow-xl shadow-blue-500/10 border border-slate-200/90 hover:shadow-2xl hover:border-blue-400 hover:scale-105 transition-all duration-200 cursor-pointer"
          aria-label="Open AI Agent Chat"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="h-4 w-4 fill-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </div>
          <span className="text-xs font-bold text-slate-800 pr-1 group-hover:text-blue-600 transition-colors">
            AI agent
          </span>
          <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse mr-0.5" />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div 
          className={`fixed z-50 flex flex-col bg-slate-50/95 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-[28px] overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isExpanded 
              ? "bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[540px] sm:h-[680px] h-[85vh]" 
              : "bottom-6 right-6 w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh]"
          }`}
        >
          {/* Top Bar matching user image */}
          <div className="flex items-center justify-between px-5 py-4 bg-white/80 border-b border-slate-200/70 select-none">
            {/* Left expand icon */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title={isExpanded ? "Collapse" : "Maximize"}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>

            {/* Center Pill Badge */}
            <div className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-2xs">
                  <MessageSquare className="h-3.5 w-3.5 fill-white" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                AI agent
              </span>
            </div>

            {/* Right icons: Options & Close */}
            <div className="flex items-center gap-1 relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Menu Dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 space-y-1 z-10 text-xs">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Powered by NVIDIA Nemotron
                  </div>
                  <button
                    onClick={clearChat}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-rose-600 rounded-lg transition-colors text-left"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear Conversation</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((msg) => {
              if (msg.sender === "user") {
                return (
                  <div key={msg.id} className="flex items-start justify-end gap-2.5">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-slate-800 text-sm font-normal leading-relaxed shadow-xs max-w-[82%]">
                      {msg.text}
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 shadow-2xs">
                      {user?.image ? (
                        <img src={user.image} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <img 
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
                          alt="User" 
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>
                  </div>
                );
              }

              // Bot Message (matches the vibrant gradient & design in the image)
              return (
                <div key={msg.id} className="flex flex-col items-start gap-1.5">
                  <div className="flex items-start gap-2.5">
                    <div className="relative flex-shrink-0 pt-0.5">
                      {/* Ambient blue star sparkles */}
                      <Sparkles className="absolute -top-1.5 -left-1.5 h-3.5 w-3.5 text-blue-400 animate-pulse pointer-events-none" />
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
                        <MessageSquare className="h-4 w-4 fill-white" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-2xl p-4 text-white text-sm font-normal leading-relaxed shadow-md shadow-blue-500/20 max-w-[85%]">
                      {msg.text}
                    </div>
                  </div>

                  {/* Pill Badge under bot bubble: ✨ Answered by AI */}
                  <div className="ml-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-semibold text-slate-700">
                      <Sparkles className="h-3 w-3 text-violet-600 fill-violet-600/30" />
                      <span>Answered by AI</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="flex flex-col items-start gap-1.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
                    <MessageSquare className="h-4 w-4 fill-white" />
                  </div>
                  <div className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-2xl px-4 py-3 text-white text-sm flex items-center gap-2 shadow-md shadow-blue-500/20">
                    <Loader2 className="h-4 w-4 animate-spin text-white/90" />
                    <span className="text-xs font-medium text-white/90">Nemotron is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-200/50 bg-white/40">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-colors shadow-2xs flex-shrink-0 cursor-pointer disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Bottom Input Field */}
          <div className="p-3.5 bg-white border-t border-slate-200/80">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about needs, volunteering, maps..."
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl h-9.5 w-9.5 p-0 flex items-center justify-center shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
