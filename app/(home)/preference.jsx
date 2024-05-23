import { Filters } from "@/components/Filters";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Preference() {
  return (
    <>
      <View style={styles.container}>
        <Filters text="preference"></Filters>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FDE49E",
    alignItems: "center",
    padding: 20,
  },
});
