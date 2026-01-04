import { useState } from "react";
import { login, profile } from "../features/auth/auth.api";
import { api } from "../lib/api";
import { checkPasswordStrength } from "../lib/password";

type Props = {
  open: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onAuthed: (me: { id: number; username: string; role: "admin" | "listener" | "artist" }) => void;
};

// beyzoş - listener kullanıcı için şifre: Bbb123!

export default function AuthModal({ open, mode, onClose, onAuthed }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState<"admin" | "listener" | "artist">("listener");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordChecks = checkPasswordStrength(password);

  const canRegister =
    passwordChecks.length &&
    passwordChecks.upper &&
    passwordChecks.lower &&
    passwordChecks.number &&
    passwordChecks.special;

  if (!open) return null;

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") {
        await api.post("/auth/register", { username, password, roleName });
      }

      const res = await login({ username, password });
      localStorage.setItem("token", res.access_token);

      const me = await profile();
      onAuthed(me);
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Auth failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-200">
            {mode === "login" ? "Sign in" : "Create account"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs hover:border-zinc-700"
          >
            Close
          </button>
        </div>

        <div className="mt-3 grid gap-2">
          <input
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "register" && (
            <div className="mt-2 space-y-1 text-xs">
              <PasswordRule ok={passwordChecks.length} label="At least 6 characters" />
              <PasswordRule ok={passwordChecks.upper} label="One uppercase letter" />
              <PasswordRule ok={passwordChecks.lower} label="One lowercase letter" />
              <PasswordRule ok={passwordChecks.number} label="One number" />
              <PasswordRule ok={passwordChecks.special} label="One special character" />
            </div>
          )}

          {mode === "register" && (
            <select
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value as any)}
            >
              <option value="listener">listener</option>
              <option value="artist">artist</option>
              <option value="admin">admin</option>
            </select>
          )}

          {error && <div className="text-sm text-red-300">{String(error)}</div>}

          <button
            onClick={handleSubmit}
            disabled={busy || (mode === "register" && !canRegister)}
            className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 disabled:opacity-50"
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </button>

          <p className="text-xs text-zinc-500">
            {mode === "register"
              ? "Account is created, then you will be signed in automatically."
              : "Sign in to create songs (admin/artist)."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- helper component ---------- */

function PasswordRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 ${ok ? "text-green-400" : "text-zinc-400"}`}>
      <span>{ok ? "✔" : "•"}</span>
      <span>{label}</span>
    </div>
  );
}
