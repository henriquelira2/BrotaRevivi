import { api } from "./api";

export type UrbanVoid = {
  id: string;
  title: string;
  description?: string;
  lat: number | string;
  lng: number | string;
  photoUrl?: string;
  type: string;
  risk: string;
  photoUrls?: string[];
  createdBy: string;
  createdAt: string;
};

export type CreateVoidPayload = {
  title: string;
  description?: string;
  lat: number;
  lng: number;
  photoUrl?: string;
  type: string;
  risk: string;
  photoUrls?: string[];
};

export type UpdateVoidPayload = Partial<CreateVoidPayload>;

export async function listVoids() {
  const { data } = await api.get<UrbanVoid[]>("/voids");
  return data;
}

export async function createVoid(payload: CreateVoidPayload) {
  const { data } = await api.post<UrbanVoid>("/voids", payload);
  return data;
}

export async function updateVoid(id: string, payload: UpdateVoidPayload) {
  const { data } = await api.patch<UrbanVoid>(`/voids/${id}`, payload);
  return data;
}
