import type { Favorite } from "../features/favorites/favorites.api";

type Props = {
  open: boolean;
  onClose: () => void;
  favorites: Favorite[];
  onRemove: (songId: number) => Promise<void>;
};

export default function FavoritesModal({ open, onClose, favorites, onRemove }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-200">Favorites</h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs hover:border-zinc-700"
          >
            Close
          </button>
        </div>

        <div className="mt-3 grid gap-2">
          {favorites.map((f) => (
            <div key={f.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm">
                  <span className="font-medium">{f.song.title}</span>{" "}
                  <span className="text-zinc-400">• {f.song.durationSec}s • track #{f.song.trackNo}</span>
                  {f.song.album && (
                    <div className="mt-1 text-xs text-zinc-400">
                      Album: <span className="text-zinc-200">{f.song.album.title}</span> ({f.song.album.year})
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onRemove(f.songId)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-red-300 hover:border-zinc-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {favorites.length === 0 && <div className="text-sm text-zinc-400">No favorites yet.</div>}
        </div>
      </div>
    </div>
  );
}
