import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import floralTL from "@/assets/floral-watercolor-tl.png";
import floralTR from "@/assets/floral-watercolor-tr.png";
import floralBL from "@/assets/floral-watercolor-bl.png";
import floralBR from "@/assets/floral-watercolor-br.png";

interface EntranceCoverProps {
  onOpen: () => void;
}

const EntranceCover = ({ onOpen }: EntranceCoverProps) => {
  const [phase, setPhase] = useState<"cover" | "opening" | "done">("cover");
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get("to");
  const introAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const introAudio = new Audio("/music/cover-intro.mp3");
    introAudio.volume = 0.20;
    introAudio.loop = true;
    introAudio.preload = "auto";
    introAudioRef.current = introAudio;

    introAudio.play().catch(() => {});

    return () => {
      introAudio.pause();
      introAudio.currentTime = 0;
      introAudioRef.current = null;
    };
  }, []);

  const handleOpen = () => {
    window.scrollTo(0, 0);

    // Smooth fade-out for intro audio
    if (introAudioRef.current) {
      const audio = introAudioRef.current;
      const fadeDuration = 1500; // ms
      const steps = 20;
      const stepTime = fadeDuration / steps;
      const volumeStep = audio.volume / steps;
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(0, audio.volume - volumeStep);
        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          audio.pause();
          audio.currentTime = 0;
        }
      }, stepTime);
    }

    setPhase("opening");
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 1800);
  };

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Background layers that peel away */}
      <motion.div
        initial={false}
        animate={
          phase === "opening"
            ? { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0 100%)", opacity: 0 }
            : { clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)", opacity: 1 }
        }
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(140 35% 90%), hsl(100 20% 97%), hsl(80 30% 96%))" }}
      >
        <img src={floralTL} alt="" className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 object-contain" width={256} height={256} />
        <img src={floralBL} alt="" className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 object-contain" width={256} height={256} />
      </motion.div>

      <motion.div
        initial={false}
        animate={
          phase === "opening"
            ? { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)", opacity: 0 }
            : { clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)", opacity: 1 }
        }
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 overflow-hidden"
        style={{ background: "linear-gradient(225deg, hsl(60 30% 94%), hsl(100 20% 97%), hsl(80 30% 96%))" }}
      >
        <img src={floralTR} alt="" className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 object-contain" width={256} height={256} />
        <img src={floralBR} alt="" className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 object-contain" width={256} height={256} />
      </motion.div>

      {/* Decorative center seam with glow */}
      <motion.div
        initial={false}
        animate={
          phase === "opening"
            ? { opacity: 0, scaleY: 0, filter: "blur(8px)" }
            : { opacity: 1, scaleY: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.6 }}
        className="absolute left-1/2 top-[10%] bottom-[10%] w-px -translate-x-1/2 z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, hsl(36 60% 55% / 0.5), hsl(33 55% 42% / 0.6), hsl(36 60% 55% / 0.5), transparent)",
          boxShadow: "0 0 12px 2px hsl(36 60% 55% / 0.15)",
        }}
      />

      {/* Shimmer particles on open */}
      <AnimatePresence>
        {phase === "opening" && (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${50 + (Math.cos((i * Math.PI * 2) / 12) * 60)}%`,
                  y: `${50 + (Math.sin((i * Math.PI * 2) / 12) * 60)}%`,
                  scale: [0, 1.5, 0],
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.04,
                  ease: "easeOut",
                }}
                className="absolute w-1.5 h-1.5 rounded-full z-30 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, hsl(36 60% 65%), hsl(36 60% 55% / 0))`,
                  left: 0,
                  top: 0,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Cover content */}
      <AnimatePresence>
        {phase === "cover" && (
          <motion.div
            key="content"
            exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
          >
            {/* Animated gold border frame */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="absolute inset-4 sm:inset-6 md:inset-12 pointer-events-none"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="absolute top-0 left-0 right-0 h-px origin-left"
                style={{ background: "linear-gradient(90deg, hsl(36 60% 55% / 0.5), hsl(33 55% 42% / 0.3), transparent)" }}
              />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                className="absolute top-0 right-0 bottom-0 w-px origin-top"
                style={{ background: "linear-gradient(180deg, hsl(36 60% 55% / 0.5), hsl(33 55% 42% / 0.3), transparent)" }}
              />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                className="absolute bottom-0 left-0 right-0 h-px origin-right"
                style={{ background: "linear-gradient(270deg, hsl(36 60% 55% / 0.5), hsl(33 55% 42% / 0.3), transparent)" }}
              />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 bottom-0 w-px origin-bottom"
                style={{ background: "linear-gradient(0deg, hsl(36 60% 55% / 0.5), hsl(33 55% 42% / 0.3), transparent)" }}
              />
            </motion.div>

            {/* Top ornament */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-24 sm:w-32 h-px mb-6 sm:mb-8"
              style={{ background: "linear-gradient(90deg, transparent, hsl(33 55% 42%), transparent)" }}
            />

            {/* Envelope icon with breathing glow */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 120, damping: 12 }}
              className="text-gold-dark mb-4 sm:mb-6 relative"
            >
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full blur-xl"
                style={{ background: "hsl(36 60% 55% / 0.3)" }}
              />
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-12 sm:h-12 relative z-10">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </motion.div>

            {/* Guest name */}
            {guestName && (
              <>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="font-body text-[10px] sm:text-xs tracking-[0.2em] text-foreground/60 mb-1">
                  Kepada Yth.
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="font-body text-xs sm:text-sm md:text-base tracking-wider text-foreground mb-3 sm:mb-4 text-center">
                  Bapak/Ibu/Saudara/i {decodeURIComponent(guestName)}
                </motion.p>
              </>
            )}

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: guestName ? 0.55 : 0.4 }}
              className="font-body text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-gold-dark/80 mb-3 sm:mb-4"
            >
              Undangan Pernikahan
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-script text-4xl sm:text-5xl md:text-7xl text-gold-dark mb-2"
            >
              Irma & Manan
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="font-body text-xs sm:text-sm text-foreground/70 tracking-wider mb-8 sm:mb-10"
            >
              10 Juni 2026
            </motion.p>

            {/* Bottom ornament */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-24 sm:w-32 h-px mb-8 sm:mb-10"
              style={{ background: "linear-gradient(90deg, transparent, hsl(33 55% 42%), transparent)" }}
            />

            {/* Open button with shimmer effect */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(36 60% 55% / 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="relative px-8 sm:px-10 py-3 sm:py-3.5 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-sm font-body text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold-dark overflow-hidden transition-colors hover:bg-gold/20"
            >
              <motion.div
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute inset-0 w-1/2"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(36 60% 65% / 0.3), transparent)",
                }}
              />
              <span className="relative z-10">Buka Undangan</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntranceCover;
