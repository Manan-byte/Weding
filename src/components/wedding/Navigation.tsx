import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Tentang Kami", href: "#story" },
  { label: "Acara", href: "#events" },
  { label: "Quote", href: "#gallery" },
  { label: "Hadiah", href: "#gift" },
  { label: "Ucapan", href: "#wishes" },
];

const Navigation = memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = useCallback((href: string) => {
    setMobileOpen(false);
    // Delay scroll to let mobile menu close first, preventing scroll conflicts
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        const navHeight = 64; // h-16 = 4rem = 64px
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 300);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 shadow-elegant border-b border-gold/10"
          : "bg-transparent"
      }`}
    >
      <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-script text-2xl text-gold-dark transition-colors"
        >
          I & M
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => handleClick(link.href)}
              className={`font-body text-sm tracking-wider transition-colors hover:text-gold-dark ${
                scrolled ? "text-foreground" : "text-foreground/80"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground transition-colors p-2 -mr-2"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/98 border-b border-gold/10"
          >
            <div className="flex flex-col items-center gap-4 py-6">
              {links.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleClick(link.href)}
                  className="font-body text-sm tracking-wider text-foreground hover:text-gold-dark active:text-gold-dark transition-colors py-2 px-6"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
});

Navigation.displayName = "Navigation";

export default Navigation;
