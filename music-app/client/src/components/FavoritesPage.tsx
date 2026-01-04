import { type Favorite } from "../features/favorites/favorites.api";
import SongCard from "./SongCard";

type Props = {
  favorites: Favorite[];
  onRemove: (songId: number) => void;
};

export default function FavoritesPage({ favorites, onRemove }: Props) {
  if (favorites.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="text-sm text-zinc-400">
          You haven’t added any favorites yet.
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Tap the heart icon on a song to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {favorites.map((fav) => (
        <SongCard
          key={fav.song.id}
          song={fav.song}
          isFavorite={true}
          onToggleFavorite={() => onRemove(fav.song.id)}
        />
      ))}
    </div>
  );
}
