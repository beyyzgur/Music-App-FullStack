import { type Song } from "../features/songs/songs.api";
import Cover from "./Cover";
import { Heart, Pencil } from "lucide-react";
import { canEditSong } from "../lib/permission";

type Props = {
  song: Song;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  me?: {
    id: number;
    role: "admin" | "artist" | "listener";
  } | null;
  onEdit?: (song: Song) => void;
};

export default function SongCard({
  song,
  isFavorite,
  onToggleFavorite,
  me,
  onEdit,
}: Props) {
  const editable = canEditSong(me, song);

  return (
    <div
      className="
        group rounded-2xl border border-zinc-800
        bg-zinc-900/60 p-4
        transition
        hover:-translate-y-1 hover:border-violet-500/40
        hover:shadow-[0_0_0_1px_rgba(139,92,246,0.2)]
      "
    >
      {/* 🎵 COVER (EDIT + FAVORITE BURANIN İÇİNDE!) */}
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl">
        <Cover seed={song.album?.id ?? song.id} />

        {/* ❤️ FAVORITE */}
        <button
          onClick={() => onToggleFavorite(song.id)}
          className="absolute top-3 right-3 z-10 rounded-full bg-zinc-900/80 p-2 transition hover:bg-violet-500"
        >
          <Heart
            size={18}
            className={
              isFavorite
                ? "fill-violet-500 text-violet-500"
                : "text-zinc-400 hover:text-violet-400"
            }
          />
        </button>

        {/* ✏️ EDIT — COVER OVERLAY */}
        {editable && onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(song);
            }}
            className="
              absolute bottom-3 right-3 z-10
              rounded-full bg-zinc-900/80 p-2
              opacity-0 transition
              hover:bg-violet-500
              group-hover:opacity-100
            "
            title="Edit song"
          >
            <Pencil size={14} className="text-zinc-200" />
          </button>
        )}
      </div>

      {/* ℹ️ INFO */}
      <div>
        <h4 className="truncate text-sm font-medium text-zinc-100">
          {song.title}
        </h4>
        <p className="mt-0.5 truncate text-xs text-zinc-400">
          {song.album?.artist?.name}
        </p>
      </div>

      {/* 🏷️ GENRES */}
      {/* 🏷️ GENRES — SABİT YÜKSEKLİK */}
      <div className="mt-2 min-h-[20px] flex flex-wrap gap-1">
        {Array.isArray(song.genres) &&
          song.genres.map((g) => (
            <span
              key={g.id}
              className="rounded bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-300"
            >
              {g.name}
            </span>
          ))}
      </div>
    </div>
  );
}
