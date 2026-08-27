import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "@/constants/theme";

interface SettingsRow {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  danger?: boolean;
}

const sections: { title: string; rows: SettingsRow[] }[] = [
  {
    title: "Account",
    rows: [
      { icon: "person-outline", label: "Informazioni personali" },
      { icon: "lock-closed-outline", label: "Privacy dell'account" },
      { icon: "shield-checkmark-outline", label: "Sicurezza" },
    ],
  },
  {
    title: "Contenuti",
    rows: [
      { icon: "archive-outline", label: "Post archiviati" },
      { icon: "bookmark-outline", label: "Salvati" },
      { icon: "notifications-outline", label: "Notifiche" },
    ],
  },
  {
    title: "Supporto",
    rows: [
      { icon: "help-circle-outline", label: "Centro assistenza" },
      { icon: "information-circle-outline", label: "Informazioni sull'app" },
    ],
  },
  {
    title: "",
    rows: [{ icon: "log-out-outline", label: "Esci", danger: true }],
  },
];

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {sections.map((section, i) => (
          <View key={i} style={{ marginTop: spacing.md }}>
            {!!section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
            <View style={styles.card}>
              {section.rows.map((row, j) => (
                <TouchableOpacity key={j} style={styles.row}>
                  <Ionicons name={row.icon} size={20} color={row.danger ? colors.danger : colors.text} />
                  <Text style={[styles.rowLabel, row.danger && { color: colors.danger }]}>{row.label}</Text>
                  {!row.danger && <Ionicons name="chevron-forward" size={18} color={colors.placeholder} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontWeight: "600",
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: "uppercase",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: 14,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
});
