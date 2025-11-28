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
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../_layout";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function getErrorMessage(err: any): string {
    const message = err?.response?.data?.message;

    if (!message) return "Falha no login.";

    if (Array.isArray(message)) {
      return message.join("\n");
    }

    if (typeof message === "string") {
      return message;
    }

    return "Falha no login.";
  }

  async function handleLogin() {
    if (!email || !password) {
      return Alert.alert("Atenção", "Preencha e-mail e senha.");
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/");
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

      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.hello}>Olá!</Text>
        <Text style={styles.subtitle}>
          Entre com seu e-mail e senha para acessar o aplicativo.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar</Text>

          <View style={styles.inputBox}>
            <TextInput
              placeholder="Digite seu e-mail"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputBox}>
            <View style={styles.passwordRow}>
              <TextInput
                placeholder="Digite sua senha"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                style={styles.inputPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.signup}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingTop: "20%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  container: {
    padding: 24,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
  },

  logo: {
    width: 300,
    height: 240,
  },

  hello: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0a0a0a",
    left: "5%",
  },

  subtitle: {
    fontSize: 15,
    color: "#444",
    marginTop: 4,
    marginBottom: 30,
    left: "5%",
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
    left: "5%",
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

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  eyeButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
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
