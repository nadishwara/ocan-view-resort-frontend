"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { RoomsServices } from "@/components/RoomsServices";
import { SpecialOffers } from "@/components/SpecialOffers";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-50 font-sans antialiased selection:bg-gold selection:text-gold-foreground">
      {/* Toast notifications */}
      <Toaster position="bottom-left" closeButton richColors />

      {/* Global Navigation Bar */}
      {/* <Navbar /> */}

      {/* Main Page Layout */}
      <main className="flex-grow">
        {/* Hero Banner with Quick Search */}
        <Hero />

        {/* Resort Core Highlights */}
        <Highlights />

        {/* Room Grid and Activities Section */}
        <RoomsServices />

        {/* Special Limited-Time Offers */}
        <SpecialOffers />
      </main>

      {/* Footer Section */}
      {/* <Footer /> */}

      {/* Floating Concierge AI Chatbot */}
      {/* <Chatbot /> */}
    </div>
  );
}
