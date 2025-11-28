// app/(drawer)/index.tsx  (HomeScreen)

import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../_layout";
import { DrawerActions } from "@react-navigation/native";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <ImageBackground
      source={require("../../assets/background2.png")}
      resizeMode="cover"
      style={styles.bg}
    >
      <View style={styles.overlay} />

      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={24} color="#f9fafb" />
          </TouchableOpacity>

          <View>
            <Text style={styles.welcomeText}>Bem-vindo(a)</Text>
            <Text style={styles.username}>{user?.name || "Usuário"}</Text>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="leaf" size={22} color="#166534" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            <View style={styles.chipsRow}>
              <View style={[styles.chip, styles.chipActive]}>
                <Text style={[styles.chipText, styles.chipTextActive]}>
                  Geral
                </Text>
              </View>

              <TouchableOpacity
                style={styles.chip}
                onPress={() => router.push("/meus-pontos")}
              >
                <Text style={styles.chipText}>Meus pontos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chip}
                onPress={() => router.push("/map")}
              >
                <Text style={styles.chipText}>Mapa</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.mainCard}
              activeOpacity={0.9}
              onPress={() => router.push("/map")}
            >
              <View style={styles.mainCardTextArea}>
                <Text style={styles.mainCardTitle}>
                  Explorar vazios urbanos
                </Text>
                <Text style={styles.mainCardSubtitle}>
                  Veja no mapa áreas subutilizadas e potenciais espaços verdes.
                </Text>

                <TouchableOpacity
                  style={styles.mainCardButton}
                  onPress={() => router.push("/map")}
                >
                  <Text style={styles.mainCardButtonText}>Abrir mapa</Text>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={20}
                    color="#ECFDF3"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.mainCardIllustration}>
                <Ionicons name="map" size={64} color="#bbf7d0" />
              </View>
            </TouchableOpacity>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ações rápidas</Text>
            </View>

            <View className="quickActionsGrid" style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickCard}
                activeOpacity={0.85}
                onPress={() => router.push("/map")}
              >
                <View style={styles.quickIconWrapper}>
                  <MaterialIcons
                    name="add-location-alt"
                    size={24}
                    color="#16a34a"
                  />
                </View>
                <Text style={styles.quickTitle}>Cadastrar ponto</Text>
                <Text style={styles.quickSubtitle}>
                  Registre um novo vazio urbano.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickCard}
                activeOpacity={0.85}
                onPress={() => router.push("/profile")}
              >
                <View style={styles.quickIconWrapper}>
                  <Ionicons name="people" size={24} color="#0ea5e9" />
                </View>
                <Text style={styles.quickTitle}>Comunidade</Text>
                <Text style={styles.quickSubtitle}>
                  Veja quem também está mapeando.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickCard}
                activeOpacity={0.85}
                onPress={() => router.push("/meus-pontos")}
              >
                <View style={styles.quickIconWrapper}>
                  <Ionicons name="leaf" size={24} color="#65a30d" />
                </View>
                <Text style={styles.quickTitle}>Indicadores verdes</Text>
                <Text style={styles.quickSubtitle}>
                  Acompanhe o impacto das ações.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickCard}
                activeOpacity={0.85}
                onPress={handleLogout}
              >
                <View style={styles.quickIconWrapper}>
                  <Ionicons name="log-out" size={24} color="#ef4444" />
                </View>
                <Text style={styles.quickTitle}>Sair da conta</Text>
                <Text style={styles.quickSubtitle}>Trocar de usuário.</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 134, 69, 0.12)",
  },
  screen: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    zIndex: 2,
  },
  welcomeText: {
    color: "#01080fff",
    fontSize: 16,
    fontWeight: "500",
  },
  username: {
    color: "#0d0000ff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  menuButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#ecfdf3",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(249, 250, 251, 0.76)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  chipsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
  },
  chipActive: {
    backgroundColor: "#16a34a",
  },
  chipText: {
    fontSize: 13,
    color: "#4b5563",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#f9fafb",
  },
  mainCard: {
    flexDirection: "row",
    backgroundColor: "#14532d",
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },
  mainCardTextArea: {
    flex: 1,
    paddingRight: 12,
    justifyContent: "space-between",
  },
  mainCardTitle: {
    color: "#ecfdf3",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  mainCardSubtitle: {
    color: "#d1fae5",
    fontSize: 13,
    marginBottom: 12,
  },
  mainCardButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#22c55e",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },
  mainCardButtonText: {
    color: "#ecfdf3",
    fontWeight: "600",
    fontSize: 14,
  },
  mainCardIllustration: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  quickCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  quickIconWrapper: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  quickSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
});
