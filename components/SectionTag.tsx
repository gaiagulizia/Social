import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { fonts, radius, spacing } from "@/constants/theme";

interface SectionTagProps {
  label: string;
  bgColor: string;
  textColor: "#FFFFFF" | "#000000";
  active?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

export default function SectionTag({ label, bgColor, textColor, active = true, onPress, onLongPress }: SectionTagProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      style={[styles.tag, { backgroundColor: bgColor, opacity: active ? 1 : 0.5 }]}
    >
      <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },
  label: {
    fontFamily: fonts.semibold,
    fontWeight: "600",
    fontSize: 13,
  },
});
