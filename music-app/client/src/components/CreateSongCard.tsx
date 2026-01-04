import { useMemo, useState } from "react";
import type { Album } from "../features/albums/albums.api";
import { createSong } from "../features/songs/songs.api";

type Me = { id: number; username: string; role: "admin" | "listener" | "artist" } | null;

type Props = {
  me: Me;
  albums: Album[];
  onCreated: () => Promise<void>;
  setGlobalError: (msg: string | null) => void;
};

export default function CreateSongCard({ me, albums, onCreated, setGlobalError }: Props) {
  const canWrite = useMemo(() => me?.role === "admin" || me?.role === "artist", [me]);

  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [durationSec, setDurationSec] = useState("180");
  const [trackNo, setTrackNo] = useState("1");
  const [albumId, setAlbumId] = useState<string>(() => (albums[0] ? String(albums[0].id) : "1"));

  // albums yüklenince ilk albümü seçsin
  useMemo(() => {
    if (albums.length > 0 && (!albumId || albumId === "1")) {
      setAlbumId(String(albums[0].id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albums.length]);

  if (!me || !canWrite) return null;

  async function handleCreate() {
    setGlobalError(null);

    if (!title.trim()) {
      setGlobalError("Title is required");
      return;
    }
    if (!Number.isFinite(Number(durationSec)) || Number(durationSec) <= 0) {
      setGlobalError("durationSec must be a positive number");
      return;
    }
    if (!Number.isFinite(Number(trackNo)) || Number(trackNo) <= 0) {
      setGlobalError("trackNo must be a positive number");
      return;
    }
    if (!Number.isFinite(Number(albumId))) {
      setGlobalError("albumId is invalid");
      return;
    }

    setBusy(true);
    try {
      await createSong({
        title: title.trim(),
        durationSec: Number(durationSec),
        trackNo: Number(trackNo),
        albumId: Number(albumId),
      });

      setTitle("");
      setDurationSec("180");
      setTrackNo("1");
      await onCreated();
    } catch (e: any) {
      setGlobalError(e?.response?.data?.message ?? "Create song failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="text-sm font-semibold text-zinc-200">Create Song (admin/artist)</h2>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
        <input
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
          placeholder="durationSec"
          value={durationSec}
          onChange={(e) => setDurationSec(e.target.value)}
        />
        <input
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
          placeholder="trackNo"
          value={trackNo}
          onChange={(e) => setTrackNo(e.target.value)}
        />
        <select
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
        >
          {albums.map((a) => (
            <option key={a.id} value={String(a.id)}>
              {a.title} ({a.year})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleCreate}
        disabled={busy}
        className="mt-3 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 disabled:opacity-50"
      >
        Create
      </button>
    </section>
  );
}
