"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#rooms", label: "Rooms & Services" },
  { href: "#offers", label: "Offers" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 z-40 w-full bg-background/70 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <a href="#home" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-ocean text-gold font-display text-lg">O</span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-primary">OceanView</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Resort · Sri Lanka</div>
          </div>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-foreground/80 transition hover:text-primary">
              {l.label}
            </a>
          ))}
          <a href="#rooms" className="rounded-full bg-gradient-gold px-5 py-2 text-sm font-medium text-gold-foreground shadow-gold transition hover:brightness-105">
            Book a stay
          </a>
        </nav>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="md:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#rooms"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-gradient-gold px-4 py-2 text-center text-sm font-medium text-gold-foreground"
            >
              Book a stay
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
