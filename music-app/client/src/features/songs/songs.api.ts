import { api } from "../../lib/api";
import type { Album } from "../albums/albums.api";

export type Genre = {
  id: number;
  name: string;
};

export type Song = {
  id: number;
  title: string;
  durationSec: number;
  trackNo: number;
  album?: Album;
  genres: Genre[]; // 🔥 EKLENEN KISIM
  createdAt: string;
  updatedAt: string;
};

export type CreateSongDto = {
  title: string;
  durationSec: number;
  trackNo: number;
  albumId: number;
  genreIds?: number[];
};

export async function getSongs() {
  const { data } = await api.get<Song[]>("/songs");
  return data;
}

export async function getSongsByAlbum(albumId: number) {
  const { data } = await api.get<Song[]>(`/songs/by-album/${albumId}`);
  return data;
}

export async function createSong(dto: CreateSongDto) {
  const { data } = await api.post("/songs", dto);
  return data;
}

export type UpdateSongDto = {
  title?: string;
  durationSec?: number;
  trackNo?: number;
  genreIds?: number[];
};

export async function updateSong(id: number, dto: UpdateSongDto) {
  const { data } = await api.patch(`/songs/${id}`, dto);
  return data;
}

export async function deleteSong(id: number) {
  const { data } = await api.delete(`/songs/${id}`);
  return data;
}