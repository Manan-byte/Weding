import { motion } from "framer-motion";
import { Heart, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import floralTL from "@/assets/floral-watercolor-tl.png";
import floralBR from "@/assets/floral-watercolor-br.png";
import outdoorGarden from "@/assets/outdoor-garden-path.jpg";

const rsvpSchema = z.object({
  name: z.string().trim().min(1, "Nama harus diisi").max(100),
  email: z.string().trim().email("Masukkan email yang valid").max(255),
  guests: z.string(),
  attendance: z.string(),
  message: z.string().trim().max(500).optional(),
});

const formFieldVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0 },
};

const RSVPSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", guests: "1", attendance: "attending", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = rsvpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setSubmitted(true);
    toast.success("Terima kasih atas konfirmasi kehadiran Anda!");
  };

  if (submitted) {
    return (
      <section id="rsvp" className="relative py-16 sm:py-24" style={{ background: "linear-gradient(180deg, hsl(140 35% 90%) 0%, hsl(80 30% 96%) 100%)" }}>
        <div className="container max-w-lg mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: "spring", stiffness: 100 }} className="bg-background/80 backdrop-blur-sm rounded-lg p-8 sm:p-12 shadow-elegant border border-gold/20">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-gold-dark fill-gold-dark mx-auto mb-4" />
            <h3 className="font-script text-3xl sm:text-4xl text-foreground mb-3">Terima Kasih!</h3>
            <p className="font-body text-sm text-muted-foreground">Konfirmasi kehadiran Anda telah kami terima. Kami menantikan kehadiran Anda di hari bahagia kami!</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={outdoorGarden} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>
      <img src={floralTL} alt="" className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-40" loading="lazy" decoding="async" width={512} height={512} />
      <img src={floralBR} alt="" className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-40" loading="lazy" decoding="async" width={512} height={512} />

      <div className="container max-w-lg mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="text-center mb-8 sm:mb-12">
          <p className="font-body text-xs sm:text-sm tracking-[0.3em] uppercase text-sage-green-deep mb-3">Konfirmasi Kehadiran</p>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">RSVP</h2>
          <div className="ornament-divider max-w-xs mx-auto">
            <Heart className="w-5 h-5 text-gold-dark fill-gold-dark" />
          </div>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }} onSubmit={handleSubmit} className="bg-background/80 backdrop-blur-sm rounded-lg p-5 sm:p-8 shadow-elegant space-y-4 sm:space-y-5 border border-gold/20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={formFieldVariants} transition={{ duration: 0.4, delay: 0.1 }}>
            <label className="font-body text-sm text-foreground mb-1.5 block">Nama Lengkap</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition" placeholder="Masukkan nama lengkap" />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={formFieldVariants} transition={{ duration: 0.4, delay: 0.15 }}>
            <label className="font-body text-sm text-foreground mb-1.5 block">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition" placeholder="email@contoh.com" />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={formFieldVariants} transition={{ duration: 0.4, delay: 0.2 }} className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="font-body text-sm text-foreground mb-1.5 block">Jumlah Tamu</label>
              <select value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition">
                {[1, 2, 3, 4, 5].map((n) => (<option key={n} value={String(n)}>{n} Orang</option>))}
              </select>
            </div>
            <div>
              <label className="font-body text-sm text-foreground mb-1.5 block">Kehadiran</label>
              <select value={formData.attendance} onChange={(e) => setFormData({ ...formData, attendance: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition">
                <option value="attending">Insya Allah Hadir</option>
                <option value="not-attending">Maaf, Tidak Bisa</option>
              </select>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={formFieldVariants} transition={{ duration: 0.4, delay: 0.25 }}>
            <label className="font-body text-sm text-foreground mb-1.5 block">Ucapan & Doa (Opsional)</label>
            <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition resize-none" placeholder="Tuliskan ucapan dan doa untuk kedua mempelai..." />
          </motion.div>

          <button type="submit" className="w-full py-3 sm:py-3.5 rounded-md bg-gradient-gold font-body text-sm font-medium tracking-wider uppercase text-primary-foreground shadow-gold hover:opacity-90 active:opacity-80 transition flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            Kirim RSVP
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default RSVPSection;
