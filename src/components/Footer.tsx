import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-gradient-ocean text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 font-display text-gold">O</span>
            <div>
              <div className="font-display text-xl">OceanView Resort</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60">Bentota · Sri Lanka</div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm text-white/70">
            A premium beachfront sanctuary on Sri Lanka's south coast — where heritage hospitality
            meets contemporary luxury.
          </p>
        </div>
        <div>
          <div className="mb-4 text-xs uppercase tracking-widest text-gold">Contact</div>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />Galle Road, Bentota, Sri Lanka</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" />+94 34 555 1212</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" />stay@oceanview.lk</li>
          </ul>
        </div>
        <div>
          <div className="mb-4 text-xs uppercase tracking-widest text-gold">Follow</div>
          <div className="flex gap-3">
            <a className="grid h-10 w-10 place-items-center rounded-full border border-white/20 hover:border-gold" href="#"><Instagram className="h-4 w-4" /></a>
            <a className="grid h-10 w-10 place-items-center rounded-full border border-white/20 hover:border-gold" href="#"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} OceanView Resort. Crafted with care in Sri Lanka.
      </div>
    </footer>
  );
}
