import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, Loader2, Pencil, Trash2, Check, X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import floralTL from "@/assets/floral-watercolor-tl.webp";
import floralBR from "@/assets/floral-watercolor-br.webp";
import outdoorGarden from "@/assets/outdoor-garden-path.webp";
import FallingLeaves from "./FallingLeaves";

interface Wish {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const OWNER_TOKENS_KEY = "wishes_owner_tokens";

const getOwnerTokens = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(OWNER_TOKENS_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveOwnerToken = (id: string, token: string) => {
  const tokens = getOwnerTokens();
  tokens[id] = token;
  localStorage.setItem(OWNER_TOKENS_KEY, JSON.stringify(tokens));
};

const removeOwnerToken = (id: string) => {
  const tokens = getOwnerTokens();
  delete tokens[id];
  localStorage.setItem(OWNER_TOKENS_KEY, JSON.stringify(tokens));
};

const generateToken = () =>
  crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const WishesSection = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchWishes();
    setOwnedIds(new Set(Object.keys(getOwnerTokens())));
  }, []);

  // Lock scroll & ESC handler when delete modal is open
  useEffect(() => {
    if (!confirmDeleteId) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmDeleteId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [confirmDeleteId]);

  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from("wishes")
      .select("id, name, message, created_at")
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
    const token = generateToken();
    const { data, error } = await supabase
      .from("wishes")
      .insert({ name: name.trim(), message: message.trim(), owner_token: token })
      .select("id, name, message, created_at")
      .single();

    if (error) {
      console.error("Error submitting wish:", error);
      toast.error("Gagal mengirim ucapan, coba lagi");
    } else if (data) {
      saveOwnerToken(data.id, token);
      setOwnedIds((prev) => new Set(prev).add(data.id));
      setWishes((prev) => [data, ...prev]);
      setName("");
      setMessage("");
      toast.success("Terima kasih atas ucapan dan doa Anda! 🤍");
    }
    setSubmitting(false);
  };

  const startEdit = (wish: Wish) => {
    setEditingId(wish.id);
    setEditName(wish.name);
    setEditMessage(wish.message);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditMessage("");
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim() || !editMessage.trim()) {
      toast.error("Nama dan ucapan harus diisi");
      return;
    }
    const token = getOwnerTokens()[id];
    if (!token) {
      toast.error("Anda tidak memiliki izin mengubah ucapan ini");
      return;
    }

    setSavingId(id);
    const { data, error } = await supabase
      .from("wishes")
      .update({ name: editName.trim(), message: editMessage.trim() })
      .eq("id", id)
      .eq("owner_token", token)
      .select("id, name, message, created_at")
      .single();

    if (error || !data) {
      console.error("Error updating wish:", error);
      toast.error("Gagal memperbarui ucapan");
    } else {
      setWishes((prev) => prev.map((w) => (w.id === id ? data : w)));
      toast.success("Ucapan berhasil diperbarui");
      cancelEdit();
    }
    setSavingId(null);
  };

  const requestDelete = (id: string) => {
    const token = getOwnerTokens()[id];
    if (!token) {
      toast.error("Anda tidak memiliki izin menghapus ucapan ini");
      return;
    }
    setConfirmDeleteId(id);
  };

  const deleteWish = async (id: string) => {
    const token = getOwnerTokens()[id];
    if (!token) {
      toast.error("Anda tidak memiliki izin menghapus ucapan ini");
      return;
    }

    setSavingId(id);
    setConfirmDeleteId(null);
    const { error } = await supabase
      .from("wishes")
      .delete()
      .eq("id", id)
      .eq("owner_token", token);

    if (error) {
      console.error("Error deleting wish:", error);
      toast.error("Gagal menghapus ucapan");
    } else {
      removeOwnerToken(id);
      setOwnedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setWishes((prev) => prev.filter((w) => w.id !== id));
      toast.success("Ucapan dihapus");
    }
    setSavingId(null);
  };

  return (
    <section id="wishes" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={outdoorGarden} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/90" />
      </div>
      <img src={floralTL} alt="" className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-70" loading="lazy" decoding="async" width={256} height={256} />
      <img src={floralBR} alt="" className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain pointer-events-none opacity-70" loading="lazy" decoding="async" width={256} height={256} />
      <FallingLeaves count={8} />

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
          className="bg-background/95 rounded-lg p-5 sm:p-8 shadow-elegant space-y-4 border border-gold/20 mb-6 sm:mb-8"
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
              placeholder="Tuliskan ucapan dan doa restu Anda..."
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
            wishes.map((wish) => {
              const isOwner = ownedIds.has(wish.id);
              const isEditing = editingId === wish.id;
              const isBusy = savingId === wish.id;

              return (
                <div
                  key={wish.id}
                  className="bg-background/95 rounded-lg p-3.5 sm:p-4 border border-gold/15 shadow-sm"
                >
                  {isEditing ? (
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        maxLength={100}
                        placeholder="Nama"
                        className="w-full px-3 py-2 rounded-md border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                      />
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder="Ucapan & doa"
                        className="w-full px-3 py-2 rounded-md border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none"
                      />
                      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={isBusy}
                          className="w-full sm:w-auto px-3 py-2 rounded-md border border-border text-xs font-body text-muted-foreground hover:bg-muted/40 transition flex items-center justify-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" /> Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEdit(wish.id)}
                          disabled={isBusy}
                          className="w-full sm:w-auto px-4 py-2 rounded-md bg-gradient-gold text-primary-foreground text-xs font-body font-medium hover:opacity-90 transition flex items-center justify-center gap-1.5 disabled:opacity-60"
                        >
                          {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="min-w-0 flex-1">
                          <p className="font-body text-sm font-semibold text-gold-dark truncate">{wish.name}</p>
                          <p className="font-body text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                            {new Date(wish.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        {isOwner && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEdit(wish)}
                              disabled={isBusy}
                              title="Edit ucapan"
                              aria-label="Edit ucapan"
                              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md border border-gold/30 text-gold-dark hover:bg-gold/10 active:bg-gold/20 transition text-xs font-body font-medium"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => requestDelete(wish.id)}
                              disabled={isBusy}
                              title="Hapus ucapan"
                              aria-label="Hapus ucapan"
                              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 active:bg-destructive/20 transition text-xs font-body font-medium disabled:opacity-60"
                            >
                              {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                              <span className="hidden sm:inline">Hapus</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap break-words">{wish.message}</p>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Elegant delete confirmation modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={false}
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Tutup"
              onClick={() => setConfirmDeleteId(null)}
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, hsl(var(--foreground) / 0.55) 0%, hsl(var(--foreground) / 0.78) 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            />
            {/* Card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-wish-title"
              className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-background shadow-elegant ring-1 ring-gold/25"
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10, transition: { duration: 0.18, ease: "easeIn" } }}
              transition={{ type: "spring", stiffness: 280, damping: 26, mass: 0.9 }}
            >
              {/* Top accent strip */}
              <div className="h-1 w-full bg-gradient-gold" />
              {/* Inner gold hairline frame */}
              <div className="pointer-events-none absolute inset-[6px] rounded-[1.35rem] ring-1 ring-gold/15" />

              {/* Decorative floral corners */}
              <img src={floralTL} alt="" className="absolute -top-2 -left-2 w-24 h-24 object-contain pointer-events-none opacity-60 mix-blend-multiply" loading="lazy" decoding="async" width={192} height={192} />
              <img src={floralBR} alt="" className="absolute -bottom-3 -right-3 w-24 h-24 object-contain pointer-events-none opacity-80 mix-blend-multiply" loading="lazy" decoding="async" width={192} height={192} />

              <div className="relative px-7 pt-9 pb-7 text-center">
                {/* Icon with layered halo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.08, type: "spring", stiffness: 320, damping: 18 }}
                  className="relative mx-auto mb-5 h-16 w-16"
                >
                  <span className="absolute inset-0 rounded-full bg-destructive/10" />
                  <span className="absolute inset-1.5 rounded-full bg-destructive/15 ring-1 ring-destructive/25" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <AlertTriangle className="h-7 w-7 text-destructive" strokeWidth={1.75} />
                  </span>
                </motion.div>

                <p className="font-body text-[10px] tracking-[0.32em] uppercase text-sage-green-deep mb-2.5">
                  Konfirmasi
                </p>
                <h3 id="delete-wish-title" className="font-script text-[2rem] leading-tight text-foreground mb-3">
                  Hapus Ucapan?
                </h3>
                <div className="ornament-divider max-w-[140px] mx-auto mb-4">
                  <Heart className="w-4 h-4 text-gold-dark fill-gold-dark" />
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-7 px-1">
                  Ucapan dan doa ini akan dihapus secara permanen<br className="hidden sm:inline" /> dan tidak dapat dikembalikan.
                </p>

                <div className="flex flex-col-reverse sm:flex-row gap-2.5">
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setConfirmDeleteId(null)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gold/30 text-foreground/80 font-body text-sm tracking-wide hover:bg-gold/5 hover:border-gold/50 active:bg-gold/10 transition-all duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteWish(confirmDeleteId)}
                    className="flex-1 px-4 py-3 rounded-xl text-destructive-foreground font-body text-sm font-medium tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--destructive)) 0%, hsl(var(--destructive) / 0.85) 100%)",
                      boxShadow: "0 8px 20px -8px hsl(var(--destructive) / 0.55)",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WishesSection;
