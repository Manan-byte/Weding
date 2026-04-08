import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import couplePhoto from "@/assets/couple-garden-3.webp";
import floralTL from "@/assets/floral-watercolor-tl.webp";
import floralBR from "@/assets/floral-watercolor-br.webp";
import outdoorAkad from "@/assets/outdoor-wedding-akad.webp";
import FallingLeaves from "./FallingLeaves";

const textReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const photoReveal = {
  hidden: { opacity: 0, scale: 0.85, rotate: -3 },
  visible: { opacity: 1, scale: 1, rotate: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const OurStory = () => {
  return (
    <section id="story" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={outdoorAkad} alt="" className="w-full h-full object-cover object-center" loading="lazy" decoding="async" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/90" />
      </div>
      <img src={floralTL} alt="" className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-50" loading="lazy" decoding="async" width={256} height={256} />
      <img src={floralBR} alt="" className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-50" loading="lazy" decoding="async" width={256} height={256} />
      <FallingLeaves count={8} />

      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={textReveal}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="font-body text-xs sm:text-sm tracking-[0.3em] uppercase text-sage-green-deep mb-3">
            Bismillahirrahmanirrahim
          </p>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">
            Tentang Kami
          </h2>
          <div className="ornament-divider max-w-xs mx-auto">
            <Heart className="w-5 h-5 text-gold-dark fill-gold-dark" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={photoReveal}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img
              src={couplePhoto}
              alt="Irma Damayanti Khasanah & Manan"
              loading="lazy"
              decoding="async"
              width={1024}
              height={1024}
              className="rounded-lg shadow-elegant w-full object-cover aspect-[3/4] border border-gold/20"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="space-y-6 sm:space-y-8"
          >
            <motion.div variants={slideUp} transition={{ duration: 0.7 }} className="text-center md:text-left">
              <h3 className="font-script text-3xl sm:text-4xl text-gold-dark mb-1">Irma Damayanti Khasanah</h3>
              <p className="font-body text-sm text-muted-foreground">Lahir 08 Januari 1999</p>
              <p className="font-body text-sm text-sage-green-deep">Cipari, Cilacap</p>
            </motion.div>

            <motion.div variants={slideUp} transition={{ duration: 0.5 }} className="flex items-center justify-center md:justify-start gap-4">
              <div className="h-px flex-1 max-w-[60px] bg-gold/30" />
              <Heart className="w-5 h-5 text-gold-dark fill-gold-dark" />
              <div className="h-px flex-1 max-w-[60px] bg-gold/30" />
            </motion.div>

            <motion.div variants={slideUp} transition={{ duration: 0.7 }} className="text-center md:text-left">
              <h3 className="font-script text-3xl sm:text-4xl text-gold-dark mb-1">Abdul Manan</h3>
              <p className="font-body text-sm text-muted-foreground">Lahir 05 Agustus 1997</p>
              <p className="font-body text-sm text-sage-green-deep">Bebengan Kertosari, Kab. Temanggung</p>
            </motion.div>

            <motion.div variants={slideUp} transition={{ duration: 0.8 }} className="pt-2 sm:pt-4">
              <p className="font-serif-display text-lg sm:text-xl italic text-gold-dark leading-relaxed">
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya."
              </p>
              <p className="font-body text-xs text-muted-foreground mt-2">— QS. Ar-Rum: 21</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
