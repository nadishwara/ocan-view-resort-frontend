"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import {
  Menu, X, Calendar, LogIn, User as UserIcon, LogOut,
  LayoutDashboard, Settings, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import AuthPopup from "./auth/AuthPopup";
import { TokenService } from "@/app/services/tokenService";
import { AuthService } from "@/app/services/authService";

const links = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Services" },
  { href: "#offers", label: "Offers" },
  { href: "#contact", label: "Contact" },
];

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } },
};

interface UserData {
  username?: string;
  name?: string;
  role?: string;
  roles?: string[];
}

function UrlAuthWatcher({
  onRequireLogin,
  onCleanLogin,
}: {
  onRequireLogin: () => void;
  onCleanLogin: () => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      const token = typeof window !== "undefined"
        ? (localStorage.getItem("token") || localStorage.getItem("auth_token"))
        : null;

      if (token) {
        onCleanLogin();
      } else {
        onRequireLogin();
      }
    }
  }, [searchParams, pathname, onRequireLogin, onCleanLogin]);

  return null;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [user, setUser] = useState<UserData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const stripLoginParam = useCallback(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("login")) {
        url.searchParams.delete("login");
        const cleanUrl = url.pathname + (url.search ? url.search : "");
        window.history.replaceState({}, "", cleanUrl);
      }
    }
  }, []);

  const checkUserAuth = useCallback(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      if (!token) {
        setUser(null);
        return;
      }

      let name = "User";
      let role = "USER";

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          name = parsed.name || parsed.username || "User";
          const parsedRole = String(parsed.role ?? "").toUpperCase();
          const parsedRoles: string[] = Array.isArray(parsed.roles) ? parsed.roles : [];
          if (
            parsedRole.includes("ADMIN") ||
            parsedRoles.some((r) => String(r).toUpperCase().includes("ADMIN"))
          ) {
            role = "ADMIN";
          }
        } catch {
          // fallback to token decoding below
        }
      }

      // Check token directly for administrator privileges
      if (TokenService.isAdmin(token)) {
        role = "ADMIN";
      }

      const decoded = TokenService.decode(token);
      if (decoded && name === "User") {
        name = (decoded as any).name || decoded.sub || "User";
      }

      setUser({ name, role });
    }
  }, []);

  useEffect(() => {
    checkUserAuth();

    const handleAuthChange = () => {
      checkUserAuth();
    };

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
    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [prevScrollY, checkUserAuth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => setOpen(false);
  const handleOpenPopup = () => setIsPopupOpen(true);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    stripLoginParam();
    checkUserAuth();
  };

  const handleBookStay = () => {
    if (user) {
      window.location.href = "/rooms";
    } else {
      setIsPopupOpen(true);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = "/";
  };

  const isAdmin = user?.role?.toUpperCase().includes("ADMIN");
  const dashboardPath = isAdmin ? "/admin/dashboard" : "/dashboard";

  const handleNavigate = (path: string) => {
    setIsDropdownOpen(false);
    setOpen(false);

    if (typeof window !== "undefined") {
      stripLoginParam();

      // Ensure freshly synced cookies for middleware inspection
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      if (token) {
        const maxAgeDays = 7 * 86400;
        const expires = new Date(Date.now() + 7 * 86400 * 1000).toUTCString();
        const isSecure = window.location.protocol === "https:";
        const secureFlag = isSecure ? "; Secure" : "";

        document.cookie = `token=${token}; path=/; max-age=${maxAgeDays}; expires=${expires}; SameSite=Lax${secureFlag}`;
        document.cookie = `auth_token=${token}; path=/; max-age=${maxAgeDays}; expires=${expires}; SameSite=Lax${secureFlag}`;
      }

      window.location.href = path;
    }
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
          <Link href="/" className="flex items-center gap-2 shrink-0">
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
          </Link>

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
            <button
              onClick={handleBookStay}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7c948] to-[#e8b42b] px-5 py-2 text-sm font-medium
              text-[#141e2a] shadow-lg shadow-[#f7c948]/30 transition hover:brightness-105 cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              Book a stay
            </button>

            {/* Auth Profile / Dropdown Section */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition rounded-full px-3.5 py-1.5 border border-white/30 backdrop-blur-md cursor-pointer"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-500/20 text-gold border border-gold/40">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="leading-tight text-left">
                    <div className="text-xs font-semibold text-white">{user.name}</div>
                    <div className="text-[9px] uppercase tracking-wider text-amber-400 font-mono">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-white/60 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/30 shadow-2xl p-2 z-50 text-white"
                    >
                      <div className="px-3 py-2 border-b border-white/15 mb-1">
                        <p className="text-xs font-semibold text-white">{user.name}</p>
                        <p className="text-[10px] text-white/60">Logged in</p>
                      </div>

                      <button
                        onClick={() => handleNavigate(dashboardPath)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/20 hover:text-white rounded-xl transition cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4 text-gold" />
                        Dashboard
                      </button>

                      <button
                        onClick={() => handleNavigate("/profile")}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/20 hover:text-white rounded-xl transition cursor-pointer"
                      >
                        <UserIcon className="h-4 w-4 text-gold" />
                        Profile
                      </button>

                      <button
                        onClick={() => handleNavigate("/settings")}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/20 hover:text-white rounded-xl transition cursor-pointer"
                      >
                        <Settings className="h-4 w-4 text-gold" />
                        Settings
                      </button>

                      <div className="h-px bg-white/15 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 rounded-xl transition cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleOpenPopup}
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium
                text-white hover:bg-white/20 transition cursor-pointer backdrop-blur-md"
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
            className="md:hidden text-white cursor-pointer"
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
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7c948] to-[#e8b42b] px-4 py-2.5 text-sm font-medium text-[#141e2a] cursor-pointer"
                  >
                    <Calendar className="h-4 w-4" />
                    Book a stay
                  </button>

                  {user ? (
                    <div className="flex flex-col gap-2 bg-white/10 border border-white/30 backdrop-blur-md rounded-2xl p-3 mt-1">
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-gold" />
                        <div className="text-left">
                          <div className="text-xs font-semibold text-white">{user.name}</div>
                          <div className="text-[9px] uppercase tracking-wider text-amber-400 font-mono">
                            {user.role}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/15">
                        <button
                          onClick={() => handleNavigate(dashboardPath)}
                          className="flex items-center justify-center gap-1.5 py-2 text-xs bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-gold" />
                          Dashboard
                        </button>
                        <button
                          onClick={() => handleNavigate("/profile")}
                          className="flex items-center justify-center gap-1.5 py-2 text-xs bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
                        >
                          <UserIcon className="h-3.5 w-3.5 text-gold" />
                          Profile
                        </button>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full mt-1 py-1.5 text-xs text-red-400 hover:bg-red-500/20 rounded-xl transition cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleLinkClick();
                        handleOpenPopup();
                      }}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-white cursor-pointer backdrop-blur-md hover:bg-white/20 transition"
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

      <Suspense fallback={null}>
        <UrlAuthWatcher
          onRequireLogin={() => setIsPopupOpen(true)}
          onCleanLogin={stripLoginParam}
        />
      </Suspense>

      <AuthPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onOpen={handleOpenPopup}
      />
    </>
  );
}