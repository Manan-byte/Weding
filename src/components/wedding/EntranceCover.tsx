import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import floralTL from "@/assets/floral-watercolor-tl.webp";
import floralTR from "@/assets/floral-watercolor-tr.webp";
import floralBL from "@/assets/floral-watercolor-bl.webp";
import floralBR from "@/assets/floral-watercolor-br.webp";

interface EntranceCoverProps {
  onOpen: () => void;
}

const EntranceCover = ({ onOpen }: EntranceCoverProps) => {
  const [phase, setPhase] = useState<"cover" | "opening" | "done">("cover");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get("to");
  const introAudioRef = useRef<HTMLAudioElement | null>(null);

  const ensureIntroAudio = useCallback(() => {
    if (introAudioRef.current) return introAudioRef.current;

    const introAudio = new Audio("/music/cover-intro.mp3");
    introAudio.volume = 0.20;
    introAudio.loop = true;
    introAudio.preload = "auto";
    introAudioRef.current = introAudio;

    return introAudio;
  }, []);

  useEffect(() => {
    return () => {
      if (!introAudioRef.current) return;
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
      introAudioRef.current = null;
    };
  }, []);

  const handleCoverInteraction = useCallback(() => {
    const introAudio = ensureIntroAudio();
    if (introAudio.paused) {
      introAudio.play()
        .then(() => setAudioPlaying(true))
        .catch(() => {});
    }
  }, [ensureIntroAudio]);

  useEffect(() => {
    if (audioPlaying) return;

    let cancelled = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartT = 0;

    const tryPlay = () => {
      if (cancelled) return;
      const introAudio = ensureIntroAudio();
      if (!introAudio.paused) return;
      introAudio.play()
        .then(() => {
          if (cancelled) return;
          setAudioPlaying(true);
          cleanup();
        })
        .catch(() => {});
    };

    // Track touch start so we can ignore swipes/scrolls and only act on real taps.
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchStartT = Date.now();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = Math.abs(t.clientX - touchStartX);
      const dy = Math.abs(t.clientY - touchStartY);
      const dt = Date.now() - touchStartT;

      // Scale movement threshold to device size so it feels consistent
      // on small phones and large tablets. ~1.2% of the smaller viewport
      // edge, clamped to a sane range (6–14 px).
      const minEdge = Math.min(window.innerWidth, window.innerHeight);
      const moveThreshold = Math.max(6, Math.min(14, minEdge * 0.012));

      // Real tap = quick (<= 250ms) + minimal movement on both axes.
      if (dt <= 250 && dx <= moveThreshold && dy <= moveThreshold) {
        tryPlay();
      }
    };

    const onClick = () => tryPlay();
    const onKeyDown = () => tryPlay();

    const cleanup = () => {
      cancelled = true;
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("click", onClick, { passive: true });
    document.addEventListener("keydown", onKeyDown, { passive: true });

    return cleanup;
  }, [audioPlaying, ensureIntroAudio]);

  const handleOpen = () => {
    const introAudio = ensureIntroAudio();
    if (introAudio.paused) {
      introAudio.play()
        .then(() => setAudioPlaying(true))
        .catch(() => {});
    }

    window.scrollTo(0, 0);

    // Fade out intro audio
    if (introAudioRef.current) {
      const audio = introAudioRef.current;
      const fadeDuration = 1200;
      const steps = 15;
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
    }, 1200);
  };

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100]" onClick={handleCoverInteraction} onTouchStart={handleCoverInteraction}>
      {/* Left panel — slides left using GPU-accelerated transform */}
      <motion.div
        initial={false}
        animate={phase === "opening" ? { x: "-100%" } : { x: "0%" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 will-change-transform"
        style={{
          background: "linear-gradient(135deg, hsl(140 35% 90%), hsl(100 20% 97%), hsl(80 30% 96%))",
          clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
        }}
      >
        <img src={floralTL} alt="" className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 object-contain" width={256} height={256} />
        <img src={floralBL} alt="" className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 object-contain" width={256} height={256} />
      </motion.div>

      {/* Right panel — slides right using GPU-accelerated transform */}
      <motion.div
        initial={false}
        animate={phase === "opening" ? { x: "100%" } : { x: "0%" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 will-change-transform"
        style={{
          background: "linear-gradient(225deg, hsl(60 30% 94%), hsl(100 20% 97%), hsl(80 30% 96%))",
          clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
        }}
      >
        <img src={floralTR} alt="" className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 object-contain" width={256} height={256} />
        <img src={floralBR} alt="" className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 object-contain" width={256} height={256} />
      </motion.div>

      {/* Center seam — simple opacity fade, no blur animation */}
      <motion.div
        initial={false}
        animate={phase === "opening" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute left-1/2 top-[10%] bottom-[10%] w-px -translate-x-1/2 z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, hsl(36 60% 55% / 0.5), hsl(33 55% 42% / 0.6), hsl(36 60% 55% / 0.5), transparent)",
        }}
      />

      {/* Cover content */}
      <AnimatePresence>
        {phase === "cover" && (
          <motion.div
            key="content"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 py-6 overflow-y-auto landscape:max-[500px]:justify-start landscape:max-[500px]:py-4"
            onClick={handleCoverInteraction}
            onTouchStart={handleCoverInteraction}
          >
            {/* Gold border frame — static, no animation overhead */}
            <div className="absolute inset-4 sm:inset-6 md:inset-12 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, hsl(36 60% 55% / 0.5), hsl(33 55% 42% / 0.3), transparent)" }} />
              <div className="absolute top-0 right-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, hsl(36 60% 55% / 0.5), hsl(33 55% 42% / 0.3), transparent)" }} />
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(270deg, hsl(36 60% 55% / 0.5), hsl(33 55% 42% / 0.3), transparent)" }} />
              <div className="absolute top-0 left-0 bottom-0 w-px" style={{ background: "linear-gradient(0deg, hsl(36 60% 55% / 0.5), hsl(33 55% 42% / 0.3), transparent)" }} />
            </div>

            {/* Top ornament */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-24 sm:w-32 h-px mb-6 sm:mb-8"
              style={{ background: "linear-gradient(90deg, transparent, hsl(33 55% 42%), transparent)" }}
            />

            {/* Envelope icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 120, damping: 12 }}
              className="text-gold-dark mb-4 sm:mb-6"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-12 sm:h-12">
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
              Kabar Bahagia Pernikahan
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

            {/* Audio equalizer indicator */}
            <AnimatePresence>
              {audioPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-end gap-[3px] h-4 mb-4"
                >
                  {[0, 0.15, 0.3, 0.1, 0.25].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] rounded-full bg-gold-dark/60"
                      animate={{ height: ["4px", "14px", "6px", "12px", "4px"] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Open button — no backdrop-blur, no shimmer animation */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-full border border-gold/40 bg-gold/15 font-body text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold-dark transition-colors active:bg-gold/25"
            >
              Buka Kabar Bahagia
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small "preparing" indicator after button click — dots + text, no spinner */}
      <AnimatePresence>
        {phase === "opening" && (
          <motion.div
            key="preparing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-none"
          >
            <span className="font-body text-[10px] sm:text-xs tracking-[0.25em] uppercase text-gold-dark/80">
              Menyiapkan halaman
            </span>
            <span className="flex items-center gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span
                  key={i}
                  className="w-1 h-1 rounded-full bg-gold-dark/70"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay, ease: "easeInOut" }}
                />
              ))}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntranceCover;
