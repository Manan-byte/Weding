import floralTL from "@/assets/floral-watercolor-tl.png";
import floralTR from "@/assets/floral-watercolor-tr.png";
import floralBL from "@/assets/floral-watercolor-bl.png";
import floralBR from "@/assets/floral-watercolor-br.png";

interface FloralFrameProps {
  variant?: "blue" | "pink" | "mixed" | "all";
  size?: "sm" | "md" | "lg";
  showGoldBorder?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sizeMap = {
  sm: "w-24 h-24 md:w-32 md:h-32",
  md: "w-32 h-32 md:w-44 md:h-44",
  lg: "w-40 h-40 md:w-56 md:h-56",
};

const FloralFrame = ({ variant = "all", size = "md", showGoldBorder = true, children, className = "" }: FloralFrameProps) => {
  const s = sizeMap[size];

  return (
    <div className={`relative ${className}`}>
      {showGoldBorder && (
        <div className="absolute inset-4 md:inset-6 border border-gold/30 pointer-events-none z-[1]" />
      )}

      {(variant === "all" || variant === "blue") && (
        <img src={floralTL} alt="" className={`absolute top-0 left-0 ${s} object-contain pointer-events-none z-[2]`} />
      )}
      {(variant === "all" || variant === "pink") && (
        <img src={floralTR} alt="" className={`absolute top-0 right-0 ${s} object-contain pointer-events-none z-[2]`} />
      )}
      {(variant === "all" || variant === "mixed") && (
        <img src={floralBL} alt="" className={`absolute bottom-0 left-0 ${s} object-contain pointer-events-none z-[2]`} />
      )}
      {(variant === "all" || variant === "mixed") && (
        <img src={floralBR} alt="" className={`absolute bottom-0 right-0 ${s} object-contain pointer-events-none z-[2]`} />
      )}

      <div className="relative z-[3]">
        {children}
      </div>
    </div>
  );
};

export default FloralFrame;
