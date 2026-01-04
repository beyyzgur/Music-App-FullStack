import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import {
  type Album,
  updateAlbum,
  deleteAlbum,
} from "../features/albums/albums.api";

type Props = {
  album: Album;
  onClose: () => void;
  onUpdated: () => void;
};

export default function AlbumEditModal({
  album,
  onClose,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState(album.title);
  const [year, setYear] = useState<number | undefined>(album.year);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate() {
    setLoading(true);
    setError(null);

    try {
      await updateAlbum(album.id, {
        title,
        year,
      });

      onUpdated();
      onClose();
    } catch {
      setError("Album update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const ok = confirm(
      "Are you sure you want to delete this album and its songs?"
    );
    if (!ok) return;

    setLoading(true);

    try {
      await deleteAlbum(album.id);
      onUpdated();
      onClose();
    } catch {
      setError("Album delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Album</h3>
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
            placeholder="Album title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            className="w-full rounded bg-zinc-900 p-2"
            placeholder="Year (optional)"
            value={year ?? ""}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>

        {/* Actions */}
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
            onClick={handleUpdate}
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
