"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CarTaxiFront, Lock, User, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Login failed");
        setBusy(false);
      }
    } catch {
      setError("Network error — try again");
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-xl border border-slate-900/15 bg-white/80 px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-brand-500/70 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-3xl p-7">
        <div className="flex items-center justify-center gap-2">
          <span className="grid size-11 place-items-center rounded-xl bg-brand-400 text-slate-950 glow-brand">
            <CarTaxiFront className="size-6" />
          </span>
        </div>
        <h1 className="font-display mt-4 text-center text-xl font-bold">Admin Login</h1>
        <p className="mt-1 text-center text-xs text-slate-500">Manage your website content & theme</p>

        <div className="relative mt-6">
          <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-500 dark:text-brand-400" />
          <input className={input} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        </div>
        <div className="relative mt-3">
          <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-500 dark:text-brand-400" />
          <input className={input} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-400 py-3 text-sm font-bold text-slate-950 transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />} Sign In
        </button>
      </form>
    </main>
  );
}
