import axios, { AxiosHeaders } from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API_URL =
  (Constants.expoConfig?.extra as any)?.API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@token");

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401 && message === "Unauthorized") {
      await AsyncStorage.removeItem("@token");

      Alert.alert(
        "Sessão expirada",
        "Sua sessão expirou. Faça login novamente."
      );
    }

    return Promise.reject(error);
  }
);
