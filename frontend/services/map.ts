import { api } from "./api";

export type MapPoint = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
};

export async function fetchMapPoints(): Promise<MapPoint[]> {
  const { data } = await api.get<MapPoint[]>("/users");
  return data;
}
