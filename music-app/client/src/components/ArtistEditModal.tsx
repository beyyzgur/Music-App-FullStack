import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import {
  type Artist,
  updateArtist,
  deleteArtist,
} from "../features/artists/artists.api";

type Props = {
  artist: Artist;
  onClose: () => void;
  onUpdated: (artist: Artist) => void;
};

export default function ArtistEditModal({ artist, onClose, onUpdated }: Props) {
  const [name, setName] = useState(artist.name);
  const [country, setCountry] = useState(artist.country ?? "");
  const [isCritical, setIsCritical] = useState(artist.isCritical);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
  setLoading(true);
  setError(null);

  try {
    const updated = await updateArtist(artist.id, {
      name,
      country: country || undefined,
      isCritical,
    });

    onUpdated(updated); // 🔥 GÜNCEL ARTIST DÖNÜYOR
    onClose();
  } catch {
    setError("Artist update failed");
  } finally {
    setLoading(false);
  }
}

  async function handleDelete() {
    const ok = confirm("Are you sure you want to delete your account?");
    if (!ok) return;

    setLoading(true);
    try {
      await deleteArtist(artist.id);

      // 🔥 LOCAL LOGOUT
      localStorage.removeItem("token");

      // 🔥 FULL RESET
      window.location.href = "/"; 
    } catch {
      setError("Artist delete failed");
    } finally {
      setLoading(false);
    }
 }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Artist</h3>
          <button onClick={onClose}>
            <X className="text-zinc-400 hover:text-zinc-200" />
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded bg-red-500/10 p-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            className="w-full rounded bg-zinc-900 p-2"
            placeholder="Artist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded bg-zinc-900 p-2"
            placeholder="Country (optional)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={isCritical}
              onChange={(e) => setIsCritical(e.target.checked)}
            />
            Critical artist
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 rounded bg-red-500/10 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20"
          >
            <Trash2 size={16} />
            Delete
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded bg-violet-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
