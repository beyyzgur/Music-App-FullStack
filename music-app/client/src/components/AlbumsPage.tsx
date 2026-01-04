import { type Album } from "../features/albums/albums.api";
import AlbumCard from "./AlbumCard";
import { canEdit } from "../lib/permission";
import { Pencil } from "lucide-react";

type Me = {
  id: number;
  username: string;
  role: "admin" | "artist" | "listener";
} | null;

type Props = {
  albums: Album[];
  me: Me;
  onSelectAlbum: (albumId: number) => void;
  onEditAlbum: (album: Album) => void;
};

export default function AlbumsPage({
  albums,
  me,
  onSelectAlbum,
  onEditAlbum,
}: Props) {
  if (albums.length === 0) {
    return (
      <div className="mt-12 text-center text-sm text-zinc-400">
        No albums found.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {albums.map((album) => (
        <div key={album.id} className="relative">
          <AlbumCard
            album={album}
            onClick={() => onSelectAlbum(album.id)}
          />

          {canEdit(me, album.artist.name) && (
            <button
              onClick={() => onEditAlbum(album)}
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
