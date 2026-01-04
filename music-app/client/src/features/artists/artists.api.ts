import { api } from "../../lib/api";

/* ================= TYPES ================= */

export type Artist = {
  id: number;
  name: string;
  country?: string;
  isCritical: boolean;
  userId?: number;
};

/* 🔐 CREATE (ADMIN) */
export type CreateArtistDto = {
  name: string;        // artist display name
  username: string;    // login username
  password: string;    // login password
  country?: string;
  isCritical?: boolean;
};

/* ✏️ UPDATE */
export type UpdateArtistDto = {
  name?: string;
  country?: string;
  isCritical?: boolean;
};

/* ================= API ================= */

export async function getArtists() {
  const { data } = await api.get<Artist[]>("/artists");
  return data;
}

export async function createArtist(dto: CreateArtistDto) {
  const { data } = await api.post("/artists", dto);
  return data;
}

export async function updateArtist(id: number, dto: UpdateArtistDto) {
  const { data } = await api.patch(`/artists/${id}`, dto);
  return data;
}

export async function deleteArtist(id: number) {
  const { data } = await api.delete(`/artists/${id}`);
  return data;
}
