"use client";

import { useState, useEffect } from "react";
import { Menu, X, Calendar, LogIn } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
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
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  // Close mobile menu on link click
  const handleLinkClick = () => {
    setOpen(false);
  };

  // Open popup handlers
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 z-50 w-full bg-transparent backdrop-blur-md border-b border-white/10"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          {/* Logo - Left aligned */}
          <a href="#home" className="flex items-center gap-2 flex-shrink-0">
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

          {/* Center navigation links - Desktop */}
          <nav className="hidden items-center gap-8 md:flex absolute left-1/2 -translate-x-1/2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/80 transition hover:text-white hover:scale-105"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right side buttons - Desktop */}
          <div className="hidden items-center gap-3 md:flex">
            {/* <button
              onClick={handleOpenPopup}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button> */}
            <button
              onClick={handleOpenPopup}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7c948] to-[#e8b42b] px-5 py-2 text-sm font-medium text-[#141e2a] shadow-lg shadow-[#f7c948]/30 transition hover:brightness-105"
            >
              <Calendar className="h-4 w-4" />
              Book a stay
            </button>
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

        <AnimatePresence>
          {open && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="border-t border-white/10 bg-transparent backdrop-blur-md md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 px-5 py-3">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={handleLinkClick}
                    className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white text-center"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="mt-2 flex flex-col gap-2">
                  {/* <button
                    onClick={() => {
                      handleLinkClick();
                      handleOpenPopup();
                    }}
                    className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </button> */}
                  <button
                    onClick={() => {
                      handleLinkClick();
                      handleOpenPopup();
                    }}
                    className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#f7c948] to-[#e8b42b] px-4 py-2 text-sm font-medium text-[#141e2a] shadow-lg shadow-[#f7c948]/30"
                  >
                    <Calendar className="h-4 w-4" />
                    Book a stay
                  </button>
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