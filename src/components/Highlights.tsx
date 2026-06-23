import { Waves, Home, Utensils, Sparkles } from "lucide-react";

const items = [
  { icon: Home, title: "Deluxe Ocean Rooms", desc: "King beds, private balconies and uninterrupted sea views." },
  { icon: Sparkles, title: "Family Suites", desc: "Two-bedroom suites for memorable family escapes." },
  { icon: Waves, title: "Jet Ski Riding", desc: "Thrills on turquoise waters with our certified instructors." },
  { icon: Utensils, title: "Dine Around Pass", desc: "Five signature restaurants. One seamless culinary journey." },
];

export function Highlights() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">The Resort</div>
        <h2 className="font-display text-4xl text-primary md:text-5xl">A sanctuary by the sea</h2>
        <p className="mt-4 text-muted-foreground">
          Every detail at OceanView is composed to feel like a slow exhale — from the linen on
          your bed to the spices in your evening curry.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-luxe"
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-ocean text-gold">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-primary">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
