import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const reservationRequests = [
  { id: "1", name: "John Doe", requestDate: "2024-05-01" },
  { id: "2", name: "Jane Smith", requestDate: "2024-05-02" },
  { id: "3", name: "Bob Johnson", requestDate: "2024-05-03" },
];

export default function ApproveUpload() {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.requestItem}
      onPress={() =>
        router.push({ pathname: `boardingscreen/${item.id}`, params: item })
      }
    >
      <Text style={styles.requestText}>
        {item.name} wants to upload a new property
      </Text>

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="check" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="times" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pending Uploads</Text>
      <FlatList
        data={reservationRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE49E",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 5,
    marginBottom: 8,
    borderRadius: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
    height: 45,
  },
  requestText: {
    fontSize: 13,
    flex: 1,
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
});
