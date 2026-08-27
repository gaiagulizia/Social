import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import SectionTag from "@/components/SectionTag";
import { colors, fonts, radius, spacing } from "@/constants/theme";

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { posts, profile, updatePost, deletePost, archivePost } = useApp();
  const post = posts.find((p) => p.id === id);

  const [content, setContent] = useState(post?.content ?? "");
  const [sectionId, setSectionId] = useState<string | null>(post?.sectionId ?? null);

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: spacing.md }}>Post non trovato.</Text>
      </SafeAreaView>
    );
  }

  function handleSave() {
    updatePost(post!.id, { content: content.trim(), sectionId });
    router.back();
  }

  function handleDelete() {
    Alert.alert("Eliminare il post?", "Questa azione non può essere annullata.", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina",
        style: "destructive",
        onPress: () => {
          deletePost(post!.id);
          router.back();
        },
      },
    ]);
  }

  function handleArchiveToggle() {
    archivePost(post!.id, !post!.archived);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        {post.type !== "text" && post.mediaUri && (
          <Image source={{ uri: post.mediaUri }} style={styles.media} />
        )}

        <TextInput
          style={styles.textArea}
          value={content}
          onChangeText={setContent}
          multiline
          placeholder="Scrivi qualcosa..."
          placeholderTextColor={colors.placeholder}
        />

        <Text style={styles.sectionTitle}>Sposta in un'altra sezione</Text>
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

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Salva modifiche</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleArchiveToggle}>
          <Text style={styles.secondaryBtnText}>{post.archived ? "Rimuovi da archivio" : "Archivia post"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Elimina post</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  media: { width: "100%", aspectRatio: 1, borderRadius: radius.md, backgroundColor: colors.surface },
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
  saveBtn: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 14, alignItems: "center" },
  saveBtnText: { fontFamily: fonts.semibold, fontWeight: "700", fontSize: 15, color: colors.white },
  secondaryBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: 14, alignItems: "center" },
  secondaryBtnText: { fontFamily: fonts.semibold, fontWeight: "600", fontSize: 15, color: colors.text },
  deleteBtn: { paddingVertical: 14, alignItems: "center" },
  deleteBtnText: { fontFamily: fonts.semibold, fontWeight: "600", fontSize: 15, color: colors.danger },
});
