
import { useEffect } from "react";
import { useAuth } from "./_layout";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace("/(drawer)/" as any);
    else router.replace("/(auth)/login");
  }, [loading, user, router]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
