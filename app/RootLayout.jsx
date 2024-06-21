import { useFonts } from "expo-font";
import { Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AppState, StyleSheet } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const navigation = useNavigation();

  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="(home)/(tabs)" options={{ headerShown: false }} /> */}
      <Stack.Screen name="+not-found" />

      <Stack.Screen
        name="auth/login"
        options={{
          title: "Login",
          headerStyle: { backgroundColor: "#FDE49E" },
          headerTitleStyle: { fontWeight: "bold", fontSize: 30 },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="auth/signup"
        options={{
          title: "Signup",
          headerStyle: { backgroundColor: "#FDE49E" },
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
const styles = StyleSheet.create({
  headerTitle: { color: "#422F29", fontWeight: "bold", fontSize: 30 },
});
