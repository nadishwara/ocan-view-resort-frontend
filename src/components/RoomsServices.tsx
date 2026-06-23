import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomFamily from "@/assets/room-family.jpg";
import roomPresidential from "@/assets/room-presidential.jpg";
import activityJetski from "@/assets/activity-jetski.jpg";
import foodCurry from "@/assets/food-curry.jpg";
import foodBuffet from "@/assets/food-buffet.jpg";

type Status = "Available" | "Few left" | "Sold out";

type Item = {
  title: string;
  img: any;
  priceLkr?: number;
  priceUsd?: number;
  status: Status;
  badge?: string;
  desc: string;
};

const rooms: Item[] = [
  { title: "Deluxe Ocean Room", img: roomDeluxe, priceLkr: 38500, priceUsd: 120, status: "Available", desc: "King bed · Sea-facing balcony · 45 m²" },
  { title: "Family Suite", img: roomFamily, priceLkr: 62000, priceUsd: 195, status: "Few left", badge: "Only 2 rooms left", desc: "Two bedrooms · Lounge · 80 m²" },
  { title: "Presidential Villa", img: roomPresidential, priceLkr: 165000, priceUsd: 520, status: "Available", desc: "Private plunge pool · Butler · 220 m²" },
];

const services: Item[] = [
  { title: "Jet Ski Riding", img: activityJetski, priceLkr: 18500, priceUsd: 58, status: "Available", desc: "30-min guided ride on turquoise waters" },
  { title: "Sri Lankan Rice & Curry", img: foodCurry, priceLkr: 4200, priceUsd: 14, status: "Available", desc: "Banana leaf platter · 8 curries · chef's selection" },
  { title: "Dine Around Pass", img: foodBuffet, priceLkr: 24000, priceUsd: 75, status: "Available", badge: "Most loved", desc: "All 5 restaurants · breakfast, lunch & dinner" },
];

export function RoomsServices() {
  return (
    <section id="rooms" className="bg-gradient-to-b from-secondary/40 to-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">Stay & Experience</div>
            <h2 className="font-display text-4xl text-primary md:text-5xl">Rooms & Services</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Choose your retreat — from intimate ocean rooms to villas with private plunge pools.
            All rates include breakfast and resort access.
          </p>
        </div>

        <h3 className="font-display text-2xl text-primary">Rooms</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r) => <Card key={r.title} item={r} />)}
        </div>

        <h3 className="mt-16 font-display text-2xl text-primary">Activities & Dining</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <Card key={s.title} item={s} />)}
        </div>
      </div>
    </section>
  );
}

function Card({ item }: { item: Item }) {
  const badgeTone =
    item.status === "Sold out" ? "bg-destructive text-destructive-foreground"
      : item.status === "Few left" ? "bg-gradient-gold text-gold-foreground"
      : "bg-primary/10 text-primary";
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-luxe">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.img.src}
          alt={item.title}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${badgeTone}`}>
          {item.badge ?? item.status}
        </span>
      </div>
      <div className="p-5">
        <h4 className="font-display text-xl text-primary">{item.title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">From</div>
            <div className="font-display text-2xl text-primary">
              LKR {item.priceLkr?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">≈ USD {item.priceUsd}</div>
          </div>
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/90">
            Reserve
          </button>
        </div>
      </div>
    </article>
  );
}
