import { useEffect, useState } from "react";
import { createAlbum } from "../features/albums/albums.api";
import { getArtists, type Artist } from "../features/artists/artists.api";

type Me = {
  id: number;
  role: "admin" | "artist" | "listener";
};

type Props = {
  me: Me;
  onCreated: () => void;
};

export default function AlbumForm({ me, onCreated }: Props) {
  const isAdmin = me.role === "admin";

  const [title, setTitle] = useState("");
  const [year, setYear] = useState<number | undefined>();
  const [artistId, setArtistId] = useState<number | undefined>(undefined);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      getArtists().then(setArtists);
    }
  }, [isAdmin]);

  async function submit() {
    if (!title) {
      setError("Album title is required");
      return;
    }

    try {
      await createAlbum({
        title,
        year,
        ...(isAdmin && { artistId: artistId! }),
      });
      
      onCreated();
      setTitle("");
      setYear(undefined);
      setArtistId(undefined);
      setError(null);
    } catch {
      setError("Album creation failed");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 p-4">
      <h3 className="mb-3 font-medium">Add Album</h3>

      {error && (
        <div className="mb-2 text-sm text-red-400">{error}</div>
      )}

      <input
        className="mb-2 w-full rounded bg-zinc-900 p-2"
        placeholder="Album title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="mb-2 w-full rounded bg-zinc-900 p-2"
        type="number"
        placeholder="Year (optional)"
        value={year ?? ""}
        onChange={(e) => setYear(Number(e.target.value))}
      />

      {isAdmin && (
        <select
          className="mb-3 w-full rounded bg-zinc-900 p-2"
          value={artistId ?? ""}
          onChange={(e) => setArtistId(Number(e.target.value))}
        >
          <option value="">Select artist</option>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={submit}
        className="rounded bg-violet-500 px-3 py-1.5 text-sm font-medium"
      >
        Create Album
      </button>
    </div>
  );
}