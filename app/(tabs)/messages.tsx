import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { conversations } from "@/constants/mockData";
import { colors, fonts, spacing } from "@/constants/theme";

function timeAgo(timestamp: number) {
  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  return `${Math.floor(hours / 24)} g`;
}

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messaggi</Text>
        <Ionicons name="create-outline" size={24} color={colors.text} />
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row}>
            <Image source={{ uri: item.participantAvatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.participantName}</Text>
              <Text style={[styles.lastMessage, item.unread && styles.unread]} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 6 }}>
              <Text style={styles.time}>{timeAgo(item.lastMessageAt)}</Text>
              {item.unread && <View style={styles.dot} />}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: { fontFamily: fonts.bold, fontWeight: "700", fontSize: 22, color: colors.text },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface },
  name: { fontFamily: fonts.semibold, fontWeight: "600", fontSize: 15, color: colors.text },
  lastMessage: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  unread: { color: colors.text, fontWeight: "600" },
  time: { fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
});
