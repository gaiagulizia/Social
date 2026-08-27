import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PostCard from "@/components/PostCard";
import { feedPosts } from "@/constants/mockData";
import { colors, fonts, spacing } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>SocialApp</Text>
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={26} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(tabs)/messages")}>
            <Ionicons name="paper-plane-outline" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={feedPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostCard
            authorName={item.authorName}
            authorAvatar={item.authorAvatar}
            type={item.type}
            content={item.content}
            mediaUri={item.mediaUri}
            createdAt={item.createdAt}
            likes={item.likes}
            liked={item.liked}
            comments={item.comments}
          />
        )}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  logo: {
    fontFamily: fonts.bold,
    fontWeight: "700",
    fontSize: 22,
    color: colors.text,
  },
});
