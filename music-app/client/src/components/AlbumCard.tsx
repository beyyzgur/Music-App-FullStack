import { Pencil } from "lucide-react";
import { type Album } from "../features/albums/albums.api";
import { canEditAlbum } from "../lib/permission";

type Props = {
  album: Album;
  me?: {
    id: number;
    role: "admin" | "artist" | "listener";
  } | null;
  onClick: () => void;
  onEdit?: (album: Album) => void;
};

export default function AlbumCard({ album, me, onClick, onEdit }: Props) {
  const editable = canEditAlbum(me, album);

  return (
    <div
      className="
        relative
        group rounded-2xl border border-zinc-800
        bg-zinc-900/60 p-4
        transition
        hover:-translate-y-1 hover:border-violet-500/40
      "
    >
      {/* Edit button */}
      {editable && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(album);
          }}
          className="
            absolute bottom-3 right-3
            rounded-full bg-zinc-900/80 p-2
            opacity-0 transition
            hover:bg-white/10
            group-hover:opacity-100
          "
          title="Edit album"
        >
          <Pencil size={14} className="text-zinc-300" />
        </button>
      )}

      {/* Card main button */}
      <button onClick={onClick} className="w-full text-left">
        <div className="mb-3 aspect-square overflow-hidden rounded-xl">
          <div className="h-full w-full bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-zinc-900" />
        </div>

        <h4 className="truncate text-sm font-medium text-zinc-100">
          {album.title}
        </h4>
        <p className="mt-0.5 truncate text-xs text-zinc-400">
          {album.artist.name}
        </p>
      </button>
    </div>
  );
}
