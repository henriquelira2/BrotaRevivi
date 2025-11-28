import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import background2 from "../../assets/background2.png";

import { useAuth } from "../_layout";
import { listVoids, UrbanVoid } from "../../services/voids";

type HistoricoItem = {
  id: string;
  descricao: string;
  data: string;
  pontos: number;
  tipo: "credito" | "debito";
};

const POINTS_PER_VOID = 10;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("pt-BR");
}

function getNivel(points: number): string {
  if (points < 100) return "Semente";
  if (points < 300) return "Muda";
  return "Árvore";
}

export default function MeusPontosScreen() {
  const { user } = useAuth() as any;

  const [totalPontos, setTotalPontos] = useState(0);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nivel = getNivel(totalPontos);

  useEffect(() => {
    async function carregarPontos() {
      try {
        if (!user?.id) {
          setError("Usuário não encontrado.");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const voids = await listVoids();

        const meusVoids = voids.filter(
          (v: UrbanVoid) => v.createdBy === user.id
        );

        const pontos = meusVoids.length * POINTS_PER_VOID;
        setTotalPontos(pontos);

        const hist: HistoricoItem[] = meusVoids
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((v) => ({
            id: v.id,
            descricao: `Vazio urbano "${v.title || v.type}" cadastrado`,
            data: formatDate(v.createdAt),
            pontos: POINTS_PER_VOID,
            tipo: "credito",
          }));

        setHistorico(hist);
      } catch (e: any) {
        console.error(e);
        setError("Não foi possível carregar seus pontos no momento.");
      } finally {
        setLoading(false);
      }
    }

    carregarPontos();
  }, [user?.id]);

  return (
    <ImageBackground source={background2} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus pontos</Text>
          <Text style={styles.subtitle}>
            Acompanhe sua jornada de impacto positivo 🌱
          </Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando seus pontos...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <View style={styles.cardPontos}>
              <Text style={styles.cardLabel}>Total de pontos</Text>
              <Text style={styles.cardPontosValor}>{totalPontos}</Text>
              <View style={styles.nivelContainer}>
                <Text style={styles.nivelLabel}>Nível atual:</Text>
                <Text style={styles.nivelValor}>{nivel}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Como funcionam os pontos?</Text>
              <Text style={styles.sectionText}>
                Você acumula pontos ao cadastrar vazios urbanos e participar das
                ações do território. Cada cadastro confirmado rende pontos que
                podem ser usados em recompensas e benefícios futuros.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Histórico de atividades</Text>
              {historico.length === 0 ? (
                <Text style={styles.sectionText}>
                  Você ainda não cadastrou nenhum vazio urbano. Comece agora
                  para acumular pontos! 🌱
                </Text>
              ) : (
                <ScrollView
                  style={styles.historicoList}
                  contentContainerStyle={{ paddingBottom: 24 }}
                >
                  {historico.map((item) => (
                    <View key={item.id} style={styles.historicoItem}>
                      <View style={styles.historicoTexto}>
                        <Text style={styles.historicoDescricao}>
                          {item.descricao}
                        </Text>
                        <Text style={styles.historicoData}>{item.data}</Text>
                      </View>
                      <Text
                        style={[
                          styles.historicoPontos,
                          item.tipo === "credito"
                            ? styles.historicoCredito
                            : styles.historicoDebito,
                        ]}
                      >
                        {item.tipo === "credito" ? "+" : ""}
                        {item.pontos}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 8,
    color: "#E4E4E4",
    fontSize: 14,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    color: "#FFF",
  },
  errorText: {
    color: "#FFCDD2",
    textAlign: "center",
  },
  cardPontos: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 14,
    color: "#555",
  },
  cardPontosValor: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1B5E20",
    marginTop: 8,
  },
  nivelContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  nivelLabel: {
    fontSize: 14,
    color: "#555",
    marginRight: 6,
  },
  nivelValor: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "600",
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    color: "#F1F1F1",
  },
  historicoList: {
    maxHeight: 260,
    marginTop: 8,
  },
  historicoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    marginBottom: 8,
  },
  historicoTexto: {
    flex: 1,
    marginRight: 12,
  },
  historicoDescricao: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  historicoData: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  historicoPontos: {
    fontSize: 16,
    fontWeight: "700",
  },
  historicoCredito: {
    color: "#2E7D32",
  },
  historicoDebito: {
    color: "#C62828",
  },
});
