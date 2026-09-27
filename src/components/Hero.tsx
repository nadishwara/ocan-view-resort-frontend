"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarDays, Users, BedDouble, Sparkles, Check } from "lucide-react";
import heroImg from "@/assets/hero-resort.jpg";
import Image from "next/image";

const ROOM_TYPES = ["Deluxe Ocean Room", "Family Suite", "Presidential Villa"] as const;
const GUEST_OPTIONS = ["1 Adult", "2 Adults", "2 Adults · 1 Child", "Family (4)"] as const;

const bookingSchema = z
  .object({
    checkIn: z.string().min(1, "Please choose a check-in date"),
    checkOut: z.string().min(1, "Please choose a check-out date"),
    guests: z.enum(GUEST_OPTIONS, { message: "Select guests" }),
    roomType: z.enum(ROOM_TYPES, { message: "Select a room type" }),
  })
  .refine((v) => new Date(v.checkIn) >= new Date(new Date().toDateString()), {
    path: ["checkIn"],
    message: "Check-in cannot be in the past",
  })
  .refine((v) => new Date(v.checkOut) > new Date(v.checkIn), {
    path: ["checkOut"],
    message: "Check-out must be after check-in",
  });

type BookingErrors = Partial<Record<"checkIn" | "checkOut" | "guests" | "roomType", string>>;

export function Hero() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<(typeof GUEST_OPTIONS)[number]>("2 Adults");
  const [roomType, setRoomType] = useState<(typeof ROOM_TYPES)[number]>("Deluxe Ocean Room");
  const [errors, setErrors] = useState<BookingErrors>({});
  const [confirmed, setConfirmed] = useState<null | {
    ref: string;
    nights: number;
    checkIn: string;
    checkOut: string;
    guests: string;
    roomType: string;
  }>(null);

  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = bookingSchema.safeParse({ checkIn, checkOut, guests, roomType });
    if (!result.success) {
      const fieldErrors: BookingErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof BookingErrors;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please check your booking details");
      return;
    }
    setErrors({});
    const nights = Math.round(
      (new Date(result.data.checkOut).getTime() - new Date(result.data.checkIn).getTime()) /
      86_400_000,
    );
    const ref = "OV-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setConfirmed({
      ref,
      nights,
      checkIn: result.data.checkIn,
      checkOut: result.data.checkOut,
      guests: result.data.guests,
      roomType: result.data.roomType,
    });
    toast.success("Booking request received", {
      description: `${result.data.roomType} · ${nights} night${nights > 1 ? "s" : ""} · Ref ${ref}`,
    });
  }

  function resetBooking() {
    setConfirmed(null);
    setCheckIn("");
    setCheckOut("");
  }

  return (
    <section id="home" className="relative min-h-svh w-full overflow-hidden">
      <Image
        src={heroImg.src}
        alt="OceanView Resort at sunset"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-b from-ocean-deep/40 via-ocean-deep/30 to-ocean-deep/80" />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
        <div className="max-w-3xl text-white">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs uppercase tracking-[0.25em]">Five Star · Indian Ocean</span>
          </div>
          <h1 className="font-display text-5xl font-medium leading-[1.05] md:text-7xl lg:text-8xl">
            Experience Paradise <br />
            <span className="text-gradient-gold italic">in Sri Lanka</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
            A private stretch of golden sand, candlelit dinners by the waves and suites where
            the horizon stretches forever. Welcome to OceanView Resort.
          </p>
        </div>

        {/* Quick booking */}
        {confirmed ? (
          <Confirmation booking={confirmed} onReset={resetBooking} />
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-10 rounded-2xl bg-white/95 p-4 shadow-luxe backdrop-blur md:mt-12 md:p-5"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-[1fr_1fr_1fr_1.2fr_auto]">
              <Field icon={<CalendarDays className="h-4 w-4" />} label="Check in" error={errors.checkIn}>
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
                />
              </Field>
              <Field icon={<CalendarDays className="h-4 w-4" />} label="Check out" error={errors.checkOut}>
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
                />
              </Field>
              <Field icon={<Users className="h-4 w-4" />} label="Guests" error={errors.guests}>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value as (typeof GUEST_OPTIONS)[number])}
                  className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
                >
                  {GUEST_OPTIONS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field icon={<BedDouble className="h-4 w-4" />} label="Room type" error={errors.roomType}>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as (typeof ROOM_TYPES)[number])}
                  className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
                >
                  {ROOM_TYPES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-ocean 
                px-6 py-4 text-sm font-medium text-primary-foreground transition hover:brightness-110"
              >
                <BedDouble className="h-4 w-4" />
                Check availability
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  children,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className={`flex min-w-0 items-center gap-3 rounded-xl border bg-background/60 px-4 py-3 ${error ? "border-destructive" : "border-border"
          }`}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">{icon}</span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
          {children}
        </span>
      </label>
      {error && <span className="px-1 text-xs text-destructive">{error}</span>}
    </div>
  );
}

function Confirmation({
  booking,
  onReset,
}: {
  booking: { ref: string; nights: number; checkIn: string; checkOut: string; guests: string; roomType: string };
  onReset: () => void;
}) {
  const fmt = (s: string) =>
    new Date(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  return (
    <div className="mt-10 overflow-hidden rounded-2xl bg-white/95 shadow-luxe backdrop-blur md:mt-12">
      <div className="flex items-center gap-3 bg-gradient-ocean px-5 py-4 text-white">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-gold-foreground">
          <Check className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <div className="font-display text-lg">Booking request confirmed</div>
          <div className="text-xs text-white/70">Reference {booking.ref} · Our concierge will email you shortly</div>
        </div>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Room" value={booking.roomType} />
        <Summary label="Stay" value={`${fmt(booking.checkIn)} → ${fmt(booking.checkOut)}`} />
        <Summary label="Nights" value={`${booking.nights}`} />
        <Summary label="Guests" value={booking.guests} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
        <span className="text-xs text-muted-foreground">A hold has been placed on this room for 30 minutes.</span>
        <button
          onClick={onReset}
          className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-primary hover:border-gold"
        >
          New search
        </button>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/50 px-4 py-3">
      <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-base text-primary">{value}</div>
    </div>
  );
}
