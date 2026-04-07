import { motion } from "framer-motion";
import { Heart, Send, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import floralTL from "@/assets/floral-watercolor-tl.png";
import floralBR from "@/assets/floral-watercolor-br.png";
import outdoorGarden from "@/assets/outdoor-garden-path.jpg";
import FallingLeaves from "./FallingLeaves";

interface Wish {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const WishesSection = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching wishes:", error);
    } else {
      setWishes(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Nama dan ucapan harus diisi");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from("wishes")
      .insert({ name: name.trim(), message: message.trim() })
      .select()
      .single();

    if (error) {
      console.error("Error submitting wish:", error);
      toast.error("Gagal mengirim ucapan, coba lagi");
    } else if (data) {
      setWishes((prev) => [data, ...prev]);
      setName("");
      setMessage("");
      toast.success("Terima kasih atas ucapan dan doa Anda! 🤍");
    }
    setSubmitting(false);
  };

  return (
    <section id="wishes" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={outdoorGarden} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/90" />
      </div>
      <img src={floralTL} alt="" className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-40" loading="lazy" decoding="async" width={256} height={256} />
      <img src={floralBR} alt="" className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-40" loading="lazy" decoding="async" width={256} height={256} />
      <FallingLeaves count={14} />

      <div className="container max-w-lg mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="text-center mb-8 sm:mb-12">
          <p className="font-body text-xs sm:text-sm tracking-[0.3em] uppercase text-sage-green-deep mb-3">Kirimkan Doa Terbaik</p>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">Ucapan & Doa</h2>
          <div className="ornament-divider max-w-xs mx-auto">
            <Heart className="w-5 h-5 text-gold-dark fill-gold-dark" />
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-background/80 backdrop-blur-sm rounded-lg p-5 sm:p-8 shadow-elegant space-y-4 border border-gold/20 mb-6 sm:mb-8"
        >
          <div>
            <label className="font-body text-sm text-foreground mb-1.5 block">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
              placeholder="Masukkan nama Anda"
              maxLength={100}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="font-body text-sm text-foreground mb-1.5 block">Ucapan & Doa</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition resize-none"
              placeholder="Tuliskan ucapan dan doa untuk kedua mempelai..."
              maxLength={500}
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 sm:py-3.5 rounded-md bg-gradient-gold font-body text-sm font-medium tracking-wider uppercase text-primary-foreground shadow-gold hover:opacity-90 active:opacity-80 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? "Mengirim..." : "Kirim Ucapan"}
          </button>
        </motion.form>

        {/* Wishes list */}
        <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gold-dark" />
            </div>
          ) : wishes.length === 0 ? (
            <p className="text-center font-body text-sm text-muted-foreground py-8">Jadilah yang pertama mengirimkan ucapan 🤍</p>
          ) : (
            wishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-background/70 backdrop-blur-sm rounded-lg p-4 border border-gold/15"
              >
                <p className="font-body text-sm font-semibold text-gold-dark mb-1">{wish.name}</p>
                <p className="font-body text-sm text-foreground/80 leading-relaxed">{wish.message}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default WishesSection;
