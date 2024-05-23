import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { router } from "expo-router";
import BoardingList from "@/components/BoardingList";
import useStore from "@/hooks/useStore";
import LoadingItem from "@/components/loading";

const MyList = () => {
  const { getFavorites, isFavorite, favorites, userProfile } = useStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getFavorites(userProfile.id);
    setLoading(false);
  }, [userProfile, isFavorite]);
  if (loading) return <LoadingItem />;
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <BoardingList boarding={favorites} />
      </View>
    </View>
  );
};

export default MyList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE49E",
  },

  listContainer: {
    flex: 1, // Ensures the listContainer takes up the remaining space
  },
});
