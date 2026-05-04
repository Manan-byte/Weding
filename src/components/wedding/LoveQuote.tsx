import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import floralTL from "@/assets/floral-watercolor-tl.webp";
import floralBR from "@/assets/floral-watercolor-br.webp";
import FallingLeaves from "./FallingLeaves";

const quotes = [
  {
    type: "ayat",
    text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.",
    source: "QS. Ar-Rum: 21",
  },
  {
    type: "quote",
    text: "Cinta sejati bukan tentang menemukan seseorang yang sempurna, tetapi tentang melihat seseorang yang tidak sempurna dengan sempurna.",
    source: "— Sam Keen",
  },
  {
    type: "ayat",
    text: "Mereka adalah pakaian bagimu, dan kamu pun adalah pakaian bagi mereka.",
    source: "QS. Al-Baqarah: 187",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const LoveQuote = () => {
  return (
    <section
      id="gallery"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(100 20% 97%) 0%, hsl(140 35% 90%) 100%)" }}
    >
      <img src={floralTL} alt="" className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-70" loading="lazy" decoding="async" width={256} height={256} />
      <img src={floralBR} alt="" className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-70" loading="lazy" decoding="async" width={256} height={256} />
      <FallingLeaves count={8} />

      <div className="container max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="font-body text-xs sm:text-sm tracking-[0.3em] uppercase text-sage-green-deep mb-3">
            Untaian Cinta
          </p>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">
            Kata & Doa
          </h2>
          <div className="ornament-divider max-w-xs mx-auto">
            <Heart className="w-5 h-5 text-gold-dark fill-gold-dark" />
          </div>
        </motion.div>

        <div className="space-y-10 sm:space-y-12">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative bg-background/70 backdrop-blur-sm border border-gold/20 rounded-2xl shadow-elegant px-5 py-8 sm:px-10 sm:py-10 text-center"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold-dark/90 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-md">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-cream fill-cream" />
              </div>
              {q.type === "ayat" ? (
                <p className="font-serif-display italic text-base sm:text-lg md:text-xl leading-[1.9] text-foreground/90 mb-4 max-w-2xl mx-auto">
                  "{q.text}"
                </p>
              ) : (
                <p className="font-body italic text-sm sm:text-base md:text-lg leading-[1.8] text-foreground/85 mb-4 max-w-2xl mx-auto">
                  "{q.text}"
                </p>
              )}
              <div className="ornament-divider max-w-[120px] mx-auto my-4 opacity-60">
                <span className="text-gold-dark text-xs">❦</span>
              </div>
              <p className="font-body text-[10px] sm:text-xs tracking-[0.25em] uppercase text-sage-green-deep">
                {q.source}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="font-script text-2xl sm:text-3xl text-center text-gold-dark mt-12 sm:mt-16"
        >
          Semoga Allah meridhai pernikahan kami
        </motion.p>
      </div>
    </section>
  );
};

export default LoveQuote;
