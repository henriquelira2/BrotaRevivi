import { api } from "./api";
import type { AppUser } from "../types/user";

export async function listUsers(): Promise<AppUser[]> {
  const { data } = await api.get<AppUser[]>("/users");
  return data;
}

export async function getUser(id: string): Promise<AppUser> {
  const { data } = await api.get<AppUser>(`/users/${id}`);
  return data;
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AppUser> {
  const { data } = await api.post<AppUser>("/users", payload);
  return data;
}

export async function updateUser(
  id: string,
  payload: Partial<AppUser>
): Promise<AppUser> {
  const { data } = await api.patch<AppUser>(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
