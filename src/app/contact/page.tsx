"use client";

import React from "react";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    CheckCircle,
    MessageSquare,
    ChevronDown,
    Loader2,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
} from "lucide-react";
import Image from "next/image";
import { useContactForm } from "@/app/hooks/useContactForm";
import { InquiryType } from "@/app/types/contact";

const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
    { value: "general", label: "General Inquiry" },
    { value: "reservation", label: "Reservation" },
    { value: "events", label: "Events & Weddings" },
    { value: "feedback", label: "Feedback" },
];

const glassSurface = " bg-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]";
const glassCard = `${glassSurface} rounded-2xl`;

function ContactInfoCard({
    icon: Icon,
    title,
    children,
    href,
}: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    href?: string;
}) {
    const Wrapper = href ? "a" : "div";
    const wrapperProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={`group flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/20 hover:shadow-gold ${glassCard}`}
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/25 text-gold backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
                <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-white/60">
                    {title}
                </h3>
                <div className="mt-1 font-sans text-sm leading-relaxed text-white">
                    {children}
                </div>
            </div>
        </Wrapper>
    );
}

function SocialLink({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white/80 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-gold/50 hover:bg-white/25 hover:text-gold hover:shadow-gold"
        >
            <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
    );
}

function FieldWrapper({
    id,
    label,
    error,
    touched,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    touched: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block font-sans text-xs font-semibold uppercase tracking-widest text-white/70">
                {label}
            </label>
            {children}
            {touched && error && (
                <p id={`${id}-error`} role="alert" className="flex items-center gap-1 font-sans text-xs text-red-300">
                    <span className="inline-block h-1 w-1 rounded-full bg-red-300" />
                    {error}
                </p>
            )}
        </div>
    );
}

const inputBase =
    "w-full rounded-xl bg-white/10 px-4 py-3 font-sans text-sm text-white backdrop-blur-md shadow-sm outline-none transition-all duration-200 placeholder:text-white/50 hover:bg-white/15 focus:bg-white/20 focus:ring-2 focus:ring-gold focus:ring-offset-1 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60";

function getInputClasses(error?: string, touched?: boolean, value?: string) {
    if (touched && error) {
        return `${inputBase} border-red-400/60 focus:border-red-400 focus:ring-red-400`;
    }
    if (touched && !error && value) {
        return `${inputBase} border-emerald-400/60 focus:border-emerald-400 focus:ring-emerald-400`;
    }
    return `${inputBase} border-white/25 focus:border-gold/60`;
}

