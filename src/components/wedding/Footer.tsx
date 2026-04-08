import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import floralBL from "@/assets/floral-watercolor-bl.webp";
import floralBR from "@/assets/floral-watercolor-br.webp";
import FallingLeaves from "./FallingLeaves";

const Footer = () => {
  return (
    <footer className="relative py-10 sm:py-12 text-center overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(100 20% 97%), hsl(140 35% 90% / 0.5), hsl(60 30% 94% / 0.5))" }}>
      <img src={floralBL} alt="" className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain pointer-events-none opacity-40" loading="lazy" decoding="async" width={256} height={256} />
      <img src={floralBR} alt="" className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain pointer-events-none opacity-40" loading="lazy" decoding="async" width={256} height={256} />
      <FallingLeaves count={6} />

      <div className="container max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="font-script text-3xl sm:text-4xl text-gold-dark mb-2">Irma & Manan</h3>
          <p className="font-body text-xs sm:text-sm text-foreground/60 mb-4 sm:mb-6">10 Juni 2026</p>
        </motion.div>
        <div className="ornament-divider max-w-xs mx-auto mb-4 sm:mb-6">
          <Heart className="w-4 h-4 text-gold-dark fill-gold-dark" />
        </div>
        <p className="font-body text-xs text-muted-foreground px-2">
          Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan memberikan doa restu untuk pernikahan kami 🤍
        </p>
      </div>
    </footer>
  );
};

export default Footer;
