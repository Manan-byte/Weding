import { useState, useEffect, useCallback, memo } from "react";
import { Copy, Plus, Trash2, Link, Users, Check, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_PASSWORD = "manan";

interface Guest {
  id: string;
  name: string;
  created_at: string;
}

const GuestRow = memo(({ guest, index, baseUrl, copiedIndex, onCopy, onRemove }: {
  guest: Guest;
  index: number;
  baseUrl: string;
  copiedIndex: number | null;
  onCopy: (name: string, index: number) => void;
  onRemove: (guest: Guest) => void;
}) => {
  const link = `${baseUrl}/?to=${encodeURIComponent(guest.name)}`;
  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-background/80 backdrop-blur-sm border border-gold/15 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 group">
      <Link className="w-4 h-4 text-gold-dark shrink-0 hidden sm:block" />
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-foreground truncate">{guest.name}</p>
        <p className="font-body text-[10px] sm:text-xs text-muted-foreground truncate">{link}</p>
      </div>
      <button
        onClick={() => onCopy(guest.name, index)}
        className="shrink-0 p-1.5 sm:p-2 rounded-md hover:bg-gold/10 active:bg-gold/20 transition text-gold-dark"
        title="Salin link"
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

  useEffect(() => {
    if (authenticated) fetchGuests();
  }, [authenticated, fetchGuests]);

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
      toast.error("Gagal menghapus tamu");
    } else {
      setGuests((prev) => prev.filter((g) => g.id !== guest.id));
    }
  }, []);

  const getLink = useCallback((name: string) => `${baseUrl}/?to=${encodeURIComponent(name)}`, [baseUrl]);

  const copyLink = useCallback((name: string, index: number) => {
    const link = `${baseUrl}/?to=${encodeURIComponent(name)}`;
    const message = `💍 *Undangan Pernikahan Irma & Manan*\n\nAssalamu'alaikum Wr. Wb.\n\nKepada Yth.\nBapak/Ibu/Saudara/i *${name}*\n\nDengan memohon rahmat Allah SWT, kami mengundang Anda untuk hadir di acara pernikahan kami.\n\n📅 10 Juni 2026\n📍 Cilacap, Jawa Tengah\n\nBuka undangan di:\n${link}\n\nMerupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nWassalamu'alaikum Wr. Wb.\n_Irma & Manan_`;
    navigator.clipboard.writeText(message);
    setCopiedIndex(index);
    toast.success(`Pesan undangan untuk ${name} berhasil disalin!`);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, [baseUrl]);

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
      toast.error("Nama tamu sudah ada dalam daftar");
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
      toast.error("Gagal menambah tamu");
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
      <div className="min-h-screen bg-gradient-to-b from-sky-blue-light/30 to-blush-light/30 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-background/80 backdrop-blur-sm border border-gold/20 rounded-2xl p-6 sm:p-8 text-center space-y-5 sm:space-y-6">
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
    <div className="min-h-screen bg-gradient-to-b from-sky-blue-light/30 to-blush-light/30">
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-body mb-3 sm:mb-4">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Admin Panel
          </div>
          <h1 className="font-script text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">
            Generate Link Undangan
          </h1>
          <p className="font-body text-muted-foreground text-xs sm:text-sm">
            Tambahkan nama tamu lalu salin link undangan personal mereka.
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-6 sm:mb-8">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik nama tamu..."
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
                {guests.length} tamu
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
                  onRemove={removeGuest}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-muted-foreground font-body text-sm">
            Belum ada tamu. Mulai tambahkan nama di atas.
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
