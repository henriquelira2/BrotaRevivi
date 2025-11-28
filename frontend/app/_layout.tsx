import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Slot } from "expo-router";
import { login } from "../services/auth";
import type { User } from "../types/auth";
import Toast from "react-native-toast-message";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
type AuthContextData = {
  user: User | null;
  loadingAuth: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);

  useEffect(() => {
    async function loadStorage() {
      try {
        const [[, token], [, userJson]] = await AsyncStorage.multiGet([
          "@token",
          "@user",
        ]);

        if (token && userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (e) {
        console.log("Erro ao carregar storage:", e);
      } finally {
        setLoadingApp(false);
      }
    }

    loadStorage();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      setLoadingAuth(true);

      const data = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      await AsyncStorage.multiSet([
        ["@token", data.access_token],
        ["@user", JSON.stringify(data.user)],
      ]);

      setUser(data.user);
    } finally {
      setLoadingAuth(false);
    }
  }

  useEffect(() => {
    async function hideNavBar() {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    }

    hideNavBar();
  }, []);

  async function signOut() {
    setUser(null);
    await AsyncStorage.multiRemove(["@token", "@user"]);
  }

  if (loadingApp) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loadingAuth, signIn, signOut }}>
      <Toast />
      {children ?? <Slot />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  return <AuthProvider />;
}
