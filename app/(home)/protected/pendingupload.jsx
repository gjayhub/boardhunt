import useAdmin from "@/hooks/useAdmin";
import useStore from "@/hooks/useStore";

import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Toast from "react-native-toast-message";

export default function PendingUpload() {
  const { getPendingUpload, pending, getPendingUploadAdmin, setPending } =
    useAdmin();
  const { userProfile } = useStore();

  useEffect(() => {
    const fetchPending = async () => {
      if (userProfile.role === "owner") {
        const { error } = await getPendingUpload(userProfile.id);
        if (error) {
          console.log(error);
        }
      } else {
        const { transformedData, error } = await getPendingUploadAdmin();
        setPending(transformedData);
        if (error) {
          console.log(error);
        }
      }
    };
    fetchPending();
  }, [userProfile, pending]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.requestItem}
      onPress={() =>
        router.push({
          pathname: `boardingscreen/${item.id}`,
          params: { id: item.id, ratings: item.ratings },
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.tinyImage}
          source={{
            uri: item.images[0],
          }}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.requestTitle}>{item.title}</Text>
        <Text style={styles.requestText} numberOfLines={2}>
          {item.details}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ zIndex: 100 }}>
        <Toast />
      </View>
      <Text style={styles.header}>Pending Uploads</Text>
      {pending.length === 0 ? (
        <View
          style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No pending upload</Text>
        </View>
      ) : (
        <FlatList
          data={pending}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
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
  imageContainer: {
    padding: 2,
  },
  tinyImage: {
    width: 50,
    height: 50,
  },
  image: {
    width: 66,
    height: 58,
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
    maxHeight: 60,
    width: "100%",
  },
  detailsContainer: {
    flex: 1,
  },
  requestText: {
    opacity: 0.5,
    fontSize: 12,
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
});
