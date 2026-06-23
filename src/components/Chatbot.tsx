"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

type Role = "assistant" | "user";
type Message = { id: string; role: Role; text: string };

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  text:
    "Ayubowan! 🙏 Welcome to OceanView Resort. I'm your Resort AI Assistant — how can I help you with your stay, rooms, dining or special offers today?",
};

const QUICK_REPLIES = [
  "Sea View Rooms",
  "Lunch Menu",
  "Current Offers",
  "Connect to Staff",
] as const;

// Mock responder — easy to swap with an API call later.
async function fetchAssistantReply(userText: string): Promise<string> {
  // TODO: replace with real API call, e.g.:
  // const r = await fetch("/api/chat", { method:"POST", body: JSON.stringify({ message: userText }) });
  // return (await r.json()).reply;
  const t = userText.toLowerCase();
  await new Promise((r) => setTimeout(r, 600));
  if (t.includes("sea") || t.includes("room"))
    return "Our Deluxe Ocean Rooms start at LKR 38,500 (USD 120) per night with a king bed and a private sea-facing balcony. Would you like me to check availability for your dates?";
  if (t.includes("lunch") || t.includes("menu") || t.includes("food"))
    return "Today's lunch highlight is our authentic Sri Lankan Rice & Curry on a banana leaf (LKR 4,200), served at the beachfront Spice Garden from 12:30 to 3:00 PM.";
  if (t.includes("offer") || t.includes("promotion") || t.includes("deal"))
    return "Right now you can enjoy 20% off our Honeymoon Package with a complimentary candlelight dinner, or our 7-for-5 long stay deal saving USD 320.";
  if (t.includes("staff") || t.includes("human") || t.includes("agent"))
    return "Connecting you with our concierge team — a human host will join this chat within a few minutes. In the meantime, may I note your name and room preference?";
  return "Lovely question! I'll get the latest details from our concierge desk and share momentarily. Meanwhile, you can explore rooms, dining and offers below.";
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);
    try {
      const reply = await fetchAssistantReply(trimmed);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: reply }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open chat assistant"
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-ocean px-5 py-4 text-primary-foreground shadow-luxe transition hover:scale-105 ${open ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/90 text-gold-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <span className="hidden text-sm font-medium sm:inline">Resort AI Assistant</span>
        <MessageCircle className="h-5 w-5 sm:hidden" />
      </button>

      {/* Backdrop on mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ocean-deep/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
        />
      )}

      {/* Slide-out window */}
      <aside
        className={`fixed bottom-0 right-0 z-50 flex h-[88svh] w-full flex-col overflow-hidden border border-border bg-card shadow-luxe transition-transform duration-300 sm:bottom-6 sm:right-6 sm:h-[640px] sm:w-[420px] sm:rounded-3xl ${open ? "translate-y-0" : "translate-y-[110%]"}`}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="relative bg-gradient-ocean p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-gold/40">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg">Resort AI Assistant</div>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online · replies instantly
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-secondary/30 px-4 py-5">
          {messages.map((m) => (
            <Bubble key={m.id} role={m.role} text={m.text} />
          ))}
          {pending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex gap-1">
                <Dot /> <Dot delay="120ms" /> <Dot delay="240ms" />
              </span>
              Assistant is typing…
            </div>
          )}
        </div>

        {/* Quick replies */}
        <div className="flex flex-wrap gap-2 border-t border-border bg-card px-4 pt-3">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={pending}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground/80 transition hover:border-gold hover:text-primary disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-border bg-card px-4 py-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about rooms, dining, offers…"
            className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-gold"
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            aria-label="Send"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-gold text-gold-foreground shadow-gold transition disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </aside>
    </>
  );
}

function Bubble({ role, text }: { role: Role; text: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-card text-foreground"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
      style={{ animationDelay: delay }}
    />
  );
}
