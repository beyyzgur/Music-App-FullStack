import { type Song } from "../features/songs/songs.api";
import SongCard from "./SongCard";
import { canEdit } from "../lib/permission";
import { Pencil } from "lucide-react";

type Me = {
  id: number;
  username: string;
  role: "admin" | "artist" | "listener";
} | null;

type Props = {
  songs: Song[];
  favoriteIds: Set<number>;
  onToggleFavorite: (id: number) => void;
  me: Me;
  onEditSong: (song: Song) => void;
};

export default function SongsList({
  songs,
  favoriteIds,
  onToggleFavorite,
  me,
  onEditSong,
}: Props) {
  if (songs.length === 0) {
    return (
      <div className="mt-12 text-center text-sm text-zinc-400">
        No songs found.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {songs.map((song) => (
        <div key={song.id} className="relative">
          <SongCard
            song={song}
            isFavorite={favoriteIds.has(song.id)}
            onToggleFavorite={onToggleFavorite}
          />

          {canEdit(me, song.album?.artist?.name) && (
            <button
              onClick={() => onEditSong(song)}
              className="absolute bottom-3 right-3 rounded-full bg-zinc-900/80 p-2 
                        hover:bg-violet-500 transition"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
