import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import ColorWheelPicker from "@/components/ColorWheel";
import SectionTag from "@/components/SectionTag";
import { colors, fonts, radius, spacing } from "@/constants/theme";

const MAX_NAME_LENGTH = 15;

export default function EditSectionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { profile, addSection, updateSection, deleteSection } = useApp();
  const existing = profile.sections.find((s) => s.id === id);

  const [name, setName] = useState(existing?.name ?? "");
  const [bgColor, setBgColor] = useState(existing?.tagBgColor ?? "#0095F6");
  const [textColor, setTextColor] = useState<"#FFFFFF" | "#000000">(existing?.tagTextColor ?? "#FFFFFF");

  function handleSave() {
    if (!name.trim()) {
      Alert.alert("Nome mancante", "Assegna un nome alla sezione.");
      return;
    }
    if (existing) {
      updateSection(existing.id, { name: name.trim(), tagBgColor: bgColor, tagTextColor: textColor });
    } else {
      const result = addSection({
        id: `s${Date.now()}`,
        name: name.trim(),
        tagBgColor: bgColor,
        tagTextColor: textColor,
      });
      if (!result.ok) {
        Alert.alert("Limite raggiunto", result.error);
        return;
      }
    }
    router.back();
  }

  function handleDelete() {
    if (!existing) return;
    Alert.alert("Eliminare la sezione?", "I post al suo interno resteranno ma senza sezione.", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina",
        style: "destructive",
        onPress: () => {
          deleteSection(existing.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome sezione (max {MAX_NAME_LENGTH} caratteri)</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(t) => setName(t.slice(0, MAX_NAME_LENGTH))}
          placeholder="es. Viaggi"
          placeholderTextColor={colors.placeholder}
          maxLength={MAX_NAME_LENGTH}
        />
        <Text style={styles.counter}>{name.length}/{MAX_NAME_LENGTH}</Text>

        <Text style={styles.label}>Anteprima tag</Text>
        <View style={styles.previewRow}>
          <SectionTag label={name || "Nome sezione"} bgColor={bgColor} textColor={textColor} />
        </View>

        <Text style={styles.label}>Colore testo del tag</Text>
        <View style={styles.textColorRow}>
          <TouchableOpacity
            style={[styles.textColorOption, { backgroundColor: "#FFFFFF" }, textColor === "#FFFFFF" && styles.textColorSelected]}
            onPress={() => setTextColor("#FFFFFF")}
          >
            <Text style={{ color: "#000000", fontFamily: fonts.medium, fontSize: 12 }}>Bianco</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.textColorOption, { backgroundColor: "#000000" }, textColor === "#000000" && styles.textColorSelected]}
            onPress={() => setTextColor("#000000")}
          >
            <Text style={{ color: "#FFFFFF", fontFamily: fonts.medium, fontSize: 12 }}>Nero</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Colore riquadro del tag</Text>
        <ColorWheelPicker value={bgColor} onChange={setBgColor} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{existing ? "Salva modifiche" : "Crea sezione"}</Text>
        </TouchableOpacity>
        {existing && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>Elimina sezione</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "space-between" },
  form: { padding: spacing.md, gap: spacing.sm },
  label: { fontFamily: fonts.semibold, fontWeight: "600", fontSize: 13, color: colors.text, marginTop: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  counter: { alignSelf: "flex-end", fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary },
  previewRow: { flexDirection: "row" },
  textColorRow: { flexDirection: "row", gap: spacing.sm },
  textColorOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textColorSelected: { borderWidth: 2, borderColor: colors.accent },
  footer: { padding: spacing.md, gap: spacing.sm },
  saveBtn: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 14, alignItems: "center" },
  saveBtnText: { fontFamily: fonts.semibold, fontWeight: "700", fontSize: 15, color: colors.white },
  deleteBtn: { paddingVertical: 10, alignItems: "center" },
  deleteBtnText: { fontFamily: fonts.semibold, fontWeight: "600", fontSize: 14, color: colors.danger },
});
