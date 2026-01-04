import AlbumForm from "./AlbumForm";
import SongForm from "./SongForm";

type Me = {
  id: number;
  username: string;
  role: "admin" | "artist" | "listener";
};

type Props = {
  me: Me;
  onAlbumCreated: () => void;
  onSongCreated: () => void;
};

export default function CreatePage({
  me,
  onAlbumCreated,
  onSongCreated,
}: Props) {
  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-xl font-semibold">Studio</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <AlbumForm me={me} onCreated={onAlbumCreated} />
        <SongForm me={me} onCreated={onSongCreated} />
      </div>
    </div>
  );
}
