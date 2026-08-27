import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import SectionTag from "@/components/SectionTag";
import { colors, fonts, radius, spacing } from "@/constants/theme";
import { PostMediaType } from "@/types";

export default function CreatePostScreen() {
  const router = useRouter();
  const { profile, addPost } = useApp();
  const [type, setType] = useState<PostMediaType>("text");
  const [content, setContent] = useState("");
  const [mediaUri, setMediaUri] = useState<string | undefined>(undefined);
  const [sectionId, setSectionId] = useState<string | null>(null);

  async function pickMedia(mediaType: "image" | "video") {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permesso necessario", "Consenti l'accesso alla libreria per caricare contenuti.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType === "image" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setMediaUri(result.assets[0].uri);
      setType(mediaType === "image" ? "image" : "video");
    }
  }

  function handlePublish() {
    if (type === "text" && !content.trim()) {
      Alert.alert("Scrivi qualcosa", "Il post di solo testo non può essere vuoto.");
      return;
    }
    if (type !== "text" && !mediaUri) {
      Alert.alert("Seleziona un file", "Carica una foto o un video prima di pubblicare.");
      return;
    }
    addPost({ type, content: content.trim(), mediaUri, sectionId });
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        {/* Selettore tipo di post */}
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, type === "text" && styles.typeBtnActive]}
            onPress={() => {
              setType("text");
              setMediaUri(undefined);
            }}
          >
            <Ionicons name="text-outline" size={18} color={type === "text" ? colors.white : colors.text} />
            <Text style={[styles.typeText, type === "text" && styles.typeTextActive]}>Testo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.typeBtn, type === "image" && styles.typeBtnActive]} onPress={() => pickMedia("image")}>
            <Ionicons name="image-outline" size={18} color={type === "image" ? colors.white : colors.text} />
            <Text style={[styles.typeText, type === "image" && styles.typeTextActive]}>Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.typeBtn, type === "video" && styles.typeBtnActive]} onPress={() => pickMedia("video")}>
            <Ionicons name="videocam-outline" size={18} color={type === "video" ? colors.white : colors.text} />
            <Text style={[styles.typeText, type === "video" && styles.typeTextActive]}>Video</Text>
          </TouchableOpacity>
        </View>

        {mediaUri && type !== "text" && (
          <View style={styles.mediaPreviewWrap}>
            <Image source={{ uri: mediaUri }} style={styles.mediaPreview} />
            {type === "video" && <Ionicons name="play-circle" size={40} color="#fff" style={styles.playOverlay} />}
          </View>
        )}

        <TextInput
          style={styles.textArea}
          placeholder={type === "text" ? "Scrivi qualcosa..." : "Aggiungi una didascalia (opzionale)"}
          placeholderTextColor={colors.placeholder}
          multiline
          value={content}
          onChangeText={setContent}
        />

        {/* Scelta sezione */}
        <Text style={styles.sectionTitle}>Aggiungi a una sezione</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.noneChip, sectionId === null && styles.noneChipActive]}
            onPress={() => setSectionId(null)}
          >
            <Text style={[styles.noneChipText, sectionId === null && styles.noneChipTextActive]}>Nessuna</Text>
          </TouchableOpacity>
          {profile.sections.map((s) => (
            <SectionTag
              key={s.id}
              label={s.name}
              bgColor={s.tagBgColor}
              textColor={s.tagTextColor}
              active={sectionId === s.id}
              onPress={() => setSectionId(s.id)}
            />
          ))}
        </ScrollView>
      </ScrollView>

      <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
        <Text style={styles.publishBtnText}>Pubblica</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  typeRow: { flexDirection: "row", gap: spacing.sm },
  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  typeBtnActive: { backgroundColor: colors.text, borderColor: colors.text },
  typeText: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  typeTextActive: { color: colors.white },
  mediaPreviewWrap: { width: "100%", aspectRatio: 1, borderRadius: radius.md, overflow: "hidden", backgroundColor: colors.surface },
  mediaPreview: { width: "100%", height: "100%" },
  playOverlay: { position: "absolute", top: "50%", left: "50%", marginLeft: -20, marginTop: -20 },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: "top",
  },
  sectionTitle: { fontFamily: fonts.semibold, fontWeight: "600", fontSize: 14, color: colors.text },
  noneChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginRight: spacing.sm,
  },
  noneChipActive: { backgroundColor: colors.text, borderColor: colors.text },
  noneChipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  noneChipTextActive: { color: colors.white },
  publishBtn: {
    backgroundColor: colors.accent,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  publishBtnText: { fontFamily: fonts.semibold, fontWeight: "700", fontSize: 15, color: colors.white },
});
