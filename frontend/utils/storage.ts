import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "../types/auth";

export async function saveSession(token: string, user: User) {
  await AsyncStorage.multiSet([
    ["@token", token],
    ["@user", JSON.stringify(user)],
  ]);
}

export async function clearSession() {
  await AsyncStorage.multiRemove(["@token", "@user"]);
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem("@user");
  return raw ? (JSON.parse(raw) as User) : null;
}
