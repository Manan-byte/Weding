import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyVisibleProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  minHeight?: string;
}

/**
 * Renders children only when the placeholder is near the viewport.
 * Avoids paying React render + lazy-chunk eval cost for below-fold sections
 * until the user is about to scroll to them.
 */
const LazyVisible = ({
  children,
  fallback = null,
  rootMargin = "400px 0px",
  minHeight = "200px",
}: LazyVisibleProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} style={visible ? undefined : { minHeight }}>
      {visible ? children : fallback}
    </div>
  );
};

export default LazyVisible;
