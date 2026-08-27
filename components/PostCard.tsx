import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface PostCardProps {
  authorName: string;
  authorAvatar: string;
  type: "text" | "image" | "video";
  content: string;
  mediaUri?: string;
  createdAt: number;
  likes: number;
  liked: boolean;
  comments: number;
  onLike?: () => void;
  onPress?: () => void;
  onLongPress?: () => void;
}

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "ora";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} g`;
}

export default function PostCard({
  authorName,
  authorAvatar,
  type,
  content,
  mediaUri,
  createdAt,
  likes,
  liked,
  comments,
  onLike,
  onPress,
  onLongPress,
}: PostCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress} onLongPress={onLongPress} style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: authorAvatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{authorName}</Text>
          <Text style={styles.time}>{timeAgo(createdAt)}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
      </View>

      {type !== "text" && mediaUri && (
        <Image source={{ uri: mediaUri }} style={styles.media} resizeMode="cover" />
      )}

      {!!content && (
        <Text style={[styles.content, type === "text" && styles.contentOnly]}>{content}</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={24} color={liked ? colors.danger : colors.text} />
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>
        <View style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={22} color={colors.text} />
          <Text style={styles.actionText}>{comments}</Text>
        </View>
        <View style={styles.actionBtn}>
          <Ionicons name="paper-plane-outline" size={22} color={colors.text} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  username: {
    fontFamily: fonts.semibold,
    fontWeight: "600",
    fontSize: 14,
    color: colors.text,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  media: {
    width: width,
    height: width,
    backgroundColor: colors.surface,
  },
  content: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    lineHeight: 20,
  },
  contentOnly: {
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
});
