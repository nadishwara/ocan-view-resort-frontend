"use client";

import React, { useState, useId, FormEvent, ChangeEvent } from "react";
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

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type InquiryType = "general" | "reservation" | "events" | "feedback";

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    inquiryType: InquiryType;
    message: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    message?: string;
}

const INITIAL_FORM: FormData = {
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "general",
    message: "",
};

const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
    { value: "general", label: "General Inquiry" },
    { value: "reservation", label: "Reservation" },
    { value: "events", label: "Events & Weddings" },
    { value: "feedback", label: "Feedback" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

function validateForm(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.fullName.trim()) {
        errors.fullName = "Full name is required.";
    } else if (data.fullName.trim().length < 2) {
        errors.fullName = "Name must be at least 2 characters.";
    }

    if (!data.email.trim()) {
        errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (data.phone && !/^[\d\s()+-]{7,20}$/.test(data.phone)) {
        errors.phone = "Please enter a valid phone number.";
    }

    if (!data.message.trim()) {
        errors.message = "Message is required.";
    } else if (data.message.trim().length < 10) {
        errors.message = "Message must be at least 10 characters.";
    }

    return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Glassmorphism utility classes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Glass surface — semi-transparent with backdrop blur.
 * Uses a light glass tint so it works over the hero image.
 * Text uses `text-white` / `text-white/80` for contrast.
 */
const glassSurface =
    " bg-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]";

const glassCard = `${glassSurface} rounded-2xl`;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

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
    const wrapperProps = href
        ? { href, target: "_blank", rel: "noopener noreferrer" }
        : {};

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

function SocialLink({
    icon: Icon,
    label,
    href,
}: {
    icon: React.ElementType;
    label: string;
    href: string;
}) {
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
            <label
                htmlFor={id}
                className="block font-sans text-xs font-semibold uppercase tracking-widest text-white/70"
            >
                {label}
            </label>
            {children}
            {touched && error && (
                <p
                    id={`${id}-error`}
                    role="alert"
                    className="flex items-center gap-1 font-sans text-xs text-red-300"
                >
                    <span className="inline-block h-1 w-1 rounded-full bg-red-300" />
                    {error}
                </p>
            )}
        </div>
    );
}

/**
 * Glass input — semi-transparent with backdrop blur.
 * Text is white; placeholder is white at 50% opacity.
 * Focus adds a gold ring for visibility.
 */
const inputBase =
    "w-full rounded-xl  bg-white/10 px-4 py-3 font-sans text-sm text-white backdrop-blur-md shadow-sm outline-none transition-all duration-200 placeholder:text-white/50 hover:bg-white/15 focus:bg-white/20 focus:ring-2 focus:ring-gold focus:ring-offset-1 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60";

function getInputClasses(error?: string, touched?: boolean, value?: string) {
    if (touched && error) {
        return `${inputBase} border-red-400/60 focus:border-red-400 focus:ring-red-400`;
    }
    if (touched && !error && value) {
        return `${inputBase} border-emerald-400/60 focus:border-emerald-400 focus:ring-emerald-400`;
    }
    return `${inputBase} border-white/25 focus:border-gold/60`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function Contact() {
    const formId = useId();
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [status, setStatus] = useState<FormStatus>("idle");

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleBlur = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const fieldErrors = validateForm(formData);
        setErrors((prev) => ({
            ...prev,
            [name]: fieldErrors[name as keyof FormErrors],
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("idle");

        const validationErrors = validateForm(formData);
        const allTouched: Record<string, boolean> = {};
        Object.keys(formData).forEach((key) => {
            allTouched[key] = true;
        });
        setTouched(allTouched);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setStatus("error");
            return;
        }

        setStatus("submitting");

        try {
            await new Promise((resolve) => setTimeout(resolve, 1800));
            setStatus("success");
            setFormData(INITIAL_FORM);
            setTouched({});
            setErrors({});
        } catch {
            setStatus("error");
        }
    };

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative overflow-hidden bg-background text-foreground py-20 md:py-28"
        >
            {/* Hero background image */}
            <div className="absolute inset-0 z-0 opacity-90">
                <Image
                    src="https://images.unsplash.com/photo-1609602126247-4ab7188b4aa1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Ocean View Resort Hero"
                    fill
                    priority
                    quality={90}
                    className="object-cover object-center"
                />
                {/* Darker overlay so glass + white text stay readable */}
                <div className="absolute inset-0 bg-linear-to-b from-ocean-deep/90 via-ocean-deep/80 to-ocean-deep/90" />
            </div>

            {/* Ambient background accent blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 -left-40 h-120 w-120 rounded-full bg-sand/20 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full  bg-white/10 px-4 py-1.5 
                    font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur-md">
                        <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                        Get in Touch
                    </span>
                    <h2
                        id="contact-heading"
                        className="mt-5 font-display text-4xl font-light tracking-tight text-white sm:text-5xl"
                    >
                        We&apos;d Love to{" "}
                        <span className="text-gradient-gold italic">Hear From You</span>
                    </h2>
                    <p className="mt-4 font-sans text-base leading-relaxed text-white/80">
                        Whether you&apos;re planning a getaway, celebrating a milestone, or
                        just curious about life at OceanView — our concierge team is here
                        around the clock.
                    </p>
                </div>

                {/* Two-column grid */}
                <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-14">
                    {/* ── LEFT: Contact Info & Map Preview ──────────────────────────── */}
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            <ContactInfoCard
                                icon={MapPin}
                                title="Visit Us"
                                href="https://maps.google.com/?q=OceanView+Resort"
                            >
                                123 Coastal Drive, Cliffside Bay
                                <br />
                                Malibu, CA 90265, United States
                            </ContactInfoCard>

                            <ContactInfoCard icon={Phone} title="Call Us" href="tel:+13105550142">
                                <span className="block">Reservations: +1 (310) 555-0142</span>
                                <span className="block text-white/70">
                                    Concierge: +1 (310) 555-0198
                                </span>
                            </ContactInfoCard>

                            <ContactInfoCard
                                icon={Mail}
                                title="Email Us"
                                href="mailto:hello@oceanviewresort.com"
                            >
                                <span className="block">hello@oceanviewresort.com</span>
                                <span className="block text-white/70">
                                    reservations@oceanviewresort.com
                                </span>
                            </ContactInfoCard>

                            <ContactInfoCard icon={Clock} title="Front Desk Hours">
                                <span className="block">24 / 7 — Always at your service</span>
                                <span className="block text-white/70">
                                    Check-in: 3:00 PM · Check-out: 12:00 PM
                                </span>
                            </ContactInfoCard>
                        </div>

                        {/* Map preview — glass frame */}
                        <div className={`group relative overflow-hidden p-1.5 transition-shadow duration-300 hover:shadow-luxe ${glassCard}`}>
                            <div className="relative h-52 w-full overflow-hidden rounded-xl bg-linear-to-br from-ocean-deep/60 via-ocean/50 to-ocean-deep/70 sm:h-60">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 opacity-40"
                                    style={{
                                        backgroundImage:
                                            "radial-gradient(circle at 30% 40%, color-mix(in oklab, var(--gold) 50%, transparent) 0%, transparent 50%), radial-gradient(circle at 70% 60%, color-mix(in oklab, var(--gold) 35%, transparent) 0%, transparent 45%), repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.06) 18px, rgba(255,255,255,0.06) 19px)",
                                    }}
                                />
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="relative flex items-center justify-center">
                                        <span className="absolute inline-flex h-14 w-14 animate-ping rounded-full bg-gold/30" />
                                        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gold shadow-gold text-gold-foreground">
                                            <MapPin className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute bottom-3 left-3 rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-md">
                                    <p className="font-sans text-xs font-medium text-white">
                                        OceanView Resort · Cliffside Bay
                                    </p>
                                </div>
                                <a
                                    href="https://maps.google.com/?q=OceanView+Resort"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open OceanView Resort location in Google Maps"
                                    className="absolute inset-0"
                                />
                            </div>
                        </div>

                        {/* Social links */}
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

                    {/* ── RIGHT: Contact Form Card — Glassmorphism ──────────────────── */}
                    <div className="relative">
                        <div
                            className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 ${glassSurface} transition-colors duration-300 hover:bg-white/20`}
                        >
                            {/* Inner gold glow */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gold/15 blur-3xl"
                            />

                            <div className="relative">
                                <h3 className="font-display text-2xl font-light text-white">
                                    Send a Message
                                </h3>
                                <p className="mt-1 font-sans text-sm text-white/70">
                                    We typically respond within 2 hours.
                                </p>

                                <form
                                    onSubmit={handleSubmit}
                                    noValidate
                                    aria-label="Contact OceanView Resort"
                                    className="mt-7 space-y-5"
                                >
                                    {/* Full Name */}
                                    <FieldWrapper
                                        id={`${formId}-fullName`}
                                        label="Full Name"
                                        error={errors.fullName}
                                        touched={!!touched.fullName}
                                    >
                                        <input
                                            id={`${formId}-fullName`}
                                            name="fullName"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Jane Doe"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            aria-invalid={!!(touched.fullName && errors.fullName)}
                                            aria-describedby={
                                                touched.fullName && errors.fullName
                                                    ? `${formId}-fullName-error`
                                                    : undefined
                                            }
                                            disabled={status === "submitting"}
                                            className={getInputClasses(
                                                errors.fullName,
                                                touched.fullName,
                                                formData.fullName
                                            )}
                                        />
                                    </FieldWrapper>

                                    {/* Email + Phone */}
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <FieldWrapper
                                            id={`${formId}-email`}
                                            label="Email Address"
                                            error={errors.email}
                                            touched={!!touched.email}
                                        >
                                            <input
                                                id={`${formId}-email`}
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder="jane@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!(touched.email && errors.email)}
                                                aria-describedby={
                                                    touched.email && errors.email
                                                        ? `${formId}-email-error`
                                                        : undefined
                                                }
                                                disabled={status === "submitting"}
                                                className={getInputClasses(
                                                    errors.email,
                                                    touched.email,
                                                    formData.email
                                                )}
                                            />
                                        </FieldWrapper>

                                        <FieldWrapper
                                            id={`${formId}-phone`}
                                            label="Phone Number"
                                            error={errors.phone}
                                            touched={!!touched.phone}
                                        >
                                            <input
                                                id={`${formId}-phone`}
                                                name="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                placeholder="+1 (310) 555-0100"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!(touched.phone && errors.phone)}
                                                aria-describedby={
                                                    touched.phone && errors.phone
                                                        ? `${formId}-phone-error`
                                                        : undefined
                                                }
                                                disabled={status === "submitting"}
                                                className={getInputClasses(
                                                    errors.phone,
                                                    touched.phone,
                                                    formData.phone
                                                )}
                                            />
                                        </FieldWrapper>
                                    </div>

                                    {/* Inquiry Type */}
                                    <FieldWrapper
                                        id={`${formId}-inquiryType`}
                                        label="Inquiry Type"
                                        touched={false}
                                    >
                                        <div className="relative">
                                            <select
                                                id={`${formId}-inquiryType`}
                                                name="inquiryType"
                                                value={formData.inquiryType}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={status === "submitting"}
                                                className={`${inputBase} cursor-pointer appearance-none `}
                                            >
                                                {INQUIRY_OPTIONS.map((opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                        className="bg-ocean-deep text-white"
                                                    >
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown
                                                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </FieldWrapper>

                                    {/* Message */}
                                    <FieldWrapper
                                        id={`${formId}-message`}
                                        label="Message"
                                        error={errors.message}
                                        touched={!!touched.message}
                                    >
                                        <textarea
                                            id={`${formId}-message`}
                                            name="message"
                                            rows={4}
                                            placeholder="Tell us about your dream stay..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            aria-invalid={!!(touched.message && errors.message)}
                                            aria-describedby={
                                                touched.message && errors.message
                                                    ? `${formId}-message-error`
                                                    : undefined
                                            }
                                            disabled={status === "submitting"}
                                            className={`${getInputClasses(
                                                errors.message,
                                                touched.message,
                                                formData.message
                                            )} resize-none`}
                                        />
                                    </FieldWrapper>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-ocean px-6 py-3.5 font-sans text-sm font-semibold tracking-wide text-primary-foreground shadow-luxe transition-all duration-300 hover:scale-[1.02] hover:shadow-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                                        />
                                        {status === "submitting" ? (
                                            <>
                                                <Loader2
                                                    className="h-4 w-4 animate-spin"
                                                    aria-hidden="true"
                                                />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Send
                                                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                    aria-hidden="true"
                                                />
                                                Send Message
                                            </>
                                        )}
                                    </button>

                                    {/* Success toast */}
                                    {status === "success" && (
                                        <div
                                            role="status"
                                            aria-live="polite"
                                            className="flex items-start gap-3 rounded-xl  bg-emerald-500/15 p-4 backdrop-blur-md"
                                        >
                                            <CheckCircle
                                                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300"
                                                aria-hidden="true"
                                            />
                                            <div>
                                                <p className="font-sans text-sm font-semibold text-emerald-200">
                                                    Message sent successfully!
                                                </p>
                                                <p className="mt-0.5 font-sans text-xs text-emerald-200/80">
                                                    Our concierge team will be in touch shortly.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Error toast */}
                                    {status === "error" && Object.keys(errors).length > 0 && (
                                        <div
                                            role="alert"
                                            aria-live="assertive"
                                            className="flex items-start gap-3 rounded-xl  bg-red-500/15 p-4 backdrop-blur-md"
                                        >
                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-400/30 text-xs font-bold text-red-200">
                                                !
                                            </span>
                                            <div>
                                                <p className="font-sans text-sm font-semibold text-red-200">
                                                    Please fix the errors above.
                                                </p>
                                                <p className="mt-0.5 font-sans text-xs text-red-200/80">
                                                    All fields marked in red need your attention.
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