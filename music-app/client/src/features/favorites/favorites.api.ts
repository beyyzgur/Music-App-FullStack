import { api } from "../../lib/api";
import type { Song } from "../songs/songs.api";

export type Favorite = {
  id: number;
  userId: number;
  songId: number;
  createdAt: string;
  song: Song;
};

export async function getFavorites() {
  const { data } = await api.get<Favorite[]>("/favorites");
  return data;
}

export async function addFavorite(songId: number) {
  const { data } = await api.post(`/favorites/${songId}`);
  return data;
}

export async function removeFavorite(songId: number) {
  const { data } = await api.delete(`/favorites/${songId}`);
  return data;
}
