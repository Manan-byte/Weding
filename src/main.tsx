import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Preload critical assets so the cover and hero render with zero delay.
import floralTL from "@/assets/floral-watercolor-tl.webp";
import floralTR from "@/assets/floral-watercolor-tr.webp";
import floralBL from "@/assets/floral-watercolor-bl.webp";
import floralBR from "@/assets/floral-watercolor-br.webp";
import outdoorHero from "@/assets/outdoor-wedding-hero.webp";

const preloadImage = (href: string, priority: "high" | "low" = "high") => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = href;
  link.type = "image/webp";
  if (priority === "high") link.setAttribute("fetchpriority", "high");
  document.head.appendChild(link);
};

[floralTL, floralTR, floralBL, floralBR, outdoorHero].forEach((src) =>
  preloadImage(src, "high"),
);

createRoot(document.getElementById("root")!).render(<App />);
