import { api } from "../../lib/api";

export type Genre = {
  id: number;
  name: string;
};

export async function getGenres(): Promise<Genre[]> {
  const res = await api.get("/genres");
  return res.data;
}
