import { Pencil } from "lucide-react";
import { type Artist } from "../features/artists/artists.api";
import Cover from "./Cover";
import { canEditArtist } from "../lib/permission";

type Props = {
  artist: Artist;
  me?: {
    id: number;
    role: "admin" | "artist" | "listener";
  } | null;
  onEdit?: (artist: Artist) => void;
};

export default function ArtistCard({ artist, me, onEdit }: Props) {
  const editable = canEditArtist(me, artist);

  console.log("ME:", me);
console.log("ARTIST:", artist);
console.log("CAN EDIT:", canEditArtist(me, artist));


  return (
    <div
      className="
        relative rounded-2xl border border-zinc-800
        bg-zinc-900/60 p-4
        transition
        hover:-translate-y-1 hover:border-violet-500/40
        group
      "
    >
      {editable && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(artist);
          }}
          className="
            absolute bottom-3 right-3
            rounded-full bg-zinc-900/80 p-2
            opacity-0 transition
            hover:bg-white/10
            group-hover:opacity-100
          "
          title="Edit artist"
        >
          <Pencil size={14} className="text-zinc-300" />
        </button>
      )}

      <div className="mb-3 aspect-square overflow-hidden rounded-full">
        <Cover seed={artist.name} rounded={false} />
      </div>

      <h4 className="truncate text-center text-sm font-medium text-zinc-100">
        {artist.name}
      </h4>

      {artist.country && (
        <p className="mt-0.5 text-center text-xs text-zinc-400">
          {artist.country}
        </p>
      )}
    </div>
  );
}
