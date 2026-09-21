"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isAdminRoute = pathname?.startsWith("/admin");

    if (isAdminRoute) {
        return <main className="grow">{children}</main>;
    }
    return (
        <>
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
            <Chatbot />
        </>
    );
}