export default function Contact() {
    const {
        formId,
        formData,
        errors,
        touched,
        status,
        serverMessage,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useContactForm();

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative overflow-hidden bg-background text-foreground py-20 md:py-28"
        >
            <div className="absolute inset-0 z-0 opacity-90">
                <Image
                    src="https://images.unsplash.com/photo-1609602126247-4ab7188b4aa1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Ocean View Resort Hero"
                    fill
                    priority
                    quality={90}
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-b from-ocean-deep/90 via-ocean-deep/80 to-ocean-deep/90" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur-md">
                        <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                        Get in Touch
                    </span>
                    <h2
                        id="contact-heading"
                        className="mt-5 font-display text-4xl font-light tracking-tight text-white sm:text-5xl"
                    >
                        We&apos;d Love to <span className="text-gradient-gold italic">Hear From You</span>
                    </h2>
                    <p className="mt-4 font-sans text-base leading-relaxed text-white/80">
                        Whether you&apos;re planning a getaway, celebrating a milestone, or just curious about life at OceanView — our concierge team is here around the clock.
                    </p>
                </div>

                <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-14">
                    {/* Left Info Panel */}
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            <ContactInfoCard
                                icon={MapPin}
                                title="Visit Us"
                                href="https://maps.google.com/?q=OceanView+Resort"
                            >
                                123 Coastal Drive, Bentota, Sri Lanka
                            </ContactInfoCard>

                            <ContactInfoCard icon={Phone} title="Call Us" href="tel:+94342275000">
                                <span className="block">Reservations: +94 (34) 227-5000</span>
                                <span className="block text-white/70">Concierge: +94 (34) 227-5099</span>
                            </ContactInfoCard>

                            <ContactInfoCard
                                icon={Mail}
                                title="Email Us"
                                href="mailto:hello@oceanviewresort.com"
                            >
                                <span className="block">hello@oceanviewresort.com</span>
                                <span className="block text-white/70">reservations@oceanviewresort.com</span>
                            </ContactInfoCard>

                            <ContactInfoCard icon={Clock} title="Front Desk Hours">
                                <span className="block">24 / 7 — Always at your service</span>
                                <span className="block text-white/70">Check-in: 2:00 PM · Check-out: 12:00 PM</span>
                            </ContactInfoCard>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-white/70">
                                Follow
                            </span>
                            <div className="flex items-center gap-2.5">
                                <SocialLink icon={Facebook} label="Facebook" href="#" />
                                <SocialLink icon={Instagram} label="Instagram" href="#" />
                                <SocialLink icon={Twitter} label="Twitter" href="#" />
                                <SocialLink icon={Youtube} label="YouTube" href="#" />
                            </div>
                        </div>
                    </div>

                    {/* Right Form Panel */}
                    <div className="relative">
                        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 ${glassSurface} transition-colors duration-300 hover:bg-white/20`}>
                            <div className="relative">
                                <h3 className="font-display text-2xl font-light text-white">Send a Message</h3>
                                <p className="mt-1 font-sans text-sm text-white/70">We typically respond within 2 hours.</p>

                                <form onSubmit={handleSubmit} noValidate aria-label="Contact OceanView Resort" className="mt-7 space-y-5">
                                    <FieldWrapper id={`${formId}-fullName`} label="Full Name" error={errors.fullName} touched={!!touched.fullName}>
                                        <input
                                            id={`${formId}-fullName`}
                                            name="fullName"
                                            type="text"
                                            placeholder="Jane Doe"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={status === "submitting"}
                                            className={getInputClasses(errors.fullName, touched.fullName, formData.fullName)}
                                        />
                                    </FieldWrapper>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <FieldWrapper id={`${formId}-email`} label="Email Address" error={errors.email} touched={!!touched.email}>
                                            <input
                                                id={`${formId}-email`}
                                                name="email"
                                                type="email"
                                                placeholder="jane@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={status === "submitting"}
                                                className={getInputClasses(errors.email, touched.email, formData.email)}
                                            />
                                        </FieldWrapper>

                                        <FieldWrapper id={`${formId}-phone`} label="Phone Number" error={errors.phone} touched={!!touched.phone}>
                                            <input
                                                id={`${formId}-phone`}
                                                name="phone"
                                                type="tel"
                                                placeholder="+94 77 123 4567"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={status === "submitting"}
                                                className={getInputClasses(errors.phone, touched.phone, formData.phone)}
                                            />
                                        </FieldWrapper>
                                    </div>

                                    <FieldWrapper id={`${formId}-inquiryType`} label="Inquiry Type" touched={false}>
                                        <div className="relative">
                                            <select
                                                id={`${formId}-inquiryType`}
                                                name="inquiryType"
                                                value={formData.inquiryType}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={status === "submitting"}
                                                className={`${inputBase} cursor-pointer appearance-none`}
                                            >
                                                {INQUIRY_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value} className="bg-ocean-deep text-white">
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                                        </div>
                                    </FieldWrapper>

                                    <FieldWrapper id={`${formId}-message`} label="Message" error={errors.message} touched={!!touched.message}>
                                        <textarea
                                            id={`${formId}-message`}
                                            name="message"
                                            rows={4}
                                            placeholder="Tell us about your dream stay..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={status === "submitting"}
                                            className={`${getInputClasses(errors.message, touched.message, formData.message)} resize-none`}
                                        />
                                    </FieldWrapper>

                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-ocean px-6 py-3.5 font-sans text-sm font-semibold text-primary-foreground shadow-luxe transition-all duration-300 hover:scale-[1.02] hover:shadow-gold disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {status === "submitting" ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                Send Message
                                            </>
                                        )}
                                    </button>

                                    {/* Success Message */}
                                    {status === "success" && (
                                        <div className="flex items-start gap-3 rounded-xl bg-emerald-500/15 p-4 backdrop-blur-md">
                                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                                            <div>
                                                <p className="font-sans text-sm font-semibold text-emerald-200">
                                                    {serverMessage}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {status === "error" && (
                                        <div className="flex items-start gap-3 rounded-xl bg-red-500/15 p-4 backdrop-blur-md">
                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-400/30 text-xs font-bold text-red-200">
                                                !
                                            </span>
                                            <div>
                                                <p className="font-sans text-sm font-semibold text-red-200">
                                                    {serverMessage || "Please fix the errors above."}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}