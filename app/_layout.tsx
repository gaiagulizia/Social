import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/context/AppContext";
import { colors } from "@/constants/theme";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="create-post"
            options={{ presentation: "modal", headerShown: true, title: "Nuovo post" }}
          />
          <Stack.Screen
            name="edit-section"
            options={{ presentation: "modal", headerShown: true, title: "Sezione" }}
          />
          <Stack.Screen
            name="settings"
            options={{ presentation: "card", headerShown: true, title: "Impostazioni" }}
          />
          <Stack.Screen
            name="edit-post"
            options={{ presentation: "modal", headerShown: true, title: "Modifica post" }}
          />
        </Stack>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
