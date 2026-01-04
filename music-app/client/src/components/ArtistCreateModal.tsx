import { useState } from "react";
import { X } from "lucide-react";
import { createArtist } from "../features/artists/artists.api";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function ArtistCreateModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!name || !username || !password) {
      setError("Name, username and password are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createArtist({
        name,                 // artist display name
        username,             // login username
        password,             // backend RegisterDto rules apply
        country: country || undefined,
      });

      onCreated(); // 🔁 listeyi yenile
      onClose();   // ❌ modalı kapat
    } catch (e: any) {
      setError(
        e?.response?.data?.message ??
          "Artist creation failed. Please check the inputs."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Artist</h3>
          <button onClick={onClose}>
            <X className="text-zinc-400 hover:text-zinc-200" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3 rounded bg-red-500/10 p-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          <input
            className="w-full rounded bg-zinc-900 p-2"
            placeholder="Artist name (display name)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded bg-zinc-900 p-2"
            placeholder="Username (login)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full rounded bg-zinc-900 p-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="w-full rounded bg-zinc-900 p-2"
            placeholder="Country (optional)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="mt-6">
          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded bg-violet-500 py-2 text-sm font-medium text-white hover:bg-violet-400 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Artist"}
          </button>
        </div>
      </div>
    </div>
  );
}
