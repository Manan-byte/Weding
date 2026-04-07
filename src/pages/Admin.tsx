import { useState, useEffect } from "react";
import { Copy, Plus, Trash2, Link, Users, Check, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_PASSWORD = "manan";

interface Guest {
  id: string;
  name: string;
  created_at: string;
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [password, setPassword] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const baseUrl = window.location.origin;

  const fetchGuests = async () => {
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
  };

  useEffect(() => {
    if (authenticated) fetchGuests();
  }, [authenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast.success("Berhasil masuk!");
    } else {
      toast.error("Password salah!");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-blue-light/30 to-blush-light/30 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-background/80 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 mx-auto">
            <Lock className="w-7 h-7 text-gold-dark" />
          </div>
          <div>
            <h1 className="font-script text-3xl text-foreground mb-1">Admin Panel</h1>
            <p className="font-body text-sm text-muted-foreground">Masukkan password untuk melanjutkan</p>
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
              className="w-full px-4 py-3 rounded-lg bg-gradient-gold text-primary-foreground font-body text-sm font-medium hover:opacity-90 transition"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  const addGuest = async () => {
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
  };

  const removeGuest = async (guest: Guest) => {
    const { error } = await supabase.from("guests").delete().eq("id", guest.id);
    if (error) {
      console.error("Error removing guest:", error);
      toast.error("Gagal menghapus tamu");
    } else {
      setGuests((prev) => prev.filter((g) => g.id !== guest.id));
    }
  };

  const getLink = (name: string) => `${baseUrl}/?to=${encodeURIComponent(name)}`;

  const copyLink = (name: string, index: number) => {
    navigator.clipboard.writeText(getLink(name));
    setCopiedIndex(index);
    toast.success(`Link untuk ${name} berhasil disalin!`);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    const text = guests.map((g) => `${g.name}: ${getLink(g.name)}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Semua link berhasil disalin!");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGuest();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-blue-light/30 to-blush-light/30">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark px-4 py-1.5 rounded-full text-sm font-body mb-4">
            <Users className="w-4 h-4" />
            Admin Panel
          </div>
          <h1 className="font-script text-4xl md:text-5xl text-foreground mb-2">
            Generate Link Undangan
          </h1>
          <p className="font-body text-muted-foreground text-sm">
            Tambahkan nama tamu lalu salin link undangan personal mereka.
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-8">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik nama tamu, lalu Enter..."
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
            disabled={adding}
          />
          <button
            onClick={addGuest}
            disabled={adding}
            className="px-4 py-3 rounded-lg bg-gradient-gold text-primary-foreground font-body text-sm font-medium hover:opacity-90 transition flex items-center gap-1.5 disabled:opacity-60"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Tambah
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
              <span className="font-body text-sm text-muted-foreground">
                {guests.length} tamu
              </span>
              <button
                onClick={copyAll}
                className="font-body text-xs text-gold-dark hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Salin semua link
              </button>
            </div>

            <div className="space-y-2">
              {guests.map((guest, i) => (
                <div
                  key={guest.id}
                  className="flex items-center gap-3 bg-background/80 backdrop-blur-sm border border-gold/15 rounded-lg px-4 py-3 group"
                >
                  <Link className="w-4 h-4 text-gold-dark shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground truncate">
                      {guest.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground truncate">
                      {getLink(guest.name)}
                    </p>
                  </div>
                  <button
                    onClick={() => copyLink(guest.name, i)}
                    className="shrink-0 p-2 rounded-md hover:bg-gold/10 transition text-gold-dark"
                    title="Salin link"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => removeGuest(guest)}
                    className="shrink-0 p-2 rounded-md hover:bg-destructive/10 transition text-muted-foreground hover:text-destructive"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
