import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function LoadingItem() {
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.tinyLogo}
          source={require("@/assets/images/loadinglogo.png")}
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
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  logo: {
    width: 66,
    height: 58,
  },
});
