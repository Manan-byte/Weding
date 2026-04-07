import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MUSIC_URL = "/music/Ed_Sheeran_-_Perfect.mp3";

interface MusicPlayerProps {
  startPlaying?: boolean;
}

const MusicPlayer = memo(({ startPlaying = false }: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.30);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.30;
    audio.preload = "none";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Start playing when cover opens
  useEffect(() => {
    if (startPlaying && audioRef.current && !isPlaying) {
      const audio = audioRef.current;
      audio.volume = volume;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [startPlaying, isPlaying, volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlaying(true));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }, []);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-2"
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
    >
      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-background/90 backdrop-blur-md rounded-full px-3 py-3 flex flex-col items-center shadow-lg border border-gold/20"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-1.5 h-20 sm:h-24 appearance-none rounded-full cursor-pointer accent-gold"
              style={{ writingMode: "vertical-lr", direction: "rtl" }}
              aria-label="Volume"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={togglePlay}
        className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gold-dark/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-gold-dark active:bg-gold-dark transition-colors border border-gold/30"
        aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div key="playing" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <VolumeIcon className="w-5 h-5 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div key="muted" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <VolumeX className="w-5 h-5 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        {isPlaying && (
          <div className="absolute inset-0 rounded-full border-2 border-gold/30" />
        )}
      </motion.button>
    </div>
  );
});

MusicPlayer.displayName = "MusicPlayer";

export default MusicPlayer;
