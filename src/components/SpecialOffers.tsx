import { Heart, Gift } from "lucide-react";
import honeymoon from "@/assets/offer-honeymoon.jpg";
import Image from "next/image";

export function SpecialOffers() {
  return (
    <section id="offers" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
      <div className="mb-10 text-center">
        <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">Limited Time</div>
        <h2 className="font-display text-4xl text-primary md:text-5xl">Special Offers</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Feature offer */}
        <div className="relative overflow-hidden rounded-3xl shadow-luxe lg:col-span-3">
          <Image
            src={honeymoon.src} alt="Honeymoon package" loading="lazy" width={1600} height={900}
            className="h-full max-h-130 w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-tr from-ocean-deep/85 via-ocean-deep/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white md:p-12">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-foreground">
              <Heart className="h-3 w-3" /> Honeymoon Package
            </div>
            <h3 className="font-display text-3xl md:text-5xl">20% off with a complimentary candlelight dinner</h3>
            <p className="mt-3 max-w-xl text-sm text-white/80">
              Three nights in an ocean suite, sunset cruise, couples spa and a private beach
              dinner under the stars. Valid for stays through August.
            </p>
            <button className="mt-6 w-fit rounded-full bg-white px-6 py-3 text-sm font-medium text-primary transition hover:bg-white/90">
              View package
            </button>
          </div>
        </div>

        {/* Secondary offers */}
        <div className="grid gap-6 lg:col-span-2">
          <OfferCard
            tag="Family Escape"
            title="Kids stay free · 4 nights"
            desc="Two adults plus two children under 12 stay in connecting rooms. Includes daily breakfast and a kids' adventure pass."
            cta="15% off"
          />
          <OfferCard
            tag="Long Stay"
            title="7 for 5 nights"
            desc="Book five nights, stay seven. Includes daily breakfast, one spa treatment and airport transfers."
            cta="Save USD 320"
          />
        </div>
      </div>
    </section>
  );
}

function OfferCard({ tag, title, desc, cta }: { tag: string; title: string; desc: string; cta: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-7">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold">
          <Gift className="h-3 w-3" /> {tag}
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">{cta}</span>
      </div>
      <h4 className="font-display text-2xl text-primary">{title}</h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <button className="mt-auto self-start text-sm font-medium text-primary underline-offset-4 hover:underline">
        Reserve this offer →
      </button>
    </div>
  );
}
