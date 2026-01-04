import { api } from "../../lib/api";

export type LoginRequest = { username: string; password: string };
export type LoginResponse = { access_token: string };

export async function login(req: LoginRequest) {
  const { data } = await api.post<LoginResponse>("/auth/login", req);
  return data;
}

export async function profile() {
  const { data } = await api.get("/auth/profile");
  return data as { id: number; username: string; role: "admin" | "listener" | "artist" };
}
