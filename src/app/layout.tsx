import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
    variable: "--font-display",
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    style: ["normal", "italic"],
});

export const metadata: Metadata = {
    title: "OceanView Resort | Luxury Beach Sanctuary in Sri Lanka",
    description: "Experience paradise at OceanView Resort in Bentota, Sri Lanka. Five-star beachfront suites, candlelit dining, private plunge pools, and premium hospitality by the Indian Ocean.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <ConditionalLayout>
                    {children}
                </ConditionalLayout>
                <Analytics />
            </body>
        </html>
    );
}