import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import SectionTag from "@/components/SectionTag";
import { colors, fonts, radius, spacing } from "@/constants/theme";
import { Post } from "@/types";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, posts, deletePost, archivePost } = useApp();
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const pagerRef = useRef<ScrollView>(null);

  // "Tutti i post" è sempre la prima pagina, poi una pagina per ogni sezione
  const pages = useMemo(() => {
    return [{ id: "__all__", name: "Tutti" }, ...profile.sections];
  }, [profile.sections]);

  const postsBySection = (sectionId: string | null) => {
    if (sectionId === "__all__" as any) return posts.filter((p) => !p.archived);
    return posts.filter((p) => p.sectionId === sectionId && !p.archived);
  };

  function scrollToIndex(index: number) {
    setActiveSectionIndex(index);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
  }

  function onPagerScrollEnd(e: any) {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveSectionIndex(index);
  }

  function onPostLongPress(post: Post) {
    Alert.alert(post.content?.slice(0, 40) || "Post", "Cosa vuoi fare?", [
      { text: "Modifica", onPress: () => router.push({ pathname: "/edit-post", params: { id: post.id } }) },
      {
        text: post.archived ? "Rimuovi da archivio" : "Archivia",
        onPress: () => archivePost(post.id, !post.archived),
      },
      {
        text: "Elimina",
        style: "destructive",
        onPress: () =>
          Alert.alert("Eliminare il post?", "Questa azione non può essere annullata.", [
            { text: "Annulla", style: "cancel" },
            { text: "Elimina", style: "destructive", onPress: () => deletePost(post.id) },
          ]),
      },
      { text: "Annulla", style: "cancel" },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.username}>{profile.username}</Text>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="menu-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info profilo */}
        <View style={styles.profileInfo}>
          <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.filter((p) => !p.archived).length}</Text>
              <Text style={styles.statLabel}>Post</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.followers}</Text>
              <Text style={styles.statLabel}>Follower</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.following}</Text>
              <Text style={styles.statLabel}>Seguiti</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioBlock}>
          <Text style={styles.displayName}>{profile.displayName}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>

        <View style={styles.editRow}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Modifica profilo</Text>
          </TouchableOpacity>
        </View>

        {/* Tag delle sezioni */}
        <View style={styles.tagsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md }}>
            {pages.map((section, index) => (
              <SectionTag
                key={section.id}
                label={section.name}
                bgColor={"tagBgColor" in section ? (section as any).tagBgColor : colors.text}
                textColor={"tagTextColor" in section ? (section as any).tagTextColor : "#FFFFFF"}
                active={activeSectionIndex === index}
                onPress={() => scrollToIndex(index)}
                onLongPress={() =>
                  section.id !== "__all__"
                    ? router.push({ pathname: "/edit-section", params: { id: section.id } })
                    : undefined
                }
              />
            ))}
            {profile.sections.length < 10 && (
              <TouchableOpacity style={styles.addTag} onPress={() => router.push("/edit-section")}>
                <Ionicons name="add" size={16} color={colors.text} />
                <Text style={styles.addTagText}>Sezione</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Pager orizzontale: swipe tra sezioni */}
        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onPagerScrollEnd}
        >
          {pages.map((section) => {
            const sectionPosts = postsBySection(section.id === "__all__" ? ("__all__" as any) : section.id);
            return (
              <View key={section.id} style={{ width }}>
                {sectionPosts.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="images-outline" size={40} color={colors.placeholder} />
                    <Text style={styles.emptyText}>Nessun post in questa sezione</Text>
                  </View>
                ) : (
                  <FlatList
                    data={sectionPosts}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.gridItem}
                        onLongPress={() => onPostLongPress(item)}
                        onPress={() => router.push({ pathname: "/edit-post", params: { id: item.id } })}
                      >
                        {item.type === "text" ? (
                          <View style={styles.textPostTile}>
                            <Text numberOfLines={5} style={styles.textPostTileText}>
                              {item.content}
                            </Text>
                          </View>
                        ) : (
                          <Image source={{ uri: item.mediaUri }} style={styles.gridImage} />
                        )}
                        {item.type === "video" && (
                          <Ionicons name="play" size={16} color="#fff" style={styles.playIcon} />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* Pulsante rotondo "+" per creare contenuti */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/create-post")} activeOpacity={0.85}>
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  username: { fontFamily: fonts.bold, fontWeight: "700", fontSize: 18, color: colors.text },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: colors.surface },
  statsRow: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statNumber: { fontFamily: fonts.bold, fontWeight: "700", fontSize: 17, color: colors.text },
  statLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  bioBlock: { paddingHorizontal: spacing.md, marginTop: spacing.sm },
  displayName: { fontFamily: fonts.semibold, fontWeight: "600", fontSize: 14, color: colors.text },
  bio: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, marginTop: 4, lineHeight: 18 },
  editRow: { paddingHorizontal: spacing.md, marginTop: spacing.md },
  editButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 8,
    alignItems: "center",
  },
  editButtonText: { fontFamily: fonts.semibold, fontWeight: "600", fontSize: 13, color: colors.text },
  tagsWrapper: { marginTop: spacing.md, marginBottom: spacing.sm },
  addTag: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    gap: 2,
  },
  addTagText: { fontFamily: fonts.medium, fontSize: 12, color: colors.text },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: spacing.xl * 2, gap: spacing.sm },
  emptyText: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  gridItem: { width: width / 3, height: width / 3, padding: 1 },
  gridImage: { width: "100%", height: "100%", backgroundColor: colors.surface },
  textPostTile: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    justifyContent: "center",
  },
  textPostTileText: { fontFamily: fonts.regular, fontSize: 11, color: colors.text },
  playIcon: { position: "absolute", top: 6, right: 6 },
  fab: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
