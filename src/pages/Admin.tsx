import { useState, useEffect, useCallback, memo } from "react";
import { Copy, Plus, Trash2, Link, Users, Check, Loader2, Lock, MessageSquareHeart, Send, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_PASSWORD = "manan";

interface Guest {
  id: string;
  name: string;
  created_at: string;
}

interface Wish {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const GuestRow = memo(({ guest, index, baseUrl, copiedIndex, onCopy, onSend, onPreview, onRemove }: {
  guest: Guest;
  index: number;
  baseUrl: string;
  copiedIndex: number | null;
  onCopy: (name: string, index: number) => void;
  onSend: (name: string) => void;
  onPreview: (name: string) => void;
  onRemove: (guest: Guest) => void;
}) => {
  const link = `${baseUrl}/?to=${encodeURIComponent(guest.name)}`;
  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-background/95 border border-gold/15 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 group">
      <Link className="w-4 h-4 text-gold-dark shrink-0 hidden sm:block" />
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-foreground truncate">{guest.name}</p>
        <p className="font-body text-[10px] sm:text-xs text-muted-foreground truncate">{link}</p>
      </div>
      <button
        onClick={() => onPreview(guest.name)}
        className="shrink-0 p-1.5 sm:p-2 rounded-md hover:bg-sage/15 active:bg-sage/25 transition text-sage-dark"
        title="Preview pesan"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => onSend(guest.name)}
        className="shrink-0 p-1.5 sm:p-2 rounded-md bg-[#25D366]/10 hover:bg-[#25D366]/20 active:bg-[#25D366]/30 transition text-[#128C7E]"
        title="Kirim via WhatsApp"
      >
        <Send className="w-4 h-4" />
      </button>
      <button
        onClick={() => onCopy(guest.name, index)}
        className="shrink-0 p-1.5 sm:p-2 rounded-md hover:bg-gold/10 active:bg-gold/20 transition text-gold-dark"
        title="Salin pesan"
      >
        {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <button
        onClick={() => onRemove(guest)}
        className="shrink-0 p-1.5 sm:p-2 rounded-md hover:bg-destructive/10 active:bg-destructive/20 transition text-muted-foreground hover:text-destructive"
        title="Hapus"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
});

GuestRow.displayName = "GuestRow";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [password, setPassword] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [tab, setTab] = useState<"guests" | "wishes">("guests");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishesLoading, setWishesLoading] = useState(false);
  const [removingWishId, setRemovingWishId] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  const baseUrl = window.location.origin;

  const fetchGuests = useCallback(async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching guests:", error);
    } else {
      setGuests(data || []);
    }
    setLoading(false);
  }, []);

  const fetchWishes = useCallback(async () => {
    setWishesLoading(true);
    const { data, error } = await supabase
      .from("wishes")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching wishes:", error);
      toast.error("Gagal memuat ucapan");
    } else {
      setWishes(data || []);
    }
    setWishesLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchGuests();
  }, [authenticated, fetchGuests]);

  useEffect(() => {
    if (authenticated && tab === "wishes" && wishes.length === 0) fetchWishes();
  }, [authenticated, tab, wishes.length, fetchWishes]);

  const removeWish = useCallback(async (wish: Wish) => {
    if (!confirm(`Hapus ucapan dari ${wish.name}?`)) return;
    setRemovingWishId(wish.id);
    const { error } = await supabase.from("wishes").delete().eq("id", wish.id);
    if (error) {
      console.error("Error removing wish:", error);
      toast.error("Gagal menghapus ucapan");
    } else {
      setWishes((prev) => prev.filter((w) => w.id !== wish.id));
      toast.success("Ucapan dihapus");
    }
    setRemovingWishId(null);
  }, []);

  const handleLogin = useCallback(() => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast.success("Berhasil masuk!");
    } else {
      toast.error("Password salah!");
    }
  }, [password]);

  const removeGuest = useCallback(async (guest: Guest) => {
    const { error } = await supabase.from("guests").delete().eq("id", guest.id);
    if (error) {
      console.error("Error removing guest:", error);
      toast.error("Gagal menghapus nama");
    } else {
      setGuests((prev) => prev.filter((g) => g.id !== guest.id));
    }
  }, []);

  const getLink = useCallback((name: string) => `${baseUrl}/?to=${encodeURIComponent(name)}`, [baseUrl]);

  const buildMessage = useCallback((name: string) => {
    const link = `${baseUrl}/?to=${encodeURIComponent(name)}`;
    return `*Kabar Bahagia & Mohon Doa Restu*\n🌿 _Irma & Manan_\n\nAssalamu'alaikum Warahmatullahi Wabarakatuh.\n\nKepada Yth.\nBapak/Ibu/Saudara/i\n*${name}*\ndi tempat\n\nDengan memohon rahmat dan ridha Allah Subhanahu wa Ta'ala, perkenankan kami menyampaikan kabar bahagia atas rencana pernikahan kami yang insyaAllah akan dilaksanakan pada:\n\n🗓️ *Rabu, 10 Juni 2026*\n🕌 *KUA Kec. Cipari, Kab. Cilacap, Jawa Tengah*\n\nMengingat keterbatasan situasi, acara akad nikah hanya dilangsungkan secara terbatas di KUA bersama keluarga inti. Oleh karena itu, kami memohon keikhlasan doa restu dari Bapak/Ibu/Saudara/i agar pernikahan kami senantiasa diberkahi, sakinah, mawaddah, wa rahmah.\n\nSelengkapnya dapat dibuka melalui tautan berikut:\n${link}\n\nMerupakan suatu kebahagiaan dan kehormatan bagi kami atas perhatian serta doa restu yang diberikan.\n\nJazakumullahu khairan katsiran.\nWassalamu'alaikum Warahmatullahi Wabarakatuh.\n\nHormat kami,\n_Irma & Manan beserta keluarga_`;
  }, [baseUrl]);

  const copyLink = useCallback((name: string, index: number) => {
    navigator.clipboard.writeText(buildMessage(name));
    setCopiedIndex(index);
    toast.success(`Pesan untuk ${name} berhasil disalin!`);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, [buildMessage]);

  const sendWhatsApp = useCallback((name: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(buildMessage(name))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [buildMessage]);

  const copyAll = useCallback(() => {
    const text = guests.map((g) => {
      const link = `${baseUrl}/?to=${encodeURIComponent(g.name)}`;
      return `*${g.name}*\n${link}`;
    }).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Semua link berhasil disalin!");
  }, [guests, baseUrl]);

  const addGuest = useCallback(async () => {
    const name = input.trim();
    if (!name) return;
    if (guests.some((g) => g.name === name)) {
      toast.error("Nama sudah ada dalam daftar");
      return;
    }

    setAdding(true);
    const { data, error } = await supabase
      .from("guests")
      .insert({ name })
      .select()
      .single();

    if (error) {
      console.error("Error adding guest:", error);
      toast.error("Gagal menambah nama");
    } else if (data) {
      setGuests((prev) => [...prev, data]);
      setInput("");
    }
    setAdding(false);
  }, [input, guests]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGuest();
    }
  }, [addGuest]);

  if (!authenticated) {
    return (
      <div className="min-h-[100svh] bg-gradient-to-b from-sky-blue-light/30 to-blush-light/30 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-background/95 border border-gold/20 rounded-2xl p-6 sm:p-8 text-center space-y-5 sm:space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold/10 mx-auto">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-gold-dark" />
          </div>
          <div>
            <h1 className="font-script text-2xl sm:text-3xl text-foreground mb-1">Admin Panel</h1>
            <p className="font-body text-xs sm:text-sm text-muted-foreground">Masukkan password untuk melanjutkan</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition text-center"
              autoFocus
            />
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-gradient-gold text-primary-foreground font-body text-sm font-medium hover:opacity-90 active:opacity-80 transition"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-sky-blue-light/30 to-blush-light/30">
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-body mb-3 sm:mb-4">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Admin Panel
          </div>
          <h1 className="font-script text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">
            Generate Link Kabar Bahagia
          </h1>
          <p className="font-body text-muted-foreground text-xs sm:text-sm">
            Tambahkan nama lalu salin link personal mereka.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 bg-background/60 border border-gold/15 rounded-lg p-1">
          <button
            onClick={() => setTab("guests")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-body font-medium transition ${tab === "guests" ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Users className="w-3.5 h-3.5" /> Tamu
          </button>
          <button
            onClick={() => setTab("wishes")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-body font-medium transition ${tab === "wishes" ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-muted-foreground hover:text-foreground"}`}
          >
            <MessageSquareHeart className="w-3.5 h-3.5" /> Ucapan
          </button>
        </div>

        {tab === "guests" ? (
          <>
            {/* Input */}
            <div className="flex gap-2 mb-6 sm:mb-8">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik nama penerima..."
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                disabled={adding}
              />
              <button
                onClick={addGuest}
                disabled={adding}
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gradient-gold text-primary-foreground font-body text-xs sm:text-sm font-medium hover:opacity-90 active:opacity-80 transition flex items-center gap-1.5 disabled:opacity-60"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span className="hidden sm:inline">Tambah</span>
              </button>
            </div>

            {/* Guest list */}
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-gold-dark" />
              </div>
            ) : guests.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-xs sm:text-sm text-muted-foreground">
                    {guests.length} penerima
                  </span>
                  <button
                    onClick={copyAll}
                    className="font-body text-xs text-gold-dark hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Salin semua
                  </button>
                </div>

                <div className="space-y-2">
                  {guests.map((guest, i) => (
                    <GuestRow
                      key={guest.id}
                      guest={guest}
                      index={i}
                      baseUrl={baseUrl}
                      copiedIndex={copiedIndex}
                      onCopy={copyLink}
                      onSend={sendWhatsApp}
                      onPreview={setPreviewName}
                      onRemove={removeGuest}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-muted-foreground font-body text-sm">
                Belum ada penerima. Mulai tambahkan nama di atas.
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-xs sm:text-sm text-muted-foreground">
                {wishes.length} ucapan
              </span>
              <button
                onClick={fetchWishes}
                className="font-body text-xs text-gold-dark hover:underline"
              >
                Muat ulang
              </button>
            </div>

            {wishesLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-gold-dark" />
              </div>
            ) : wishes.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground font-body text-sm">
                Belum ada ucapan masuk.
              </div>
            ) : (
              <div className="space-y-2">
                {wishes.map((wish) => (
                  <div
                    key={wish.id}
                    className="bg-background/95 border border-gold/15 rounded-lg px-3 sm:px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className="font-body text-sm font-semibold text-gold-dark truncate">{wish.name}</p>
                        <p className="font-body text-[10px] text-muted-foreground">
                          {new Date(wish.created_at).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button
                        onClick={() => removeWish(wish)}
                        disabled={removingWishId === wish.id}
                        title="Hapus ucapan"
                        className="shrink-0 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                      >
                        {removingWishId === wish.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{wish.message}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {previewName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 landscape:max-[900px]:items-center landscape:max-[900px]:p-2"
            onClick={() => setPreviewName(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md bg-[#ECE5DD] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90svh] landscape:max-[900px]:max-h-[95svh] landscape:max-[900px]:max-w-[560px] landscape:max-[900px]:rounded-2xl"
            >
              {/* WA-style header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#075E54] text-white">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-body text-sm font-semibold uppercase">
                  {previewName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold truncate">{previewName}</p>
                  <p className="font-body text-[11px] text-white/70">Preview pesan WhatsApp</p>
                </div>
                <button
                  onClick={() => setPreviewName(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat area */}
              <div
                className="flex-1 overflow-y-auto p-4 bg-[#ECE5DD]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)",
                  backgroundSize: "16px 16px",
                }}
              >
                <div className="ml-auto max-w-[88%] bg-[#DCF8C6] rounded-lg rounded-tr-sm px-3 py-2 shadow-sm">
                  <p className="font-body text-[13px] text-[#1f2937] whitespace-pre-wrap leading-relaxed">
                    {buildMessage(previewName)}
                  </p>
                  <p className="text-right text-[10px] text-[#667781] mt-1">
                    {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} ✓✓
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 p-3 bg-background border-t border-gold/15">
                <button
                  onClick={() => {
                    copyLink(previewName, -1);
                  }}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-gold/30 text-gold-dark font-body text-sm font-medium hover:bg-gold/10 transition flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-4 h-4" /> Salin
                </button>
                <button
                  onClick={() => {
                    sendWhatsApp(previewName);
                    setPreviewName(null);
                  }}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-[#25D366] text-white font-body text-sm font-medium hover:bg-[#1fb955] active:bg-[#1aa84c] transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Kirim WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
