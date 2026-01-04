import { api } from "../../lib/api";

export type Artist = {
  id: number;
  name: string;
  country: string;
  isCritical: boolean;
};

export type Album = {
  id: number;
  title: string;
  year: number;
  artist: Artist;
};

export async function getAlbums() {
  const { data } = await api.get<Album[]>("/albums");
  return data;
}

export async function getMyAlbums() {
  const { data } = await api.get<Album[]>("/albums/my");
  return data;
}

export type CreateAlbumDto = {
  title: string;
  year?: number;
  artistId?: number;
};

export async function createAlbum(dto: CreateAlbumDto) {
  const { data } = await api.post("/albums", dto);
  return data;
}

export type UpdateAlbumDto = {
  title?: string;
  year?: number;
};

export async function updateAlbum(id: number, dto: UpdateAlbumDto) {
  const { data } = await api.patch(`/albums/${id}`, dto);
  return data;
}

export async function deleteAlbum(id: number) {
  const { data } = await api.delete(`/albums/${id}`);
  return data;
}
