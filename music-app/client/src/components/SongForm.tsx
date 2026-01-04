import { useEffect, useState } from "react";
import { createSong } from "../features/songs/songs.api";
import { getAlbums, getMyAlbums, type Album } from "../features/albums/albums.api";
import { getGenres, type Genre } from "../features/genres/genres.api";

type Me = {
  id: number;
  role: "admin" | "artist" | "listener";
};

type Props = {
  me: Me;
  onCreated: () => void;
};

export default function SongForm({ me, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [durationSec, setDurationSec] = useState<number>(0);
  const [trackNo, setTrackNo] = useState<number>(1);
  const [albumId, setAlbumId] = useState<number | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 🔒 Artist → kendi albümleri | Admin → tüm albümler
  useEffect(() => {
    if (me.role === "artist") {
      getMyAlbums().then(setAlbums);
    } else {
      getAlbums().then(setAlbums);
    }
  }, [me.role]);

  // 🎵 Genre’ları çek
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

  async function submit() {
    if (!title || !durationSec || !albumId) {
      setError("All fields except track no are required");
      return;
    }

    try {
      await createSong({
        title,
        durationSec,
        trackNo,
        albumId,
        genreIds: selectedGenreIds, // 🔥 MANY TO MANY
      });

      onCreated(); // 🔁 parent refresh

      // reset
      setTitle("");
      setDurationSec(0);
      setTrackNo(1);
      setAlbumId(null);
      setSelectedGenreIds([]);
      setError(null);
    } catch {
      setError("Song creation failed");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 p-4">
      <h3 className="mb-3 font-medium">Add Song</h3>

      {error && (
        <div className="mb-2 text-sm text-red-400">{error}</div>
      )}

      <input
        className="mb-2 w-full rounded bg-zinc-900 p-2"
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="mb-2 w-full rounded bg-zinc-900 p-2"
        type="number"
        placeholder="Duration (sec)"
        value={durationSec}
        onChange={(e) => setDurationSec(Number(e.target.value))}
      />

      <input
        className="mb-2 w-full rounded bg-zinc-900 p-2"
        type="number"
        placeholder="Track no"
        value={trackNo}
        onChange={(e) => setTrackNo(Number(e.target.value))}
      />

      <select
        className="mb-3 w-full rounded bg-zinc-900 p-2"
        value={albumId ?? ""}
        onChange={(e) => setAlbumId(Number(e.target.value))}
      >
        <option value="">Select album</option>
        {albums.map((a) => (
          <option key={a.id} value={a.id}>
            {a.title} — {a.artist.name}
          </option>
        ))}
      </select>

      {/* 🎵 GENRES */}
      {genres.length > 0 && (
        <div className="mb-3">
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

      <button
        onClick={submit}
        className="rounded bg-violet-500 px-3 py-1.5 text-sm font-medium"
      >
        Create Song
      </button>
    </div>
  );
}
