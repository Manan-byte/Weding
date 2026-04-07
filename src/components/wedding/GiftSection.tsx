import { motion } from "framer-motion";
import { Heart, Gift, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import floralTR from "@/assets/floral-watercolor-tr.png";
import floralBL from "@/assets/floral-watercolor-bl.png";
import FallingLeaves from "./FallingLeaves";

const accounts = [
  { bank: "Bank Mandiri", accountNumber: "1570013500443", accountName: "Irma Damayanti Khasa" },
  { bank: "Bank BCA", accountNumber: "1540899823", accountName: "Manan" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const GiftSection = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (accountNumber: string, index: number) => {
    try { await navigator.clipboard.writeText(accountNumber); } catch {
      const textArea = document.createElement("textarea");
      textArea.value = accountNumber; textArea.style.position = "fixed"; textArea.style.opacity = "0";
      document.body.appendChild(textArea); textArea.select(); document.execCommand("copy"); document.body.removeChild(textArea);
    }
    setCopiedIndex(index);
    toast.success("Nomor rekening berhasil disalin!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="gift" className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(140 35% 90%) 0%, hsl(80 30% 96%) 100%)" }}>
      <img src={floralTR} alt="" className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-40" loading="lazy" decoding="async" width={256} height={256} />
      <img src={floralBL} alt="" className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-40" loading="lazy" decoding="async" width={256} height={256} />
      <FallingLeaves count={14} />

      <div className="container max-w-lg mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="text-center mb-10 sm:mb-12">
          <p className="font-body text-xs sm:text-sm tracking-[0.3em] uppercase text-sage-green-deep mb-3">Amplop Digital</p>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">Hadiah Pernikahan</h2>
          <div className="ornament-divider max-w-xs mx-auto mb-4 sm:mb-6">
            <Heart className="w-5 h-5 text-gold-dark fill-gold-dark" />
          </div>
          <p className="font-body text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih dapat melalui rekening berikut:
          </p>
        </motion.div>

        <div className="space-y-4 sm:space-y-5">
          {accounts.map((account, index) => (
            <motion.div key={account.bank} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={cardVariants} transition={{ duration: 0.6, delay: index * 0.15 }} className="bg-background/80 backdrop-blur-sm rounded-lg p-5 sm:p-6 shadow-elegant border border-gold/20 text-center">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }} className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sage-green/30 mb-3 sm:mb-4">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-sage-green-deep" />
              </motion.div>
              <p className="font-body text-xs uppercase tracking-widest text-gold-dark mb-2 sm:mb-3">{account.bank}</p>
              <p className="font-serif-display text-xl sm:text-2xl text-foreground tracking-wider mb-1">{account.accountNumber}</p>
              <p className="font-body text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">a.n. {account.accountName}</p>
              <button onClick={() => handleCopy(account.accountNumber, index)} className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md border border-gold/30 font-body text-xs uppercase tracking-wider text-foreground hover:bg-gold/10 active:bg-gold/20 transition">
                {copiedIndex === index ? (<><Check className="w-3.5 h-3.5 text-gold-dark" />Tersalin!</>) : (<><Copy className="w-3.5 h-3.5" />Salin Nomor Rekening</>)}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftSection;
