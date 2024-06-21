import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { router, useNavigation } from "expo-router";
import BoardingList from "@/components/BoardingList";
import { supabase } from "@/utils/supabase";
import useStore from "@/hooks/useStore";
import Toast from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";
import LoadingItem from "@/components/loading";
import useAdmin from "@/hooks/useAdmin";

const Homepage = () => {
  const {
    getSuggestions,
    previewSuggestion,
    searchQuery,
    setSearchQuery,
    searchBoarding,
    userPreference,
    setPreviewBoarding,
    previewBoarding,
  } = useStore();
  const { getBoardingAdmin } = useAdmin();
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getPreview = async () => {
      setLoading(true);
      const { transformedBoarding } = await getBoardingAdmin(userPreference);
      setPreviewBoarding(transformedBoarding);
      setLoading(false);
    };
    getPreview();
  }, [userPreference, refresh]);

  const handleSearch = async () => {
    if (searchQuery && searchQuery !== "") {
      const encodedQuery = encodeURIComponent(searchQuery);
      const { searchResult } = await searchBoarding(searchQuery);
      router.push(`searches/${encodedQuery}`);
    }
  };

  return (
    <View style={styles.container}>
      <Toast />

      <View style={styles.searchContainer}>
        <Searchbar
          style={styles.searchInput}
          inputStyle={{
            minHeight: 0,
          }}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
        />
        <Button
          style={styles.searchBtn}
          textColor="#eee"
          onPress={handleSearch}
        >
          Search
        </Button>
      </View>

      <View style={styles.listContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingEnd: 40,
          }}
        >
          <Text style={styles.listHeader}>Boarding list</Text>
          <TouchableOpacity onPress={() => setRefresh((prev) => !prev)}>
            <FontAwesome name="refresh" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <LoadingItem />
        ) : (
          <BoardingList boarding={previewBoarding} />
        )}
      </View>
    </View>
  );
};

export default Homepage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE49E",
  },

  searchContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  searchInput: {
    width: "70%",
    margin: 10,
    height: 40,
    color: "#422F29",
  },
  searchBtn: {
    width: "30%",
    backgroundColor: "#422F29",
  },
  listContainer: {
    flex: 1, // Ensures the listContainer takes up the remaining space
  },
  listHeader: {
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 20,
    color: "#422F29",
  },
});
