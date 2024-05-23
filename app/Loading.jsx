import useStore from "@/hooks/useStore";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Text, View } from "react-native";

export default function Loading() {
  const updateProfile = useStore((state) => state.setUserProfile);
  const profiles = useStore((state) => state.userProfile);
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

        router.replace("(home)/tenantscreen");
      } else {
        router.replace("auth/login");
      }
    });
  }, []);
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
