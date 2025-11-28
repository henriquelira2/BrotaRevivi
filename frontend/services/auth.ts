import { api } from "./api";
import type { LoginResponse, User } from "../types/auth";

export async function register(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/register", payload);
  return data;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>("/auth/profile");
  return data;
}
