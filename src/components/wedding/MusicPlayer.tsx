import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MUSIC_URL = "/music/Ed_Sheeran_-_Perfect.mp3";

interface MusicPlayerProps {
  startPlaying?: boolean;
}

const MusicPlayer = memo(({ startPlaying = false }: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.30);
  const [showVolume, setShowVolume] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriedAutoplay = useRef(false);

  // Try to play when startPlaying becomes true
  useEffect(() => {
    if (startPlaying && audioRef.current && !isPlaying && !hasTriedAutoplay.current) {
      hasTriedAutoplay.current = true;
      const audio = audioRef.current;
      audio.volume = volume;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [startPlaying, isPlaying, volume]);

  // Close volume slider when tapping outside
  useEffect(() => {
    if (!showVolume) return;
    const handleOutsideClick = (e: TouchEvent | MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowVolume(false);
      }
    };
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showVolume]);

  const fadeRef = useRef<number | null>(null);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (showVolume) {
      setShowVolume(false);
      return;
    }

    // Clear any ongoing fade
    if (fadeRef.current) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }

    const audio = audioRef.current;

    if (audio.paused) {
      // Fade in
      audio.volume = 0;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          const targetVol = volume;
          const step = targetVol / 15;
          let current = 0;
          const fadeIn = () => {
            current += step;
            if (current >= targetVol) {
              audio.volume = targetVol;
              fadeRef.current = null;
              return;
            }
            audio.volume = current;
            fadeRef.current = requestAnimationFrame(fadeIn);
          };
          fadeRef.current = requestAnimationFrame(fadeIn);
        })
        .catch(() => {});
    } else {
      // Fade out then pause
      const startVol = audio.volume;
      const step = startVol / 20;
      const fadeOut = () => {
        const newVol = audio.volume - step;
        if (newVol <= 0.01) {
          audio.volume = 0;
          audio.pause();
          audio.volume = volume; // restore for next play
          setIsPlaying(false);
          fadeRef.current = null;
          return;
        }
        audio.volume = newVol;
        fadeRef.current = requestAnimationFrame(fadeOut);
      };
      setIsPlaying(false); // update UI immediately for responsive feel
      fadeRef.current = requestAnimationFrame(fadeOut);
    }
  }, [showVolume, volume]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }, []);

  return (
    <div ref={containerRef} className="fixed bottom-5 right-4 sm:bottom-7 sm:right-6 z-50">
      <audio ref={audioRef} src={MUSIC_URL} loop preload="none" />

      {/* Circular button with ring equalizer */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 180, damping: 16 }}
        onClick={togglePlay}
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold-dark shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
      >
        {/* Animated ring — pulses when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-full"
            >
              <motion.div
                className="absolute inset-[-4px] rounded-full border-2 border-gold"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-[-6px] rounded-full border-[1.5px] border-gold"
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play/Pause icon or Equalizer */}
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="equalizer"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-end gap-[3px] h-4 sm:h-5"
            >
              {[0, 0.2, 0.4, 0.15].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] sm:w-[3.5px] rounded-full bg-white"
                  animate={{
                    height: ["35%", "100%", "50%", "85%", "35%"],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
});

MusicPlayer.displayName = "MusicPlayer";

export default MusicPlayer;
