import { memo, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FallingLeavesProps {
  count?: number;
}

const FallingLeaves = memo(({ count = 10 }: FallingLeavesProps) => {
  const isMobile = useIsMobile();
  // Reduce leaf count on mobile for better performance
  const effectiveCount = isMobile ? Math.min(count, 6) : count;

  const leaves = useMemo(
    () =>
      Array.from({ length: effectiveCount }, (_, i) => ({
        id: i,
        left: `${(i * (95 / effectiveCount) + 2) % 100}%`,
        delay: `${(i * 1.7) % 10}s`,
        duration: `${7 + (i % 5) * 2}s`,
        size: 8 + (i % 3) * 3,
        opacity: 0.18 + (i % 4) * 0.08,
        sway: i % 2 === 0 ? "leaf-fall-left" : "leaf-fall-right",
      })),
    [effectiveCount]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute -top-4 will-change-transform"
          style={{
            left: leaf.left,
            animation: `${leaf.sway} ${leaf.duration} ${leaf.delay} linear infinite`,
            opacity: leaf.opacity,
            contain: "layout style",
          }}
        >
          <svg
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 24 24"
            fill="none"
            className="text-leaf-green"
          >
            <path
              d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.5-3.5 11-8a14.37 14.37 0 0 0 2-7c-1.5.5-3 1-4 2Z"
              fill="currentColor"
            />
            <path
              d="M17 8c.8 1.8.5 4-.5 6s-2.5 3.5-4.5 4.5"
              stroke="hsl(140 30% 35%)"
              strokeWidth="0.8"
              fill="none"
            />
          </svg>
        </div>
      ))}
    </div>
  );
});

FallingLeaves.displayName = "FallingLeaves";

export default FallingLeaves;
