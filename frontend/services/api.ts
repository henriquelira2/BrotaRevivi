import Constants from "expo-constants";
import { router } from "expo-router"; 
import axios, { AxiosHeaders } from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

let isRedirecting = false;

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

      if (!isRedirecting) {
        isRedirecting = true;

        Toast.show({
          type: "error",
          text1: "Sessão expirada",
          text2: "Faça login novamente.",
        });

        setTimeout(() => {
          router.replace("/login");
          isRedirecting = false;
        }, 800);
      }
    }

    return Promise.reject(error);
  }
);
