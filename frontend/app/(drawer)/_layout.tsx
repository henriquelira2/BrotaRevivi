import React from "react";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../_layout";
import { useRouter } from "expo-router";

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, signOut } = useAuth() as any;
  const navigation = props.navigation;
  const router = useRouter(); // 👈 PARA REDIRECIONAR

  const name = user?.name || "Usuário";
  const email = user?.email || "";
  const avatarUrl = user?.avatarUrl as string | undefined;

  const handleLogout = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
              </View>
            )}

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.profileName}>{name}</Text>
              {email ? <Text style={styles.profileEmail}>{email}</Text> : null}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("profile")}
              style={styles.editIconButton}
            >
              <Ionicons name="create-outline" size={18} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuCard}>
          <DrawerItemRow
            icon={<Ionicons name="home-outline" size={20} color="#4b5563" />}
            label="Início"
            onPress={() => navigation.navigate("index")}
          />

          <DrawerItemRow
            icon={<MaterialIcons name="map" size={20} color="#4b5563" />}
            label="Mapa"
            onPress={() => navigation.navigate("map")}
          />

          <DrawerItemRow
            icon={<Ionicons name="trophy-outline" size={20} color="#4b5563" />}
            label="Meus pontos"
            onPress={() => navigation.navigate("meus-pontos")}
          />

          <DrawerItemRow
            icon={
              <Ionicons
                name="person-circle-outline"
                size={20}
                color="#4b5563"
              />
            }
            label="Perfil"
            onPress={() => navigation.navigate("profile")}
          />
        </View>
      </DrawerContentScrollView>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type DrawerItemRowProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

function DrawerItemRow({ icon, label, onPress }: DrawerItemRowProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={styles.menuItemText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </TouchableOpacity>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        overlayColor: "rgba(15,23,42,0.4)",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Drawer.Screen
        name="map"
        options={{
          title: "Mapa",
        }}
      />

      <Drawer.Screen
        name="meus-pontos"
        options={{
          title: "Meus pontos",
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: "Perfil",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4b5563",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  profileEmail: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  editIconButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
  },

  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuItemText: {
    fontSize: 14,
    color: "#111827",
  },

  logoutContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f3f4f6",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  logoutText: {
    marginLeft: 8,
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
});
