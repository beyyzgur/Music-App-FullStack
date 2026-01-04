import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { type Song, updateSong, deleteSong } from "../features/songs/songs.api";
import { getGenres, type Genre } from "../features/genres/genres.api";

type Props = {
  song: Song;
  onClose: () => void;
  onUpdated: () => void;
};

export default function SongEditModal({ song, onClose, onUpdated }: Props) {
  const [title, setTitle] = useState(song.title);
  const [durationSec, setDurationSec] = useState(song.durationSec);
  const [trackNo, setTrackNo] = useState(song.trackNo ?? 1);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>(
    song.genres?.map((g) => g.id) ?? []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 tüm genre’ları çek
  useEffect(() => {
    getGenres().then(setGenres);
  }, []);

  function toggleGenre(id: number) {
    setSelectedGenreIds((prev) =>
      prev.includes(id)
        ? prev.filter((g) => g !== id)
        : [...prev, id]
    );
  }

  async function handleUpdate() {
    setLoading(true);
    setError(null);

    try {
      await updateSong(song.id, {
        title,
        durationSec,
        trackNo,
        genreIds: selectedGenreIds, // 🔥 MANY TO MANY UPDATE
      });

      onUpdated();
      onClose();
    } catch {
      setError("Song update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const ok = confirm("Are you sure you want to delete this song?");
    if (!ok) return;

    setLoading(true);

    try {
      await deleteSong(song.id);
      onUpdated();
      onClose();
    } catch {
      setError("Song delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Song</h3>
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
            placeholder="Song title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            className="w-full rounded bg-zinc-900 p-2"
            placeholder="Duration (sec)"
            value={durationSec}
            onChange={(e) => setDurationSec(Number(e.target.value))}
          />

          <input
            type="number"
            className="w-full rounded bg-zinc-900 p-2"
            placeholder="Track no"
            value={trackNo}
            onChange={(e) => setTrackNo(Number(e.target.value))}
          />

          {/* 🎵 GENRES */}
          {genres.length > 0 && (
            <div>
              <p className="mb-1 text-sm text-zinc-400">Genres</p>
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <label
                    key={g.id}
                    className="
                      flex items-center gap-2
                      rounded border border-zinc-800
                      bg-zinc-900 px-2 py-1
                      text-xs text-zinc-300
                      cursor-pointer
                    "
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenreIds.includes(g.id)}
                      onChange={() => toggleGenre(g.id)}
                    />
                    {g.name}
                  </label>
                ))}
              </div>
            </div>
          )}
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
