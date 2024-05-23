import useStore from "@/hooks/useStore";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
export default function Loading() {
  const updateProfile = useStore((state) => state.setUserProfile);
  const profiles = useStore((state) => state.userProfile);
  const { setUserPreference } = useStore();
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profileError) {
          Alert.alert(profileError.message);
          return;
        }
        updateProfile(profile);
        setUserPreference(profile.preference);
        if (profile.role === "tenant") {
          router.replace("(home)/protected/tenantscreen");
        } else {
          router.replace("(home)/protected/initialscreen");
        }
      } else {
        router.replace("auth/login");
      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.tinyLogo}
          source={require("@/assets/images/index.png")}
        />
        <ActivityIndicator size="large" color="#422F29" />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE49E",
    justifyContent: "center",
    alignItems: "center",
  },
  tinyLogo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  logo: {
    width: 66,
    height: 58,
  },
});
