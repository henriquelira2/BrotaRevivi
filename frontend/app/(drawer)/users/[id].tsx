import { useEffect, useState } from "react";
import type { AppUser } from "../../../types/user";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { getUser, updateUser, deleteUser } from "../../../services/users";

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      if (!id) return;
      const data = await getUser(String(id));
      setUser(data);
      setName(data.name);
      setEmail(data.email);
    })();
  }, [id]);

  async function handleSave() {
    if (!id) return;
    try {
      const updated = await updateUser(String(id), { name, email });
      setUser(updated);
      Alert.alert("Sucesso", "Usuário atualizado.");
    } catch (err: any) {
      Alert.alert("Erro", err?.response?.data?.message || "Falha ao atualizar");
    }
  }

  async function handleDelete() {
    if (!id) return;
    try {
      await deleteUser(String(id));
      Alert.alert("Sucesso", "Usuário apagado.");
      router.back();
    } catch (err: any) {
      Alert.alert("Erro", err?.response?.data?.message || "Falha ao apagar");
    }
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <Text>E-mail</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <Button title="Salvar" onPress={handleSave} />
      <View style={{ marginTop: 12 }}>
        <Button title="Excluir" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
}
