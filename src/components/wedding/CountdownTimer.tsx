import { memo, useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer = memo(({ targetDate }: CountdownTimerProps) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = targetDate.getTime() - Date.now();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const units = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 sm:gap-4 md:gap-8 justify-center">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg bg-background/40 backdrop-blur-md border border-white/30 flex items-center justify-center mb-1.5 sm:mb-2">
            <span className="font-serif-display text-xl sm:text-2xl md:text-3xl font-semibold text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span className="font-body text-[10px] sm:text-xs uppercase tracking-widest text-white/70">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
});

CountdownTimer.displayName = "CountdownTimer";

export default CountdownTimer;
