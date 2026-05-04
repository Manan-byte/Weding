import { motion } from "framer-motion";
import outdoorHero from "@/assets/outdoor-wedding-hero.webp";
import floralTL from "@/assets/floral-watercolor-tl.webp";
import floralTR from "@/assets/floral-watercolor-tr.webp";
import CountdownTimer from "./CountdownTimer";
import FallingLeaves from "./FallingLeaves";

const HeroSection = () => {
  const weddingDate = new Date("2026-06-10T08:00:00");

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <FallingLeaves count={10} />
      <div className="absolute inset-0">
        <img
          src={outdoorHero}
          alt="Garden Wedding Irma & Manan"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      <img src={floralTL} alt="" className="absolute top-0 left-0 w-28 h-28 md:w-40 md:h-40 object-contain pointer-events-none z-10 opacity-80" loading="lazy" decoding="async" width={256} height={256} />
      <img src={floralTR} alt="" className="absolute top-0 right-0 w-28 h-28 md:w-40 md:h-40 object-contain pointer-events-none z-10 opacity-80" loading="lazy" decoding="async" width={256} height={256} />

      <motion.div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-body text-white/90 tracking-[0.3em] uppercase text-xs sm:text-sm mb-4 sm:mb-6">
          Kabar Bahagia
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="font-script text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white mb-0 leading-tight drop-shadow-lg">
          Irma
        </motion.h1>

        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="text-white text-xl sm:text-3xl md:text-4xl font-script my-1 md:my-2">
          &amp;
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="font-script text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-lg">
          Manan
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="font-body text-white/90 text-base sm:text-lg tracking-wider mb-8 sm:mb-12">
          10 Juni 2026
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}>
          <CountdownTimer targetDate={weddingDate} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-10 rounded-full border-2 border-gold/50 flex items-start justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
