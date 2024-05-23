import BoardingList from "@/components/BoardingList";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Reserved() {
  return (
    <View style={styles.container}>
      <BoardingList />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE49E",
    width: "100%",
  },
});
