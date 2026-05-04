import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import floralTL from "@/assets/floral-watercolor-tl.webp";
import floralBR from "@/assets/floral-watercolor-br.webp";
import FallingLeaves from "./FallingLeaves";

import coupleGarden1 from "@/assets/couple-garden-1.webp";
import coupleGarden2 from "@/assets/couple-garden-2.webp";
import coupleGarden3 from "@/assets/couple-garden-3.webp";
import coupleGarden4 from "@/assets/couple-garden-4.webp";
import galleryTable from "@/assets/gallery-table.webp";
import galleryCake from "@/assets/gallery-cake.webp";
import galleryLovebirds from "@/assets/gallery-lovebirds.webp";
import outdoorHero from "@/assets/outdoor-wedding-hero.webp";

const photos = [
  { src: coupleGarden1, alt: "Irma & Manan - Foto Bersama di Taman", span: "md:col-span-2 md:row-span-2", height: "h-48 md:h-[540px]" },
  { src: coupleGarden2, alt: "Irma & Manan - Jalan Bersama", span: "", height: "h-48 md:h-64" },
  { src: coupleGarden4, alt: "Irma & Manan - Cincin", span: "", height: "h-48 md:h-64" },
  { src: coupleGarden3, alt: "Irma & Manan - Di Bangku Taman", span: "", height: "h-48 md:h-64" },
  { src: galleryLovebirds, alt: "Burung Cinta Emas", span: "", height: "h-48 md:h-64" },
  { src: outdoorHero, alt: "Dekorasi Taman Pernikahan", span: "md:col-span-2", height: "h-48 md:h-72" },
  { src: galleryTable, alt: "Dekorasi Meja", span: "", height: "h-48 md:h-72" },
  { src: galleryCake, alt: "Kue Pernikahan", span: "", height: "h-48 md:h-72" },
];

const photoVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 30,
    scale: 0.95,
    rotate: i % 2 === 0 ? -1 : 1,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
  },
};

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipe = 50;

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [selectedIndex]);

  const handleTouchStart = (e: React.TouchEvent) => { touchEnd.current = null; touchStart.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEnd.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    if (Math.abs(distance) >= minSwipe) { if (distance > 0) goNext(); else goPrev(); }
    touchStart.current = null; touchEnd.current = null;
  };

  const goNext = useCallback(() => { setSelectedIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null)); }, []);
  const goPrev = useCallback(() => { setSelectedIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null)); }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, goNext, goPrev]);

  return (
    <section id="gallery" className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(100 20% 97%) 0%, hsl(140 35% 90%) 100%)" }}>
      <img src={floralTL} alt="" className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-70" loading="lazy" decoding="async" width={256} height={256} />
      <img src={floralBR} alt="" className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-70" loading="lazy" decoding="async" width={256} height={256} />
      <FallingLeaves count={8} />

      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="font-body text-xs sm:text-sm tracking-[0.3em] uppercase text-sage-green-deep mb-3">Momen Bahagia</p>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">Galeri Foto</h2>
          <div className="ornament-divider max-w-xs mx-auto">
            <Heart className="w-5 h-5 text-gold-dark fill-gold-dark" />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.alt}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={photoVariants}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`${photo.span} cursor-pointer group overflow-hidden rounded-lg shadow-md active:scale-95 transition-all border border-gold/10`}
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                width={512}
                height={384}
                className={`w-full ${photo.height} object-cover transition-transform duration-700 group-hover:scale-110`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-2 sm:p-4"
            onClick={() => setSelectedIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }} className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-10 h-10 rounded-full bg-foreground/50 hover:bg-foreground/70 active:bg-foreground/80 flex items-center justify-center transition">
              <X className="w-5 h-5 text-cream" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-1 sm:left-2 md:left-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-foreground/50 hover:bg-foreground/70 active:bg-foreground/80 flex items-center justify-center transition">
              <ChevronLeft className="w-6 h-6 text-cream" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-1 sm:right-2 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-foreground/50 hover:bg-foreground/70 active:bg-foreground/80 flex items-center justify-center transition">
              <ChevronRight className="w-6 h-6 text-cream" />
            </button>
            <motion.img
              key={selectedIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              src={photos[selectedIndex].src}
              alt={photos[selectedIndex].alt}
              className="max-w-[95vw] sm:max-w-full max-h-[85vh] sm:max-h-[90vh] rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 font-body text-xs text-cream/70 tracking-wider">{selectedIndex + 1} / {photos.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
