import BoardingList from "@/components/BoardingList";
import useAdmin from "@/hooks/useAdmin";
import useStore from "@/hooks/useStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Button, Searchbar } from "react-native-paper";
import Toast from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refresh, setRefresh] = useState(false);

  const {
    loading,
    previewBoarding,
    getBoarding,
    userProfile,
    setPreviewBoarding,
    searchBoarding,
  } = useStore();
  const { getBoardingAdmin, pending } = useAdmin();

  useEffect(() => {
    const getPreview = async () => {
      if (userProfile.role === "admin") {
        const { transformedBoarding } = await getBoardingAdmin();
        setPreviewBoarding(transformedBoarding);
      } else {
        getBoarding(userProfile.id);
      }
    };
    getPreview();
  }, [userProfile, refresh]);
  const handleSearch = async () => {
    await searchBoarding(searchQuery);
    router.push(`searches/${searchQuery}`);
  };
  return (
    <View style={styles.container}>
      <Toast />
      {userProfile.role !== "owner" && (
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
      )}

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
          <ActivityIndicator size="large" />
        ) : (
          <BoardingList boarding={previewBoarding} />
        )}
      </View>
    </View>
  );
}
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
    padding: 10,
  },
});
