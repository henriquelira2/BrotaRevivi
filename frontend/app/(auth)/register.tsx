import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { register as registerApi } from "../../services/auth";

export default function RegisterScreen() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [loading, setLoading] = useState(false);

  function getErrorMessage(err: any): string {
    const message = err?.response?.data?.message;

    if (!message) return "Falha ao criar conta.";

    if (Array.isArray(message)) {
      return message.join("\n");
    }

    if (typeof message === "string") {
      return message;
    }

    return "Falha ao criar conta.";
  }

  async function handleRegister() {
    if (!nome || !email || !senha || !confirmarSenha) {
      return Alert.alert("Atenção", "Preencha todos os campos.");
    }

    if (senha !== confirmarSenha) {
      return Alert.alert("Atenção", "As senhas não conferem.");
    }

    if (senha.length < 6) {
      return Alert.alert(
        "Atenção",
        "A senha deve ter pelo menos 6 caracteres."
      );
    }

    try {
      setLoading(true);

      await registerApi({
        name: nome.trim(),
        email: email.trim().toLowerCase(),
        password: senha,
      });

      Alert.alert(
        "Cadastro realizado",
        "Sua conta foi criada com sucesso! Faça login para continuar.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert("Erro", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/background1.png")}
      resizeMode="cover"
      style={styles.bg}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cadastro</Text>

            <View style={styles.inputBox}>
              <TextInput
                placeholder="Nome completo"
                placeholderTextColor="#777"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
              />
            </View>

            <View style={styles.inputBox}>
              <TextInput
                placeholder="E-mail"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputBox}>
              <TextInput
                placeholder="Senha"
                placeholderTextColor="#777"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showSenha}
                style={[styles.input, { paddingRight: 40 }]}
              />

              <TouchableOpacity
                onPress={() => setShowSenha(!showSenha)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showSenha ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputBox}>
              <TextInput
                placeholder="Confirmar senha"
                placeholderTextColor="#777"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!showConfirmarSenha}
                style={[styles.input, { paddingRight: 40 }]}
              />

              <TouchableOpacity
                onPress={() => setShowConfirmarSenha((prev) => !prev)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showConfirmarSenha ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInText}>Criar conta</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                <Text style={styles.signup}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#ffffff", // se faltar imagem em algum ponto, fica branco, não cinza
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  kav: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: "20%",
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 300,
    height: 140,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    width: "90%",
    alignSelf: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputBox: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 50,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    color: "#000",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  signInButton: {
    backgroundColor: "#4A84FF",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
  },
  signInText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#666",
  },
  signup: {
    color: "#4A84FF",
    fontWeight: "600",
  },
});
