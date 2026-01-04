import { type Album } from "../features/albums/albums.api";
import { type Song } from "../features/songs/songs.api";
import { type Artist } from "../features/artists/artists.api";

type Me = {
  id: number;
  username: string;
  role: "admin" | "artist" | "listener";
} | null;

export function canEdit(
  me: Me,
  itemArtistName?: string
): boolean {
  if (!me) return false;
  if (me.role === "admin") return true;
  if (me.role === "artist" && me.username === itemArtistName) return true;
  return false;
}

export function canEditAlbum(me: any, album: Album) {
  if (!me) return false;
  if (me.role === "admin") return true;
  if (me.role === "artist") {
    return album.artist?.id === me.id;
  }
  return false;
}

export function canEditSong(me: any, song: Song) {
  if (!me) return false;

  if (me.role === "admin") return true;

  if (me.role === "artist") {
    return song.album?.artist?.id === me.id;
  }

  return false;
}

export function canEditArtist(
  me: { id: number; role: string } | null | undefined,
  artist: { userId?: number }
) {
  if (!me) return false;

  if (me.role === "admin") return true;

  if (me.role === "artist") {
    return artist.userId === me.id;
  }

  return false;
}

