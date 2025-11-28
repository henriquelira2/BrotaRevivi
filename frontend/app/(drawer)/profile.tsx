import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../_layout";
import { listVoids, UrbanVoid } from "../../services/voids";

const POINTS_PER_VOID = 10;

export default function ProfileScreen() {
  const { user, signOut } = useAuth() as any;

  const [totalVoids, setTotalVoids] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const name = user?.name || "Usuário";
  const email = user?.email || "";
  const avatarUrl = user?.avatarUrl as string | undefined;

  useEffect(() => {
    async function loadStats() {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const voids = await listVoids();
        const myVoids = voids.filter((v: UrbanVoid) => v.createdBy === user.id);

        setTotalVoids(myVoids.length);
        setTotalPoints(myVoids.length * POINTS_PER_VOID);
      } catch (err) {
        console.log("Erro ao carregar estatísticas do perfil:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [user?.id]);

  const level =
    totalPoints < 100 ? "Semente" : totalPoints < 300 ? "Muda" : "Árvore";

  const progressPercent = Math.min((totalPoints % 100) / 100, 1);

  function getInitials(fullName: string) {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
   
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#CBD5F5"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{name}</Text>
          {email ? <Text style={styles.email}>{email}</Text> : null}

          <View style={styles.levelTag}>
            <Ionicons name="leaf" size={16} color="#16a34a" />
            <Text style={styles.levelText}>Nível: {level}</Text>
          </View>

          <View style={styles.progressBox}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                Progresso para o próximo nível
              </Text>
              <Text style={styles.progressValue}>
                {Math.round(progressPercent * 100)}%
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Ionicons name="sparkles-outline" size={20} color="#22c55e" />
            </View>
            <Text style={styles.statLabel}>Meus pontos</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#22c55e" />
            ) : (
              <Text style={styles.statValue}>{totalPoints}</Text>
            )}
            <Text style={styles.statCaption}>
              Ganhe pontos cadastrando vazios urbanos
            </Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[styles.statIconCircle, { backgroundColor: "#eff6ff" }]}
            >
              <Ionicons name="location-outline" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.statLabel}>Vazios cadastrados</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <Text style={styles.statValue}>{totalVoids}</Text>
            )}
            <Text style={styles.statCaption}>
              Pontos mapeados por você na cidade
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atalhos</Text>

          <View style={styles.actionCard}>
            <View style={styles.actionIconCircle}>
              <Ionicons name="trophy-outline" size={20} color="#eab308" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Ver meus pontos</Text>
              <Text style={styles.actionSubtitle}>
                Acompanhe seu histórico de pontuação e recompensas.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </View>

          <View style={styles.actionCard}>
            <View
              style={[styles.actionIconCircle, { backgroundColor: "#eef2ff" }]}
            >
              <Ionicons name="map-outline" size={20} color="#6366f1" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Meus vazios</Text>
              <Text style={styles.actionSubtitle}>
                Veja os pontos que você já cadastrou no mapa.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.8}>
            <View style={styles.settingIconCircle}>
              <Ionicons name="person-outline" size={18} color="#4b5563" />
            </View>
            <Text style={styles.settingLabel}>Dados da conta</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.8}>
            <View
              style={[styles.settingIconCircle, { backgroundColor: "#fee2e2" }]}
            >
              <Ionicons name="lock-closed-outline" size={18} color="#b91c1c" />
            </View>
            <Text style={styles.settingLabel}>Privacidade</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { marginTop: 8 }]}
            activeOpacity={0.8}
            onPress={signOut}
          >
            <View
              style={[styles.settingIconCircle, { backgroundColor: "#fef2f2" }]}
            >
              <Ionicons name="log-out-outline" size={18} color="#dc2626" />
            </View>
            <Text style={[styles.settingLabel, { color: "#dc2626" }]}>
              Sair da conta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0f172a", 
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: "#020617",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  avatarWrapper: {
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: "#22c55e",
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#0f172a",
    borderWidth: 2,
    borderColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: "700",
    color: "#e5e7eb",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f9fafb",
    textAlign: "center",
  },
  email: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 4,
  },
  levelTag: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#022c22",
    borderRadius: 999,
    alignItems: "center",
    gap: 6,
  },
  levelText: {
    color: "#bbf7d0",
    fontSize: 12,
    fontWeight: "500",
  },
  progressBox: {
    marginTop: 14,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: "#9ca3af",
  },
  progressValue: {
    fontSize: 12,
    color: "#e5e7eb",
    fontWeight: "600",
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#22c55e",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#020617",
    borderRadius: 20,
    padding: 14,
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: "#9ca3af",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f9fafb",
    marginTop: 4,
  },
  statCaption: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 10,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  actionIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fef9c3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f9fafb",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  settingIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  settingLabel: {
    flex: 1,
    fontSize: 14,
    color: "#e5e7eb",
  },
});
