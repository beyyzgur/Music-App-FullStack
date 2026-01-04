import { useEffect, useState } from "react";
import { getArtists, type Artist } from "../features/artists/artists.api";
import ArtistCard from "./ArtistCard";
import ArtistEditModal from "./ArtistEditModal";
import ArtistCreateModal from "./ArtistCreateModal";

type Me = {
  id: number;
  role: "admin" | "artist" | "listener";
};

type Props = {
  me?: Me | null;
  onArtistUpdated: () => void; // 🔥 YENİ
};

export default function ArtistsPage({ me, onArtistUpdated }: Props) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [editing, setEditing] = useState<Artist | null>(null);
  const [creating, setCreating] = useState(false);

  async function refresh() {
    setArtists(await getArtists());
  }

  function handleArtistUpdated(updated: Artist) {
  setArtists(prev =>
    prev.map(a => (a.id === updated.id ? updated : a))
  );

  onArtistUpdated(); // 🔁 App.tsx’e haber
}

  useEffect(() => {
    refresh();
  }, []);

  return (
    <>
      {/* ✅ ADMIN ADD BUTTON */}
      {me?.role === "admin" && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setCreating(true)}
            className="rounded bg-violet-500 px-4 py-1.5 m-4 text-sm font-medium text-white hover:bg-violet-400"
          >
            + Add Artist
          </button>
        </div>
      )}

      {/* ✅ EMPTY STATE */}
      {artists.length === 0 ? (
        <div className="mt-12 text-center text-sm text-zinc-400">
          No artists found.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              me={me}
              onEdit={(a) => setEditing(a)}
            />
          ))}
        </div>
      )}

      {/* ✏️ EDIT MODAL */}
      {editing && (
        <ArtistEditModal
          artist={editing}
          onClose={() => setEditing(null)}
          onUpdated={handleArtistUpdated}
        />

      )}

      {/* ➕ CREATE MODAL */}
      {creating && (
        <ArtistCreateModal
          onClose={() => setCreating(false)}
          onCreated={async () => {
            await refresh();          // 🟢 ArtistsPage içi
            onArtistUpdated?.();      // 🔥 App’e haber
          }}
        />
      )}
    </>
  );
}
