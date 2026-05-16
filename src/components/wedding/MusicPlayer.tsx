import { useState, useRef, useEffect, useCallback } from "react";

const MUSIC_URL = "/music/Ed_Sheeran_-_Perfect.mp3";
const TARGET_VOLUME = 0.30;

interface MusicPlayerProps {
  startPlaying?: boolean;
}

/**
 * Lightweight music player.
 * - No framer-motion / lucide-react (saves ~30KB gzipped on this chunk).
 * - Uses inline SVG + CSS animations for the equalizer/pulse.
 * - Audio uses preload="auto" so playback starts instantly after cover opens.
 */
const MusicPlayer = ({ startPlaying = false }: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const hasTriedAutoplay = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Try to play when startPlaying becomes true
  useEffect(() => {
    const audio = audioRef.current;
    if (!startPlaying || !audio || isPlaying || hasTriedAutoplay.current) return;
    hasTriedAutoplay.current = true;
    audio.volume = TARGET_VOLUME;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [startPlaying, isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeRef.current) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }

    if (audio.paused) {
      audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true);
        const step = TARGET_VOLUME / 15;
        let current = 0;
        const fadeIn = () => {
          current += step;
          if (current >= TARGET_VOLUME) {
            audio.volume = TARGET_VOLUME;
            fadeRef.current = null;
            return;
          }
          audio.volume = current;
          fadeRef.current = requestAnimationFrame(fadeIn);
        };
        fadeRef.current = requestAnimationFrame(fadeIn);
      }).catch(() => {});
    } else {
      const step = audio.volume / 20;
      const fadeOut = () => {
        const newVol = audio.volume - step;
        if (newVol <= 0.01) {
          audio.volume = 0;
          audio.pause();
          audio.volume = TARGET_VOLUME;
          fadeRef.current = null;
          return;
        }
        audio.volume = newVol;
        fadeRef.current = requestAnimationFrame(fadeOut);
      };
      setIsPlaying(false);
      fadeRef.current = requestAnimationFrame(fadeOut);
    }
  }, []);

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-7 sm:right-6 z-50">
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />

      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold-dark shadow-lg flex items-center justify-center active:scale-95 transition-transform"
      >
        {isPlaying && (
          <>
            <span className="absolute inset-[-4px] rounded-full border-2 border-gold music-ring-1" />
            <span className="absolute inset-[-6px] rounded-full border-[1.5px] border-gold music-ring-2" />
          </>
        )}

        {isPlaying ? (
          <span className="flex items-end gap-[3px] h-4 sm:h-5" aria-hidden="true">
            <span className="w-[3px] sm:w-[3.5px] rounded-full bg-white music-bar music-bar-1" />
            <span className="w-[3px] sm:w-[3.5px] rounded-full bg-white music-bar music-bar-2" />
            <span className="w-[3px] sm:w-[3.5px] rounded-full bg-white music-bar music-bar-3" />
            <span className="w-[3px] sm:w-[3.5px] rounded-full bg-white music-bar music-bar-4" />
          </span>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden="true"
            className="ml-0.5"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
