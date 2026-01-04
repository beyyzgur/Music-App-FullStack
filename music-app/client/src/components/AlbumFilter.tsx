import type { Album } from "../features/albums/albums.api";

type Props = {
  albums: Album[];
  selectedAlbumId: string;
  setSelectedAlbumId: (v: string) => void;
  onAllSongs: () => void;
  onApply: () => void;
  error?: string | null;
};

export default function AlbumFilter({
  albums,
  selectedAlbumId,
  setSelectedAlbumId,
  onAllSongs,
  onApply,
  error,
}: Props) {
  return (
    <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onAllSongs}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm hover:border-zinc-700"
        >
          All Songs
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Album</span>
          <select
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
            value={selectedAlbumId}
            onChange={(e) => setSelectedAlbumId(e.target.value)}
          >
            <option value="all">All</option>
            {albums.map((a) => (
              <option key={a.id} value={String(a.id)}>
                {a.title} ({a.year}) — {a.artist.name}
              </option>
            ))}
          </select>

          <button
            onClick={onApply}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm hover:border-zinc-700"
          >
            Apply
          </button>
        </div>
      </div>

      {error && <div className="mt-3 text-sm text-red-300">{String(error)}</div>}
    </section>
  );
}
