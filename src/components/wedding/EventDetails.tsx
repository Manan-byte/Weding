import { motion } from "framer-motion";
import { MapPin, Clock, Heart, ExternalLink } from "lucide-react";
import floralTR from "@/assets/floral-watercolor-tr.webp";
import floralBL from "@/assets/floral-watercolor-bl.webp";
import outdoorReception from "@/assets/outdoor-wedding-reception.webp";
import FallingLeaves from "./FallingLeaves";

const VENUE_ADDRESS = "Jl. Jend. A. Yani No. 25, RT 03/RW 03, Krisik, Kec. Cipari, Kab. Cilacap, Jawa Tengah";
const MAPS_URL = "https://www.google.com/maps/dir/?api=1&destination=-7.447454452514648,108.7685546875&travelmode=driving";

const event = {
  title: "Akad Nikah",
  subtitle: "KUA CIPARI",
  date: "10 Juni 2026",
  time: "08.00 - 10.00 WIB",
  venue: VENUE_ADDRESS,
  description: "Dengan mengharap ridho Allah SWT, kami akan melangsungkan akad nikah. Mohon doa restu.",
};

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? -40 : 40,
  }),
  visible: {
    opacity: 1,
    x: 0,
  },
};

const EventDetails = () => {
  return (
    <section id="events" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={outdoorReception} alt="" className="w-full h-full object-cover object-center" loading="lazy" decoding="async" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/90" />
      </div>
      <img src={floralTR} alt="" className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-80" loading="lazy" decoding="async" width={256} height={256} />
      <img src={floralBL} alt="" className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-80" loading="lazy" decoding="async" width={256} height={256} />
      <FallingLeaves count={8} />

      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="font-body text-xs sm:text-sm tracking-[0.3em] uppercase text-sage-green-deep mb-3">Insya Allah</p>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">Akad Nikah</h2>
          <div className="ornament-divider max-w-xs mx-auto">
            <Heart className="w-5 h-5 text-gold-dark fill-gold-dark" />
          </div>
        </motion.div>

        <div className="max-w-lg mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={cardVariants}
            custom={0}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-background/95 rounded-lg p-5 sm:p-6 md:p-8 shadow-elegant text-center border border-gold/20"
          >
            <h3 className="font-script text-2xl sm:text-3xl md:text-4xl text-foreground mb-1">{event.title}</h3>
            <p className="font-body text-xs uppercase tracking-widest text-gold-dark mb-4 sm:mb-6">{event.subtitle}</p>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-sage-green-deep shrink-0" />
                <span className="font-body text-xs sm:text-sm">{event.date} • {event.time}</span>
              </div>
              <div className="flex items-start justify-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-sage-green-deep shrink-0 mt-0.5" />
                <span className="font-body text-xs sm:text-sm leading-relaxed text-left">{event.venue}</span>
              </div>
            </div>
            <p className="font-serif-display text-muted-foreground text-xs sm:text-sm italic mb-4 sm:mb-6">{event.description}</p>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-md bg-gold/20 border border-gold/30 font-body text-xs sm:text-sm font-medium text-gold-dark hover:bg-gold/30 active:bg-gold/40 transition">
              <MapPin className="w-4 h-4" />
              Buka di Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8 sm:mt-10"
        >
          <div className="text-center mb-4">
            <p className="font-body text-xs uppercase tracking-widest text-gold-dark mb-1">Lokasi Acara</p>
            <p className="font-serif-display text-xs sm:text-sm text-muted-foreground px-2">{VENUE_ADDRESS}</p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-elegant border border-gold/20">
            <iframe
              src="https://maps.google.com/maps?q=-7.447454452514648,108.7685546875&z=15&output=embed"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Pernikahan Irma & Manan"
              className="sm:h-[350px]"
            />
          </div>
          <div className="text-center mt-4">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-md bg-gold/20 border border-gold/30 font-body text-xs sm:text-sm font-medium text-gold-dark hover:bg-gold/30 active:bg-gold/40 transition">
              <MapPin className="w-4 h-4" />
              Petunjuk Arah ke Lokasi
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventDetails;
