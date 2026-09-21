"use client";

import { useState, useEffect } from "react";
import { Menu, X, Calendar, LogIn, User as UserIcon, LogOut } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import AuthPopup from "./auth/AuthPopup";

const links = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Services" },
  { href: "#offers", label: "Offers" },
  { href: "#contact", label: "Contact" },
];

const mobileMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

interface UserData {
  name: string;
  role: string;
}

export function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // User State
  const [user, setUser] = useState<UserData | null>(null);

  const checkUserAuth = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser({ name: "User", role: "GUEST" });
        }
      } else if (token) {
        setUser({ name: "Guest User", role: "GUEST" });
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    checkUserAuth();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  const handleLinkClick = () => setOpen(false);
  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    checkUserAuth();
  };

  const handleBookStay = () => {
    if (user) {
      router.push("/rooms");
    } else {
      setIsPopupOpen(true);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 z-50 w-full transition-colors duration-300 ${isScrolled ? "bg-slate-900/90 backdrop-blur-md shadow-md" : "bg-transparent backdrop-blur-md"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-ocean text-gold font-display text-lg">
              O
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold text-white">
                OceanView
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                Resort · Sri Lanka
              </div>
            </div>
          </a>

          {/* Navigation Links - Desktop */}
          <nav className="hidden items-center gap-8 md:flex absolute left-1/2 -translate-x-1/2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm transition-colors duration-300 text-white/80 hover:text-white hover:scale-105"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right Side Controls - Desktop */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Book a stay Button */}
            <button
              onClick={handleBookStay}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7c948] to-[#e8b42b] px-5 py-2 text-sm font-medium
              text-[#141e2a] shadow-lg shadow-[#f7c948]/30 transition hover:brightness-105 cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              Book a stay
            </button>

            {/* Auth Profile Section / Login Button */}
            {user ? (
              <div className="flex items-center gap-3 bg-white/10 rounded-full px-3.5 py-1.5 border border-white/20">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-500/20 text-gold border border-gold/40">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div className="leading-tight text-left">
                  <div className="text-xs font-semibold text-white">{user.name}</div>
                  <div className="text-[9px] uppercase tracking-wider text-amber-400 font-mono">
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="ml-1 text-white/60 hover:text-red-400 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenPopup}
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium
                text-white hover:bg-white/20 transition cursor-pointer"
              >
                <LogIn className="h-4 w-4 text-gold" />
                Login
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="md:hidden text-white"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="border-t border-white/10 bg-slate-900/95 backdrop-blur-md md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2 px-5 py-4">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={handleLinkClick}
                    className="rounded-lg px-3 py-2 text-sm text-center text-white/80 hover:bg-white/10 hover:text-white transition"
                  >
                    {l.label}
                  </a>
                ))}

                <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      handleLinkClick();
                      handleBookStay();
                    }}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7c948] to-[#e8b42b] px-4 py-2.5 text-sm font-medium text-[#141e2a]"
                  >
                    <Calendar className="h-4 w-4" />
                    Book a stay
                  </button>

                  {user ? (
                    <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 mt-1">
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-gold" />
                        <div className="text-left">
                          <div className="text-xs font-semibold text-white">{user.name}</div>
                          <div className="text-[9px] uppercase tracking-wider text-amber-400">
                            {user.role}
                          </div>
                        </div>
                      </div>
                      <button onClick={handleLogout} className="text-red-400 text-xs font-medium">
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleLinkClick();
                        handleOpenPopup();
                      }}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-white"
                    >
                      <LogIn className="h-4 w-4 text-gold" />
                      Login
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AuthPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onOpen={handleOpenPopup}
      />
    </>
  );
}