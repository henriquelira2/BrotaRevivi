import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useState } from "react";
import MapView, { Marker, Region, MapPressEvent } from "react-native-maps";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  listVoids,
  createVoid,
  updateVoid,
  UrbanVoid,
} from "../../services/voids";

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (!isNaN(n)) return n;
  }
  throw new Error("Coordenada inválida");
}

type VoidGroup = {
  key: string;
  latitude: number;
  longitude: number;
  items: UrbanVoid[];
};

export default function MapScreen() {
  const router = useRouter();

  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [voids, setVoids] = useState<UrbanVoid[]>([]);

  const [creating, setCreating] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [type, setType] = useState("");
  const [risk, setRisk] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const [editingVoid, setEditingVoid] = useState<UrbanVoid | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<VoidGroup | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // -------------------------------
  // LOCALIZAÇÃO DO USUÁRIO
  // -------------------------------
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationError(
            "Permissão negada. Usando posição padrão no Bairro do Recife."
          );
          setRegion({
            latitude: -8.063149,
            longitude: -34.871311,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setLoading(false);
          return;
        }

        let loc = await Location.getLastKnownPositionAsync();
        if (!loc) {
          loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        }

        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        setLoading(false);
      } catch {
        setLocationError("Erro ao obter localização.");
        setRegion({
          latitude: -8.063149,
          longitude: -34.871311,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLoading(false);
      }
    })();
  }, []);

  // -------------------------------
  // CARREGA VOIDs
  // -------------------------------
  useEffect(() => {
    (async () => {
      try {
        const data = await listVoids();
        setVoids(data);
      } catch (err) {
        console.log("Erro ao carregar voids", err);
      }
    })();
  }, []);

  // Agrupa markers por coordenada
  const groups = useMemo<VoidGroup[]>(() => {
    const map = new Map<string, VoidGroup>();

    for (const v of voids) {
      let lat = toNumber(v.lat);
      let lng = toNumber(v.lng);

      const key = `${lat.toFixed(5)}:${lng.toFixed(5)}`;

      const existing = map.get(key);
      if (existing) {
        existing.items.push(v);
      } else {
        map.set(key, {
          key,
          latitude: lat,
          longitude: lng,
          items: [v],
        });
      }
    }

    return Array.from(map.values());
  }, [voids]);

  // Selecionou local no mapa
  function handleMapPress(e: MapPressEvent) {
    if (!creating) return;
    setSelectedCoord(e.nativeEvent.coordinate);
  }

  // Escolher imagem
  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão negada.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImages((p) => [...p, ...uris]);
    }
  }

  function resetForm() {
    setSelectedCoord(null);
    setFormTitle("");
    setFormDescription("");
    setType("");
    setRisk("");
    setImages([]);
    setEditingVoid(null);
  }

  async function handleSavePoint() {
    if (!selectedCoord) return;

    const payload = {
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
      lat: selectedCoord.latitude,
      lng: selectedCoord.longitude,
      type: type.trim(),
      risk: risk.trim(),
      photoUrls: images,
    };

    try {
      setSaving(true);

      if (editingVoid) {
        const updated = await updateVoid(editingVoid.id, payload);
        setVoids((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v))
        );
      } else {
        const created = await createVoid(payload);
        setVoids((prev) => [...prev, created]);
      }

      setCreating(false);
      resetForm();
    } catch (err) {
      console.log("Erro ao salvar:", err);
    } finally {
      setSaving(false);
    }
  }

  function startEditCurrentInGroup() {
    if (!selectedGroup) return;
    const current = selectedGroup.items[selectedIndex];
    startEditVoid(current);
  }

  function startEditVoid(v: UrbanVoid) {
    setEditingVoid(v);
    setCreating(true);
    setSelectedGroup(null);
    setSelectedCoord({ latitude: toNumber(v.lat), longitude: toNumber(v.lng) });
    setFormTitle(v.title);
    setFormDescription(v.description || "");
    setType(v.type || "");
    setRisk(v.risk || "");
    setImages(v.photoUrls || []);
  }

  function startNewSuggestionAtSelectedGroup() {
    if (!selectedGroup) return;

    const { latitude, longitude } = selectedGroup;

    setCreating(true);
    setEditingVoid(null);
    setSelectedGroup(null);
    setSelectedCoord({ latitude, longitude });
    setFormTitle("");
    setFormDescription("");
    setType("");
    setRisk("");
    setImages([]);
  }

  const currentVoid =
    selectedGroup && selectedGroup.items[selectedIndex]
      ? selectedGroup.items[selectedIndex]
      : null;

  if (loading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* MAPA */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        {/* Seu ponto aproximado */}
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Você está aqui (aprox.)"
        />

        {/* MARCADORES DO BANCO */}
        {groups.map((group) => {
          const preview = group.items[group.items.length - 1];
          const lastImg =
            preview.photoUrls && preview.photoUrls.length > 0
              ? preview.photoUrls[preview.photoUrls.length - 1]
              : null;

          return (
            <Marker
              key={group.key}
              coordinate={{
                latitude: group.latitude,
                longitude: group.longitude,
              }}
              onPress={() => {
                setSelectedGroup(group);
                setSelectedIndex(group.items.length - 1);
                setCreating(false);
                resetForm();
              }}
            >
              <View style={styles.groupMarkerContainer}>
                {/* CARD SUPERIOR COM IMAGEM */}
                <View style={styles.groupImageWrapper}>
                  {lastImg ? (
                    <Image
                      source={{ uri: lastImg }}
                      style={styles.groupImage}
                    />
                  ) : (
                    <View style={styles.groupImagePlaceholder} />
                  )}
                </View>

                {/* PIN ROXO EMBAIXO */}
                <View style={styles.pinOnlyContainer}>
                  <View style={styles.pinOuter}>
                    <View style={styles.pinInner} />
                  </View>
                  <View style={styles.pinBaseDot} />
                </View>
              </View>
            </Marker>
          );
        })}

        {/* MARCADOR DE NOVO PONTO */}
        {creating && selectedCoord && (
          <Marker coordinate={selectedCoord}>
            <View style={styles.pinOnlyContainer}>
              <View style={[styles.pinOuter, styles.pinOuterNew]}>
                <View style={styles.pinInner} />
              </View>
              <View style={[styles.pinBaseDot, styles.pinBaseDotNew]} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* ERRO DE LOCALIZAÇÃO */}
      {locationError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}

      {/* CARD DE DETALHE DO PONTO SELECIONADO */}
      {selectedGroup && currentVoid && !creating && (
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{currentVoid.title}</Text>

          {currentVoid.description ? (
            <Text style={styles.detailDescription}>
              {currentVoid.description}
            </Text>
          ) : null}

          <Text style={styles.detailMeta}>
            {currentVoid.type} • {currentVoid.risk}
          </Text>

          {currentVoid.photoUrls && currentVoid.photoUrls.length > 0 && (
            <TouchableOpacity
              onPress={() =>
                setPreviewImage(
                  currentVoid.photoUrls![currentVoid.photoUrls!.length - 1]
                )
              }
            >
              <Image
                source={{
                  uri: currentVoid.photoUrls![
                    currentVoid.photoUrls!.length - 1
                  ],
                }}
                style={styles.detailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}

          {selectedGroup.items.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 8, marginBottom: 4 }}
            >
              {selectedGroup.items.map((v, idx) => {
                const thumbImg =
                  v.photoUrls && v.photoUrls.length > 0
                    ? v.photoUrls[v.photoUrls.length - 1]
                    : undefined;

                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => setSelectedIndex(idx)}
                    style={[
                      styles.thumbCard,
                      idx === selectedIndex && styles.thumbCardActive,
                    ]}
                  >
                    {thumbImg ? (
                      <Image
                        source={{ uri: thumbImg }}
                        style={styles.thumbImage}
                      />
                    ) : (
                      <View style={styles.thumbPlaceholder} />
                    )}
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.thumbTitle,
                        idx === selectedIndex && styles.thumbTitleActive,
                      ]}
                    >
                      {v.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.detailButtonsRow}>
            <TouchableOpacity
              style={[styles.detailButton, styles.secondaryButton]}
              onPress={startNewSuggestionAtSelectedGroup}
            >
              <Text style={styles.secondaryButtonText}>Nova sugestão aqui</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.detailButton, styles.primaryButton]}
              onPress={startEditCurrentInGroup}
            >
              <Text style={styles.primaryButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.detailCloseButton}
            onPress={() => setSelectedGroup(null)}
          >
            <Text style={styles.detailCloseText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FORMULÁRIO DE CRIAÇÃO/EDIÇÃO */}
      {creating && selectedCoord && (
        <View style={styles.createCard}>
          <ScrollView>
            <Text style={styles.createTitle}>
              {editingVoid ? "Editar sugestão" : "Nova sugestão"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título do ponto"
              placeholderTextColor="#6b7280"
              value={formTitle}
              onChangeText={setFormTitle}
            />

            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descrição, observações..."
              placeholderTextColor="#6b7280"
              value={formDescription}
              onChangeText={setFormDescription}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Tipo (ex.: Terreno vazio, praça, beira de rio...)"
              placeholderTextColor="#6b7280"
              value={type}
              onChangeText={setType}
            />

            <TextInput
              style={styles.input}
              placeholder="Grau de risco (ex.: baixo, médio, alto)"
              placeholderTextColor="#6b7280"
              value={risk}
              onChangeText={setRisk}
            />

            <Text style={styles.imagesLabel}>Imagens</Text>

            <View style={styles.imagesRow}>
              {images.map((uri) => (
                <TouchableOpacity
                  key={uri}
                  onPress={() => setPreviewImage(uri)}
                >
                  <Image source={{ uri }} style={styles.imageThumb} />
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handlePickImage}
              >
                <Ionicons name="add" size={20} color="#6b7280" />
                <Text style={styles.addImageText}>Adicionar</Text>
              </TouchableOpacity>
            </View>

            {/* BOTÕES */}
            <View style={styles.createActionsRow}>
              <TouchableOpacity
                style={[styles.createButton, styles.cancelButton]}
                onPress={() => {
                  setCreating(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.createButton, styles.saveButton]}
                onPress={handleSavePoint}
                disabled={
                  saving || !formTitle.trim() || !type.trim() || !risk.trim()
                }
              >
                <Text style={styles.saveText}>
                  {saving
                    ? "Salvando..."
                    : editingVoid
                    ? "Salvar alterações"
                    : "Salvar ponto"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* BOTÃO FLUTUANTE */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, creating && { backgroundColor: "#b45309" }]}
          onPress={() => {
            setCreating((p) => !p);
            setSelectedGroup(null);
            resetForm();
          }}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.fabText}>
            {creating ? "Toque no mapa para marcar" : "Cadastrar ponto"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* TABS INFERIORES */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/")}
        >
          <Ionicons name="home-outline" size={20} color="#6b7280" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
          <Ionicons name="map" size={20} color="#10b981" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/(drawer)/meus-pontos")}
        >
          <Ionicons name="list-outline" size={20} color="#6b7280" />
          <Text style={styles.tabLabel}>Meus pontos</Text>
        </TouchableOpacity>
      </View>

      {/* VISUALIZADOR DE IMAGEM */}
      {previewImage && (
        <View style={styles.imageViewerOverlay}>
          <TouchableOpacity
            style={styles.imageViewerBackdrop}
            onPress={() => setPreviewImage(null)}
            activeOpacity={1}
          />
          <View style={styles.imageViewerContent}>
            <Image
              source={{ uri: previewImage }}
              style={styles.imageViewerImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.imageViewerClose}
              onPress={() => setPreviewImage(null)}
            >
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  errorBox: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  errorText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },

  // ---------------------
  // MARKERS ROXOS + CARD DE IMAGEM
  // ---------------------
  groupMarkerContainer: {
    alignItems: "center",
  },

  groupImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#ffffff",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  groupImage: {
    width: "100%",
    height: "100%",
  },
  groupImagePlaceholder: {
    flex: 1,
    backgroundColor: "#d1d5db",
  },

  pinOnlyContainer: {
    alignItems: "center",
  },

  pinOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#7c3aed",
    borderWidth: 3,
    borderColor: "#c4b5fd",
    alignItems: "center",
    justifyContent: "center",
  },
  pinInner: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  pinBaseDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(124,58,237,0.35)",
    marginTop: 2,
  },

  pinOuterNew: {
    backgroundColor: "#8b5cf6",
    borderColor: "#ddd6fe",
  },
  pinBaseDotNew: {
    backgroundColor: "rgba(139,92,246,0.4)",
  },

  // ---------------------
  // FORMULÁRIO
  // ---------------------
  createCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 150,
    maxHeight: 720,
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 16,
    elevation: 4,
    zIndex: 10,
  },
  createTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    fontSize: 14,
    color: "#000",
  },

  imagesLabel: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  imagesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
    flexWrap: "wrap",
  },
  imageThumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addImageText: {
    fontSize: 12,
    color: "#4b5563",
    marginLeft: 4,
  },

  createActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 8,
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  cancelButton: {
    backgroundColor: "#f9fafb",
  },
  saveButton: {
    backgroundColor: "#16a34a",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "500",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },

  // ---------------------
  // CARD DE DETALHE
  // ---------------------
  detailCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 150,
    borderRadius: 16,
    backgroundColor: "#e5f6e9",
    padding: 16,
    elevation: 4,
    zIndex: 10,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  detailDescription: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  detailMeta: {
    fontSize: 12,
    color: "#065f46",
    marginBottom: 8,
  },
  detailImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#d1d5db",
  },

  thumbCard: {
    width: 90,
    marginRight: 8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  thumbCardActive: {
    borderColor: "#16a34a",
    borderWidth: 2,
  },
  thumbImage: {
    width: "100%",
    height: 60,
    backgroundColor: "#e5e7eb",
  },
  thumbPlaceholder: {
    width: "100%",
    height: 60,
    backgroundColor: "#e5e7eb",
  },
  thumbTitle: {
    fontSize: 11,
    paddingHorizontal: 4,
    paddingVertical: 2,
    color: "#374151",
  },
  thumbTitleActive: {
    fontWeight: "700",
    color: "#065f46",
  },

  detailButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 8,
  },
  detailButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: "#16a34a",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#16a34a",
  },
  secondaryButtonText: {
    color: "#16a34a",
    fontSize: 12,
    fontWeight: "600",
  },
  detailCloseButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#16a34a",
  },
  detailCloseText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // ---------------------
  // FAB
  // ---------------------
  fabContainer: {
    position: "absolute",
    bottom: 88,
    left: 24,
    right: 24,
    alignItems: "center",
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    elevation: 3,
  },
  fabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },

  // ---------------------
  // TABS
  // ---------------------
  tabsContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    elevation: 4,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabItemActive: {},
  tabLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
  tabLabelActive: {
    color: "#10b981",
    fontWeight: "600",
  },

  // ---------------------
  // VIEWER DE IMAGEM
  // ---------------------
  imageViewerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 999,
  },
  imageViewerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  imageViewerContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerImage: {
    width: "90%",
    height: "80%",
  },
  imageViewerClose: {
    position: "absolute",
    top: 40,
    right: 20,
  },
});
